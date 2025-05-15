import React, { useState, useCallback } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Divider,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { jsPDF } from "jspdf";

// Card Component for Student Info
const StudentCard = ({ title, student, color = "primary.main" }) => (
  <Card
    variant="outlined"
    sx={{
      minWidth: 250,
      borderLeft: `6px solid`,
      borderColor: color,
      boxShadow: 1,
    }}
  >
    <CardContent>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography>
        <strong>Name:</strong> {student.name}
      </Typography>
      <Typography>
        <strong>Total:</strong> {student.total}
      </Typography>
      <Typography>
        <strong>Percentage:</strong> {student.percentage}%
      </Typography>
    </CardContent>
  </Card>
);

const Home = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [examName, setExamName] = useState("");
  const [subjects, setSubjects] = useState([
    { name: "", maxMarks: "", topics: "" },
  ]);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubjectChange = (index, field, value) => {
    const updated = [...subjects];
    updated[index][field] = value;
    setSubjects(updated);
  };

  const addSubject = () => {
    setSubjects([...subjects, { name: "", maxMarks: "", topics: "" }]);
  };

  const handleSubmit = async () => {
    if (!file || !examName || subjects.some((s) => !s.name || !s.maxMarks)) {
      setErrorMsg("Please fill all fields including subject names and marks.");
      setShowError(true);
      return;
    }

    const subjectsInfo = {};
    subjects.forEach((s) => {
      subjectsInfo[s.name] = {
        maxMarks: Number(s.maxMarks),
        topics: s.topics.split(",").map((t) => t.trim()),
      };
    });

    const formData = new FormData();
    formData.append("file", file); // Ensure backend uses .single("file")
    formData.append("examName", examName);
    formData.append("subjectsInfo", JSON.stringify(subjectsInfo));

    setLoading(true);
    try {
      const response = await axios.post(
        "https://school-ai-be-1.onrender.com/upload",
        formData
      );
      setReport(response.data);
      console.log(response, "resonse");
    } catch (error) {
      const err =
        error?.response?.data?.error || "Something went wrong during upload.";
      setErrorMsg(err);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const generatePdf = useCallback((title, content) => {
    const pdf = new jsPDF();
    const margin = 10;
    const lineHeight = 7;
    let y = margin;

    pdf.setFontSize(16);
    pdf.text(title, margin, y);
    y += 10;

    pdf.setFontSize(12);
    const lines = pdf.splitTextToSize(content, 180);
    lines.forEach((line) => {
      if (y + lineHeight > pdf.internal.pageSize.height - margin) {
        pdf.addPage();
        y = margin;
      }
      pdf.text(line, margin, y);
      y += lineHeight;
    });

    return pdf;
  }, []);

  const downloadSummaryPdf = () => {
    const pdf = generatePdf("Student Performance Summary", report.summary);
    pdf.save("student-summary.pdf");
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" gutterBottom>
        📘 Upload Exam Report
      </Typography>

      {/* Exam & Subject Details */}
      <Box mb={4}>
        <TextField
          label="Exam Name"
          fullWidth
          value={examName}
          onChange={(e) => setExamName(e.target.value)}
          sx={{ mb: 2 }}
        />
        {subjects.map((subj, i) => (
          <Box key={i} display="flex" gap={2} mb={1}>
            <TextField
              label="Subject Name"
              value={subj.name}
              onChange={(e) => handleSubjectChange(i, "name", e.target.value)}
            />
            <TextField
              label="Max Marks"
              type="number"
              value={subj.maxMarks}
              onChange={(e) =>
                handleSubjectChange(i, "maxMarks", e.target.value)
              }
            />
            <TextField
              label="Topics (comma separated)"
              fullWidth
              value={subj.topics}
              onChange={(e) => handleSubjectChange(i, "topics", e.target.value)}
            />
          </Box>
        ))}
        <Button
          onClick={addSubject}
          startIcon={<AddIcon />}
          variant="outlined"
          sx={{ mt: 1 }}
        >
          Add Subject
        </Button>
      </Box>

      {/* File Upload */}
      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUploadIcon />}
        >
          Choose File
          <input
            type="file"
            hidden
            accept=".xlsx,.xls"
            onChange={handleFileChange}
          />
        </Button>
        {file && <Typography>{file.name}</Typography>}
        <Button
          variant="contained"
          color="success"
          onClick={handleSubmit}
          disabled={!file || loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
        </Button>
      </Box>

      {/* Summary & Result Section */}
      {report && (
        <>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h5">📋 Summary</Typography>
          <Paper
            variant="outlined"
            sx={{ p: 2, mt: 1, whiteSpace: "pre-wrap", bgcolor: "#f5f5f5" }}
          >
            {report.summary}
          </Paper>
          <Button
            variant="contained"
            color="error"
            startIcon={<PictureAsPdfIcon />}
            onClick={downloadSummaryPdf}
            sx={{ mt: 2 }}
          >
            Download Summary PDF
          </Button>

          {/* Topper */}
          <Divider textAlign="left" sx={{ mt: 5, mb: 2 }}>
            <Typography variant="h5">🏆 Topper</Typography>
          </Divider>
          <StudentCard title="Topper" student={report.topper} color="gold" />

          {/* Top 3 */}
          <Divider textAlign="left" sx={{ mt: 5, mb: 2 }}>
            <Typography variant="h5">🥇 Top 3 Students</Typography>
          </Divider>
          <Grid container spacing={2}>
            {report.top3.map((student, idx) => (
              <Grid item key={idx} xs={12} sm={6} md={4}>
                <StudentCard title={`Rank ${idx + 1}`} student={student} />
              </Grid>
            ))}
          </Grid>

          {/* Bottom 3 */}
          <Divider textAlign="left" sx={{ mt: 5, mb: 2 }}>
            <Typography variant="h5">📉 Bottom 3 Students</Typography>
          </Divider>
          <Grid container spacing={2}>
            {report.bottom3.map((student, idx) => (
              <Grid item key={idx} xs={12} sm={6} md={4}>
                <StudentCard
                  title={`Bottom ${idx + 1}`}
                  student={student}
                  color="error.main"
                />
              </Grid>
            ))}
          </Grid>

          {/* All Students Table */}
          <Divider textAlign="left" sx={{ mt: 5, mb: 2 }}>
            <Typography variant="h5">👥 All Students</Typography>
          </Divider>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Name</strong>
                  </TableCell>
                  {/* {report?.subjectKeys?.map((subject, idx) => (
                    <TableCell key={idx}>{subject}</TableCell>
                  ))} */}
                  <TableCell>Total</TableCell>
                  <TableCell>Percentage</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {report.students.map((student, index) => (
                  <TableRow key={index}>
                    <TableCell>{student.Name}</TableCell>
                    {/* {report.subjectK.map((subject, idx) => (
                      <TableCell key={idx}>{student[subject]}</TableCell>
                    ))} */}
                    <TableCell>{student.Total}</TableCell>
                    <TableCell>{student.Percentage}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Error Modal */}
      <Dialog open={showError} onClose={() => setShowError(false)}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ whiteSpace: "pre-wrap" }}>
            {errorMsg}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowError(false)} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Home;
