import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  CardContent,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  InputLabel,
  FormControl,
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
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import axiosInstance from "../../axiosInstance";

const PostsPage = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState("");
  const [accessLevel, setAccessLevel] = useState("");
  const [date, setDate] = useState("");
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Confirmation state
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const accessLevels = [
    { value: "free", label: "Free" },
    { value: "registered", label: "Registered Users Only" },
    { value: "paid", label: "Paid Members Only" },
  ];

  const navigate = useNavigate();

  // 🎨 Color coding for Access Levels
  const getAccessLevelColor = (level) => {
    switch (level) {
      case "free":
        return { bgcolor: "#dcfce7", color: "#166534", borderColor: "#bbf7d0" };
      case "registered":
        return { bgcolor: "#fef3c7", color: "#92400e", borderColor: "#fde68a" };
      case "paid":
        return { bgcolor: "#fce7f3", color: "#be185d", borderColor: "#fbcfe8" };
      default:
        return { bgcolor: "#f3f4f6", color: "#374151", borderColor: "#d1d5db" };
    }
  };

  // 🎨 Color coding for Post Status
  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return { bgcolor: "#dcfce7", color: "#166534" };
      case "draft":
        return { bgcolor: "#f3f4f6", color: "#6b7280" };
      default:
        return { bgcolor: "#f3f4f6", color: "#374151" };
    }
  };

  // ✅ Fetch posts
  const fetchPosts = async (pageNum = 1) => {
    try {
      const res = await axiosInstance.get("/posts", {
        params: {
          search,
          category,
          language,
          accessLevel,
          date,
          page: pageNum,
          limit: 10,
        },
      });

      if (res.data.success) {
        setPosts(res.data.data);
        setTotalPages(res.data.pagination.totalPages);
      } else {
        toast.error("Failed to fetch posts");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Error fetching posts");
    }
  };

  // ✅ Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/categories", {
        params: { limit: 100 },
      });
      setCategories(response.data.categories || response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // ✅ Fetch languages
  const fetchLanguages = async () => {
    try {
      const response = await axiosInstance.get("/languages", {
        params: { limit: 100 },
      });
      setLanguages(response.data.data || response.data);
    } catch (error) {
      console.error("Error fetching languages:", error);
    }
  };

  // ✅ Delete Post
  const handleDelete = async () => {
    if (!selectedPost) return;
    try {
      await axiosInstance.delete(`/posts/${selectedPost._id}`);
      toast.success("Post deleted successfully");
      fetchPosts(page);
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Error deleting post");
    } finally {
      setOpenConfirm(false);
      setSelectedPost(null);
    }
  };

  // Load posts, categories, and languages
  useEffect(() => {
    fetchPosts(page);
  }, [search, category, language, accessLevel, date, page]);

  useEffect(() => {
    fetchCategories();
    fetchLanguages();
  }, []);

  return (
    <Box sx={{ p: 3, minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={2}
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
              Posts Management
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#64748b", fontSize: "1.1rem" }}
            >
              Manage and organize your content posts
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => navigate("/admin/posts/add")}
            startIcon={<Add />}
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
            Add New Post
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Paper
        elevation={0}
        sx={{ borderRadius: "20px", border: "1px solid #e2e8f0", mb: 3 }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 1 }}>
            <FilterIcon sx={{ color: "#3b82f6" }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#1a202c" }}>
              Filters
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {/* Search */}
            <Grid item xs={12} sm={6} md={2.4}>
              <TextField
                fullWidth
                label="Search Posts"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ minWidth: "200px" }}
              />
            </Grid>

            {/* Category */}
            <Grid item xs={12} sm={6} md={2.4}>
              <FormControl fullWidth sx={{ minWidth: "200px" }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat._id || cat.id} value={cat._id || cat.id}>
                      {cat.name || cat.categoryName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Language */}
            <Grid item xs={12} sm={6} md={2.4}>
              <FormControl fullWidth sx={{ minWidth: "200px" }}>
                <InputLabel>Language</InputLabel>
                <Select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <MenuItem value="">All Languages</MenuItem>
                  {languages.map((lang) => (
                    <MenuItem
                      key={lang._id || lang.id}
                      value={lang._id || lang.id}
                    >
                      {lang.language}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Access Level */}
            <Grid item xs={12} sm={6} md={2.4}>
              <FormControl fullWidth sx={{ minWidth: "200px" }}>
                <InputLabel>Access Level</InputLabel>
                <Select
                  value={accessLevel}
                  onChange={(e) => setAccessLevel(e.target.value)}
                >
                  <MenuItem value="">All Access Levels</MenuItem>
                  {accessLevels.map((level) => (
                    <MenuItem key={level.value} value={level.value}>
                      {level.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Date */}
            <Grid item xs={12} sm={6} md={2.4}>
              <TextField
                fullWidth
                type="date"
                label="Filter by Date"
                InputLabelProps={{ shrink: true }}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                sx={{ minWidth: "200px" }}
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
                {[
                  "ID",
                  "Title",
                  "Category",
                  "Language",
                  "Access Level",
                  "Status",
                  "Date",
                  "Actions",
                ].map((header) => (
                  <TableCell
                    key={header}
                    sx={{ color: "white", fontWeight: 600 }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.map((post, index) => (
                <TableRow key={post._id || post.id}>
                  <TableCell>#{index + 1}</TableCell>
                  <TableCell>{post.title}</TableCell>
                  <TableCell>
                    <Chip
                      label={post.category?.name || post.category}
                      size="small"
                      sx={{ bgcolor: "#eff6ff", color: "#1d4ed8" }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={post.language?.language || post.language}
                      size="small"
                      sx={{ bgcolor: "#f0f9ff", color: "#0369a1" }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        accessLevels.find(
                          (lvl) => lvl.value === post.accessLevel
                        )?.label || post.accessLevel
                      }
                      size="small"
                      sx={getAccessLevelColor(post.accessLevel)}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={post.status}
                      size="small"
                      sx={getStatusColor(post.status)}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(post.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5}>
                      <Tooltip title="Edit Post">
                        <IconButton
                          size="small"
                          sx={{ color: "#f59e0b" }}
                          onClick={() =>
                            navigate(`/admin/posts/edit/${post._id}`)
                          }
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Post">
                        <IconButton
                          size="small"
                          sx={{ color: "#ef4444" }}
                          onClick={() => {
                            setSelectedPost(post);
                            setOpenConfirm(true);
                          }}
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
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the post{" "}
          <strong>{selectedPost?.title}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PostsPage;
