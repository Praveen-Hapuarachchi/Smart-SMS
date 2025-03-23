import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { sendUserAuthRequest } from '../../api-helpers/api-helpers';
import { jwtDecode } from 'jwt-decode';

// Styled components
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '12px',
    background: 'linear-gradient(145deg, #ffffff, #f0f4f8)', // Gradient background
    boxShadow: theme.shadows[5],
    width: { xs: '90%', sm: 400 },
    maxWidth: '400px',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.02)',
    },
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  textAlign: 'center',
  fontWeight: 'bold',
  color: '#1976d2',
  borderBottom: '2px solid #1976d2',
  paddingBottom: '8px',
  marginBottom: '16px',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    transition: 'border-color 0.3s ease',
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.dark,
    },
  },
  '& .MuiInputLabel-root': {
    color: '#555',
    fontWeight: '500',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: theme.palette.primary.main,
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  textTransform: 'uppercase',
  fontWeight: 'bold',
  padding: '10px 0',
  backgroundColor: '#1976d2',
  color: '#fff',
  transition: 'transform 0.2s ease, background-color 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
    backgroundColor: theme.palette.primary.dark,
    boxShadow: theme.shadows[2],
  },
}));

const FormDialog = ({ open = false, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await sendUserAuthRequest({ email, password });

      if (response && response.token) {
        const token = response.token;
        localStorage.setItem('jwtToken', token);

        const decodedToken = jwtDecode(token);
        console.log('Decoded Token:', decodedToken);

        const userRole = decodedToken.role;
        const userId = decodedToken.id;
        const userName = decodedToken.fullName;
        console.log('User Role:', userRole);
        console.log('User ID:', userId);

        localStorage.setItem('userId', userId);
        localStorage.setItem('userName', userName);

        if (userRole === 'ROLE_PRINCIPAL') {
          console.log('Navigating to Principal Dashboard');
          navigate('/protected/principal');
        } else if (userRole === 'ROLE_TEACHER') {
          console.log('Navigating to Teacher Dashboard');
          navigate('/protected/teacher');
        } else if (userRole === 'ROLE_STUDENT') {
          console.log('Navigating to Student Dashboard');
          navigate('/protected/student');
        } else {
          setError('Unknown role, unable to navigate.');
          console.error('Unrecognized role:', userRole);
        }
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (error) {
      setError('An error occurred during login.');
      console.error('Login error:', error);
    }
  };

  return (
    <StyledDialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <StyledDialogTitle id="form-dialog-title">Login</StyledDialogTitle>
      <DialogContent>
        <form onSubmit={handleFormSubmit}>
          <StyledTextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            variant="outlined"
          />
          <StyledTextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            variant="outlined"
          />
          {error && (
            <Typography
              sx={{
                color: '#d32f2f',
                fontSize: '14px',
                mt: 1,
                mb: 2,
                textAlign: 'center',
              }}
            >
              {error}
            </Typography>
          )}
          <StyledButton type="submit" variant="contained" fullWidth>
            Login
          </StyledButton>
        </form>
      </DialogContent>
    </StyledDialog>
  );
};

export default FormDialog;