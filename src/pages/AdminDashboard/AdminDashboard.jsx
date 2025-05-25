import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Paper,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import SchoolIcon from "@mui/icons-material/School";

const mockStats = {
  totalSchools: 25,
  activeSchools: 20,
  suspendedSchools: 3,
  invoicesSent: 75,
};

const mockUsageData = [
  { name: "Jan", usage: 10 },
  { name: "Feb", usage: 15 },
  { name: "Mar", usage: 8 },
  { name: "Apr", usage: 18 },
  { name: "May", usage: 12 },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [usageData, setUsageData] = useState([]);

  useEffect(() => {
    setStats(mockStats);
    setUsageData(mockUsageData);
  }, []);

  const statCards = [
    { label: "Total Schools", value: stats.totalSchools },
    { label: "Active Schools", value: stats.activeSchools },
    { label: "Suspended Schools", value: stats.suspendedSchools },
    { label: "Invoices Sent", value: stats.invoicesSent },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card elevation={3}>
              <CardContent>
                <Typography color="textSecondary" variant="body2" gutterBottom>
                  {stat.label}
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          School Activity Over Time
        </Typography>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={usageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="usage" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Box>
  );
}
