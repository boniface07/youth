import { useState, memo } from 'react';
import { Box, Typography, TextField, Button, IconButton } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';

const ListEditor = ({ items, onChange, label, placeholder }) => {
  const theme = useTheme();
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (newItem.trim()) {
      onChange([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ mb: 3 }} role="region" aria-label={`${label} editor`}>
      <Typography
        variant="h6"
        sx={{ mb: 1, fontWeight: 600, color: theme.palette.text.primary }}
      >
        {label}
      </Typography>
      <Box sx={{ display: 'flex', mb: 2, gap: 1 }}>
        <TextField
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={placeholder}
          fullWidth
          variant="outlined"
          size="small"
          inputProps={{ 'aria-label': `Add new ${label.toLowerCase()}` }}
          onKeyPress={(e) => e.key === 'Enter' && addItem()}
        />
        <Button
          variant="contained"
          onClick={addItem}
          disabled={!newItem.trim()}
          startIcon={<Add />}
          sx={{ bgcolor: theme.palette.primary.main }}
          aria-label={`Add ${label.toLowerCase()}`}
        >
          Add
        </Button>
      </Box>
      <Box>
        {items.length === 0 ? (
          <Typography sx={{ color: theme.palette.text.secondary }}>
            No {label.toLowerCase()} added.
          </Typography>
        ) : (
          items.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography sx={{ flexGrow: 1 }}>{item}</Typography>
              <IconButton
                onClick={() => removeItem(index)}
                color="error"
                aria-label={`Delete ${label.toLowerCase()} ${index + 1}`}
              >
                <Delete />
              </IconButton>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

ListEditor.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
};

ListEditor.defaultProps = {
  placeholder: 'Add new item',
};

export default memo(ListEditor);