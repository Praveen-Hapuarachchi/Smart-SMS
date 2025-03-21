import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
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

const StudentDashboard = () => {
  const [allSubjects, setAllSubjects] = useState([]);
  const [enrolledSubjects, setEnrolledSubjects] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    fullName: localStorage.getItem('userName') || '', // Automatically fill with userName from localStorage
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
  const [open, setOpen] = useState(false); // State to manage modal open/close

  const navigate = useNavigate(); // Initialize navigate hook

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

      // Sort the data by grade in descending order
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
    navigate(`/subject/${subjectId}`); // Navigate to the subject details page
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
    // Handle form submission logic here
    console.log('Form Data:', formData);
    setOpen(false); // Close the modal after form submission
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    // Fetch all subjects when the component mounts
    handleFetchSubjects();
    // Fetch enrolled subjects when the component mounts
    handleFetchEnrolledSubjects();
  }, []);

  return (
    <div>
      <HeaderForUser />
      <h1>Student Dashboard</h1>
      <h2>All Subjects</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Table for all subjects */}
      <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: '20px' }}>
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
                    onClick={() => handleRowClick(row.id)} // Add click handler
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
        />
      </Paper>

      <h2>Enrolled Subjects</h2>
      {/* Table for enrolled subjects */}
      <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: '20px' }}>
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
                    onClick={() => handleRowClick(row.id)} // Add click handler
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
        />
      </Paper>

      <h2>Request to Character Certificate</h2>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Request
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ padding: 3, backgroundColor: '#fff', margin: '20px auto', width: '400px', borderRadius: '8px', boxShadow: 24, maxHeight: '80vh', overflowY: 'auto' }}>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
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
            />
            <TextField
              label="National Identity Card (NIC) Number"
              name="nicNumber"
              value={formData.nicNumber}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Grade and Class"
              name="gradeAndClass"
              value={formData.gradeAndClass}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Period of Study"
              name="periodOfStudy"
              value={formData.periodOfStudy}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Subjects Studied"
              name="subjectsStudied"
              value={formData.subjectsStudied}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="O/L Result"
              name="olResult"
              value={formData.olResult}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="A/L Result"
              name="alResult"
              value={formData.alResult}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Extra Curricular Activities"
              name="extraCurricular"
              value={formData.extraCurricular}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Reason for Request"
              name="reasonForRequest"
              value={formData.reasonForRequest}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mt: 2 }}
            >
              Submit Request
            </Button>
          </form>
        </Box>
      </Modal>

      <Footer />
    </div>
  );
};

export default StudentDashboard;
