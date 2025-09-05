// pages/LanguagesPage.jsx
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
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../axiosInstance";
// import axiosInstance from "../utils/axiosInstance";

const LanguagesPage = () => {
  const [search, setSearch] = useState("");
  const [languages, setLanguages] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const navigate = useNavigate();

  // Fetch Languages
  const fetchLanguages = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/languages", {
        params: { page, limit: 5, search },
      });

      setLanguages(res.data.data);
      setPages(res.data.pages);
    } catch (error) {
      toast.error("Error fetching languages");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, [page, search]);

  const handleEdit = (id) => {
    navigate(`/admin/languages/edit/${id}`);
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setOpenConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(`/languages/${selectedId}`);
      toast.success("Language deleted successfully");
      fetchLanguages();
    } catch (error) {
      toast.error("Failed to delete language");
      console.error(error);
    } finally {
      setOpenConfirm(false);
      setSelectedId(null);
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
      <Paper elevation={0} sx={{ borderRadius: "20px", mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Search Languages"
                placeholder="Search by name or slug..."
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Paper>

      {/* Table */}
      <Paper elevation={0} sx={{ borderRadius: "20px", overflow: "hidden" }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={5}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead sx={{ background: "#111827" }}>
                  <TableRow>
                    <TableCell sx={{ color: "white" }}>ID</TableCell>
                    <TableCell sx={{ color: "white" }}>Language</TableCell>
                    <TableCell sx={{ color: "white" }}>Slug</TableCell>
                    <TableCell sx={{ color: "white" }}>Status</TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {languages.map((language, index) => (
                    <TableRow key={language._id}>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        {language._id}
                      </TableCell>
                      <TableCell>{language.language}</TableCell>
                      <TableCell>
                        {" "}
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
                          {language.slug}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={language.isDraft ? "Draft" : "Published"}
                          color={language.isDraft ? "warning" : "success"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="center"
                        >
                          <Tooltip title="Edit Language">
                            <IconButton
                              onClick={() => handleEdit(language._id)}
                            >
                              <Edit fontSize="small" color="warning" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Language">
                            <IconButton
                              onClick={() => handleDeleteClick(language._id)}
                            >
                              <Delete fontSize="small" color="error" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {languages.length === 0 && (
              <Box py={4} textAlign="center">
                <Typography>No languages found.</Typography>
              </Box>
            )}

            {pages > 1 && (
              <Box py={2} display="flex" justifyContent="center">
                <Pagination
                  count={pages}
                  page={page}
                  onChange={(e, v) => setPage(v)}
                />
              </Box>
            )}
          </>
        )}
      </Paper>

      {/* Delete Confirmation Modal */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this language? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LanguagesPage;
