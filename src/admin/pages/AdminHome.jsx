/* eslint-disable no-unused-vars */
// D:\Exercise\JAVASCRIPT\REACT PROJECT\YOUTH_SPARK\youth_spark_app\src\admin\pages\AdminHome.jsx
import { useState, useEffect, useCallback, Suspense, lazy } from 'react';
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

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000')
  .replace(/\/+$/, '')
  .trim();

  const yourCloudName = import.meta.env.CLOUDINARY_CLOUD_NAME;
  console.log('Cloudinary Cloud Name:', yourCloudName);
  console.log('API Base URL:', API_BASE_URL);
  // Default hero image path (served from Cloudinary)
  const DEFAULT_HERO_IMAGE = `https://res.cloudinary.com/${yourCloudName}/image/upload/v1/youth_spark/default-hero.jpg`;

const SEO = ({ title, description }) => {
  useEffect(() => {
    document.title = title;
    const metaTags = [{ name: 'description', content: description }];
    metaTags.forEach(({ name, content }) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    });
    return () => {
      metaTags.forEach(({ name }) => {
        const meta = document.querySelector(`meta[name="${name}"]`);
        if (meta && meta.getAttribute('data-react-seo') === 'true') {
          meta.remove();
        }
      });
    };
  }, [title, description]);
  return null;
};

const ImageWithFallback = ({ src, alt, ...props }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [failedUrls, setFailedUrls] = useState(new Set());

  const handleError = useCallback(() => {
    if (!failedUrls.has(imgSrc)) {
      console.error('[AdminHome] Hero image load failed:', imgSrc);
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

const validationSchema = Yup.object({
  heroTitle: Yup.string()
    .required('Hero Title is required')
    .max(100, 'Title must be 100 characters or less'),
  heroSubtitle: Yup.string()
    .required('Hero Subtitle is required')
    .max(1000, 'Subtitle must be 1000 characters or less'),
  heroImage: Yup.string()
    .required('Hero Image is required')
    .test('is-valid-url', 'Must be a valid URL', (value) => {
      if (!value) return false;
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    }),
});

const stripHtmlTags = (html) => {
  if (!html || typeof html !== 'string') return html;
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return doc.body.textContent || '';
};

const normalizeUrl = (base, path) => {
  return `${base}/${path}`.replace(/\/+/g, '/').replace(':/', '://');
};

const AdminHome = () => {
  const [initialValues, setInitialValues] = useState({
    heroTitle: '',
    heroSubtitle: '',
    heroImage: DEFAULT_HERO_IMAGE,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const fetchContent = useCallback(async (retries = 3) => {
    setLoading(true);
    const url = normalizeUrl(API_BASE_URL, 'api/home');
    for (let i = 0; i < retries; i++) {
      try {
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          timeout: 10000,
        });
        if (!response.data || Object.keys(response.data).length === 0) {
          throw new Error('No content returned from API');
        }
        const newValues = {
          heroTitle: response.data.title || '',
          heroSubtitle: response.data.description || '',
          heroImage: response.data.image_url || DEFAULT_HERO_IMAGE,
        };
        setInitialValues((prev) => {
          if (
            prev.heroTitle === newValues.heroTitle &&
            prev.heroSubtitle === newValues.heroSubtitle &&
            prev.heroImage === newValues.heroImage
          ) {
            console.log('[AdminHome] No change in initialValues, skipping update');
            return prev;
          }
          console.log('[AdminHome] Updating initialValues:', newValues);
          return newValues;
        });
        setError('');
        break;
      } catch (error) {
        console.error('[AdminHome] Error fetching content (attempt', i + 1, '):', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        if (i === retries - 1) {
          setError(
            `Failed to fetch homepage content: ${error.response?.data?.message || error.message}`
          );
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

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
      const errorMessage = error.response?.data?.message || 'Image upload failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    const url = normalizeUrl(API_BASE_URL, 'api/home');
    try {
      const cleanedTitle = stripHtmlTags(values.heroTitle);
      const cleanedSubtitle = stripHtmlTags(values.heroSubtitle);
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
      setInitialValues({
        heroTitle: cleanedTitle,
        heroSubtitle: cleanedSubtitle,
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
      setError(
        `Failed to update homepage content: ${error.response?.data?.message || error.message}`
      );
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const handleReset = async (setValues) => {
    setLoading(true);
    const url = normalizeUrl(API_BASE_URL, 'api/home');
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        timeout: 10000,
      });
      const values = {
        heroTitle: response.data.title || '',
        heroSubtitle: response.data.description || '',
        heroImage: response.data.image_url || DEFAULT_HERO_IMAGE,
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

  return (
    <>
      <SEO
        title="Home Page Editor - Youth Spark Foundation"
        description="Edit the homepage content for Youth Spark Foundation."
      />
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
                              setFieldValue('heroImage', DEFAULT_HERO_IMAGE);
                              return;
                            }
                            try {
                              const imageUrl = await handleImageUpload(file);
                              setFieldValue('heroImage', imageUrl);
                            } catch (error) {
                              // Error is already set in handleImageUpload
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

                        <Dialog
                          open={resetDialogOpen}
                          onClose={() => setResetDialogOpen(false)}
                          aria-labelledby="reset-dialog-title"
                          aria-describedby="reset-dialog-description"
                        >
                          <DialogTitle id="reset-dialog-title">Confirm Reset</DialogTitle>
                          <DialogContent>
                            <DialogContentText id="reset-dialog-description">
                              Are you sure you want to reset the form? This will discard unsaved
                              changes and reload the saved content.
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={() => setResetDialogOpen(false)} color="primary">
                              Cancel
                            </Button>
                            <Button
                              onClick={() => handleReset(setValues)}
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
                    {stripHtmlTags(initialValues.heroTitle) || 'Enter a title...'}
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
                  >
                    {stripHtmlTags(initialValues.heroSubtitle) || 'Enter a subtitle...'}
                  </Typography>
                  {initialValues.heroImage ? (
                    <ImageWithFallback
                      src={initialValues.heroImage}
                      alt="Hero"
                      sx={{
                        maxWidth: '100%',
                        borderRadius: '8px',
                        mt: 2,
                        objectFit: 'cover',
                        maxHeight: 300,
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