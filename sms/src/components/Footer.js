import React from "react";
import { Box, Container, Grid, Typography, IconButton } from "@mui/material";
import { Github, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { styled } from '@mui/material/styles';

// Styled components
const StyledFooter = styled(Box)(({ theme }) => ({
  width: "100%",
  background: 'linear-gradient(90deg, #1976d2, #42a5f5)', // Gradient background matching the header
  padding: '2rem 0',
  marginTop: '2rem',
  boxShadow: theme.shadows[4],
  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: "#fff",
  transition: 'transform 0.2s ease, color 0.3s ease',
  '&:hover': {
    color: '#ffeb3b',
    transform: 'scale(1.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}));

const Footer = () => {
  const socialLinks = [
    {
      icon: <Github size={24} />,
      href: "https://github.com",
      label: "GitHub",
    },
    {
      icon: <Twitter size={24} />,
      href: "https://twitter.com",
      label: "Twitter",
    },
    {
      icon: <Facebook size={24} />,
      href: "https://facebook.com",
      label: "Facebook",
    },
    {
      icon: <Instagram size={24} />,
      href: "https://instagram.com",
      label: "Instagram",
    },
    {
      icon: <Youtube size={24} />,
      href: "https://youtube.com",
      label: "YouTube",
    },
  ];

  return (
    <StyledFooter>
      <Container maxWidth="lg">
        <Grid container direction="column" alignItems="center" spacing={2}>
          {/* Title */}
          <Grid item xs={12}>
            <Typography
              variant="h5"
              sx={{
                color: '#fff',
                fontWeight: 'bold',
                letterSpacing: '1px',
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
            >
              STUDENT MANAGEMENT SYSTEM
            </Typography>
          </Grid>

          {/* Subtitle */}
          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
              }}
            >
              {`${new Date().getFullYear()} || Created By UOR || FOE`}
            </Typography>
          </Grid>

          {/* Social Media Icons */}
          <Grid item xs={12}>
            <Grid container spacing={2} justifyContent="center">
              {socialLinks.map((link) => (
                <Grid item key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                  >
                    <StyledIconButton>
                      {link.icon}
                    </StyledIconButton>
                  </a>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </StyledFooter>
  );
};

export default Footer;