// D:\Exercise\JAVASCRIPT\REACT PROJECT\YOUTH_SPARK\youth_spark_app\src\pages\Home.jsx
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Container,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import EastIcon from '@mui/icons-material/East';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Link } from 'react-router-dom';
import { theme } from '../theme';

// Normalize API_BASE_URL
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000')
  .replace(/\/+$/, '')
  .trim();

// Default hero image path (served from Cloudinary)
const DEFAULT_HERO_IMAGE = 'https://res.cloudinary.com/your-cloud-name/image/upload/v1/youth_spark/default-hero.jpg';

// Custom SEO Component for React 19
const SEO = ({ title, description, ogTitle, ogDescription, ogImage, ogType = 'website' }) => {
  useEffect(() => {
    document.title = title;

    const metaTags = [
      { name: 'description', content: description },
      { property: 'og:title', content: ogTitle },
      { property: 'og:description', content: ogDescription },
      { property: 'og:image', content: ogImage },
      { property: 'og:type', content: ogType },
    ];

    metaTags.forEach(({ name, property, content }) => {
      let meta = name
        ? document.querySelector(`meta[name="${name}"]`)
        : document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        if (name) meta.setAttribute('name', name);
        if (property) meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    });

    return () => {
      metaTags.forEach(({ name, property }) => {
        const meta = name
          ? document.querySelector(`meta[name="${name}"]`)
          : document.querySelector(`meta[property="${property}"]`);
        if (meta && meta.getAttribute('data-react-seo') === 'true') {
          meta.remove();
        }
      });
    };
  }, [title, description, ogTitle, ogDescription, ogImage, ogType]);

  return null;
};

// Component to handle image with fallback
const ImageWithFallback = ({ src, alt, ...props }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [failedUrls, setFailedUrls] = useState(new Set());

  const handleError = useCallback(() => {
    if (!failedUrls.has(imgSrc)) {
      console.error('[Home] Hero image load failed:', imgSrc);
      setFailedUrls((prev) => new Set(prev).add(imgSrc));
      setImgSrc(DEFAULT_HERO_IMAGE);
    }
  }, [imgSrc, failedUrls]);

  useEffect(() => {
    if (src !== imgSrc && !failedUrls.has(src)) {
      setImgSrc(src);
    }
  }, [src, imgSrc, failedUrls]);

  return (
    <Box
      component="img"
      src={imgSrc}
      alt={alt}
      onError={handleError}
      loading="lazy"
      {...props}
    />
  );
};

const Home = () => {
  const [content, setContent] = useState({
    heroTitle: 'Youth Spark Foundation',
    heroSubtitle: 'Building a future where Tanzanian youth thrive...',
    heroImage: DEFAULT_HERO_IMAGE,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (retries = 3) => {
    setLoading(true);
    const url = `${API_BASE_URL}/api/home`.replace(/\/+/g, '/').replace(':/', '://');
    console.log('[Home] Fetching data from:', url);

    for (let i = 0; i < retries; i++) {
      try {
        const response = await axios.get(url, {
          timeout: 10000,
        });
        console.log('[Home] API response:', response.data);
        if (!response.data || Object.keys(response.data).length === 0) {
          throw new Error('No content returned from API');
        }
        setContent({
          heroTitle: response.data.title || 'Youth Spark Foundation',
          heroSubtitle: response.data.description || 'Building a future where Tanzanian youth thrive...',
          heroImage: response.data.image_url || DEFAULT_HERO_IMAGE,
        });
        setError(null);
        break;
      } catch (err) {
        console.error('[Home] Error fetching home content (attempt', i + 1, '):', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
        if (i === retries - 1) {
          setError(
            err.response?.data?.message ||
              'Failed to load content. Please check your connection and try again.'
          );
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading...</Typography>
      </Container>
    );
  }

  return (
    <>
      <SEO
        title="Home - Youth Spark Foundation"
        description="Welcome to Youth Spark Foundation, empowering Tanzanian youth through education and opportunities."
        ogTitle={content.heroTitle}
        ogDescription={content.heroSubtitle}
        ogImage={content.heroImage}
      />
      {error && (
        <Alert
          severity="error"
          sx={{ m: 2 }}
          action={
            <Button color="inherit" size="small" onClick={fetchData}>
              Retry
            </Button>
          }
        >
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
              <ImageWithFallback
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