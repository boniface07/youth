import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CircularProgress,
  useTheme,
  Avatar,
  Button,
} from '@mui/material';
import {
  EmojiEvents,
  Groups,
  Handshake,
  School,
  VolunteerActivism,
  Lightbulb,
  Work,
  Diversity3,
  Psychology,
  LocalFlorist,
  AccessibilityNew,
  LocalLibrary,
} from '@mui/icons-material';
import { keyframes } from '@emotion/react';
import axios from 'axios';

// Custom animations
const fadeInDown = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Icon map
const iconMap = {
  EmojiEvents: <EmojiEvents fontSize="large" />,
  Groups: <Groups fontSize="large" />,
  Handshake: <Handshake fontSize="large" />,
  School: <School fontSize="large" />,
  VolunteerActivism: <VolunteerActivism fontSize="large" />,
  Lightbulb: <Lightbulb fontSize="large" />,
  Work: <Work fontSize="large" />,
  Diversity3: <Diversity3 fontSize="large" />,
  Psychology: <Psychology fontSize="large" />,
  LocalFlorist: <LocalFlorist fontSize="large" />,
  AccessibilityNew: <AccessibilityNew fontSize="large" />,
  LocalLibrary: <LocalLibrary fontSize="large" />,
};

// Ensure no trailing slash in API_BASE_URL
const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '');

const Impact = () => {
  const theme = useTheme();
  const [data, setData] = useState({ stats: [], testimonials: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchImpactData = async () => {
    if (!API_BASE_URL) {
      console.error('VITE_API_URL is not defined');
      setError('Application configuration error. Please contact support.');
      setIsLoading(false);
      return;
    }
    console.log('Fetching impact data from:', `${API_BASE_URL}/api/impact`);
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/impact`, {
        timeout: 10000, // 10-second timeout
      });
      console.log('Fetch response:', response.data);
      if (!response.data || !Array.isArray(response.data.stats) || !Array.isArray(response.data.testimonials)) {
        throw new Error('Invalid response from server');
      }
      setData(response.data);
    } catch (err) {
      console.error('Error fetching impact data:', err.response?.data || err.message);
      setError('Failed to load impact data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('API_BASE_URL:', API_BASE_URL);
    fetchImpactData();
  }, []);

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6, textAlign: 'center' }}>
        <CircularProgress aria-label="Loading impact data" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 6, textAlign: 'center' }}>
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
        <Button
          variant="contained"
          onClick={fetchImpactData}
          aria-label="Retry loading impact data"
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        py: { xs: 6, sm: 8, md: 10 },
        background: 'linear-gradient(to bottom, #f9f9f9 0%, #ffffff 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -150,
          right: -150,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${theme.palette.primary.light}20 0%, transparent 70%)`,
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Impact Heading */}
        <Box sx={{ textAlign: 'center', mb: { xs: 6, sm: 8, md: 10 } }}>
          <Typography
            variant="h2"
            sx={{
              color: theme.palette.primary.main,
              mb: 2,
              animation: `${fadeInDown} 0.8s ease-out forwards`,
              opacity: 0,
            }}
          >
            Our Impact
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: 700,
              mx: 'auto',
              animation: `${fadeInUp} 0.8s ease-out 0.2s forwards`,
              opacity: 0,
            }}
          >
            Making a difference in the lives of Tanzanian youth
          </Typography>
        </Box>

        {/* Stats Section */}
        <Grid
          container
          spacing={{ xs: 4, sm: 5, md: 6 }}
          sx={{
            mb: { xs: 8, sm: 10, md: 12 },
            justifyContent: 'center',
          }}
        >
          {data.stats.map((stat, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              key={index}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                animation: `${fadeInUp} 0.6s ease-out ${index * 0.2 + 0.4}s forwards`,
                opacity: 0,
              }}
            >
              <Box
                sx={{
                  width: 70,
                  height: 70,
                  bgcolor: index % 2 === 0 ? 'rgba(255, 61, 71, 0.1)' : 'rgba(30, 64, 174, 0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  color: index % 2 === 0 ? '#ff3d46' : '#1e40ae',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                {iconMap[stat.icon] || <EmojiEvents fontSize="large" />}
              </Box>
              <Typography
                variant="h4"
                sx={{
                  color: index % 2 === 0 ? '#ff3d46' : '#1e40ae',
                  mb: 1,
                  lineHeight: 1.3,
                }}
              >
                {stat.value}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  color: theme.palette.text.secondary,
                  textAlign: 'center',
                }}
              >
                {stat.label}
              </Typography>
            </Grid>
          ))}
        </Grid>

        {/* Success Stories Heading */}
        <Box sx={{ textAlign: 'center', mb: { xs: 6, sm: 8, md: 10 } }}>
          <Typography
            variant="h2"
            sx={{
              color: '#ff3d46',
              mb: 2,
              animation: `${fadeInDown} 0.8s ease-out forwards`,
              opacity: 0,
            }}
          >
            Success Stories
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: 700,
              mx: 'auto',
              animation: `${fadeInUp} 0.8s ease-out 0.2s forwards`,
              opacity: 0,
            }}
          >
            Hear from the youth we’ve empowered
          </Typography>
        </Box>

        {/* Testimonials */}
        <Grid
          container
          spacing={{ xs: 3, sm: 4 }}
          sx={{
            justifyContent: 'center',
            alignItems: 'stretch',
          }}
        >
          {data.testimonials.map((testimonial, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={index}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                animation: `${fadeInUp} 0.8s ease-out ${index * 0.2 + 0.8}s forwards`,
                opacity: 0,
              }}
            >
              <Card
                sx={{
                  p: { xs: 2, sm: 3 },
                  maxHeight: { xs: '300px', sm: '320px' },
                  width: '100%',
                  maxWidth: { xs: '100%', sm: 340, md: 360 },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '12px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
                  borderBottom: `3px solid ${theme.palette.primary.main}`,
                  background: 'linear-gradient(135deg, #ffffff, #f9f9f9)',
                  transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                    '& .avatar': {
                      animation: `${pulse} 1s ease`,
                    },
                  },
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontStyle: 'italic',
                    lineHeight: 1.6,
                    pl: 3,
                    mb: 2,
                    position: 'relative',
                    color: theme.palette.text.secondary,
                    fontSize: { xs: '1rem', sm: '1.05rem' },
                    '&:before': {
                      content: '"\\201C"',
                      fontSize: '2.5rem',
                      fontFamily: '"Merriweather", "Georgia", serif',
                      color: '#ff3d46',
                      position: 'absolute',
                      left: -10,
                      top: -10,
                    },
                    '&:after': {
                      content: '"\\201D"',
                      fontSize: '2.5rem',
                      fontFamily: '"Merriweather", "Georgia", serif',
                      color: '#ff3d46',
                      position: 'absolute',
                      right: -10,
                      bottom: -20,
                    },
                  }}
                >
                  {testimonial.quote || 'No quote provided'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
                  <Avatar
                    src={testimonial.avatar || undefined} // Use undefined for no src to avoid broken image
                    alt={testimonial.name}
                    className="avatar"
                    sx={{
                      width: 48,
                      height: 48,
                      mr: 2,
                      border: `2px solid ${theme.palette.border?.main || '#e0e0e0'}`,
                      bgcolor: '#ff0000',
                    }}
                  />
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                        color: theme.palette.primary.main,
                      }}
                    >
                      {testimonial.name || 'Anonymous'}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.tertiary || theme.palette.text.secondary,
                        fontSize: { xs: '0.85rem', sm: '0.9rem' },
                      }}
                    >
                      {testimonial.program || 'Unknown Program'}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Impact;