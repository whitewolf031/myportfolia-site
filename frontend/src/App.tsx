import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminProjects } from './pages/admin/AdminProjects';
import { AdminProfile } from './pages/admin/AdminProfile';
import { AdminSkills } from './pages/admin/AdminSkills';
import { AdminServices } from './pages/admin/AdminServices';
import { AdminTimeline } from './pages/admin/AdminTimeline';
import { AdminTestimonials } from './pages/admin/AdminTestimonials';
import { AdminContactInfo } from './pages/admin/AdminContactInfo';
import { AdminMessages } from './pages/admin/AdminMessages';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Site */}
        <Route path="/" element={<HomePage />} />

        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Admin Panel */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/projects" replace />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="skills" element={<AdminSkills />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="timeline" element={<AdminTimeline />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="contact-info" element={<AdminContactInfo />} />
          <Route path="messages" element={<AdminMessages />} />
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
