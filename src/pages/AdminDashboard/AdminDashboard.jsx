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
import axiosInstance from "../../api/axiosInstance";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSchools: 0,
    activeSchools: 0,
    suspendedSchools: 0,
    invoicesSent: 0, // Placeholder if you later integrate invoice data
  });

  const [usageData, setUsageData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axiosInstance.get("api/schools/get-school");
        const { counts, schools } = res.data;

        // Update stat cards
        setStats((prev) => ({
          ...prev,
          totalSchools: counts.total || 0,
          activeSchools: counts.active || 0,
          suspendedSchools: counts.suspended || 0,
        }));

        // Extract usage by createdAt (can be by month/day)
        const usageByMonth = {};

        schools.forEach((school) => {
          const month = new Date(school.createdAt).toLocaleString("default", {
            month: "short",
          });
          usageByMonth[month] = (usageByMonth[month] || 0) + 1;
        });

        // Convert to array for recharts
        const usageDataFormatted = Object.entries(usageByMonth).map(
          ([name, usage]) => ({ name, usage })
        );

        setUsageData(usageDataFormatted);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { label: "Total Schools", value: stats.totalSchools },
    { label: "Active Schools", value: stats.activeSchools },
    { label: "Suspended Schools", value: stats.suspendedSchools },
    { label: "Invoices Sent", value: stats.invoicesSent }, // Placeholder
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
          School Registrations by Month
        </Typography>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={usageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="usage" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Box>
  );
}
