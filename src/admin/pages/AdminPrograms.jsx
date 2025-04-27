import React, { useState, useEffect, useCallback, memo } from 'react';
import {
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  MenuItem,
  Box,
  Card,
  Alert,
  Snackbar,
} from '@mui/material';
import { Save, Add, Delete, Refresh } from '@mui/icons-material';
import { Formik, Form, FieldArray, FastField, useField } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import DOMPurify from 'dompurify';
import debounce from 'lodash/debounce';
import TextEditor from '../component/TextEditor';
import { theme } from '../../theme';
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

// Icon map for preview
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
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://youth-spark-backend-production.up.railway.app')
  .replace(/\/+$/, '')
  .trim();

// Validation schema
const validationSchema = Yup.object({
  programs: Yup.array().of(
    Yup.object({
      title: Yup.string()
        .required('Title is required')
        .max(255, 'Title must be 255 characters or less')
        .trim()
        .test('not-empty', 'Title cannot be empty', (value) => value?.trim().length > 0),
      description: Yup.string()
        .required('Description is required')
        .max(5000, 'Description must be 5000 characters or less')
        .trim()
        .test('not-empty', 'Description cannot be empty', (value) => value?.trim().length > 0),
      icon: Yup.string()
        .required('Icon is required')
        .test('not-empty', 'Icon cannot be empty', (value) => value?.trim().length > 0),
    })
  ),
});

// Icon options
const iconOptions = [
  { value: 'School', label: 'Education' },
  { value: 'Code', label: 'Digital Skills' },
  { value: 'BusinessCenter', label: 'Entrepreneurship' },
  { value: 'Work', label: 'Employability' },
  { value: 'Favorite', label: 'Mental Health' },
  { value: 'People', label: 'Community Engagement' },
  { value: 'Lightbulb', label: 'Innovation' },
  { value: 'Computer', label: 'Technology' },
  { value: 'Book', label: 'Learning' },
  { value: 'Build', label: 'Skill Building' },
  { value: 'GroupWork', label: 'Collaboration' },
  { value: 'MonetizationOn', label: 'Economic Empowerment' },
  { value: 'Psychology', label: 'Mental Health Support' },
  { value: 'LocalLibrary', label: 'Community Education' },
  { value: 'Laptop', label: 'Digital Tools' },
  { value: 'Star', label: 'Leadership' },
  { value: 'Handyman', label: 'Technical Skills' },
  { value: 'AccountBalance', label: 'Financial Education' },
  { value: 'SupportAgent', label: 'Mentorship' },
  { value: 'HealthAndSafety', label: 'Health and Well-being' },
  { value: 'RocketLaunch', label: 'Startups' },
  { value: 'Diversity3', label: 'Inclusion' },
  { value: 'Engineering', label: 'Engineering Skills' },
  { value: 'BarChart', label: 'Data Skills' },
  { value: 'VolunteerActivism', label: 'Volunteering' },
  { value: 'WorkspacePremium', label: 'Certifications' },
  { value: 'ConnectWithoutContact', label: 'Networking' },
  { value: 'LocalFlorist', label: 'Sustainability' },
  { value: 'TrendingUp', label: 'Career Growth' },
  { value: 'Celebration', label: 'Youth Events' },
];

// Memoized TextEditorField
const TextEditorField = memo(({ name, label, sx }) => {
  const [field, meta, helpers] = useField(name);
  const debouncedSetValue = useCallback(
    debounce((value) => {
      helpers.setValue(value);
    }, 600),
    [helpers]
  );

  return (
    <>
      <TextEditor
        label={label}
        value={field.value}
        onChange={debouncedSetValue}
        sx={sx}
      />
      {meta.touched && meta.error && (
        <Typography color="error" sx={{ mt: 1, fontSize: '0.9rem' }}>
          {meta.error}
        </Typography>
      )}
    </>
  );
});

// Memoized ProgramForm
const ProgramForm = memo(({ program, index, remove, touched, errors }) => (
  <Box
    sx={{
      mb: 2,
      p: 2,
      border: '1px solid #ddd',
      borderRadius: 2,
      bgcolor: '#fff',
    }}
  >
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <FastField name={`programs.${index}.title`}>
          {({ field }) => (
            <TextField
              label="Title"
              {...field}
              fullWidth
              error={touched.programs?.[index]?.title && !!errors.programs?.[index]?.title}
              helperText={touched.programs?.[index]?.title && errors.programs?.[index]?.title}
              sx={{ mb: 2 }}
            />
          )}
        </FastField>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FastField name={`programs.${index}.icon`}>
          {({ field }) => (
            <TextField
              select
              label="Icon"
              {...field}
              fullWidth
              error={touched.programs?.[index]?.icon && !!errors.programs?.[index]?.icon}
              helperText={touched.programs?.[index]?.icon && errors.programs?.[index]?.icon}
              sx={{ mb: 2 }}
            >
              {iconOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        </FastField>
      </Grid>
      <Grid item xs={12}>
        <FastField name={`programs.${index}.description`}>
          {() => (
            <TextEditorField
              name={`programs.${index}.description`}
              label="Description"
              sx={{ mb: 2 }}
            />
          )}
        </FastField>
      </Grid>
      <Grid item xs={12}>
        <IconButton
          onClick={() => remove(index)}
          color="error"
          aria-label={`Delete program ${program.title}`}
        >
          <Delete />
        </IconButton>
      </Grid>
    </Grid>
  </Box>
));

// Memoized PreviewCard
const PreviewCard = memo(({ program, isActive }) => (
  <Card
    sx={{
      width: '100%',
      maxWidth: 350,
      mt: 2,
      borderTop: '4px solid #ff3d46',
      borderBottom: '4px solid #4285F4',
      borderRadius: '12px',
      boxShadow: isActive
        ? '0 12px 28px rgba(0, 0, 0, 0.12)'
        : '0 8px 24px rgba(0, 0, 0, 0.08)',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 12px 28px rgba(0, 0, 0, 0.12)',
      },
      border: isActive ? '2px solid #ff3d46' : 'none',
    }}
  >
    <Box
      sx={{
        p: 3,
        background: 'linear-gradient(135deg, #ff3d4620, #ff3d4610)',
        textAlign: 'left',
      }}
    >
      <Box
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
        }}
      >
        {iconMap[program.icon] || <EducationIcon />}
      </Box>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 700,
          color: '#333',
          fontSize: { xs: '1.5rem', sm: '1.6rem' },
        }}
      >
        {DOMPurify.sanitize(program.title) || 'Untitled'}
      </Typography>
    </Box>
    <Box sx={{ p: 3, bgcolor: 'white' }}>
      <Typography
        variant="body1"
        sx={{
          color: '#555',
          fontSize: { xs: '0.95rem', sm: '1rem' },
          lineHeight: 1.7,
        }}
      >
        {DOMPurify.sanitize(program.description) || 'No description'}
      </Typography>
    </Box>
  </Card>
));

const AdminPrograms = () => {
  const [initialValues, setInitialValues] = useState({ programs: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const fetchPrograms = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/programs`, { timeout: 10000 });
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response from server');
      }
      setInitialValues({ programs: response.data });
    } catch (err) {
      console.error('Error fetching programs:', err);
      setError('Failed to load programs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to save changes.');
      setSubmitting(false);
      return;
    }
    setOpenDialog(true);
    setSubmitting(false);
  };

  const confirmSubmit = async (values) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await axios.put(`${API_BASE_URL}/api/programs`, values.programs, {
        timeout: 10000,
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setInitialValues(values);
      setSuccess('Programs updated successfully!');
      setOpenDialog(false);
    } catch (err) {
      console.error('Error saving programs:', err);
      const errorMessage = err.response?.data?.error || 'Failed to save changes. Please try again.';
      setError(errorMessage);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Session expired. Please log in again.');
        // Optionally redirect to login page
        // window.location.href = '/login';
      }
      setOpenDialog(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (setValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/programs`, { timeout: 10000 });
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response from server');
      }
      const values = { programs: response.data };
      setValues(values);
      setInitialValues(values);
    } catch (err) {
      console.error('Error resetting programs:', err);
      setError('Failed to reset programs. Please try again.');
    } finally {
      setIsLoading(false);
      setResetDialogOpen(false);
    }
  };

  const gradient = `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`;

  if (isLoading && !initialValues.programs.length) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress aria-label="Loading editor" />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography
        variant="h1"
        component="h1"
        gutterBottom
        sx={{
          mb: 4,
          fontSize: { xs: '2rem', md: '3rem' },
          background: gradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Programs Editor
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Snackbar
          open={!!success}
          autoHideDuration={6000}
          onClose={() => setSuccess(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="success" onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        </Snackbar>
      )}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 2 }}>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ values, setFieldValue, errors, touched, isSubmitting, setValues }) => (
                <Form aria-label="Programs editor form">
                  <FieldArray name="programs">
                    {({ push, remove }) => (
                      <>
                        {values.programs.map((program, index) => (
                          <ProgramForm
                            key={index}
                            program={program}
                            index={index}
                            remove={remove}
                            setFieldValue={setFieldValue}
                            touched={touched}
                            errors={errors}
                          />
                        ))}
                        <Button
                          variant="outlined"
                          startIcon={<Add />}
                          onClick={() => {
                            push({
                              title: '',
                              description: '',
                              icon: 'School',
                            });
                            setActiveIndex(values.programs.length);
                          }}
                          sx={{ mb: 3 }}
                        >
                          Add Program
                        </Button>
                      </>
                    )}
                  </FieldArray>
                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={<Save />}
                      disabled={isSubmitting || isLoading}
                      sx={{
                        background: gradient,
                        '&:hover': { transform: 'scale(1.05)' },
                      }}
                      aria-label="Save changes"
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Refresh />}
                      onClick={() => setResetDialogOpen(true)}
                      disabled={isSubmitting || isLoading}
                      sx={{
                        borderColor: theme.palette.border.main,
                        color: theme.palette.text.primary,
                      }}
                      aria-label="Reset form"
                    >
                      Reset
                    </Button>
                  </Box>
                  <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>Confirm Changes</DialogTitle>
                    <DialogContent>
                      <Typography>Are you sure you want to save these changes?</Typography>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setOpenDialog(false)} disabled={isLoading}>
                        Cancel
                      </Button>
                      <Button
                        onClick={() => confirmSubmit(values)}
                        color="primary"
                        disabled={isLoading}
                        autoFocus
                      >
                        {isLoading ? <CircularProgress size={24} /> : 'Save'}
                      </Button>
                    </DialogActions>
                  </Dialog>
                  <Dialog open={resetDialogOpen} onClose={() => setResetDialogOpen(false)}>
                    <DialogTitle>Confirm Reset</DialogTitle>
                    <DialogContent>
                      <Typography>
                        Are you sure you want to reset the form? This will discard unsaved changes and reload the saved content.
                      </Typography>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setResetDialogOpen(false)} disabled={isLoading}>
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleReset(setValues)}
                        color="primary"
                        disabled={isLoading}
                        autoFocus
                      >
                        {isLoading ? <CircularProgress size={24} /> : 'Reset'}
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Form>
              )}
            </Formik>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 2 }}>
            <Typography variant="h6" gutterBottom>
              Preview
            </Typography>
            {initialValues.programs.length === 0 ? (
              <Typography color="textSecondary">No programs to preview</Typography>
            ) : (
              <Grid container spacing={3} justifyContent="center">
                {initialValues.programs.map((program, index) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    key={index}
                    sx={{ display: 'flex', justifyContent: 'center' }}
                  >
                    <PreviewCard program={program} isActive={index === activeIndex} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default memo(AdminPrograms);