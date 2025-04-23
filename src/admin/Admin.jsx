import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Container,
  Avatar,
  Badge,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  School as ProgramsIcon,
  EmojiEvents as ImpactIcon,
  Email as ContactIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';

import { theme } from '../theme';
import AdminHome from './pages/AdminHome';
import AdminAbout from './pages/AdminAbout';
import AdminPrograms from './pages/AdminPrograms';
import AdminImpact from './pages/AdminImpact';


// Placeholder components
const ImpactEditor = () => (
  <Container maxWidth="xl">
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
      Impact Management
    </Typography>
    <Typography>Placeholder for Impact Editor</Typography>
  </Container>
);

// Dashboard Content
const DashboardContent = () => {
  return (
    <Container maxWidth="xl">
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
        Dashboard Overview
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <StatCard
          title="Total Visitors"
          value="1,245"
          icon={<PeopleIcon />}
          color={theme.palette.primary.main}
        />
        <StatCard
          title="Programs"
          value="10+"
          icon={<ProgramsIcon />}
          color={theme.palette.secondary.main}
        />
        <StatCard
          title="Youth Impacted"
          value="1,000+"
          icon={<ImpactIcon />}
          color={theme.palette.primary.main}
        />
        <StatCard
          title="New Messages"
          value="24"
          icon={<ContactIcon />}
          color={theme.palette.secondary.main}
        />
      </Box>
      <Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ flex: '2 1 600px' }}>
        
        </Box>
        <Box sx={{ flex: '1 1 300px' }}>
          
        </Box>
      </Box>
    </Container>
  );
};

// Helper Components
const StatCard = ({ title, value, icon, color }) => {
  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: theme.palette.background.paper,
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        flex: '1 1 200px',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="subtitle2" color="textSecondary">
            {title}
          </Typography>
          <Typography variant="h4">{value}</Typography>
        </Box>
        <Avatar sx={{ bgcolor: `${color}20`, color }}>
          {icon}
        </Avatar>
      </Box>
    </Box>
  );
};



const drawerWidth = 240;

const Admin = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // Logout function
  const handleLogout = () => {
    console.log('Admin: handleLogout: Clearing localStorage');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('logoutSuccess'));
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Home Page', icon: <PeopleIcon />, path: '/admin/home' },
    { text: 'About', icon: <ContactIcon />, path: '/admin/about' },
    { text: 'Programs', icon: <ProgramsIcon />, path: '/admin/programs' },
    { text: 'Impact', icon: <ImpactIcon />, path: '/admin/impact' },
    
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.primary.main,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(to right, #1e40ae 0%, #c23120 100%)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(to right, #DBC949 0%, #94CD6E 50%, #9C68D6 100%)',
          },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600, color: '#fff' }}>
            Youth Spark Admin
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit">
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          ...(open && {
            width: drawerWidth,
            transition: (theme) =>
              theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            overflowX: 'hidden',
          }),
          ...(!open && {
            transition: (theme) =>
              theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
            overflowX: 'hidden',
            width: `calc(${theme.spacing(7)} + 1px)`,
            [theme.breakpoints.up('sm')]: {
              width: `calc(${theme.spacing(8)} + 1px)`,
            },
          }),
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            borderBottom: `1px solid ${theme.palette.border.main}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              src="/logo.png"
              sx={{
                width: 40,
                height: 40,
                mr: 1,
                bgcolor: theme.palette.primary.main,
              }}
            />
            {open && (
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Youth Spark
              </Typography>
            )}
          </Box>
          {open && (
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          )}
        </Box>
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.light,
                  color: theme.palette.primary.main,
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.primary.main,
                  },
                },
                '&.Mui-selected:hover': {
                  backgroundColor: theme.palette.primary.light,
                },
                '&:hover': {
                  backgroundColor: theme.palette.primary.light,
                },
              }}
              selected={location.pathname === item.path}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? theme.palette.primary.main : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <Box sx={{ p: 2, mt: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar>
              <AccountCircleIcon />
            </Avatar>
            {open && (
              <Box sx={{ ml: 2 }}>
                <Typography variant="subtitle2">Admin User</Typography>
                <Typography variant="caption">admin@youthspark.org</Typography>
              </Box>
            )}
          </Box>
          {open && (
            <ListItem
              button
              onClick={handleLogout}
              sx={{ mt: 1 }}
            >
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          )}
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: theme.palette.background.default,
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Routes>
          <Route path="dashboard" element={<DashboardContent />} />
          <Route path="home" element={<AdminHome />} />
          <Route path="about" element={<AdminAbout />} />
          <Route path="programs" element={<AdminPrograms />} />
          <Route path="impact" element={<AdminImpact />} />
          <Route path="*" element={<DashboardContent />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default Admin;