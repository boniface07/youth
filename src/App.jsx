import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Navigate,
  useLocation,
} from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Drawer,
  Typography,
  ThemeProvider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Home from './pages/Home';
import About from './pages/About';
import Programs from './pages/Programs';
import Impact from './pages/Impact';
import Contact from './pages/Contact';
import Admin from './admin/Admin';
import Login from './admin/pages/Login';
import { theme } from './theme';

// Navigation links for public pages
const publicNavLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Programs', path: '/programs' },
  { label: 'Impact', path: '/impact' },
  { label: 'Contact Us', path: '/contact' },
];

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  console.log('[ProtectedRoute] Checking token:', token ? 'Present' : 'Missing');
  if (!token) {
    console.log('[ProtectedRoute] No token, redirecting to /login');
    return <Navigate to="/login" replace />;
  }
  console.log('[ProtectedRoute] Token found, allowing access');
  return children;
};

// Main application component
function MainApp() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(null);
  const [touchActive, setTouchActive] = useState(null);
  const [logoClicked, setLogoClicked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const location = useLocation();

  // Monitor authentication state
  useEffect(() => {
    console.log('[MainApp] Checking initial isAuthenticated =', isAuthenticated);
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const newAuthState = !!token;
      console.log('[MainApp] localStorage check, token =', token, 'newAuthState =', newAuthState);
      setIsAuthenticated(newAuthState);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    window.addEventListener('loginSuccess', checkAuth);
    window.addEventListener('logoutSuccess', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('loginSuccess', checkAuth);
      window.removeEventListener('logoutSuccess', checkAuth);
    };
  }, [isAuthenticated]);

  // Toggle mobile drawer
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;
    setDrawerOpen(open);
  };

  // Handle navigation link click
  const handleLinkClick = (path) => {
    console.log('[MainApp] handleLinkClick:', path);
    setActiveLink(path);
    setTimeout(() => setActiveLink(null), 300);
  };

  // Handle touch start
  const handleTouchStart = (label) => {
    console.log('[MainApp] handleTouchStart:', label);
    setTouchActive(label);
  };

  // Handle touch end
  const handleTouchEnd = () => {
    setTimeout(() => setTouchActive(null), 200);
  };

  // Handle logo click
  const handleLogoClick = () => {
    setLogoClicked(true);
    setTimeout(() => setLogoClicked(false), 500);
  };

  // Styles for navigation links
  const linkStyles = (isActive, isClicked = false, isTouchHover = false, index = -1) => ({
    color: isActive ? '#d32f2f' : '#1976d2',
    fontWeight: isActive ? 700 : 600,
    position: 'relative',
    textDecoration: 'none',
    display: 'block',
    transform: isClicked ? 'scale(0.98)' : isTouchHover || !isActive ? 'translateY(-2px)' : 'scale(1)',
    transition: 'all 0.2s ease',
    px: isClicked ? 2 : 1.5,
    py: isClicked ? 1.5 : 1,
    borderRadius: '4px',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: { xs: 2, md: -4 },
      left: isActive ? 0 : '50%',
      width: isActive ? '100%' : isTouchHover ? '100%' : 0,
      height: '2px',
      backgroundColor: isActive ? '#d32f2f' : '#42a5f5',
      transform: isActive ? 'none' : 'translateX(-50%)',
      transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      boxShadow: isActive ? '0 0 8px rgba(211, 47, 47, 0.4)' : 'none',
    },
    '&:hover::after': {
      width: '100%',
      left: 0,
      transform: 'none',
    },
    '&:hover': {
      color: isActive ? '#d32f2f' : '#42a5f5',
      transform: 'translateY(-2px)',
    },
    ...(isActive && {
      '&::before': {
        content: '""',
        position: 'absolute',
        top: -4,
        left: -4,
        right: -4,
        bottom: -4,
        borderRadius: '4px',
        backgroundColor: 'rgba(211, 47, 47, 0.1)',
        zIndex: -1,
      },
      textShadow: '0 0 8px rgba(211, 47, 47, 0.4)',
    }),
    ...(isClicked && {
      color: '#ff5252',
    }),
    '&:focus': {
      outline: '2px solid #42a5f5',
      outlineOffset: '2px',
    },
    ...(index >= 0 && {
      opacity: 0,
      transform: 'translateX(20px)',
      animation: 'slideIn 0.5s ease forwards',
      animationDelay: `${index * 0.1}s`,
      '@keyframes slideIn': {
        '0%': { opacity: 0, transform: 'translateX(20px)' },
        '100%': { opacity: 1, transform: 'translateX(0)' },
      },
    }),
  });

  // Determine if on admin route
  const isAdminRoute = location.pathname.startsWith('/admin');
  console.log('[MainApp] isAdminRoute =', isAdminRoute, 'isAuthenticated =', isAuthenticated);

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          color: theme.palette.text.primary,
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
          zIndex: 2000,
          transition: 'all 0.3s ease',
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
          '&:hover': {
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
          },
        }}
      >
        <Toolbar
          sx={{
            justifyContent: isAdminRoute && isAuthenticated ? 'space-between' : 'space-around',
            py: 1,
            px: { xs: 2, md: 4 },
            minHeight: '80px !important',
            maxWidth: '1440px',
            mx: 'auto',
            width: '100%',
          }}
        >
          {/* Logo Section */}
          <Box
            onClick={handleLogoClick}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.02)',
              },
            }}
          >
            <NavLink
              to="/"
              className="logo-link"
              style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
            >
              <img
                src="/logo.png"
                alt="Youth Spark Foundation Logo"
                style={{
                  width: 48,
                  height: 48,
                  transition: 'all 0.3s ease',
                  transform: logoClicked ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)',
                  animation: logoClicked ? 'pulse 0.5s ease-out' : 'none',
                }}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '1.2rem', md: '1.3rem' },
                    lineHeight: 1.2,
                    textDecoration: 'none',
                    background: 'linear-gradient(to right, #1e40ae, #c23120)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                    '&:hover': { textDecoration: 'none' },
                    '&:active': { textDecoration: 'none' },
                  }}
                >
                  Youth Spark
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: { xs: '0.75rem', md: '0.85rem' },
                    color: theme.palette.text.secondary,
                    fontWeight: 400,
                    letterSpacing: '0.1em',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'none' },
                    '&:active': { textDecoration: 'none' },
                  }}
                >
                  FOUNDATION
                </Typography>
              </Box>
            </NavLink>
          </Box>

          {/* Desktop Navigation */}
          {isAdminRoute && isAuthenticated ? (
            null
          ) : (
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                gap: 2,
                alignItems: 'center',
              }}
            >
              {publicNavLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  style={{ textDecoration: 'none' }}
                  onClick={() => handleLinkClick(link.path)}
                  aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
                >
                  {({ isActive }) => (
                    <Typography
                      variant="button"
                      sx={linkStyles(
                        isActive,
                        activeLink === link.path,
                        touchActive === link.label
                      )}
                    >
                      {link.label}
                    </Typography>
                  )}
                </NavLink>
              ))}
              <NavLink
                to="/login"
                style={{ textDecoration: 'none' }}
                onClick={() => handleLinkClick('/login')}
                aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
              >
                {({ isActive }) => (
                  <Typography
                    variant="button"
                    sx={linkStyles(
                      isActive,
                      activeLink === '/login',
                      touchActive === 'Login'
                    )}
                  >
                    Login
                  </Typography>
                )}
              </NavLink>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  ml: 2,
                  px: 3,
                  py: 1.2,
                  fontWeight: 600,
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
                  boxShadow: 'none',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(30, 64, 175, 0.3)',
                    background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Register Now
              </Button>
            </Box>
          )}

          {/* Mobile Menu Button */}
          {!(isAdminRoute && isAuthenticated) && (
            <IconButton
              sx={{
                display: { md: 'none' },
                color: 'primary.main',
                fontSize: '2rem',
                padding: 1,
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.1)',
                },
              }}
              onClick={toggleDrawer(!drawerOpen)}
              aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
            >
              {drawerOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      {!(isAdminRoute && isAuthenticated) && (
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          sx={{
            '& .MuiDrawer-paper': {
              width: 300,
              p: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: '0 0 40px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
            <IconButton
              onClick={toggleDrawer(false)}
              aria-label="Close menu"
              sx={{
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.1)',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
            {publicNavLinks.map((link, index) => (
              <NavLink
                key={link.path}
                to={link.path}
                style={{ textDecoration: 'none' }}
                onTouchStart={() => handleTouchStart(link.label)}
                onTouchEnd={handleTouchEnd}
                onClick={() => {
                  handleLinkClick(link.path);
                  toggleDrawer(false)();
                }}
                aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
              >
                {({ isActive }) => (
                  <Typography
                    variant="button"
                    sx={{
                      ...linkStyles(
                        isActive,
                        activeLink === link.path,
                        touchActive === link.label,
                        index
                      ),
                      px: 3,
                      py: 1.5,
                    }}
                  >
                    {link.label}
                  </Typography>
                )}
              </NavLink>
            ))}
            <NavLink
              to="/login"
              style={{ textDecoration: 'none' }}
              onTouchStart={() => handleTouchStart('Login')}
              onTouchEnd={handleTouchEnd}
              onClick={() => {
                handleLinkClick('/login');
                toggleDrawer(false)();
              }}
              aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
            >
              {({ isActive }) => (
                <Typography
                  variant="button"
                  sx={{
                    ...linkStyles(
                      isActive,
                      activeLink === '/login',
                      touchActive === 'Login',
                      publicNavLinks.length
                    ),
                    px: 3,
                    py: 1.5,
                  }}
                >
                  Login
                </Typography>
              )}
            </NavLink>
            <Button
              variant="contained"
              fullWidth
              color="primary"
              sx={{
                mt: 3,
                py: 1.5,
                fontWeight: 600,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
                boxShadow: 'none',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(30, 64, 175, 0.3)',
                },
                transition: 'all 0.3s ease',
              }}
              onClick={toggleDrawer(false)}
            >
              Register Now
            </Button>
          </Box>
        </Drawer>
      )}

      <Box component="main" sx={{ pt: '80px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Box>

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.1) rotate(5deg); }
            100% { transform: scale(1) rotate(0deg); }
          }
          .logo-link {
            text-decoration: none !important;
          }
          .logo-link:hover,
          .logo-link:active,
          .logo-link:focus {
            text-decoration: none !important;
          }
          .logo-link::after,
          .logo-link:hover::after {
            content: none !important;
          }
        `}
      </style>
    </>
  );
}

function App() {
  useEffect(() => {
    const link = document.createElement('link');
    link.href =
      'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Merriweather:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <MainApp />
      </Router>
    </ThemeProvider>
  );
}

export default App;