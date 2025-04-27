import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Pages
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProjectsPage from './pages/projects/ProjectsPage';
import ProjectDetailPage from './pages/projects/ProjectDetailPage';
import TaskDetailPage from './pages/projects/TaskDetailPage';

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
          <Route path="/projects/:projectId/tasks/:taskId" element={<TaskDetailPage />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Navigate to="/projects" />
            </ProtectedRoute>
          } />
          
          {/* Future routes will be added here */}
          {/* 
          <Route path="/volunteer/dashboard" element={
            <ProtectedRoute>
              <VolunteerDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/ngo/dashboard" element={
            <ProtectedRoute>
              <NGODashboard />
            </ProtectedRoute>
          } />
          */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;