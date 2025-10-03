import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  Paper,
  Checkbox,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import SearchIcon from "@mui/icons-material/Search";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../axiosInstance";
// use your axiosInstance

const MediaLibrary = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("grid");
  const [mediaType, setMediaType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch media from backend
  const loadMedia = async () => {
    setLoading(true);
    try {
      const params = {};
      if (mediaType !== "all") params.type = mediaType.slice(0, -1); // "images" -> "image"
      if (searchQuery) params.search = searchQuery;

      const { data } = await axiosInstance.get("/media", { params });
      setMediaItems(data.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch media"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, [mediaType, searchQuery]);

  // Handle single selection
  const handleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Bulk select/unselect
  const handleBulkSelect = () => {
    if (selectedItems.length === mediaItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(mediaItems.map((item) => item._id));
    }
  };

  // Delete single media
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this media?")) return;
    try {
      await axiosInstance.delete(`/media/${id}`);
      toast.success("Media deleted successfully");
      loadMedia();
      setSelectedItems((prev) => prev.filter((item) => item !== id));
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete media"
      );
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    if (!window.confirm("Are you sure you want to delete selected media?"))
      return;
    try {
      await axiosInstance.post("/media/bulk-delete", { ids: selectedItems });
      toast.success("Selected media deleted successfully");
      loadMedia();
      setSelectedItems([]);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete media"
      );
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>
          Media Library
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Button
            variant="contained"
            onClick={() => navigate("/admin/media/add")}
          >
            Add Media File
          </Button>
          <IconButton size="small">
            <HelpOutlineIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Filters & Search */}
      <Paper sx={{ p: 2, mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Box
          sx={{ display: "flex", border: "1px solid #e0e0e0", borderRadius: 1 }}
        >
          <IconButton
            onClick={() => setViewMode("list")}
            sx={{ bgcolor: viewMode === "list" ? "#f5f5f5" : "transparent" }}
          >
            <ViewListIcon />
          </IconButton>
          <IconButton
            onClick={() => setViewMode("grid")}
            sx={{ bgcolor: viewMode === "grid" ? "#f5f5f5" : "transparent" }}
          >
            <ViewModuleIcon />
          </IconButton>
        </Box>

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <Select
            value={mediaType}
            onChange={(e) => setMediaType(e.target.value)}
          >
            <MenuItem value="all">All media items</MenuItem>
            <MenuItem value="images">Images</MenuItem>
            <MenuItem value="videos">Videos</MenuItem>
            <MenuItem value="audio">Audio</MenuItem>
          </Select>
        </FormControl>

        <TextField
          placeholder="Search media"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ ml: "auto", minWidth: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {selectedItems.length > 0 && (
          <Button variant="contained" color="error" onClick={handleBulkDelete}>
            Delete Selected ({selectedItems.length})
          </Button>
        )}
      </Paper>

      {/* Loading */}
      {loading && <CircularProgress />}

      {/* Media Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2,1fr)",
            sm: "repeat(3,1fr)",
            md: "repeat(4,1fr)",
          },
          gap: 2,
        }}
      >
        {mediaItems.map((item) => (
          <Paper
            key={item._id}
            sx={{
              position: "relative",
              paddingTop: "100%",
              cursor: "pointer",
              overflow: "hidden",
              borderRadius: 1,
              border: selectedItems.includes(item._id)
                ? "3px solid #1976d2"
                : "1px solid #e0e0e0",
              "&:hover": { boxShadow: 3 },
            }}
            onClick={() => handleSelectItem(item._id)}
          >
            <Box
              component="img"
              src={item.url}
              alt={item.title}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <Checkbox
              checked={selectedItems.includes(item._id)}
              sx={{ position: "absolute", top: 8, right: 8 }}
            />
            <Button
              size="small"
              sx={{ position: "absolute", bottom: 8, right: 8 }}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(item._id);
              }}
            >
              Delete
            </Button>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default MediaLibrary;
