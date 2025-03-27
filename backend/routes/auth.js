const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/User');

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/drive.file',
      'openid'
    ]
  })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      // Store tokens in user document
      const user = await User.findById(req.user._id);
      user.accessToken = req.user.accessToken;
      user.refreshToken = req.user.refreshToken;
      await user.save();

      // Redirect to frontend
      res.redirect(process.env.FRONTEND_URL || 'http://localhost:3000');
    } catch (error) {
      console.error('Error saving tokens:', error);
      res.redirect('/login');
    }
  }
);

// Get current user
router.get('/current-user', (req, res) => {
  if (req.user) {
    res.json({
      id: req.user._id,
      email: req.user.email,
      displayName: req.user.displayName
    });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  // Destroy session or remove token
  res.status(200).json({ message: "Logged out successfully" });
});


module.exports = router; 