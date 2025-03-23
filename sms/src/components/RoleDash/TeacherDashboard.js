import React, { useState, useEffect } from 'react';
import { registerStudent, createSubject, getAllCreatedSubjects } from '../../api-helpers/api-helpers';
import HeaderForUser from './HeaderForUser';
import { useNavigate } from 'react-router-dom';
import Footer from '../Footer';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Box,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import SubjectIcon from '@mui/icons-material/Subject';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GradeIcon from '@mui/icons-material/Grade';
import ClassIcon from '@mui/icons-material/Class';

const TeacherDashboard = () => {
  const [studentData, setStudentData] = useState({ fullName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [subjectData, setSubjectData] = useState({
    name: '',
    year: 2024,
    grade: 'Grade 7',
    subjectClass: 'A',
  });
  const [subjects, setSubjects] = useState([]);
  const [mySubjects, setMySubjects] = useState([]);
  const [hoveredSubject, setHoveredSubject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      setError(null);

      try {
        const fetchedSubjects = await getAllCreatedSubjects();
        if (fetchedSubjects) {
          setMySubjects(fetchedSubjects);
        } else {
          setError('Failed to fetch your subjects.');
        }
      } catch (err) {
        setError('Error fetching your subjects.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const registeredStudent = await registerStudent(studentData);
      if (registeredStudent) {
        setStudents([...students, registeredStudent]);
        setStudentData({ fullName: '', email: '', password: '' });
      } else {
        setError('Failed to register student.');
      }
    } catch (err) {
      setError('Error registering student.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const createdSubject = await createSubject(subjectData);
      if (createdSubject) {
        setSubjects([...subjects, createdSubject]);
        setMySubjects([...mySubjects, createdSubject]); // Update My Subjects list
        setSubjectData({ name: '', year: 2024, grade: 'Grade 7', subjectClass: 'A' });
      } else {
        setError('Failed to create subject.');
      }
    } catch (err) {
      setError('Error creating subject.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectClick = (subjectId) => {
    navigate(`/subject/${subjectId}`);
  };

  return (
    <div>
      <HeaderForUser />
      <Box sx={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <Typography variant="h4" gutterBottom>
          Teacher Dashboard
        </Typography>

        {/* Add New Student Card */}
        <Card sx={{ marginBottom: '20px', boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Add New Student
            </Typography>
            <form onSubmit={handleAddStudent}>
              <TextField
                fullWidth
                label="Full Name"
                value={studentData.fullName}
                onChange={(e) => setStudentData({ ...studentData, fullName: e.target.value })}
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
                value={studentData.email}
                onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
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
                value={studentData.password}
                onChange={(e) => setStudentData({ ...studentData, password: e.target.value })}
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
                {loading ? 'Adding...' : 'Add Student'}
              </Button>
              {error && (
                <Typography color="error" sx={{ marginTop: '10px' }}>
                  {error}
                </Typography>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Create New Subject Card */}
        <Card sx={{ marginBottom: '20px', boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Create New Subject
            </Typography>
            <form onSubmit={handleCreateSubject}>
              <TextField
                fullWidth
                label="Subject Name"
                value={subjectData.name}
                onChange={(e) => setSubjectData({ ...subjectData, name: e.target.value })}
                required
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SubjectIcon />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />
              <Select
                fullWidth
                label="Year"
                value={subjectData.year}
                onChange={(e) => setSubjectData({ ...subjectData, year: e.target.value })}
                required
                margin="normal"
                sx={{ marginTop: '16px', marginBottom: '8px' }}
                startAdornment={
                  <InputAdornment position="start">
                    <CalendarTodayIcon />
                  </InputAdornment>
                }
              >
                <MenuItem value={2024}>2024</MenuItem>
                <MenuItem value={2025}>2025</MenuItem>
                <MenuItem value={2026}>2026</MenuItem>
              </Select>
              <Select
                fullWidth
                label="Grade"
                value={subjectData.grade}
                onChange={(e) => setSubjectData({ ...subjectData, grade: e.target.value })}
                required
                margin="normal"
                sx={{ marginTop: '16px', marginBottom: '8px' }}
                startAdornment={
                  <InputAdornment position="start">
                    <GradeIcon />
                  </InputAdornment>
                }
              >
                <MenuItem value="Grade 6">Grade 6</MenuItem>
                <MenuItem value="Grade 7">Grade 7</MenuItem>
                <MenuItem value="Grade 8">Grade 8</MenuItem>
                <MenuItem value="Grade 9">Grade 9</MenuItem>
              </Select>
              <Select
                fullWidth
                label="Subject Class"
                value={subjectData.subjectClass}
                onChange={(e) => setSubjectData({ ...subjectData, subjectClass: e.target.value })}
                required
                margin="normal"
                sx={{ marginTop: '16px', marginBottom: '8px' }}
                startAdornment={
                  <InputAdornment position="start">
                    <ClassIcon />
                  </InputAdornment>
                }
              >
                <MenuItem value="A">A</MenuItem>
                <MenuItem value="B">B</MenuItem>
                <MenuItem value="C">C</MenuItem>
                <MenuItem value="D">D</MenuItem>
              </Select>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                fullWidth
                sx={{ marginTop: '20px' }}
              >
                {loading ? 'Creating...' : 'Create Subject'}
              </Button>
              {error && (
                <Typography color="error" sx={{ marginTop: '10px' }}>
                  {error}
                </Typography>
              )}
            </form>
          </CardContent>
        </Card>

        {/* My Subjects Section */}
        <Typography variant="h5" gutterBottom>
          My Subjects
        </Typography>
        {loading && <Typography>Loading subjects...</Typography>}
        {error && (
          <Typography color="error" sx={{ marginBottom: '20px' }}>
            {error}
          </Typography>
        )}
        {mySubjects.length > 0 ? (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="subjects table">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#2196F3' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Subject Name</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Year</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Grade</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Class</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">ID</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mySubjects.map((subject) => (
                  <TableRow
                    key={subject.id}
                    onClick={() => handleSubjectClick(subject.id)}
                    onMouseEnter={() => setHoveredSubject(subject.id)}
                    onMouseLeave={() => setHoveredSubject(null)}
                    sx={{
                      backgroundColor: hoveredSubject === subject.id ? '#f0f0f0' : 'transparent',
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: '#f5f5f5' },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {subject.name}
                    </TableCell>
                    <TableCell align="center">{subject.year}</TableCell>
                    <TableCell align="center">{subject.grade}</TableCell>
                    <TableCell align="center">{subject.subjectClass}</TableCell>
                    <TableCell align="center">{subject.id}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>No subjects available.</Typography>
        )}
      </Box>
      <Footer />
    </div>
  );
};

export default TeacherDashboard;