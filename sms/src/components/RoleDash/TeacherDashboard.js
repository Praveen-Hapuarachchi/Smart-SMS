import React, { useState, useEffect } from 'react';
import { registerStudent, createSubject, getAllCreatedSubjects } from '../../api-helpers/api-helpers'; // Import API helpers
import HeaderForUser from './HeaderForUser';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Footer from '../Footer';
import { Card, CardContent, CardActions, Collapse, IconButton, Typography, TextField, Select, MenuItem } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';

const TeacherDashboard = () => {
  // Student management states
  const [showStudentForm, setShowStudentForm] = useState(false); // Show/Hide student form
  const [studentData, setStudentData] = useState({ fullName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]); // Store registered students

  // Subject management states
  const [showSubjectForm, setShowSubjectForm] = useState(false); // Show/Hide subject form
  const [subjectData, setSubjectData] = useState({
    name: '',
    year: 2024,
    grade: 'Grade 7',
    subjectClass: 'A',
  }); // Store subject data
  const [subjects, setSubjects] = useState([]); // Store created subjects

  // My Subjects states
  const [mySubjects, setMySubjects] = useState([]); // Store subjects created by the teacher
  const [hoveredSubject, setHoveredSubject] = useState(null); // Track the subject being hovered over

  const navigate = useNavigate(); // Hook to navigate to subject page

  const [expandStudentForm, setExpandStudentForm] = useState(false);
  const [expandSubjectForm, setExpandSubjectForm] = useState(false);

  // Fetch all created subjects when the component mounts
  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      setError(null);

      try {
        const fetchedSubjects = await getAllCreatedSubjects(); // Call API to fetch subjects
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
  }, []); // Empty dependency array means this runs once on mount

  // Handle form submission for adding a new student
  const handleAddStudent = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const registeredStudent = await registerStudent(studentData);
      if (registeredStudent) {
        setStudents([...students, registeredStudent]);
        setStudentData({ fullName: '', email: '', password: '' });
        setShowStudentForm(false);
      } else {
        setError('Failed to register student.');
      }
    } catch (err) {
      setError('Error registering student.');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission for creating a subject
  const handleCreateSubject = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const createdSubject = await createSubject(subjectData); // Make API call to create subject
      if (createdSubject) {
        setSubjects([...subjects, createdSubject]);
        setSubjectData({ name: '', year: 2024, grade: 'Grade 7', subjectClass: 'A' });
        setShowSubjectForm(false); // Close the form after successful submission
      } else {
        setError('Failed to create subject.');
      }
    } catch (err) {
      setError('Error creating subject.');
    } finally {
      setLoading(false);
    }
  };

  // Navigate to the subject page when clicked
  const handleSubjectClick = (subjectId) => {
    navigate(`/subject/${subjectId}`); // Pass subjectId
  };

  return (
    <div>
      <HeaderForUser />
      <h1>Teacher Dashboard</h1>

      {/* Add New Student Card */}
      <Card style={{ marginBottom: '20px' }}>
        <CardActions>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Add New Student
          </Typography>
          <IconButton onClick={() => setExpandStudentForm(!expandStudentForm)}>
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse in={expandStudentForm} timeout="auto" unmountOnExit>
          <CardContent>
            <form onSubmit={handleAddStudent}>
              <TextField
                label="Full Name"
                value={studentData.fullName}
                onChange={(e) => setStudentData({ ...studentData, fullName: e.target.value })}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Email"
                type="email"
                value={studentData.email}
                onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Password"
                type="password"
                value={studentData.password}
                onChange={(e) => setStudentData({ ...studentData, password: e.target.value })}
                fullWidth
                margin="normal"
                required
              />
              <button type="submit" disabled={loading} style={{ marginTop: '10px' }}>
                {loading ? 'Adding...' : 'Add Student'}
              </button>
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
          </CardContent>
        </Collapse>
      </Card>

      {/* Create New Subject Card */}
      <Card style={{ marginBottom: '20px' }}>
        <CardActions>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Create New Subject
          </Typography>
          <IconButton onClick={() => setExpandSubjectForm(!expandSubjectForm)}>
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse in={expandSubjectForm} timeout="auto" unmountOnExit>
          <CardContent>
            <form onSubmit={handleCreateSubject}>
              <TextField
                label="Subject Name"
                value={subjectData.name}
                onChange={(e) => setSubjectData({ ...subjectData, name: e.target.value })}
                fullWidth
                margin="normal"
                required
              />
              <Typography variant="body1" style={{ marginTop: '10px' }}>
                Year
              </Typography>
              <Select
                value={subjectData.year}
                onChange={(e) => setSubjectData({ ...subjectData, year: e.target.value })}
                fullWidth
                required
              >
                <MenuItem value={2024}>2024</MenuItem>
                <MenuItem value={2025}>2025</MenuItem>
                <MenuItem value={2026}>2026</MenuItem>
              </Select>
              <Typography variant="body1" style={{ marginTop: '10px' }}>
                Grade
              </Typography>
              <Select
                value={subjectData.grade}
                onChange={(e) => setSubjectData({ ...subjectData, grade: e.target.value })}
                fullWidth
                required
              >
                <MenuItem value="Grade 6">Grade 6</MenuItem>
                <MenuItem value="Grade 7">Grade 7</MenuItem>
                <MenuItem value="Grade 8">Grade 8</MenuItem>
                <MenuItem value="Grade 9">Grade 9</MenuItem>
              </Select>
              <Typography variant="body1" style={{ marginTop: '10px' }}>
                Subject Class
              </Typography>
              <Select
                value={subjectData.subjectClass}
                onChange={(e) => setSubjectData({ ...subjectData, subjectClass: e.target.value })}
                fullWidth
                required
              >
                <MenuItem value="A">A</MenuItem>
                <MenuItem value="B">B</MenuItem>
                <MenuItem value="C">C</MenuItem>
                <MenuItem value="D">D</MenuItem>
              </Select>
              <button type="submit" disabled={loading} style={{ marginTop: '10px' }}>
                {loading ? 'Creating...' : 'Create Subject'}
              </button>
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
          </CardContent>
        </Collapse>
      </Card>

      {/* Display My Subjects */}
      <h2>My Subjects</h2>
      {loading && <p>Loading subjects...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {mySubjects.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#2196F3', color: 'white' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Subject Name</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Year</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Grade</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Class</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
            </tr>
          </thead>
          <tbody>
            {mySubjects.map((subject) => (
              <tr
                key={subject.id}
                onClick={() => handleSubjectClick(subject.id)}
                onMouseEnter={() => setHoveredSubject(subject.id)}
                onMouseLeave={() => setHoveredSubject(null)}
                style={{
                  backgroundColor: hoveredSubject === subject.id ? '#f0f0f0' : 'transparent',
                  cursor: 'pointer',
                }}
              >
                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                  {subject.name}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                  {subject.year}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                  {subject.grade}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                  {subject.subjectClass}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                  {subject.id}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No subjects available.</p>
      )}

      <Footer />
    </div>
  );
};

export default TeacherDashboard;
