import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  DriveFolderUpload as DriveIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { FaPlus, FaGoogleDrive } from 'react-icons/fa';

function Dashboard() {
  const [letters, setLetters] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLetters();
  }, []);

  const fetchLetters = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/letters`, {
        withCredentials: true
      });
      setLetters(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching letters:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this letter?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/letters/${id}`, {
          withCredentials: true
        });
        fetchLetters();
      } catch (error) {
        console.error('Error deleting letter:', error);
      }
    }
  };

  const handleSaveToDrive = async (id) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/letters/${id}/save-to-drive`, {}, {
        withCredentials: true
      });
      alert('Letter saved to Google Drive successfully!');
    } catch (error) {
      console.error('Error saving to Google Drive:', error);
      alert('Error saving to Google Drive');
    }
  };

  const handleEdit = (letter) => {
    setSelectedLetter(letter);
    setTitle(letter.title);
    setOpenDialog(true);
  };

  const handleUpdateTitle = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/letters/${selectedLetter._id}`,
        { title },
        { withCredentials: true }
      );
      setOpenDialog(false);
      fetchLetters();
    } catch (error) {
      console.error('Error updating letter title:', error);
    }
  };

  const handleCreateLetter = () => {
    navigate('/editor/new');
  };

  const handleLetterClick = (letter) => {
    navigate(`/editor/${letter._id}`);
  };

  const handleViewDriveLetters = () => {
    navigate('/drive-letters');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1">
          My Letters
        </Typography>
        <div className="flex gap-4">
          <button
            onClick={handleViewDriveLetters}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            <FaGoogleDrive className="mr-2" />
            View Drive Letters
          </button>
          <button
            onClick={handleCreateLetter}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <FaPlus className="mr-2" />
            New Letter
          </button>
        </div>
      </Box>

      <Grid container spacing={3}>
        {letters.map((letter) => (
          <Grid item xs={12} sm={6} md={4} key={letter._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {letter.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Last saved: {new Date(letter.lastSaved).toLocaleString()}
                </Typography>
              </CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                <IconButton onClick={() => handleEdit(letter)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleSaveToDrive(letter._id)}>
                  <DriveIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(letter._id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Letter Title</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateTitle} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Dashboard; 