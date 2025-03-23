import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import HeaderForUser from './HeaderForUser';
import Footer from '../Footer';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Card,
  CardContent,
  Tooltip,
  TableContainer,
  IconButton,
  Chip, // Added for status badges
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { getSubjectById, base_url } from '../../api-helpers/api-helpers';
import SendIcon from '@mui/icons-material/Send';

// Styled components for custom table styling
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.MuiTableCell-head`]: {
    backgroundColor: theme.palette.primary.dark, // Darker shade for header
    color: theme.palette.common.white,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    padding: '12px 16px',
    borderBottom: `2px solid ${theme.palette.primary.main}`,
  },
  [`&.MuiTableCell-body`]: {
    fontSize: 14,
    padding: '12px 16px',
    borderBottom: `1px solid ${theme.palette.grey[200]}`,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.grey[50], // Subtle alternating row color
  },
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
    transition: 'background-color 0.3s ease',
    transform: 'scale(1.01)', // Subtle scale effect on hover
    boxShadow: theme.shadows[2],
  },
  transition: 'transform 0.2s ease',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: theme.shadows[5],
  borderRadius: '12px',
  background: 'linear-gradient(145deg, #ffffff, #f0f4f8)', // Gradient background
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)', // Lift effect on hover
    boxShadow: theme.shadows[8],
  },
}));

const ReviewAttendancePage = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendanceDates, setAttendanceDates] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [error, setError] = useState(null);

  const fetchEnrolledStudents = useCallback(async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        throw new Error('No token found. Please log in.');
      }

      const response = await axios.get(`${base_url}/api/subjects/${subjectId}/students`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setStudents(response.data);
      } else {
        console.error('Error fetching enrolled students.');
      }
    } catch (error) {
      console.error('Error fetching enrolled students:', error.response ? error.response.data : error.message);
      setError('Failed to fetch enrolled students.');
    }
  }, [subjectId]);

  const fetchAttendanceData = useCallback(async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        throw new Error('No token found. Please log in.');
      }

      const datesResponse = await axios.get(`${base_url}/api/attendance/subject/${subjectId}/dates`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const dates = datesResponse.data || [];
      setAttendanceDates(dates);

      const attendanceByDate = {};
      for (const date of dates) {
        const attendanceResponse = await axios.get(
          `${base_url}/api/attendance/subject/${subjectId}?date=${date}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        attendanceByDate[date] = attendanceResponse.data || [];
      }
      setAttendanceData(attendanceByDate);
    } catch (error) {
      console.error('Error fetching attendance data:', error.response ? error.response.data : error.message);
      setError('Failed to fetch attendance data.');
    }
  }, [subjectId]);

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        if (subjectId) {
          const fetchedSubject = await getSubjectById(subjectId);
          setSubject(fetchedSubject);
        } else {
          setError('Invalid subject ID.');
        }
      } catch (err) {
        setError('Error fetching subject.');
      }
    };

    fetchSubject();
    fetchEnrolledStudents();
    fetchAttendanceData();
  }, [subjectId, fetchEnrolledStudents, fetchAttendanceData]);

  const getAttendanceStatus = (studentId, date) => {
    const attendanceRecords = attendanceData[date] || [];
    const record = attendanceRecords.find((att) => att.student.id === studentId);
    return record ? (record.status === 'PRESENT' ? 'Present' : 'Absent') : 'N/A';
  };

  const handleChatNavigation = async (studentId, studentName, attendancePercentage) => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        throw new Error('No token found. Please log in.');
      }

      const messageContent = `Your current attendance percentage for the subject "${subject.name}" (ID: ${subject.id}) conducted by ${subject.teacher.fullName} is ${attendancePercentage}%. Please ensure to maintain good attendance.`;

      await axios.post(
        `${base_url}/api/messages/send`,
        {
          senderId: localStorage.getItem('userId'),
          receiverId: studentId,
          content: messageContent,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      navigate(`/chat/${studentId}`, { state: { senderId: studentId, senderName: studentName } });
    } catch (error) {
      console.error('Error sending message:', error.response ? error.response.data : error.message);
    }
  };

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', padding: '20px' }}>
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Box>
    );
  }

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
          Review Attendance
        </Typography>

        {/* Subject Details Card */}
        {subject ? (
          <StyledCard sx={{ marginBottom: '32px' }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                  color: '#424242',
                  borderBottom: '2px solid #1976d2',
                  pb: 1,
                  mb: 2,
                }}
              >
                Subject Details
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: '16px' }}>
                <Typography sx={{ fontSize: '16px', color: '#555' }}>
                  <strong>ID:</strong> {subject.id || 'N/A'}
                </Typography>
                <Typography sx={{ fontSize: '16px', color: '#555' }}>
                  <strong>Name:</strong> {subject.name || 'N/A'}
                </Typography>
                <Typography sx={{ fontSize: '16px', color: '#555' }}>
                  <strong>Teacher:</strong> {subject?.teacher?.fullName || 'N/A'}
                </Typography>
                <Typography sx={{ fontSize: '16px', color: '#555' }}>
                  <strong>Email:</strong> {subject?.teacher?.email || 'N/A'}
                </Typography>
                <Typography sx={{ fontSize: '16px', color: '#555' }}>
                  <strong>Year:</strong> {subject.year || 'N/A'}
                </Typography>
                <Typography sx={{ fontSize: '16px', color: '#555' }}>
                  <strong>Grade:</strong> {subject.grade || 'N/A'}
                </Typography>
                <Typography sx={{ fontSize: '16px', color: '#555' }}>
                  <strong>Class:</strong> {subject.subjectClass || 'N/A'}
                </Typography>
              </Box>
            </CardContent>
          </StyledCard>
        ) : (
          <Typography sx={{ textAlign: 'center', color: 'grey.600', fontStyle: 'italic' }}>
            Loading subject details...
          </Typography>
        )}

        {/* Attendance Table */}
        <TableContainer
          component={Paper}
          sx={{
            boxShadow: 5,
            borderRadius: '12px',
            overflow: 'hidden',
            background: 'linear-gradient(145deg, #ffffff, #f9fafb)',
          }}
        >
          <Table>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Student Name</StyledTableCell>
                <StyledTableCell align="center">Student ID</StyledTableCell>
                <StyledTableCell align="center">Student Email</StyledTableCell>
                {attendanceDates.map((date, index) => (
                  <StyledTableCell key={index} align="center">
                    {new Date(date).toLocaleDateString()}
                  </StyledTableCell>
                ))}
                <StyledTableCell align="center">Attendance %</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => {
                const totalDates = attendanceDates.length;
                const presentDates = attendanceDates.filter((date) => {
                  const attendanceRecords = attendanceData[date] || [];
                  const record = attendanceRecords.find((att) => att.student.id === student.id);
                  return record && record.status === 'PRESENT';
                }).length;
                const attendancePercentage = totalDates > 0 ? ((presentDates / totalDates) * 100).toFixed(2) : '0.00';

                let backgroundColor = '';
                let tooltipText = '';
                let chipColor = 'default';
                const isPoorAttendance = attendancePercentage < 70;
                if (attendancePercentage >= 80) {
                  backgroundColor = '#e8f5e9';
                  tooltipText = 'Excellent Attendance';
                  chipColor = 'success';
                } else if (attendancePercentage >= 70) {
                  backgroundColor = '#fff9c4';
                  tooltipText = 'Average Attendance';
                  chipColor = 'warning';
                } else {
                  backgroundColor = '#ffcdd2';
                  tooltipText = 'Poor Attendance';
                  chipColor = 'error';
                }

                return (
                  <StyledTableRow key={student.id}>
                    <StyledTableCell>{student.fullName}</StyledTableCell>
                    <StyledTableCell align="center">{student.id}</StyledTableCell>
                    <StyledTableCell align="center">{student.email}</StyledTableCell>
                    {attendanceDates.map((date, index) => (
                      <StyledTableCell key={index} align="center">
                        <Chip
                          label={getAttendanceStatus(student.id, date)}
                          color={getAttendanceStatus(student.id, date) === 'Present' ? 'success' : 'error'}
                          size="small"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </StyledTableCell>
                    ))}
                    <StyledTableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <Tooltip title={tooltipText} arrow>
                          <Chip
                            label={`${attendancePercentage}%`}
                            sx={{
                              backgroundColor,
                              fontWeight: 'bold',
                              color: chipColor === 'error' ? '#d32f2f' : chipColor === 'warning' ? '#f57c00' : '#388e3c',
                            }}
                            color={chipColor}
                          />
                        </Tooltip>
                        {isPoorAttendance && (
                          <Tooltip title={`Message ${student.fullName} about their attendance`} arrow>
                            <IconButton
                              color="primary"
                              onClick={() => handleChatNavigation(student.id, student.fullName, attendancePercentage)}
                              sx={{
                                '&:hover': {
                                  transform: 'scale(1.1)',
                                  transition: 'transform 0.2s ease',
                                },
                              }}
                            >
                              <SendIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Footer />
    </Box>
  );
};

export default ReviewAttendancePage;