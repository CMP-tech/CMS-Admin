import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import Layout from "./components/Layout";

import Home from "./pages/home";
import StudentDetailsPage from "./pages/StudentDetailsPage";
import Academicyear from "./pages/academic/Academicyear";
import ClassesManagement from "./pages/classes/ClassesManagement";
import ClassDetail from "./pages/classes/ClassDetail";
import SectionDetail from "./pages/sections/SectionDetail";
import DataUploadProcessor from "./pages/classes/DataUploadProcessor";
import Login from "./pages/auth/login";
import NotFound from "./pages/notFound";
import ForgotPassword from "./pages/auth/forgotPassword";
import ResetPassword from "./pages/auth/resetPaasword";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import SchoolManagement from "./pages/SchoolManagement/SchoolManagement";
import PlanManagement from "./pages/PlanManagement/PlanManagement";
import InvoiceManagement from "./pages/InvoiceManagement/InvoiceManagement";
import UsageMonitoring from "./pages/UsageMonitoring/UsageMonitoring";
import AdminSignup from "./pages/auth/AdminSignup";
import PrivateRoute from "./components/PrivateRoute";
import ContactRequest from "./pages/contactRequest";
import SocialMediaPage from "./pages/settings/SocialMediaPage";
import CopyrightPage from "./pages/settings/CopyrightPage";

function App() {
  return (
    <>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/Signup" element={<AdminSignup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<NotFound />} />

          {/* Protected Routes - requires valid JWT */}
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/classes" element={<ClassesManagement />} />
              <Route path="/academic-year" element={<Academicyear />} />
              <Route path="/classes/details" element={<ClassDetail />} />
              <Route path="/section" element={<SectionDetail />} />
              <Route path="/data-upload" element={<DataUploadProcessor />} />
              <Route path="/student-details" element={<StudentDetailsPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/schools" element={<SchoolManagement />} />
              <Route path="/admin/plans" element={<PlanManagement />} />
              <Route path="/admin/invoices" element={<InvoiceManagement />} />
              <Route path="/admin/usage" element={<UsageMonitoring />} />
              <Route
                path="/admin/contact-request"
                element={<ContactRequest />}
              />
              <Route
                path="/settings/social-media"
                element={<SocialMediaPage />}
              />
              <Route path="/settings/copyright" element={<CopyrightPage />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
