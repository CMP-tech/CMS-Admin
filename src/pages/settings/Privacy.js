// pages/PrivacyPage.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Paper,
  Stack,
  Container,
  Alert,
  Skeleton,
} from "@mui/material";
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const PrivacyPage = () => {
  const navigate = useNavigate();

  const [content, setContent] = useState(`
    <h1>Privacy Policy</h1>
    <p>Last updated: ${new Date().toLocaleDateString()}</p>
    
    <h2>1. Information We Collect</h2>
    <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.</p>
    
    <h2>2. How We Use Your Information</h2>
    <p>We use the information we collect to:</p>
    <ul>
      <li>Provide, maintain, and improve our services</li>
      <li>Process transactions and send related information</li>
      <li>Send you technical notices and support messages</li>
      <li>Communicate with you about products, services, and events</li>
    </ul>
    
    <h2>3. Information Sharing</h2>
    <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
    
    <h2>4. Data Security</h2>
    <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
    
    <h2>5. Contact Us</h2>
    <p>If you have any questions about this Privacy Policy, please contact us at privacy@example.com</p>
  `);

  const [originalContent, setOriginalContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Simulate loading existing content
    setOriginalContent(content);
  }, []);

  useEffect(() => {
    setHasChanges(content !== originalContent);
  }, [content, originalContent]);

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Saving privacy policy content...", content);
      setOriginalContent(content);
      setSuccess(true);
      setIsEditing(false);

      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setContent(originalContent);
    setIsEditing(false);
    setHasChanges(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  // Quill editor modules and formats
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["link", "blockquote", "code-block"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "color",
    "background",
    "align",
    "link",
    "blockquote",
    "code-block",
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f8fafc",
      }}
      p={3}
    >
      <Container maxWidth="lg">
        {/* Back Button */}
        <Box sx={{ mb: 1 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/admin/settings")}
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
            Privacy Policy
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#64748b",
              fontSize: "1.1rem",
            }}
          >
            Manage your privacy policy content and legal information
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
            Privacy policy updated successfully!
          </Alert>
        )}

        {/* Action Buttons */}
        {!isEditing && (
          <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              sx={{
                borderRadius: "12px",
                py: 1.5,
                px: 3,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                fontWeight: 600,
                textTransform: "none",
                fontSize: "1rem",
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
              Edit Content
            </Button>
          </Box>
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
          <CardContent sx={{ p: 0 }}>
            {/* Content Header */}
            <Box
              sx={{
                p: 3,
                borderBottom: isEditing ? "1px solid #e2e8f0" : "none",
                background: isEditing
                  ? "linear-gradient(135deg, #667eea15 0%, #764ba215 100%)"
                  : "transparent",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "#374151",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                📄{" "}
                {isEditing ? "Edit Privacy Policy" : "Privacy Policy Content"}
              </Typography>
              {isEditing && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "#64748b",
                    mt: 0.5,
                  }}
                >
                  Use the rich text editor below to modify your privacy policy
                </Typography>
              )}
            </Box>

            {/* Editor/Content Area */}
            <Box sx={{ p: isEditing ? 3 : 4 }}>
              {isEditing ? (
                <Box>
                  <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={handleContentChange}
                    modules={modules}
                    formats={formats}
                    style={{
                      fontSize: "16px",
                      "& .ql-container": {
                        minHeight: "400px",
                        fontSize: "16px",
                        lineHeight: "1.6",
                      },
                      "& .ql-toolbar": {
                        borderTopLeftRadius: "16px",
                        borderTopRightRadius: "16px",
                        borderColor: "#e2e8f0",
                      },
                      "& .ql-container.ql-snow": {
                        borderBottomLeftRadius: "16px",
                        borderBottomRightRadius: "16px",
                        borderColor: "#e2e8f0",
                        fontSize: "16px",
                      },
                      "& .ql-editor": {
                        fontSize: "16px",
                        lineHeight: "1.6",
                        padding: "20px",
                      },
                    }}
                  />
                </Box>
              ) : (
                <Box
                  sx={{
                    "& h1": {
                      fontSize: "2rem",
                      fontWeight: 700,
                      color: "#1e293b",
                      marginBottom: "16px",
                    },
                    "& h2": {
                      fontSize: "1.5rem",
                      fontWeight: 600,
                      color: "#374151",
                      marginBottom: "12px",
                      marginTop: "24px",
                    },
                    "& p": {
                      color: "#64748b",
                      marginBottom: "12px",
                      lineHeight: "1.7",
                    },
                    "& ul": {
                      color: "#64748b",
                      paddingLeft: "20px",
                      marginBottom: "12px",
                    },
                    "& li": {
                      marginBottom: "8px",
                      lineHeight: "1.6",
                    },
                  }}
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              )}
            </Box>

            {/* Action Buttons - Only show when editing */}
            {isEditing && (
              <Box
                sx={{
                  p: 3,
                  borderTop: "1px solid #e2e8f0",
                  background: "#fafbfc",
                }}
              >
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                    disabled={loading}
                    sx={{
                      borderRadius: "12px",
                      py: 1.5,
                      px: 3,
                      borderColor: "#d1d5db",
                      color: "#374151",
                      fontWeight: 600,
                      textTransform: "none",
                      fontSize: "1rem",
                      minWidth: "120px",
                      "&:hover": {
                        borderColor: "#9ca3af",
                        bgcolor: "#f9fafb",
                        transform: "translateY(-1px)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    disabled={loading || !hasChanges}
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
                      "&:disabled": {
                        background: "#e5e7eb",
                        color: "#9ca3af",
                        transform: "none",
                        boxShadow: "none",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    {loading ? "Saving..." : "Update Privacy Policy"}
                  </Button>
                </Stack>
              </Box>
            )}
          </CardContent>
        </Paper>

        {/* Additional Info Card */}
        {isEditing && (
          <Paper
            elevation={0}
            sx={{
              borderRadius: "20px",
              border: "1px solid #e2e8f0",
              overflow: "hidden",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              mt: 3,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "#374151",
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                💡 Editor Tips
              </Typography>

              <Stack spacing={1}>
                <Typography
                  variant="body2"
                  sx={{ color: "#64748b", fontSize: "0.9rem" }}
                >
                  • Use headings to organize different sections of your privacy
                  policy
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#64748b", fontSize: "0.9rem" }}
                >
                  • Bold important legal terms and conditions
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#64748b", fontSize: "0.9rem" }}
                >
                  • Use bullet points for lists of data types or user rights
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#64748b", fontSize: "0.9rem" }}
                >
                  • Include contact information for privacy-related inquiries
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#64748b", fontSize: "0.9rem" }}
                >
                  • Remember to update the "Last updated" date when making
                  changes
                </Typography>
              </Stack>
            </CardContent>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default PrivacyPage;
