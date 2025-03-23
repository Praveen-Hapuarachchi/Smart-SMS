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
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Footer from '../Footer';

const columns = [
  { id: 'id', label: 'ID', minWidth: 50 },
  { id: 'name', label: 'Name', minWidth: 150 },
  { id: 'year', label: 'Year', minWidth: 100, align: 'right' },
  { id: 'grade', label: 'Grade', minWidth: 100, align: 'right' },
  { id: 'subjectClass', label: 'Class', minWidth: 50, align: 'left' },
  { id: 'teacherName', label: 'Teacher', minWidth: 200 },
  { id: 'teacherEmail', label: 'Teacher Email', minWidth: 200 },
];

// Styled components for the table
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    padding: '12px 16px',
    borderBottom: `2px solid ${theme.palette.primary.main}`,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: '12px 16px',
    borderBottom: `1px solid ${theme.palette.grey[200]}`,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.grey[50],
  },
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
    transition: 'background-color 0.3s ease',
    transform: 'scale(1.01)',
    boxShadow: theme.shadows[2],
  },
  transition: 'transform 0.2s ease',
}));

const StyledModalBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 500 },
  maxHeight: '80vh',
  overflowY: 'auto',
  background: 'linear-gradient(145deg, #ffffff, #f0f4f8)',
  borderRadius: '12px',
  boxShadow: theme.shadows[5],
  padding: '24px',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translate(-50%, -52%)',
  },
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

      const sortedData = formattedData.sort((a, b) => b.grade.localeCompare(a.grade));
      setAllSubjects(sortedData);
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

  useEffect(() => {
    handleFetchSubjects();
    handleFetchEnrolledSubjects();
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f5f7fa' }}>
      <HeaderForUser />
      <Box sx={{ flexGrow: 1, padding: { xs: '16px', md: '32px' }, maxWidth: '1400px', margin: '0 auto' }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: '#1976d2',
            textAlign: 'center',
            mb: 4,
            letterSpacing: '0.5px',
          }}
        >
          Student Dashboard
        </Typography>

        {error && (
          <Typography
            sx={{
              color: '#d32f2f',
              fontSize: '16px',
              textAlign: 'center',
              mb: 2,
            }}
          >
            {error}
          </Typography>
        )}

        {/* All Subjects Section */}
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: '#424242',
            borderBottom: '2px solid #1976d2',
            pb: 1,
            mb: 3,
          }}
        >
          All Subjects
        </Typography>
        <Paper
          sx={{
            width: '100%',
            overflow: 'hidden',
            mb: 4,
            boxShadow: 5,
            borderRadius: '12px',
            background: 'linear-gradient(145deg, #ffffff, #f9fafb)',
          }}
        >
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
                {allSubjects
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
            count={allSubjects.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                fontSize: '14px',
                color: '#555',
              },
            }}
          />
        </Paper>

        {/* Enrolled Subjects Section */}
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: '#424242',
            borderBottom: '2px solid #1976d2',
            pb: 1,
            mb: 3,
          }}
        >
          Enrolled Subjects
        </Typography>
        <Paper
          sx={{
            width: '100%',
            overflow: 'hidden',
            mb: 4,
            boxShadow: 5,
            borderRadius: '12px',
            background: 'linear-gradient(145deg, #ffffff, #f9fafb)',
          }}
        >
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
                {enrolledSubjects
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
            count={enrolledSubjects.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                fontSize: '14px',
                color: '#555',
              },
            }}
          />
        </Paper>

        {/* Character Certificate Request Section */}
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: '#424242',
            borderBottom: '2px solid #1976d2',
            pb: 1,
            mb: 3,
          }}
        >
          Request Character Certificate
        </Typography>
        <StyledButton variant="contained" onClick={handleOpen}>
          Request
        </StyledButton>
        <Modal open={open} onClose={handleClose}>
          <StyledModalBox>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: '#1976d2',
                mb: 3,
                textAlign: 'center',
                borderBottom: '2px solid #1976d2',
                pb: 1,
              }}
            >
              Character Certificate Request Form
            </Typography>
            <form onSubmit={handleSubmit}>
              <StyledTextField
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <StyledTextField
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
              <StyledTextField
                label="Admission Number"
                name="admissionNumber"
                value={formData.admissionNumber}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <StyledTextField
                label="National Identity Card (NIC) Number"
                name="nicNumber"
                value={formData.nicNumber}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <StyledTextField
                label="Grade and Class"
                name="gradeAndClass"
                value={formData.gradeAndClass}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <StyledTextField
                label="Period of Study"
                name="periodOfStudy"
                value={formData.periodOfStudy}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <StyledTextField
                label="Subjects Studied"
                name="subjectsStudied"
                value={formData.subjectsStudied}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <StyledTextField
                label="O/L Result"
                name="olResult"
                value={formData.olResult}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <StyledTextField
                label="A/L Result"
                name="alResult"
                value={formData.alResult}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <StyledTextField
                label="Extra Curricular Activities"
                name="extraCurricular"
                value={formData.extraCurricular}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <StyledTextField
                label="Reason for Request"
                name="reasonForRequest"
                value={formData.reasonForRequest}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <StyledButton
                variant="contained"
                type="submit"
                fullWidth
                sx={{ mt: 2 }}
              >
                Submit Request
              </StyledButton>
            </form>
          </StyledModalBox>
        </Modal>
      </Box>
      <Footer />
    </Box>
  );
};

export default StudentDashboard;