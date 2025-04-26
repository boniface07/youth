// D:\Exercise\JAVASCRIPT\REACT PROJECT\YOUTH_SPARK\youth_spark_app\src\admin\pages\Login.jsx
import { useState } from 'react';
import { Box, TextField, Button, Typography, Container, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { theme } from '../../theme';

// Normalize API_BASE_URL to remove trailing slashes and prevent double slashes
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000')
  .replace(/\/+$/, '') // Remove one or more trailing slashes
  .trim();

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!API_BASE_URL) {
      console.error('VITE_API_URL is not defined');
      setError('Application configuration error. Please contact support.');
      return;
    }

    // Construct and normalize the login URL
    const loginUrl = `${API_BASE_URL}/api/login`.replace(/\/+/g, '/').replace(':/', '://');
    console.log('Normalized Login URL:', loginUrl);
    console.log('Attempting login with:', { username: credentials.username });

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(
        loginUrl,
        credentials,
        {
          timeout: 10000, // 10-second timeout
        }
      );
      console.log('Login response:', response.data);
      console.log('Login status:', response.status);

      if (response.status !== 200 || !response.data.token || !response.data.user) {
        throw new Error('Invalid response from server');
      }

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      window.dispatchEvent(new Event('loginSuccess'));
      console.log('Login successful, navigating to /admin');
      navigate('/admin');
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
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
          {isLoading && <CircularProgress size={24} sx={{ mb: 2 }} />}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Username"
              fullWidth
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              sx={{ mb: 2 }}
              disabled={isLoading}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              sx={{ mb: 2 }}
              disabled={isLoading}
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
              disabled={isLoading}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                '&:hover': { transform: 'scale(1.05)' },
              }}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
            {error && (
              <Button
                variant="outlined"
                fullWidth
                onClick={handleLogin}
                sx={{ mt: 2 }}
                disabled={isLoading}
                aria-label="Retry login"
              >
                Retry
              </Button>
            )}
          </form>
        </Box>
      </Container>
    </>
  );
};

export default Login;