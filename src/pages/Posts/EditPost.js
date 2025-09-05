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
  Backdrop,
} from "@mui/material";
import {
  Save as SaveIcon,
  Publish as PublishIcon,
  Add as AddIcon,
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
// Use react-quill-new instead of react-quill
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../axiosInstance";

const apiService = {
  // Fetch categories
  fetchCategories: async () => {
    try {
      const response = await axiosInstance.get("/categories", {
        params: { limit: 100 },
      });
      return response.data.categories || response.data;
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
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error fetching languages:", error);
      throw error;
    }
  },

  // Fetch single post by ID
  fetchPost: async (postId) => {
    try {
      const response = await axiosInstance.get(`/posts/${postId}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error fetching post:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch post";
      throw new Error(errorMessage);
    }
  },

  // Update post
  updatePost: async (postId, postData) => {
    try {
      const response = await axiosInstance.put(`/posts/${postId}`, postData);
      return response.data;
    } catch (error) {
      console.error("Error updating post:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update post";
      throw new Error(errorMessage);
    }
  },
};

const accessLevels = ["free", "registered", "paid"];

const EditPostPage = () => {
  const { postId } = useParams(); // Get post ID from URL params
  const navigate = useNavigate();

  // Form state
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState("");
  const [accessLevel, setAccessLevel] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [currentStatus, setCurrentStatus] = useState("draft");

  // Dynamic data state
  const [categories, setCategories] = useState([]);
  const [languages, setLanguages] = useState([]);

  // Loading states
  const [isLoadingPost, setIsLoadingPost] = useState(true);
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

  // Fetch all initial data on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch categories, languages, and post data in parallel
        const [categoriesData, languagesData, postData] =
          await Promise.allSettled([
            apiService.fetchCategories().catch((err) => {
              console.error("Categories fetch failed:", err);
              return [];
            }),
            apiService.fetchLanguages().catch((err) => {
              console.error("Languages fetch failed:", err);
              return [];
            }),
            apiService.fetchPost(postId),
          ]);

        // Handle categories
        if (categoriesData.status === "fulfilled") {
          setCategories(categoriesData.value);
        }
        setIsLoadingCategories(false);

        // Handle languages
        if (languagesData.status === "fulfilled") {
          setLanguages(languagesData.value);
        }
        setIsLoadingLanguages(false);

        // Handle post data
        if (postData.status === "fulfilled") {
          const post = postData.value;
          setTitle(post.title || "");
          setBody(post.body || "");
          setCategory(post.category?._id || post.category || "");
          setLanguage(post.language?._id || post.language || "");
          setAccessLevel(post.accessLevel || "");
          setTags(post.tags || []);
          setCurrentStatus(post.status || "draft");
        } else {
          showSnackbar("Failed to load post data. Please try again.", "error");
          setTimeout(() => {
            navigate("/admin/posts");
          }, 2000);
        }
      } catch (error) {
        showSnackbar("Failed to load data. Please try again.", "error");
        setTimeout(() => {
          navigate("/admin/posts");
        }, 2000);
      } finally {
        setIsLoadingPost(false);
      }
    };

    if (postId) {
      fetchInitialData();
    } else {
      showSnackbar("Invalid post ID", "error");
      navigate("/admin/posts");
    }
  }, [postId, navigate]);

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

  const handleUpdate = async (newStatus = null) => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const postData = {
        title: title.trim(),
        body: body.trim(),
        category,
        language,
        accessLevel,
        tags,
        status: newStatus || currentStatus,
      };

      const response = await apiService.updatePost(postId, postData);

      const actionText =
        newStatus === "published"
          ? "published"
          : newStatus === "draft"
          ? "saved as draft"
          : "updated";

      showSnackbar(`Post ${actionText} successfully!`, "success");

      // Update current status if it changed
      if (newStatus) {
        setCurrentStatus(newStatus);
      }

      // Redirect after a delay
      setTimeout(() => {
        navigate("/admin/posts");
      }, 1500);
    } catch (error) {
      showSnackbar(error.message || "Failed to update post", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => handleUpdate("draft");
  const handlePublish = () => handleUpdate("published");
  const handleSaveChanges = () => handleUpdate(); // Keep current status

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

  // Show loading backdrop while initial data is loading
  if (isLoadingPost) {
    return (
      <Backdrop
        open={true}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <CircularProgress color="inherit" size={60} />
          <Typography variant="h6">Loading post data...</Typography>
        </Box>
      </Backdrop>
    );
  }

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
            Edit Post
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <Typography
              variant="body1"
              sx={{
                color: "#64748b",
                fontSize: "1.1rem",
              }}
            >
              Make changes to your post
            </Typography>
            <Chip
              label={`Status: ${
                currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)
              }`}
              color={
                currentStatus === "published"
                  ? "success"
                  : currentStatus === "draft"
                  ? "warning"
                  : "default"
              }
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Box>
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
                    {/* Save Changes (keeps current status) */}
                    <Button
                      variant="outlined"
                      startIcon={
                        isSubmitting ? (
                          <CircularProgress size={16} />
                        ) : (
                          <EditIcon />
                        )
                      }
                      onClick={handleSaveChanges}
                      disabled={isSubmitting}
                      fullWidth
                      sx={{
                        borderRadius: "12px",
                        py: 1.5,
                        borderColor: "#10b981",
                        color: "#10b981",
                        fontWeight: 600,
                        textTransform: "none",
                        fontSize: "1rem",
                        "&:hover": {
                          borderColor: "#059669",
                          bgcolor: "#f0fdf4",
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
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>

                    {/* Save as Draft */}
                    {currentStatus !== "draft" && (
                      <Button
                        variant="outlined"
                        startIcon={
                          isSubmitting ? (
                            <CircularProgress size={16} />
                          ) : (
                            <SaveIcon />
                          )
                        }
                        onClick={handleSaveDraft}
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
                        {isSubmitting ? "Saving..." : "Save as Draft"}
                      </Button>
                    )}

                    {/* Publish */}
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
                      {isSubmitting
                        ? "Publishing..."
                        : currentStatus === "published"
                        ? "Update & Publish"
                        : "Publish Post"}
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

export default EditPostPage;
