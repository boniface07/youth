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
} from '@mui/material';
import { Save } from '@mui/icons-material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import TextEditor from '../component/TextEditor';
import ListEditor from '../component/ListEditor';

const validationSchema = Yup.object({
  vision: Yup.string().required('Vision is required').max(5000, 'Vision must be 5000 characters or less'),
  mission: Yup.string().required('Mission is required').max(5000, 'Mission must be 5000 characters or less'),
  missionPoints: Yup.array().of(Yup.string().max(500, 'Each point must be 500 characters or less')),
  historyPoints: Yup.array().of(Yup.string().max(500, 'Each point must be 500 characters or less')),
});

const AdminAbout = () => {
  const [initialValues, setInitialValues] = useState({
    vision: '',
    mission: '',
    missionPoints: [],
    historyPoints: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/about', { timeout: 5000 });
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
    setOpenDialog(true);
    setSubmitting(false);
  };

  const confirmSubmit = async (values) => {
    try {
      await axios.put('/api/about', values, {
        timeout: 5000,
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setOpenDialog(false);
      alert('Content updated successfully!');
    } catch (err) {
      console.error('Error saving data:', err);
      setError(err.response?.data?.error || 'Failed to save changes. Please try again.');
    }
  };

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
        About Page Editor
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 2 }}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue, errors, touched, isSubmitting }) => (
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
                    <Typography color="error" sx={{ mb: 2 }}>
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
                    <Typography color="error" sx={{ mb: 2 }}>
                      {errors.mission}
                    </Typography>
                  )}
                  <ListEditor
                    label="Mission Points"
                    items={values.missionPoints}
                    onChange={(items) => setFieldValue('missionPoints', items)}
                    placeholder="Add new mission point"
                  />
                  <ListEditor
                    label="History Points"
                    items={values.historyPoints}
                    onChange={(items) => setFieldValue('historyPoints', items)}
                    placeholder="Add new history point"
                  />
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
                </Grid>

                {/* Preview Section */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      Preview
                    </Typography>
                    <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                      <Typography variant="h3" gutterBottom>
                        Vision
                      </Typography>
                      <Typography
                        sx={{ mb: 4 }}
                        dangerouslySetInnerHTML={{ __html: values.vision || 'No vision provided.' }}
                      />
                      <Typography variant="h3" gutterBottom>
                        Mission
                      </Typography>
                      <Typography
                        sx={{ mb: 4 }}
                        dangerouslySetInnerHTML={{ __html: values.mission || 'No mission provided.' }}
                      />
                      <Typography variant="h5" gutterBottom>
                        Mission Points
                      </Typography>
                      <Box component="ul" sx={{ pl: 4, mb: 4 }}>
                        {values.missionPoints.length === 0 ? (
                          <Typography sx={{ color: 'text.secondary' }}>
                            No mission points added.
                          </Typography>
                        ) : (
                          values.missionPoints.map((point, index) => (
                            <Typography component="li" key={index} sx={{ mb: 1 }}>
                              {point}
                            </Typography>
                          ))
                        )}
                      </Box>
                      <Typography variant="h5" gutterBottom>
                        History Points
                      </Typography>
                      <Box component="ul" sx={{ pl: 4 }}>
                        {values.historyPoints.length === 0 ? (
                          <Typography sx={{ color: 'text.secondary' }}>
                            No history points added.
                          </Typography>
                        ) : (
                          values.historyPoints.map((point, index) => (
                            <Typography component="li" key={index} sx={{ mb: 1 }}>
                              {point}
                            </Typography>
                          ))
                        )}
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
              <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Confirm Changes</DialogTitle>
                <DialogContent>Are you sure you want to save these changes?</DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenDialog(false)} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => confirmSubmit(values)}
                    color="primary"
                    disabled={isSubmitting}
                  >
                    Save
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