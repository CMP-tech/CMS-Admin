import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Divider,
  Tooltip,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";

const ClassesManagement = () => {
  const [classes, setClasses] = useState([
    {
      id: 1,
      name: "1st Grade",
      sectionsCount: 3,
      studentsCount: 120,
      year: "2024-2025",
    },
    {
      id: 2,
      name: "2nd Grade",
      sectionsCount: 2,
      studentsCount: 90,
      year: "2024-2025",
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [className, setClassName] = useState("");
  const [academicYear, setAcademicYear] = useState("2024-2025");
  const [notes, setNotes] = useState("");

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    // Reset form
    setClassName("");
    setAcademicYear("2024-2025");
    setNotes("");
  };

  const handleAddClass = () => {
    const newClass = {
      id: classes.length + 1,
      name: className,
      sectionsCount: 0,
      studentsCount: 0,
      year: academicYear,
    };

    setClasses([...classes, newClass]);
    handleCloseDialog();
  };

  const handleClassClick = (classId) => {
    // Navigate to class detail page or expand in the future
    console.log(`Navigate to class ${classId} details`);
    // This would typically use React Router to navigate
    // history.push(`/classes/${classId}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Classes Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Add Class
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Overview
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Classes
                </Typography>
                <Typography variant="h4">{classes.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Sections
                </Typography>
                <Typography variant="h4">
                  {classes.reduce((total, cls) => total + cls.sectionsCount, 0)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Students
                </Typography>
                <Typography variant="h4">
                  {classes.reduce((total, cls) => total + cls.studentsCount, 0)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h6" gutterBottom>
        All Classes
      </Typography>

      {classes.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No classes added yet. Click the "Add Class" button to create your
          first class.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {classes.map((cls) => (
            <Grid item xs={12} sm={6} md={4} key={cls.id}>
              <Card
                sx={{
                  cursor: "pointer",
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": { transform: "translateY(-4px)", boxShadow: 3 },
                }}
                onClick={() => handleClassClick(cls.id)}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <SchoolIcon sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="h6" component="div">
                      {cls.name}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <IconButton size="small">
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Academic Year: {cls.year}
                  </Typography>
                  <Typography variant="body2">
                    {cls.sectionsCount} Sections • {cls.studentsCount} Students
                  </Typography>
                </CardContent>
                <CardActions>
                  <Tooltip title="Edit Class">
                    <IconButton size="small" color="primary">
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Class">
                    <IconButton size="small" color="error">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Box sx={{ flexGrow: 1 }} />
                  <Button size="small" color="primary">
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add Class Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Class</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="className"
            label="Class Name"
            type="text"
            fullWidth
            variant="outlined"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
            placeholder="e.g., 1st Grade, 2nd Grade"
          />
          <TextField
            margin="dense"
            id="academicYear"
            label="Academic Year"
            type="text"
            fullWidth
            variant="outlined"
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            id="notes"
            label="Additional Notes"
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleAddClass}
            color="primary"
            variant="contained"
            disabled={!className.trim()}
          >
            Add Class
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClassesManagement;
