// src/pages/UsageMonitoring.js
import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Keep axios if you plan to fetch data later, otherwise remove.
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card, // Retaining Card from MUI, similar to ClassesManagement
  CardContent,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Alert,
  useTheme, // Import useTheme for theme access
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Analytics as AnalyticsIcon, TrendingUp as TrendingUpIcon } from '@mui/icons-material';

export default function UsageMonitoring() {
  const theme = useTheme(); // Access the theme
  const [usageStats, setUsageStats] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Simulate API call to fetch usage data
    // If you don't have a backend, remove the axios.get call
    // and just directly set the mock data.
    axios.get('/api/admin/usage')
      .then((response) => {
        // If your API actually returns data, use response.data
        // For now, we'll use mock data
        const mockUsageStats = [
          { name: 'Sunshine Public School', reports: 45, users: 80, lastLogin: '2025-05-22' },
          { name: 'Greenfield Academy', reports: 30, users: 50, lastLogin: '2025-05-20' },
          { name: 'Hilltop School', reports: 60, users: 90, lastLogin: '2025-05-18' },
          { name: 'Riverside High', reports: 35, users: 65, lastLogin: '2025-05-21' },
          { name: 'Maplewood Prep', reports: 50, users: 75, lastLogin: '2025-05-19' },
        ];
        setUsageStats(mockUsageStats);
        setChartData(
          mockUsageStats.map((school) => ({ name: school.name, reports: school.reports }))
        );
      })
      .catch((error) => {
        console.error("Error fetching usage data, using mock data:", error);
        // Fallback to mock data if API call fails
        const mockUsageStats = [
          { name: 'Sunshine Public School', reports: 45, users: 80, lastLogin: '2025-05-22' },
          { name: 'Greenfield Academy', reports: 30, users: 50, lastLogin: '2025-05-20' },
          { name: 'Hilltop School', reports: 60, users: 90, lastLogin: '2025-05-18' },
          { name: 'Riverside High', reports: 35, users: 65, lastLogin: '2025-05-21' },
          { name: 'Maplewood Prep', reports: 50, users: 75, lastLogin: '2025-05-19' },
        ];
        setUsageStats(mockUsageStats);
        setChartData(
          mockUsageStats.map((school) => ({ name: school.name, reports: school.reports }))
        );
      });
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Usage Monitoring
        </Typography>
      </Box>

      {/* Card for Reports Generated per School */}
      <Card sx={{ mb: 3, p: 2 }}> {/* Using Card component directly */}
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AnalyticsIcon sx={{ mr: 1, color: theme.palette.primary.main }} /> {/* Use theme color */}
          Reports Generated per School
        </Typography>
        <Box sx={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="reports" fill={theme.palette.success.main} /> {/* Use theme color, e.g., success.main */}
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Card>

      {/* Detailed Usage Statistics Table */}
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TrendingUpIcon sx={{ mr: 1, color: theme.palette.primary.main }} /> {/* Use theme color */}
        Detailed Usage Statistics
      </Typography>

      {usageStats.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No usage data available at the moment.
        </Alert>
      ) : (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}> {/* Using Paper for table container */}
          <TableContainer>
            <Table stickyHeader aria-label="usage monitoring table">
              <TableHead>
                <TableRow>
                  <TableCell>School Name</TableCell>
                  <TableCell align="right">Reports Generated</TableCell>
                  <TableCell align="right">Total Users</TableCell>
                  <TableCell align="right">Last Login</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usageStats.map((school) => (
                  <TableRow
                    key={school.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {school.name}
                    </TableCell>
                    <TableCell align="right">{school.reports}</TableCell>
                    <TableCell align="right">{school.users}</TableCell>
                    <TableCell align="right">{school.lastLogin}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
}