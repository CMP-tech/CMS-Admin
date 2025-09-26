import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  Card,
  CardContent,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  Chip,
  Stack,
  Paper,
  IconButton,
  InputAdornment,
  Divider,
  Container,
  Snackbar,
  Alert,
  CircularProgress,
  Skeleton,
  CardMedia,
} from "@mui/material";
import {
  Save as SaveIcon,
  Publish as PublishIcon,
  Add as AddIcon,
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
// Use react-quill-new instead of react-quill
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";

const apiService = {
  // Fetch categories
  fetchCategories: async () => {
    try {
      const response = await axiosInstance.get("/categories", {
        params: { limit: 100 },
      });
      return response.data.categories || response.data; // Adjust based on your API response structure
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  // Fetch languages
  fetchLanguages: async () => {
    try {
      const response = await axiosInstance.get("/languages", {
        params: { limit: 100 },
      });
      return response.data.data || response.data; // Adjust based on your API response structure
    } catch (error) {
      console.error("Error fetching languages:", error);
      throw error;
    }
  },

  // Create post with FormData for file upload
  createPost: async (postData) => {
    try {
      const response = await axiosInstance.post("/posts", postData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating post:", error);
      // Handle axios error response
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create post";
      throw new Error(errorMessage);
    }
  },
};

const accessLevels = ["free", "registered", "paid"]; // Keep these as constants since they're likely fixed

const AddPostPage = () => {
  // Form state
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState("");
  const [accessLevel, setAccessLevel] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [bannerImage, setBannerImage] = useState(null);
  const [bannerImagePreview, setBannerImagePreview] = useState("");

  // Dynamic data state
  const [categories, setCategories] = useState([]);
  const [languages, setLanguages] = useState([]);

  // Loading states
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // UI state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const tagInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Fetch data on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch categories and languages in parallel
        const [categoriesData, languagesData] = await Promise.all([
          apiService.fetchCategories().catch((err) => {
            console.error("Categories fetch failed:", err);
            return [];
          }),
          apiService.fetchLanguages().catch((err) => {
            console.error("Languages fetch failed:", err);
            return [];
          }),
        ]);
        console.log("Fetched categories:", categoriesData);
        console.log("Fetched languages:", languagesData);

        setCategories(categoriesData);
        setLanguages(languagesData);
      } catch (error) {
        showSnackbar("Failed to load initial data", "error");
      } finally {
        setIsLoadingCategories(false);
        setIsLoadingLanguages(false);
      }
    };

    fetchInitialData();
  }, []);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const handleTagKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Banner image handlers
  const handleBannerImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        showSnackbar("Please select a valid image file", "error");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        showSnackbar("Image size should be less than 5MB", "error");
        return;
      }

      setBannerImage(file);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setBannerImagePreview(previewUrl);
    }
  };

  const handleRemoveBannerImage = () => {
    setBannerImage(null);
    if (bannerImagePreview) {
      URL.revokeObjectURL(bannerImagePreview);
      setBannerImagePreview("");
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    if (!title.trim()) {
      showSnackbar("Please enter a title", "error");
      return false;
    }
    if (!body.trim()) {
      showSnackbar("Please enter post content", "error");
      return false;
    }
    if (!category) {
      showSnackbar("Please select a category", "error");
      return false;
    }
    if (!language) {
      showSnackbar("Please select a language", "error");
      return false;
    }
    if (!accessLevel) {
      showSnackbar("Please select an access level", "error");
      return false;
    }
    return true;
  };

  const createFormData = (status) => {
    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("body", body.trim());
    formData.append("category", category);
    formData.append("language", language);
    formData.append("accessLevel", accessLevel);
    formData.append("status", status);

    // Append tags as JSON string or individual entries
    tags.forEach((tag, index) => {
      formData.append(`tags[${index}]`, tag);
    });

    // Append banner image if selected
    if (bannerImage) {
      formData.append("bannerImage", bannerImage);
    }

    return formData;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const formData = createFormData("draft");
      const response = await apiService.createPost(formData);
      showSnackbar("Draft saved successfully!", "success");

      // Optionally redirect after a delay
      setTimeout(() => {
        navigate("/admin/posts"); // Adjust route as needed
      }, 1500);
    } catch (error) {
      showSnackbar(error.message || "Failed to save draft", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const formData = createFormData("published");
      const response = await apiService.createPost(formData);
      showSnackbar("Post published successfully!", "success");

      // Redirect after successful publish
      setTimeout(() => {
        navigate("/admin/posts"); // Adjust route as needed
      }, 1500);
    } catch (error) {
      showSnackbar(error.message || "Failed to publish post", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Enhanced Quill configuration for better performance
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      ["link", "image"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "blockquote",
    "code-block",
    "link",
    "image",
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
      }}
      p={3}
    >
      <Box>
        {/* Back Button */}
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/admin/posts")}
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
            Back to Posts
          </Button>
        </Box>

        {/* Modern Header */}
        <Box sx={{ mb: 2 }}>
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
            Create New Post
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#64748b",
              fontSize: "1.1rem",
            }}
          >
            Share your thoughts and ideas with the community
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: 3,
            alignItems: "flex-start",
          }}
        >
          {/* Main Content Panel */}
          <Box
            sx={{
              flex: { xs: "1 1 100%", lg: "1 1 65%" },
              minWidth: 0,
            }}
          >
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
                {/* Banner Image Upload Section */}
                <Box sx={{ mb: 4 }}>
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
                    <ImageIcon /> Banner Image
                  </Typography>

                  {bannerImagePreview ? (
                    <Box sx={{ position: "relative", mb: 2 }}>
                      <CardMedia
                        component="img"
                        sx={{
                          height: 200,
                          borderRadius: "12px",
                          objectFit: "cover",
                          border: "2px solid #e2e8f0",
                        }}
                        image={bannerImagePreview}
                        alt="Banner preview"
                      />
                      <IconButton
                        onClick={handleRemoveBannerImage}
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          bgcolor: "rgba(239, 68, 68, 0.9)",
                          color: "white",
                          "&:hover": {
                            bgcolor: "rgba(220, 38, 38, 0.9)",
                          },
                          width: 36,
                          height: 36,
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ) : (
                    <Paper
                      elevation={0}
                      sx={{
                        border: "2px dashed #d1d5db",
                        borderRadius: "12px",
                        p: 3,
                        textAlign: "center",
                        bgcolor: "#f9fafb",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          borderColor: "#3b82f6",
                          bgcolor: "#eff6ff",
                        },
                      }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <CloudUploadIcon
                        sx={{
                          fontSize: 48,
                          color: "#9ca3af",
                          mb: 1,
                        }}
                      />
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#374151",
                          fontWeight: 500,
                          mb: 0.5,
                        }}
                      >
                        Click to upload banner image
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#6b7280" }}>
                        Supports JPG, PNG, GIF up to 5MB
                      </Typography>
                    </Paper>
                  )}

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleBannerImageSelect}
                    accept="image/*"
                    style={{ display: "none" }}
                  />

                  {!bannerImagePreview && (
                    <Button
                      variant="outlined"
                      startIcon={<CloudUploadIcon />}
                      onClick={() => fileInputRef.current?.click()}
                      sx={{
                        mt: 1,
                        borderRadius: "8px",
                        textTransform: "none",
                        borderColor: "#d1d5db",
                        color: "#374151",
                        "&:hover": {
                          borderColor: "#3b82f6",
                          bgcolor: "#eff6ff",
                        },
                      }}
                    >
                      Choose Banner Image
                    </Button>
                  )}
                </Box>

                {/* Modern Title Input */}
                <TextField
                  label="Post Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  fullWidth
                  variant="outlined"
                  placeholder="Enter an engaging title for your post"
                  sx={{
                    mb: 4,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "16px",
                      fontSize: "1.2rem",
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

                {/* Modern Body Editor */}
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      fontWeight: 600,
                      color: "#374151",
                    }}
                  >
                    Content
                  </Typography>
                  <Box
                    sx={{
                      borderRadius: "16px",
                      overflow: "hidden",
                      border: "1px solid #e2e8f0",
                      "&:hover": {
                        borderColor: "#3b82f6",
                      },
                      "&:focus-within": {
                        borderColor: "#3b82f6",
                        borderWidth: "2px",
                      },
                    }}
                  >
                    <ReactQuill
                      theme="snow"
                      value={body}
                      onChange={setBody}
                      modules={quillModules}
                      formats={quillFormats}
                      style={{
                        height: "320px",
                        marginBottom: "50px",
                      }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Paper>
          </Box>

          {/* Sidebar Panel */}
          <Box
            sx={{
              flex: { xs: "1 1 100%", lg: "1 1 35%" },
              minWidth: { xs: "100%", lg: "300px" },
              maxWidth: { xs: "100%", lg: "400px" },
            }}
          >
            <Stack spacing={3}>
              {/* Publishing Options Card */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: "20px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 3,
                      fontWeight: 600,
                      color: "#1a202c",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    📝 Publishing Options
                  </Typography>

                  {/* Language */}
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel sx={{ "&.Mui-focused": { color: "#3b82f6" } }}>
                      Language
                    </InputLabel>
                    {isLoadingLanguages ? (
                      <Skeleton
                        variant="rectangular"
                        height={56}
                        sx={{ borderRadius: "12px" }}
                      />
                    ) : (
                      <Select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        label="Language"
                        sx={{
                          borderRadius: "12px",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#e2e8f0",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#3b82f6",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#3b82f6",
                          },
                        }}
                      >
                        {languages.map((lang) => (
                          <MenuItem
                            key={lang._id || lang.id}
                            value={lang._id || lang.id}
                          >
                            {lang.language}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  </FormControl>

                  {/* Category */}
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel sx={{ "&.Mui-focused": { color: "#3b82f6" } }}>
                      Category
                    </InputLabel>
                    {isLoadingCategories ? (
                      <Skeleton
                        variant="rectangular"
                        height={56}
                        sx={{ borderRadius: "12px" }}
                      />
                    ) : (
                      <Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        label="Category"
                        sx={{
                          borderRadius: "12px",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#e2e8f0",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#3b82f6",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#3b82f6",
                          },
                        }}
                      >
                        {categories.map((cat) => (
                          <MenuItem
                            key={cat._id || cat.id}
                            value={cat._id || cat.id}
                          >
                            {cat.categoryName}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  </FormControl>

                  {/* Access Level */}
                  <FormControl fullWidth>
                    <InputLabel sx={{ "&.Mui-focused": { color: "#3b82f6" } }}>
                      Access Level
                    </InputLabel>
                    <Select
                      value={accessLevel}
                      onChange={(e) => setAccessLevel(e.target.value)}
                      label="Access Level"
                      sx={{
                        borderRadius: "12px",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#e2e8f0",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#3b82f6",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#3b82f6",
                        },
                      }}
                    >
                      {accessLevels.map((level) => (
                        <MenuItem key={level} value={level}>
                          {level.charAt(0).toUpperCase() + level.slice(1)}{" "}
                          {level === "free" && "Users"}{" "}
                          {level === "registered" && "Users Only"}{" "}
                          {level === "paid" && "Members Only"}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </CardContent>
              </Paper>

              {/* Modern Tags Card */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: "20px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 3,
                      fontWeight: 600,
                      color: "#1a202c",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    🏷️ Tags
                  </Typography>

                  {/* Tag Input with Modern Design */}
                  <TextField
                    ref={tagInputRef}
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleTagKeyPress}
                    placeholder="Type a tag and press Enter"
                    fullWidth
                    size="small"
                    sx={{
                      mb: 2,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        "&:hover fieldset": {
                          borderColor: "#3b82f6",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#3b82f6",
                        },
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleAddTag}
                            disabled={!tagInput.trim()}
                            size="small"
                            sx={{
                              bgcolor: "#3b82f6",
                              color: "white",
                              width: 28,
                              height: 28,
                              "&:hover": {
                                bgcolor: "#2563eb",
                              },
                              "&:disabled": {
                                bgcolor: "#e5e7eb",
                                color: "#9ca3af",
                              },
                            }}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  {/* Modern Tags Display */}
                  {tags.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 0.75,
                          alignItems: "flex-start",
                          width: "100%",
                          maxWidth: "100%",
                          overflow: "hidden",
                        }}
                      >
                        {tags.map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            onDelete={() => handleRemoveTag(tag)}
                            deleteIcon={<CloseIcon />}
                            size="small"
                            sx={{
                              bgcolor: "#eff6ff",
                              color: "#1d4ed8",
                              borderRadius: "8px",
                              fontWeight: 500,
                              minWidth: 0,
                              maxWidth: "calc(100% - 8px)",
                              flex: "0 0 auto",
                              "& .MuiChip-label": {
                                fontSize: "0.7rem",
                                padding: "0 6px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: "90px",
                                lineHeight: 1.2,
                              },
                              "& .MuiChip-deleteIcon": {
                                color: "#1d4ed8",
                                fontSize: "14px",
                                margin: "0 2px 0 -2px",
                                "&:hover": {
                                  color: "#1e40af",
                                },
                              },
                              "&:hover": {
                                bgcolor: "#dbeafe",
                              },
                              "@media (max-width: 600px)": {
                                "& .MuiChip-label": {
                                  maxWidth: "70px",
                                  fontSize: "0.65rem",
                                },
                              },
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  <Typography
                    variant="caption"
                    sx={{
                      color: "#64748b",
                      fontSize: "0.75rem",
                    }}
                  >
                    💡 Press Enter or click + to add custom tags
                  </Typography>
                </CardContent>
              </Paper>

              {/* Modern Action Buttons */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: "20px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <Button
                      variant="outlined"
                      startIcon={
                        isSubmitting ? (
                          <CircularProgress size={16} />
                        ) : (
                          <SaveIcon />
                        )
                      }
                      onClick={handleSave}
                      disabled={isSubmitting}
                      fullWidth
                      sx={{
                        borderRadius: "12px",
                        py: 1.5,
                        borderColor: "#d1d5db",
                        color: "#374151",
                        fontWeight: 600,
                        textTransform: "none",
                        fontSize: "1rem",
                        "&:hover": {
                          borderColor: "#9ca3af",
                          bgcolor: "#f9fafb",
                          transform: !isSubmitting
                            ? "translateY(-1px)"
                            : "none",
                        },
                        "&:disabled": {
                          borderColor: "#e5e7eb",
                          color: "#9ca3af",
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      {isSubmitting ? "Saving..." : "Save Draft"}
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={
                        isSubmitting ? (
                          <CircularProgress size={16} />
                        ) : (
                          <PublishIcon />
                        )
                      }
                      onClick={handlePublish}
                      disabled={isSubmitting}
                      fullWidth
                      sx={{
                        borderRadius: "12px",
                        py: 1.5,
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        fontWeight: 600,
                        textTransform: "none",
                        fontSize: "1rem",
                        boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                        "&:hover": {
                          background: !isSubmitting
                            ? "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)"
                            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          transform: !isSubmitting
                            ? "translateY(-2px)"
                            : "none",
                          boxShadow: !isSubmitting
                            ? "0 8px 25px rgba(102, 126, 234, 0.6)"
                            : "0 4px 15px rgba(102, 126, 234, 0.4)",
                        },
                        "&:disabled": {
                          background:
                            "linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)",
                          boxShadow: "none",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      {isSubmitting ? "Publishing..." : "Publish Post"}
                    </Button>
                  </Stack>
                </CardContent>
              </Paper>
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddPostPage;
