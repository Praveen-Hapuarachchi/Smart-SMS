import React from "react";
import { Box, Container, Grid, Typography, IconButton, Divider } from "@mui/material";
import { Github, Facebook, Instagram, Twitter,Youtube  } from "lucide-react";

const Footer = () => {
  // Social Media Links
  const socialLinks = [
    {
      icon: <Github size={20} />,
      href: "https://github.com",
      label: "GitHub",
    },
    {
      icon: <Twitter size={20} />,
      href: "https://twitter.com",
      label: "Twitter",
    },
    {
      icon: <Facebook size={20} />,
      href: "https://facebook.com",
      label: "Facebook",
    },
    {
      icon: <Instagram size={20} />,
      href: "https://instagram.com",
      label: "Instagram",
    },
    {
      icon: <Youtube size={20} />, // Added YouTube icon
      href: "https://youtube.com",
      label: "YouTube",
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        height: "auto",
        backgroundColor: "#f8f9fa", // Soft Off-White // Same color as the header
        paddingTop: "1rem",
        paddingBottom: "1rem",
        marginTop: "2rem",
        borderTop: "6px solid #006400",
      }}
    >
      <Container maxWidth="lg">
        <Grid container direction="column" alignItems="center">
          {/* Title */}
          <Grid item xs={12}>
            <Typography color="blaCK" variant="h5">
              STUDENT MANAGEMENT SYSTEM
            </Typography>
          </Grid>

          {/* Subtitle */}
          <Grid item xs={12}>
            <Typography color="black" variant="subtitle1">
              {`${new Date().getFullYear()} || Created By UOR || FOE `}
              
            </Typography>
            
          </Grid>
          <Divider sx={{ borderColor: "#006400", borderWidth: 1, width: "30%" }} />
          {/* Social Media Icons */}
          <Grid item xs={10} sx={{ marginTop: "1rem" }}>
            <Grid container spacing={2} justifyContent="center">
              {socialLinks.map((link) => (
                <Grid item key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                  >
                    <IconButton
                      sx={{
                        color: "#333", // Dark Gray
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.1)",
                          color: "#005792", // Dark Blue Hover Effect
                        },
                      }}
                    >
                      {link.icon}
                    </IconButton>
                  </a>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;