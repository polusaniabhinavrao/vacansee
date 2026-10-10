import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Public Pages
import LandingPage from '../pages/public/LandingPage';
import JobsPage from '../pages/public/JobsPage';
import JobDetailPage from '../pages/public/JobDetailPage';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';
import AboutPage from '../pages/public/AboutPage';
import ContactPage from '../pages/public/ContactPage';
import NotFoundPage from '../pages/NotFoundPage';

// Seeker Pages
import SeekerDashboard from '../pages/seeker/SeekerDashboard';
import SeekerProfile from '../pages/seeker/SeekerProfile';
import AppliedJobs from '../pages/seeker/AppliedJobs';
import SavedJobs from '../pages/seeker/SavedJobs';
import PersonalizedJobsPage from '../pages/seeker/PersonalizedJobsPage';

// Employer Pages
import EmployerDashboard from '../pages/employer/EmployerDashboard';
import ManageJobsPage from '../pages/employer/ManageJobsPage';
import PostJobPage from '../pages/employer/PostJobPage';
import JobApplicantsPage from '../pages/employer/JobApplicantsPage';
import EmployerProfile from '../pages/employer/EmployerProfile';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/jobs" element={<JobsPage />} />
      <Route path="/local-jobs" element={<JobsPage isLocalPage={true} />} />
      <Route path="/recommendations" element={<PersonalizedJobsPage />} />
      <Route path="/jobs/:id" element={<JobDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* Seeker Protected Routes */}
      <Route
        path="/seeker/dashboard"
        element={
          <ProtectedRoute allowedRoles={['seeker']}>
            <SeekerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seeker/recommendations"
        element={
          <ProtectedRoute allowedRoles={['seeker']}>
            <PersonalizedJobsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seeker/profile"
        element={
          <ProtectedRoute allowedRoles={['seeker']}>
            <SeekerProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seeker/applied"
        element={
          <ProtectedRoute allowedRoles={['seeker']}>
            <AppliedJobs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seeker/saved"
        element={
          <ProtectedRoute allowedRoles={['seeker']}>
            <SavedJobs />
          </ProtectedRoute>
        }
      />

      {/* Employer Protected Routes */}
      <Route
        path="/employer/dashboard"
        element={
          <ProtectedRoute allowedRoles={['employer']}>
            <EmployerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employer/jobs"
        element={
          <ProtectedRoute allowedRoles={['employer']}>
            <ManageJobsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employer/jobs/new"
        element={
          <ProtectedRoute allowedRoles={['employer']}>
            <PostJobPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employer/jobs/:id/edit"
        element={
          <ProtectedRoute allowedRoles={['employer']}>
            <PostJobPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employer/jobs/:jobId/applicants"
        element={
          <ProtectedRoute allowedRoles={['employer']}>
            <JobApplicantsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employer/profile"
        element={
          <ProtectedRoute allowedRoles={['employer']}>
            <EmployerProfile />
          </ProtectedRoute>
        }
      />

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
