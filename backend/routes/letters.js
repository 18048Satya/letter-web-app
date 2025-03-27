const express = require('express');
const router = express.Router();
const Letter = require('../models/Letter');
const { google } = require('googleapis');
const User = require('../models/User');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Not authenticated' });
};

// Get all letters for the current user
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const letters = await Letter.find({ author: req.user._id })
      .sort({ lastSaved: -1 });
    res.json(letters);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching letters' });
  }
});

// Get a single letter by ID
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const letter = await Letter.findOne({
      _id: req.params.id,
      author: req.user._id
    });

    if (!letter) {
      return res.status(404).json({ message: 'Letter not found' });
    }

    res.json(letter);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching letter' });
  }
});

// Create a new letter
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const letter = new Letter({
      title: req.body.title || 'Untitled Letter',
      content: req.body.content || '',
      author: req.user._id
    });
    await letter.save();
    res.status(201).json(letter);
  } catch (error) {
    res.status(500).json({ message: 'Error creating letter' });
  }
});

// Update a letter
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const letter = await Letter.findOne({
      _id: req.params.id,
      author: req.user._id
    });

    if (!letter) {
      return res.status(404).json({ message: 'Letter not found' });
    }

    letter.title = req.body.title || letter.title;
    letter.content = req.body.content || letter.content;
    letter.isDraft = req.body.isDraft !== undefined ? req.body.isDraft : letter.isDraft;

    await letter.save();
    res.json(letter);
  } catch (error) {
    res.status(500).json({ message: 'Error updating letter' });
  }
});

// Delete a letter
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const letter = await Letter.findOneAndDelete({
      _id: req.params.id,
      author: req.user._id
    });

    if (!letter) {
      return res.status(404).json({ message: 'Letter not found' });
    }

    res.json({ message: 'Letter deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting letter' });
  }
});

// Save letter to Google Drive
router.post('/:id/save-to-drive', isAuthenticated, async (req, res) => {
  try {
    const letter = await Letter.findOne({
      _id: req.params.id,
      author: req.user._id
    });

    if (!letter) {
      return res.status(404).json({ message: 'Letter not found' });
    }

    const user = await User.findById(req.user._id);
    if (!user.accessToken) {
      return res.status(401).json({ message: 'Google Drive access not authorized' });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      access_token: user.accessToken,
      refresh_token: user.refreshToken
    });

    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    const docs = google.docs({ version: 'v1', auth: oauth2Client });

    // Create a new Google Doc
    const doc = await drive.files.create({
      requestBody: {
        name: letter.title,
        mimeType: 'application/vnd.google-apps.document'
      }
    });

    // Update the content of the Google Doc
    await docs.documents.batchUpdate({
      documentId: doc.data.id,
      requestBody: {
        requests: [{
          insertText: {
            location: {
              index: 1
            },
            text: letter.content
          }
        }]
      }
    });

    res.json({ message: 'Letter saved to Google Drive successfully', docId: doc.data.id });
  } catch (error) {
    console.error('Error saving to Google Drive:', error);
    res.status(500).json({ message: 'Error saving to Google Drive', error: error.message });
  }
});

// Get letters from Google Drive
router.get('/drive/letters', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.accessToken) {
      return res.status(401).json({ message: 'Google Drive access not authorized' });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      access_token: user.accessToken,
      refresh_token: user.refreshToken
    });

    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    const docs = google.docs({ version: 'v1', auth: oauth2Client });

    // Search for Google Docs files
    const response = await drive.files.list({
      q: "mimeType='application/vnd.google-apps.document'",
      fields: 'files(id, name, modifiedTime)',
      orderBy: 'modifiedTime desc'
    });

    // Get content for each document
    const letters = await Promise.all(response.data.files.map(async (file) => {
      const doc = await docs.documents.get({
        documentId: file.id
      });
      
      // Extract text content from the document
      const content = doc.data.body.content
        .map(item => item.paragraph?.elements?.[0]?.textRun?.content || '')
        .join('');

      return {
        id: file.id,
        title: file.name,
        content: content,
        lastModified: file.modifiedTime,
        isDriveLetter: true
      };
    }));

    res.json(letters);
  } catch (error) {
    console.error('Error fetching Drive letters:', error);
    res.status(500).json({ message: 'Error fetching Drive letters', error: error.message });
  }
});

module.exports = router; 