import React, { useState } from 'react';
import {
  AppBar,
  Button,
  Container,
  Toolbar,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SchoolIcon from '@mui/icons-material/School';
import LoginIcon from '@mui/icons-material/Login';
import Form from './form/Form';

// Styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(90deg, #1976d2, #42a5f5)', // Gradient background
  boxShadow: theme.shadows[4],
  padding: '4px 0',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  textTransform: 'uppercase',
  fontWeight: 'bold',
  padding: '8px 16px',
  transition: 'transform 0.2s ease, background-color 0.3s ease',
  backgroundColor: '#ffffff',
  color: '#1976d2',
  border: '1px solid #1976d2',
  '&:hover': {
    transform: 'scale(1.05)',
    backgroundColor: '#f5f5f5',
    border: '1px solid #1565c0',
    boxShadow: theme.shadows[2],
  },
}));

const Header = () => {
  const [openLoginForm, setOpenLoginForm] = useState(false);

  const handleLoginClick = () => {
    setOpenLoginForm(true);
  };

  const handleCloseLoginForm = () => {
    setOpenLoginForm(false);
  };

  return (
    <>
      <StyledAppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <SchoolIcon sx={{ display: { xs: 'flex', md: 'flex' }, mr: 1, fontSize: '3rem', color: '#fff' }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'flex' },
                fontFamily: '"Roboto", "Arial", sans-serif',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
            >
              STUDENT MANAGEMENT SYSTEM
            </Typography>
            <StyledButton
              className="user-button"
              onClick={handleLoginClick}
              variant="contained"
              endIcon={<LoginIcon />}
              sx={{
                ml: 'auto',
              }}
            >
              Login
            </StyledButton>
          </Toolbar>
        </Container>
      </StyledAppBar>

      {/* Render the login form dialog */}
      <Form open={openLoginForm} onClose={handleCloseLoginForm} />
    </>
  );
};

export default Header;