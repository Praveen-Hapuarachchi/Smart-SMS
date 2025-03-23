import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import SchoolIcon from '@mui/icons-material/School';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import Avatar from '@mui/material/Avatar';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../../api-helpers/api-helpers';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MessageIcon from '@mui/icons-material/Message';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';

// Styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(90deg, #1976d2, #42a5f5)', // Gradient background
  boxShadow: theme.shadows[4],
  padding: '4px 0',
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: '#fff',
  transition: 'transform 0.2s ease, background-color 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    transform: 'scale(1.1)',
  },
}));

const StyledModalBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 400 },
  background: 'linear-gradient(145deg, #ffffff, #f0f4f8)',
  borderRadius: '12px',
  boxShadow: theme.shadows[5],
  padding: '24px',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translate(-50%, -52%)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  textTransform: 'uppercase',
  fontWeight: 'bold',
  transition: 'transform 0.2s ease, background-color 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
    backgroundColor: theme.palette.primary.dark,
  },
}));

// Helper function to convert string to color
function stringToColor(string) {
  let hash = 0;
  for (let i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

// Function to create avatar initials from name
function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
      width: 48,
      height: 48,
      fontSize: '1.2rem',
      transition: 'transform 0.2s ease',
      '&:hover': {
        transform: 'scale(1.1)',
      },
    },
    children: `${name.split(' ')[0][0] || ''}${name.split(' ')[1] ? name.split(' ')[1][0] : ''}`,
  };
}

const HeaderForUser = () => {
  const [userDetails, setUserDetails] = useState({ id: '', name: '', email: '', role: '' });
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editProfileData, setEditProfileData] = useState({ fullName: '', password: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const decoded = jwtDecode(token);
      console.log("Decoded Token:", decoded);
      setUserDetails({
        id: decoded.id || 'N/A',
        name: decoded.fullName || 'N/A',
        email: decoded.sub || 'N/A',
        role: decoded.role || 'N/A',
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
  };

  const handleEditToggle = () => {
    setEditProfileData({ fullName: userDetails.name, password: '' });
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = async () => {
    const updatedUser = await updateUser(userDetails.id, {
      fullName: editProfileData.fullName,
      password: editProfileData.password,
    });

    if (updatedUser) {
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        name: editProfileData.fullName,
      }));
      setIsEditing(false);
    }
  };

  const handleMessagesClick = () => {
    navigate('/messages');
  };

  const handleTitleClick = () => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log('Decoded Token:', decodedToken);

      const userRole = decodedToken.role;

      if (userRole === 'ROLE_PRINCIPAL') {
        navigate('/protected/principal');
      } else if (userRole === 'ROLE_TEACHER') {
        navigate('/protected/teacher');
      } else if (userRole === 'ROLE_STUDENT') {
        navigate('/protected/student');
      } else {
        console.error('Unrecognized role:', userRole);
      }
    }
  };

  return (
    <>
      <StyledAppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <SchoolIcon sx={{ display: { xs: 'flex', md: 'flex' }, mr: 1, fontSize: '3rem' }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              onClick={handleTitleClick}
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'flex' },
                fontFamily: '"Roboto", "Arial", sans-serif',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
            >
              STUDENT MANAGEMENT SYSTEM
            </Typography>

            <Box sx={{ flexGrow: 1 }} />
            <StyledIconButton
              color="inherit"
              sx={{ mr: 2 }}
              onClick={() => alert('Notifications clicked!')}
            >
              <NotificationsIcon sx={{ fontSize: '2rem' }} />
            </StyledIconButton>

            <StyledIconButton
              color="inherit"
              sx={{ mr: 2 }}
              onClick={handleMessagesClick}
            >
              <MessageIcon sx={{ fontSize: '2rem' }} />
            </StyledIconButton>

            <Avatar {...stringAvatar(userDetails.name)} onClick={handleOpen} sx={{ cursor: 'pointer', ml: 'auto' }} />
          </Toolbar>
        </Container>
      </StyledAppBar>

      <Modal open={open} onClose={handleClose}>
        <StyledModalBox>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              color: '#1976d2',
              mb: 3,
              textAlign: 'center',
              borderBottom: '2px solid #1976d2',
              pb: 1,
            }}
          >
            User Details
          </Typography>
          {!isEditing ? (
            <>
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ fontSize: '16px', color: '#555', mb: 1 }}>
                  <strong>ID:</strong> {userDetails.id}
                </Typography>
                <Typography sx={{ fontSize: '16px', color: '#555', mb: 1 }}>
                  <strong>Name:</strong> {userDetails.name}
                </Typography>
                <Typography sx={{ fontSize: '16px', color: '#555', mb: 1 }}>
                  <strong>Email:</strong> {userDetails.email}
                </Typography>
                <Typography sx={{ fontSize: '16px', color: '#555', mb: 1 }}>
                  <strong>Role:</strong> {userDetails.role}
                </Typography>
              </Box>
              <StyledButton
                variant="contained"
                onClick={handleEditToggle}
                startIcon={<EditIcon />}
                sx={{
                  mb: 2,
                  backgroundColor: '#3f51b5',
                  color: '#fff',
                  width: '100%',
                }}
              >
                Edit Profile
              </StyledButton>
            </>
          ) : (
            <>
              <TextField
                label="Full Name"
                name="fullName"
                value={editProfileData.fullName}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                value={editProfileData.password}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <StyledButton
                variant="contained"
                onClick={handleSave}
                sx={{
                  mb: 2,
                  backgroundColor: '#3f51b5',
                  color: '#fff',
                  width: '100%',
                }}
              >
                Save
              </StyledButton>
            </>
          )}

          <StyledButton
            variant="outlined"
            endIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              color: '#d32f2f',
              borderColor: '#d32f2f',
              width: '100%',
              '&:hover': {
                backgroundColor: '#d32f2f',
                color: '#fff',
                borderColor: '#d32f2f',
                transform: 'scale(1.02)',
              },
            }}
          >
            Logout
          </StyledButton>
        </StyledModalBox>
      </Modal>
    </>
  );
};

export default HeaderForUser;