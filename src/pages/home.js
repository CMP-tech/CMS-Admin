import React, { useState, useRef, useCallback } from "react";
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

    // New states for toggling sections
    const [showTopper, setShowTopper] = useState(true);
    const [showTop3, setShowTop3] = useState(true);
    const [showBottom3, setShowBottom3] = useState(true);

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
        const content = `Name: ${report.topper.Name}\nTotal: ${report.topper.Total}\nPercentage: ${report.topper.Percentage}%\nHindi: ${report.topper.Hindi}, English: ${report.topper.English}, Math: ${report.topper.Math}, Science: ${report.topper.Science}, SST: ${report.topper.SST}`;
        const pdf = generatePdf("Topper Details", content);
        pdf.save("topper.pdf");
    };

    const downloadTop3Pdf = () => {
        if (!report?.top3) return;
        let content = "";
        report.top3.forEach((student, index) => {
            content += `Rank ${index + 1}:\nName: ${student.Name}\nTotal: ${student.Total}\nPercentage: ${student.Percentage}%\nHindi: ${student.Hindi}, English: ${student.English}, Math: ${student.Math}, Science: ${student.Science}, SST: ${student.SST}\n\n`;
        });
        const pdf = generatePdf("Top 3 Students", content);
        pdf.save("top3.pdf");
    };

    const downloadBottom3Pdf = () => {
        if (!report?.bottom3) return;
        let content = "";
        report.bottom3.forEach((student, index) => {
            content += `Bottom ${index + 1}:\nName: ${student.Name}\nTotal: ${student.Total}\nPercentage: ${student.Percentage}%\nHindi: ${student.Hindi}, English: ${student.English}, Math: ${student.Math}, Science: ${student.Science}, SST: ${student.SST}\n\n`;
        });
        const pdf = generatePdf("Bottom 3 Students", content);
        pdf.save("bottom3.pdf");
    };

    // Prepare data for the chart
    const chartData = report?.students.map(student => ({
        name: student.Name,
        Hindi: student.Hindi,
        English: student.English,
        Math: student.Math,
        Science: student.Science,
        SST: student.SST,
    })) || [];

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
                        onClick={() => {
                            const pdf = generatePdf("Student Performance Summary", report.summary);
                            pdf.save("student-summary.pdf");
                        }}
                    >
                        Download Summary PDF
                    </Button>
                )}
            </Box>

            {report && (
                <>
                    {/* Toggle buttons */}
                    <Box display="flex" flexWrap="wrap" gap={2} mb={4}>
                        <Button
                            variant="outlined"
                            onClick={() => setShowTopper(!showTopper)}
                        >
                            {showTopper ? "Hide" : "Show"} Topper
                        </Button>
                        <Button variant="outlined" onClick={() => setShowTop3(!showTop3)}>
                            {showTop3 ? "Hide" : "Show"} Top 3
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => setShowBottom3(!showBottom3)}
                        >
                            {showBottom3 ? "Hide" : "Show"} Bottom 3
                        </Button>
                    </Box>

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
                    {showTopper && (
                        <>
                            <Divider textAlign="left" sx={{ mt: 5, mb: 2 }}>
                                <Typography variant="h5">🏆 Topper</Typography>
                            </Divider>
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
                                    Download Topper PDF
                                </Button>
                            </Box>
                        </>
                    )}

                    {/* Top 3 */}
                    {showTop3 && (
                        <>
                            <Divider textAlign="left" sx={{ mt: 5, mb: 2 }}>
                                <Typography variant="h5">🥇 Top 3 Students</Typography>
                            </Divider>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6">Top 3 Students</Typography>
                                <Button
                                    variant="contained"
                                    color="error"
                                    startIcon={<PictureAsPdfIcon />}
                                    onClick={downloadTop3Pdf}
                                >
                                    Download Top 3 PDF
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
                    )}

                    {/* Bottom 3 */}
                    {showBottom3 && (
                        <>
                            <Divider textAlign="left" sx={{ mt: 5, mb: 2 }}>
                                <Typography variant="h5">📉 Bottom 3 Students</Typography>
                            </Divider>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6">Bottom 3 Students</Typography>
                                <Button
                                    variant="contained"
                                    color="error"
                                    startIcon={<PictureAsPdfIcon />}
                                    onClick={downloadBottom3Pdf}
                                >
                                    Download Bottom 3 PDF
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
                    )}
                    {/* Visualization */}
                    <Divider textAlign="left" sx={{ mt: 5, mb: 2 }}>
                        <Typography variant="h5">📊 Student Performance Chart</Typography>
                    </Divider>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={chartData}
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
                            <Bar dataKey="Hindi" fill="#8884d8" />
                            <Bar dataKey="English" fill="#82ca9d" />
                            <Bar dataKey="Math" fill="#ffc658" />
                            <Bar dataKey="Science" fill="#d0743c" />
                            <Bar dataKey="SST" fill="#691998" />
                        </BarChart>
                    </ResponsiveContainer>

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
                </>
            )}
        </Container>
    );
};

export default Home;
