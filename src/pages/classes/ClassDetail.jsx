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
  Tooltip,
  Alert,
  Breadcrumbs,
  Link,
  Tabs,
  Tab,
  Divider,
  MenuItem,
  Menu,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  CloudUpload as CloudUploadIcon,
  People as PeopleIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";

// Mock data for a class
const initialClassData = {
  id: 1,
  name: "1st Grade",
  academicYear: "2024-2025",
  notes: "Primary section with focus on fundamental skills",
  sections: [
    {
      id: 1,
      name: "Section A",
      teacherName: "Ms. Johnson",
      studentsCount: 42,
      roomNumber: "101",
    },
    {
      id: 2,
      name: "Section B",
      teacherName: "Mr. Smith",
      studentsCount: 38,
      roomNumber: "102",
    },
    {
      id: 3,
      name: "Section C",
      teacherName: "Mrs. Davis",
      studentsCount: 40,
      roomNumber: "103",
    },
  ],
};

const ClassDetail = () => {
  const [classData, setClassData] = useState(initialClassData);
  const [currentTab, setCurrentTab] = useState(0);
  const [openSectionDialog, setOpenSectionDialog] = useState(false);
  const [newSectionData, setNewSectionData] = useState({
    name: "",
    teacherName: "",
    roomNumber: "",
  });
  const [anchorEl, setAnchorEl] = useState(null);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleOpenSectionDialog = () => {
    setOpenSectionDialog(true);
  };

  const handleCloseSectionDialog = () => {
    setOpenSectionDialog(false);
    setNewSectionData({
      name: "",
      teacherName: "",
      roomNumber: "",
    });
  };

  const handleAddSection = () => {
    const newSection = {
      id: classData.sections.length + 1,
      name: newSectionData.name,
      teacherName: newSectionData.teacherName,
      roomNumber: newSectionData.roomNumber,
      studentsCount: 0, // New sections start with 0 students
    };

    setClassData({
      ...classData,
      sections: [...classData.sections, newSection],
    });

    handleCloseSectionDialog();
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSectionClick = (sectionId) => {
    // Navigate to section details
    console.log(`Navigate to section ${sectionId}`);
    // In a real app, you would use React Router:
    // history.push(`/classes/${classData.id}/sections/${sectionId}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Breadcrumb Navigation */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link color="inherit" href="#" underline="hover">
          Dashboard
        </Link>
        <Link color="inherit" href="#" underline="hover">
          Classes
        </Link>
        <Typography color="text.primary">{classData.name}</Typography>
      </Breadcrumbs>

      {/* Header with actions */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          sx={{ mr: 2 }}
          variant="outlined"
          color="inherit"
        >
          Back to Classes
        </Button>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          {classData.name}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenSectionDialog}
          sx={{ mr: 1 }}
        >
          Add Section
        </Button>
        <IconButton onClick={handleMenuOpen}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>
            <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit Class
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete Class
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <CloudUploadIcon fontSize="small" sx={{ mr: 1 }} /> Bulk Import
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <SettingsIcon fontSize="small" sx={{ mr: 1 }} /> Class Settings
          </MenuItem>
        </Menu>
      </Box>

      {/* Class Info Card */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              <strong>Academic Year:</strong> {classData.academicYear}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              <strong>Total Sections:</strong> {classData.sections.length}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              <strong>Total Students:</strong>{" "}
              {classData.sections.reduce(
                (sum, section) => sum + section.studentsCount,
                0
              )}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              <strong>Notes:</strong> {classData.notes || "No additional notes"}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs Navigation */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="class tabs"
          variant="fullWidth"
        >
          <Tab label="Sections" icon={<PeopleIcon />} iconPosition="start" />
          <Tab
            label="Performance"
            icon={<BarChartIcon />}
            iconPosition="start"
          />
          <Tab label="Settings" icon={<SettingsIcon />} iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {currentTab === 0 && (
        <>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Class Sections
          </Typography>
          {classData.sections.length === 0 ? (
            <Alert severity="info">
              No sections have been added to this class yet. Click "Add Section"
              to create a new section.
            </Alert>
          ) : (
            <Grid container spacing={3}>
              {classData.sections.map((section) => (
                <Grid item xs={12} sm={6} md={4} key={section.id}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      transition: "transform 0.15s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 3,
                      },
                    }}
                    onClick={() => handleSectionClick(section.id)}
                  >
                    <CardContent>
                      <Typography variant="h6" component="div" gutterBottom>
                        {section.name}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        <strong>Teacher:</strong> {section.teacherName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Room:</strong> {section.roomNumber}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Students:</strong> {section.studentsCount}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Tooltip title="Edit Section">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log(`Edit section ${section.id}`);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Section">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log(`Delete section ${section.id}`);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Box sx={{ flexGrow: 1 }} />
                      <Button
                        size="small"
                        color="primary"
                        startIcon={<CloudUploadIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log(`Upload data for section ${section.id}`);
                        }}
                      >
                        Upload Data
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      {currentTab === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Performance Metrics
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Performance comparison charts between sections will be displayed
            here.
          </Alert>
          <Typography variant="body1">
            This tab will contain charts and graphs comparing performance
            metrics across different sections. You will be able to compare by:
          </Typography>
          <ul>
            <Typography component="li" variant="body1">
              Subject-wise averages
            </Typography>
            <Typography component="li" variant="body1">
              Attendance metrics
            </Typography>
            <Typography component="li" variant="body1">
              Overall grade distribution
            </Typography>
            <Typography component="li" variant="body1">
              Progress over time
            </Typography>
          </ul>
        </Paper>
      )}

      {currentTab === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Class Settings
          </Typography>
          <Alert severity="info">
            Additional configuration options for this class will be available
            here.
          </Alert>
        </Paper>
      )}

      {/* Add Section Dialog */}
      <Dialog
        open={openSectionDialog}
        onClose={handleCloseSectionDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Section</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="sectionName"
            label="Section Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newSectionData.name}
            onChange={(e) =>
              setNewSectionData({ ...newSectionData, name: e.target.value })
            }
            sx={{ mb: 2, mt: 1 }}
            placeholder="e.g., Section A, Section B"
          />
          <TextField
            margin="dense"
            id="teacherName"
            label="Class Teacher"
            type="text"
            fullWidth
            variant="outlined"
            value={newSectionData.teacherName}
            onChange={(e) =>
              setNewSectionData({
                ...newSectionData,
                teacherName: e.target.value,
              })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            id="roomNumber"
            label="Room Number (Optional)"
            type="text"
            fullWidth
            variant="outlined"
            value={newSectionData.roomNumber}
            onChange={(e) =>
              setNewSectionData({
                ...newSectionData,
                roomNumber: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSectionDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleAddSection}
            color="primary"
            variant="contained"
            disabled={
              !newSectionData.name.trim() || !newSectionData.teacherName.trim()
            }
          >
            Add Section
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClassDetail;
