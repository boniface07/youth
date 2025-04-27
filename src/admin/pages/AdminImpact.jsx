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
import {
  Save,
  Add,
  Delete,
  Refresh,
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
import { Formik, Form, FieldArray, FastField, useField } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import DOMPurify from 'dompurify';
import debounce from 'lodash/debounce';
import TextEditor from '../component/TextEditor';
import { theme } from '../../theme';

// Icon map for stats
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

// Icon options for stats dropdown
const iconOptions = [
  { value: 'EmojiEvents', label: 'Achievements' },
  { value: 'Groups', label: 'Communities' },
  { value: 'Handshake', label: 'Partners' },
  { value: 'School', label: 'Education' },
  { value: 'VolunteerActivism', label: 'Volunteering' },
  { value: 'Lightbulb', label: 'Innovation' },
  { value: 'Work', label: 'Employment' },
  { value: 'Diversity3', label: 'Diversity' },
  { value: 'Psychology', label: 'Empowerment' },
  { value: 'LocalFlorist', label: 'Sustainability' },
  { value: 'AccessibilityNew', label: 'Accessibility' },
  { value: 'LocalLibrary', label: 'Literacy' },
];

// Ensure no trailing slash in API_BASE_URL
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://youth-spark-backend-production.up.railway.app')
  .replace(/\/+$/, '')
  .trim();

// Validation schema
const validationSchema = Yup.object({
  stats: Yup.array().of(
    Yup.object({
      value: Yup.string()
        .required('Value is required')
        .max(50, 'Value must be 50 characters or less')
        .trim()
        .test('not-empty', 'Value cannot be empty', (value) => value?.trim().length > 0),
      label: Yup.string()
        .required('Label is required')
        .max(100, 'Label must be 100 characters or less')
        .trim()
        .test('not-empty', 'Label cannot be empty', (value) => value?.trim().length > 0),
      icon: Yup.string()
        .required('Icon is required')
        .test('not-empty', 'Icon cannot be empty', (value) => value?.trim().length > 0),
    })
  ),
  testimonials: Yup.array().of(
    Yup.object({
      quote: Yup.string()
        .required('Quote is required')
        .max(5000, 'Quote must be 5000 characters or less')
        .trim()
        .test('not-empty', 'Quote cannot be empty', (value) => value?.trim().length > 0),
      name: Yup.string()
        .required('Name is required')
        .max(100, 'Name must be 100 characters or less')
        .trim()
        .test('not-empty', 'Name cannot be empty', (value) => value?.trim().length > 0),
      program: Yup.string()
        .required('Program is required')
        .max(100, 'Program must be 100 characters or less')
        .trim()
        .test('not-empty', 'Program cannot be empty', (value) => value?.trim().length > 0),
    })
  ),
});

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

// Memoized StatForm
const StatForm = memo(({ stat, index, remove, touched, errors }) => (
  <Box sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 2, bgcolor: '#fff' }}>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <FastField name={`stats.${index}.value`}>
          {({ field }) => (
            <TextField
              label="Value"
              {...field}
              fullWidth
              error={touched.stats?.[index]?.value && !!errors.stats?.[index]?.value}
              helperText={touched.stats?.[index]?.value && errors.stats?.[index]?.value}
              sx={{ mb: 2 }}
            />
          )}
        </FastField>
      </Grid>
      <Grid item xs={12} sm={4}>
        <FastField name={`stats.${index}.label`}>
          {({ field }) => (
            <TextField
              label="Label"
              {...field}
              fullWidth
              error={touched.stats?.[index]?.label && !!errors.stats?.[index]?.label}
              helperText={touched.stats?.[index]?.label && errors.stats?.[index]?.label}
              sx={{ mb: 2 }}
            />
          )}
        </FastField>
      </Grid>
      <Grid item xs={12} sm={4}>
        <FastField name={`stats.${index}.icon`}>
          {({ field }) => (
            <TextField
              select
              label="Icon"
              {...field}
              fullWidth
              error={touched.stats?.[index]?.icon && !!errors.stats?.[index]?.icon}
              helperText={touched.stats?.[index]?.icon && errors.stats?.[index]?.icon}
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
        <IconButton
          onClick={() => remove(index)}
          color="error"
          aria-label={`Delete stat ${stat.label}`}
        >
          <Delete />
        </IconButton>
      </Grid>
    </Grid>
  </Box>
));

// Memoized TestimonialForm
const TestimonialForm = memo(({ testimonial, index, remove, touched, errors }) => (
  <Box sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 2, bgcolor: '#fff' }}>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <FastField name={`testimonials.${index}.name`}>
          {({ field }) => (
            <TextField
              label="Name"
              {...field}
              fullWidth
              error={touched.testimonials?.[index]?.name && !!errors.testimonials?.[index]?.name}
              helperText={touched.testimonials?.[index]?.name && errors.testimonials?.[index]?.name}
              sx={{ mb: 2 }}
            />
          )}
        </FastField>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FastField name={`testimonials.${index}.program`}>
          {({ field }) => (
            <TextField
              label="Program"
              {...field}
              fullWidth
              error={touched.testimonials?.[index]?.program && !!errors.testimonials?.[index]?.program}
              helperText={touched.testimonials?.[index]?.program && errors.testimonials?.[index]?.program}
              sx={{ mb: 2 }}
            />
          )}
        </FastField>
      </Grid>
      <Grid item xs={12}>
        <FastField name={`testimonials.${index}.quote`}>
          {() => (
            <TextEditorField
              name={`testimonials.${index}.quote`}
              label="Quote"
              sx={{ mb: 2 }}
            />
          )}
        </FastField>
      </Grid>
      <Grid item xs={12}>
        <IconButton
          onClick={() => remove(index)}
          color="error"
          aria-label={`Delete testimonial ${testimonial.name}`}
        >
          <Delete />
        </IconButton>
      </Grid>
    </Grid>
  </Box>
));

// Memoized StatPreview
const StatPreview = memo(({ stat, index }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
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
      }}
    >
      {iconMap[stat.icon] || <EmojiEvents fontSize="large" />}
    </Box>
    <Typography variant="h4" sx={{ color: index % 2 === 0 ? '#ff3d46' : '#1e40ae', mb: 1 }}>
      {DOMPurify.sanitize(stat.value) || 'N/A'}
    </Typography>
    <Typography variant="subtitle1" sx={{ color: '#555', textAlign: 'center' }}>
      {DOMPurify.sanitize(stat.label) || 'No label'}
    </Typography>
  </Box>
));

// Memoized TestimonialPreview
const TestimonialPreview = memo(({ testimonial, isActive }) => (
  <Card
    sx={{
      p: 3,
      maxWidth: 360,
      width: '100%',
      borderRadius: '12px',
      boxShadow: isActive
        ? '0 8px 20px rgba(0, 0, 0, 0.1)'
        : '0 4px 16px rgba(0, 0, 0, 0.06)',
      borderBottom: '3px solid #ff3d46',
      background: 'linear-gradient(135deg, #ffffff, #f9f9f9)',
      transition: 'all 0.4s ease',
      border: isActive ? '2px solid #ff3d46' : 'none',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
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
        color: '#555',
        '&:before': {
          content: '"\\201C"',
          fontSize: '2.5rem',
          color: '#ff3d46',
          position: 'absolute',
          left: -10,
          top: -10,
        },
        '&:after': {
          content: '"\\201D"',
          fontSize: '2.5rem',
          color: '#ff3d46',
          position: 'absolute',
          right: -10,
          bottom: -20,
        },
      }}
    >
      {DOMPurify.sanitize(testimonial.quote) || 'No quote'}
    </Typography>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#ff3d46' }}>
          {DOMPurify.sanitize(testimonial.name) || 'Anonymous'}
        </Typography>
        <Typography variant="body2" sx={{ color: '#777' }}>
          {DOMPurify.sanitize(testimonial.program) || 'No program'}
        </Typography>
      </Box>
    </Box>
  </Card>
));

const AdminImpact = () => {
  const [initialValues, setInitialValues] = useState({ stats: [], testimonials: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);

  const fetchImpactData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Fetching impact data from:', `${API_BASE_URL}/api/impact`);
      const response = await axios.get(`${API_BASE_URL}/api/impact`, { timeout: 10000 });
      console.log('Raw response.data:', response.data);
      if (
        !response.data ||
        !Array.isArray(response.data.stats) ||
        !Array.isArray(response.data.testimonials)
      ) {
        console.error('Expected object with stats and testimonials arrays, received:', response.data);
        throw new Error('Invalid response format: Expected object with stats and testimonials arrays');
      }
      setInitialValues({
        stats: response.data.stats,
        testimonials: response.data.testimonials,
      });
    } catch (err) {
      console.error('Error fetching impact data:', err.message, err.response?.data);
      setError(
        err.response?.data?.error ||
        'Failed to load impact data. Please check the API endpoint and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImpactData();
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
      console.log('Saving impact data:', values);
      await axios.put(`${API_BASE_URL}/api/impact`, values, {
        timeout: 10000,
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setInitialValues(values);
      setSuccess('Impact data updated successfully!');
      setOpenDialog(false);
    } catch (err) {
      console.error('Error saving impact data:', err.message, err.response?.data);
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
      console.log('Resetting impact data from:', `${API_BASE_URL}/api/impact`);
      const response = await axios.get(`${API_BASE_URL}/api/impact`, { timeout: 10000 });
      console.log('Reset response.data:', response.data);
      if (
        !response.data ||
        !Array.isArray(response.data.stats) ||
        !Array.isArray(response.data.testimonials)
      ) {
        console.error('Expected object with stats and testimonials arrays, received:', response.data);
        throw new Error('Invalid response format: Expected object with stats and testimonials arrays');
      }
      const values = {
        stats: response.data.stats,
        testimonials: response.data.testimonials,
      };
      setValues(values);
      setInitialValues(values);
    } catch (err) {
      console.error('Error resetting impact data:', err.message, err.response?.data);
      setError('Failed to reset impact data. Please try again.');
    } finally {
      setIsLoading(false);
      setResetDialogOpen(false);
    }
  };

  const gradient = `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`;

  if (isLoading && !initialValues.stats.length && !initialValues.testimonials.length) {
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
        Impact Editor
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
              {({ values, errors, touched, isSubmitting, setValues }) => (
                <Form aria-label="Impact editor form">
                  {/* Stats Section */}
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Stats
                  </Typography>
                  <FieldArray name="stats">
                    {({ push, remove }) => (
                      <>
                        {values.stats.map((stat, index) => (
                          <StatForm
                            key={index}
                            stat={stat}
                            index={index}
                            remove={remove}
                            touched={touched}
                            errors={errors}
                          />
                        ))}
                        <Button
                          variant="outlined"
                          startIcon={<Add />}
                          onClick={() => push({ value: '', label: '', icon: 'EmojiEvents' })}
                          sx={{ mb: 3 }}
                        >
                          Add Stat
                        </Button>
                      </>
                    )}
                  </FieldArray>

                  {/* Testimonials Section */}
                  <Typography variant="h6" sx={{ mb: 2, mt: 4 }}>
                    Testimonials
                  </Typography>
                  <FieldArray name="testimonials">
                    {({ push, remove }) => (
                      <>
                        {values.testimonials.map((testimonial, index) => (
                          <TestimonialForm
                            key={index}
                            testimonial={testimonial}
                            index={index}
                            remove={remove}
                            touched={touched}
                            errors={errors}
                          />
                        ))}
                        <Button
                          variant="outlined"
                          startIcon={<Add />}
                          onClick={() => {
                            push({
                              quote: '',
                              name: '',
                              program: '',
                            });
                            setActiveTestimonialIndex(values.testimonials.length);
                          }}
                          sx={{ mb: 3 }}
                        >
                          Add Testimonial
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
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Stats
              </Typography>
              {initialValues.stats.length === 0 ? (
                <Typography color="textSecondary">No stats to preview</Typography>
              ) : (
                <Grid container spacing={2}>
                  {initialValues.stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <StatPreview stat={stat} index={index} />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
            <Box>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Testimonials
              </Typography>
              {initialValues.testimonials.length === 0 ? (
                <Typography color="textSecondary">No testimonials to preview</Typography>
              ) : (
                <Grid container spacing={3} justifyContent="center">
                  {initialValues.testimonials.map((testimonial, index) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      key={index}
                      sx={{ display: 'flex', justifyContent: 'center' }}
                    >
                      <TestimonialPreview
                        testimonial={testimonial}
                        isActive={index === activeTestimonialIndex}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default memo(AdminImpact);