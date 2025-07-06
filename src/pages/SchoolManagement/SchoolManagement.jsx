import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Tooltip, Snackbar, Alert,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime'; // ⬅️ Add at top with other MUI imports
import { Add, Edit, Delete } from '@mui/icons-material';
import { Pause, PlayArrow } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import axiosInstance from '../../api/axiosInstance';
import { CitySelect, CountrySelect, StateSelect } from 'react-country-state-city';
import "react-country-state-city/dist/react-country-state-city.css";

// Validation Schema (plan removed)
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
  status: Yup.string().required('Status is required'),
});

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Suspended', value: 'suspended' },
];

export default function SchoolManagement() {
  const [schools, setSchools] = useState([]);
  const [counts, setCounts] = useState({ total: 0, active: 0, suspended: 0 });
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [countryId, setCountryId] = useState(0);
  const [stateId, setStateId] = useState(0);
  const [cityId, setCityId] = useState(0);

  const {
    control, handleSubmit, reset, setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const fetchSchools = async () => {
    try {
      const res = await axiosInstance.get('api/schools/get-school');
      const { schools, counts } = res.data;

      if (Array.isArray(schools)) {
        setSchools(schools);
      } else {
        setSchools([]);
      }

      setCounts(counts || { total: 0, active: 0, suspended: 0 });
    } catch (err) {
      console.error('Fetch schools error:', err);
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
        await axiosInstance.put(`/api/schools/${editId}`, data);
        setSnackbar({ open: true, message: 'School updated successfully', severity: 'success' });
      } else {
        await axiosInstance.post('/api/schools', data);
        setSnackbar({ open: true, message: 'School added successfully', severity: 'success' });
      }
      fetchSchools();
      handleClose();
    } catch (error) {
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
      setSnackbar({ open: true, message: 'Failed to delete', severity: 'error' });
    }
  };

  const handleStatusToggle = async (school) => {
    try {
      const newStatus = school.status === 'active' ? 'suspended' : 'active';

      await axiosInstance.patch(`/api/schools/${school._id}/status`, {
        status: newStatus,
      });

      fetchSchools();
      setSnackbar({
        open: true,
        message: `School status updated to ${newStatus}`,
        severity: 'success',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to update status',
        severity: 'error',
      });
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>School Management</Typography>

      {/* Counts Section */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body1">
          Total: <strong>{counts.total}</strong> | Active: <strong>{counts.active}</strong> | Suspended: <strong>{counts.suspended}</strong>
        </Typography>
      </Box>

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
    <TableCell>Last Logged In</TableCell> {/* ✅ Add this line */}
    <TableCell align="center">Actions</TableCell>
  </TableRow>
</TableHead>

          <TableBody>
            {schools.map((school) => (
              <TableRow key={school._id}>
                <TableCell>{school.schoolName}</TableCell>
                <TableCell>{school.contactPerson} ({school.contactNumber})</TableCell>
                <TableCell>{school.city}</TableCell>
                <TableCell>{school.pincode}</TableCell>
                <TableCell>{school.country}</TableCell>
                <TableCell>{school.status}</TableCell>
                 <TableCell>
  {school.lastLoggedIn ? (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <AccessTimeIcon fontSize="small" color="action" />
      <Box>
        <Typography variant="body2" fontWeight={500}>
          {new Date(school.lastLoggedIn).toLocaleDateString()}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {new Date(school.lastLoggedIn).toLocaleTimeString()}
        </Typography>
      </Box>
    </Box>
  ) : (
    <Typography variant="body2" color="text.disabled">Never</Typography>
  )}
</TableCell>

                <TableCell align="center">
                  <Tooltip title="Edit">
                    <IconButton onClick={() => handleOpen(school)}><Edit /></IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => handleDelete(school._id)}><Delete /></IconButton>
                  </Tooltip>
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
              <TableRow><TableCell colSpan={7} align="center">No schools found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog */}
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

            {/* Pincode */}
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

            {/* Address, Contact, Email */}
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
            {/* Status */}
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
