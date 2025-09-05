// pages/AddLanguagePage.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Card,
  CardContent,
  Paper,
  Stack,
  Container,
  Autocomplete,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Save as SaveIcon,
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";

const AddLanguagePage = () => {
  const [formData, setFormData] = useState({
    language: "",
    slug: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const navigate = useNavigate();

  // Limited list of languages as requested
  const languageOptions = ["Hindi", "English", "Tamil"];

  // Auto-generate slug from language name (first 2 letters)
  const generateSlug = (language) => {
    return language.toLowerCase().trim().substring(0, 2);
  };

  const handleLanguageChange = (event, value) => {
    if (value) {
      const slug = generateSlug(value);
      setFormData({
        ...formData,
        language: value,
        slug: slug,
      });
      // Clear language error if it exists
      if (errors.language) {
        setErrors({ ...errors, language: "" });
      }
    } else {
      setFormData({
        ...formData,
        language: "",
        slug: "",
      });
    }
    // Clear API error when form changes
    if (apiError) setApiError("");
  };

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
    // Clear error for this field
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
    // Clear API error when form changes
    if (apiError) setApiError("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.language.trim()) {
      newErrors.language = "Language is required";
    }

    // Description is now optional - no validation needed

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // API call to create language (draft or published)
  const createLanguageAPI = async (languageData, isDraft = true) => {
    try {
      setLoading(true);
      setApiError("");

      const payload = {
        ...languageData,
        description: languageData.description.trim() || "", // Ensure empty string if no description
        isDraft: isDraft,
      };

      const response = await axiosInstance.post("/languages", payload);

      if (response.status === 201) {
        return { success: true, data: response.data };
      }
    } catch (error) {
      let errorMessage = "Failed to create language";

      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "Network error. Please check your connection.";
      } else {
        // Something else happened
        errorMessage = error.message || errorMessage;
      }

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Handle Save Draft
  const handleSaveDraft = async () => {
    if (!validateForm()) return;

    const result = await createLanguageAPI(formData, true); // Save as draft

    if (result.success) {
      setSuccess(true);

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          language: "",
          slug: "",
          description: "",
        });
        setSuccess(false);
        // Navigate back to languages list
        navigate("/admin/languages");
      }, 2000);
    } else {
      setApiError(result.error);
    }
  };

  // Handle Publish Language
  const handlePublish = async () => {
    if (!validateForm()) return;

    const result = await createLanguageAPI(formData, false); // Publish directly

    if (result.success) {
      setSuccess(true);

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          language: "",
          slug: "",
          description: "",
        });
        setSuccess(false);
        // Navigate back to languages list
        navigate("/admin/languages");
      }, 2000);
    } else {
      setApiError(result.error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        // bgcolor: "#f8fafc",
      }}
      p={3}
    >
      <Container maxWidth="md">
        {/* Back Button */}
        <Box sx={{ mb: 1 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/admin/languages")}
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
            Back to Languages
          </Button>
        </Box>

        {/* Modern Header */}
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
            Add New Language
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#64748b",
              fontSize: "1.1rem",
            }}
          >
            Configure language settings for your application
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
            Language saved successfully!
          </Alert>
        )}

        {/* Error Alert */}
        {apiError && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: "16px",
              fontSize: "1rem",
            }}
          >
            {apiError}
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
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={4}>
              {/* Language Details Section */}
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
                  🌍 Language Details
                </Typography>

                <Stack spacing={3}>
                  {/* Language Selection */}
                  <Autocomplete
                    options={languageOptions}
                    value={formData.language}
                    onChange={handleLanguageChange}
                    disabled={loading}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Language"
                        placeholder="Select a language..."
                        error={!!errors.language}
                        helperText={errors.language}
                        fullWidth
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "16px",
                            fontSize: "1.1rem",
                            fontWeight: 500,
                            "&:hover fieldset": {
                              borderColor: "#3b82f6",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#3b82f6",
                              borderWidth: "2px",
                            },
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#3b82f6",
                          },
                        }}
                      />
                    )}
                    autoHighlight
                  />

                  {/* Auto-generated Slug */}
                  <TextField
                    label="Slug"
                    value={formData.slug}
                    fullWidth
                    variant="outlined"
                    disabled
                    placeholder="Auto-generated from language name"
                    helperText="This is automatically generated from the first 2 letters of the language name"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "16px",
                        fontSize: "1.1rem",
                        fontFamily: "monospace",
                        bgcolor: "#f8fafc",
                        "&.Mui-disabled": {
                          bgcolor: "#f1f5f9",
                        },
                      },
                      "& .MuiFormHelperText-root": {
                        color: "#64748b",
                        fontSize: "0.8rem",
                        mt: 1,
                      },
                    }}
                  />
                </Stack>
              </Box>

              {/* Description Section - Made Optional */}
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    fontWeight: 600,
                    color: "#374151",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  📝 Description (Optional)
                </Typography>

                <TextField
                  label="Language Description (Optional)"
                  value={formData.description}
                  onChange={handleInputChange("description")}
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  placeholder="Provide a brief description of this language (e.g., primary regions where it's spoken, number of speakers, etc.)... (optional)"
                  disabled={loading}
                  helperText="You can leave this blank if you don't want to add a description"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "16px",
                      fontSize: "1rem",
                      "&:hover fieldset": {
                        borderColor: "#3b82f6",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#3b82f6",
                        borderWidth: "2px",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#3b82f6",
                    },
                    "& .MuiFormHelperText-root": {
                      color: "#64748b",
                      fontSize: "0.8rem",
                      mt: 1,
                    },
                  }}
                />
              </Box>

              {/* Action Buttons */}
              <Box sx={{ pt: 2 }}>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    startIcon={
                      loading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <SaveIcon />
                      )
                    }
                    onClick={handleSaveDraft}
                    disabled={loading || !formData.language.trim()}
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
                        transform: !loading ? "translateY(-1px)" : "none",
                      },
                      "&:disabled": {
                        borderColor: "#e5e7eb",
                        color: "#9ca3af",
                        transform: "none",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    {loading ? "Saving..." : "Save Draft"}
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={
                      loading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <AddIcon />
                      )
                    }
                    onClick={handlePublish}
                    disabled={loading || !formData.language.trim()}
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
                        transform: !loading ? "translateY(-2px)" : "none",
                        boxShadow: !loading
                          ? "0 8px 25px rgba(102, 126, 234, 0.6)"
                          : "0 4px 15px rgba(102, 126, 234, 0.4)",
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
                    {loading ? "Publishing..." : "Publish Language"}
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Paper>
      </Container>
    </Box>
  );
};

export default AddLanguagePage;
