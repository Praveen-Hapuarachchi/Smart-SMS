// api-helpers.js
import axios from "axios";

const base_url = "http://206.189.142.249:8050"; // Define base URL

// Get all users using axios
export const getAllUsers = async () => {
    try {
        const token = localStorage.getItem('jwtToken');
        const res = await axios.get(`${base_url}/users/all`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (res && res.status === 200) {
            return res.data;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching users:", error.response ? error.response.data : error.message);
        return null;
    }
};

export const sendUserAuthRequest = async (data) => {
    try {
        const res = await axios.post(`${base_url}/auth/login`, {
            email: data.email,
            password: data.password,
        });
        if (res && res.status === 200) {
            const { token } = res.data;
            localStorage.setItem('jwtToken', token);
            return res.data;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error during authentication:", error.response ? error.response.data : error.message);
        return null;
    }
};

export const registerTeacher = async (teacherData) => {
    try {
        const res = await axios.post(`${base_url}/auth/signup`, {
            fullName: teacherData.fullName,
            email: teacherData.email,
            password: teacherData.password,
            role: 'TEACHER',
        });
        if (res && res.status === 200) {
            return res.data;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error during teacher registration:", error.response ? error.response.data : error.message);
        return null;
    }
};

export const registerStudent = async (studentData) => {
    try {
        const res = await axios.post(`${base_url}/auth/signup`, {
            fullName: studentData.fullName,
            email: studentData.email,
            password: studentData.password,
            role: 'STUDENT',
        });
        if (res && res.status === 200) {
            return res.data;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error during student registration:", error.response ? error.response.data : error.message);
        return null;
    }
};

export const deleteUser = async (userId, token) => {
    try {
        const res = await axios.delete(`${base_url}/auth/delete/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (res && res.status === 200) {
            return res.data;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error during user deletion:", error.response ? error.response.data : error.message);
        return null;
    }
};

export const getAuthenticatedUser = async () => {
    try {
        const token = localStorage.getItem('jwtToken');
        const res = await axios.get(`${base_url}/users/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (res && res.status === 200) {
            return res.data;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching authenticated user:", error.response ? error.response.data : error.message);
        return null;
    }
};

export const updateUser = async (userId, userData) => {
    try {
        const token = localStorage.getItem('jwtToken');
        const res = await axios.put(`${base_url}/users/${userId}`, userData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return res.data;
    } catch (error) {
        console.error('Error updating user:', error.response ? error.response.data : error.message);
        return null;
    }
};

export const createSubject = async (subjectData) => {
    try {
        const response = await fetch(`${base_url}/api/subjects/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            },
            body: JSON.stringify(subjectData),
        });
        if (!response.ok) {
            throw new Error('Failed to create subject');
        }
        return await response.json();
    } catch (error) {
        console.error('Error creating subject:', error);
        return null;
    }
};

export const getAllCreatedSubjects = async () => {
    try {
        const token = localStorage.getItem('jwtToken');
        const res = await axios.get(`${base_url}/api/subjects/my-subjects`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (res && res.status === 200) {
            return res.data;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching subjects:', error.response ? error.response.data : error.message);
        return null;
    }
};

export const getSubjectById = async (subjectId) => {
    try {
        const token = localStorage.getItem('jwtToken');
        const res = await axios.get(`${base_url}/api/subjects/${subjectId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (res && res.status === 200) {
            return res.data;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching subject:', error.response ? error.response.data : error.message);
        return null;
    }
};

export const getAllSubjects = async () => {
    try {
        const token = localStorage.getItem('jwtToken');
        const res = await axios.get(`${base_url}/api/subjects/all`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (res.status === 200) {
            return res.data;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching subjects:", error.response ? error.response.data : error.message);
        return null;
    }
};

export const getEnrolledStudents = async (subjectId) => {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get(`${base_url}/api/subjects/${subjectId}/students`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        if (response && response.status === 200) {
            return response.data;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error fetching enrolled students:", error.response ? error.response.data : error.message);
        return [];
    }
};

export const getEnrolledSubjects = async () => {
    try {
        const token = localStorage.getItem('jwtToken');
        const res = await axios.get(`${base_url}/api/subjects/enrolled`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (res && res.status === 200) {
            return res.data;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching enrolled subjects:", error.response ? error.response.data : error.message);
        return null;
    }
};

export const getMaterials = async (subjectId) => {
    try {
        const response = await axios.get(`${base_url}/api/subjects/${subjectId}/materials`);
        return response.data;
    } catch (error) {
        console.error("Error fetching materials:", error);
        throw error;
    }
};

export const removeMaterial = async (subjectId, materialId) => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        return null;
    }
    try {
        const response = await axios.delete(`${base_url}/api/subjects/${subjectId}/materials/${materialId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (response.status === 200) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error deleting material:", error.response ? error.response.data : error.message);
        return false;
    }
};

export const getAnnouncements = async (subjectId) => {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get(`${base_url}/api/announcements/subject/${subjectId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        if (response && response.status === 200) {
            return response.data;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error fetching announcements:", error.response ? error.response.data : error.message);
        return [];
    }
};

export const createAnnouncement = async (announcementData) => {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.post(`${base_url}/api/announcements/create`, announcementData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        if (response && response.status === 201) {
            return response.data;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error creating announcement:", error.response ? error.response.data : error.message);
        return null;
    }
};

export const deleteAnnouncement = async (announcementId) => {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.delete(`${base_url}/api/announcements/delete/${announcementId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        if (response && response.status === 200) {
            return response.data;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error deleting announcement:", error.response ? error.response.data : error.message);
        return null;
    }
};

export const getMessages = async (userId) => {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get(`${base_url}/api/messages/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error('Error fetching messages');
    }
};

export const sendMessage = async (messageData) => {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.post(`${base_url}/api/messages/send`, messageData, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        throw new Error('Error sending message');
    }
};

export const getMessagesBetweenUsers = async (userId, senderId) => {
    try {
        const token = localStorage.getItem('jwtToken');
        const url = `${base_url}/api/messages/conversation?senderId=${senderId}&receiverId=${userId}`;
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching messages:', error.response ? error.response.data : error.message);
        return [];
    }
};






