import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { AccountCircle, Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';

// Configure axios to include credentials
axios.defaults.withCredentials = true;

// Components
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Editor from './components/Editor';
import DriveLetters from './components/DriveLetters';

// Create theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function AppContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get('https://letter-web-app.onrender.com/api/auth/current-user');
      setUser(response.data);
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('https://letter-web-app.onrender.com/api/auth/logout');
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <>
      {user && (
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Letter App
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button color="inherit" onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
              <Button 
                color="inherit" 
                startIcon={<AddIcon />}
                onClick={() => navigate('/editor/new')}
              >
                New Letter
              </Button>
              <IconButton color="inherit">
                <AccountCircle />
              </IconButton>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
      )}
      <Box sx={{ p: 3 }}>
        <Routes>
          <Route path="/login" element={!user ? <Login onLogin={checkAuth} /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/editor/:id" element={user ? <Editor /> : <Navigate to="/login" />} />
          <Route path="/drive-letters" element={user ? <DriveLetters /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </Box>
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App; 
