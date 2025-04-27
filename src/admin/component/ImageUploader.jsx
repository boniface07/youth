import { useDropzone } from 'react-dropzone';
import { Box, Typography, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { theme } from '../../theme';
import { useState, useMemo, useRef } from 'react';

const ImageUploader = ({ image, onImageChange, label, sx }) => {
  const [error, setError] = useState('');
  const failedUrls = useRef(new Set()); // Cache failed URLs

  // Generate preview URL
  const previewUrl = useMemo(() => {
    if (!image) {
      console.log('[ImageUploader] No image provided');
      return null;
    }
    if (typeof image === 'string') {
      if (failedUrls.current.has(image)) {
        console.log('[ImageUploader] Using fallback for failed URL:', image);
        return '/images/placeholder.jpg'; // Return fallback for failed URLs
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: (acceptedFiles) => {
      console.log('[ImageUploader] Files dropped:', acceptedFiles);
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        console.log('[ImageUploader] Selected file:', file.name);
        onImageChange(file);
        setError('');
      }
    },
    onDropRejected: (fileRejections) => {
      console.log('[ImageUploader] Files rejected:', fileRejections);
      setError('Invalid file. Please upload a JPG or PNG (max 5MB).');
      onImageChange(null);
    },
  });

  const handleClear = () => {
    console.log('[ImageUploader] Clearing image');
    onImageChange(null);
    setError('');
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  return (
    <Box
      sx={{ mb: 3, width: '100%', ...sx }}
      role="region"
      aria-label={`${label} image uploader`}
    >
      <Typography
        variant="h6"
        component="label"
        htmlFor="image-uploader-input"
        sx={{
          mb: 1,
          fontWeight: 600,
          color: theme.palette.text.primary,
          display: 'block',
        }}
      >
        {label}
      </Typography>
      <Box
        {...getRootProps()}
        sx={{
          border: `2px dashed ${theme.palette.border.main}`,
          borderRadius: '8px',
          p: 2,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: isDragActive ? theme.palette.action.hover : 'transparent',
          transition: 'background-color 0.2s',
          '&:hover': { bgcolor: theme.palette.action.hover },
          position: 'relative',
        }}
        aria-describedby="image-uploader-desc"
      >
        <input id="image-uploader-input" {...getInputProps()} />
        {previewUrl ? (
          <Box sx={{ position: 'relative', display: 'inline-block' }}>
            <Box
              component="img"
              src={previewUrl}
              alt="Uploaded image preview"
              sx={{
                maxWidth: '100%',
                maxHeight: { xs: '150px', sm: '200px' },
                borderRadius: '4px',
                objectFit: 'cover',
              }}
              onError={(e) => {
                console.error('[ImageUploader] Image load failed:', previewUrl);
                if (typeof image === 'string' && !failedUrls.current.has(image)) {
                  failedUrls.current.add(image); // Cache failed URL
                  e.target.src = '/images/default-hero.jpg';
                  setError('Failed to load image preview.');
                }
              }}
            />
            <IconButton
              onClick={handleClear}
              aria-label="Clear uploaded image"
              sx={{
                position: 'absolute',
                top: -12,
                right: -12,
                bgcolor: theme.palette.error.main,
                color: '#fff',
                '&:hover': { bgcolor: theme.palette.error.dark },
              }}
              size="small"
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </Box>
        ) : (
          <Typography
            color="text.secondary"
            sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
            id="image-uploader-desc"
          >
            {isDragActive
              ? 'Drop the image here'
              : 'Drag & drop an image or click to select (JPG, PNG, max 5MB)'}
          </Typography>
        )}
      </Box>
      {error && (
        <Typography color="error" sx={{ mt: 1, fontSize: '0.9rem' }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default ImageUploader;