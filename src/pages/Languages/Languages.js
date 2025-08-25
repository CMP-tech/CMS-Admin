// pages/LanguagesPage.jsx
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
import { Add, Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const LanguagesPage = () => {
  const [search, setSearch] = useState("");

  // Sample languages data
  const languages = [
    {
      id: 1,
      language: "English",
      slug: "en",
    },
    {
      id: 2,
      language: "Spanish",
      slug: "es",
    },
    {
      id: 3,
      language: "French",
      slug: "fr",
    },
    {
      id: 4,
      language: "German",
      slug: "de",
    },
    {
      id: 5,
      language: "Italian",
      slug: "it",
    },
    {
      id: 6,
      language: "Portuguese",
      slug: "pt",
    },
    {
      id: 7,
      language: "Chinese",
      slug: "zh",
    },
    {
      id: 8,
      language: "Japanese",
      slug: "ja",
    },
    {
      id: 9,
      language: "Korean",
      slug: "ko",
    },
    {
      id: 10,
      language: "Hindi",
      slug: "hi",
    },
  ];

  const navigate = useNavigate();

  // Filter languages based on search
  const filteredLanguages = languages.filter(
    (language) =>
      language.language.toLowerCase().includes(search.toLowerCase()) ||
      language.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (id) => {
    navigate(`/admin/languages/edit/${id}`);
  };

  const handleDelete = (id) => {
    // Add delete confirmation logic here
    console.log("Delete language with id:", id);
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
          Languages
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/admin/language/add")}
          startIcon={<Add />}
          sx={{ bgcolor: "primary.main", borderRadius: 2 }}
        >
          Add Language
        </Button>
      </Box>

      {/* Search Filter */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Search Languages"
                placeholder="Search by language name or slug..."
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
              <TableCell sx={{ color: "white" }}>Language</TableCell>
              <TableCell sx={{ color: "white" }}>Slug</TableCell>
              <TableCell sx={{ color: "white" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLanguages.map((language) => (
              <TableRow key={language.id}>
                <TableCell>{language.id}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {language.language}
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
                    {language.slug}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton
                      color="secondary"
                      onClick={() => handleEdit(language.id)}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(language.id)}
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
      {filteredLanguages.length === 0 && (
        <Box display="flex" justifyContent="center" alignItems="center" py={4}>
          <Typography variant="body1" color="text.secondary">
            No languages found matching your search criteria.
          </Typography>
        </Box>
      )}

      {/* Pagination */}
      <Box mt={3} display="flex" justifyContent="center">
        <Pagination count={2} color="primary" />
      </Box>
    </Box>
  );
};

export default LanguagesPage;
