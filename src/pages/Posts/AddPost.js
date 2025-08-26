import React, { useState, useRef } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  Card,
  CardContent,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  Chip,
  Stack,
  Paper,
  IconButton,
  InputAdornment,
  Divider,
  Container,
} from "@mui/material";
import {
  Save as SaveIcon,
  Publish as PublishIcon,
  Add as AddIcon,
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
// Use react-quill-new instead of react-quill
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";

const categories = ["Technology", "Health", "Education", "Business"];
const languages = ["English", "Hindi", "Spanish", "French"];
const accessLevels = ["Free", "Registered Users Only", "Paid Members Only"];

const AddPostPage = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState("");
  const [accessLevel, setAccessLevel] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const tagInputRef = useRef(null);

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const handleTagKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSave = () => {
    console.log("Saving draft...", {
      title,
      body,
      category,
      language,
      accessLevel,
      tags,
    });
  };

  const handlePublish = () => {
    console.log("Publishing post...", {
      title,
      body,
      category,
      language,
      accessLevel,
      tags,
    });
  };

  // Enhanced Quill configuration for better performance
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      ["link", "image"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "blockquote",
    "code-block",
    "link",
    "image",
  ];
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        // bgcolor: "#f8fafc",
      }}
      p={3}
    >
      <Box>
        {/* Back Button */}
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/admin/categories")}
            sx={{
              textTransform: "none",
              fontSize: "0.95rem",
              fontWeight: 500,
              px: 0,
              "&:hover": {
                bgcolor: "transparent",
                color: "#3b82f6",
              },
            }}
          >
            Back to Posts
          </Button>
        </Box>

        {/* Modern Header */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              // color: "#1a202c",
              mb: 1,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Create New Post
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#64748b",
              fontSize: "1.1rem",
            }}
          >
            Share your thoughts and ideas with the community
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: 3,
            alignItems: "flex-start",
          }}
        >
          {/* Main Content Panel */}
          <Box
            sx={{
              flex: { xs: "1 1 100%", lg: "1 1 65%" },
              minWidth: 0, // Important for flex items
            }}
          >
            <Paper
              elevation={0}
              sx={{
                borderRadius: "20px",
                border: "1px solid #e2e8f0",
                overflow: "hidden",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                {/* Modern Title Input */}
                <TextField
                  label="Post Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  fullWidth
                  variant="outlined"
                  placeholder="Enter an engaging title for your post"
                  sx={{
                    mb: 4,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "16px",
                      fontSize: "1.2rem",
                      fontWeight: 500,
                      "&:hover fieldset": {
                        borderColor: "#3b82f6",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#3b82f6",
                        borderWidth: "2px",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#3b82f6",
                    },
                  }}
                />

                {/* Modern Body Editor */}
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      fontWeight: 600,
                      color: "#374151",
                    }}
                  >
                    Content
                  </Typography>
                  <Box
                    sx={{
                      borderRadius: "16px",
                      overflow: "hidden",
                      border: "1px solid #e2e8f0",
                      "&:hover": {
                        borderColor: "#3b82f6",
                      },
                      "&:focus-within": {
                        borderColor: "#3b82f6",
                        borderWidth: "2px",
                      },
                    }}
                  >
                    <ReactQuill
                      theme="snow"
                      value={body}
                      onChange={setBody}
                      modules={quillModules}
                      formats={quillFormats}
                      style={{
                        height: "320px",
                        marginBottom: "50px",
                      }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Paper>
          </Box>

          {/* Sidebar Panel */}
          <Box
            sx={{
              flex: { xs: "1 1 100%", lg: "1 1 35%" },
              minWidth: { xs: "100%", lg: "300px" },
              maxWidth: { xs: "100%", lg: "400px" },
            }}
          >
            <Stack spacing={3}>
              {/* Publishing Options Card */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: "20px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 3,
                      fontWeight: 600,
                      color: "#1a202c",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    📝 Publishing Options
                  </Typography>

                  {/* Language */}
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel sx={{ "&.Mui-focused": { color: "#3b82f6" } }}>
                      Language
                    </InputLabel>
                    <Select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      label="Language"
                      sx={{
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
                      {languages.map((lang) => (
                        <MenuItem key={lang} value={lang}>
                          {lang}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Category */}
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel sx={{ "&.Mui-focused": { color: "#3b82f6" } }}>
                      Category
                    </InputLabel>
                    <Select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      label="Category"
                      sx={{
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
                      {categories.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          {cat}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Access Level */}
                  <FormControl fullWidth>
                    <InputLabel sx={{ "&.Mui-focused": { color: "#3b82f6" } }}>
                      Access Level
                    </InputLabel>
                    <Select
                      value={accessLevel}
                      onChange={(e) => setAccessLevel(e.target.value)}
                      label="Access Level"
                      sx={{
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
                      {accessLevels.map((level) => (
                        <MenuItem key={level} value={level}>
                          {level}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </CardContent>
              </Paper>

              {/* Modern Tags Card */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: "20px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 3,
                      fontWeight: 600,
                      color: "#1a202c",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    🏷️ Tags
                  </Typography>

                  {/* Tag Input with Modern Design */}
                  <TextField
                    ref={tagInputRef}
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleTagKeyPress}
                    placeholder="Type a tag and press Enter"
                    fullWidth
                    size="small"
                    sx={{
                      mb: 2,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        "&:hover fieldset": {
                          borderColor: "#3b82f6",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#3b82f6",
                        },
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleAddTag}
                            disabled={!tagInput.trim()}
                            size="small"
                            sx={{
                              bgcolor: "#3b82f6",
                              color: "white",
                              width: 28,
                              height: 28,
                              "&:hover": {
                                bgcolor: "#2563eb",
                              },
                              "&:disabled": {
                                bgcolor: "#e5e7eb",
                                color: "#9ca3af",
                              },
                            }}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  {/* Modern Tags Display */}
                  {tags.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 0.75,
                          alignItems: "flex-start",
                          width: "100%",
                          maxWidth: "100%",
                          overflow: "hidden", // Prevent overflow
                        }}
                      >
                        {tags.map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            onDelete={() => handleRemoveTag(tag)}
                            deleteIcon={<CloseIcon />}
                            size="small"
                            sx={{
                              bgcolor: "#eff6ff",
                              color: "#1d4ed8",
                              borderRadius: "8px",
                              fontWeight: 500,
                              minWidth: 0, // Allow chips to shrink
                              maxWidth: "calc(100% - 8px)", // Ensure it fits within container
                              flex: "0 0 auto", // Don't grow, don't shrink basis content
                              "& .MuiChip-label": {
                                fontSize: "0.7rem",
                                padding: "0 6px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: "90px", // Smaller max width for better fit
                                lineHeight: 1.2,
                              },
                              "& .MuiChip-deleteIcon": {
                                color: "#1d4ed8",
                                fontSize: "14px",
                                margin: "0 2px 0 -2px", // Tighter spacing
                                "&:hover": {
                                  color: "#1e40af",
                                },
                              },
                              "&:hover": {
                                bgcolor: "#dbeafe",
                              },
                              // Responsive adjustments
                              "@media (max-width: 600px)": {
                                "& .MuiChip-label": {
                                  maxWidth: "70px",
                                  fontSize: "0.65rem",
                                },
                              },
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  <Typography
                    variant="caption"
                    sx={{
                      color: "#64748b",
                      fontSize: "0.75rem",
                    }}
                  >
                    💡 Press Enter or click + to add custom tags
                  </Typography>
                </CardContent>
              </Paper>

              {/* Modern Action Buttons */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: "20px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <Button
                      variant="outlined"
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      fullWidth
                      sx={{
                        borderRadius: "12px",
                        py: 1.5,
                        borderColor: "#d1d5db",
                        color: "#374151",
                        fontWeight: 600,
                        textTransform: "none",
                        fontSize: "1rem",
                        "&:hover": {
                          borderColor: "#9ca3af",
                          bgcolor: "#f9fafb",
                          transform: "translateY(-1px)",
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      Save Draft
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<PublishIcon />}
                      onClick={handlePublish}
                      fullWidth
                      sx={{
                        borderRadius: "12px",
                        py: 1.5,
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        fontWeight: 600,
                        textTransform: "none",
                        fontSize: "1rem",
                        boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 25px rgba(102, 126, 234, 0.6)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      Publish Post
                    </Button>
                  </Stack>
                </CardContent>
              </Paper>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AddPostPage;
