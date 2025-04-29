import { useState, useEffect, memo } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  useTheme,
  CircularProgress,
  Button,
} from '@mui/material';
import axios from 'axios';
import DOMPurify from 'dompurify';
import PropTypes from 'prop-types';

// Reusable Tab Panel Component
const TabPanel = ({ children, value, index, ...other }) => (
  <Box
    role="tabpanel"
    hidden={value !== index}
    id={`about-tabpanel-${index}`}
    aria-labelledby={`about-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </Box>
);

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

// Reusable Section Header Component
const SectionHeader = ({ title, gradient }) => (
  <Typography
    variant="h4"
    sx={{
      color: 'text.primary',
      mb: 3,
      display: 'flex',
      alignItems: 'center',
      '&::before': {
        content: '""',
        display: 'inline-block',
        width: 24,
        height: 3,
        background: gradient,
        mr: 2,
        borderRadius: 2,
      },
    }}
  >
    {title}
  </Typography>
);

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  gradient: PropTypes.string.isRequired,
};

// Ensure no trailing slash in API_BASE_URL
const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'https://youth-spark-backend-production.up.railway.app';

const About = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [aboutData, setAboutData] = useState({
    vision: '',
    mission: '',
    missionPoints: [],
    historyPoints: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAboutData = async () => {
    console.log('Fetching about data from:', `${API_BASE_URL}/api/about`);
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/about`, {
        timeout: 10000, // 10-second timeout
      });
      console.log('Fetch response:', response.data);
      if (!response.data) {
        throw new Error('Empty response from server');
      }
      setAboutData({
        vision: DOMPurify.sanitize(response.data.vision || ''),
        mission: DOMPurify.sanitize(response.data.mission || ''),
        missionPoints: Array.isArray(response.data.missionPoints)
          ? response.data.missionPoints.map((point) => DOMPurify.sanitize(point))
          : [],
        historyPoints: Array.isArray(response.data.historyPoints)
          ? response.data.historyPoints.map((point) => DOMPurify.sanitize(point))
          : [],
      });
    } catch (err) {
      console.error('Error fetching about data:', err.response?.data || err.message);
      setError('Failed to load content. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('API_BASE_URL:', API_BASE_URL);
    fetchAboutData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const gradient = `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`;

  return (
    <Box
      component="section"
      id="about"
      sx={{
        width: '100%',
        py: { xs: 6, sm: 8, md: 10 },
        px: { xs: 2, sm: 3 },
        background: theme.palette.background.default,
        position: 'relative',
        overflow: 'hidden',
        mt: 0,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -200,
          right: -200,
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${theme.palette.primary.light} 0%, transparent 70%)`,
          opacity: 0.1,
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 4,
            p: { xs: 3, sm: 4, md: 5 },
            boxShadow: 1,
            transition: 'all 0.3s ease',
          }}
        >
          {/* Header Section */}
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
            <Typography
              variant="h1"
              component="h1"
              sx={{
                mb: 2,
                color:`${theme.palette.primary.main}`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2rem', md: '3rem' },
              }}
            >
              Who We Are
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: 'text.secondary', maxWidth: 700, mx: 'auto' }}
            >
              Discover our mission, vision, and the inspiring journey of Youth Spark Foundation44444444
            </Typography>
          </Box>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            aria-label="About page tabs"
            sx={{
              mb: 5,
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0',
                background: gradient,
              },
              '& .MuiTab-root': {
                textTransform: 'none',
                py: 1.5,
                color: 'text.secondary',
                '&.Mui-selected': { color: 'primary.main' },
                '&:hover': { color: 'primary.dark', bgcolor: 'action.hover' },
              },
            }}
          >
            <Tab label="Vision & Mission" id="about-tab-0" aria-controls="about-tabpanel-0" />
            <Tab label="Our History" id="about-tab-1" aria-controls="about-tabpanel-1" />
          </Tabs>

          {/* Tab Content */}
          {isLoading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress aria-label="Loading content" />
            </Box>
          ) : error ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
              <Button
                variant="contained"
                onClick={fetchAboutData}
                aria-label="Retry loading content"
              >
                Retry
              </Button>
            </Box>
          ) : (
            <>
              <TabPanel value={activeTab} index={0}>
                {/* Vision */}
                <SectionHeader title="Our Vision" gradient={gradient} />
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.8, color: 'text.secondary', pl: { md: 4 }, mb: 4 }}
                  dangerouslySetInnerHTML={{ __html: aboutData.vision || 'No vision provided.' }}
                />

                {/* Mission */}
                <SectionHeader title="Our Mission" gradient={gradient} />
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.8, color: 'text.secondary', pl: { md: 4 }, mb: 4 }}
                  dangerouslySetInnerHTML={{ __html: aboutData.mission || 'No mission provided.' }}
                />

                {/* Mission Points */}
                <Typography
                  variant="h5"
                  sx={{
                    color: 'text.primary',
                    mb: 4,
                    textAlign: 'center',
                    '&::after': {
                      content: '""',
                      display: 'block',
                      width: 60,
                      height: 2,
                      background: gradient,
                      mx: 'auto',
                      mt: 2,
                    },
                  }}
                >
                  Key Focus Areas
                </Typography>
                {aboutData.missionPoints.length === 0 ? (
                  <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
                    No mission points available.
                  </Typography>
                ) : (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                      gap: 3,
                    }}
                  >
                    {aboutData.missionPoints.map((point, index) => (
                      <Box
                        key={index}
                        sx={{
                          p: 3,
                          bgcolor: 'background.default',
                          borderRadius: 2,
                          borderLeft: `4px solid ${theme.palette.primary.main}`,
                          '&:hover': {
                            transform: 'translateY(-3px)',
                            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                          },
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            color: 'text.primary',
                            display: 'flex',
                            alignItems: 'center',
                            '&::before': {
                              content: '""',
                              width: 8,
                              height: 8,
                              bgcolor: 'primary.main',
                              borderRadius: '50%',
                              mr: 2,
                            },
                          }}
                        >
                          {point}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </TabPanel>

              <TabPanel value={activeTab} index={1}>
                <Typography
                  variant="h2"
                  component="h2"
                  sx={{
                    color: 'text.primary',
                    mb: 5,
                    textAlign: 'center',
                    '&::after': {
                      content: '""',
                      display: 'block',
                      width: 80,
                      height: 3,
                      background: gradient,
                      mx: 'auto',
                      mt: 3,
                    },
                  }}
                >
                  Our Journey
                </Typography>
                {aboutData.historyPoints.length === 0 ? (
                  <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
                    No history points available.
                  </Typography>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {aboutData.historyPoints.map((point, index) => (
                      <Box
                        key={index}
                        sx={{
                          p: 3,
                          bgcolor: 'background.default',
                          borderRadius: 2,
                          '&:hover': {
                            transform: 'translateX(5px)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          },
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{ color: 'text.secondary', lineHeight: 1.8 }}
                        >
                          {point}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </TabPanel>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default memo(About);