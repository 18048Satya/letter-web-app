import React from 'react';
import { Container, Paper,AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

function Login({ setUser }) {
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };

  return (
    <>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Letter App
        </Typography>
        <Box>
            
            <Button  variant="contained"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}>
              Login
            </Button>
          </Box>
      </Toolbar>
    </AppBar>
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            Welcome to Letter App
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Sign in to create and manage your letters
          </Typography>
          <Button
            variant="contained"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            sx={{ mt: 2 }}
          >
            Sign in with Google
          </Button>
        </Paper>
      </Box>
    </Container>
    </>
  );
}

export default Login; 