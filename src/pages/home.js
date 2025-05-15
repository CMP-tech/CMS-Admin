import React, { useState, useCallback, useEffect } from "react";
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
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import { jsPDF } from "jspdf";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Define a vibrant color palette
const vibrantPalette = [
    '#007FFF',  // Blue
    '#FF4500',  // OrangeRed
    '#32CD32',  // LimeGreen
    '#FFD700',  // Gold
    '#800080',  // Purple
    '#40E0D0',  // Turquoise
    '#FF69B4',  // HotPink
    '#A52A2A',  // Brown
];

// Card Component (remains the same)
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
                <strong>Name:</strong> {student.name}
            </Typography>
            <Typography>
                <strong>Total:</strong> {student.total}
            </Typography>
            <Typography>
                <strong>Percentage:</strong> {student.percentage}%
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
                {student.subjects.map(sub => `${sub.subject}: ${sub.score} (${sub.grade})`).join(', ')}
            </Typography>
        </CardContent>
    </Card>
);

const Home = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState(null);
    const [examName, setExamName] = useState("");
    const [subjects, setSubjects] = useState([{ name: "", maxMarks: "", topics: "" }]);
    const [showSummary, setShowSummary] = useState(true);
    const [showChart, setShowChart] = useState(true);
    const [showTopStudents, setShowTopStudents] = useState(true); // Controls visibility of Topper/Top3/Bottom3 box
    const [topStudentsTab, setTopStudentsTab] = useState(0); // 0: Topper, 1: Top 3, 2: Bottom 3
    const [showAllStudents, setShowAllStudents] = useState(false);

    const handleFileChange = (e) => {
        // ... (rest of the file handling remains the same)
        setFile(e.target.files[0]);
    };

    const handleSubjectChange = (index, event) => {
        // ... (rest of the subject change handling remains the same)
        const newSubjects = [...subjects];
        newSubjects[index][event.target.name] = event.target.value;
        setSubjects(newSubjects);
    };

    const handleAddSubject = () => {
        // ... (rest of the add subject handling remains the same)
        setSubjects([...subjects, { name: "", maxMarks: "", topics: "" }]);
    };

    const handleRemoveSubject = (index) => {
        // ... (rest of the remove subject handling remains the same)
        const newSubjects = [...subjects];
        newSubjects.splice(index, 1);
        setSubjects(newSubjects);
    };

    const handleSubmit = async () => {
        // ... (rest of the handleSubmit function remains the same)
        if (!file) {
            alert("Please select a file.");
            return;
        }
        if (!examName.trim()) {
            alert("Please enter the exam name.");
            return;
        }
        if (subjects.some(sub => !sub.name.trim() || !sub.maxMarks.trim())) {
            alert("Please fill in all subject names and maximum marks.");
            return;
        }

        const subjectsInfoPayload = {};
        subjects.forEach(subject => {
            subjectsInfoPayload[subject.name] = {
                maxMarks: parseInt(subject.maxMarks, 10),
                topics: subject.topics ? subject.topics.split(',').map(topic => topic.trim()) : [],
            };
        });

        const formData = new FormData();
        formData.append("file", file);
        formData.append("examName", examName);
        formData.append("subjectsInfo", JSON.stringify(subjectsInfoPayload));
        setLoading(true);

        try {
            const response = await axios.post(
                "https://school-ai-be-1.onrender.com/upload",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            // Add grades to the report data
            const reportWithGrades = { ...response.data };
            reportWithGrades.students = reportWithGrades.students.map(student => ({
                ...student,
                subjects: student.subjects.map(sub => {
                    const percentage = (sub.score / subjectsInfoPayload[sub.subject].maxMarks) * 100;
                    let grade = 'F';
                    if (percentage >= 90) grade = 'A+';
                    else if (percentage >= 80) grade = 'A';
                    else if (percentage >= 70) grade = 'B+';
                    else if (percentage >= 60) grade = 'B';
                    else if (percentage >= 50) grade = 'C+';
                    else if (percentage >= 40) grade = 'C';
                    return { ...sub, grade };
                })
            }));
            if (reportWithGrades.topper) {
                reportWithGrades.topper = {
                    ...reportWithGrades.topper,
                    subjects: reportWithGrades.topper.subjects.map(sub => {
                        const percentage = (sub.score / subjectsInfoPayload[sub.subject].maxMarks) * 100;
                        let grade = 'F';
                        if (percentage >= 90) grade = 'A+';
                        else if (percentage >= 80) grade = 'A';
                        else if (percentage >= 70) grade = 'B+';
                        else if (percentage >= 60) grade = 'B';
                        else if (percentage >= 50) grade = 'C+';
                        else if (percentage >= 40) grade = 'C';
                        return { ...sub, grade };
                    })
                }
            }
            if (reportWithGrades.top3) {
                reportWithGrades.top3 = reportWithGrades.top3.map(student => ({
                    ...student,
                    subjects: student.subjects.map(sub => {
                        const percentage = (sub.score / subjectsInfoPayload[sub.subject].maxMarks) * 100;
                        let grade = 'F';
                        if (percentage >= 90) grade = 'A+';
                        else if (percentage >= 80) grade = 'A';
                        else if (percentage >= 70) grade = 'B+';
                        else if (percentage >= 60) grade = 'B';
                        else if (percentage >= 50) grade = 'C+';
                        else if (percentage >= 40) grade = 'C';
                        return { ...sub, grade };
                    })
                }))
            }
            if (reportWithGrades.bottom3) {
                reportWithGrades.bottom3 = reportWithGrades.bottom3.map(student => ({
                    ...student,
                    subjects: student.subjects.map(sub => {
                        const percentage = (sub.score / subjectsInfoPayload[sub.subject].maxMarks) * 100;
                        let grade = 'F';
                        if (percentage >= 90) grade = 'A+';
                        else if (percentage >= 80) grade = 'A';
                        else if (percentage >= 70) grade = 'B+';
                        else if (percentage >= 60) grade = 'B';
                        else if (percentage >= 50) grade = 'C+';
                        else if (percentage >= 40) grade = 'C';
                        return { ...sub, grade };
                    })
                }))
            }

            setReport(reportWithGrades);
            setShowSummary(true);
            setShowChart(true);
            setShowTopStudents(true);
            setTopStudentsTab(0); // Default to Topper tab
            setShowAllStudents(false);

        } catch (error) {
            console.error("Upload failed:", error);
            alert("Upload failed!");
        } finally {
            setLoading(false);
        }
    };

    const generatePdf = useCallback((title, content) => {
        // ... (rest of the PDF generation remains the same)
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
        // ... (rest of the topper PDF download remains the same)
        if (!report?.topper) return;
        const content = `Name: ${report.topper.name}\nTotal: ${report.topper.total}\nPercentage: ${report.topper.percentage}%\n${report.topper.subjects.map(sub => `${sub.subject}: ${sub.score} (${sub.grade}) - ${sub.pass ? 'Passed' : 'Failed'}`).join('\n')}`;
        const pdf = generatePdf("Topper Details", content);
        pdf.save("topper.pdf");
    };

    const downloadTop3Pdf = () => {
        // ... (rest of the top 3 PDF download remains the same)
        if (!report?.top3) return;
        let content = "";
        report.top3.forEach((student, index) => {
            content += `Rank ${index + 1}:\nName: ${student.name}\nTotal: ${student.total}\nPercentage: ${student.percentage}%\n${student.subjects.map(sub => `${sub.subject}: ${sub.score} (${sub.grade}) - ${sub.pass ? 'Passed' : 'Failed'}`).join('\n')}\n\n`;
        });
        const pdf = generatePdf("Top 3 Students", content);
        pdf.save("top3.pdf");
    };

    const downloadBottom3Pdf = () => {
        // ... (rest of the bottom 3 PDF download remains the same)
        if (!report?.bottom3) return;
        let content = "";
        report.bottom3.forEach((student, index) => {
            content += `Bottom ${index + 1}:\nName: ${student.name}\nTotal: ${student.total}\nPercentage: ${student.percentage}%\n${student.subjects.map(sub => `${sub.subject}: ${sub.score} (${sub.grade}) - ${sub.pass ? 'Passed' : 'Failed'}`).join('\n')}\n\n`;
        });
        const pdf = generatePdf("Bottom 3 Students", content);
        pdf.save("bottom3.pdf");
    };

    const downloadSummaryPdf = () => {
        // ... (rest of the summary PDF download remains the same)
        if (!report?.summary) return;
        const pdf = generatePdf("Student Performance Summary", report.summary);
        pdf.save("summary.pdf");
    };

    const handleViewAll = () => {
        setShowSummary(true);
        setShowChart(true);
        setShowTopStudents(true);
        setShowAllStudents(true);
    };

    const handleHideAll = () => {
        setShowSummary(false);
        setShowChart(false);
        setShowTopStudents(false);
        setShowAllStudents(false);
    };

    const handleTopStudentsVisibility = () => {
        setShowTopStudents(!showTopStudents);
    };

    // Prepare data for the chart
    const chartData = report?.students.flatMap(student =>
        student.subjects.map(sub => ({
            name: student.name,
            subject: sub.subject,
            score: sub.score,
        }))
    ) || [];

    // Get unique subjects for the chart keys
    const uniqueSubjects = [...new Set(chartData.map(item => item.subject))];

    // Restructure chart data for Recharts
    const structuredChartData = report?.students.map(student => {
        const studentData = { name: student.name };
        student.subjects.forEach(sub => {
            studentData[sub.subject] = sub.score;
        });
        return studentData;
    }) || [];

    return (
        <ThemeProvider theme={createTheme()}>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                    📊 Upload Student Performance Excel
                </Typography>

                {/* ... (rest of the file upload and subject input remains the same) */}
                <Box display="flex" flexDirection="column" gap={2} mb={4}>
                    <TextField
                        label="Exam Name"
                        variant="outlined"
                        value={examName}
                        onChange={(e) => setExamName(e.target.value)}
                    />

                    <Typography variant="h6" mt={2}>Subject Information</Typography>
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

                    <Box display="flex" gap={2} alignItems="center" mt={2}>
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
                            disabled={!file || !examName.trim() || subjects.some(sub => !sub.name.trim() || !sub.maxMarks.trim()) || loading}
                            >
                            {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
                        </Button>
                    </Box>
                </Box>

                {report && (
                    <>
                        {/* View All / Hide All Buttons */}
                        <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
                            <Button variant="outlined" startIcon={<VisibilityIcon />} onClick={handleViewAll}>
                                View All
                            </Button>
                            <Button variant="outlined" startIcon={<VisibilityOffIcon />} onClick={handleHideAll}>
                                Hide All
                            </Button>
                        </Box>

                        {/* Summary Section */}
                        <Box mb={2} display="flex" alignItems="center" justifyContent="space-between">
                            <Divider textAlign="left" sx={{ flexGrow: 1, mr: 2 }}>
                                <Typography variant="h5">📝 Summary</Typography>
                            </Divider>
                            <Button onClick={() => setShowSummary(!showSummary)} startIcon={showSummary ? <VisibilityOffIcon /> : <VisibilityIcon />}>
                                {showSummary ? "Hide" : "View"}
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                startIcon={<PictureAsPdfIcon />}
                                onClick={downloadSummaryPdf}
                            >
                                Download
                            </Button>
                        </Box>
                        <Collapse in={showSummary}>
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 3,
                                    whiteSpace: "pre-wrap",
                                    bgcolor: "#f5f5f5",
                                    borderRadius: 4,
                                    boxShadow: 1,
                                    maxHeight: 300,
                                    overflow: "auto",
                                    textAlign: 'left'
                                }}
                            >
                                <Typography variant="body1" style={{ lineHeight: 1.6 }}>{report.summary}</Typography>
                            </Paper>
                        </Collapse>

                        {/* Chart Section */}
                        <Box mb={2} display="flex" alignItems="center" justifyContent="space-between">
                            <Divider textAlign="left" sx={{ flexGrow: 1, mr: 2 }}>
                                <Typography variant="h5">📊 Student Performance Chart</Typography>
                            </Divider>
                            <Button onClick={() => setShowChart(!showChart)} startIcon={showChart ? <VisibilityOffIcon /> : <VisibilityIcon />}>
                                {showChart ? "Hide" : "View"}
                            </Button>
                        </Box>
                        <Collapse in={showChart}>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={structuredChartData}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    {uniqueSubjects.map((subject, index) => (
                                        <Bar
                                            key={subject}
                                            dataKey={subject}
                                            fill={vibrantPalette[index % vibrantPalette.length]} // Use vibrant colors
                                        />
                                    ))}
                                </BarChart>
                            </ResponsiveContainer>
                        </Collapse>

                        {/* Top Students Section (Topper, Top 3, Bottom 3) */}
                        <Box mb={2} display="flex" alignItems="center" justifyContent="space-between">
                            <Divider textAlign="left" sx={{ flexGrow: 1, mr: 2 }}>
                                <Typography variant="h5">🏆 Top Students</Typography>
                            </Divider>
                            <Button onClick={handleTopStudentsVisibility} startIcon={showTopStudents ? <VisibilityOffIcon /> : <VisibilityIcon />}>
                                {showTopStudents ? "Hide" : "View"}
                            </Button>
                        </Box>
                        <Collapse in={showTopStudents}>
                            <Paper variant="outlined" sx={{ p: 2 }}>
                                <Tabs value={topStudentsTab} onChange={(event, newValue) => setTopStudentsTab(newValue)}>
                                    <Tab label="Topper" />
                                    <Tab label="Top 3" />
                                    <Tab label="Bottom 3" />
                                </Tabs>
                                {topStudentsTab === 0 && (
                                    <>
                                        <Divider sx={{ my: 2 }} />
                                        {report.topper && (
                                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                                <StudentCard
                                                    title="Top Student"
                                                    student={report.topper}
                                                    color="gold"
                                                />
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    startIcon={<PictureAsPdfIcon />}
                                                    onClick={downloadTopperPdf}
                                                >
                                                    Download
                                                </Button>
                                            </Box>
                                        )}
                                        {!report.topper && <Typography color="textSecondary">No topper data available.</Typography>}
                                    </>
                                )}
                                {topStudentsTab === 1 && (
                                    <>
                                        <Divider sx={{ my: 2 }} />
                                        {report.top3 && report.top3.length > 0 ? (
                                            <>
                                                <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2}>
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        startIcon={<PictureAsPdfIcon />}
                                                        onClick={downloadTop3Pdf}
                                                    >
                                                        Download All
                                                    </Button>
                                                </Box>
                                                <Grid container spacing={2}>
                                                    {report.top3.map((student, idx) => (
                                                        <Grid item key={idx} xs={12} sm={6} md={4}>
                                                            <StudentCard
                                                                title={`Rank ${idx + 1}`}
                                                                student={student}
                                                            />
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </>
                                        ) : (
                                            <Typography color="textSecondary">No top 3 students data available.</Typography>
                                        )}
                                    </>
                                )}
                                {topStudentsTab === 2 && (
                                    <>
                                        <Divider sx={{ my: 2 }} />
                                        {report.bottom3 && report.bottom3.length > 0 ? (
                                            <>
                                                <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2}>
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        startIcon={<PictureAsPdfIcon />}
                                                        onClick={downloadBottom3Pdf}
                                                    >
                                                        Download All
                                                    </Button>
                                                </Box>
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
                                            </>
                                        ) : (
                                            <Typography color="textSecondary">No bottom 3 students data available.</Typography>
                                        )}
                                    </>
                                )}
                            </Paper>
                        </Collapse>

                        {/* All Students Table Section */}
                        <Box mb={2} display="flex" alignItems="center" justifyContent="space-between">
                            <Divider textAlign="left" sx={{ flexGrow: 1, mr: 2 }}>
                                <Typography variant="h5">👥 All Students</Typography>
                            </Divider>
                            <Button onClick={() => setShowAllStudents(!showAllStudents)} startIcon={showAllStudents ? <VisibilityOffIcon /> : <VisibilityIcon />}>
                                {showAllStudents ? "Hide" : "View"}
                            </Button>
                        </Box>
                        <Collapse in={showAllStudents}>
                            <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><strong>Name</strong></TableCell>
                                            {uniqueSubjects.map(subject => (
                                                <TableCell key={subject}>{subject}</TableCell>
                                            ))}
                                            <TableCell><strong>Total</strong></TableCell>
                                            <TableCell><strong>Percentage</strong></TableCell>
                                            <TableCell><strong>Grade</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {report.students.map((student, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{student.name}</TableCell>
                                                {student.subjects.map(sub => (
                                                    <TableCell key={sub.subject}>{sub.score}</TableCell>
                                                ))}
                                                <TableCell>{student.total}</TableCell>
                                                <TableCell>{student.percentage}%</TableCell>
                                                <TableCell>{student.subjects.reduce((acc, curr) => {
                                                    if (acc === 'F') return 'F';
                                                    return curr.grade;
                                                }, 'A+')}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Collapse>
                    </>
                )}
            </Container>
        </ThemeProvider>
    );
};

export default Home;