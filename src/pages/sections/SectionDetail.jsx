import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  Breadcrumbs,
  Link,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  AlertTitle,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Tooltip,
  CircularProgress,
  Divider,
  Chip,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  CloudUpload as CloudUploadIcon,
  Download as DownloadIcon,
  Description as DescriptionIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  Compare as CompareIcon,
  AssessmentOutlined as ReportIcon,
  Person as PersonIcon,
  UploadFile as UploadFileIcon,
} from "@mui/icons-material";

// Mock data for a section
const initialSectionData = {
  id: 1,
  name: "Section A",
  className: "1st Grade",
  classId: 1,
  teacherName: "Ms. Johnson",
  roomNumber: "101",
  studentsCount: 42,
  lastUpload: "2023-10-15",
  students: [
    { id: 1, name: "John Smith", rollNumber: "101", averageScore: 87.5 },
    { id: 2, name: "Emma Johnson", rollNumber: "102", averageScore: 92.1 },
    { id: 3, name: "Michael Brown", rollNumber: "103", averageScore: 78.9 },
    { id: 4, name: "Sophia Davis", rollNumber: "104", averageScore: 95.2 },
    { id: 5, name: "William Wilson", rollNumber: "105", averageScore: 81.7 },
  ],
  uploads: [
    {
      id: 1,
      filename: "section_a_data_oct2023.xlsx",
      uploadDate: "2023-10-15",
      recordsCount: 42,
      uploadedBy: "Jane Cooper",
    },
    {
      id: 2,
      filename: "section_a_data_sep2023.xlsx",
      uploadDate: "2023-09-10",
      recordsCount: 40,
      uploadedBy: "Jane Cooper",
    },
  ],
};

const SectionDetail = () => {
  const [sectionData, setSectionData] = useState(initialSectionData);
  const [currentTab, setCurrentTab] = useState(0);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [fileSelected, setFileSelected] = useState(false);
  const [fileName, setFileName] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleUploadOpen = () => {
    setUploadDialogOpen(true);
    setFileSelected(false);
    setFileName("");
    setUploadProgress(0);
  };

  const handleUploadClose = () => {
    setUploadDialogOpen(false);
    setIsUploading(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileSelected(true);
      setFileName(file.name);
    }
  };

  const simulateUpload = () => {
    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          // Simulate processing time after upload completes
          setIsUploading(false);
          // In a real app, we would update the students data here
          handleUploadClose();
          // Update last upload date
          setSectionData({
            ...sectionData,
            lastUpload: new Date().toISOString().split("T")[0],
            uploads: [
              {
                id: sectionData.uploads.length + 1,
                filename: fileName,
                uploadDate: new Date().toISOString().split("T")[0],
                recordsCount: sectionData.students.length,
                uploadedBy: "Current User",
              },
              ...sectionData.uploads,
            ],
          });
        }, 500);
      }
    }, 300);
  };

  const handleDeleteConfirm = (student) => {
    setStudentToDelete(student);
    setConfirmDialogOpen(true);
  };

  const handleDeleteStudent = () => {
    const updatedStudents = sectionData.students.filter(
      (student) => student.id !== studentToDelete.id
    );
    setSectionData({
      ...sectionData,
      students: updatedStudents,
      studentsCount: updatedStudents.length,
    });
    setConfirmDialogOpen(false);
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
        <Link color="inherit" href="#" underline="hover">
          {sectionData.className}
        </Link>
        <Typography color="text.primary">{sectionData.name}</Typography>
      </Breadcrumbs>

      {/* Header with actions */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          sx={{ mr: 2 }}
          variant="outlined"
          color="inherit"
        >
          Back to Class
        </Button>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          {sectionData.className} - {sectionData.name}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<CloudUploadIcon />}
          onClick={handleUploadOpen}
        >
          Upload Student Data
        </Button>
      </Box>

      {/* Section Info Card */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography variant="body1">
              <strong>Class Teacher:</strong> {sectionData.teacherName}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              <strong>Room Number:</strong> {sectionData.roomNumber}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body1">
              <strong>Total Students:</strong> {sectionData.studentsCount}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              <strong>Last Data Upload:</strong>{" "}
              {sectionData.lastUpload || "No uploads yet"}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
              <Tooltip title="Generate Reports">
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<ReportIcon />}
                >
                  Reports
                </Button>
              </Tooltip>
              <Tooltip title="Compare with other sections">
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<CompareIcon />}
                >
                  Compare
                </Button>
              </Tooltip>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Tooltip title="Download template">
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                >
                  Template
                </Button>
              </Tooltip>
              <Tooltip title="Download student data">
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<DescriptionIcon />}
                >
                  Export
                </Button>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs Navigation */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="section tabs"
          variant="fullWidth"
        >
          <Tab label="Students" icon={<PersonIcon />} iconPosition="start" />
          <Tab
            label="Data Uploads"
            icon={<UploadFileIcon />}
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {currentTab === 0 && (
        <Paper>
          <Box
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Student List</Typography>
            <Button startIcon={<RefreshIcon />} size="small">
              Refresh
            </Button>
          </Box>
          <Divider />
          {sectionData.students.length === 0 ? (
            <Box sx={{ p: 3 }}>
              <Alert severity="info">
                <AlertTitle>No Students Available</AlertTitle>
                No student data has been uploaded for this section yet. Click
                the "Upload Student Data" button to import student information.
              </Alert>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Roll Number</TableCell>
                    <TableCell>Student Name</TableCell>
                    <TableCell align="center">Average Score</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sectionData.students.map((student) => (
                    <TableRow key={student.id} hover>
                      <TableCell>{student.rollNumber}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={`${student.averageScore}%`}
                          color={
                            student.averageScore >= 90
                              ? "success"
                              : student.averageScore >= 75
                              ? "primary"
                              : student.averageScore >= 60
                              ? "warning"
                              : "error"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="View student details">
                          <IconButton size="small" color="primary">
                            <PersonIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete student">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteConfirm(student)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}

      {/* Data Uploads Tab */}
      {currentTab === 1 && (
        <Paper>
          <Box
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Upload History</Typography>
          </Box>
          <Divider />
          {sectionData.uploads && sectionData.uploads.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Filename</TableCell>
                    <TableCell>Upload Date</TableCell>
                    <TableCell align="center">Records</TableCell>
                    <TableCell>Uploaded By</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sectionData.uploads.map((upload) => (
                    <TableRow key={upload.id} hover>
                      <TableCell>{upload.filename}</TableCell>
                      <TableCell>{upload.uploadDate}</TableCell>
                      <TableCell align="center">
                        {upload.recordsCount}
                      </TableCell>
                      <TableCell>{upload.uploadedBy}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Download file">
                          <IconButton size="small" color="primary">
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete upload">
                          <IconButton size="small" color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ p: 3 }}>
              <Alert severity="info">
                <AlertTitle>No Upload History</AlertTitle>
                No files have been uploaded for this section yet.
              </Alert>
            </Box>
          )}
        </Paper>
      )}

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={!isUploading ? handleUploadClose : undefined}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Upload Student Data</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Upload an Excel file (.xlsx) containing student data. Please use the
            template for correct formatting.
          </DialogContentText>

          {!isUploading ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                my: 2,
              }}
            >
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                sx={{ mb: 2 }}
              >
                Select File
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
              {fileSelected && (
                <Typography variant="body2" color="text.secondary">
                  Selected: {fileName}
                </Typography>
              )}
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                my: 3,
              }}
            >
              <CircularProgress
                variant="determinate"
                value={uploadProgress}
                size={60}
                thickness={4}
                sx={{ mb: 2 }}
              />
              <Typography variant="body1">
                {uploadProgress < 100 ? "Uploading..." : "Processing data..."}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {fileName}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {!isUploading && (
            <>
              <Button onClick={handleUploadClose} color="inherit">
                Cancel
              </Button>
              <Button
                onClick={simulateUpload}
                color="primary"
                variant="contained"
                disabled={!fileSelected}
                startIcon={<CloudUploadIcon />}
              >
                Upload
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the student record for{" "}
            {studentToDelete?.name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteStudent}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SectionDetail;
