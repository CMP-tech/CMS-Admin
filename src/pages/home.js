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
    Alert,
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
    '#007FFF',    // Blue
    '#FF4500',    // OrangeRed
    '#32CD32',    // LimeGreen
    '#FFD700',    // Gold
    '#800080',    // Purple
    '#40E0D0',    // Turquoise
    '#FF69B4',    // HotPink
    '#A52A2A',    // Brown
];

// Card Component
const StudentCard = ({ title, student, color = "primary.main" }) => {
    return (
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
                <Typography>
                    <strong>Overall Grade:</strong> {student.overallGrade}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                    {student.subjects.map(sub => `${sub.subject}: ${sub.score} (${sub.grade})`).join(', ')}
                </Typography>
            </CardContent>
        </Card>
    );
};

const Home = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState(null);
    const [examName, setExamName] = useState("");
    const [subjects, setSubjects] = useState([{ name: "", maxMarks: "", topics: "" }]);
    const [showSummary, setShowSummary] = useState(true);
    const [showChart, setShowChart] = useState(true);
    const [topStudentsTab, setTopStudentsTab] = useState(0);
    const [showAllStudents, setShowAllStudents] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [feedbackTab, setFeedbackTab] = useState(0);
    const [overallClassSummary, setOverallClassSummary] = useState(null);
    const [subjectsInfoPayload, setSubjectsInfoPayload] = useState({}); // State to hold subjects info

    const passingPercentage = 33;

    const gradeMap = {
        91: { grade: 'A1', gradePoint: 10.0 },
        81: { grade: 'A2', gradePoint: 9.0 },
        71: { grade: 'B1', gradePoint: 8.0 },
        61: { grade: 'B2', gradePoint: 7.0 },
        51: { grade: 'C1', gradePoint: 6.0 },
        41: { grade: 'C2', gradePoint: 5.0 },
        33: { grade: 'D', gradePoint: 4.0 },
        21: { grade: 'E1', gradePoint: 0.0 }, // Fail
        0: { grade: 'E2', gradePoint: 0.0 },    // Fail
    };

    const getGrade = (percentage) => {
        if (percentage >= 91) return 'A1';
        if (percentage >= 81) return 'A2';
        if (percentage >= 71) return 'B1';
        if (percentage >= 61) return 'B2';
        if (percentage >= 51) return 'C1';
        if (percentage >= 41) return 'C2';
        if (percentage >= 33) return 'D';
        if (percentage >= 21) return 'E1';
        return 'E2';
    };

    const getGradePoint = (percentage) => {
        if (percentage >= 91) return 10.0;
        if (percentage >= 81) return 9.0;
        if (percentage >= 71) return 8.0;
        if (percentage >= 61) return 7.0;
        if (percentage >= 51) return 6.0;
        if (percentage >= 41) return 5.0;
        if (percentage >= 33) return 4.0;
        return 0.0;
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
        if (subjects.some(sub => !sub.name.trim() || !sub.maxMarks.trim())) {
            alert("Please fill in all subject names and maximum marks.");
            return;
        }

        const subjectsInfo = {};
        subjects.forEach(subject => {
            subjectsInfo[subject.name] = {
                maxMarks: parseInt(subject.maxMarks, 10),
                topics: subject.topics ? subject.topics.split(',').map(topic => topic.trim()) : [],
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
            const response = await axios.post(
                "https://school-ai-be-1.onrender.com/upload",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            // Process data for frontend
            const reportData = response.data;
            const processedStudents = reportData.students.map(student => {
                const updatedSubjects = student.subjects.map(sub => {
                    const subjectInfo = subjectsInfo[sub.subject];
                    if (subjectInfo) {
                        const percentage = (sub.score / subjectInfo.maxMarks) * 100;
                        const grade = getGrade(percentage); // Get grade for each subject
                        return { ...sub, percentage, grade };
                    } else {
                        return { ...sub, percentage: 0, grade: 'N/A' };
                    }
                });
                const total = updatedSubjects.reduce((sum, sub) => sum + sub.score, 0);
                const totalMaxMarks = Object.values(subjectsInfo).reduce((sum, info) => sum + info.maxMarks, 0);
                const percentage = totalMaxMarks > 0 ? (total / totalMaxMarks) * 100 : 0;
                const overallGrade = getGrade(percentage);  // Get overall grade
                const passed = percentage >= passingPercentage;
                return { ...student, subjects: updatedSubjects, total, percentage, overallGrade, passed }; //add passed status
            });

            const updatedReport = { ...reportData, students: processedStudents };

            // Update topper, top3, bottom3 with grades based on the updated students array
            const sortedStudents = [...updatedReport.students].sort((a, b) => b.total - a.total);
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
            console.error("Upload failed:", error.response?.data?.error || error.message);
            setUploadError(error.response?.data?.error || "Something went wrong during upload.");
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
        const passedStudents = students.filter(student => student.passed).length;
        const failStudents = totalStudents - passedStudents;

        const subjectWisePerformance = {};
        for (const subjectName in subjectsInfo) {
            const maxMarks = subjectsInfo[subjectName].maxMarks;
            const subjectScores = students.map(student => student.subjects.find(sub => sub.subject === subjectName)?.score || 0);
            const averageScore = subjectScores.reduce((sum, score) => sum + score, 0) / totalStudents;
            const averagePercentage = (averageScore / maxMarks) * 100;
            subjectWisePerformance[subjectName] = { averagePercentage };
        }

        const overallAveragePercentage = students.reduce((sum, student) => sum + student.percentage, 0) / totalStudents;

        setOverallClassSummary({
            totalStudents,
            passedStudents,
            failStudents,
            subjectWisePerformance,
            overallAveragePercentage,
        });
    };

    const getStudentFeedback = (student, subjectsInfo) => {
        const feedbackPoints = [];
        const goodSubjects = [];
        const needImprovementSubjects = [];

        student.subjects.forEach(sub => {
            const maxMarks = subjectsInfo[sub.subject]?.maxMarks || 100;
            const percentage = (sub.score / maxMarks) * 100;
            if (percentage >= 75) {
                goodSubjects.push(sub.subject);
            } else if (percentage < 40) {
                needImprovementSubjects.push(sub.subject);
            }
        });

        feedbackPoints.push(`*${student.name}*, you *${student.passed ? 'passed' : 'need to work harder'}* this exam.`);

        if (goodSubjects.length > 0) {
            feedbackPoints.push(`You performed well in: *${goodSubjects.join(', ')}*. Keep up the excellent work!`);
        }

        if (needImprovementSubjects.length > 0) {
            feedbackPoints.push(`You need to focus more on: *${needImprovementSubjects.join(', ')}*. Let's aim for improvement in the next assessment.`);
        }

        const overallPercentageMessage = `Your overall percentage is *${student.percentage.toFixed(2)}%* with a grade of *${student.overallGrade}*.`;
        feedbackPoints.push(overallPercentageMessage);

        if (!student.passed) {
            feedbackPoints.push(`Remember, consistent effort is key to success. Let's identify areas where you faced difficulties and work on them.`);
        } else {
            feedbackPoints.push(`Continue to strive for excellence in all subjects.`);
        }

        return feedbackPoints.join(' ');
    };


    const generatePdf = useCallback((title, content) => {
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
        const content = `Name: ${report.topper.name}\nTotal: ${report.topper.total}\nPercentage: ${report.topper.percentage}%\nOverall Grade: ${report.topper.overallGrade}\n${report.topper.subjects.map(sub => `${sub.subject}: ${sub.score} (${sub.grade})`).join('\n')}`;
        const pdf = generatePdf("Topper Details", content);
        pdf.save("topper.pdf");
    };

    const downloadTop3Pdf = () => {
        if (!report?.top3) return;
        let content = "";
        report.top3.forEach((student, index) => {
            content += `Rank ${index + 1}:\nName: ${student.name}\nTotal: ${student.total}\nPercentage: ${student.percentage}%\nOverall Grade: ${student.overallGrade}\n${student.subjects.map(sub => `${sub.subject}: ${sub.score} (${sub.grade})`).join('\n')}\n\n`;
        });
        const pdf = generatePdf("Top 3 Students", content);
        pdf.save("top3.pdf");
    };

    const downloadBottom3Pdf = () => {
        if (!report?.bottom3) return;
        let content = "";
        report.bottom3.forEach((student, index) => {
            content += `Bottom ${index + 1}:\nName: ${student.name}\nTotal: ${student.total}\nPercentage: ${student.percentage}%\nOverall Grade: ${student.overallGrade}\n${student.subjects.map(sub => `${sub.subject}: ${sub.score} (${sub.grade})`).join('\n')}\n\n`;
        });
        const pdf = generatePdf("Bottom 3 Students", content);
        pdf.save("bottom3.pdf");
    };

    const downloadSummaryPdf = () => {
        if (!report?.summary) return;
        const pdf = generatePdf("Student Performance Summary", report.summary);
        pdf.save("summary.pdf");
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
                            color: #4CAF50;
                            margin-bottom: 20px;
                            border-bottom: 2px solid #4CAF50;
                            padding-bottom: 10px;
                        }
                        h3{
                            color: #008000
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
                        .section-title{
                            color: #1976D2;
                            font-size: 1.2em;
                            font-weight: bold;
                            margin-top: 20px;
                            border-bottom: 1px solid #1976D2;
                            padding-bottom: 5px;
                        }

                    </style>
                </head>
                <body>
                    <h2>Exam Summary</h2>
                    ${report.summary.replace(/\n/g, '<br>')}
                </body>
                </html>
            `;
            const newWindow = window.open('', '_blank');
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
                <Typography variant="h4" gutterBottom fontWeight="bold" textAlign="center">
                    📊 Upload Student Performance Excel
                </Typography>

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
                    <input
                        accept=".xlsx, .xls"
                        style={{ display: 'none' }}
                        id="raised-button-file"
                        type="file"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="raised-button-file">
                        <Button variant="contained" component="span" startIcon={<CloudUploadIcon />}>
                            Upload Excel File
                        </Button>
                    </label>
                    {file && (
                        <Typography variant="subtitle2" color="textSecondary">
                            Selected file: {file.name}
                        </Typography>
                    )}
                    <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Analyze Report"}
                    </Button>
                    {uploadError && (
                        <Alert severity="error" sx={{ mt: 2 }}>{uploadError}</Alert>
                    )}
                </Box>

                {report && (
                    <>
                        <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h5" fontWeight="bold">
                                📊 Exam Report: {report.examName}
                            </Typography>
                            <Box>
                                <Button onClick={handleViewAll} sx={{ mr: 1 }}>View All</Button>
                                <Button onClick={handleHideAll}>Hide All</Button>
                            </Box>
                        </Box>

                        {report.summary && showSummary && (
                            <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography variant="h6" fontWeight="bold">Overall Summary</Typography>
                                    <Button startIcon={<PictureAsPdfIcon />} onClick={openSummaryInNewWindow} size="small">
                                        View Summary
                                    </Button>
                                </Box>
                                <Typography variant="body2" whiteSpace="pre-line">{report.summary}</Typography>
                            </Paper>
                        )}

                        {structuredChartData.length > 0 && showChart && (
                            <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
                                <Typography variant="h6" fontWeight="bold" mb={2}>Subject-wise Performance</Typography>
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={structuredChartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        {uniqueSubjects.map((subject, index) => (
                                            <Bar key={subject} dataKey={subject} fill={vibrantPalette[index % vibrantPalette.length]} />
                                        ))}
                                    </BarChart>
                                </ResponsiveContainer>
                            </Paper>
                        )}

                        <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
                            <Tabs value={feedbackTab} onChange={(event, newValue) => setFeedbackTab(newValue)} aria-label="feedback tabs" centered>
                                <Tab label="Overall Class Performance" value={0} />
                                <Tab label="Individual Student Feedback" value={1} disabled={!report?.students || report.students.length === 0} />
                            </Tabs>
                            {feedbackTab === 0 && overallClassSummary && (
                                <Box mt={2} textAlign="left">
                                    <Typography variant="h6" fontWeight="bold" mb={2}>Overall Class Performance</Typography>
                                    <Typography variant="body2">
                                        <strong>Total Students:</strong> <em>{overallClassSummary.totalStudents}</em>
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Passed Students:</strong> <em>{overallClassSummary.passedStudents}</em>
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Failed Students:</strong> <em>{overallClassSummary.failStudents}</em>
                                    </Typography>
                                    <Typography variant="body2" mt={2} fontWeight="bold">
                                        Subject-wise Average Performance:
                                    </Typography>
                                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                                        {Object.keys(overallClassSummary.subjectWisePerformance).map(subject => (
                                            <li key={subject}>
                                                <strong>{subject}:</strong> <em>{overallClassSummary.subjectWisePerformance[subject].averagePercentage.toFixed(2)}%</em>
                                            </li>
                                        ))}
                                    </ul>
                                    <Typography variant="body2" mt={2}>
                                        <strong>Overall Average Class Percentage:</strong> <em>{overallClassSummary.overallAveragePercentage.toFixed(2)}%</em>
                                    </Typography>
                                    <Typography variant="body2" mt={2} fontWeight="bold">
                                        Insights:
                                    </Typography>
                                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                                        {overallClassSummary.overallAveragePercentage >= 60 ? (
                                            <li>The class has performed reasonably well overall.</li>
                                        ) : (
                                            <li>The overall class performance indicates areas that need attention and improvement.</li>
                                        )}
                                        {overallClassSummary.failStudents > overallClassSummary.totalStudents * 0.2 ? (
                                            <li>A significant number of students are struggling. Focused interventions and support are recommended.</li>
                                        ) : (
                                            <li>Most students have passed the exam. Efforts should be made to help the remaining students catch up.</li>
                                        )}
                                        {Object.keys(overallClassSummary.subjectWisePerformance).sort((a, b) => overallClassSummary.subjectWisePerformance[b].averagePercentage - overallClassSummary.subjectWisePerformance[a].averagePercentage).slice(0, 1).map(subject => (
                                            <li key={`top-${subject}`}>The class performed best in <strong>{subject}</strong> with an average of <em>{overallClassSummary.subjectWisePerformance[subject].averagePercentage.toFixed(2)}%</em>.</li>
                                        ))}
                                        {Object.keys(overallClassSummary.subjectWisePerformance).sort((a, b) => overallClassSummary.subjectWisePerformance[a].averagePercentage - overallClassSummary.subjectWisePerformance[b].averagePercentage).slice(0, 1).map(subject => (
                                            <li key={`bottom-${subject}`}>Performance in <strong>{subject}</strong> is a concern, with an average of <em>{overallClassSummary.subjectWisePerformance[subject].averagePercentage.toFixed(2)}%</em>. Targeted teaching strategies for this subject are needed.</li>
                                        ))}
                                    </ul>
                                </Box>
                            )}
                            {feedbackTab === 1 && report.students && subjectsInfoPayload && (
                                <Box mt={2}>
                                    <Typography variant="h6" fontWeight="bold" mb={2} textAlign="left">Individual Student Feedback</Typography>
                                    {report.students.map(student => (
                                        <Box key={student.name} mb={2} borderBottom="1px solid #eee" pb={2} textAlign="left">
                                            <Typography variant="subtitle1" fontWeight="bold">Feedback for {student.name}</Typography>
                                            <Typography variant="body2" component="div">
                                                {getStudentFeedback(student, subjectsInfoPayload).split(' ').map((word, index) => {
                                                    if (word.startsWith('*') && word.endsWith('*')) {
                                                        const content = word.substring(1, word.length - 1);
                                                        if (content.startsWith('*') && content.endsWith('*')) {
                                                            return <strong key={index}>{content.substring(1, content.length - 1)} </strong>;
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
                        <Box mt={4} mb={2} display="flex" alignItems="center" justifyContent="space-between">
                            <Divider textAlign="left" sx={{ flexGrow: 1, mr: 2 }}>
                                <Typography variant="h5">📚 All Students Performance</Typography>
                            </Divider>
                            <Button onClick={() => setShowAllStudents(!showAllStudents)} startIcon={showAllStudents ? <VisibilityOffIcon /> : <VisibilityIcon />}>
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
                                            {subjects.map(sub => (
                                                <TableCell key={sub.name} align="right">{sub.name} (Grade)</TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {report.students.map((student) => (
                                            <TableRow
                                                key={student.name}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {student.name}
                                                </TableCell>
                                                <TableCell align="right">{student.total}</TableCell>
                                                <TableCell align="right">{student.percentage.toFixed(2)}</TableCell>
                                                <TableCell align="right">{student.overallGrade}</TableCell>
                                                <TableCell align="right">{student.passed ? <Typography color="success">Passed</Typography> : <Typography color="error">Failed</Typography>}</TableCell>
                                                {student.subjects.map(sub => (
                                                    <TableCell key={`${student.name}-${sub.subject}`} align="right">{`${sub.score} (${sub.grade})`}</TableCell>
                                                ))}
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