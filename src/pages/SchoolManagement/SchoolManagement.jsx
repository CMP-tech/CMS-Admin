// src/pages/SchoolManagement.js (MUI Version)
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Add, Edit, Delete, Block } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

const schema = Yup.object().shape({
  name: Yup.string().required('School name is required'),
  plan: Yup.string().required('Plan is required'),
  status: Yup.string().required('Status is required'),
});

const planOptions = [
  { label: 'Free', value: 'free' },
  { label: 'Standard', value: 'standard' },
  { label: 'Premium', value: 'premium' },
];

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Suspended', value: 'suspended' },
];

export default function SchoolManagement() {
  const [schools, setSchools] = useState([]);
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    setSchools([
      { name: 'Sunshine Public School', plan: 'Standard', status: 'Active', lastLogin: '2025-05-20', usage: '87%' },
      { name: 'Greenfield Academy', plan: 'Premium', status: 'Suspended', lastLogin: '2025-05-15', usage: '65%' },
    ]);
  }, []);

  const onSubmit = (data) => {
    if (editIndex !== null) {
      const updated = [...schools];
      updated[editIndex] = { ...updated[editIndex], ...data };
      setSchools(updated);
    } else {
      setSchools([...schools, { ...data, lastLogin: '-', usage: '0%' }]);
    }
    handleClose();
  };

  const handleEdit = (index) => {
    const school = schools[index];
    setValue('name', school.name);
    setValue('plan', school.plan);
    setValue('status', school.status);
    setEditIndex(index);
    setOpen(true);
  };

  const handleDelete = (index) => {
    setSchools(schools.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    setOpen(false);
    reset();
    setEditIndex(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">School Management</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
          Add New School
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>School Name</TableCell>
              <TableCell>Plan</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Login</TableCell>
              <TableCell>Usage %</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schools.map((school, index) => (
              <TableRow key={index}>
                <TableCell>{school.name}</TableCell>
                <TableCell>{school.plan}</TableCell>
                <TableCell>{school.status}</TableCell>
                <TableCell>{school.lastLogin}</TableCell>
                <TableCell>{school.usage}</TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton color="primary" onClick={() => handleEdit(index)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Suspend">
                    <IconButton color="warning" onClick={() => alert('Suspend not implemented')}>
                      <Block />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => handleDelete(index)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editIndex !== null ? 'Edit School' : 'Add New School'}</DialogTitle>
        <DialogContent dividers>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField {...field} label="School Name" fullWidth error={!!errors.name} helperText={errors.name?.message} />
              )}
            />
            <Controller
              name="plan"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Plan"
                  select
                  fullWidth
                  error={!!errors.plan}
                  helperText={errors.plan?.message}
                >
                  {planOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Controller
              name="status"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Status"
                  select
                  fullWidth
                  error={!!errors.status}
                  helperText={errors.status?.message}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} variant="contained">
            {editIndex !== null ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}