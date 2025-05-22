// src/pages/academic/Academicyear.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "../../api/axiosInstance"; // Adjust path if needed
import { format } from "date-fns"; // For formatting dates

// Assuming your backend is running on this URL
// const API_URL = "http://localhost:5000/api"; // Adjust if your backend port/route is different

const Academicyear = () => {
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentAcademicYear, setCurrentAcademicYear] = useState(null); // For editing

  // Form states for the dialog
  const [yearName, setYearName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchAcademicYears();
  }, []);

  const fetchAcademicYears = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/");
      if (response.data.success) {
        setAcademicYears(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch academic years.");
      }
    } catch (err) {
      setError(
        "Failed to fetch academic years. Please check server connection."
      );
      console.error("Error fetching academic years:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateDialog = () => {
    setCurrentAcademicYear(null); // Clear for new creation
    setYearName("");
    setStartDate("");
    setEndDate("");
    setDescription("");
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (year) => {
    setCurrentAcademicYear(year);
    setYearName(year.yearName);
    // Format dates to YYYY-MM-DD for TextField type="date"
    setStartDate(
      year.startDate ? format(new Date(year.startDate), "yyyy-MM-dd") : ""
    );
    setEndDate(
      year.endDate ? format(new Date(year.endDate), "yyyy-MM-dd") : ""
    );
    setDescription(year.description);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    // Reset form states when dialog closes
    setYearName("");
    setStartDate("");
    setEndDate("");
    setDescription("");
    setCurrentAcademicYear(null);
  };

  const handleSaveAcademicYear = async () => {
    setError(null);
    if (!yearName.trim() || !startDate || !endDate) {
      setError("Academic Year Name, Start Date, and End Date are required.");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError("Start Date cannot be after End Date.");
      return;
    }

    const yearData = {
      yearName,
      startDate,
      endDate,
      description,
    };

    try {
      let response;
      if (currentAcademicYear) {
        // Update existing academic year
        const response = await axios.put(
          `/${currentAcademicYear._id}`,
          yearData
        );
      } else {
        // Create new academic year
        const response = await axios.post("/", yearData);
      }

      if (response.data.success) {
        handleCloseDialog();
        fetchAcademicYears(); // Refresh list
      } else {
        setError(response.data.message || "Failed to save academic year.");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to save academic year. Please try again.";
      setError(errorMessage);
      console.error("Error saving academic year:", err);
    }
  };

  const handleDeleteAcademicYear = async (id) => {
    setError(null);
    if (
      window.confirm(
        "Are you sure you want to delete this academic year? This action cannot be undone."
      )
    ) {
      try {
        const response = await axios.delete(`/${id}`);
        if (response.data.success) {
          fetchAcademicYears(); // Refresh list
        } else {
          setError(response.data.message || "Failed to delete academic year.");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          "Failed to delete academic year. Please try again.";
        setError(errorMessage);
        console.error("Error deleting academic year:", err);
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Academic Year Management
      </Typography>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleOpenCreateDialog}
        sx={{ mb: 3 }}
      >
        Create Academic Year
      </Button>

      {loading && <CircularProgress sx={{ mt: 2 }} />}
      {error && (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && academicYears.length === 0 && (
        <Typography sx={{ mt: 2 }}>
          No academic years found. Start by creating one!
        </Typography>
      )}

      {!loading && academicYears.length > 0 && (
        <TableContainer component={Paper} elevation={3}>
          <Table aria-label="academic years table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                <TableCell>Academic Year Name</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {academicYears.map((year) => (
                <TableRow
                  key={year._id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": { backgroundColor: "#f9f9f9" },
                  }}
                >
                  <TableCell component="th" scope="row">
                    {year.yearName}
                  </TableCell>
                  <TableCell>
                    {year.startDate
                      ? format(new Date(year.startDate), "PPP")
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {year.endDate
                      ? format(new Date(year.endDate), "PPP")
                      : "N/A"}
                  </TableCell>
                  <TableCell>{year.description || "N/A"}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenEditDialog(year)}
                      aria-label={`edit ${year.yearName}`}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteAcademicYear(year._id)}
                      aria-label={`delete ${year.yearName}`}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create/Edit Academic Year Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {currentAcademicYear
            ? "Edit Academic Year"
            : "Create New Academic Year"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="yearName"
            label="Academic Year Name"
            type="text"
            fullWidth
            variant="outlined"
            value={yearName}
            onChange={(e) => setYearName(e.target.value)}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            margin="dense"
            id="startDate"
            label="Start Date"
            type="date"
            fullWidth
            variant="outlined"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            margin="dense"
            id="endDate"
            label="End Date"
            type="date"
            fullWidth
            variant="outlined"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            margin="dense"
            id="description"
            label="Description (Optional)"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSaveAcademicYear}
            variant="contained"
            color="primary"
          >
            {currentAcademicYear ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Academicyear;
