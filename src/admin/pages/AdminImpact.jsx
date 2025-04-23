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
} from '@mui/material';
import {
  Save,
  Add,
  Delete,
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
import debounce from 'lodash/debounce';
import TextEditor from '../component/TextEditor';

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

// Validation schema
const validationSchema = Yup.object({
  stats: Yup.array().of(
    Yup.object({
      value: Yup.string().required('Value is required').max(50, 'Value must be 50 characters or less'),
      label: Yup.string().required('Label is required').max(100, 'Label must be 100 characters or less'),
      icon: Yup.string().required('Icon is required'),
    })
  ),
  testimonials: Yup.array().of(
    Yup.object({
      quote: Yup.string().required('Quote is required').max(5000, 'Quote must be 5000 characters or less'),
      name: Yup.string().required('Name is required').max(100, 'Name must be 100 characters or less'),
      program: Yup.string().required('Program is required').max(100, 'Program must be 100 characters or less'),
    })
  ),
});

// Strip HTML for preview and initialization
const stripHtml = (html) => {
  try {
    const div = document.createElement('div');
    div.innerHTML = html || '';
    return div.textContent || div.innerText || '';
  } catch {
    return html || '';
  }
};

// Memoized TextEditorField
const TextEditorField = memo(({ name, label, sx, isActive }) => {
  const [field, meta, helpers] = useField(name);
  const debouncedSetValue = useCallback(
    debounce((value) => {
      helpers.setValue(value);
    }, 600),
    [helpers]
  );

  return (
    <>
      {isActive ? (
        <TextEditor
          label={label}
          value={field.value}
          onChange={debouncedSetValue}
          sx={sx}
        />
      ) : (
        <TextField
          label={label}
          value={stripHtml(field.value)}
          disabled
          fullWidth
          multiline
          rows={4}
          sx={sx}
        />
      )}
      {meta.touched && meta.error && (
        <Typography color="error" sx={{ mt: 1 }}>
          {meta.error}
        </Typography>
      )}
    </>
  );
});

// Memoized StatForm
const StatForm = memo(({ stat, index, remove, setFieldValue, touched, errors }) => (
  <Box sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <TextField
          label="Value"
          value={stat.value}
          onChange={(e) => setFieldValue(`stats.${index}.value`, e.target.value)}
          fullWidth
          error={touched.stats?.[index]?.value && !!errors.stats?.[index]?.value}
          helperText={touched.stats?.[index]?.value && errors.stats?.[index]?.value}
          sx={{ mb: 2 }}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          label="Label"
          value={stat.label}
          onChange={(e) => setFieldValue(`stats.${index}.label`, e.target.value)}
          fullWidth
          error={touched.stats?.[index]?.label && !!errors.stats?.[index]?.label}
          helperText={touched.stats?.[index]?.label && errors.stats?.[index]?.label}
          sx={{ mb: 2 }}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          select
          label="Icon"
          value={stat.icon}
          onChange={(e) => setFieldValue(`stats.${index}.icon`, e.target.value)}
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
const TestimonialForm = memo(({ testimonial, index, remove, setFieldValue, touched, errors, setActiveIndex, activeIndex }) => (
  <Box
    sx={{
      mb: 2,
      p: 2,
      border: '1px solid #ddd',
      borderRadius: 2,
      bgcolor: activeIndex === index ? '#f5f5f5' : '#fff',
      cursor: 'pointer',
    }}
    onClick={() => setActiveIndex(index)}
  >
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Name"
          value={testimonial.name}
          onChange={(e) => setFieldValue(`testimonials.${index}.name`, e.target.value)}
          fullWidth
          error={touched.testimonials?.[index]?.name && !!errors.testimonials?.[index]?.name}
          helperText={touched.testimonials?.[index]?.name && errors.testimonials?.[index]?.name}
          sx={{ mb: 2 }}
          disabled={activeIndex !== index}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Program"
          value={testimonial.program}
          onChange={(e) => setFieldValue(`testimonials.${index}.program`, e.target.value)}
          fullWidth
          error={touched.testimonials?.[index]?.program && !!errors.testimonials?.[index]?.program}
          helperText={touched.testimonials?.[index]?.program && errors.testimonials?.[index]?.program}
          sx={{ mb: 2 }}
          disabled={activeIndex !== index}
        />
      </Grid>
      <Grid item xs={12}>
        <FastField name={`testimonials.${index}.quote`} shouldUpdate={() => activeIndex === index}>
          {() => (
            <TextEditorField
              name={`testimonials.${index}.quote`}
              label="Quote"
              sx={{ mb: 2 }}
              isActive={activeIndex === index}
            />
          )}
        </FastField>
      </Grid>
      <Grid item xs={12}>
        <IconButton
          onClick={() => remove(index)}
          color="error"
          aria-label={`Delete testimonial ${testimonial.name}`}
          disabled={activeIndex !== index}
        >
          <Delete />
        </IconButton>
      </Grid>
    </Grid>
  </Box>
));

// Memoized StatPreview
const StatPreview = memo(({ stat }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
    <Box
      sx={{
        width: 70,
        height: 70,
        bgcolor: 'rgba(255, 61, 71, 0.1)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 2,
        color: '#ff3d46',
      }}
    >
      {iconMap[stat.icon] || <EmojiEvents fontSize="large" />}
    </Box>
    <Typography variant="h4" sx={{ color: '#ff3d46', mb: 1 }}>
      {stat.value || 'N/A'}
    </Typography>
    <Typography variant="subtitle1" sx={{ color: '#555', textAlign: 'center' }}>
      {stat.label || 'No label'}
    </Typography>
  </Box>
));

// Memoized TestimonialPreview
const TestimonialPreview = memo(({ testimonial }) => (
  <Card
    sx={{
      p: 3,
      maxWidth: 360,
      width: '100%',
      borderRadius: '12px',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
      borderBottom: '3px solid #ff3d46',
      background: 'linear-gradient(135deg, #ffffff, #f9f9f9)',
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
      {stripHtml(testimonial.quote) || 'No quote'}
    </Typography>
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#ff3d46' }}>
        {testimonial.name || 'Anonymous'}
      </Typography>
      <Typography variant="body2" sx={{ color: '#777' }}>
        {testimonial.program || 'No program'}
      </Typography>
    </Box>
  </Card>
));

const AdminImpact = () => {
  const [initialValues, setInitialValues] = useState({ stats: [], testimonials: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);

  useEffect(() => {
    const fetchImpactData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/api/impact', { timeout: 5000 });
        const sanitizedData = {
          stats: response.data.stats,
          testimonials: response.data.testimonials.map(testimonial => ({
            ...testimonial,
            quote: stripHtml(testimonial.quote),
          })),
        };
        setInitialValues(sanitizedData);
      } catch (err) {
        console.error('Error fetching impact data:', err);
        setError('Failed to load impact data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchImpactData();
  }, []);

  if (isLoading) {
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
        sx={{ mb: 4, fontSize: { xs: '2rem', md: '3rem' } }}
      >
        Impact Editor
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 2 }}>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting }) => {
                setOpenDialog(true);
                setSubmitting(false);
              }}
              enableReinitialize
            >
              {({ values, setFieldValue, errors, touched, isSubmitting }) => (
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
                            setFieldValue={setFieldValue}
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
                            setFieldValue={setFieldValue}
                            touched={touched}
                            errors={errors}
                            setActiveIndex={setActiveTestimonialIndex}
                            activeIndex={activeTestimonialIndex}
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

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<Save />}
                    disabled={isSubmitting}
                    sx={{ mt: 2 }}
                    aria-label="Save changes"
                  >
                    Save Changes
                  </Button>
                  <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>Confirm Changes</DialogTitle>
                    <DialogContent>Are you sure you want to save these changes?</DialogContent>
                    <DialogActions>
                      <Button onClick={() => setOpenDialog(false)} disabled={isSubmitting}>
                        Cancel
                      </Button>
                      <Button
                        onClick={async () => {
                          console.log('Saving impact data:', values);
                          try {
                            await axios.put('/api/impact', values, {
                              timeout: 5000,
                              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                            });
                            setOpenDialog(false);
                            alert('Impact data updated successfully!');
                          } catch (err) {
                            console.error('Error saving impact data:', err);
                            setError(err.response?.data?.error || 'Failed to save changes. Please try again.');
                          }
                        }}
                        color="primary"
                        disabled={isSubmitting}
                      >
                        Save
                      </Button>
                    </DialogActions>
                  </Dialog>

                  {/* Preview Section */}
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      Preview
                    </Typography>
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h5" sx={{ mb: 2 }}>
                        Stats
                      </Typography>
                      <Grid container spacing={2}>
                        {values.stats.map((stat, index) => (
                          <Grid item xs={12} sm={6} md={3} key={index}>
                            <StatPreview stat={stat} />
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                    <Box>
                      <Typography variant="h5" sx={{ mb: 2 }}>
                        Testimonials
                      </Typography>
                      {activeTestimonialIndex !== null && values.testimonials[activeTestimonialIndex] ? (
                        <TestimonialPreview testimonial={values.testimonials[activeTestimonialIndex]} />
                      ) : (
                        <Typography color="textSecondary">
                          Select a testimonial to preview
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Form>
              )}
            </Formik>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default memo(AdminImpact);