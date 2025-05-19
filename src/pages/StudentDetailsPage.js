import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Divider,
  Container,
  Grid
} from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const StudentDetailsPage = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentFeedback = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://school-ai-be.onrender.com/feedback/${name}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch student feedback');
        }
        const data = await response.json();
        setStudentDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentFeedback();
  }, [name]);

  if (loading) {
    return (
      <Box p={4}>
        <Typography variant="h5">Loading student details...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Typography variant="h6" color="error">Error: {error}</Typography>
        <Button variant="contained" onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  if (!studentDetails) {
    return (
      <Box p={4}>
        <Typography variant="h5">No student data found for {name}</Typography>
        <Button variant="contained" onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  const { feedback, ...student } = studentDetails;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>feedback
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">
          {student.name} - Performance Details
        </Typography>
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
        >
          Back to Report
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Overall Performance</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Typography variant="body1"><strong>Total Marks:</strong></Typography>
            <Typography variant="h6">{student.total}</Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="body1"><strong>Percentage:</strong></Typography>
            <Typography variant="h6">{student.percentage?.toFixed(2)}%</Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="body1"><strong>Status:</strong></Typography>
            <Typography
              variant="h6"
              color={student.passed ? "success.main" : "error.main"}
            >
              {student.passed ? "Passed" : "Failed"}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom mb={2}>Subject-wise Performance</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Subject</strong></TableCell>
                <TableCell align="right"><strong>Marks</strong></TableCell>
                <TableCell align="right"><strong>Grade</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {student.subjects.map((sub) => (
                <TableRow key={sub.subject}>
                  <TableCell>{sub.subject}</TableCell>
                  <TableCell align="right">{sub.score}</TableCell>
                  <TableCell align="right">{sub.grade}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Feedback</Typography>
        <Typography variant="body1">
          {}
        </Typography>
      </Paper>
    </Container>
  );
};

export default StudentDetailsPage;