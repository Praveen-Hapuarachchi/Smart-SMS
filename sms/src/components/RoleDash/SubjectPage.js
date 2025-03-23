import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSubjectById, removeMaterial, getAnnouncements, createAnnouncement, deleteAnnouncement, base_url } from '../../api-helpers/api-helpers';
import HeaderForUser from './HeaderForUser';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
  IconButton,
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DescriptionIcon from '@mui/icons-material/Description';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ImageIcon from '@mui/icons-material/Image';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import DownloadIcon from '@mui/icons-material/Download';
import Footer from '../Footer';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: theme.shadows[3],
  borderRadius: '8px',
  marginBottom: '20px',
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: '10px 16px',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
    transition: 'background-color 0.3s ease',
  },
}));

const getFileIcon = (fileType) => {
  switch (fileType) {
    case 'application/pdf':
      return <PictureAsPdfIcon sx={{ mr: 1 }} />;
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    case 'application/msword':
      return <DescriptionIcon sx={{ mr: 1 }} />;
    case 'image/png':
    case 'image/jpeg':
      return <ImageIcon sx={{ mr: 1 }} />;
    default:
      return <InsertDriveFileIcon sx={{ mr: 1 }} />;
  }
};

const getCurrentUserRoles = () => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role ? payload.role : '';
  }
  return '';
};

const SubjectPage = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState(null);
  const [error, setError] = useState(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState(false);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [file, setFile] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementDescription, setAnnouncementDescription] = useState('');
  const [scheduledFor, setScheduledFor] = useState('');
  const [attendanceSubmitted, setAttendanceSubmitted] = useState(false);

  const roles = getCurrentUserRoles();
  const isTeacher = roles === 'ROLE_TEACHER';
  const isStudent = roles === 'ROLE_STUDENT';

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

    const fetchAnnouncements = async () => {
      try {
        const data = await getAnnouncements(subjectId);
        setAnnouncements(data);
      } catch (err) {
        console.error('Error fetching announcements:', err);
      }
    };

    const checkAttendanceStatus = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get(`${base_url}/api/attendance/status/${subjectId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        setAttendanceSubmitted(response.status === 200 && response.data.attendanceSubmitted);
      } catch (error) {
        console.error('Error checking attendance status:', error.response ? error.response.data : error.message);
      }
    };

    const checkEnrollmentStatus = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        console.error('No token found. Please log in.');
        return;
      }
      const decodedToken = jwtDecode(token);
      const studentId = decodedToken.id;

      try {
        const response = await axios.get(`${base_url}/api/subjects/${subjectId}/enrollment-status`, {
          params: { studentId },
          headers: { Authorization: `Bearer ${token}` },
        });
        setEnrollmentStatus(response.data.isEnrolled);
      } catch (error) {
        console.error('Error checking enrollment status:', error.response ? error.response.data : error.message);
        setEnrollmentStatus(false);
      }
    };

    const fetchEnrolledStudents = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get(`${base_url}/api/subjects/${subjectId}/students`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        if (response.status === 200) setEnrolledStudents(response.data);
      } catch (error) {
        console.error('Error fetching enrolled students:', error.response ? error.response.data : error.message);
      }
    };

    const fetchMaterials = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get(`${base_url}/api/subjects/${subjectId}/materials`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        if (response.status === 200) setMaterials(response.data);
      } catch (error) {
        console.error('Error fetching materials:', error.response ? error.response.data : error.message);
      }
    };

    fetchSubject();
    fetchAnnouncements();
    if (isStudent) {
      checkEnrollmentStatus();
      fetchMaterials();
    }
    if (isTeacher) {
      fetchEnrolledStudents();
      fetchMaterials();
      checkAttendanceStatus();
    }
  }, [subjectId, isStudent, isTeacher]);

  const handleFileChange = (event) => setFile(event.target.files[0]);

  const handleFileUpload = async () => {
    if (!file) return console.error('No file selected.');
    const token = localStorage.getItem('jwtToken');
    if (!token) return console.error('No token found. Please log in.');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${base_url}/api/subjects/${subjectId}/materials/upload`, formData, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      if (response.status === 200) {
        setMaterials((prev) => [...prev, response.data]);
        setFile(null);
      }
    } catch (error) {
      console.error('Error uploading material:', error.response ? error.response.data : error.message);
    }
  };

  const handleEnroll = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) return console.error('No token found. Please log in.');
    const decodedToken = jwtDecode(token);
    const studentId = decodedToken.id;

    try {
      const response = await axios.post(`${base_url}/api/subjects/${subjectId}/enroll`, null, {
        params: { studentId },
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) setEnrollmentStatus(true);
    } catch (error) {
      console.error('Error enrolling student:', error.response ? error.response.data : error.message);
    }
  };

  const handleRemoveMaterial = async (materialId) => {
    const isSuccess = await removeMaterial(subjectId, materialId);
    if (isSuccess) setMaterials((prev) => prev.filter((material) => material.id !== materialId));
  };

  const handleCreateAnnouncement = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) return console.error('No token found. Please log in.');

    const newAnnouncement = {
      subjectId,
      title: announcementTitle,
      description: announcementDescription,
      scheduledFor: new Date(scheduledFor).toISOString().slice(0, 19),
    };

    try {
      const response = await createAnnouncement(newAnnouncement);
      if (response) {
        setAnnouncements((prev) => [...prev, response]);
        setAnnouncementTitle('');
        setAnnouncementDescription('');
        setScheduledFor('');
      }
    } catch (err) {
      console.error('Error creating announcement:', err);
    }
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    const response = await deleteAnnouncement(announcementId);
    if (response) setAnnouncements((prev) => prev.filter((ann) => ann.id !== announcementId));
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
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <HeaderForUser />
      <Box sx={{ flexGrow: 1, padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Subject Details
        </Typography>

        {subject ? (
          <>
            {/* Subject Details Card */}
            <StyledCard>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#424242' }}>
                  Subject Information
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <Typography><strong>ID:</strong> {subject.id || 'N/A'}</Typography>
                  <Typography><strong>Name:</strong> {subject.name || 'N/A'}</Typography>
                  <Typography><strong>Teacher:</strong> {subject?.teacher?.fullName || 'N/A'}</Typography>
                  <Typography><strong>Email:</strong> {subject?.teacher?.email || 'N/A'}</Typography>
                  <Typography><strong>Year:</strong> {subject.year || 'N/A'}</Typography>
                  <Typography><strong>Grade:</strong> {subject.grade || 'N/A'}</Typography>
                  <Typography><strong>Class:</strong> {subject.subjectClass || 'N/A'}</Typography>
                </Box>
              </CardContent>
            </StyledCard>

            {/* Teacher Actions */}
            {isTeacher && (
              <Box sx={{ display: 'flex', gap: '16px', mb: 3 }}>
                {!attendanceSubmitted && (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => navigate(`/attendance/${subjectId}`)}
                  >
                    Add Today's Attendance
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => navigate(`/reviewattendance/${subjectId}`)}
                >
                  Review Attendance
                </Button>
              </Box>
            )}
            {isTeacher && attendanceSubmitted && (
              <Typography sx={{ color: 'green', mb: 2 }}>
                Attendance has already been submitted for today.
              </Typography>
            )}

            {/* Create Announcement */}
            {isTeacher && (
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#424242' }}>
                    Create Announcement
                  </Typography>
                  <TextField
                    label="Title"
                    value={announcementTitle}
                    onChange={(e) => setAnnouncementTitle(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    InputProps={{ startAdornment: <AnnouncementIcon sx={{ mr: 1, color: 'grey.500' }} /> }}
                  />
                  <TextField
                    label="Description"
                    value={announcementDescription}
                    onChange={(e) => setAnnouncementDescription(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    multiline
                    rows={3}
                  />
                  <TextField
                    label="Scheduled For"
                    type="datetime-local"
                    value={scheduledFor}
                    onChange={(e) => setScheduledFor(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleCreateAnnouncement}
                    sx={{ mt: 2 }}
                  >
                    Create Announcement
                  </Button>
                </CardContent>
              </StyledCard>
            )}

            {/* Announcements */}
            <StyledCard>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#424242' }}>
                  Announcements
                </Typography>
                {announcements.length > 0 ? (
                  <List>
                    {announcements.map((announcement) => (
                      <StyledListItem key={announcement.id}>
                        <ListItemText
                          primary={announcement.title}
                          secondary={`${announcement.description} (Scheduled for: ${new Date(announcement.scheduledFor).toLocaleString()})`}
                        />
                        {isTeacher && (
                          <Tooltip title="Delete Announcement">
                            <IconButton
                              edge="end"
                              color="error"
                              onClick={() => handleDeleteAnnouncement(announcement.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </StyledListItem>
                    ))}
                  </List>
                ) : (
                  <Typography>No announcements available.</Typography>
                )}
              </CardContent>
            </StyledCard>

            {/* Teacher: Upload Materials & Enrolled Students */}
            {isTeacher && (
              <>
                <StyledCard>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#424242' }}>
                      Upload Subject Material
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.docx,.jpg,.png"
                        style={{ display: 'block' }}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleFileUpload}
                        disabled={!file}
                      >
                        Upload
                      </Button>
                    </Box>
                  </CardContent>
                </StyledCard>

                <StyledCard>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#424242' }}>
                      Enrolled Students
                    </Typography>
                    {enrolledStudents.length > 0 ? (
                      <List>
                        {enrolledStudents.map((student) => (
                          <StyledListItem key={student.id}>
                            <ListItemText primary={student.fullName} secondary={student.email} />
                          </StyledListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography>No students enrolled in this subject yet.</Typography>
                    )}
                  </CardContent>
                </StyledCard>
              </>
            )}

            {/* Student: Enrollment */}
            {isStudent && (
              <Box sx={{ mt: 3 }}>
                {!enrollmentStatus ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleEnroll}
                    sx={{ padding: '10px 20px', fontSize: '16px' }}
                  >
                    Enroll
                  </Button>
                ) : (
                  <Typography sx={{ color: 'green', fontWeight: 'bold' }}>
                    You are enrolled successfully in this subject.
                  </Typography>
                )}
              </Box>
            )}

            {/* Materials */}
            {(isTeacher || enrollmentStatus) && (
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#424242' }}>
                    Lecture Materials
                  </Typography>
                  {materials.length > 0 ? (
                    <List>
                      {materials.map((material) => (
                        <StyledListItem key={material.id}>
                          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                            {getFileIcon(material.fileType)}
                            <ListItemText primary={material.fileName} secondary={material.fileType} />
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Download Material">
                              <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<DownloadIcon />}
                                onClick={() => {
                                  const token = localStorage.getItem('jwtToken');
                                  if (token) {
                                    fetch(`${base_url}/api/subjects/${subjectId}/materials/${material.id}/download`, {
                                      method: 'GET',
                                      headers: { 'Authorization': `Bearer ${token}` },
                                    })
                                      .then((response) => response.blob())
                                      .then((blob) => {
                                        const url = window.URL.createObjectURL(blob);
                                        const link = document.createElement('a');
                                        link.href = url;
                                        link.setAttribute('download', material.fileName);
                                        document.body.appendChild(link);
                                        link.click();
                                        link.remove();
                                      })
                                      .catch((error) => console.error('Error during download:', error));
                                  }
                                }}
                              >
                                Download
                              </Button>
                            </Tooltip>
                            {isTeacher && (
                              <Tooltip title="Remove Material">
                                <Button
                                  variant="outlined"
                                  color="error"
                                  onClick={() => handleRemoveMaterial(material.id)}
                                >
                                  Remove
                                </Button>
                              </Tooltip>
                            )}
                          </Box>
                        </StyledListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography>No materials available.</Typography>
                  )}
                </CardContent>
              </StyledCard>
            )}
          </>
        ) : (
          <Typography>Loading...</Typography>
        )}
      </Box>
      <Footer />
    </Box>
  );
};

export default SubjectPage;