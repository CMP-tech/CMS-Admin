// pages/PostsPage.jsx
import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
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
} from "@mui/material";
import { Add, Edit, Delete, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const PostsPage = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState("");
  const [date, setDate] = useState("");

  const posts = [
    {
      id: 1,
      title: "First Post",
      category: "Tech",
      language: "English",
      date: "2025-08-01",
    },
    {
      id: 2,
      title: "Second Post",
      category: "Lifestyle",
      language: "Hindi",
      date: "2025-08-10",
    },
  ];
  const navigate = useNavigate();
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
          Posts
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/admin/posts/add")}
          startIcon={<Add />}
          sx={{ bgcolor: "primary.main", borderRadius: 2 }}
        >
          Add Post
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl sx={{ minWidth: "200px" }} fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="Tech">Tech</MenuItem>
                  <MenuItem value="Lifestyle">Lifestyle</MenuItem>
                  <MenuItem value="Business">Business</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl sx={{ minWidth: "200px" }} fullWidth>
                <InputLabel>Language</InputLabel>
                <Select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  label="Language"
                >
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="Hindi">Hindi</MenuItem>
                  <MenuItem value="Spanish">Spanish</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                type="date"
                label="Date"
                InputLabelProps={{ shrink: true }}
                value={date}
                onChange={(e) => setDate(e.target.value)}
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
              <TableCell sx={{ color: "white" }}>Title</TableCell>
              <TableCell sx={{ color: "white" }}>Category</TableCell>
              <TableCell sx={{ color: "white" }}>Language</TableCell>
              <TableCell sx={{ color: "white" }}>Date</TableCell>
              <TableCell sx={{ color: "white" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>{post.id}</TableCell>
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.category}</TableCell>
                <TableCell>{post.language}</TableCell>
                <TableCell>{post.date}</TableCell>
                <TableCell>
                  <Tooltip title="View">
                    <IconButton color="primary">
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton color="secondary">
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="error">
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box mt={3} display="flex" justifyContent="center">
        <Pagination count={5} color="primary" />
      </Box>
    </Box>
  );
};

export default PostsPage;
