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
  Chip,
  Stack,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Search as SearchIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const PostsPage = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState("");
  const [accessLevel, setAccessLevel] = useState("");
  const [date, setDate] = useState("");

  const posts = [
    {
      id: 1,
      title: "Getting Started with React Hooks",
      category: "Technology",
      language: "English",
      accessLevel: "Free",
      date: "2025-08-01",
      status: "Published",
    },
    {
      id: 2,
      title: "Modern Web Development Practices",
      category: "Technology",
      language: "English",
      accessLevel: "Registered Users Only",
      date: "2025-08-10",
      status: "Published",
    },
    {
      id: 3,
      title: "Advanced JavaScript Concepts",
      category: "Technology",
      language: "English",
      accessLevel: "Paid Members Only",
      date: "2025-08-15",
      status: "Draft",
    },
    {
      id: 4,
      title: "स्वास्थ्य और फिटनेस टिप्स",
      category: "Health",
      language: "Hindi",
      accessLevel: "Free",
      date: "2025-08-20",
      status: "Published",
    },
  ];

  const categories = ["Technology", "Health", "Education", "Business"];
  const languages = ["English", "Hindi", "Spanish", "French"];
  const accessLevels = ["Free", "Registered Users Only", "Paid Members Only"];

  const navigate = useNavigate();

  const getAccessLevelColor = (level) => {
    switch (level) {
      case "Free":
        return { bgcolor: "#dcfce7", color: "#166534", borderColor: "#bbf7d0" };
      case "Registered Users Only":
        return { bgcolor: "#fef3c7", color: "#92400e", borderColor: "#fde68a" };
      case "Paid Members Only":
        return { bgcolor: "#fce7f3", color: "#be185d", borderColor: "#fbcfe8" };
      default:
        return { bgcolor: "#f3f4f6", color: "#374151", borderColor: "#d1d5db" };
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Published":
        return { bgcolor: "#dcfce7", color: "#166534" };
      case "Draft":
        return { bgcolor: "#f3f4f6", color: "#6b7280" };
      default:
        return { bgcolor: "#f3f4f6", color: "#374151" };
    }
  };

  return (
    <Box sx={{ p: 3, minHeight: "100vh" }}>
      {/* Modern Header */}
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
              sx={{
                color: "#64748b",
                fontSize: "1.1rem",
              }}
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

      {/* Modern Filters Card */}
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 3,
              gap: 1,
            }}
          >
            <FilterIcon sx={{ color: "#3b82f6" }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#1a202c",
              }}
            >
              Filters
            </Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={2.4}>
              <TextField
                fullWidth
                label="Search Posts"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title..."
                sx={{
                  width: "100%",
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
            <Grid item xs={12} sm={6} md={2.4}>
              <FormControl fullWidth sx={{ width: "100%" }}>
                <InputLabel sx={{ "&.Mui-focused": { color: "#3b82f6" } }}>
                  Category
                </InputLabel>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  label="Category"
                  fullWidth
                  sx={{
                    width: "100%",
                    minWidth: 120,
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
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <FormControl fullWidth sx={{ width: "100%" }}>
                <InputLabel sx={{ "&.Mui-focused": { color: "#3b82f6" } }}>
                  Language
                </InputLabel>
                <Select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  label="Language"
                  fullWidth
                  sx={{
                    minWidth: 120,
                    width: "100%",
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
                  <MenuItem value="">All Languages</MenuItem>
                  {languages.map((lang) => (
                    <MenuItem key={lang} value={lang}>
                      {lang}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <FormControl fullWidth sx={{ width: "100%" }}>
                <InputLabel sx={{ "&.Mui-focused": { color: "#3b82f6" } }}>
                  Access Level
                </InputLabel>
                <Select
                  value={accessLevel}
                  onChange={(e) => setAccessLevel(e.target.value)}
                  label="Access Level"
                  fullWidth
                  sx={{
                    minWidth: 120,
                    width: "100%",
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
                  <MenuItem value="">All Access Levels</MenuItem>
                  {accessLevels.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <TextField
                fullWidth
                type="date"
                label="Filter by Date"
                InputLabelProps={{ shrink: true }}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                sx={{
                  width: "100%",
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

      {/* Modern Table */}
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
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    py: 2,
                  }}
                >
                  ID
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    py: 2,
                  }}
                >
                  Title
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    py: 2,
                  }}
                >
                  Category
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    py: 2,
                  }}
                >
                  Language
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    py: 2,
                  }}
                >
                  Access Level
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    py: 2,
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    py: 2,
                  }}
                >
                  Date
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    py: 2,
                    textAlign: "center",
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.map((post, index) => (
                <TableRow
                  key={post.id}
                  sx={{
                    "&:hover": {
                      bgcolor: "#f8fafc",
                    },
                    "&:nth-of-type(even)": {
                      bgcolor: "#fafbfc",
                    },
                  }}
                >
                  <TableCell sx={{ fontWeight: 500, color: "#374151" }}>
                    #{post.id.toString().padStart(3, "0")}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 500,
                      color: "#1a202c",
                      maxWidth: "200px",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontWeight: 500,
                      }}
                    >
                      {post.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={post.category}
                      size="small"
                      sx={{
                        bgcolor: "#eff6ff",
                        color: "#1d4ed8",
                        fontWeight: 500,
                        borderRadius: "8px",
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: "#4b5563", fontWeight: 500 }}>
                    {post.language}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={post.accessLevel}
                      size="small"
                      sx={{
                        ...getAccessLevelColor(post.accessLevel),
                        fontWeight: 500,
                        borderRadius: "8px",
                        fontSize: "0.75rem",
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={post.status}
                      size="small"
                      sx={{
                        ...getStatusColor(post.status),
                        fontWeight: 500,
                        borderRadius: "8px",
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: "#6b7280", fontWeight: 500 }}>
                    {new Date(post.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Stack
                      direction="row"
                      spacing={0.5}
                      justifyContent="center"
                    >
                      <Tooltip title="View Post">
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
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Post">
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
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Post">
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

        {/* Modern Pagination */}
        <Box
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "center",
            borderTop: "1px solid #e2e8f0",
          }}
        >
          <Pagination
            count={5}
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
                "&:hover": {
                  bgcolor: "#f1f5f9",
                },
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default PostsPage;
