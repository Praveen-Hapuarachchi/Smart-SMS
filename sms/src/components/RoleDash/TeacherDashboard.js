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
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  ThemeProvider,
  createTheme,
  styled,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TablePagination,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import SubjectIcon from '@mui/icons-material/Subject';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GradeIcon from '@mui/icons-material/Grade';
import ClassIcon from '@mui/icons-material/Class';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Define a modern theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
    },
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: '#1976d2',
    },
    h2: {
      fontSize: '1.8rem',
      fontWeight: 500,
      color: '#333',
    },
    h3: {
      fontSize: '1.4rem',
      fontWeight: 500,
      color: '#555',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          padding: '10px 20px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
          },
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          marginBottom: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          '&:before': {
            display: 'none',
          },
        },
      },
    },
  },
});

const columns = [
  { id: 'name', label: 'Subject Name', minWidth: 150 },
  { id: 'year', label: 'Year', minWidth: 100, align: 'center' },
  { id: 'grade', label: 'Grade', minWidth: 100, align: 'center' },
  { id: 'subjectClass', label: 'Class', minWidth: 100, align: 'center' },
  { id: 'id', label: 'ID', minWidth: 100, align: 'center' },
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
    fontWeight: 600,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: '#444',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.background.paper,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    transition: 'background-color 0.3s ease',
  },
}));

const Main = styled('main')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
}));

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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
        setMySubjects([...mySubjects, createdSubject]);
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Group my subjects by grade
  const subjectsByGrade = mySubjects.reduce((acc, subject) => {
    const grade = subject.grade;
    if (!acc[grade]) {
      acc[grade] = [];
    }
    acc[grade].push(subject);
    return acc;
  }, {});

  const uniqueGrades = Object.keys(subjectsByGrade).sort();

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
        <Main>
          <HeaderForUser />
          <Box sx={{ maxWidth: '1200px', mx: 'auto', mt: 4 }}>
            <Typography variant="h1" sx={{ mb: 4, textAlign: 'center' }}>
              Teacher Dashboard
            </Typography>
            {error && (
              <Typography sx={{ color: 'red', textAlign: 'center', mb: 2 }}>
                {error}
              </Typography>
            )}

            {/* Add New Student Card */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h2" sx={{ mb: 2 }}>
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
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={studentData.email}
                    onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
                    required
                    margin="normal"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={studentData.password}
                    onChange={(e) => setStudentData({ ...studentData, password: e.target.value })}
                    required
                    margin="normal"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    disabled={loading}
                    fullWidth
                    sx={{ mt: 3 }}
                  >
                    {loading ? 'Adding...' : 'Add Student'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Create New Subject Card */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h2" sx={{ mb: 2 }}>
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
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SubjectIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Select
                    fullWidth
                    value={subjectData.year}
                    onChange={(e) => setSubjectData({ ...subjectData, year: e.target.value })}
                    required
                    margin="normal"
                    variant="outlined"
                    sx={{ mt: 2, mb: 1 }}
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
                    value={subjectData.grade}
                    onChange={(e) => setSubjectData({ ...subjectData, grade: e.target.value })}
                    required
                    margin="normal"
                    variant="outlined"
                    sx={{ mt: 2, mb: 1 }}
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
                    value={subjectData.subjectClass}
                    onChange={(e) => setSubjectData({ ...subjectData, subjectClass: e.target.value })}
                    required
                    margin="normal"
                    variant="outlined"
                    sx={{ mt: 2, mb: 1 }}
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
                    sx={{ mt: 3 }}
                  >
                    {loading ? 'Creating...' : 'Create Subject'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* My Subjects Section */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h2" sx={{ mb: 2 }}>
                  My Subjects
                </Typography>
                {loading && <Typography>Loading subjects...</Typography>}
                {uniqueGrades.length > 0 ? (
                  uniqueGrades.map((grade) => (
                    <Accordion key={grade}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel-${grade}-content`}
                        id={`panel-${grade}-header`}
                      >
                        <Typography variant="h3">{grade}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 'none' }}>
                          <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="customized table">
                              <TableHead>
                                <TableRow>
                                  {columns.map((column) => (
                                    <StyledTableCell
                                      key={column.id}
                                      align={column.align}
                                      style={{ minWidth: column.minWidth }}
                                    >
                                      {column.label}
                                    </StyledTableCell>
                                  ))}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {subjectsByGrade[grade]
                                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                  .map((subject) => (
                                    <StyledTableRow
                                      key={subject.id}
                                      onClick={() => handleSubjectClick(subject.id)}
                                      style={{ cursor: 'pointer' }}
                                    >
                                      {columns.map((column) => {
                                        const value = subject[column.id];
                                        return (
                                          <StyledTableCell key={column.id} align={column.align}>
                                            {value}
                                          </StyledTableCell>
                                        );
                                      })}
                                    </StyledTableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={subjectsByGrade[grade].length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                          />
                        </Paper>
                      </AccordionDetails>
                    </Accordion>
                  ))
                ) : (
                  <Typography>No subjects available.</Typography>
                )}
              </CardContent>
            </Card>
          </Box>
          <Footer />
        </Main>
      </Box>
    </ThemeProvider>
  );
};

export default TeacherDashboard;