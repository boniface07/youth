import { useState } from 'react';
import { Box, TextField, Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { theme } from '../../theme';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/login`, credentials);
      console.log('Login response:', response.data);
      console.log('Login status:', response.status);
      if (response.status !== 200) {
        throw new Error('Login failed. Please try again.');
      }

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      window.dispatchEvent(new Event('loginSuccess'));

      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <>
      <title>Admin Login - Youth Spark Foundation</title>
      <meta name="description" content="Login to the Youth Spark Foundation admin panel." />
      <Container maxWidth="xs" sx={{ mt: 10 }}>
        <Box
          sx={{
            p: 4,
            borderRadius: '12px',
            bgcolor: theme.palette.background.paper,
            boxShadow: `0 4px 12px rgba(0, 0, 0, 0.1)`,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              fontWeight: 700,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Admin Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Username"
              fullWidth
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              sx={{ mb: 2 }}
            />
            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                '&:hover': { transform: 'scale(1.05)' },
              }}
            >
              Login
            </Button>
          </form>
        </Box>
      </Container>
    </>
  );
};

export default Login;