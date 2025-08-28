import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Paper,
  Container,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";

const ReadingSettings = () => {
  const [blogPostsPerPage, setBlogPostsPerPage] = useState(10);
  const [success, setSuccess] = useState(false);

  const handleSave = () => {
    console.log("Saving blog pages setting...", { blogPostsPerPage });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleSelectChange = (event) => {
    setBlogPostsPerPage(event.target.value);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f8fafc",
      }}
      p={3}
    >
      <Container maxWidth="md">
        {/* Back Button */}
        <Box sx={{ mb: 1 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => console.log("Navigate back")}
            sx={{
              textTransform: "none",
              fontSize: "0.95rem",
              fontWeight: 500,
              px: 0,
              "&:hover": {
                bgcolor: "transparent",
                color: "#3b82f6",
              },
            }}
          >
            Back to Settings
          </Button>
        </Box>

        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 1,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Reading Settings
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#64748b",
              fontSize: "1.1rem",
            }}
          >
            Configure how blog posts are displayed
          </Typography>
        </Box>

        {/* Success Alert */}
        {success && (
          <Alert
            severity="success"
            sx={{
              mb: 3,
              borderRadius: "16px",
              fontSize: "1rem",
            }}
          >
            Blog pages setting saved successfully!
          </Alert>
        )}

        {/* Main Content */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: "20px",
            border: "1px solid #e2e8f0",
            overflow: "hidden",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          }}
        >
          <Box sx={{ p: 4 }}>
            {/* Display Settings Section */}
            <Box>
              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  fontWeight: 600,
                  color: "#374151",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                📄 Display Settings
              </Typography>

              <Box sx={{ mb: 4 }}>
                <FormControl fullWidth>
                  <InputLabel
                    sx={{
                      "&.Mui-focused": {
                        color: "#3b82f6",
                      },
                    }}
                  >
                    Blog pages show at most
                  </InputLabel>
                  <Select
                    value={blogPostsPerPage}
                    label="Blog pages show at most"
                    onChange={handleSelectChange}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "16px",
                        fontSize: "1.1rem",
                        fontWeight: 500,
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#3b82f6",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#3b82f6",
                        borderWidth: "2px",
                      },
                      borderRadius: "16px",
                    }}
                  >
                    <MenuItem value={5}>5 posts</MenuItem>
                    <MenuItem value={10}>10 posts</MenuItem>
                    <MenuItem value={15}>15 posts</MenuItem>
                    <MenuItem value={20}>20 posts</MenuItem>
                    <MenuItem value={25}>25 posts</MenuItem>
                    <MenuItem value={30}>30 posts</MenuItem>
                    <MenuItem value={40}>40 posts</MenuItem>
                    <MenuItem value={50}>50 posts</MenuItem>
                  </Select>
                </FormControl>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#64748b",
                    fontSize: "0.9rem",
                    mt: 1,
                  }}
                >
                  Choose how many blog posts to display per page
                </Typography>
              </Box>
            </Box>

            {/* Action Button */}
            <Box sx={{ pt: 2, borderTop: "1px solid #f1f5f9" }}>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  sx={{
                    borderRadius: "12px",
                    py: 1.5,
                    px: 3,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: "1rem",
                    minWidth: "140px",
                    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 25px rgba(102, 126, 234, 0.6)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Save Setting
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ReadingSettings;
