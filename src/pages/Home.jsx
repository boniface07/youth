import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Button, Container, IconButton, Alert } from '@mui/material';
import EastIcon from '@mui/icons-material/East';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Link } from 'react-router-dom';
import { theme } from '../theme';

// Ensure no trailing slash in API_BASE_URL
const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:5000';

const Home = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Home: Fetching data from', `${API_BASE_URL}/api/home`);
        const response = await axios.get(`${API_BASE_URL}/api/home`, {
          withCredentials: true, // Add if using credentials
        });
        console.log('Home: API response', response.data);
        if (!response.data || Object.keys(response.data).length === 0) {
          throw new Error('No content returned from API');
        }
        setContent({
          heroTitle: response.data.title,
          heroSubtitle: response.data.description,
          heroImage: response.data.image_url,
        });
        setError(null);
      } catch (err) {
        console.error('Home: Error fetching home content:', err.message, err.response?.data);
        setError('Failed to load content. Please try again later.');
        setContent({
          heroTitle: 'Youth Spark Foundation',
          heroSubtitle: 'Building a future where Tanzanian youth thrive...',
          heroImage:
            'https://images.unsplash.com/photo-1521791055366-0d553872125f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', py: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!content) {
    return (
      <Container sx={{ textAlign: 'center', py: 4 }}>
        <Typography>No content available</Typography>
      </Container>
    );
  }

  return (
    <>
      <title>Home - Youth Spark Foundation</title>
      <meta
        name="description"
        content="Welcome to Youth Spark Foundation, empowering Tanzanian youth through education and opportunities."
      />
      <meta property="og:title" content={content.heroTitle} />
      <meta property="og:description" content={content.heroSubtitle} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={content.heroImage} />
      {error && (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      )}
      <Box
        component="section"
        className="hero"
        sx={{
          maxWidth: '1300px',
          margin: '0 auto',
          padding: { xs: '20px 10px', sm: '30px 20px', md: '40px 30px', lg: '64px 40px', xl: '80px 50px' },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          color: '#ffffff',
          borderRadius: { xs: '8px', md: '12px' },
          position: 'relative',
          overflow: 'hidden',
          minHeight: { xs: '80vh', md: '100vh' },
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              gap: { xs: '16px', sm: '24px', md: '48px', lg: '64px' },
              width: '100%',
            }}
          >
            <Box
              className="hero__text"
              sx={{
                padding: { xs: '10px', sm: '15px', md: '20px', lg: '24px' },
                animation: 'fadeInLeft 1s ease-out',
                textAlign: 'left',
                flex: { xs: '100%', md: 1 },
                maxWidth: { xs: '100%', md: '600px' },
              }}
            >
              <Typography
                variant="h1"
                className="hero__title"
                sx={{
                  lineHeight: 1.1,
                  marginBottom: { xs: '12px', sm: '16px', md: '20px', lg: '24px' },
                  textShadow: '2px 2px 10px rgba(0, 0, 0, 0.2)',
                }}
              >
                {content.heroTitle}
              </Typography>
              <Typography
                variant="subtitle1"
                className="hero__subtitle"
                sx={{
                  lineHeight: 1.6,
                  marginBottom: { xs: '16px', sm: '20px', md: '32px', lg: '48px' },
                  opacity: 0.9,
                }}
              >
                {content.heroSubtitle}
              </Typography>
              <Box
                className="hero__buttons"
                sx={{
                  display: 'flex',
                  gap: { xs: '10px', sm: '12px', md: '16px', lg: '24px' },
                  marginBottom: { xs: '16px', sm: '20px', md: '24px', lg: '48px' },
                }}
              >
                <Button
                  variant="contained"
                  endIcon={<EastIcon />}
                  sx={{
                    backgroundColor: theme.palette.text.tertiary,
                    color: '#ffffff',
                    padding: { xs: '6px 12px', sm: '8px 16px', md: '10px 20px', lg: '12px 24px' },
                    borderRadius: '0px',
                    fontSize: { xs: '0.875rem', sm: '0.9rem', md: '1rem' },
                    boxShadow: `0 5px 15px rgba(${theme.palette.text.tertiary}, 0.3)`,
                    '&:hover': {
                      backgroundColor: '#e6373f',
                      transform: 'translateY(-3px)',
                      boxShadow: `0 8px 20px rgba(${theme.palette.text.tertiary}, 0.4)`,
                    },
                  }}
                >
                  Register Now
                </Button>
                <Button
                  component={Link}
                  to="/about"
                  sx={{
                    backgroundColor: '#ffffff',
                    color: theme.palette.primary.main,
                    borderColor: '#ffffff',
                    padding: { xs: '6px 12px', sm: '8px 16px', md: '10px 20px', lg: '12px 24px' },
                    borderRadius: '0px',
                    fontSize: { xs: '0.875rem', sm: '0.9rem', md: '1rem' },
                    '&:hover': {
                      backgroundColor: theme.palette.primary.light,
                      borderColor: '#ffffff',
                      color: '#ffffff',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Learn More
                </Button>
              </Box>
            </Box>
            <Box
              className="hero__img"
              sx={{
                padding: { xs: '10px', sm: '15px', md: '20px', lg: '24px' },
                perspective: '1000px',
                animation: 'fadeInRight 1s ease-out 0.4s forwards',
                opacity: 0,
                textAlign: 'center',
                flex: { xs: '100%', md: 1 },
                maxWidth: { xs: '100%', md: '500px' },
              }}
            >
              <Box
                component="img"
                src={content.heroImage}
                alt="Youth Spark Programs"
                sx={{
                  width: '100%',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                  transform: 'rotateY(5deg)',
                  transition: 'all 0.5s ease-in-out',
                  '&:hover': {
                    transform: 'rotateY(0deg) scale(1.02)',
                    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.4)',
                  },
                }}
              />
            </Box>
          </Box>
          <IconButton
            component={Link}
            to="/about"
            sx={{
              position: 'absolute',
              bottom: { xs: '10px', sm: '20px', md: '40px' },
              left: '50%',
              transform: 'translateX(-50%)',
              color: '#ffffff',
              fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' },
              animation: 'bounce 2s infinite',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              padding: '8px',
              '&:hover': {
                color: theme.palette.primary.light,
                background: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            <ArrowDownwardIcon />
          </IconButton>
        </Container>
        <style>{`
          @keyframes fadeInLeft {
            0% { opacity: 0; transform: translateX(-20px); }
            100% { opacity: 1; transform: translateX(0); }
          }
          @keyframes fadeInRight {
            0% { opacity: 0; transform: translateX(20px); }
            100% { opacity: 1; transform: translateX(0); }
          }
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0) translateX(-50%); }
            40% { transform: translateY(-15px) translateX(-50%); }
            60% { transform: translateY(-7px) translateX(-50%); }
          }
        `}</style>
      </Box>
    </>
  );
};

export default Home;