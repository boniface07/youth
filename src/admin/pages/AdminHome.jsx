// D:\Exercise\JAVASCRIPT\REACT PROJECT\YOUTH_SPARK\youth_spark_app\src\admin\pages\AdminHome.jsx
import { useState, useEffect, Suspense, lazy } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Save as SaveIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { theme } from '../../theme';
import axios from 'axios';

const TextEditor = lazy(() => import('../component/TextEditor'));
const ImageUploader = lazy(() => import('../component/ImageUploader'));

// Normalize API_BASE_URL
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000')
  .replace(/\/+$/, '')
  .trim();

console.log('[AdminHome] Raw VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('[AdminHome] Normalized API_BASE_URL:', API_BASE_URL);

const validationSchema = Yup.object({
  heroTitle: Yup.string().required('Hero Title is required').max(100, 'Title must be 100 characters or less'),
  heroSubtitle: Yup.string().required('Hero Subtitle is required').max(1000, 'Subtitle must be 1000 characters or less'),
  heroImage: Yup.string()
    .required('Hero Image is required')
    .test('is-valid-url', 'Must be a valid URL', (value) => {
      // Allow empty or null during file selection
      if (!value) return false;
      // Validate URL format
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    }),
});

// Strip HTML tags for submission
const stripHtmlTags = (html) => {
  if (!html || typeof html !== 'string') return html;
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return doc.body.textContent || '';
};

// Normalize URL helper
const normalizeUrl = (base, path) => {
  const url = `${base}/${path}`.replace(/\/+/g, '/').replace(':/', '://');
  console.log('[AdminHome] Normalized URL:', url);
  return url;
};

const AdminHome = () => {
  const [initialValues, setInitialValues] = useState({
    heroTitle: '',
    heroSubtitle: '',
    heroImage: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  // Fetch content on mount
  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const url = normalizeUrl(API_BASE_URL, 'api/home');
      try {
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          timeout: 10000,
        });
        console.log('[AdminHome] API response:', response.data);
        if (!response.data || Object.keys(response.data).length === 0) {
          throw new Error('No content returned from API');
        }
        const values = {
          heroTitle: response.data.title || '',
          heroSubtitle: response.data.description || '',
          heroImage: response.data.image_url || '',
        };
        setInitialValues(values);
        setError('');
      } catch (error) {
        console.error('[AdminHome] Error fetching content:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        setError(`Failed to fetch homepage content: ${error.response?.data?.message || error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  // Handle image upload
  const handleImageUpload = async (file) => {
    if (!file) {
      console.error('[AdminHome] No file provided for upload');
      throw new Error('No file selected');
    }
    const formData = new FormData();
    formData.append('image', file);
    const url = normalizeUrl(API_BASE_URL, 'api/upload');
    try {
      console.log('[AdminHome] Uploading to:', url, 'File:', file.name);
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        timeout: 10000,
      });
      console.log('[AdminHome] Image upload response:', response.data);
      const imageUrl = response.data.imageUrl;
      // Validate returned URL
      try {
        new URL(imageUrl);
        return imageUrl;
      } catch {
        throw new Error('Invalid image URL returned from server');
      }
    } catch (error) {
      console.error('[AdminHome] Image upload error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(error.response?.data?.message || 'Image upload failed');
    }
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    const url = normalizeUrl(API_BASE_URL, 'api/home');
    try {
      const cleanedTitle = stripHtmlTags(values.heroTitle);
      const cleanedSubtitle = stripHtmlTags(values.heroSubtitle);
      console.log('[AdminHome] Submitting values:', {
        title: cleanedTitle,
        description: cleanedSubtitle,
        image_url: values.heroImage,
      });
      const response = await axios.put(
        url,
        {
          title: cleanedTitle,
          description: cleanedSubtitle,
          image_url: values.heroImage,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          timeout: 10000,
        }
      );
      console.log('[AdminHome] PUT response:', response.data);
      setInitialValues({
        heroTitle: cleanedTitle,
        heroSubtitle: values.heroSubtitle, // Keep HTML for preview
        heroImage: values.heroImage,
      });
      alert('Homepage content updated successfully!');
      setError('');
    } catch (error) {
      console.error('[AdminHome] Error submitting content:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      setError(`Failed to update homepage content: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  // Handle reset
  const handleReset = async (setValues) => {
    setResetDialogOpen(true);
    const resetFn = async () => {
      setLoading(true);
      const url = normalizeUrl(API_BASE_URL, 'api/home');
      try {
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          timeout: 10000,
        });
        console.log('[AdminHome] Reset API response:', response.data);
        const values = {
          heroTitle: response.data.title || '',
          heroSubtitle: response.data.description || '',
          heroImage: response.data.image_url || '',
        };
        setValues(values);
        setInitialValues(values);
        setError('');
      } catch (error) {
        console.error('[AdminHome] Error resetting content:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        setError(`Failed to reset content: ${error.response?.data?.message || error.message}`);
      } finally {
        setLoading(false);
        setResetDialogOpen(false);
      }
    };
    return resetFn;
  };

  return (
    <>
      <title>Home Page Editor - Youth Spark Foundation</title>
      <meta name="description" content="Edit the homepage content for Youth Spark Foundation." />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            mb: 4,
            fontWeight: 700,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Home Page Editor
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={4}>
            {/* Form Section */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  p: 3,
                  boxShadow: `0 4px 12px rgba(0, 0, 0, 0.1)`,
                  borderRadius: '12px',
                  bgcolor: theme.palette.background.paper,
                }}
                role="form"
                aria-label="Home page editor form"
              >
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Hero Section
                </Typography>

                <Suspense fallback={<CircularProgress />}>
                  <Formik
                    enableReinitialize
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ values, setFieldValue, setValues, errors, touched, isSubmitting }) => (
                      <Form>
                        <TextEditor
                          label="Hero Title"
                          value={values.heroTitle}
                          onChange={(value) => setFieldValue('heroTitle', value)}
                          sx={{ mb: 3 }}
                        />
                        {errors.heroTitle && touched.heroTitle && (
                          <Typography color="error" sx={{ mb: 2, fontSize: '0.9rem' }}>
                            {errors.heroTitle}
                          </Typography>
                        )}

                        <TextEditor
                          label="Hero Subtitle"
                          value={values.heroSubtitle}
                          onChange={(value) => setFieldValue('heroSubtitle', value)}
                          sx={{ mb: 3 }}
                        />
                        {errors.heroSubtitle && touched.heroSubtitle && (
                          <Typography color="error" sx={{ mb: 2, fontSize: '0.9rem' }}>
                            {errors.heroSubtitle}
                          </Typography>
                        )}

                        <ImageUploader
                          label="Hero Image"
                          image={values.heroImage}
                          onImageChange={async (file) => {
                            if (!file) {
                              setFieldValue('heroImage', '');
                              return;
                            }
                            try {
                              const imageUrl = await handleImageUpload(file);
                              setFieldValue('heroImage', imageUrl);
                            } catch (error) {
                              setError(error.message);
                              setFieldValue('heroImage', '');
                            }
                          }}
                          sx={{ mb: 3 }}
                        />
                        {errors.heroImage && touched.heroImage && (
                          <Typography color="error" sx={{ mb: 2, fontSize: '0.9rem' }}>
                            {errors.heroImage}
                          </Typography>
                        )}

                        {error && (
                          <Typography color="error" sx={{ mb: 2, fontSize: '0.9rem' }}>
                            {error}
                          </Typography>
                        )}

                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                          <Button
                            type="submit"
                            variant="contained"
                            disabled={isSubmitting || loading}
                            startIcon={<SaveIcon />}
                            sx={{
                              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                              '&:hover': { transform: 'scale(1.05)' },
                              fontSize: { xs: '0.9rem', sm: '1rem' },
                            }}
                            aria-label="Save changes"
                          >
                            Save Changes
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={() => setResetDialogOpen(true)}
                            disabled={isSubmitting || loading}
                            startIcon={<RefreshIcon />}
                            sx={{
                              borderColor: theme.palette.border.main,
                              color: theme.palette.text.primary,
                              fontSize: { xs: '0.9rem', sm: '1rem' },
                            }}
                            aria-label="Reset form"
                          >
                            Reset
                          </Button>
                        </Box>

                        {/* Reset Confirmation Dialog */}
                        <Dialog
                          open={resetDialogOpen}
                          onClose={() => setResetDialogOpen(false)}
                          aria-labelledby="reset-dialog-title"
                          aria-describedby="reset-dialog-description"
                        >
                          <DialogTitle id="reset-dialog-title">Confirm Reset</DialogTitle>
                          <DialogContent>
                            <DialogContentText id="reset-dialog-description">
                              Are you sure you want to reset the form? This will discard unsaved changes and reload the saved content.
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={() => setResetDialogOpen(false)} color="primary">
                              Cancel
                            </Button>
                            <Button
                              onClick={async () => {
                                await handleReset(setValues)();
                              }}
                              color="primary"
                              autoFocus
                            >
                              Reset
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </Form>
                    )}
                  </Formik>
                </Suspense>
              </Card>
            </Grid>

            {/* Preview Section */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Preview
                </Typography>
                <Box
                  sx={{
                    p: 4,
                    bgcolor: 'primary.main',
                    color: 'white',
                    borderRadius: 2,
                    minHeight: 200,
                  }}
                >
                  <Typography
                    variant="h3"
                    gutterBottom
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {initialValues.heroTitle || 'Enter a title...'}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: 'vertical',
                    }}
                    dangerouslySetInnerHTML={{ __html: initialValues.heroSubtitle || 'Enter a subtitle...' }}
                  />
                  {initialValues.heroImage ? (
                    <Box
                      component="img"
                      src={initialValues.heroImage}
                      alt="Hero"
                      sx={{
                        maxWidth: '100%',
                        borderRadius: '8px',
                        mt: 2,
                        objectFit: 'cover',
                        maxHeight: 300,
                      }}
                      onError={(e) => {
                        e.target.src = '/images/placeholder.jpg';
                        console.error('[AdminHome] Hero image load failed:', initialValues.heroImage);
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        bgcolor: 'grey.300',
                        borderRadius: '8px',
                        mt: 2,
                        height: 200,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography color="text.secondary">No image selected</Typography>
                    </Box>
                  )}
                </Box>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>
    </>
  );
};

export default AdminHome;