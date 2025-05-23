import React from 'react';
import { Routes, Route } from 'react-router-dom'; // No need to import BrowserRouter anymore
import Home from './components/Home';
import FormDialog from './components/form/Form'; 
import PrincipalDashboard from './components/RoleDash/PrincipalDashboard';
import TeacherDashboard from './components/RoleDash/TeacherDashboard';
import StudentDashboard from './components/RoleDash/StudentDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import SubjectPage from './components/RoleDash/SubjectPage';
import MessagesPage from './components/RoleDash/MessagesPage';
import ChatPage from './components/RoleDash/ChatPage';
import AttendancePage from './components/RoleDash/AttendancePage'; // Import AttendancePage
import ReviewAttendancePage from './components/RoleDash/ReviewAttendancePage'; // Import ReviewAttendancePage

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<FormDialog open={true} />} />
      <Route 
        path="/protected/principal" 
        element={
          <ProtectedRoute roles={['ROLE_PRINCIPAL']}>
            <PrincipalDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/protected/teacher" 
        element={
          <ProtectedRoute roles={['ROLE_TEACHER']}>
            <TeacherDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/protected/student" 
        element={
          <ProtectedRoute roles={['ROLE_STUDENT']}>
            <StudentDashboard />
          </ProtectedRoute>
        } 
      />
      <Route path="/subject/:subjectId" element={<SubjectPage />} />
      <Route path="/messages" element={<MessagesPage />} />
      <Route path="/chat/:senderId" element={<ChatPage />} />
      <Route path="/attendance/:subjectId" element={<AttendancePage />} /> {/* Add route for AttendancePage */}
      <Route path="/reviewattendance/:subjectId" element={<ReviewAttendancePage />} /> {/* Add route for ReviewAttendancePage */}
    </Routes>
  );
};

export default App;
