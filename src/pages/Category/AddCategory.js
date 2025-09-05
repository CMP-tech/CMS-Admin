import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Card,
  CardContent,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  Paper,
  Stack,
  Container,
  Alert,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import {
  Save as SaveIcon,
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
// import axios from "axios";

const AddCategoryPage = () => {
  const [categoryName, setCategoryName] = useState("");
  const [slug, setSlug] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [description, setDescription] = useState("");
  const [parentCategories, setParentCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const navigate = useNavigate();

  // Auto-generate slug from category name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
  };

  // Fetch parent categories on component mount
  useEffect(() => {
    const fetchParentCategories = async () => {
      try {
        setFetchingCategories(true);
        const response = await axiosInstance.get("/categories");
        console.log("Fetched categories:", response.data);
        // Filter only published categories for parent selection
        // const publishedCategories = response.data.filter(
        //   (category) => category.status === "published"
        // );
        setParentCategories(response.data.categories || []);
      } catch (error) {
        console.error("Error fetching parent categories:", error);
        setError("Failed to fetch parent categories");
      } finally {
        setFetchingCategories(false);
      }
    };

    fetchParentCategories();
  }, []);

  // Auto-generate slug when category name changes
  useEffect(() => {
    setSlug(generateSlug(categoryName));
  }, [categoryName]);

  // Generic API call function
  const handleCategorySubmit = async (status) => {
    if (!categoryName.trim()) {
      setError("Category name is required");
      setSnackbarOpen(true);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const categoryData = {
        categoryName: categoryName.trim(),
        slug,
        parentCategory: parentCategory || null,
        description: description.trim() || "", // Ensure empty string if no description
        status,
      };

      // Get token from localStorage or wherever you store it
      const token = localStorage.getItem("token");

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axiosInstance.post(
        "/categories",
        categoryData,
        config
      );

      const successMessage =
        response.data.message ||
        `Category ${
          status === "published" ? "created and published" : "saved as draft"
        } successfully!`;

      setSuccess(successMessage);
      setSnackbarOpen(true);

      // Reset form after successful creation
      setCategoryName("");
      setSlug("");
      setParentCategory("");
      setDescription("");

      // Optionally redirect after a delay
      setTimeout(() => {
        navigate("/admin/categories");
      }, 2000);
    } catch (error) {
      console.error("Error creating category:", error);

      let errorMessage = "Failed to create category";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = "Unauthorized. Please login again.";
      } else if (error.response?.status === 403) {
        errorMessage = "You don't have permission to create categories.";
      } else if (error.response?.status === 400) {
        errorMessage =
          "Category with this slug already exists or invalid data provided.";
      }

      setError(errorMessage);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    handleCategorySubmit("draft");
  };

  const handleCreate = () => {
    handleCategorySubmit("published");
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    setError("");
    setSuccess("");
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
        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={error ? "error" : "success"}
            sx={{ width: "100%" }}
          >
            {error || success}
          </Alert>
        </Snackbar>

        {/* Back Button */}
        <Box sx={{ mb: 1 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/admin/categories")}
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
            Back to Categories
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
            Add New Category
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#64748b",
              fontSize: "1.1rem",
            }}
          >
            Create and organize your content categories
          </Typography>
        </Box>

        {/* Loading indicator for fetching categories */}
        {fetchingCategories && (
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <CircularProgress size={24} />
            <Typography sx={{ ml: 2, color: "#64748b" }}>
              Loading parent categories...
            </Typography>
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
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={4}>
              {/* Category Name */}
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
                  📂 Category Details
                </Typography>

                <TextField
                  label="Category Name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  fullWidth
                  variant="outlined"
                  placeholder="Enter category name (e.g., Web Development)"
                  required
                  disabled={loading}
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
              </Box>

              {/* Auto-generated Slug */}
              <Box>
                <TextField
                  label="Slug"
                  value={slug}
                  fullWidth
                  variant="outlined"
                  disabled
                  placeholder="Auto-generated from category name"
                  helperText="This is automatically generated from the category name and used in URLs"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "16px",
                      fontSize: "1rem",
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
              </Box>

              {/* Parent Category */}
              <Box>
                <FormControl fullWidth disabled={loading || fetchingCategories}>
                  <InputLabel sx={{ "&.Mui-focused": { color: "#3b82f6" } }}>
                    Parent Category (Optional)
                  </InputLabel>
                  <Select
                    value={parentCategory}
                    onChange={(e) => setParentCategory(e.target.value)}
                    label="Parent Category (Optional)"
                    sx={{
                      borderRadius: "16px",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#e2e8f0",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#3b82f6",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#3b82f6",
                        borderWidth: "2px",
                      },
                    }}
                  >
                    <MenuItem value="">
                      <em>None (Top Level Category)</em>
                    </MenuItem>
                    {parentCategories.map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        {category.categoryName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Description - Made clearly optional */}
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
                  label="Category Description (Optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  placeholder="Provide a brief description of what this category contains... (optional)"
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
                      loading ? <CircularProgress size={16} /> : <SaveIcon />
                    }
                    onClick={handleSave}
                    disabled={!categoryName.trim() || loading}
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
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    Save Draft
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={
                      loading ? <CircularProgress size={16} /> : <AddIcon />
                    }
                    onClick={handleCreate}
                    disabled={!categoryName.trim() || loading}
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
                    Create Category
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

export default AddCategoryPage;
