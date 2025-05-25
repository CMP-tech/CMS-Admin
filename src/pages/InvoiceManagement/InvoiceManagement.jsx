// src/pages/InvoiceManagement.js
import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Keep axios if you plan to fetch data later, otherwise remove.
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  useTheme, // Import useTheme for theme access
} from '@mui/material';
import {
  Download as DownloadIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';

const statusOptions = [
  { label: 'All', value: '' },
  { label: 'Paid', value: 'Paid' },
  { label: 'Unpaid', value: 'Unpaid' },
  { label: 'Overdue', value: 'Overdue' },
];

export default function InvoiceManagement() {
  const theme = useTheme(); // Access the theme
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]); // Renamed 'filtered' to 'filteredInvoices' for clarity
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    // Simulate API call. If you don't have a backend, remove the axios.get call
    // and just directly set the mock data.
    axios.get('/api/admin/invoices')
      .then((response) => {
        // If your API actually returns data, use response.data
        // For now, we'll use mock data
        const mockData = [
          { id: 'INV001', date: '2025-05-01', status: 'Paid', amount: '₹500' },
          { id: 'INV002', date: '2025-05-05', status: 'Unpaid', amount: '₹1000' },
          { id: 'INV003', date: '2025-05-10', status: 'Overdue', amount: '₹750' },
          { id: 'INV004', date: '2025-05-15', status: 'Paid', amount: '₹1200' },
          { id: 'INV005', date: '2025-05-20', status: 'Unpaid', amount: '₹800' },
        ];
        setInvoices(mockData);
        setFilteredInvoices(mockData);
      })
      .catch((error) => {
        console.error("Error fetching invoices, using mock data:", error);
        // Fallback to mock data if API call fails
        const mockData = [
          { id: 'INV001', date: '2025-05-01', status: 'Paid', amount: '₹500' },
          { id: 'INV002', date: '2025-05-05', status: 'Unpaid', amount: '₹1000' },
          { id: 'INV003', date: '2025-05-10', status: 'Overdue', amount: '₹750' },
          { id: 'INV004', date: '2025-05-15', status: 'Paid', amount: '₹1200' },
          { id: 'INV005', date: '2025-05-20', status: 'Unpaid', amount: '₹800' },
        ];
        setInvoices(mockData);
        setFilteredInvoices(mockData);
      });
  }, []);

  useEffect(() => {
    if (!statusFilter) {
      setFilteredInvoices(invoices);
    } else {
      setFilteredInvoices(invoices.filter((inv) => inv.status === statusFilter));
    }
  }, [statusFilter, invoices]);

  const downloadPDF = (id) => {
    alert(`Download PDF for ${id} (not implemented)`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Invoice Management
        </Typography>
        {/* Dropdown for Status Filter */}
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            id="status-filter"
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Overview Cards (Similar to ClassesManagement) */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Overview
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Invoices
                </Typography>
                <Typography variant="h4">{invoices.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Paid Invoices
                </Typography>
                <Typography variant="h4">
                  {invoices.filter((inv) => inv.status === 'Paid').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Unpaid Amount
                </Typography>
                <Typography variant="h4">
                  ₹
                  {invoices
                    .filter((inv) => inv.status === 'Unpaid' || inv.status === 'Overdue')
                    .reduce((total, inv) => total + parseFloat(inv.amount.replace('₹', '')), 0)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h6" gutterBottom>
        All Invoices
      </Typography>

      {filteredInvoices.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No invoices found matching the current filter.
        </Alert>
      ) : (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table stickyHeader aria-label="invoice table">
              <TableHead>
                <TableRow>
                  <TableCell>Invoice ID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="center">Actions</TableCell> {/* Centered for consistency */}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow
                    key={invoice.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ReceiptIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                        {invoice.id}
                      </Box>
                    </TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.status}</TableCell>
                    <TableCell align="right">{invoice.amount}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined" // Use outlined variant for a softer look
                        size="small"
                        color="primary"
                        startIcon={<DownloadIcon />}
                        onClick={() => downloadPDF(invoice.id)}
                      >
                        Download PDF
                      </Button>
                    </TableCell>
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