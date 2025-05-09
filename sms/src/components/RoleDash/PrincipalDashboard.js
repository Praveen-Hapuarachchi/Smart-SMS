import React, { useState, useEffect } from "react";
import {
  getAllUsers,
  registerTeacher,
  deleteUser,
} from "../../api-helpers/api-helpers";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import HeaderForUser from "../../components/RoleDash/HeaderForUser";
import { styled } from "@mui/material/styles";
import {
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Stack,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Box,
  Modal,
  Avatar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import Footer from "../Footer";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  PersonAdd as AddTeacherIcon,
  Chat as ChatIcon,
  Announcement as AnnouncementIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import {
  Groups as StudentsIcon,
  School as TeachersIcon,
} from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import { updateUser } from "../../api-helpers/api-helpers";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

// Styled components for the table
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#e2f9f2",
    color: "#244646",
    fontWeight: "bold",
    fontSize: "1rem",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "0.9rem",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "white",
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  "&:hover": {
    backgroundColor: "#fdf7fc",
  },
}));

// Helper function to convert string to color
function stringToColor(string) {
  let hash = 0;
  for (let i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

// Function to create avatar initials from name
function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0] || ""}${
      name.split(" ")[1] ? name.split(" ")[1][0] : ""
    }`,
  };
}

const PrincipalDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [teacherData, setTeacherData] = useState({
    fullName: "",
    email: "",
    password: "",
    id: "",
  });
  const announcements = [
    "School reopening on January 1st.",
    "Parent-teacher meeting on January 5th.",
    "Sports day on January 10th.",
  ];
  const [showRightSection, setShowRightSection] = useState(true);
  const navigate = useNavigate();

  // Profile details state and handlers
  const [userDetails, setUserDetails] = useState({
    id: "",
    name: "",
    email: "",
    role: "",
  });
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editProfileData, setEditProfileData] = useState({
    fullName: "",
    password: "",
  });

  // Decode token to get user details
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      const decoded = jwtDecode(token);
      setUserDetails({
        id: decoded.id || "N/A",
        name: decoded.fullName || "N/A",
        email: decoded.sub || "N/A",
        role: decoded.role || "N/A",
      });
    }
  }, []);

  // Handle profile editing toggle
  const handleEditToggle = () => {
    setEditProfileData({ fullName: userDetails.name, password: "" });
    setIsEditing(!isEditing);
  };

  // Handle profile data change
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setEditProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Save edited profile data
  const handleSaveProfile = async () => {
    const updatedUser = await updateUser(userDetails.id, {
      fullName: editProfileData.fullName,
      password: editProfileData.password,
    });

    if (updatedUser) {
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        name: editProfileData.fullName,
      }));
      setIsEditing(false);
    }
  };

  // Open profile modal
  const handleOpenProfileModal = () => {
    setOpenProfileModal(true);
  };

  // Close profile modal
  const handleCloseProfileModal = () => {
    setOpenProfileModal(false);
    setIsEditing(false);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Fetch all users from the backend API when the component loads
  const fetchUsers = async () => {
    setLoading(true);

    try {
      const data = await getAllUsers();
      if (data) {
        setUsers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle form submission for adding a new teacher
  const handleAddTeacher = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const registeredTeacher = await registerTeacher(teacherData);
      if (registeredTeacher) {
        await fetchUsers();
        setTeacherData({ fullName: "", email: "", password: "", id: "" });
        setShowForm(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle user deletion
  const handleDeleteUser = async (userId) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      const deletedUser = await deleteUser(userId, token);
      if (deletedUser) {
        await fetchUsers();
        console.log(`User with ID ${userId} deleted.`);
      } else {
        console.error("Failed to delete user.");
      }
    }
  };

  // Handle chat navigation
  const handleChatClick = () => {
    navigate("/messages");
  };

  // Toggle visibility of the right section
  const toggleRightSection = () => {
    setShowRightSection((prev) => !prev);
  };

  // Separate users into teachers and students
  const teachers = users.filter((user) => user.role === "ROLE_TEACHER");
  const students = users.filter((user) => user.role === "ROLE_STUDENT");

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: "background.paper",
          boxShadow: 1,
        }}
      >
        <HeaderForUser
          onChatClick={handleChatClick}
          userDetails={userDetails}
          onProfileClick={handleOpenProfileModal}
        />
      </Box>

      <Divider sx={{ borderColor: "#008000", borderWidth: 2, mt: 11 }} />

      <Grid container spacing={3} sx={{ px: 1, my: 1 }}>
        <Grid item xs={12} md={showRightSection ? 9 : 12}>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Card sx={{ backgroundColor: "#e0f7fa" }}>
                <CardContent>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid
                      item
                      xs={4}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <StudentsIcon sx={{ fontSize: 60, color: "#004d40" }} />
                    </Grid>
                    <Grid item xs={1}>
                      <Divider
                        orientation="vertical"
                        sx={{ height: "100%", mx: "auto" }}
                      />
                    </Grid>
                    <Grid item xs={7}>
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{ fontWeight: "bold", color: "#00796b" }}
                      >
                        Total Students
                      </Typography>
                      <Typography
                        variant="h4"
                        component="div"
                        sx={{ color: "#004d40", ml: 7 }}
                      >
                        {students.length}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ backgroundColor: "#f1f8e9" }}>
                <CardContent>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid
                      item
                      xs={4}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <TeachersIcon sx={{ fontSize: 60, color: "#1b5e20" }} />
                    </Grid>
                    <Grid item xs={1}>
                      <Divider
                        orientation="vertical"
                        sx={{ height: "100%", mx: "auto" }}
                      />
                    </Grid>
                    <Grid item xs={7}>
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{ fontWeight: "bold", color: "#33691e" }}
                      >
                        Total Teachers
                      </Typography>
                      <Typography
                        variant="h4"
                        component="div"
                        sx={{ color: "#1b5e20", ml: 7 }}
                      >
                        {teachers.length}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6} lg={3}>
              <Card
                sx={{
                  cursor: "pointer",
                  backgroundColor: "#f7f4ff",
                  "&:hover": {
                    boxShadow: 6,
                    backgroundColor: "#2bcc9e",
                    "& .MuiSvgIcon-root": {
                      color: "white",
                    },
                    "& .MuiTypography-root": {
                      color: "white",
                    },
                  },
                  transition: "background-color 0.3s ease, color 0.3s ease",
                }}
                onClick={() => setShowForm(true)}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <AddTeacherIcon
                    sx={{
                      fontSize: 50,
                      color: "#2d5252",
                      mb: 2,
                      transition: "color 0.3s ease",
                    }}
                  />
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      transition: "color 0.3s ease",
                      color: "#847282",
                      fontWeight: "bold",
                    }}
                  >
                    Add Teacher
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Card
                sx={{
                  cursor: "pointer",
                  backgroundColor: "#f7f4ff",
                  "&:hover": {
                    boxShadow: 6,
                    backgroundColor: "#2bcc9e",
                    "& .MuiSvgIcon-root": {
                      color: "white",
                    },
                    "& .MuiTypography-root": {
                      color: "white",
                    },
                  },
                  transition: "background-color 0.3s ease, color 0.3s ease",
                }}
                onClick={handleChatClick}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <ChatIcon sx={{ fontSize: 50, color: "#2d5252", mb: 2 }} />
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      transition: "color 0.3s ease",
                      color: "#847282",
                      fontWeight: "bold",
                    }}
                  >
                    Chat
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Card
                sx={{
                  cursor: "pointer",
                  backgroundColor: "#f7f4ff",
                  "&:hover": {
                    boxShadow: 6,
                    backgroundColor: "#2bcc9e",
                    "& .MuiSvgIcon-root": {
                      color: "white",
                    },
                    "& .MuiTypography-root": {
                      color: "white",
                    },
                  },
                  transition: "background-color 0.3s ease, color 0.3s ease",
                }}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <AnnouncementIcon
                    sx={{ fontSize: 50, color: "#2d5252", mb: 2 }}
                  />
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      transition: "color 0.3s ease",
                      color: "#847282",
                      fontWeight: "bold",
                    }}
                  >
                    Announcement
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Card
                sx={{
                  cursor: "pointer",
                  backgroundColor: "#f7f4ff",
                  "&:hover": {
                    boxShadow: 6,
                    backgroundColor: "#2bcc9e",
                    "& .MuiSvgIcon-root": {
                      color: "white",
                    },
                    "& .MuiTypography-root": {
                      color: "white",
                    },
                  },
                  transition: "background-color 0.3s ease, color 0.3s ease",
                }}
                onClick={handleOpenProfileModal}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <SettingsIcon
                    sx={{ fontSize: 50, color: "#2d5252", mb: 2 }}
                  />
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      transition: "color 0.3s ease",
                      color: "#847282",
                      fontWeight: "bold",
                    }}
                  >
                    Profile Settings
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Modal open={openProfileModal} onClose={handleCloseProfileModal}>
            <Box
              sx={{
                width: 400,
                bgcolor: "background.paper",
                boxShadow: 24,
                borderRadius: 1,
                p: 3,
                m: "auto",
                mt: 10,
                border: "none",
                outline: "none",
              }}
            >
              <Avatar
                {...stringAvatar(userDetails.name)}
                sx={{ width: 80, height: 80, mx: "auto", mb: 2 }}
              />
              <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
                {userDetails.name}
              </Typography>
              <Typography sx={{ textAlign: "center", color: "gray", mb: 2 }}>
                {userDetails.email}
              </Typography>
              <Typography
                sx={{ textAlign: "center", fontWeight: "bold", mb: 2 }}
              >
                {userDetails.role}
              </Typography>
              {isEditing ? (
                <>
                  <TextField
                    label="Full Name"
                    name="fullName"
                    value={editProfileData.fullName}
                    onChange={handleProfileChange}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value={editProfileData.password}
                    onChange={handleProfileChange}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleSaveProfile}
                    fullWidth
                    sx={{
                      mb: 2,
                      backgroundColor: "#008060",
                      color: "#FFFFFF",
                      "&:hover": {
                        backgroundColor: "#3ab09e",
                      },
                    }}
                  >
                    Save
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleEditToggle}
                  startIcon={<EditIcon />}
                  fullWidth
                  sx={{
                    mb: 2,
                    backgroundColor: "#008060",
                    color: "#FFFFFF",
                    "&:hover": {
                      backgroundColor: "#3ab09e",
                    },
                  }}
                >
                  Edit Profile
                </Button>
              )}
              <Button
                variant="outlined"
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
                fullWidth
              >
                Logout
              </Button>
            </Box>
          </Modal>

          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "black",
              mt: 4,
              mb: 0.5,
              alignItems: "center",
              border: "2px solid #d2d2d2",
              borderRadius: "1px",
              padding: "16px",
              position: "relative",
            }}
          >
            All Teachers
          </Typography>
          <TableContainer component={Paper} sx={{ my: 0.5, boxShadow: 3 }}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="right">ID</StyledTableCell>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell align="right">Email</StyledTableCell>
                  <StyledTableCell align="right">Role</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teachers.length > 0 ? (
                  teachers.map((teacher) => (
                    <StyledTableRow key={teacher.id}>
                      <StyledTableCell align="right">
                        {teacher.id}
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        {teacher.fullName}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {teacher.email}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {teacher.role}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Stack
                          direction="row"
                          justifyContent="center"
                          spacing={2}
                        >
                          <Button
                            variant="outlined"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDeleteUser(teacher.id)}
                            sx={{
                              color: "error.main",
                              borderColor: "error.main",
                            }}
                          >
                            Delete
                          </Button>
                        </Stack>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No teachers found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "black",
              mt: 4,
              mb: 0.5,
              alignItems: "center",
              border: "2px solid #d2d2d2",
              borderRadius: "1px",
              padding: "16px",
              position: "relative",
            }}
          >
            All Students
          </Typography>
          <TableContainer component={Paper} sx={{ my: 0.5, boxShadow: 3 }}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="right">ID</StyledTableCell>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell align="right">Email</StyledTableCell>
                  <StyledTableCell align="right">Role</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.length > 0 ? (
                  students.map((student) => (
                    <StyledTableRow key={student.id}>
                      <StyledTableCell align="right">
                        {student.id}
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        {student.fullName}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {student.email}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {student.role}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Stack
                          direction="row"
                          justifyContent="center"
                          spacing={2}
                        >
                          <Button
                            variant="outlined"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDeleteUser(student.id)}
                            sx={{
                              color: "error.main",
                              borderColor: "error.main",
                            }}
                          >
                            Delete
                          </Button>
                        </Stack>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No students found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {showRightSection && (
          <Grid item xs={12} md={3}>
            <Typography
              variant="h6"
              sx={{
                mb: 0,
                mt: 0.1,
                display: "flex",
                alignItems: "center",
                border: "2px solid #d2d2d2",
                borderRadius: "1px",
                padding: "16px",
                position: "relative",
              }}
            >
              Calendar
              <IconButton
                sx={{
                  position: "absolute",
                  color: "black",
                  top: 8,
                  right: 8,
                  zIndex: 1,
                  backgroundColor: "#f2f2f2",
                  border: "2px solid #00b386",
                  borderRadius: "4px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#f2f2f2",
                    "& svg": {
                      transform: "scale(1.2)",
                    },
                  },
                }}
                onClick={toggleRightSection}
              >
                <CloseIcon
                  sx={{
                    transition: "transform 0.3s ease",
                  }}
                />
              </IconButton>
            </Typography>
            <Card
              sx={{
                mb: 3,
                alignItems: "center",
                border: "2px solid #d2d2d2",
                borderRadius: "1px",
                padding: "15px",
                mt: 0,
                borderTop: "none",
              }}
            >
              <CardContent>
                <Calendar />
              </CardContent>
            </Card>

            <Typography
              variant="h6"
              sx={{
                mb: 0,
                mt: 3,
                display: "flex",
                alignItems: "center",
                border: "2px solid #d2d2d2",
                borderRadius: "1px",
                padding: "16px",
              }}
            >
              Announcements
            </Typography>
            <Card
              sx={{
                mb: 3,
                alignItems: "center",
                border: "2px solid #d2d2d2",
                borderRadius: "1px",
                padding: "15px",
                mt: 0,
                borderTop: "none",
              }}
            >
              <CardContent>
                <List>
                  {announcements.map((announcement, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText primary={announcement} />
                      </ListItem>
                      {index < announcements.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}

        {!showRightSection && (
          <Box
            sx={{
              position: "fixed",
              top: 110,
              right: 16,
              zIndex: 1000,
            }}
          >
            <IconButton
              onClick={toggleRightSection}
              sx={{
                backgroundColor: "#f2f2f2",
                color: "black",
                borderRadius: "50% 0 0 50%",
                border: "2px solid #00b386",
                borderRight: "none",
                position: "relative",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "white",
                  transform: "translateX(-8px)",
                  "& svg": {
                    transform: "scale(1.2)",
                  },
                },
              }}
            >
              <ArrowBackIosNewIcon
                sx={{
                  transition: "transform 0.3s ease",
                }}
              />
            </IconButton>
          </Box>
        )}
      </Grid>

      <Dialog open={showForm} onClose={() => setShowForm(false)}>
        <DialogTitle>Add New Teacher</DialogTitle>
        <DialogContent>
          <TextField
            label="Full Name"
            value={teacherData.fullName}
            onChange={(e) =>
              setTeacherData({ ...teacherData, fullName: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            value={teacherData.email}
            onChange={(e) =>
              setTeacherData({ ...teacherData, email: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            value={teacherData.password}
            onChange={(e) =>
              setTeacherData({ ...teacherData, password: e.target.value })
            }
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowForm(false)}>Cancel</Button>
          <Button onClick={handleAddTeacher} disabled={loading}>
            {loading ? "Adding..." : "Add Teacher"}
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </Box>
  );
};

export default PrincipalDashboard;