import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes - no layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<NotFound />} />
          {/* Protected Routes - with layout */}
            <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/classes" element={<ClassesManagement />} />
            <Route path="/academic-year" element={<Academicyear />} />
            <Route path="/classes/details" element={<ClassDetail />} />
            <Route path="/section" element={<SectionDetail />} />
            <Route path="/data-upload" element={<DataUploadProcessor />} />
            <Route path="/student-details" element={<StudentDetailsPage />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/schools" element={<SchoolManagement />} />
        <Route path="/admin/plans" element={<PlanManagement />} />
        <Route path="/admin/invoices" element={<InvoiceManagement />} />
        <Route path="/admin/usage" element={<UsageMonitoring />} />
            
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
