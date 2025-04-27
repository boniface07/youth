import { useState, useEffect, memo } from 'react';
import {
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Tabs,
  Tab,
} from '@mui/material';
import { Save, Refresh } from '@mui/icons-material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import DOMPurify from 'dompurify';
import TextEditor from '../component/TextEditor';
import ListEditor from '../component/ListEditor';
import { theme } from '../../theme';

// Ensure no trailing slash in API_BASE_URL
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://youth-spark-backend-production.up.railway.app')
  .replace(/\/+$/, '')
  .trim();

const validationSchema = Yup.object({
  vision: Yup.string()
    .required('Vision is required')
    .max(5000, 'Vision must be 5000 characters or less')
    .trim(),
  mission: Yup.string()
    .required('Mission is required')
    .max(5000, 'Mission must be 5000 characters or less')
    .trim(),
  missionPoints: Yup.array().of(
    Yup.string()
      .required('Mission point cannot be empty')
      .max(500, 'Each point must be 500 characters or less')
      .trim()
  ),
  historyPoints: Yup.array().of(
    Yup.string()
      .required('History point cannot be empty')
      .max(500, 'Each point must be 500 characters or less')
      .trim()
  ),
});

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

const AdminAbout = () => {
  const [initialValues, setInitialValues] = useState({
    vision: '',
    mission: '',
    missionPoints: [],
    historyPoints: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/about`, { timeout: 10000 });
      if (!response.data) {
        throw new Error('Empty response from server');
      }
      setInitialValues({
        vision: response.data.vision || '',
        mission: response.data.mission || '',
        missionPoints: Array.isArray(response.data.missionPoints) ? response.data.missionPoints : [],
        historyPoints: Array.isArray(response.data.historyPoints) ? response.data.historyPoints : [],
      });
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
      await axios.put(`${API_BASE_URL}/api/about`, values, {
        timeout: 10000,
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setInitialValues(values);
      setSuccess('Content updated successfully!');
      setOpenDialog(false);
    } catch (err) {
      console.error('Error saving data:', err);
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
      const response = await axios.get(`${API_BASE_URL}/api/about`, { timeout: 10000 });
      if (!response.data) {
        throw new Error('Empty response from server');
      }
      const values = {
        vision: response.data.vision || '',
        mission: response.data.mission || '',
        missionPoints: Array.isArray(response.data.missionPoints) ? response.data.missionPoints : [],
        historyPoints: Array.isArray(response.data.historyPoints) ? response.data.historyPoints : [],
      };
      setValues(values);
      setInitialValues(values);
    } catch (err) {
      console.error('Error resetting data:', err);
      setError('Failed to reset content. Please try again.');
    } finally {
      setIsLoading(false);
      setResetDialogOpen(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const gradient = `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`;

  if (isLoading && !initialValues.vision) {
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
        About Page Editor
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
      <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 2 }}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue, setValues, errors, touched, isSubmitting }) => (
            <Form aria-label="About page editor form">
              <Grid container spacing={4}>
                {/* Form Section */}
                <Grid item xs={12} md={6}>
                  <TextEditor
                    label="Vision"
                    value={values.vision}
                    onChange={(value) => setFieldValue('vision', value)}
                    sx={{ mb: 3 }}
                  />
                  {touched.vision && errors.vision && (
                    <Typography color="error" sx={{ mb: 2, fontSize: '0.9rem' }}>
                      {errors.vision}
                    </Typography>
                  )}
                  <TextEditor
                    label="Mission"
                    value={values.mission}
                    onChange={(value) => setFieldValue('mission', value)}
                    sx={{ mb: 3 }}
                  />
                  {touched.mission && errors.mission && (
                    <Typography color="error" sx={{ mb: 2, fontSize: '0.9rem' }}>
                      {errors.mission}
                    </Typography>
                  )}
                  <ListEditor
                    label="Mission Points"
                    items={values.missionPoints}
                    onChange={(items) => setFieldValue('missionPoints', items)}
                    placeholder="Add new mission point"
                    sx={{ mb: 3 }}
                  />
                  {touched.missionPoints &&
                    errors.missionPoints &&
                    errors.missionPoints.map((error, index) => (
                      <Typography key={index} color="error" sx={{ mb: 2, fontSize: '0.9rem' }}>
                        Mission Point {index + 1}: {error}
                      </Typography>
                    ))}
                  <ListEditor
                    label="History Points"
                    items={values.historyPoints}
                    onChange={(items) => setFieldValue('historyPoints', items)}
                    placeholder="Add new history point"
                    sx={{ mb: 3 }}
                  />
                  {touched.historyPoints &&
                    errors.historyPoints &&
                    errors.historyPoints.map((error, index) => (
                      <Typography key={index} color="error" sx={{ mb: 2, fontSize: '0.9rem' }}>
                        History Point {index + 1}: {error}
                      </Typography>
                    ))}
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
                </Grid>

                {/* Preview Section */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      Preview
                    </Typography>
                    <Tabs
                      value={activeTab}
                      onChange={handleTabChange}
                      variant="fullWidth"
                      aria-label="About preview tabs"
                      sx={{
                        mb: 3,
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
                      <Tab label="Vision & Mission" id="preview-tab-0" aria-controls="preview-tabpanel-0" />
                      <Tab label="Our History" id="preview-tab-1" aria-controls="preview-tabpanel-1" />
                    </Tabs>
                    <TabPanel value={activeTab} index={0}>
                      <Typography variant="h4" sx={{ mb: 2 }}>
                        Our Vision
                      </Typography>
                      <Typography
                        sx={{ lineHeight: 1.8, color: 'text.secondary', mb: 4 }}
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(values.vision || 'No vision provided.'),
                        }}
                      />
                      <Typography variant="h4" sx={{ mb: 2 }}>
                        Our Mission
                      </Typography>
                      <Typography
                        sx={{ lineHeight: 1.8, color: 'text.secondary', mb: 4 }}
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(values.mission || 'No mission provided.'),
                        }}
                      />
                      <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
                        Key Focus Areas
                      </Typography>
                      {values.missionPoints.length === 0 ? (
                        <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
                          No mission points added.
                        </Typography>
                      ) : (
                        <Box
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                            gap: 2,
                          }}
                        >
                          {values.missionPoints.map((point, index) => (
                            <Box
                              key={index}
                              sx={{
                                p: 2,
                                bgcolor: 'background.default',
                                borderRadius: 2,
                                borderLeft: `4px solid ${theme.palette.primary.main}`,
                              }}
                            >
                              <Typography sx={{ color: 'text.primary' }}>
                                {DOMPurify.sanitize(point)}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </TabPanel>
                    <TabPanel value={activeTab} index={1}>
                      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
                        Our Journey
                      </Typography>
                      {values.historyPoints.length === 0 ? (
                        <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
                          No history points added.
                        </Typography>
                      ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          {values.historyPoints.map((point, index) => (
                            <Box
                              key={index}
                              sx={{
                                p: 2,
                                bgcolor: 'background.default',
                                borderRadius: 2,
                              }}
                            >
                              <Typography sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                                {DOMPurify.sanitize(point)}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </TabPanel>
                  </Paper>
                </Grid>
              </Grid>
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
    </Container>
  );
};

export default memo(AdminAbout);