import React, { useState, useRef } from "react";
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
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import axios from "axios";
import { jsPDF } from "jspdf";

// Card Component
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
      <Typography variant="h6" gutterBottom color="text.primary">
        {title}
      </Typography>
      <Typography>
        <strong>Name:</strong> {student.Name}
      </Typography>
      <Typography>
        <strong>Total:</strong> {student.Total}
      </Typography>
      <Typography>
        <strong>Percentage:</strong> {student.Percentage}%
      </Typography>
      <Typography variant="body2" color="text.secondary" mt={1}>
        H: {student.Hindi}, E: {student.English}, M: {student.Math}, S:{" "}
        {student.Science}, SST: {student.SST}
      </Typography>
    </CardContent>
  </Card>
);

const Home = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) return alert("Please select a file.");
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);

    try {
      const response = await axios.post(
        "https://school-ai-be-1.onrender.com/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setReport(response.data);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = () => {
    if (!report?.summary) return;

    const pdf = new jsPDF();
    const margin = 10;
    const lineHeight = 7;
    const pageHeight = pdf.internal.pageSize.height;

    const lines = pdf.splitTextToSize(report.summary, 180);
    let y = margin;

    pdf.setFontSize(16);
    pdf.text("Student Performance Summary", margin, y);
    y += 10;

    pdf.setFontSize(12);
    lines.forEach((line) => {
      if (y + lineHeight > pageHeight - margin) {
        pdf.addPage();
        y = margin;
      }
      pdf.text(line, margin, y);
      y += lineHeight;
    });

    pdf.save("student-summary.pdf");
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        📊 Upload Student Performance Excel
      </Typography>

      <Box display="flex" flexWrap="wrap" gap={2} mb={4} alignItems="center">
        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUploadIcon />}
        >
          Choose File
          <input
            type="file"
            hidden
            accept=".xlsx, .xls"
            onChange={handleFileChange}
          />
        </Button>

        {file && (
          <Typography variant="body1" color="text.secondary">
            {file.name}
          </Typography>
        )}

        <Button
          variant="contained"
          color="success"
          onClick={handleSubmit}
          disabled={!file || loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
        </Button>

        {report && (
          <Button
            variant="contained"
            color="error"
            startIcon={<PictureAsPdfIcon />}
            onClick={downloadPdf}
          >
            Download Summary PDF
          </Button>
        )}
      </Box>

      {report && (
        <Box mt={4}>
          {/* Summary */}
          <Divider textAlign="left" sx={{ mb: 2 }}>
            <Typography variant="h5">📋 Summary</Typography>
          </Divider>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              whiteSpace: "pre-wrap",
              bgcolor: "#f9f9f9",
              maxHeight: 300,
              overflow: "auto",
            }}
          >
            {report.summary}
          </Paper>

          {/* Topper */}
          <Divider textAlign="left" sx={{ mt: 5, mb: 2 }}>
            <Typography variant="h5">🏆 Topper</Typography>
          </Divider>
          <StudentCard
            title="Top Student"
            student={report.topper}
            color="gold"
          />

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
          <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell>Hindi</TableCell>
                  <TableCell>English</TableCell>
                  <TableCell>Math</TableCell>
                  <TableCell>Science</TableCell>
                  <TableCell>SST</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Percentage</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {report.students.map((student, index) => (
                  <TableRow key={index}>
                    <TableCell>{student.Name}</TableCell>
                    <TableCell>{student.Hindi}</TableCell>
                    <TableCell>{student.English}</TableCell>
                    <TableCell>{student.Math}</TableCell>
                    <TableCell>{student.Science}</TableCell>
                    <TableCell>{student.SST}</TableCell>
                    <TableCell>{student.Total}</TableCell>
                    <TableCell>{student.Percentage}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Container>
  );
};

export default Home;
