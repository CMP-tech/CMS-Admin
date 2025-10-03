import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  Link,
  CircularProgress,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axiosInstance from "../../axiosInstance";
import { toast } from "react-toastify";
import { Today } from "@mui/icons-material";
// your pre-configured axios

const UploadMedia = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]); // to show uploaded files if needed
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const maxSize = 8 * 1024 * 1024; // 8MB
    const validFiles = files.filter((file) => file.size <= maxSize);
    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  const handleSelectFilesClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    setUploading(true);

    try {
      for (const file of selectedFiles) {
        let type = "image";
        if (file.type.startsWith("video")) type = "video";
        else if (file.type.startsWith("audio")) type = "audio";

        if (type === "image") {
          // ✅ Send image to backend to handle Cloudinary upload
          const formData = new FormData();
          formData.append("file", file);
          formData.append("title", file.name);
          formData.append("type", type);

          const res = await axiosInstance.post("/media/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          setUploadedFiles((prev) => [...prev, res.data.data]);
        } else {
          // ✅ Upload video/audio directly from frontend
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "frontend_media");

          const cloudinaryRes = await fetch(
            "https://api.cloudinary.com/v1_1/doo2c7vmz/auto/upload",
            { method: "POST", body: formData }
          );
          const data = await cloudinaryRes.json();

          // ✅ Send metadata to backend to save in DB
          const saveRes = await axiosInstance.post("/media/upload", {
            title: file.name,
            type,
            url: data.secure_url,
            public_id: data.public_id,
          });

          setUploadedFiles((prev) => [...prev, saveRes.data.data]);
        }
      }

      toast.success("Files uploaded successfully!");
      setSelectedFiles([]);
    } catch (error) {
      console.error("Upload failed:", error.response?.data || error.message);
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight={600}>
          Upload New Media
        </Typography>
        <IconButton size="small">
          <HelpOutlineIcon />
        </IconButton>
      </Box>

      {/* Drop Zone */}
      <Paper
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          border: "2px dashed #ccc",
          borderRadius: 2,
          p: 8,
          textAlign: "center",
          bgcolor: isDragging ? "#f0f7ff" : "#fff",
          borderColor: isDragging ? "#1976d2" : "#ccc",
          transition: "all 0.3s ease",
          minHeight: "400px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
        onClick={handleSelectFilesClick}
      >
        <CloudUploadIcon
          sx={{
            fontSize: 64,
            color: "#999",
            mb: 2,
          }}
        />

        <Typography variant="h6" sx={{ mb: 2, color: "#666", fontWeight: 400 }}>
          Drop files to upload
        </Typography>

        <Typography variant="body2" sx={{ mb: 2, color: "#999" }}>
          or
        </Typography>

        <Button
          variant="outlined"
          onClick={(e) => {
            e.stopPropagation();
            handleSelectFilesClick();
          }}
          sx={{
            textTransform: "none",
            borderRadius: 1,
            px: 3,
          }}
        >
          Select Files
        </Button>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,audio/*"
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />
      </Paper>

      {/* Info */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          You are using the multi-file uploader. Problems? Try the{" "}
          <Link href="#" underline="always" sx={{ cursor: "pointer" }}>
            browser uploader
          </Link>{" "}
          instead.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Maximum upload file size: 8 MB.
        </Typography>
      </Box>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Selected Files ({selectedFiles.length})
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {selectedFiles.map((file, index) => (
              <Paper
                key={index}
                sx={{
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    {file.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                </Box>
                <Button
                  size="small"
                  color="error"
                  onClick={() =>
                    setSelectedFiles((prev) =>
                      prev.filter((_, i) => i !== index)
                    )
                  }
                >
                  Remove
                </Button>
              </Paper>
            ))}
          </Box>

          {/* Upload Button */}
          <Box sx={{ mt: 2, textAlign: "right" }}>
            <Button
              variant="contained"
              disabled={uploading}
              onClick={handleUpload}
            >
              {uploading ? <CircularProgress size={20} /> : "Upload"}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default UploadMedia;
