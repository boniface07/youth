import { useState, useEffect, Suspense, lazy } from 'react';
import { Box, Typography, Button, Container, Grid, Card, CircularProgress, Alert } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Save as SaveIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { theme } from '../../theme';
import axios from 'axios';

const TextEditor = lazy(() => import('../component/TextEditor'));
const ImageUploader = lazy(() => import('../component/ImageUploader'));

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const validationSchema = Yup.object({
  heroTitle: Yup.string().required('Required'),
  heroSubtitle: Yup.string().required('Required'),
  heroImage: Yup.string().required('Required'),
});

// Function to strip HTML tags
const stripHtmlTags = (html) => {
  if (!html || typeof html !== 'string') return html;
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return doc.body.textContent || '';
};

const AdminHome = () => {
  const [initialValues, setInitialValues] = useState({
    heroTitle: '',
    heroSubtitle: '',
    heroImage: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        console.log('[AdminHome] Fetching content from:', `${API_BASE_URL}/api/home`);
        const response = await axios.get(`${API_BASE_URL}/api/home`);
        console.log('[AdminHome] API response:', response.data);
        if (!response.data || Object.keys(response.data).length === 0) {
          throw new Error('No content returned from API');
        }
        setInitialValues({
          heroTitle: response.data.title || '',
          heroSubtitle: response.data.description || '',
          heroImage: response.data.image_url || '',
        });
        setError('');
      } catch (error) {
        console.error('[AdminHome] Error fetching content:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        setError(`Failed to fetch homepage content: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleImageUpload = async (file) => {
    if (!file) {
      console.error('[AdminHome] No file provided for upload');
      throw new Error('No file selected');
    }
    const formData = new FormData();
    formData.append('image', file);
    try {
      console.log('[AdminHome] Uploading image to:', `${API_BASE_URL}/api/upload`);
      const response = await axios.post(`${API_BASE_URL}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('[AdminHome] Image upload response:', response.data);
      return response.data.imageUrl;
    } catch (error) {
      console.error('[AdminHome] Image upload error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(error.response?.data?.message || 'Image upload failed');
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      // Strip HTML tags from heroSubtitle
      const cleanedDescription = stripHtmlTags(values.heroSubtitle);
      const cleanedTitle = stripHtmlTags(values.heroTitle);
      console.log('[AdminHome] Submitting values:', {
        heroTitle: cleanedTitle,
        heroSubtitle: cleanedDescription,
        heroImage: values.heroImage,
      });
      const response = await axios.put(`${API_BASE_URL}/api/home`, {
        title: cleanedTitle,
        description: cleanedDescription,
        image_url: values.heroImage,
      });
      console.log('[AdminHome] PUT response:', response.data);
      setInitialValues({
        heroTitle: cleanedTitle,
        heroSubtitle: cleanedDescription, // Keep HTML for preview
        heroImage: values.heroImage,
      });
      alert('Content updated successfully!');
      setError('');
    } catch (error) {
      console.error('[AdminHome] Error submitting content:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      setError(`Failed to update homepage content: ${error.message}`);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const handleReset = async (setValues) => {
    setLoading(true);
    try {
      console.log('[AdminHome] Resetting form, fetching from:', `${API_BASE_URL}/api/home`);
      const response = await axios.get(`${API_BASE_URL}/api/home`);
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
      setError(`Failed to reset content: ${error.message}`);
    } finally {
      setLoading(false);
    }
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
                            onClick={() => handleReset(setValues)}
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
                  }}
                >
                  <Typography variant="h3" gutterBottom>
                    {initialValues.heroTitle}
                  </Typography>
                  <Typography variant="h5">
                    {initialValues.heroSubtitle}
                  </Typography>
                  {initialValues.heroImage && (
                    <Box
                      component="img"
                      src={initialValues.heroImage}
                      alt="Hero"
                      sx={{ maxWidth: '100%', borderRadius: '8px', mt: 2 }}
                    />
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