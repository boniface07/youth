/* eslint-disable no-unused-vars */
// D:\Exercise\JAVASCRIPT\REACT PROJECT\YOUTH_SPARK\youth_spark_app\src\admin\component\ImageUploader.jsx
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { PhotoCamera as PhotoCameraIcon, Delete as DeleteIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';

const ImageUploader = ({ label, image, onImageChange, sx }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const failedUrls = useRef(new Set());

  const handleFileChange = useCallback(
    async (event) => {
      const file = event.target.files[0];
      if (!file) {
        console.log('[ImageUploader] No file selected');
        return;
      }

      setLoading(true);
      setError('');

      try {
        await onImageChange(file);
        console.log('[ImageUploader] File selected:', file.name);
      } catch (err) {
        console.error('[ImageUploader] Error uploading file:', err.message);
        setError('Failed to upload image');
      } finally {
        setLoading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    },
    [onImageChange]
  );

  const handleRemoveImage = useCallback(() => {
    console.log('[ImageUploader] Removing image');
    onImageChange(null);
    setPreviewUrl(null);
    setError('');
  }, [onImageChange]);

  const computedPreviewUrl = useMemo(() => {
    if (!image) {
      console.log('[ImageUploader] No image provided');
      return null;
    }
    if (typeof image === 'string') {
      if (failedUrls.current.has(image)) {
        console.log('[ImageUploader] Using fallback for failed URL:', image);
        return '/images/placeholder.jpg';
      }
      console.log('[ImageUploader] Previewing URL:', image);
      return image;
    }
    if (image instanceof File) {
      const url = URL.createObjectURL(image);
      console.log('[ImageUploader] Previewing file:', url);
      return url;
    }
    console.error('[ImageUploader] Invalid image type:', typeof image);
    return null;
  }, [image]);

  useEffect(() => {
    setPreviewUrl(computedPreviewUrl);
  }, [computedPreviewUrl]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
        console.log('[ImageUploader] Revoked blob URL:', previewUrl);
      }
    };
  }, [previewUrl]);

  const handleImageError = useCallback(() => {
    if (image && typeof image === 'string' && !failedUrls.current.has(image)) {
      console.error('[ImageUploader] Image load failed:', image);
      failedUrls.current.add(image);
      setPreviewUrl('/images/placeholder.jpg');
    }
  }, [image]);

  return (
    <Box sx={{ ...sx, position: 'relative' }}>
      {label && (
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
          {label}
        </Typography>
      )}
      <Box
        sx={{
          border: '2px dashed',
          borderColor: 'grey.400',
          borderRadius: '8px',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'grey.100',
          minHeight: '200px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : previewUrl ? (
          <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
            <Box
              component="img"
              src={previewUrl}
              alt="Preview"
              onError={handleImageError}
              sx={{
                width: '50%',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '4px',
              }}
            />
            <IconButton
              onClick={handleRemoveImage}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
              }}
              aria-label="Remove image"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center' }}>
            <PhotoCameraIcon sx={{ fontSize: 40, color: 'grey.600', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Drag and drop or click to upload
            </Typography>
          </Box>
        )}
        <input
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{
            opacity: 0,
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            cursor: 'pointer',
          }}
        />
      </Box>
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

ImageUploader.propTypes = {
  label: PropTypes.string,
  image: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(File)]),
  onImageChange: PropTypes.func.isRequired,
  sx: PropTypes.object,
};

export default ImageUploader;