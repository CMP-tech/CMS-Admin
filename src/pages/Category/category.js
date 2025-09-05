// pages/CategoriesPage.jsx
import React, { useState, useEffect } from "react";
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
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Add, Edit, Delete, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import { toast } from "react-toastify";
// import axiosInstance from "../utils/axiosInstance"; // 👈 use your axios instance

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const navigate = useNavigate();

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/categories", {
        params: { page, limit: 5, search },
      });
      setCategories(res.data.categories);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.error("Error fetching categories:", err.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page, search]);

  const handleView = (id) => {
    navigate(`/admin/categories/view/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/admin/categories/edit/${id}`);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(`/categories/${deleteId}`);
      toast.success("Category deleted successfully");
      setCategories((prev) => prev.filter((cat) => cat._id !== deleteId));
    } catch (err) {
      console.error("Delete failed:", err.message);
    } finally {
      setOpenDialog(false);
      setDeleteId(null);
    }
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

      {/* Search */}
      <Paper
        elevation={0}
        sx={{ borderRadius: "20px", border: "1px solid #e2e8f0", mb: 3 }}
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
              />
            </Grid>
          </Grid>
        </CardContent>
      </Paper>

      {/* Table */}
      <Paper
        elevation={0}
        sx={{ borderRadius: "20px", border: "1px solid #e2e8f0" }}
      >
        <TableContainer>
          <Table>
            <TableHead
              sx={{
                background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
              }}
            >
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>
                  ID
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>
                  Category Name
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>
                  Description
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>
                  Slug
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>
                  Status
                </TableCell>
                <TableCell
                  sx={{ color: "white", fontWeight: 600, textAlign: "center" }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories?.map((category, index) => (
                <TableRow key={category._id}>
                  <TableCell>#{index + 1}</TableCell>
                  <TableCell>{category.categoryName}</TableCell>
                  <TableCell>{category.description}</TableCell>
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
                      }}
                    >
                      {category.slug}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        category.status === "published" ? "Public" : "Draft"
                      }
                      color={
                        category.status === "published" ? "success" : "warning"
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Stack
                      direction="row"
                      spacing={0.5}
                      justifyContent="center"
                    >
                      {/* <Tooltip title="View">
                        <IconButton
                          sx={{ color: "#3b82f6" }}
                          onClick={() => handleView(category._id)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip> */}
                      <Tooltip title="Edit">
                        <IconButton
                          sx={{ color: "#f59e0b" }}
                          onClick={() => handleEdit(category._id)}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          sx={{ color: "#ef4444" }}
                          onClick={() => handleDeleteClick(category._id)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
          />
        </Box>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this category?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoriesPage;
