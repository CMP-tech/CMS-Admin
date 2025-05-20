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
  Grid,
  CircularProgress,
  Chip
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
        // Fetch individual student feedback from your API
        const response = await fetch(`https://school-ai-be.onrender.com/feedback/${encodeURIComponent(name)}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch student feedback');
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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4} textAlign="center">
        <Typography variant="h6" color="error" gutterBottom>
          Error: {error}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  if (!studentDetails) {
    return (
      <Box p={4} textAlign="center">
        <Typography variant="h5" gutterBottom>
          No student data found for {name}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">
          {name}'s Performance Report
        </Typography>
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          startIcon={<ArrowBackIcon />}
        >
          Back to Report
        </Button>
      </Box>

      {/* Overall Performance Summary */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Overall Performance Summary
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Typography variant="subtitle2" color="text.secondary">
              Total Marks
            </Typography>
            <Typography variant="h5">{studentDetails.performance?.total || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="subtitle2" color="text.secondary">
              Percentage
            </Typography>
            <Typography variant="h5">
              {studentDetails.performance?.percentage ? `${studentDetails.performance.percentage.toFixed(2)}%` : 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="subtitle2" color="text.secondary">
              Result Status
            </Typography>
            <Chip
              label={studentDetails.performance?.passed ? 'Passed' : 'Failed'}
              color={studentDetails.performance?.passed ? 'success' : 'error'}
              sx={{ fontSize: '1rem', padding: '0.5rem' }}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="subtitle2" color="text.secondary">
              Subjects Failed
            </Typography>
            <Typography variant="h5">
              {studentDetails.performance?.failCount || 0}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Subject-wise Performance */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Subject-wise Performance
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Subject</strong></TableCell>
                <TableCell align="right"><strong>Marks Obtained</strong></TableCell>
                <TableCell align="center"><strong>Grade</strong></TableCell>
                <TableCell align="center"><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {studentDetails.performance?.subjects?.map((subject) => (
                <TableRow key={subject.subject}>
                  <TableCell>{subject.subject}</TableCell>
                  <TableCell align="right">{subject.score}</TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={subject.grade} 
                      color={
                        subject.grade === 'A1' || subject.grade === 'A2' ? 'success' :
                        subject.grade === 'B1' || subject.grade === 'B2' ? 'info' :
                        subject.grade === 'C' ? 'warning' : 'error'
                      }
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={subject.pass ? 'Passed' : 'Failed'}
                      color={subject.pass ? 'success' : 'error'}
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Personalized Feedback */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Personalized Feedback
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Box sx={{ 
          backgroundColor: '#f8f9fa', 
          p: 3, 
          borderRadius: 1,
          borderLeft: '4px solid #3f51b5'
        }}>
          {studentDetails.feedback ? (
            studentDetails.feedback.split('\n').map((paragraph, index) => (
              <Typography 
                key={index} 
                paragraph 
                sx={{ 
                  mb: 2,
                  whiteSpace: 'pre-wrap',
                  textAlign: paragraph.startsWith('**') ? 'center' : 'left',
                  fontWeight: paragraph.startsWith('**') ? 'bold' : 'normal'
                }}
              >
                {paragraph.replace(/\*\*/g, '')}
              </Typography>
            ))
          ) : (
            <Typography color="text.secondary">
              No feedback available for this student.
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default StudentDetailsPage;