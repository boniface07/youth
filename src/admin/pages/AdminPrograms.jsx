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
import { Save, Add, Delete } from '@mui/icons-material';
import { Formik, Form, FieldArray, FastField, useField } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import debounce from 'lodash/debounce';
import TextEditor from '../component/TextEditor';
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

// Validation schema
const validationSchema = Yup.object({
  programs: Yup.array().of(
    Yup.object({
      title: Yup.string().required('Title is required').max(255, 'Title must be 255 characters or less'),
      description: Yup.string().required('Description is required').max(5000, 'Description must be 5000 characters or less'),
      icon: Yup.string().required('Icon is required'),
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

// Memoized ProgramForm
const ProgramForm = memo(({ program, index, remove, setFieldValue, touched, errors, setActiveIndex, activeIndex }) => (
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
          label="Title"
          value={program.title}
          onChange={(e) => setFieldValue(`programs.${index}.title`, e.target.value)}
          fullWidth
          error={touched.programs?.[index]?.title && !!errors.programs?.[index]?.title}
          helperText={touched.programs?.[index]?.title && errors.programs?.[index]?.title}
          sx={{ mb: 2 }}
          disabled={activeIndex !== index}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          select
          label="Icon"
          value={program.icon}
          onChange={(e) => setFieldValue(`programs.${index}.icon`, e.target.value)}
          fullWidth
          error={touched.programs?.[index]?.icon && !!errors.programs?.[index]?.icon}
          helperText={touched.programs?.[index]?.icon && errors.programs?.[index]?.icon}
          sx={{ mb: 2 }}
          disabled={activeIndex !== index}
        >
          {iconOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12}>
        <FastField name={`programs.${index}.description`} shouldUpdate={() => activeIndex === index}>
          {() => (
            <TextEditorField
              name={`programs.${index}.description`}
              label="Description"
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
          aria-label={`Delete program ${program.title}`}
          disabled={activeIndex !== index}
        >
          <Delete />
        </IconButton>
      </Grid>
    </Grid>
  </Box>
));

// Memoized PreviewCard
const PreviewCard = memo(({ program }) => (
  <Card
    sx={{
      width: '100%',
      maxWidth: 350,
      mt: 2,
      borderTop: '4px solid #ff3d46',
      borderBottom: '4px solid #4285F4',
      borderRadius: '12px',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
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
        {program.title || 'Untitled'}
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
        {stripHtml(program.description) || 'No description'}
      </Typography>
    </Box>
  </Card>
));

const AdminPrograms = () => {
  const [initialValues, setInitialValues] = useState({ programs: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/api/programs', { timeout: 5000 });
        // Strip HTML from descriptions on fetch as a fallback
        const sanitizedPrograms = response.data.map(program => ({
          ...program,
          description: stripHtml(program.description),
        }));
        setInitialValues({ programs: sanitizedPrograms });
      } catch (err) {
        console.error('Error fetching programs:', err);
        setError('Failed to load programs. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrograms();
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
        Programs Editor
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
                            setActiveIndex={setActiveIndex}
                            activeIndex={activeIndex}
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
                          try {
                            console.log('Saving programs:', values.programs);
                            await axios.put('/api/programs', values.programs, {
                              timeout: 5000,
                              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                            });
                            setOpenDialog(false);
                            alert('Programs updated successfully!');
                          } catch (err) {
                            console.error('Error saving programs:', err);
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
                  {/* Preview inside Formik */}
                  <Grid item xs={12} md={6} sx={{ mt: { xs: 4, md: 0 } }}>
                    <Typography variant="h6" gutterBottom>
                      Preview
                    </Typography>
                    {activeIndex !== null && values.programs[activeIndex] ? (
                      <PreviewCard program={values.programs[activeIndex]} />
                    ) : (
                      <Typography color="textSecondary">
                        Select a program to preview
                      </Typography>
                    )}
                  </Grid>
                </Form>
              )}
            </Formik>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default memo(AdminPrograms);