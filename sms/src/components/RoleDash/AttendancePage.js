import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Radio, RadioGroup, FormControlLabel, Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';
import HeaderForUser from './HeaderForUser'; // Adjust path as needed
import Footer from '../Footer'; // Adjust path as needed

//const base_url = "http://localhost:8050";
const base_url = "http://206.189.142.249:8050"; // Define base URL

const AttendancePage = () => {
    const { subjectId } = useParams();
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({}); // { studentId: 'PRESENT'/'ABSENT' }
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        const fetchEnrolledStudents = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await axios.get(`${base_url}/api/subjects/${subjectId}/students`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                setStudents(response.data);
            } catch (error) {
                console.error("Error fetching enrolled students:", error);
            }
        };

        fetchEnrolledStudents();
    }, [subjectId]);

    const handleAttendanceChange = (studentId, status) => {
        setAttendance((prev) => ({
            ...prev,
            [studentId]: status.toUpperCase(), // Convert to uppercase to match enum (PRESENT/ABSENT)
        }));
    };

    const handleSubmitAttendance = async () => {
        const token = localStorage.getItem('jwtToken');
        const attendanceData = students.map((student) => ({
            subjectId: parseInt(subjectId), // Ensure subjectId is a number
            studentId: student.id,
            status: attendance[student.id] || 'ABSENT', // Default to ABSENT if not marked
            comment: null, // Optional, can be extended later
        }));

        console.log("Submitting Attendance Data:", attendanceData); // Debugging log

        try {
            const response = await axios.post(`${base_url}/api/attendance/mark`, attendanceData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 200) {
                setOpenSnackbar(true); // Show success message
                setTimeout(() => {
                    navigate(`/subject/${subjectId}`); // Navigate back to subject page after 5 seconds
                }, 5000);
            } else {
                console.error("Unexpected response:", response);
                alert('Failed to submit attendance');
            }
        } catch (error) {
            console.error("Error submitting attendance:", error.response ? error.response.data : error.message);
            alert('Error submitting attendance. Please check the console for details.');
        }
    };

    return (
        <div>
            <HeaderForUser />
            <h2 style={{ textAlign: 'center', margin: '20px' }}>Mark Today's Attendance</h2>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Full Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {students.map((student) => (
                        <TableRow key={student.id}>
                            <TableCell>{student.fullName}</TableCell>
                            <TableCell>{student.email}</TableCell>
                            <TableCell>
                                <RadioGroup
                                    row
                                    value={attendance[student.id] || 'ABSENT'}
                                    onChange={(e) => handleAttendanceChange(student.id, e.target.value)}
                                >
                                    <FormControlLabel value="PRESENT" control={<Radio />} label="Present" />
                                    <FormControlLabel value="ABSENT" control={<Radio />} label="Absent" />
                                </RadioGroup>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Button
                variant="contained"
                color="primary"
                style={{ margin: '20px' }}
                onClick={handleSubmitAttendance}
            >
                Submit Today's Attendance
            </Button>

            {/* Snackbar for success message */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={5000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                    You successfully submitted today's attendance. Have a nice day!
                </Alert>
            </Snackbar>

            <Footer />
        </div>
    );
};

export default AttendancePage;