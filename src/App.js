// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import Layout from "./components/Layout";
import Home from "./pages/home";
import StudentDetailsPage from "./pages/StudentDetailsPage";
import { ClassNames } from "@emotion/react";
import Academicyear from "./pages/academic/Academicyear";
import ClassesManagement from "./pages/classes/ClassesManagement";
import ClassDetail from "./pages/classes/ClassDetail";
import SectionDetail from "./pages/sections/SectionDetail";
import DataUploadProcessor from "./pages/classes/DataUploadProcessor";

function App() {
  return (
    <>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/classes" element={<ClassesManagement />} />
            <Route path="/academic-year" element={<Academicyear />} />
            <Route path="/classes/details" element={<ClassDetail />} />
            <Route path="/section" element={<SectionDetail />} />
            <Route path="/data-upload" element={<DataUploadProcessor />} />
          </Routes>
        </Layout>
      </Router>
    </>
  );
}

export default App;
