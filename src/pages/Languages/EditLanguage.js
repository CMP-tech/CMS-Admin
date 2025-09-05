// pages/EditLanguagePage.jsx
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
  Skeleton,
} from "@mui/material";
import {
  Save as SaveIcon,
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
// Adjust path to your axios instance

const EditLanguagePage = () => {
  const [formData, setFormData] = useState({
    language: "",
    slug: "",
    description: "",
    isDraft: true,
  });
  const [originalData, setOriginalData] = useState({});
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  const navigate = useNavigate();
  const { id } = useParams(); // Get language ID from URL params

  // Comprehensive list of languages with their names
  const languageOptions = [
    "Afrikaans",
    "Albanian",
    "Amharic",
    "Arabic",
    "Armenian",
    "Azerbaijani",
    "Basque",
    "Belarusian",
    "Bengali",
    "Bosnian",
    "Bulgarian",
    "Burmese",
    "Catalan",
    "Chinese",
    "Croatian",
    "Czech",
    "Danish",
    "Dutch",
    "English",
    "Estonian",
    "Filipino",
    "Finnish",
    "French",
    "Galician",
    "Georgian",
    "German",
    "Greek",
    "Gujarati",
    "Hebrew",
    "Hindi",
    "Hungarian",
    "Icelandic",
    "Indonesian",
    "Irish",
    "Italian",
    "Japanese",
    "Kannada",
    "Kazakh",
    "Khmer",
    "Korean",
    "Kurdish",
    "Kyrgyz",
    "Lao",
    "Latvian",
    "Lithuanian",
    "Luxembourgish",
    "Macedonian",
    "Malay",
    "Malayalam",
    "Maltese",
    "Marathi",
    "Mongolian",
    "Nepali",
    "Norwegian",
    "Pashto",
    "Persian",
    "Polish",
    "Portuguese",
    "Punjabi",
    "Romanian",
    "Russian",
    "Serbian",
    "Sinhala",
    "Slovak",
    "Slovenian",
    "Spanish",
    "Swahili",
    "Swedish",
    "Tamil",
    "Telugu",
    "Thai",
    "Turkish",
    "Ukrainian",
    "Urdu",
    "Uzbek",
    "Vietnamese",
    "Welsh",
    "Xhosa",
    "Yoruba",
    "Zulu",
  ];

  // Auto-generate slug from language name (first 2 letters)
  const generateSlug = (language) => {
    return language.toLowerCase().trim().substring(0, 2);
  };

  // Fetch existing language data
  useEffect(() => {
    const fetchLanguage = async () => {
      if (!id) {
        navigate("/admin/languages");
        return;
      }

      try {
        setFetchLoading(true);
        setApiError("");

        const response = await axiosInstance.get(`languages/${id}`);

        if (response.status === 200) {
          const languageData = response.data;
          setFormData({
            language: languageData.language,
            slug: languageData.slug,
            description: languageData.description,
            isDraft: languageData.isDraft,
          });
          setOriginalData(languageData);
        }
      } catch (error) {
        let errorMessage = "Failed to fetch language data";

        if (error.response?.status === 404) {
          errorMessage = "Language not found";
          setTimeout(() => navigate("/admin/languages"), 2000);
        } else if (error.response) {
          errorMessage = error.response.data.message || errorMessage;
        } else if (error.request) {
          errorMessage = "Network error. Please check your connection.";
        }

        setApiError(errorMessage);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchLanguage();
  }, [id, navigate]);

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

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check if form has changes
  const hasChanges = () => {
    return (
      formData.language !== originalData.language ||
      formData.slug !== originalData.slug ||
      formData.description !== originalData.description ||
      formData.isDraft !== originalData.isDraft
    );
  };

  // API call to update language
  const updateLanguageAPI = async (languageData, isDraft) => {
    try {
      setLoading(true);
      setApiError("");

      const payload = {
        language: languageData.language,
        slug: languageData.slug,
        description: languageData.description,
        isDraft: isDraft,
      };

      const response = await axiosInstance.put(`/languages/${id}`, payload);

      if (response.status === 200) {
        return { success: true, data: response.data };
      }
    } catch (error) {
      let errorMessage = "Failed to update language";

      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      } else {
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

    const result = await updateLanguageAPI(formData, true);

    if (result.success) {
      setSuccess(true);
      setOriginalData({ ...formData, isDraft: true });

      setTimeout(() => {
        setSuccess(false);
        navigate("/admin/languages");
      }, 2000);
    } else {
      setApiError(result.error);
    }
  };

  // Handle Publish Language
  const handlePublish = async () => {
    if (!validateForm()) return;

    const result = await updateLanguageAPI(formData, false);

    if (result.success) {
      setSuccess(true);
      setOriginalData({ ...formData, isDraft: false });

      setTimeout(() => {
        setSuccess(false);
        navigate("/admin/languages");
      }, 2000);
    } else {
      setApiError(result.error);
    }
  };

  // Loading skeleton
  if (fetchLoading) {
    return (
      <Box sx={{ minHeight: "100vh" }} p={3}>
        <Container maxWidth="md">
          <Skeleton variant="text" sx={{ fontSize: "2rem", mb: 2 }} />
          <Skeleton variant="text" sx={{ fontSize: "1rem", mb: 4 }} />
          <Paper sx={{ borderRadius: "20px", p: 4 }}>
            <Stack spacing={4}>
              <Box>
                <Skeleton variant="text" sx={{ fontSize: "1.5rem", mb: 3 }} />
                <Stack spacing={3}>
                  <Skeleton
                    variant="rectangular"
                    height={56}
                    sx={{ borderRadius: "16px" }}
                  />
                  <Skeleton
                    variant="rectangular"
                    height={56}
                    sx={{ borderRadius: "16px" }}
                  />
                </Stack>
              </Box>
              <Box>
                <Skeleton variant="text" sx={{ fontSize: "1.5rem", mb: 2 }} />
                <Skeleton
                  variant="rectangular"
                  height={120}
                  sx={{ borderRadius: "16px" }}
                />
              </Box>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Skeleton
                  variant="rectangular"
                  width={120}
                  height={48}
                  sx={{ borderRadius: "12px" }}
                />
                <Skeleton
                  variant="rectangular"
                  width={140}
                  height={48}
                  sx={{ borderRadius: "12px" }}
                />
              </Box>
            </Stack>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
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
            Edit Language
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#64748b",
              fontSize: "1.1rem",
            }}
          >
            Update language settings for your application
            {formData.isDraft && (
              <Box
                component="span"
                sx={{
                  ml: 2,
                  px: 2,
                  py: 0.5,
                  bgcolor: "#fef3c7",
                  color: "#d97706",
                  borderRadius: "12px",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              >
                Draft
              </Box>
            )}
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
            Language updated successfully!
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
                        placeholder="Select or type a language..."
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
                    freeSolo
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

              {/* Description Section */}
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
                  📝 Description
                </Typography>

                <TextField
                  label="Language Description"
                  value={formData.description}
                  onChange={handleInputChange("description")}
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  placeholder="Provide a brief description of this language (e.g., primary regions where it's spoken, number of speakers, etc.)..."
                  error={!!errors.description}
                  helperText={errors.description}
                  disabled={loading}
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
                    disabled={
                      loading ||
                      !formData.language.trim() ||
                      !formData.description.trim() ||
                      !hasChanges()
                    }
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
                        <EditIcon />
                      )
                    }
                    onClick={handlePublish}
                    disabled={
                      loading ||
                      !formData.language.trim() ||
                      !formData.description.trim() ||
                      !hasChanges()
                    }
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
                    {loading ? "Updating..." : "Update & Publish"}
                  </Button>
                </Stack>
              </Box>

              {/* No Changes Message */}
              {!hasChanges() && (
                <Alert
                  severity="info"
                  sx={{
                    borderRadius: "16px",
                    fontSize: "0.95rem",
                  }}
                >
                  No changes detected. Modify the form to enable saving.
                </Alert>
              )}
            </Stack>
          </CardContent>
        </Paper>
      </Container>
    </Box>
  );
};

export default EditLanguagePage;
