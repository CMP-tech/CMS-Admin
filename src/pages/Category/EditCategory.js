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
  Skeleton,
} from "@mui/material";
import {
  Save as SaveIcon,
  Publish as PublishIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../axiosInstance";

const EditCategoryPage = () => {
  const [categoryName, setCategoryName] = useState("");
  const [slug, setSlug] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [description, setDescription] = useState("");
  const [currentStatus, setCurrentStatus] = useState("draft");
  const [parentCategories, setParentCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [fetchingCategories, setFetchingCategories] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [categoryNotFound, setCategoryNotFound] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams(); // Get category ID from URL params

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

  // Fetch current category data
  useEffect(() => {
    const fetchCategoryData = async () => {
      if (!id) {
        setError("Category ID is required");
        setSnackbarOpen(true);
        return;
      }

      try {
        setFetchingData(true);
        const token = localStorage.getItem("token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axiosInstance.get(`/categories/${id}`, config);
        const category = response.data;

        setCategoryName(category.categoryName);
        setSlug(category.slug);
        setParentCategory(category.parentCategory?._id || "");
        setDescription(category.description || "");
        setCurrentStatus(category.status);
      } catch (error) {
        console.error("Error fetching category:", error);

        if (error.response?.status === 404) {
          setCategoryNotFound(true);
          setError("Category not found");
        } else if (error.response?.status === 401) {
          setError("Unauthorized. Please login again.");
        } else {
          setError("Failed to fetch category data");
        }
        setSnackbarOpen(true);
      } finally {
        setFetchingData(false);
      }
    };

    fetchCategoryData();
  }, [id]);

  // Fetch parent categories
  useEffect(() => {
    const fetchParentCategories = async () => {
      try {
        setFetchingCategories(true);
        const response = await axiosInstance.get("/categories");
        // Filter out current category and only show published categories
        // const availableParents = response.data.filter(
        //   (category) => category._id !== id && category.status === "published"
        // );
        setParentCategories(response.data.categories || []);
      } catch (error) {
        console.error("Error fetching parent categories:", error);
        setError("Failed to fetch parent categories");
        setSnackbarOpen(true);
      } finally {
        setFetchingCategories(false);
      }
    };

    if (!fetchingData) {
      fetchParentCategories();
    }
  }, [id, fetchingData]);

  // Auto-generate slug when category name changes
  useEffect(() => {
    if (categoryName) {
      setSlug(generateSlug(categoryName));
    }
  }, [categoryName]);

  // Generic API call function for updating
  const handleCategoryUpdate = async (status) => {
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
        description: description.trim(),
        status,
      };

      const token = localStorage.getItem("token");

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axiosInstance.put(
        `/categories/${id}`,
        categoryData,
        config
      );

      const successMessage =
        response.data.message ||
        `Category ${
          status === "published" ? "published" : "updated as draft"
        } successfully!`;

      setSuccess(successMessage);
      setCurrentStatus(status);
      setSnackbarOpen(true);

      // Optionally redirect after a delay
      setTimeout(() => {
        navigate("/admin/categories");
      }, 2000);
    } catch (error) {
      console.error("Error updating category:", error);

      let errorMessage = "Failed to update category";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = "Unauthorized. Please login again.";
      } else if (error.response?.status === 403) {
        errorMessage = "You don't have permission to update categories.";
      } else if (error.response?.status === 400) {
        errorMessage =
          "Category with this slug already exists or invalid data provided.";
      } else if (error.response?.status === 404) {
        errorMessage = "Category not found.";
      }

      setError(errorMessage);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    handleCategoryUpdate("draft");
  };

  const handlePublish = () => {
    handleCategoryUpdate("published");
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    setError("");
    setSuccess("");
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <Stack spacing={4}>
      <Box>
        <Skeleton variant="text" width="200px" height={32} sx={{ mb: 2 }} />
        <Skeleton
          variant="rectangular"
          height={56}
          sx={{ borderRadius: "16px" }}
        />
      </Box>
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
      <Box>
        <Skeleton variant="text" width="150px" height={32} sx={{ mb: 2 }} />
        <Skeleton
          variant="rectangular"
          height={120}
          sx={{ borderRadius: "16px" }}
        />
      </Box>
    </Stack>
  );

  // Show error page if category not found
  if (categoryNotFound) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        p={3}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{
              borderRadius: "20px",
              border: "1px solid #e2e8f0",
              p: 4,
              textAlign: "center",
            }}
          >
            <Typography variant="h4" sx={{ mb: 2, color: "#ef4444" }}>
              Category Not Found
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: "#64748b" }}>
              The category you're looking for doesn't exist or may have been
              deleted.
            </Typography>
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/admin/categories")}
              sx={{
                borderRadius: "12px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              Back to Categories
            </Button>
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
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <EditIcon sx={{ color: "#667eea" }} />
            Edit Category
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#64748b",
              fontSize: "1.1rem",
            }}
          >
            Update category information and settings
            {currentStatus && (
              <Box
                component="span"
                sx={{
                  ml: 2,
                  px: 2,
                  py: 0.5,
                  bgcolor:
                    currentStatus === "published" ? "#dcfce7" : "#fef3c7",
                  color: currentStatus === "published" ? "#166534" : "#92400e",
                  borderRadius: "12px",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                {currentStatus}
              </Box>
            )}
          </Typography>
        </Box>

        {/* Loading indicator for fetching data */}
        {fetchingData && (
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <CircularProgress size={24} />
            <Typography sx={{ ml: 2, color: "#64748b" }}>
              Loading category data...
            </Typography>
          </Box>
        )}

        {/* Loading indicator for fetching parent categories */}
        {fetchingCategories && !fetchingData && (
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <CircularProgress size={20} />
            <Typography sx={{ ml: 2, color: "#64748b", fontSize: "0.9rem" }}>
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
            {fetchingData ? (
              <LoadingSkeleton />
            ) : (
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
                  <FormControl
                    fullWidth
                    disabled={loading || fetchingCategories}
                  >
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

                {/* Description */}
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
                    📝 Description(Optional)
                  </Typography>

                  <TextField
                    label="Category Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    placeholder="Provide a brief description of what this category contains..."
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
                        minWidth: "140px",
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
                      Save as Draft
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={
                        loading ? (
                          <CircularProgress size={16} />
                        ) : (
                          <PublishIcon />
                        )
                      }
                      onClick={handlePublish}
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
                        minWidth: "160px",
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
                      Update & Publish
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            )}
          </CardContent>
        </Paper>
      </Container>
    </Box>
  );
};

export default EditCategoryPage;
