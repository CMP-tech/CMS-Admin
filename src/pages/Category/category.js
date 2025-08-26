// pages/CategoriesPage.jsx
import React, { useState } from "react";
import {
  Box,
  Button,
  CardContent,
  Grid,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Pagination,
  Stack,
} from "@mui/material";
import { Add, Edit, Delete, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const CategoriesPage = () => {
  const [search, setSearch] = useState("");

  const categories = [
    {
      id: 1,
      name: "Technology",
      description: "Posts about latest tech trends, gadgets, and innovations",
      slug: "technology",
    },
    {
      id: 2,
      name: "Lifestyle",
      description: "Content related to daily life, health, and wellness",
      slug: "lifestyle",
    },
    {
      id: 3,
      name: "Business",
      description: "Business strategies, entrepreneurship, and market insights",
      slug: "business",
    },
    {
      id: 4,
      name: "Travel",
      description: "Travel guides, tips, and destination reviews",
      slug: "travel",
    },
    {
      id: 5,
      name: "Food & Cooking",
      description: "Recipes, cooking techniques, and food culture",
      slug: "food-cooking",
    },
  ];

  const navigate = useNavigate();

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(search.toLowerCase()) ||
      category.description.toLowerCase().includes(search.toLowerCase()) ||
      category.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleView = (id) => {
    navigate(`/admin/categories/view/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/admin/categories/edit/${id}`);
  };

  const handleDelete = (id) => {
    console.log("Delete category with id:", id);
  };

  return (
    <Box sx={{ p: 3, minHeight: "100vh" }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        mb={4}
      >
        <Box>
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
            Categories Management
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#64748b", fontSize: "1.1rem" }}
          >
            Manage and organize post categories
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate("/admin/category/add")}
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
              background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
              transform: "translateY(-2px)",
              boxShadow: "0 8px 25px rgba(102, 126, 234, 0.6)",
            },
            transition: "all 0.3s ease",
          }}
        >
          Add Category
        </Button>
      </Box>

      {/* Search Filter */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: "20px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          mb: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Search Categories"
                placeholder="Search by name, description, or slug..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    "&:hover fieldset": {
                      borderColor: "#3b82f6",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#3b82f6",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#3b82f6",
                  },
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Paper>

      {/* Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: "20px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead
              sx={{
                background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
              }}
            >
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: 600, py: 2 }}>
                  ID
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600, py: 2 }}>
                  Category Name
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600, py: 2 }}>
                  Description
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600, py: 2 }}>
                  Slug
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: 600,
                    py: 2,
                    textAlign: "center",
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCategories.map((category, index) => (
                <TableRow
                  key={category.id}
                  sx={{
                    "&:hover": { bgcolor: "#f8fafc" },
                    "&:nth-of-type(even)": { bgcolor: "#fafbfc" },
                  }}
                >
                  <TableCell sx={{ fontWeight: 500, color: "#374151" }}>
                    #{category.id.toString().padStart(3, "0")}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500, color: "#1a202c" }}>
                    {category.name}
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        maxWidth: 300,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color: "#4b5563",
                      }}
                    >
                      {category.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "monospace",
                        bgcolor: "#eff6ff",
                        px: 1,
                        py: 0.5,
                        borderRadius: "6px",
                        display: "inline-block",
                        color: "#1d4ed8",
                        fontWeight: 500,
                      }}
                    >
                      {category.slug}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack
                      direction="row"
                      spacing={0.5}
                      justifyContent="center"
                    >
                      <Tooltip title="View Category">
                        <IconButton
                          size="small"
                          sx={{
                            color: "#3b82f6",
                            bgcolor: "#eff6ff",
                            "&:hover": {
                              bgcolor: "#dbeafe",
                              transform: "scale(1.1)",
                            },
                            transition: "all 0.2s ease",
                          }}
                          onClick={() => handleView(category.id)}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Category">
                        <IconButton
                          size="small"
                          sx={{
                            color: "#f59e0b",
                            bgcolor: "#fef3c7",
                            "&:hover": {
                              bgcolor: "#fde68a",
                              transform: "scale(1.1)",
                            },
                            transition: "all 0.2s ease",
                          }}
                          onClick={() => handleEdit(category.id)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Category">
                        <IconButton
                          size="small"
                          sx={{
                            color: "#ef4444",
                            bgcolor: "#fef2f2",
                            "&:hover": {
                              bgcolor: "#fecaca",
                              transform: "scale(1.1)",
                            },
                            transition: "all 0.2s ease",
                          }}
                          onClick={() => handleDelete(category.id)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* No Results */}
        {filteredCategories.length === 0 && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            py={4}
          >
            <Typography variant="body1" color="text.secondary">
              No categories found matching your search criteria.
            </Typography>
          </Box>
        )}

        {/* Pagination */}
        <Box
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "center",
            borderTop: "1px solid #e2e8f0",
          }}
        >
          <Pagination
            count={2}
            sx={{
              "& .MuiPaginationItem-root": {
                borderRadius: "8px",
                fontWeight: 500,
                "&.Mui-selected": {
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                  },
                },
                "&:hover": { bgcolor: "#f1f5f9" },
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default CategoriesPage;
