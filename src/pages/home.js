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
  Collapse,
  Tabs,
  Tab,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import axiosInstance from "../api/axiosInstance";
import { jsPDF } from "jspdf";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Define a vibrant color palette
const vibrantPalette = [
  "#007FFF", // Blue
  "#FF4500", // OrangeRed
  "#32CD32", // LimeGreen
  "#FFD700", // Gold
  "#800080", // Purple
  "#40E0D0", // Turquoise
  "#FF69B4", // HotPink
  "#A52A2A", // Brown
];

// Card Component
const StudentCard = ({ title, student, onView }) => {
  return (
    <Card
      variant="outlined"
      sx={{
        minWidth: { xs: "100%", sm: 300, md: 320 },
        borderLeft: "6px solid",
        borderColor:
          title === "🌟 Topper"
            ? vibrantPalette[0]
            : title.startsWith("🥇")
            ? vibrantPalette[1]
            : vibrantPalette[7],
        boxShadow: 2,
        display: "flex",
        flexDirection: "column",
        m: 1,
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom color="text.primary">
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
        <Typography>
          <strong>Overall Grade:</strong> {student.overallGrade}
        </Typography>

        <TableContainer
          component={Paper}
          sx={{
            mt: 2,
            maxHeight: 200,
            overflow: "auto",
          }}
        >
          <Table size="small" stickyHeader aria-label="subjects table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Subject</strong>
                </TableCell>
                <TableCell>
                  <strong>Score</strong>
                </TableCell>
                <TableCell>
                  <strong>Grade</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {student.subjects.map((sub, index) => (
                <TableRow key={index}>
                  <TableCell>{sub.subject}</TableCell>
                  <TableCell>{sub.score}</TableCell>
                  <TableCell>{sub.grade}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
      <Box sx={{ p: 1, display: "flex", justifyContent: "flex-end" }}>
        <Button size="small" onClick={() => onView(student)}>
          View Details
        </Button>
      </Box>
    </Card>
  );
};
const getStudentFeedback = (student) => {
  if (!student || !student.subjects) return "No feedback available";

  const feedbackPoints = [];
  const goodSubjects = [];
  const needImprovementSubjects = [];

  student.subjects.forEach((sub) => {
    if (!sub || !sub.grade) return;

    if (["A1", "A2", "B1"].includes(sub.grade)) {
      goodSubjects.push(sub.subject || "a subject");
    } else if (["D", "E1", "E2"].includes(sub.grade)) {
      needImprovementSubjects.push(sub.subject || "a subject");
    }
  });

  feedbackPoints.push(
    `${student.name || "The student"}, you ${
      student.passed ? "passed" : "need to work harder"
    } this exam.`
  );

  if (goodSubjects.length > 0) {
    feedbackPoints.push(
      `You performed well in: ${goodSubjects.join(
        ", "
      )}. Keep up the excellent work!`
    );
  }

  if (needImprovementSubjects.length > 0) {
    feedbackPoints.push(
      `You need to focus more on: ${needImprovementSubjects.join(
        ", "
      )}. Let's aim for improvement in the next assessment.`
    );
  }

  if (student.percentage !== undefined) {
    feedbackPoints.push(
      `Your overall percentage is ${student.percentage.toFixed(
        2
      )}% with a grade of ${student.overallGrade || "N/A"}.`
    );
  }

  if (!student.passed) {
    feedbackPoints.push(
      `Remember, consistent effort is key to success. Let's identify areas where you faced difficulties and work on them.`
    );
  } else {
    feedbackPoints.push(`Continue to strive for excellence in all subjects.`);
  }

  return feedbackPoints.join(" ");
};

const Home = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [examName, setExamName] = useState("");
  const [subjects, setSubjects] = useState([
    { name: "", maxMarks: "", topics: "" },
  ]);
  const [showSummary, setShowSummary] = useState(true);
  const [showChart, setShowChart] = useState(true);
  const [topStudentsTab, setTopStudentsTab] = useState(0);
  const [showAllStudents, setShowAllStudents] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [feedbackTab, setFeedbackTab] = useState(0);
  const [overallClassSummary, setOverallClassSummary] = useState(null);
  const [subjectsInfoPayload, setSubjectsInfoPayload] = useState({});
  const [selectedStudentDetails, setSelectedStudentDetails] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const passingPercentage = 33;

  const getGrade = (percentage) => {
    if (percentage >= 91) return "A1";
    if (percentage >= 81) return "A2";
    if (percentage >= 71) return "B1";
    if (percentage >= 61) return "B2";
    if (percentage >= 51) return "C1";
    if (percentage >= 41) return "C2";
    if (percentage >= 33) return "D";
    if (percentage >= 21) return "E1";
    return "E2";
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubjectChange = (index, event) => {
    const newSubjects = [...subjects];
    newSubjects[index][event.target.name] = event.target.value;
    setSubjects(newSubjects);
  };

  const handleAddSubject = () => {
    setSubjects([...subjects, { name: "", maxMarks: "", topics: "" }]);
  };

  const handleRemoveSubject = (index) => {
    const newSubjects = [...subjects];
    newSubjects.splice(index, 1);
    setSubjects(newSubjects);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please select a file.");
      return;
    }
    if (!examName.trim()) {
      alert("Please enter the exam name.");
      return;
    }
    if (subjects.some((sub) => !sub.name.trim() || !sub.maxMarks.trim())) {
      alert("Please fill in all subject names and maximum marks.");
      return;
    }

    const subjectsInfo = {};
    subjects.forEach((subject) => {
      subjectsInfo[subject.name] = {
        maxMarks: parseInt(subject.maxMarks, 10),
        topics: subject.topics
          ? subject.topics.split(",").map((topic) => topic.trim())
          : [],
      };
    });
    setSubjectsInfoPayload(subjectsInfo); // Update the state

    const formData = new FormData();
    formData.append("file", file);
    formData.append("examName", examName);
    formData.append("subjectsInfo", JSON.stringify(subjectsInfo));
    setLoading(true);
    setUploadError(null); // Clear previous errors

    try {
      const response = await axiosInstance.post(
        "uapi/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Process data for frontend
      const reportData = response.data;
      const processedStudents = reportData.students.map((student) => {
        const updatedSubjects = student.subjects.map((sub) => {
          const subjectInfo = subjectsInfo[sub.subject];
          if (subjectInfo) {
            const percentage = (sub.score / subjectInfo.maxMarks) * 100;
            const grade = getGrade(percentage); // Get grade for each subject
            return { ...sub, percentage, grade };
          } else {
            return { ...sub, percentage: 0, grade: "N/A" };
          }
        });
        const total = updatedSubjects.reduce((sum, sub) => sum + sub.score, 0);
        const totalMaxMarks = Object.values(subjectsInfo).reduce(
          (sum, info) => sum + info.maxMarks,
          0
        );
        const percentage =
          totalMaxMarks > 0 ? (total / totalMaxMarks) * 100 : 0;
        const overallGrade = getGrade(percentage); // Get overall grade
        const passed = percentage >= passingPercentage;
        return {
          ...student,
          subjects: updatedSubjects,
          total,
          percentage,
          overallGrade,
          passed,
        }; //add passed status
      });

      const updatedReport = { ...reportData, students: processedStudents };

      // Update topper, top3, bottom3 with grades based on the updated students array
      const sortedStudents = [...updatedReport.students].sort(
        (a, b) => b.total - a.total
      );
      updatedReport.topper = sortedStudents[0] || null;
      updatedReport.top3 = sortedStudents.slice(0, 3);
      updatedReport.bottom3 = sortedStudents.slice(-3).reverse();

      setReport(updatedReport);
      setShowSummary(true);
      setShowChart(true);
      setTopStudentsTab(0);
      setShowAllStudents(true);

      // Generate overall class summary
      generateOverallClassSummary(updatedReport.students, subjectsInfo);
    } catch (error) {
      console.error(
        "Upload failed:",
        error.response?.data?.error || error.message
      );
      setUploadError(
        error.response?.data?.error || "Something went wrong during upload."
      );
      setReport(null); // Clear any previous report data on error
      setShowSummary(false);
      setShowChart(false);
      setTopStudentsTab(0);
      setShowAllStudents(false);
      setOverallClassSummary(null);
      setSubjectsInfoPayload({});
    } finally {
      setLoading(false);
    }
  };

  const generateOverallClassSummary = (students, subjectsInfo) => {
    if (!students || students.length === 0 || !subjectsInfo) {
      setOverallClassSummary(null);
      return;
    }

    const totalStudents = students.length;
    const passedStudents = students.filter((student) => student.passed).length;
    const failStudents = totalStudents - passedStudents;

    const subjectWisePerformance = {};
    for (const subjectName in subjectsInfo) {
      const maxMarks = subjectsInfo[subjectName].maxMarks;
      const subjectScores = students.map(
        (student) =>
          student.subjects.find((sub) => sub.subject === subjectName)?.score ||
          0
      );
      const averageScore =
        subjectScores.reduce((sum, score) => sum + score, 0) / totalStudents;
      const averagePercentage = (averageScore / maxMarks) * 100;
      subjectWisePerformance[subjectName] = { averagePercentage };
    }

    const overallAveragePercentage =
      students.reduce((sum, student) => sum + student.percentage, 0) /
      totalStudents;

    setOverallClassSummary({
      totalStudents,
      passedStudents,
      failStudents,
      subjectWisePerformance,
      overallAveragePercentage,
    });
  };  const generatePdf = useCallback((title, content) => {
    const pdf = new jsPDF();
    const margin = 10;
    const lineHeight = 7;
    const pageHeight = pdf.internal.pageSize.height;

    let y = margin;

    pdf.setFontSize(16);
    pdf.text(title, margin, y);
    y += 10;

    pdf.setFontSize(12);
    const lines = pdf.splitTextToSize(content, 180);
    lines.forEach((line) => {
      if (y + lineHeight > pageHeight - margin) {
        pdf.addPage();
        y = margin;
      }
      pdf.text(line, margin, y);
      y += lineHeight;
    });
    return pdf;
  }, []);

  const downloadTopperPdf = () => {
    if (!report?.topper) return;
    const content = `Name: ${report.topper.name}\nTotal: ${
      report.topper.total
    }\nPercentage: ${report.topper.percentage}%\nOverall Grade: ${
      report.topper.overallGrade
    }\n${report.topper.subjects
      .map((sub) => `${sub.subject}: ${sub.score} (${sub.grade})`)
      .join("\n")}`;
    const pdf = generatePdf("Topper Details", content);
    pdf.save("topper.pdf");
  };

  const downloadTop3Pdf = () => {
    if (!report?.top3) return;
    let content = "";
    report.top3.forEach((student, index) => {
      content += `Rank ${index + 1}:\nName: ${student.name}\nTotal: ${
        student.total
      }\nPercentage: ${student.percentage}%\nOverall Grade: ${
        student.overallGrade
      }\n${student.subjects
        .map((sub) => `${sub.subject}: ${sub.score} (${sub.grade})`)
        .join("\n")}\n\n`;
    });
    const pdf = generatePdf("Top 3 Students", content);
    pdf.save("top3.pdf");
  };

  const downloadBottom3Pdf = () => {
    if (!report?.bottom3) return;
    let content = "";
    report.bottom3.forEach((student, index) => {
      content += `Bottom ${index + 1}:\nName: ${student.name}\nTotal: ${
        student.total
      }\nPercentage: ${student.percentage}%\nOverall Grade: ${
        student.overallGrade
      }\n${student.subjects
        .map((sub) => `${sub.subject}: ${sub.score} (${sub.grade})`)
        .join("\n")}\n\n`;
    });
    const pdf = generatePdf("Bottom 3 Students", content);
    pdf.save("bottom3.pdf");
  };

  const openSummaryInNewWindow = () => {
    if (report?.summary) {
      const summaryContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Exam Summary</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            color: #333;
            line-height: 1.6;
          }
          h2 {
            color:rgb(0, 0, 0);
            margin-bottom: 20px;
            border-bottom: 2px solidrgb(0, 0, 0);
            padding-bottom: 10px;
          }
          h3 {
            color:rgb(0, 0, 0);
          }
          p {
            margin-bottom: 10px;
          }
          ul, ol {
            margin-left: 20px;
            margin-bottom: 10px;
          }
          li {
            margin-bottom: 5px;
          }
          .section-title {
            color:rgb(0, 0, 0);
            font-size: 1.2em;
            font-weight: bold;
            margin-top: 20px;
            border-bottom: 1px solidrgb(0, 0, 0);
            padding-bottom: 5px;
          }
        </style>
      </head>
      <body>
        <h2>Exam Summary</h2>
        ${report.summary}  <!-- no .replace -->
      </body>
      </html>
    `;

      const newWindow = window.open("", "_blank");
      newWindow.document.write(summaryContent);
      newWindow.document.close();
    }
  };

  const handleViewAll = () => {
    setShowSummary(true);
    setShowChart(true);
    setFeedbackTab(0);
    setShowAllStudents(true);
  };

  const handleHideAll = () => {
    setShowSummary(false);
    setShowChart(false);
    setFeedbackTab(null);
    setShowAllStudents(false);
  };

  const handleViewStudentDetails = (student) => {
    setSelectedStudentDetails(student);
    setOpenDetailsDialog(true);
  };
  const handleViewStudentDet = (student) => {
    if (!student) {
      alert("No student data available");
      return;
    }

    try {
      const studentWindow = window.open("", "_blank");

      // Writing initial HTML with loading state for feedback
      studentWindow.document.write(`
  <!DOCTYPE html>
  <html>
  <head>
    <title>${student.name || "Student"} - Performance Details</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
      body {
        font-family: 'Roboto', sans-serif;
        margin: 0;
        padding: 20px;
        color: #333;
      }
      .container {
        max-width: 1000px;
        margin: 0 auto;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
      }
      th, td {
        padding: 12px 15px;
        text-align: left;
        border-bottom: 1px solid #ddd;
      }
      th {
        background-color: #f5f5f5;
        font-weight: 500;
      }
      .card {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        padding: 20px;
        margin-bottom: 20px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-bottom: 20px;
      }
      .grid-item {
        padding: 10px;
      }
      .passed {
        color: #4CAF50;
      }
      .failed {
        color: #F44336;
      }
      .print-btn {
        background: #1976d2;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        margin-left: 10px;
      }
      .loader {
        display: inline-block;
        border: 3px solid #f3f3f3; 
        border-top: 3px solid #3498db;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        animation: spin 1s linear infinite;
        margin-right: 10px;
        vertical-align: middle;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      .error-text {
        color: #F44336;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>${student.name || "Student"} - Performance Details</h1>
        <div>
          <button class="print-btn" onclick="window.print()">Print</button>
          <button class="print-btn" onclick="downloadPDF()">Download PDF</button>
        </div>
      </div>

      <div class="card">
        <h2>Overall Performance</h2>
        <div class="grid">
          <div class="grid-item">
            <strong>Total Marks:</strong>
            <div>${student.total || "N/A"}</div>
          </div>
          <div class="grid-item">
            <strong>Percentage:</strong>
            <div>${
              student.percentage !== undefined
                ? student.percentage.toFixed(2) + "%"
                : "N/A"
            }</div>
          </div>
          <div class="grid-item">
            <strong>Overall Grade:</strong>
            <div>${student.overallGrade || "N/A"}</div>
          </div>
          <div class="grid-item">
            <strong>Status:</strong>
            <div class="${student.passed ? "passed" : "failed"}">
              ${student.passed ? "Passed" : "Failed"}
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <h2>Subject-wise Performance</h2>
        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Marks</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            ${
              student.subjects && student.subjects.length > 0
                ? student.subjects
                    .map(
                      (sub) => `
                  <tr>
                    <td>${sub.subject || "N/A"}</td>
                    <td>${sub.score !== undefined ? sub.score : "N/A"}</td>
                    <td>${sub.grade || "N/A"}</td>
                  </tr>
                `
                    )
                    .join("")
                : '<tr><td colspan="3">No subject data available</td></tr>'
            }
          </tbody>
        </table>
      </div>

      <div class="card">
        <h2>Feedback</h2>
        <div id="feedback-container">
          <div><span class="loader"></span> Loading feedback...</div>
        </div>
      </div>
    </div>

    <!-- Libraries -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

    <script>
      async function fetchFeedback() {
        const feedbackContainer = document.getElementById('feedback-container');
        try {
          const response = await axiosInstance.get('uapi/feedback/${
            student.name || ""
          }');
          if (!response.ok) throw new Error('Failed to fetch feedback');
          const data = await response.json();
          feedbackContainer.innerHTML = '<p>' + (data.feedback || 'No feedback available') + '</p>';
        } catch (error) {
          console.error('Error fetching feedback:', error);
          feedbackContainer.innerHTML = '<p class="error-text">Could not load feedback. Please try again later.</p>';
        }
      }

      window.onload = fetchFeedback;

      function downloadPDF() {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'pt', 'a4');
        const container = document.querySelector('.container');

        html2canvas(container).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save('${student.name || "student"}_performance.pdf');
        });
      }
    </script>
  </body>
  </html>
`);

      studentWindow.document.close();
    } catch (error) {
      console.error("Error opening student details:", error);
      alert("Could not open student details. Please try again.");
    }
  };
  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
    setSelectedStudentDetails(null);
  };

  // Prepare data for the chart
  const chartData =
    report?.students.flatMap((student) =>
      student.subjects.map((sub) => ({
        name: student.name,
        subject: sub.subject,
        score: sub.score,
      }))
    ) || [];

  // Get unique subjects for the chart keys
  const uniqueSubjects = [...new Set(chartData.map((item) => item.subject))];

  // Restructure chart data for Recharts
  const structuredChartData =
    report?.students.map((student) => {
      const studentData = { name: student.name };
      student.subjects.forEach((sub) => {
        studentData[sub.subject] = sub.score;
      });
      return studentData;
    }) || [];

  return (
    <ThemeProvider theme={createTheme()}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        <Typography
          variant="h4"
          gutterBottom
          fontWeight="bold"
          textAlign="center"
        >
          📊 Upload Student Performance Excel
        </Typography>

        <Box display="flex" flexDirection="column" gap={2} mb={4}>
          <TextField
            label="Exam Name"
            variant="outlined"
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
          />

          <Typography variant="h6" mt={2}>
            Subject Information
          </Typography>
          {subjects.map((subject, index) => (
            <Box key={index} display="flex" gap={2} alignItems="center" mb={1}>
              <TextField
                label={`Subject ${index + 1} Name`}
                name="name"
                variant="outlined"
                value={subject.name}
                onChange={(e) => handleSubjectChange(index, e)}
                sx={{ flexGrow: 1 }}
              />
              <TextField
                label="Max Marks"
                name="maxMarks"
                variant="outlined"
                value={subject.maxMarks}
                onChange={(e) => handleSubjectChange(index, e)}
                sx={{ width: 120 }}
              />
              <TextField
                label="Topics (comma separated)"
                name="topics"
                variant="outlined"
                value={subject.topics}
                onChange={(e) => handleSubjectChange(index, e)}
                sx={{ flexGrow: 2 }}
                required={false}
              />
              {subjects.length > 1 && (
                <IconButton onClick={() => handleRemoveSubject(index)}>
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          ))}
          <Button startIcon={<AddIcon />} onClick={handleAddSubject}>
            Add Subject
          </Button>
          <input
            accept=".xlsx, .xls"
            style={{ display: "none" }}
            id="raised-button-file"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="raised-button-file">
            <Button
              variant="contained"
              component="span"
              startIcon={<CloudUploadIcon />}
            >
              Upload Excel File
            </Button>
          </label>
          {file && (
            <Typography variant="subtitle2" color="textSecondary">
              Selected file: {file.name}
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Analyze Report"
            )}
          </Button>
          {uploadError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {uploadError}
            </Alert>
          )}
        </Box>

        {report && (
          <>
            <Box
              mb={2}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h5" fontWeight="bold">
                📊 Exam Report: {report.examName}
              </Typography>
              <Box>
                <Button onClick={handleViewAll} sx={{ mr: 1 }}>
                  View All
                </Button>
                <Button onClick={handleHideAll}>Hide All</Button>
              </Box>
            </Box>

            {report.summary && showSummary && (
              <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography variant="h6" fontWeight="bold">
                    Overall Summary
                  </Typography>
                  <Button
                    startIcon={<PictureAsPdfIcon />}
                    onClick={openSummaryInNewWindow}
                    size="small"
                  >
                    View Summary
                  </Button>
                </Box>
                <Typography
                  variant="body2"
                  component="div"
                  dangerouslySetInnerHTML={{ __html: report.summary }}
                />
              </Paper>
            )}

            {structuredChartData.length > 0 && showChart && (
              <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Subject-wise Performance
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={structuredChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {uniqueSubjects.map((subject, index) => (
                      <Bar
                        key={subject}
                        dataKey={subject}
                        fill={vibrantPalette[index % vibrantPalette.length]}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            )}

            <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
              <Tabs
                value={topStudentsTab}
                onChange={(event, newValue) => setTopStudentsTab(newValue)}
                aria-label="top students tabs"
              >
                <Tab label="Topper" />
                <Tab
                  label="Top 3"
                  disabled={!report.top3 || report.top3.length < 3}
                />
                <Tab
                  label="Bottom 3"
                  disabled={!report.bottom3 || report.bottom3.length < 3}
                />
              </Tabs>
              {topStudentsTab === 0 && report.topper && (
                <Box
                  display="flex"
                  justifyContent="space-around"
                  alignItems="center"
                >
                  <StudentCard
                    title="🌟 Topper"
                    student={report.topper}
                    onView={handleViewStudentDetails}
                  />
                  <Button
                    startIcon={<PictureAsPdfIcon />}
                    onClick={downloadTopperPdf}
                    size="small"
                  >
                    Download PDF
                  </Button>
                </Box>
              )}
              {topStudentsTab === 1 &&
                report.top3 &&
                report.top3.length > 0 && (
                  <Box>
                    <Grid container spacing={2} justifyContent="center" mb={2}>
                      {report.top3.map((student, index) => (
                        <Grid item key={student.name}>
                          <StudentCard
                            title={`🥇 Rank ${index + 1}`}
                            student={student}
                            onView={handleViewStudentDetails}
                          />
                        </Grid>
                      ))}
                    </Grid>
                    <Button
                      startIcon={<PictureAsPdfIcon />}
                      onClick={downloadTop3Pdf}
                      size="small"
                    >
                      Download Top 3 PDF
                    </Button>
                  </Box>
                )}
              {topStudentsTab === 2 &&
                report.bottom3 &&
                report.bottom3.length > 0 && (
                  <Box>
                    <Grid container spacing={2} justifyContent="center" mb={2}>
                      {report.bottom3.map((student, index) => (
                        <Grid item key={student.name}>
                          <StudentCard
                            title={`📉 Bottom ${index + 1}`}
                            student={student}
                            onView={handleViewStudentDetails}
                          />
                        </Grid>
                      ))}
                    </Grid>
                    <Button
                      startIcon={<PictureAsPdfIcon />}
                      onClick={downloadBottom3Pdf}
                      size="small"
                    >
                      Download Bottom 3 PDF
                    </Button>
                  </Box>
                )}
            </Paper>

            <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
              <Tabs
                value={feedbackTab}
                onChange={(event, newValue) => setFeedbackTab(newValue)}
                aria-label="feedback tabs"
                centered
              >
                <Tab label="Overall Class Performance" value={0} />
                <Tab
                  label="Individual Student Feedback"
                  value={1}
                  disabled={!report?.students || report.students.length === 0}
                />
              </Tabs>
              {feedbackTab === 0 && overallClassSummary && (
                <Box mt={2} textAlign="left">
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Overall Class Performance
                  </Typography>
                  <Typography variant="body2">
                    <strong>Total Students:</strong>{" "}
                    <em>{overallClassSummary.totalStudents}</em>
                  </Typography>
                  <Typography variant="body2">
                    <strong>Passed Students:</strong>{" "}
                    <em>{overallClassSummary.passedStudents}</em>
                  </Typography>
                  <Typography variant="body2">
                    <strong>Failed Students:</strong>{" "}
                    <em>{overallClassSummary.failStudents}</em>
                  </Typography>
                  <Typography variant="body2" mt={2} fontWeight="bold">
                    Subject-wise Average Performance:
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {Object.keys(
                      overallClassSummary.subjectWisePerformance
                    ).map((subject) => (
                      <li key={subject}>
                        <strong>{subject}:</strong>{" "}
                        <em>
                          {overallClassSummary.subjectWisePerformance[
                            subject
                          ].averagePercentage.toFixed(2)}
                          %
                        </em>
                      </li>
                    ))}
                  </ul>
                  <Typography variant="body2" mt={2}>
                    <strong>Overall Average Class Percentage:</strong>{" "}
                    <em>
                      {overallClassSummary.overallAveragePercentage.toFixed(2)}%
                    </em>
                  </Typography>
                  <Typography variant="body2" mt={2} fontWeight="bold">
                    Insights:
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {overallClassSummary.overallAveragePercentage >= 60 ? (
                      <li>The class has performed reasonably well overall.</li>
                    ) : (
                      <li>
                        The overall class performance indicates areas that need
                        attention and improvement.
                      </li>
                    )}
                    {overallClassSummary.failStudents >
                    overallClassSummary.totalStudents * 0.2 ? (
                      <li>
                        A significant number of students are struggling. Focused
                        interventions and support are recommended.
                      </li>
                    ) : (
                      <li>
                        Most students have passed the exam. Efforts should be
                        made to help the remaining students catch up.
                      </li>
                    )}
                    {Object.keys(overallClassSummary.subjectWisePerformance)
                      .sort(
                        (a, b) =>
                          overallClassSummary.subjectWisePerformance[b]
                            .averagePercentage -
                          overallClassSummary.subjectWisePerformance[a]
                            .averagePercentage
                      )
                      .slice(0, 1)
                      .map((subject) => (
                        <li key={`top-${subject}`}>
                          The class performed best in <strong>{subject}</strong>{" "}
                          with an average of{" "}
                          <em>
                            {overallClassSummary.subjectWisePerformance[
                              subject
                            ].averagePercentage.toFixed(2)}
                            %
                          </em>
                          .
                        </li>
                      ))}
                    {Object.keys(overallClassSummary.subjectWisePerformance)
                      .sort(
                        (a, b) =>
                          overallClassSummary.subjectWisePerformance[a]
                            .averagePercentage -
                          overallClassSummary.subjectWisePerformance[b]
                            .averagePercentage
                      )
                      .slice(0, 1)
                      .map((subject) => (
                        <li key={`bottom-${subject}`}>
                          Performance in <strong>{subject}</strong> is a
                          concern, with an average of{" "}
                          <em>
                            {overallClassSummary.subjectWisePerformance[
                              subject
                            ].averagePercentage.toFixed(2)}
                            %
                          </em>
                          . Targeted teaching strategies for this subject are
                          needed.
                        </li>
                      ))}
                  </ul>
                </Box>
              )}
              {feedbackTab === 1 && report.students && subjectsInfoPayload && (
                <Box mt={2}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    mb={2}
                    textAlign="left"
                  >
                    Individual Student Feedback
                  </Typography>
                  {report.students.map((student) => (
                    <Box
                      key={student.name}
                      mb={2}
                      borderBottom="1px solid #eee"
                      pb={2}
                      textAlign="left"
                    >
                      <Typography variant="subtitle1" fontWeight="bold">
                        Feedback for {student.name}
                      </Typography>
                      <Typography variant="body2" component="div">
                        {getStudentFeedback(student, subjectsInfoPayload)
                          .split(" ")
                          .map((word, index) => {
                            if (word.startsWith("*") && word.endsWith("*")) {
                              const content = word.substring(
                                1,
                                word.length - 1
                              );
                              if (
                                content.startsWith("*") &&
                                content.endsWith("*")
                              ) {
                                return (
                                  <strong key={index}>
                                    {content.substring(1, content.length - 1)}{" "}
                                  </strong>
                                );
                              }
                              return <em key={index}>{content} </em>;
                            }
                            return <span key={index}>{word} </span>;
                          })}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Paper>

            {/* All Students Data Table */}
            <Box
              mt={4}
              mb={2}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Divider textAlign="left" sx={{ flexGrow: 1, mr: 2 }}>
                <Typography variant="h5">
                  📚 All Students Performance
                </Typography>
              </Divider>
              <Button
                onClick={() => setShowAllStudents(!showAllStudents)}
                startIcon={
                  showAllStudents ? <VisibilityOffIcon /> : <VisibilityIcon />
                }
              >
                {showAllStudents ? "Hide" : "View"}
              </Button>
            </Box>
            <Collapse in={showAllStudents}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell align="right">Total Marks</TableCell>
                      <TableCell align="right">Percentage (%)</TableCell>
                      <TableCell align="right">Overall Grade</TableCell>
                      <TableCell align="right">Pass/Fail</TableCell>
                      <TableCell align="right">Details</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {report.students.map((student) => (
                      <TableRow
                        key={student.name}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {student.name}
                        </TableCell>
                        <TableCell align="right">{student.total}</TableCell>
                        <TableCell align="right">
                          {student.percentage.toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                          {student.overallGrade}
                        </TableCell>
                        <TableCell align="right">
                          {student.passed ? (
                            <Typography color="success">Passed</Typography>
                          ) : (
                            <Typography color="error">Failed</Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            onClick={() => handleViewStudentDet(student)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Collapse>

            {/* Student Details Dialog */}
            <Dialog
              open={openDetailsDialog}
              onClose={handleCloseDetailsDialog}
              fullWidth
              maxWidth="sm"
            >
              <DialogTitle>
                {selectedStudentDetails?.name} - Details
              </DialogTitle>
              <DialogContent>
                {selectedStudentDetails && (
                  <Table aria-label="student details">
                    <TableHead>
                      <TableRow>
                        <TableCell>Subject</TableCell>
                        <TableCell align="right">Marks</TableCell>
                        <TableCell align="right">Grade</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedStudentDetails.subjects.map((sub) => (
                        <TableRow key={sub.subject}>
                          <TableCell component="th" scope="row">
                            {sub.subject}
                          </TableCell>
                          <TableCell align="right">{sub.score}</TableCell>
                          <TableCell align="right">{sub.grade}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell>
                          <strong>Total</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>{selectedStudentDetails.total}</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>{selectedStudentDetails.overallGrade}</strong>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <strong>Percentage</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>
                            {selectedStudentDetails.percentage?.toFixed(2)}%
                          </strong>
                        </TableCell>
                        <TableCell align="right"></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <strong>Pass/Fail</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>
                            {selectedStudentDetails.passed ? (
                              <Typography color="success">Passed</Typography>
                            ) : (
                              <Typography color="error">Failed</Typography>
                            )}
                          </strong>
                        </TableCell>
                        <TableCell align="right"></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                )}

                {/* Feedback Section */}
                <Box mt={3}>
  <Typography variant="h6">Feedback</Typography>
  {selectedStudentDetails?.feedback ? (
    <Typography
      variant="body2"
      component="div"
      dangerouslySetInnerHTML={{ __html: selectedStudentDetails.feedback }}
    />
  ) : (
    <Typography variant="body2">
      <em>No specific feedback available for this student.</em>
    </Typography>
  )}
</Box>

              </DialogContent>
            </Dialog>
          </>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default Home;