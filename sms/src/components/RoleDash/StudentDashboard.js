import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderForUser from './HeaderForUser';
import { getAllSubjects, getEnrolledSubjects } from '../../api-helpers/api-helpers';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Footer from '../Footer';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SchoolIcon from '@mui/icons-material/School';
import BookIcon from '@mui/icons-material/Book';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

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
  { id: 'id', label: 'ID', minWidth: 50 },
  { id: 'name', label: 'Name', minWidth: 150 },
  { id: 'year', label: 'Year', minWidth: 100, align: 'right' },
  { id: 'grade', label: 'Grade', minWidth: 100, align: 'right' },
  { id: 'subjectClass', label: 'Class', minWidth: 50, align: 'left' },
  { id: 'teacherName', label: 'Teacher', minWidth: 200 },
  { id: 'teacherEmail', label: 'Teacher Email', minWidth: 200 },
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

const drawerWidth = 240;

const Main = styled('main')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginLeft: drawerWidth,
  [theme.breakpoints.down('sm')]: {
    marginLeft: 0,
  },
}));

const StudentDashboard = () => {
  const [allSubjects, setAllSubjects] = useState([]);
  const [enrolledSubjects, setEnrolledSubjects] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    fullName: localStorage.getItem('userName') || '',
    dateOfBirth: '',
    admissionNumber: '',
    nicNumber: '',
    gradeAndClass: '',
    periodOfStudy: '',
    subjectsStudied: '',
    olResult: '',
    alResult: '',
    extraCurricular: '',
    reasonForRequest: '',
  });
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();

  const handleFetchSubjects = async () => {
    const data = await getAllSubjects();
    if (data) {
      const formattedData = data.map((subject) => ({
        id: subject.id,
        name: subject.name,
        year: subject.year,
        grade: subject.grade,
        subjectClass: subject.subjectClass,
        teacherName: subject.teacher.fullName,
        teacherEmail: subject.teacher.email,
      }));
      setAllSubjects(formattedData);
      setError(null);
    } else {
      setError('Failed to fetch subjects. Please try again.');
    }
  };

  const handleFetchEnrolledSubjects = async () => {
    const data = await getEnrolledSubjects();
    if (data) {
      const formattedData = data.map((subject) => ({
        id: subject.id,
        name: subject.name,
        year: subject.year,
        grade: subject.grade,
        subjectClass: subject.subjectClass,
        teacherName: subject.teacher.fullName,
        teacherEmail: subject.teacher.email,
      }));
      setEnrolledSubjects(formattedData);
      setError(null);
    } else {
      setError('Failed to fetch enrolled subjects. Please try again.');
    }
  };

  const handleRowClick = (subjectId) => {
    navigate(`/subject/${subjectId}`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    setOpen(false);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    handleFetchSubjects();
    handleFetchEnrolledSubjects();
  }, []);

  // Group all subjects by grade
  const subjectsByGrade = allSubjects.reduce((acc, subject) => {
    const grade = subject.grade;
    if (!acc[grade]) {
      acc[grade] = [];
    }
    acc[grade].push(subject);
    return acc;
  }, {});

  const uniqueGrades = Object.keys(subjectsByGrade).sort();

  // Group enrolled subjects by grade
  const enrolledSubjectsByGrade = enrolledSubjects.reduce((acc, subject) => {
    const grade = subject.grade;
    if (!acc[grade]) {
      acc[grade] = [];
    }
    acc[grade].push(subject);
    return acc;
  }, {});

  const uniqueEnrolledGrades = Object.keys(enrolledSubjectsByGrade).sort();

  const drawer = (
    <div>
      <Typography
        variant="h6"
        sx={{
          p: 2,
          background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
          color: 'white',
          textAlign: 'center',
        }}
      >
        Dashboard Menu
      </Typography>
      <List>
        <ListItem button onClick={() => navigate('/dashboard')}>
          <ListItemIcon>
            <SchoolIcon sx={{ color: '#1976d2' }} />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button onClick={() => navigate('/subjects')}>
          <ListItemIcon>
            <BookIcon sx={{ color: '#1976d2' }} />
          </ListItemIcon>
          <ListItemText primary="Subjects" />
        </ListItem>
        <ListItem button onClick={handleOpen}>
          <ListItemIcon>
            <AssignmentIcon sx={{ color: '#1976d2' }} />
          </ListItemIcon>
          <ListItemText primary="Character Certificate" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
        {/* Sidebar Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>

        {/* Main Content */}
        <Main>
          <HeaderForUser onDrawerToggle={handleDrawerToggle} />
          <Box sx={{ maxWidth: '1200px', mx: 'auto', mt: 4 }}>
            <Typography variant="h1" sx={{ mb: 4, textAlign: 'center' }}>
              Student Dashboard
            </Typography>
            {error && (
              <Typography sx={{ color: 'red', textAlign: 'center', mb: 2 }}>
                {error}
              </Typography>
            )}

            {/* All Subjects Section */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h2" sx={{ mb: 2 }}>
                  All Subjects
                </Typography>
                {uniqueGrades.map((grade) => (
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
                                .map((row) => (
                                  <StyledTableRow
                                    hover
                                    role="checkbox"
                                    tabIndex={-1}
                                    key={row.id}
                                    onClick={() => handleRowClick(row.id)}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    {columns.map((column) => {
                                      const value = row[column.id];
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
                ))}
              </CardContent>
            </Card>

            {/* Enrolled Subjects Section */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h2" sx={{ mb: 2 }}>
                  Enrolled Subjects
                </Typography>
                {uniqueEnrolledGrades.map((grade) => (
                  <Accordion key={grade}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`panel-enrolled-${grade}-content`}
                      id={`panel-enrolled-${grade}-header`}
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
                              {enrolledSubjectsByGrade[grade]
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => (
                                  <StyledTableRow
                                    hover
                                    role="checkbox"
                                    tabIndex={-1}
                                    key={row.id}
                                    onClick={() => handleRowClick(row.id)}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    {columns.map((column) => {
                                      const value = row[column.id];
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
                          count={enrolledSubjectsByGrade[grade].length}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                      </Paper>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </CardContent>
            </Card>

            {/* Character Certificate Request Section */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h2" sx={{ mb: 2 }}>
                  Request to Character Certificate
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpen}
                  startIcon={<AssignmentIcon />}
                >
                  Request Certificate
                </Button>
                <Modal open={open} onClose={handleClose}>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: { xs: '90%', sm: 400 },
                      bgcolor: 'background.paper',
                      borderRadius: '12px',
                      boxShadow: 24,
                      p: 4,
                      maxHeight: '80vh',
                      overflowY: 'auto',
                    }}
                  >
                    <Typography variant="h3" sx={{ mb: 3, textAlign: 'center' }}>
                      Character Certificate Request
                    </Typography>
                    <form onSubmit={handleSubmit}>
                      <TextField
                        label="Full Name"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                      />
                      <TextField
                        label="Date of Birth"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <TextField
                        label="Admission Number"
                        name="admissionNumber"
                        value={formData.admissionNumber}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                      />
                      <TextField
                        label="National Identity Card (NIC) Number"
                        name="nicNumber"
                        value={formData.nicNumber}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                      />
                      <TextField
                        label="Grade and Class"
                        name="gradeAndClass"
                        value={formData.gradeAndClass}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                      />
                      <TextField
                        label="Period of Study"
                        name="periodOfStudy"
                        value={formData.periodOfStudy}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                      />
                      <TextField
                        label="Subjects Studied"
                        name="subjectsStudied"
                        value={formData.subjectsStudied}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                      />
                      <TextField
                        label="O/L Result"
                        name="olResult"
                        value={formData.olResult}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                      />
                      <TextField
                        label="A/L Result"
                        name="alResult"
                        value={formData.alResult}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                      />
                      <TextField
                        label="Extra Curricular Activities"
                        name="extraCurricular"
                        value={formData.extraCurricular}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                      />
                      <TextField
                        label="Reason for Request"
                        name="reasonForRequest"
                        value={formData.reasonForRequest}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                        >
                          Submit Request
                        </Button>
                      </Box>
                    </form>
                  </Box>
                </Modal>
              </CardContent>
            </Card>
          </Box>
          <Footer />
        </Main>
      </Box>
    </ThemeProvider>
  );
};

export default StudentDashboard;