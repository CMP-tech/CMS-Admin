import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  AlertTitle,
  CircularProgress,
  Tooltip,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Save as SaveIcon,
  Report as ReportIcon,
  FileDownload as FileDownloadIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";

// Mock data for a file upload preview
const mockHeaders = [
  "Roll Number",
  "Student Name",
  "Math",
  "Science",
  "English",
  "Social Studies",
  "Attendance",
];

const mockData = [
  ["101", "John Smith", "85", "78", "92", "88", "95"],
  ["102", "Emma Johnson", "92", "90", "94", "87", "98"],
  ["103", "Michael Brown", "78", "82", "76", "75", "85"],
  ["104", "Sophia Davis", "95", "92", "97", "93", "99"],
  ["105", "William Wilson", "82", "80", "84", "79", "88"],
  ["106", "Olivia Martinez", "89", "85", "91", "84", "94"],
  ["107", "James Taylor", "75", "72", "78", "70", "82"],
  ["108", "Ava Anderson", "91", "88", "94", "90", "97"],
  ["109", "Alexander Thomas", "84", "79", "87", "81", "90"],
  ["110", "Isabella Jackson", "88", "85", "90", "83", "93"],
];

// Steps for the upload process
const steps = ["Upload File", "Column Mapping", "Validation", "Confirmation"];

const DataUploadProcessor = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [processProgress, setProcessProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [columnMappings, setColumnMappings] = useState({
    rollNumber: 0, // Index of roll number column (default 0)
    studentName: 1, // Index of student name column (default 1)
    subjects: {
      math: 2, // Index of math column (default 2)
      science: 3,
      english: 4,
      socialStudies: 5,
    },
    attendance: 6,
  });
  const [errorRows, setErrorRows] = useState([]);
  const [dataPreview, setDataPreview] = useState(mockData);
  const [validationComplete, setValidationComplete] = useState(false);
  const [warningDialogOpen, setWarningDialogOpen] = useState(false);
  const [completionDialogOpen, setCompletionDialogOpen] = useState(false);

  // Simulate file upload and reading
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      simulateFileReading();
    }
  };

  // Simulate reading file content
  const simulateFileReading = () => {
    setIsProcessing(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setProcessProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsProcessing(false);
          // In a real app, we would parse the Excel file here and set its data
          // For now, we'll use mock data
          setDataPreview(mockData);
        }, 500);
      }
    }, 300);
  };

  // Handle column mapping changes
  const handleMappingChange = (field, value) => {
    if (field.includes(".")) {
      // Handle nested properties (for subjects)
      const [parent, child] = field.split(".");
      setColumnMappings({
        ...columnMappings,
        [parent]: {
          ...columnMappings[parent],
          [child]: value,
        },
      });
    } else {
      setColumnMappings({
        ...columnMappings,
        [field]: value,
      });
    }
  };

  // Simulate validation process
  const simulateValidation = () => {
    setIsProcessing(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setProcessProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsProcessing(false);
          setValidationComplete(true);
          // Simulate finding a couple of errors
          setErrorRows([
            {
              rowIndex: 2,
              errors: ["Math score is below passing threshold"],
            },
            {
              rowIndex: 6,
              errors: ["Invalid attendance value", "Missing data in English"],
            },
          ]);
        }, 500);
      }
    }, 400);
  };

  // Simulate data saving process
  const simulateSaving = () => {
    setIsProcessing(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 15;
      setProcessProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsProcessing(false);
          setCompletionDialogOpen(true);
        }, 500);
      }
    }, 300);
  };

  // Handle next step
  const handleNext = () => {
    if (activeStep === 2 && !validationComplete) {
      simulateValidation();
      return;
    }

    if (activeStep === steps.length - 1) {
      // Final step - show warning dialog
      setWarningDialogOpen(true);
      return;
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  // Handle back step
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Handle confirming the import
  const handleConfirmImport = () => {
    setWarningDialogOpen(false);
    simulateSaving();
  };

  // Handle upload completion
  const handleCompletionClose = () => {
    setCompletionDialogOpen(false);
    // In a real app, this would redirect to the section view
    // history.push('/classes/1/sections/1');
    console.log("Upload completed. Redirecting...");
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          sx={{ mr: 2 }}
          variant="outlined"
          color="inherit"
        >
          Back to Section
        </Button>
        <Typography variant="h4" component="h1">
          Upload Student Data
        </Typography>
      </Box>

      {/* Stepper */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Step Content */}
      <Paper sx={{ p: 3, mb: 3 }}>
        {/* Step 1: Upload File */}
        {activeStep === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select Excel File
            </Typography>
            <Typography variant="body1" paragraph>
              Please upload an Excel file (.xlsx, .xls) or CSV file containing
              your student data. The file should include columns for student
              information and their academic performance.
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                my: 4,
              }}
            >
              <input
                accept=".xlsx,.xls,.csv"
                style={{ display: "none" }}
                id="data-upload-button"
                type="file"
                onChange={handleFileChange}
                disabled={isProcessing}
              />
              <label htmlFor="data-upload-button">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                  disabled={isProcessing}
                  size="large"
                  sx={{ mb: 2 }}
                >
                  Select File
                </Button>
              </label>

              {uploadedFile && (
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: 400,
                    textAlign: "center",
                    mt: 2,
                  }}
                >
                  <Alert severity="success" sx={{ mb: 2 }}>
                    File selected: {uploadedFile.name}
                  </Alert>

                  {isProcessing && (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        mt: 2,
                      }}
                    >
                      <CircularProgress
                        variant="determinate"
                        value={processProgress}
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="caption">
                        Processing file... {processProgress}%
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Alert severity="info">
              <AlertTitle>File Requirements</AlertTitle>
              <Typography variant="body2">
                Your file should include the following information:
              </Typography>
              <ul>
                <Typography component="li" variant="body2">
                  Student roll numbers (unique identifiers)
                </Typography>
                <Typography component="li" variant="body2">
                  Student full names
                </Typography>
                <Typography component="li" variant="body2">
                  Subject scores (Math, Science, English, etc.)
                </Typography>
                <Typography component="li" variant="body2">
                  Attendance data (if available)
                </Typography>
              </ul>
              <Box sx={{ mt: 1 }}>
                <Button
                  size="small"
                  startIcon={<FileDownloadIcon />}
                  color="primary"
                >
                  Download Template
                </Button>
              </Box>
            </Alert>
          </Box>
        )}

        {/* Step 2: Column Mapping */}
        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Map Columns
            </Typography>
            <Typography variant="body1" paragraph>
              Please map the columns from your file to the required fields. This
              helps us understand your data structure.
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Roll Number Column</InputLabel>
                  <Select
                    value={columnMappings.rollNumber}
                    label="Roll Number Column"
                    onChange={(e) =>
                      handleMappingChange("rollNumber", e.target.value)
                    }
                  >
                    {mockHeaders.map((header, index) => (
                      <MenuItem key={index} value={index}>
                        {header}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Student Name Column</InputLabel>
                  <Select
                    value={columnMappings.studentName}
                    label="Student Name Column"
                    onChange={(e) =>
                      handleMappingChange("studentName", e.target.value)
                    }
                  >
                    {mockHeaders.map((header, index) => (
                      <MenuItem key={index} value={index}>
                        {header}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Math Column</InputLabel>
                  <Select
                    value={columnMappings.subjects.math}
                    label="Math Column"
                    onChange={(e) =>
                      handleMappingChange("subjects.math", e.target.value)
                    }
                  >
                    {mockHeaders.map((header, index) => (
                      <MenuItem key={index} value={index}>
                        {header}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Science Column</InputLabel>
                  <Select
                    value={columnMappings.subjects.science}
                    label="Science Column"
                    onChange={(e) =>
                      handleMappingChange("subjects.science", e.target.value)
                    }
                  >
                    {mockHeaders.map((header, index) => (
                      <MenuItem key={index} value={index}>
                        {header}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>English Column</InputLabel>
                  <Select
                    value={columnMappings.subjects.english}
                    label="English Column"
                    onChange={(e) =>
                      handleMappingChange("subjects.english", e.target.value)
                    }
                  >
                    {mockHeaders.map((header, index) => (
                      <MenuItem key={index} value={index}>
                        {header}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Attendance Column</InputLabel>
                  <Select
                    value={columnMappings.attendance}
                    label="Attendance Column"
                    onChange={(e) =>
                      handleMappingChange("attendance", e.target.value)
                    }
                  >
                    <MenuItem value={-1}>Not Available</MenuItem>
                    {mockHeaders.map((header, index) => (
                      <MenuItem key={index} value={index}>
                        {header}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Data Preview
            </Typography>

            <TableContainer sx={{ maxHeight: 300 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    {mockHeaders.map((header, index) => (
                      <TableCell key={index}>{header}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataPreview.slice(0, 5).map((row, rowIndex) => (
                    <TableRow key={rowIndex} hover>
                      {row.map((cell, cellIndex) => (
                        <TableCell key={cellIndex}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 1 }}
            >
              Showing first 5 rows of {dataPreview.length} total rows
            </Typography>
          </Box>
        )}

        {/* Step 3: Validation */}
        {activeStep === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Data Validation
            </Typography>
            <Typography variant="body1" paragraph>
              We'll check your data for any issues before importing.
            </Typography>

            {!validationComplete ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  my: 4,
                }}
              >
                {isProcessing ? (
                  <>
                    <CircularProgress
                      variant="determinate"
                      value={processProgress}
                      sx={{ mb: 2 }}
                    />
                    <Typography variant="body2">
                      Validating data... {processProgress}%
                    </Typography>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ReportIcon />}
                    onClick={simulateValidation}
                    sx={{ mb: 2 }}
                  >
                    Validate Data
                  </Button>
                )}
              </Box>
            ) : (
              <Box>
                {errorRows.length === 0 ? (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    <AlertTitle>Validation Successful</AlertTitle>
                    All data passed validation checks. You can proceed to the
                    next step.
                  </Alert>
                ) : (
                  <Alert severity="warning" sx={{ mb: 3 }}>
                    <AlertTitle>Validation Warnings</AlertTitle>
                    Found {errorRows.length} rows with potential issues. You can
                    still proceed, but consider fixing these issues for better
                    data quality.
                  </Alert>
                )}

                {errorRows.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Issues Found:
                    </Typography>

                    <TableContainer
                      component={Paper}
                      variant="outlined"
                      sx={{ mb: 2 }}
                    >
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Row</TableCell>
                            <TableCell>Student</TableCell>
                            <TableCell>Issues</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {errorRows.map((errorRow, index) => (
                            <TableRow key={index} hover>
                              <TableCell>{errorRow.rowIndex + 1}</TableCell>
                              <TableCell>
                                {dataPreview[errorRow.rowIndex][1]}
                              </TableCell>
                              <TableCell>
                                {errorRow.errors.map((error, i) => (
                                  <Chip
                                    key={i}
                                    label={error}
                                    color="error"
                                    size="small"
                                    icon={<ErrorIcon />}
                                    sx={{ mr: 1, mb: 1 }}
                                  />
                                ))}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Data Summary:
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Paper sx={{ p: 2, textAlign: "center" }}>
                        <Typography variant="h4">
                          {dataPreview.length}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Total Students
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Paper sx={{ p: 2, textAlign: "center" }}>
                        <Typography variant="h4">
                          {mockHeaders.length - 2}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Subjects
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Paper sx={{ p: 2, textAlign: "center" }}>
                        <Typography variant="h4">{errorRows.length}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Issues Found
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            )}
          </Box>
        )}

        {/* Step 4: Confirmation */}
        {activeStep === 3 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Confirm Import
            </Typography>

            <Alert severity="warning" sx={{ mb: 3 }}>
              <AlertTitle>Important Notice</AlertTitle>
              <Typography variant="body2">
                You are about to import data for <strong>Section A</strong> of{" "}
                <strong>1st Grade</strong>. This action will:
              </Typography>
              <ul>
                <Typography component="li" variant="body2">
                  Import {dataPreview.length} student records
                </Typography>
                <Typography component="li" variant="body2">
                  Update existing student data if roll numbers match
                </Typography>
                <Typography component="li" variant="body2">
                  Add new students if roll numbers don't exist
                </Typography>
                <Typography component="li" variant="body2">
                  Import scores for{" "}
                  {Object.keys(columnMappings.subjects).length} subjects
                </Typography>
              </ul>
            </Alert>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Final Data Preview:
              </Typography>

              <TableContainer sx={{ maxHeight: 300 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      {mockHeaders.map((header, index) => (
                        <TableCell key={index}>{header}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataPreview.map((row, rowIndex) => (
                      <TableRow
                        key={rowIndex}
                        hover
                        sx={{
                          backgroundColor: errorRows.some(
                            (err) => err.rowIndex === rowIndex
                          )
                            ? "#fff8e1"
                            : "inherit",
                        }}
                      >
                        {row.map((cell, cellIndex) => (
                          <TableCell key={cellIndex}>{cell}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 1 }}
              >
                Showing all {dataPreview.length} rows
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Import Settings:
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Duplicate Handling</InputLabel>
                    <Select defaultValue="update" label="Duplicate Handling">
                      <MenuItem value="update">
                        Update Existing Records
                      </MenuItem>
                      <MenuItem value="skip">Skip Existing Records</MenuItem>
                      <MenuItem value="error">Report as Error</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Error Handling</InputLabel>
                    <Select defaultValue="continue" label="Error Handling">
                      <MenuItem value="continue">
                        Continue with Warnings
                      </MenuItem>
                      <MenuItem value="stop">Stop on First Error</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>

            {isProcessing && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  my: 4,
                }}
              >
                <CircularProgress
                  variant="determinate"
                  value={processProgress}
                  sx={{ mb: 2 }}
                />
                <Typography variant="body2">
                  Importing data... {processProgress}%
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Paper>

      {/* Actions */}
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          variant="outlined"
          onClick={handleBack}
          startIcon={<ArrowBackIcon />}
          disabled={activeStep === 0 || isProcessing}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          disabled={
            isProcessing ||
            (activeStep === 0 && !uploadedFile) ||
            (activeStep === 2 && !validationComplete)
          }
          endIcon={activeStep === steps.length - 1 ? <SaveIcon /> : null}
        >
          {activeStep === steps.length - 1 ? "Import Data" : "Next"}
        </Button>
      </Box>

      {/* Warning Dialog */}
      <Dialog
        open={warningDialogOpen}
        onClose={() => setWarningDialogOpen(false)}
        aria-labelledby="warning-dialog-title"
      >
        <DialogTitle id="warning-dialog-title">Confirm Data Import</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <AlertTitle>Warning</AlertTitle>
            This action will import data for {dataPreview.length} students.
            {errorRows.length > 0 && (
              <Typography variant="body2">
                There are {errorRows.length} rows with potential issues that
                will be imported.
              </Typography>
            )}
          </Alert>
          <Typography variant="body1">
            Are you sure you want to proceed? This action cannot be easily
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWarningDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmImport}
            color="primary"
            variant="contained"
            autoFocus
          >
            Confirm Import
          </Button>
        </DialogActions>
      </Dialog>

      {/* Completion Dialog */}
      <Dialog
        open={completionDialogOpen}
        onClose={handleCompletionClose}
        aria-labelledby="completion-dialog-title"
      >
        <DialogTitle id="completion-dialog-title">Import Complete</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 2,
            }}
          >
            <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Data Successfully Imported!
            </Typography>
          </Box>
          <Typography variant="body1">
            All {dataPreview.length} student records have been successfully
            imported into Section A.
            {errorRows.length > 0 && (
              <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
                {errorRows.length} records were imported with warnings.
              </Typography>
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCompletionClose}
            color="primary"
            variant="contained"
            autoFocus
          >
            View Section Data
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DataUploadProcessor;
