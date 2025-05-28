import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Tooltip, Snackbar, Alert,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { Pause, PlayArrow } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import axiosInstance from '../../api/axiosInstance';
import { CitySelect, CountrySelect, StateSelect } from 'react-country-state-city';
import "react-country-state-city/dist/react-country-state-city.css";

// Validation Schema
const schema = Yup.object().shape({
  schoolName: Yup.string().required('School name is required'),
  country: Yup.string().required('Country is required'),
  state: Yup.string().required('State is required'),
  city: Yup.string().required('City is required'),
  address: Yup.string().required('Address is required'),
  pincode: Yup.string().required('Pincode is required'),
  contactPerson: Yup.string().required('Contact person is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  contactNumber: Yup.string().required('Contact number is required'),
  plan: Yup.string().required('Plan is required'),
  status: Yup.string().required('Status is required'),
});

// Plan and status options
const planOptions = [
  { label: 'Free', value: 'Free' },
  { label: 'Standard', value: 'Standard' },
  { label: 'Premium', value: 'Premium' },
];

const statusOptions = [
  { label: 'Active', value: 'Active' },
  { label: 'Suspended', value: 'Suspended' },
];

export default function SchoolManagement() {
  const [schools, setSchools] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [countryId, setCountryId] = useState(0);
  const [stateId, setStateId] = useState(0);
  const [cityId, setCityId] = useState(0);

  const {
    control, handleSubmit, reset, setValue, watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const fetchSchools = async () => {
    try {
      const res = await axiosInstance.get('api/schools/get-school');
      console.log('Schools fetched:', res.data);
      setSchools(res.data);
    } catch (err) {
      console.error('Fetch schools error:', err.response || err.message || err);
      setSnackbar({ open: true, message: 'Failed to fetch schools', severity: 'error' });
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const handleOpen = (school = null) => {
    if (school) {
      setEditId(school._id);
      Object.keys(school).forEach((key) => {
        if (key !== '_id') setValue(key, school[key]);
      });
      // For editing, if you want to pre-select the dropdowns, it's more involved.
      // You'd need to find the ID for the stored country/state/city names.
      // For simplicity in this example, we'll let the user re-select these.
    } else {
      reset();
      setEditId(null);
      setCountryId(0);
      setStateId(0);
      setCityId(0);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
    setCountryId(0);
    setStateId(0);
    setCityId(0);
  };

  const onSubmit = async (data) => {
    try {
      if (editId) {
        console.log('Updating school with id:', editId, data);
        await axiosInstance.put(`/api/schools/${editId}`, data);
        setSnackbar({ open: true, message: 'School updated successfully', severity: 'success' });
      } else {
        console.log('Adding new school:', data);
        await axiosInstance.post('/api/schools', data);
        setSnackbar({ open: true, message: 'School added successfully', severity: 'success' });
      }
      fetchSchools();
      handleClose();
    } catch (error) {
      console.error('Submit error:', error.response || error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Something went wrong',
        severity: 'error',
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/schools/${id}`);
      fetchSchools();
      setSnackbar({ open: true, message: 'School deleted', severity: 'success' });
    } catch (err) {
      console.error('Delete error:', err);
      setSnackbar({ open: true, message: 'Failed to delete', severity: 'error' });
    }
  };

  // --- MODIFIED Function for Toggling Status ---
const handleStatusToggle = async (school) => {
  try {
    const newStatus = school.status === 'active' ? 'suspended' : 'active';
    
    await axiosInstance.patch(`/api/schools/${school._id}/status`, { 
      status: newStatus 
    });

    fetchSchools(); // Refresh the list
    setSnackbar({
      open: true,
      message: `School status updated to ${newStatus}`,
      severity: 'success'
    });
  } catch (err) {
    setSnackbar({
      open: true,
      message: err.response?.data?.message || 'Failed to update status',
      severity: 'error'
    });
  }
};
  // -----------------------------------------

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>School Management</Typography>
      <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>Add School</Button>

      {/* Table */}
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>School Name</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>City</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Plan</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schools.map((school) => (
              <TableRow key={school._id}>
                <TableCell>{school.schoolName}</TableCell>
                <TableCell>{school.contactPerson} ({school.contactNumber})</TableCell>
                <TableCell>{school.city}</TableCell>
                <TableCell>{school.state}</TableCell>
                <TableCell>{school.country}</TableCell>
                <TableCell>{school.status}</TableCell>
                <TableCell>{school.plan}</TableCell>
 {/* <TableCell>
    {school.status === 'active' ? 'Active' : 'Suspended'}
  </TableCell> */}
  {/* ... other cells ... */}
  <TableCell align="center">
    <Tooltip title="Edit">
      <IconButton onClick={() => handleOpen(school)}><Edit /></IconButton>
    </Tooltip>
    <Tooltip title="Delete">
      <IconButton onClick={() => handleDelete(school._id)}><Delete /></IconButton>
    </Tooltip>
    
    {/* Status Toggle Button */}
    <Button
      variant="contained"
      size="small"
      color={school.status === 'active' ? 'warning' : 'success'}
      onClick={() => handleStatusToggle(school)}
      startIcon={school.status === 'active' ? <Pause /> : <PlayArrow />}
      sx={{ ml: 1, textTransform: 'none' }}
    >
      {school.status === 'active' ? 'Suspend' : 'Activate'}
    </Button>
  </TableCell>
</TableRow>
            ))}
            {schools.length === 0 && (
              <TableRow><TableCell colSpan={8} align="center">No schools found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog Form */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editId ? 'Edit School' : 'Add School'}</DialogTitle>
        <DialogContent dividers>
          <Box component="form" noValidate>
            <Controller
              name="schoolName"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="dense"
                  label="School Name"
                  fullWidth
                  error={!!errors.schoolName}
                  helperText={errors.schoolName?.message}
                />
              )}
            />

            {/* Country Dropdown */}
            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Country</Typography>
            <CountrySelect
              onChange={(e) => {
                setCountryId(e.id);
                setValue('country', e.name);
                setValue('state', '');
                setValue('city', '');
                setValue('pincode', '');
                setStateId(0);
                setCityId(0);
              }}
              value={countryId}
              name="country"
              className="country-select"
            />
            {errors.country && <Typography color="error" variant="caption">{errors.country.message}</Typography>}

            {/* State Dropdown */}
            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>State</Typography>
            <StateSelect
              countryid={countryId}
              onChange={(e) => {
                setStateId(e.id);
                setValue('state', e.name);
                setValue('city', '');
                setValue('pincode', '');
                setCityId(0);
              }}
              value={stateId}
              name="state"
              className="state-select"
            />
            {errors.state && <Typography color="error" variant="caption">{errors.state.message}</Typography>}

            {/* City Dropdown */}
            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>City</Typography>
            <CitySelect
              countryid={countryId}
              stateid={stateId}
              onChange={(e) => {
                setCityId(e.id);
                setValue('city', e.name);
                setValue('pincode', '');
              }}
              value={cityId}
              name="city"
              className="city-select"
            />
            {errors.city && <Typography color="error" variant="caption">{errors.city.message}</Typography>}

            {/* Pincode TextField */}
            <Controller
              name="pincode"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="dense"
                  label="Pincode"
                  fullWidth
                  error={!!errors.pincode}
                  helperText={errors.pincode?.message}
                />
              )}
            />

            <Controller
              name="address"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="dense"
                  label="Address"
                  fullWidth
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
              )}
            />
            <Controller
              name="contactPerson"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="dense"
                  label="Contact Person"
                  fullWidth
                  error={!!errors.contactPerson}
                  helperText={errors.contactPerson?.message}
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="dense"
                  label="Email"
                  fullWidth
                  type="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
            <Controller
              name="contactNumber"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="dense"
                  label="Contact Number"
                  fullWidth
                  error={!!errors.contactNumber}
                  helperText={errors.contactNumber?.message}
                />
              )}
            />
            <Controller
              name="plan"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  margin="dense"
                  label="Plan"
                  fullWidth
                  error={!!errors.plan}
                  helperText={errors.plan?.message}
                >
                  {planOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </TextField>
              )}
            />
            {/* The status field in the form itself will still be a dropdown */}
            <Controller
              name="status"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  margin="dense"
                  label="Status"
                  fullWidth
                  error={!!errors.status}
                  helperText={errors.status?.message}
                >
                  {statusOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit(onSubmit)}>
            {editId ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}