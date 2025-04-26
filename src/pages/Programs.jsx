import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  Typography,
  Button,
  Box,
  Container,
  CircularProgress,
} from '@mui/material';
import {
  School as EducationIcon,
  Code as DigitalSkillsIcon,
  BusinessCenter as EntrepreneurshipIcon,
  Work as EmployabilityIcon,
  Favorite as MentalHealthIcon,
  People as PeopleIcon,
  Lightbulb as LightbulbIcon,
  Computer as ComputerIcon,
  Book as BookIcon,
  Build as BuildIcon,
  GroupWork as GroupWorkIcon,
  MonetizationOn as MonetizationOnIcon,
  Psychology as PsychologyIcon,
  LocalLibrary as LocalLibraryIcon,
  Laptop as LaptopIcon,
  Star as StarIcon,
  Handyman as HandymanIcon,
  AccountBalance as AccountBalanceIcon,
  SupportAgent as SupportAgentIcon,
  HealthAndSafety as HealthAndSafetyIcon,
  RocketLaunch as RocketLaunchIcon,
  Diversity3 as Diversity3Icon,
  Engineering as EngineeringIcon,
  BarChart as BarChartIcon,
  VolunteerActivism as VolunteerActivismIcon,
  WorkspacePremium as WorkspacePremiumIcon,
  ConnectWithoutContact as ConnectWithoutContactIcon,
  LocalFlorist as LocalFloristIcon,
  TrendingUp as TrendingUpIcon,
  Celebration as CelebrationIcon,
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

// Map icon names to MUI icons
const iconMap = {
  School: <EducationIcon />,
  Code: <DigitalSkillsIcon />,
  BusinessCenter: <EntrepreneurshipIcon />,
  Work: <EmployabilityIcon />,
  Favorite: <MentalHealthIcon />,
  People: <PeopleIcon />,
  Lightbulb: <LightbulbIcon />,
  Computer: <ComputerIcon />,
  Book: <BookIcon />,
  Build: <BuildIcon />,
  GroupWork: <GroupWorkIcon />,
  MonetizationOn: <MonetizationOnIcon />,
  Psychology: <PsychologyIcon />,
  LocalLibrary: <LocalLibraryIcon />,
  Laptop: <LaptopIcon />,
  Star: <StarIcon />,
  Handyman: <HandymanIcon />,
  AccountBalance: <AccountBalanceIcon />,
  SupportAgent: <SupportAgentIcon />,
  HealthAndSafety: <HealthAndSafetyIcon />,
  RocketLaunch: <RocketLaunchIcon />,
  Diversity3: <Diversity3Icon />,
  Engineering: <EngineeringIcon />,
  BarChart: <BarChartIcon />,
  VolunteerActivism: <VolunteerActivismIcon />,
  WorkspacePremium: <WorkspacePremiumIcon />,
  ConnectWithoutContact: <ConnectWithoutContactIcon />,
  LocalFlorist: <LocalFloristIcon />,
  TrendingUp: <TrendingUpIcon />,
  Celebration: <CelebrationIcon />,
};

// Ensure no trailing slash in API_BASE_URL
const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '');

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPrograms = async () => {
    if (!API_BASE_URL) {
      console.error('VITE_API_URL is not defined');
      setError('Application configuration error. Please contact support.');
      setIsLoading(false);
      return;
    }
    console.log('Fetching programs from:', `${API_BASE_URL}/api/programs`);
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/programs`, {
        timeout: 10000, // 10-second timeout
      });
      console.log('Fetch response:', response.data);
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response from server');
      }
      setPrograms(response.data);
    } catch (err) {
      console.error('Error fetching programs:', err.response?.data || err.message);
      setError('Failed to load programs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('API_BASE_URL:', API_BASE_URL);
    fetchPrograms();
  }, []);

  if (isLoading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress aria-label="Loading programs" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
        <Button
          variant="contained"
          onClick={fetchPrograms}
          aria-label="Retry loading programs"
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: { xs: 4, sm: 6, md: 8 },
        px: { xs: 2, sm: 3 },
        overflow: 'hidden',
      }}
    >
      <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 6 } }}>
        <Typography
          variant="h1"
          sx={{
            fontWeight: 800,
            color: '#ff3d46',
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            mb: 2,
            animation: `${fadeInDown} 0.8s ease-out forwards`,
            opacity: 0,
          }}
        >
          Our Programs
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: '#555',
            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
            maxWidth: '800px',
            mx: 'auto',
            animation: `${fadeInUp} 0.8s ease-out 0.2s forwards`,
            opacity: 0,
          }}
        >
          Empowering youth through education, digital literacy, and entrepreneurship
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 3, sm: 4, md: 5 }} justifyContent="center">
        {programs.map((program, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={program.id}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              ...(index >= 3 && {
                sm: { flexBasis: 'calc(33.33% - 32px)' },
              }),
            }}
          >
            <Card
              sx={{
                width: '100%',
                maxWidth: 350,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderTop: '4px solid #ff3d46',
                borderBottom: '4px solid #4285F4',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 28px rgba(0, 0, 0, 0.12)',
                  '& .icon-container': {
                    animation: `${pulse} 1s ease infinite`,
                  },
                },
              }}
            >
              <Box
                sx={{
                  p: { xs: 3, sm: 4 },
                  background: index % 2 === 0
                    ? 'linear-gradient(135deg, #4285F420, #4285F410)'
                    : 'linear-gradient(135deg, #ff3d4620, #ff3d4610)',
                  textAlign: 'left',
                }}
              >
                <Box
                  className="icon-container"
                  sx={{
                    color: '#ff3d46',
                    mb: 3,
                    width: 60,
                    height: 60,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '50%',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {iconMap[program.icon] || <EducationIcon />}
                </Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: '#333',
                    fontSize: { xs: '1.5rem', sm: '1.6rem', md: '1.7rem' },
                    lineHeight: 1.3,
                  }}
                >
                  {program.title}
                </Typography>
              </Box>
              <Box
                sx={{
                  p: { xs: 3, sm: 4 },
                  bgcolor: 'white',
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: '#555',
                    fontSize: { xs: '0.95rem', sm: '1rem', md: '1.05rem' },
                    lineHeight: 1.7,
                    mb: 2,
                  }}
                >
                  {program.description || 'No description'}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          textAlign: 'center',
          mt: { xs: 5, sm: 6, md: 8 },
          animation: `${fadeInUp} 0.8s ease-out 0.8s forwards`,
          opacity: 0,
        }}
      >
        <Button
          variant="contained"
          size="large"
          sx={{
            bgcolor: '#ff3d46',
            '&:hover': {
              bgcolor: '#e53935',
              transform: 'scale(1.05)',
            },
            px: { xs: 5, sm: 6 },
            py: { xs: 1.5, sm: 1.75 },
            fontSize: { xs: '1rem', sm: '1.1rem' },
            fontWeight: 700,
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(255, 61, 71, 0.3)',
            transition: 'all 0.3s ease',
            minWidth: 250,
          }}
        >
          Register for Our Programs
        </Button>
      </Box>
    </Container>
  );
};

export default Programs;