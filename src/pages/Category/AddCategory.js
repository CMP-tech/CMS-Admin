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
} from "@mui/material";
import {
  Save as SaveIcon,
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// Sample parent categories - you can replace with your actual data
const parentCategories = [
  { id: 1, name: "Technology", slug: "technology" },
  { id: 2, name: "Health", slug: "health" },
  { id: 3, name: "Education", slug: "education" },
  { id: 4, name: "Business", slug: "business" },
];

const AddCategoryPage = () => {
  const [categoryName, setCategoryName] = useState("");
  const [slug, setSlug] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [description, setDescription] = useState("");

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

  useEffect(() => {
    setSlug(generateSlug(categoryName));
  }, [categoryName]);

  const handleSave = () => {
    console.log("Saving category...", {
      categoryName,
      slug,
      parentCategory,
      description,
    });
  };

  const handleCreate = () => {
    console.log("Creating category...", {
      categoryName,
      slug,
      parentCategory,
      description,
    });
  };
  const navigate = useNavigate();

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
                <FormControl fullWidth>
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
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
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
                  📝 Description
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
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
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
                    Save Draft
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCreate}
                    disabled={!categoryName.trim()}
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
