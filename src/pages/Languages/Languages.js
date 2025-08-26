// pages/LanguagesPage.jsx
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
import { Add, Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const LanguagesPage = () => {
  const [search, setSearch] = useState("");

  const languages = [
    { id: 1, language: "English", slug: "en" },
    { id: 2, language: "Spanish", slug: "es" },
    { id: 3, language: "French", slug: "fr" },
    { id: 4, language: "German", slug: "de" },
    { id: 5, language: "Italian", slug: "it" },
    { id: 6, language: "Portuguese", slug: "pt" },
    { id: 7, language: "Chinese", slug: "zh" },
    { id: 8, language: "Japanese", slug: "ja" },
    { id: 9, language: "Korean", slug: "ko" },
    { id: 10, language: "Hindi", slug: "hi" },
  ];

  const navigate = useNavigate();

  const filteredLanguages = languages.filter(
    (language) =>
      language.language.toLowerCase().includes(search.toLowerCase()) ||
      language.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (id) => {
    navigate(`/admin/languages/edit/${id}`);
  };

  const handleDelete = (id) => {
    console.log("Delete language with id:", id);
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
            Languages Management
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#64748b", fontSize: "1.1rem" }}
          >
            Manage and organize available languages
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate("/admin/language/add")}
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
          Add Language
        </Button>
      </Box>

      {/* Search Filter Card */}
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
                label="Search Languages"
                placeholder="Search by name or slug..."
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
                  Language
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
              {filteredLanguages.map((language, index) => (
                <TableRow
                  key={language.id}
                  sx={{
                    "&:hover": { bgcolor: "#f8fafc" },
                    "&:nth-of-type(even)": { bgcolor: "#fafbfc" },
                  }}
                >
                  <TableCell sx={{ fontWeight: 500, color: "#374151" }}>
                    #{language.id.toString().padStart(3, "0")}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500, color: "#1a202c" }}>
                    {language.language}
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
                      {language.slug}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack
                      direction="row"
                      spacing={0.5}
                      justifyContent="center"
                    >
                      <Tooltip title="Edit Language">
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
                          onClick={() => handleEdit(language.id)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Language">
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
                          onClick={() => handleDelete(language.id)}
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
        {filteredLanguages.length === 0 && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            py={4}
          >
            <Typography variant="body1" color="text.secondary">
              No languages found matching your search criteria.
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

export default LanguagesPage;
