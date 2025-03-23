import React, { useState, useEffect } from 'react';
import { getAllUsers, registerTeacher, deleteUser } from '../../api-helpers/api-helpers';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import HeaderForUser from '../../components/RoleDash/HeaderForUser';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Footer from '../Footer';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const PrincipalDashboard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [teacherData, setTeacherData] = useState({ fullName: '', email: '', password: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      console.log('No token found, redirecting to login.');
      navigate('/login');
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const role = decodedToken.role;

      if (role !== 'ROLE_PRINCIPAL' && role !== 'ROLE_PRINCIPLE') {
        console.log('Unauthorized access attempt, redirecting to login.');
        navigate('/login');
      }
    } catch (error) {
      console.error('Token decoding error:', error);
      localStorage.removeItem('jwtToken');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getAllUsers();
        if (data) {
          setUsers(data);
        } else {
          setError('No users found.');
        }
      } catch (err) {
        setError('Failed to fetch users.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const registeredTeacher = await registerTeacher(teacherData);
      if (registeredTeacher) {
        setUsers([...users, registeredTeacher]);
        setTeacherData({ fullName: '', email: '', password: '' });
        setShowForm(false);
      } else {
        setError('Failed to register teacher.');
      }
    } catch (err) {
      setError('Error registering teacher.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const deletedUser = await deleteUser(userId, token);
      if (deletedUser) {
        setUsers(users.filter((user) => user.id !== userId));
        console.log(`User with ID ${userId} deleted.`);
      } else {
        console.error('Failed to delete user.');
      }
    }
  };

  const teachers = users.filter((user) => user.role === 'ROLE_TEACHER');
  const students = users.filter((user) => user.role === 'ROLE_STUDENT');

  return (
    <div>
      <HeaderForUser />
      <Box sx={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <Typography variant="h4" gutterBottom>
          Principal Dashboard
        </Typography>

        {loading && <Typography>Loading...</Typography>}
        {error && <Typography color="error">{error}</Typography>}

        {/* Teachers Table */}
        {teachers.length > 0 && (
          <div>
            <Typography variant="h5" gutterBottom>
              All Teachers
            </Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Name</StyledTableCell>
                    <StyledTableCell align="right">Email</StyledTableCell>
                    <StyledTableCell align="right">Role</StyledTableCell>
                    <StyledTableCell align="right">ID</StyledTableCell>
                    <StyledTableCell align="center">Action</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {teachers.map((teacher) => (
                    <StyledTableRow key={teacher.id}>
                      <StyledTableCell component="th" scope="row">
                        {teacher.fullName}
                      </StyledTableCell>
                      <StyledTableCell align="right">{teacher.email}</StyledTableCell>
                      <StyledTableCell align="right">{teacher.role}</StyledTableCell>
                      <StyledTableCell align="right">{teacher.id}</StyledTableCell>
                      <StyledTableCell align="center">
                        <Stack direction="row" justifyContent="center" spacing={2}>
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDeleteUser(teacher.id)}
                          >
                            Delete
                          </Button>
                        </Stack>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}

        {/* Students Table */}
        {students.length > 0 && (
          <div style={{ marginTop: '40px' }}>
            <Typography variant="h5" gutterBottom>
              All Students
            </Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Name</StyledTableCell>
                    <StyledTableCell align="right">Email</StyledTableCell>
                    <StyledTableCell align="right">Role</StyledTableCell>
                    <StyledTableCell align="right">ID</StyledTableCell>
                    <StyledTableCell align="center">Action</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student) => (
                    <StyledTableRow key={student.id}>
                      <StyledTableCell component="th" scope="row">
                        {student.fullName}
                      </StyledTableCell>
                      <StyledTableCell align="right">{student.email}</StyledTableCell>
                      <StyledTableCell align="right">{student.role}</StyledTableCell>
                      <StyledTableCell align="right">{student.id}</StyledTableCell>
                      <StyledTableCell align="center">
                        <Stack direction="row" justifyContent="center" spacing={2}>
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDeleteUser(student.id)}
                          >
                            Delete
                          </Button>
                        </Stack>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}

        {/* Button to toggle the form */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowForm(!showForm)}
          sx={{ marginTop: '20px', marginBottom: '20px' }}
        >
          {showForm ? 'Cancel' : 'Add New Teacher'}
        </Button>

        {/* Stylish Form for Adding a Teacher */}
        {showForm && (
          <Card sx={{ maxWidth: 500, margin: '0 auto', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Add New Teacher
              </Typography>
              <form onSubmit={handleAddTeacher}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={teacherData.fullName}
                  onChange={(e) => setTeacherData({ ...teacherData, fullName: e.target.value })}
                  required
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={teacherData.email}
                  onChange={(e) => setTeacherData({ ...teacherData, email: e.target.value })}
                  required
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={teacherData.password}
                  onChange={(e) => setTeacherData({ ...teacherData, password: e.target.value })}
                  required
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  disabled={loading}
                  fullWidth
                  sx={{ marginTop: '20px' }}
                >
                  {loading ? 'Adding...' : 'Add Teacher'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </Box>
      <Footer />
    </div>
  );
};

export default PrincipalDashboard;