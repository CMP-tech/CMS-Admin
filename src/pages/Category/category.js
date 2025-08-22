// pages/CategoriesPage.jsx
import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
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
} from "@mui/material";
import { Add, Edit, Delete, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const CategoriesPage = () => {
  const [search, setSearch] = useState("");

  // Sample categories data
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

  // Filter categories based on search
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
    // Add delete confirmation logic here
    console.log("Delete category with id:", id);
  };

  return (
    <Box p={3}>
      {/* Header with Title + Add Button */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5" fontWeight="bold" color="primary">
          Categories
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/admin/category/add")}
          startIcon={<Add />}
          sx={{ bgcolor: "primary.main", borderRadius: 2 }}
        >
          Add Category
        </Button>
      </Box>

      {/* Search Filter */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Search Categories"
                placeholder="Search by name, description, or slug..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: "black" }}>
            <TableRow>
              <TableCell sx={{ color: "white" }}>ID</TableCell>
              <TableCell sx={{ color: "white" }}>Category Name</TableCell>
              <TableCell sx={{ color: "white" }}>Description</TableCell>
              <TableCell sx={{ color: "white" }}>Slug</TableCell>
              <TableCell sx={{ color: "white" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.id}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {category.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      maxWidth: 300,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
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
                      bgcolor: "grey.100",
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      display: "inline-block",
                    }}
                  >
                    {category.slug}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Tooltip title="View">
                    <IconButton
                      color="primary"
                      onClick={() => handleView(category.id)}
                    >
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton
                      color="secondary"
                      onClick={() => handleEdit(category.id)}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* No Results Message */}
      {filteredCategories.length === 0 && (
        <Box display="flex" justifyContent="center" alignItems="center" py={4}>
          <Typography variant="body1" color="text.secondary">
            No categories found matching your search criteria.
          </Typography>
        </Box>
      )}

      {/* Pagination */}
      <Box mt={3} display="flex" justifyContent="center">
        <Pagination count={5} color="primary" />
      </Box>
    </Box>
  );
};

export default CategoriesPage;
