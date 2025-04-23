import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Box, Typography, Button, ButtonGroup } from '@mui/material';
import { theme } from '../../theme';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import ImageIcon from '@mui/icons-material/Image';


// Define toolbar buttons for reusability
const toolbarButtons = [
  {
    label: 'Bold',
    icon: <FormatBoldIcon />,
    action: (editor) => editor?.chain().focus().toggleBold().run(),
    isActive: (editor) => editor?.isActive('bold'),
  },
  {
    label: 'Italic',
    icon: <FormatItalicIcon />,
    action: (editor) => editor?.chain().focus().toggleItalic().run(),
    isActive: (editor) => editor?.isActive('italic'),
  },
  {
    label: 'Bullet List',
    icon: <FormatListBulletedIcon />,
    action: (editor) => editor?.chain().focus().toggleBulletList().run(),
    isActive: (editor) => editor?.isActive('bulletList'),
  },
  {
    label: 'Ordered List',
    icon: <FormatListNumberedIcon />,
    action: (editor) => editor?.chain().focus().toggleOrderedList().run(),
    isActive: (editor) => editor?.isActive('orderedList'),
  },
  {
    label: 'Insert Image',
    icon: <ImageIcon />,
    action: (editor) => {
      const url = window.prompt('Enter the image URL');
      if (url) {
        editor?.chain().focus().setImage({ src: url }).run();
      }
    },
    isActive: () => false, // No active state for image insertion
  },
];

const TextEditor = ({ value, onChange, label }) => {
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  return (
    <Box
      sx={{
        mb: 3,
        width: '100%',
        maxWidth: '100%',
        mx: 'auto',
      }}
      role="region"
      aria-label={`${label} rich text editor`}
    >
      <Typography
        variant="h6"
        component="label"
        htmlFor="text-editor"
        sx={{
          mb: 1,
          fontWeight: 600,
          color: theme.palette.text.primary,
          display: 'block',
        }}
      >
        {label}
      </Typography>
      <ButtonGroup
        sx={{
          mb: 1,
          flexWrap: 'wrap',
          gap: 1,
          justifyContent: { xs: 'flex-start', sm: 'flex-start' },
        }}
        aria-label="text formatting toolbar"
      >
        {toolbarButtons.map((btn) => (
          <Button
            key={btn.label}
            onClick={() => btn.action(editor)}
            variant={btn.isActive(editor) ? 'contained' : 'outlined'}
            aria-label={btn.label}
            sx={{
              minWidth: { xs: '48px', sm: '40px' },
              p: { xs: 1, sm: 0.5 },
            }}
          >
            {btn.icon}
          </Button>
        ))}
      </ButtonGroup>
      <Box
        sx={{
          border: `1px solid ${theme.palette.border.main}`,
          borderRadius: '8px',
          bgcolor: theme.palette.background.paper,
          '& .ProseMirror': {
            minHeight: { xs: '80px', sm: '100px' },
            p: 1,
            outline: 'none',
            '& p.is-editor-empty:first-child::before': {
              content: 'attr(data-placeholder)',
              color: theme.palette.text.secondary,
              opacity: 0.5,
              pointerEvents: 'none',
              height: 0,
            },
            '& img': {
              maxWidth: '100%',
              height: 'auto',
              display: 'block',
              my: 1,
            },
          },
        }}
      >
        <EditorContent editor={editor} id="text-editor" />
      </Box>
    </Box>
  );
};

export default TextEditor;