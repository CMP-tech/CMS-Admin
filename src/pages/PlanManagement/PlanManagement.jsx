// src/pages/PlanManagement.js
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Container,
  Typography,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
} from '@mui/material';
import { styled } from '@mui/system'; // Import styled for custom components if needed

// Assuming DashboardLayout is also refactored to use MUI components
// import { DashboardLayout } from '../layouts/DashboardLayout'; // You'll need to adapt this to MUI

const schema = Yup.object().shape({
  name: Yup.string().required('Plan name is required'),
  price: Yup.number().required('Price is required').positive(),
  billingCycle: Yup.string().required('Billing cycle is required'),
});

// A simple mock for DashboardLayout for demonstration.
// In a real application, you would have a proper MUI-based DashboardLayout.
const DashboardLayout = ({ title, children }) => (
  <Box sx={{ flexGrow: 1, p: 3 }}>
    <Typography variant="h4" component="h1" gutterBottom>
      {title}
    </Typography>
    {children}
  </Box>
);

// Custom styled button for actions within the table, similar to the admin login's button styling
const ActionButton = styled(Button)(({ theme, variantcolor }) => ({
  textTransform: 'none',
  fontSize: '0.75rem',
  padding: '4px 8px',
  minWidth: 'auto',
  backgroundColor: variantcolor === 'delete' ? theme.palette.error.main : theme.palette.primary.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: variantcolor === 'delete' ? theme.palette.error.dark : theme.palette.primary.dark,
  },
}));


export default function PlanManagement() {
  const [plans, setPlans] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    // Load mock data
    setPlans([
      { name: 'Free', price: 0, billingCycle: 'Monthly' },
      { name: 'Standard', price: 499, billingCycle: 'Monthly' },
      { name: 'Premium', price: 999, billingCycle: 'Quarterly' },
    ]);
  }, []);

  const onSubmit = (data) => {
    if (editIndex !== null) {
      const updated = [...plans];
      updated[editIndex] = data;
      setPlans(updated);
    } else {
      setPlans([...plans, data]);
    }
    setShowForm(false);
    reset();
    setEditIndex(null);
  };

  const handleEdit = (index) => {
    const plan = plans[index];
    setValue('name', plan.name);
    setValue('price', plan.price);
    setValue('billingCycle', plan.billingCycle);
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    setPlans(plans.filter((_, i) => i !== index));
  };

  return (
    <DashboardLayout title="Plan Management">
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={() => { setShowForm(true); reset(); setEditIndex(null); }}
        >
          Add New Plan
        </Button>
      </Box>

      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <MuiTable>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.light' }}>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>Billing Cycle</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {plans.map((plan, index) => (
                <TableRow key={index} hover>
                  <TableCell>{plan.name}</TableCell>
                  <TableCell>${plan.price}</TableCell>
                  <TableCell>{plan.billingCycle}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <ActionButton onClick={() => handleEdit(index)}>Edit</ActionButton>
                      <ActionButton variantcolor="delete" onClick={() => handleDelete(index)}>Delete</ActionButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </MuiTable>
        </TableContainer>
      </Paper>

      <Dialog open={showForm} onClose={() => { setShowForm(false); reset(); }} maxWidth="sm" fullWidth>
        <DialogTitle>{editIndex !== null ? 'Edit Plan' : 'Add New Plan'}</DialogTitle>
        <DialogContent dividers>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  {...register('name')}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Price"
                  type="number"
                  {...register('price')}
                  error={!!errors.price}
                  helperText={errors.price?.message}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Billing Cycle"
                  {...register('billingCycle')}
                  placeholder="Monthly / Quarterly / Yearly"
                  error={!!errors.billingCycle}
                  helperText={errors.billingCycle?.message}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => { setShowForm(false); reset(); }}
            color="secondary"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)} // Attach handleSubmit to the button directly for form submission
            variant="contained"
            color="primary"
          >
            {editIndex !== null ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}