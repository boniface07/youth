import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Divider,
  Button,
  Link,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Email, Phone, LocationOn, Twitter, LinkedIn, Instagram } from '@mui/icons-material';
import { keyframes } from '@emotion/react';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Visually hidden style for screen reader text
const visuallyHiddenStyle = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  border: 0,
};

// Function to get current year for copyright
const getCurrentYear = () => new Date().getFullYear();

// Content Variables (Optimized for SEO keywords)
const content = {
  header: {
    title: 'Contact Youth Spark Foundation',
    subtitle: 'Connect with us to empower Tanzanian youth through education and entrepreneurship',
  },
  contactInfo: {
    title: 'Contact Information',
    description: 'Reach out to Youth Spark Foundation in Dar es Salaam, Tanzania',
    details: [
      {
        icon: <LocationOn aria-label="Location" />,
        label: 'Address',
        value: [
          'Serengeti Street, near Aga Khan Polyclinic Kigamboni',
          'KiBADA Ward, Kigamboni District',
          'Dar es Salaam, Tanzania',
          'P.O. Box 1212',
        ],
      },
      {
        icon: <Email aria-label="Email" />,
        label: 'Email',
        value: 'info@youthsparkfoundation.org',
        href: 'mailto:info@youthsparkfoundation.org',
      },
      {
        icon: <Phone aria-label="Phone" />,
        label: 'Phone',
        value: '+255 123 456 789',
        href: 'tel:+255123456789',
      },
    ],
  },
  cta: {
    title: 'Get Involved with Youth Spark Foundation',
    description:
      'Join our mission to empower Tanzanian youth. Volunteer, donate, or partner with us today.',
    buttons: [
      {
        label: 'Volunteer',
        href: '/volunteer',
        variant: 'contained',
        ariaLabel: 'Volunteer with Youth Spark Foundation',
      },
      {
        label: 'Donate',
        href: '/donate',
        variant: 'outlined',
        ariaLabel: 'Donate to Youth Spark Foundation',
      },
    ],
  },
  footer: {
    branding: {
      title: 'Youth Spark Foundation',
      description:
        'Empowering Tanzanian youth through education, digital skills, and entrepreneurship in Dar es Salaam.',
    },
    copyright: `© ${getCurrentYear()} Youth Spark Foundation. All rights reserved.`,
  },
};

// Navigation Links
const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Programs', href: '/programs' },
  { label: 'Contact', href: '/contact' },
];

// Social Media Links
const socialMedia = [
  {
    icon: <Twitter aria-label="Follow Youth Spark Foundation on Twitter" />,
    href: 'https://twitter.com',
    label: 'Twitter',
  },
  {
    icon: <LinkedIn aria-label="Connect with Youth Spark Foundation on LinkedIn" />,
    href: 'https://linkedin.com',
    label: 'LinkedIn',
  },
  {
    icon: <Instagram aria-label="Follow Youth Spark Foundation on Instagram" />,
    href: 'https://instagram.com',
    label: 'Instagram',
  },
];

// Map Embed URL
const mapEmbedUrl =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d22409.55061808312!2d39.29295517782635!3d-6.832146404689002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x185c4b00383a539f%3A0xfc96d88a737b5d6a!2sSERENGETI%20STREET%20KIGAMBONI!5e0!3m2!1sen!2stz!4v1744889391826!5m2!1sen!2stz';

const Contact = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // JSON-LD Schema for SEO
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Youth Spark Foundation',
    url: 'https://www.youthsparkfoundation.org',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Serengeti Street, near Aga Khan Polyclinic Kigamboni',
      addressLocality: 'Dar es Salaam',
      addressRegion: 'Kigamboni District',
      postalCode: 'P.O. Box 1212',
      addressCountry: 'TZ',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+255123456789',
        contactType: 'Customer Service',
        email: 'info@youthsparkfoundation.org',
        areaServed: 'TZ',
        availableLanguage: ['English', 'Swahili'],
      },
    ],
    sameAs: ['https://twitter.com', 'https://linkedin.com', 'https://instagram.com'],
  };

  return (
    <Box sx={{ bgcolor: 'background.default', position: 'relative' }}>
      {/* React 19 Native Document Metadata */}
      <title>Contact Youth Spark Foundation | Dar es Salaam, Tanzania</title>
      <meta
        name="description"
        content="Contact Youth Spark Foundation in Dar es Salaam, Tanzania. Reach us via email, phone, or visit our office to support youth empowerment."
      />
      <meta
        name="keywords"
        content="Youth Spark Foundation contact, Tanzania nonprofit, youth empowerment, Dar es Salaam contact, volunteer Tanzania, donate nonprofit"
      />
      <meta name="robots" content="index, follow" />
      <meta property="og:title" content="Contact Youth Spark Foundation" />
      <meta
        property="og:description"
        content="Connect with Youth Spark Foundation to empower Tanzanian youth through education and entrepreneurship."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://www.youthsparkfoundation.org/contact" />
      <meta property="og:image" content="https://www.youthsparkfoundation.org/logo.jpg" />
      <meta name="twitter:card" content="summary_large_image" />
      <script type="application/ld+json">{JSON.stringify(schemaData)}</script>

      {/* Skip to Content Link */}
      <Link
        href="#main-content"
        sx={{
          ...visuallyHiddenStyle,
          '&:focus': {
            position: 'static',
            width: 'auto',
            height: 'auto',
            clip: 'auto',
            bgcolor: 'background.paper',
            p: 1,
            m: 1,
            border: '2px solid',
            borderColor: 'primary.main',
            borderRadius: '4px',
          },
        }}
      >
        Skip to main content
      </Link>

      <Box
        component="main"
        id="main-content"
        sx={{ py: { xs: 6, md: 10 }, scrollMarginTop: '64px' }}
        role="main"
      >
        <Container maxWidth="lg">
          {/* Header Section */}
          <Box
            component="header"
            sx={{
              textAlign: 'center',
              mb: { xs: 6, md: 8 },
              '@media (prefers-reduced-motion: no-preference)': {
                animation: `${fadeIn} 0.8s ease-out forwards`,
              },
              opacity: 0,
            }}
            role="banner"
          >
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                color: theme.palette.primary.main,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                mb: 2,
                fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
              }}
            >
              {content.header.title}
            </Typography>
            <Typography
              variant="h2"
              sx={{
                color: theme.palette.text.secondary,
                maxWidth: 700,
                mx: 'auto',
                fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                lineHeight: 1.6,
                fontFamily: '"Merriweather", "Georgia", serif',
                fontWeight: 400,
              }}
            >
              {content.header.subtitle}
            </Typography>
          </Box>

          {/* Contact Content */}
          <Grid container spacing={6} sx={{ mb: { xs: 6, md: 8 } }}>
            <Grid item xs={12}>
              <Box
                component="section"
                sx={{
                  '@media (prefers-reduced-motion: no-preference)': {
                    animation: `${fadeIn} 0.8s ease-out 0.4s forwards`,
                  },
                  opacity: 0,
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: { xs: 3, md: 2 },
                  alignItems: 'stretch',
                }}
                role="region"
                aria-labelledby="contact-info-heading"
              >
                {/* Contact Information */}
                <Box
                  sx={{
                    flex: { xs: '1 1 100%', md: '1 1 50%' },
                    p: { xs: 3, md: 4 },
                    bgcolor: '#ffffff',
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Typography
                    id="contact-info-heading"
                    variant="h2"
                    sx={{
                      fontWeight: 700,
                      mb: 3,
                      color: theme.palette.text.primary,
                      fontSize: { xs: '1.5rem', md: '1.75rem' },
                      fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
                    }}
                  >
                    {content.contactInfo.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 4,
                      color: theme.palette.text.secondary,
                      fontFamily: '"Merriweather", "Georgia", serif',
                    }}
                  >
                    {content.contactInfo.description}
                  </Typography>
                  <Box sx={{ mb: 4 }}>
                    {content.contactInfo.details.map((detail, index) => (
                      <Box sx={{ display: 'flex', mb: index < 2 ? 3 : 0 }} key={index}>
                        <Box
                          sx={{
                            color: '#d32f2f', // Darkened for contrast
                            fontSize: '1.8rem',
                            mr: 2,
                            mt: 0.5,
                          }}
                        >
                          {detail.icon}
                        </Box>
                        <Box>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 600,
                              mb: 0.5,
                              fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
                            }}
                          >
                            {detail.label}
                          </Typography>
                          <Typography
                            variant="body1"
                            component={detail.href ? 'a' : 'span'}
                            href={detail.href}
                            sx={
                              detail.href
                                ? {
                                    color: theme.palette.text.secondary,
                                    textDecoration: 'none',
                                    '&:hover': { textDecoration: 'underline' },
                                    '&:focus': {
                                      outline: `2px solid ${theme.palette.primary.main}`,
                                      outlineOffset: '2px',
                                    },
                                  }
                                : { color: theme.palette.text.secondary }
                            }
                          >
                            {Array.isArray(detail.value) ? (
                              detail.value.map((line, i) => (
                                <React.Fragment key={i}>
                                  {line}
                                  {i < detail.value.length - 1 && <br />}
                                </React.Fragment>
                              ))
                            ) : (
                              detail.value
                            )}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>

                {/* Google Maps Embed */}
                <Box
                  sx={{
                    flex: { xs: '1 1 100%', md: '1 1 50%' },
                    height: { xs: 400, md: '100%' }, // Increased mobile height
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    position: 'relative',
                  }}
                  role="region"
                  aria-label="Map of Youth Spark Foundation office location"
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      bgcolor: 'grey.200',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 1,
                      transition: 'opacity 0.3s',
                      opacity: 1,
                      '&[data-loaded="true"]': { opacity: 0, pointerEvents: 'none' },
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Loading map...
                    </Typography>
                  </Box>
                  <iframe
                    src={mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0, position: 'relative', zIndex: 2 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Youth Spark Foundation Office Location"
                    onLoad={(e) => e.target.parentElement.querySelector('div').setAttribute('data-loaded', 'true')}
                    tabIndex={0}
                  ></iframe>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* CTA Section */}
          <Box
            component="section"
            sx={{
              bgcolor: '#d32f2f', // Darkened for contrast
              borderRadius: 2,
              p: { xs: 4, md: 6 },
              textAlign: 'center',
              '@media (prefers-reduced-motion: no-preference)': {
                animation: `${fadeIn} 0.8s ease-out 0.6s forwards`,
              },
              opacity: 0,
              mt: { xs: 6, md: 8 },
            }}
            role="region"
            aria-labelledby="cta-heading"
          >
            <Typography
              id="cta-heading"
              variant="h2"
              sx={{
                fontWeight: 800,
                color: '#fff',
                mb: 3,
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.25rem' },
                fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
              }}
            >
              {content.cta.title}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                maxWidth: 700,
                mx: 'auto',
                mb: 4,
                fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                fontFamily: '"Merriweather", "Georgia", serif',
              }}
            >
              {content.cta.description}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              {content.cta.buttons.map((button, index) => (
                <Button
                  key={index}
                  variant={button.variant}
                  size="large"
                  href={button.href}
                  aria-label={button.ariaLabel}
                  sx={{
                    bgcolor: button.variant === 'contained' ? '#fff' : 'transparent',
                    color: button.variant === 'contained' ? '#d32f2f' : '#fff',
                    borderColor: button.variant === 'outlined' ? '#fff' : undefined,
                    '&:hover': {
                      bgcolor: button.variant === 'contained' ? '#f5f5f5' : undefined,
                      borderColor: button.variant === 'outlined' ? '#f5f5f5' : undefined,
                      color: button.variant === 'outlined' ? '#f5f5f5' : undefined,
                      transform: 'scale(1.05)',
                    },
                    '&:focus': {
                      outline: `2px solid ${theme.palette.primary.main}`,
                      outlineOffset: '2px',
                    },
                    px: index === 0 ? 5 : 4, // Larger for primary button
                    py: index === 0 ? 2 : 1.5,
                    fontSize: index === 0 ? '1.1rem' : '1rem',
                    fontWeight: 700,
                    borderRadius: '8px',
                    fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
                    transition: 'transform 0.2s, background-color 0.2s, color 0.2s',
                  }}
                >
                  {button.label}
                </Button>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: '#1e40ae',
          py: { xs: 6, md: 8 },
          color: '#fff',
          '@media (prefers-reduced-motion: no-preference)': {
            animation: `${fadeInUp} 0.8s ease-out 0.8s forwards`,
          },
          opacity: 0,
        }}
        role="contentinfo"
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  mb: 2,
                  fontSize: { xs: '1.5rem', md: '1.75rem' },
                  fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
                }}
              >
                {content.footer.branding.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontFamily: '"Merriweather", "Georgia", serif',
                  maxWidth: isMobile ? '100%' : '80%',
                }}
              >
                {content.footer.branding.description}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                  fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
                }}
              >
                Quick Links
              </Typography>
              <Box component="nav" sx={{ display: 'flex', flexDirection: 'column', gap: 1 }} role="navigation">
                {navLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      textDecoration: 'none',
                      '&:hover': { color: '#d32f2f' },
                      '&:focus': {
                        outline: `2px solid #d32f2f`,
                        outlineOffset: '2px',
                      },
                      fontFamily: '"Merriweather", "Georgia", serif',
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                  fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
                }}
              >
                Contact Us
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontFamily: '"Merriweather", "Georgia", serif',
                  }}
                >
                  Serengeti St, Kigamboni, Dar es Salaam
                </Typography>
                <Link
                  href={content.contactInfo.details[1].href}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    '&:hover': { color: '#d32f2f' },
                    '&:focus': { outline: `2px solid #d32f2f`, outlineOffset: '2px' },
                    fontFamily: '"Merriweather", "Georgia", serif',
                  }}
                >
                  {content.contactInfo.details[1].value}
                </Link>
                <Link
                  href={content.contactInfo.details[2].href}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    '&:hover': { color: '#d32f2f' },
                    '&:focus': { outline: `2px solid #d32f2f`, outlineOffset: '2px' },
                    fontFamily: '"Merriweather", "Georgia", serif',
                  }}
                >
                  {content.contactInfo.details[2].value}
                </Link>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                  fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
                }}
              >
                Follow Us
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {socialMedia.map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener"
                    aria-label={social.label}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': { color: '#d32f2f', transform: 'scale(1.1)' },
                      '&:focus': { outline: `2px solid #d32f2f`, outlineOffset: '2px' },
                      transition: 'color 0.2s, transform 0.2s',
                    }}
                  >
                    <Box sx={{ fontSize: '1.8rem' }}>{social.icon}</Box>
                  </Link>
                ))}
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

          <Typography
            variant="body2"
            sx={{
              textAlign: 'center',
              color: 'rgba(255, 255, 255, 0.8)',
              fontFamily: '"Merriweather", "Georgia", serif',
            }}
          >
            {content.footer.copyright}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Contact;