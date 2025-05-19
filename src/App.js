import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import StudentDetailsPage from './pages/StudentDetailsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/student/:id" element={<StudentDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;