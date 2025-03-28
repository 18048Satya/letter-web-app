import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material';
import MonacoEditor from '@monaco-editor/react';
import axios from 'axios';

// Configure axios to include credentials
axios.defaults.withCredentials = true;

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [letter, setLetter] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const isNewLetter = id === 'new';
  const isDriveLetter = location.state?.isDriveLetter;

  useEffect(() => {
    if (isNewLetter) {
      setTitle('Untitled Letter');
      setContent('');
      setLoading(false);
    } else if (isDriveLetter) {
      setLetter(location.state.letter);
      setTitle(location.state.letter.title);
      setContent(location.state.letter.content);
      setLoading(false);
    } else {
      fetchLetter();
    }
  }, [id, isNewLetter, isDriveLetter]);

  const fetchLetter = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/letters/${id}`, {
        withCredentials: true
      });
      setLetter(response.data);
      setTitle(response.data.title);
      setContent(response.data.content);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching letter:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to fetch letter');
      }
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isNewLetter) {
        const response = await axios.post('http://localhost:5000/api/letters', {
          title,
          content
        }, {
          withCredentials: true
        });
        navigate(`/editor/${response.data._id}`);
      } else {
        await axios.put(`https://letter-web-app.onrender.com/api/letters/${id}`, {
          title,
          content
        }, {
          withCredentials: true
        });
      }
    } catch (error) {
      console.error('Error saving letter:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to save letter');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSaveToDrive = async () => {
    try {
      await axios.post(`http://localhost:5000/api/letters/${id}/save-to-drive`, {}, {
        withCredentials: true
      });
      alert('Letter saved to Google Drive successfully!');
    } catch (error) {
      console.error('Error saving to Google Drive:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to save to Google Drive');
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Box textAlign="center">
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Loading letter...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Box mt={4}>
          <Typography color="error">{error}</Typography>
          <Button variant="contained" onClick={() => navigate('/dashboard')} sx={{ mt: 2 }}>
            Back to Dashboard
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Box sx={{ height: '70vh', border: '1px solid #ccc', borderRadius: 1 }}>
            <MonacoEditor
              height="100%"
              defaultLanguage="markdown"
              value={content}
              onChange={setContent}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                lineNumbers: 'on',
                scrollBeyond: false
              }}
            />
          </Box>
          <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/dashboard')}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Editor; 
