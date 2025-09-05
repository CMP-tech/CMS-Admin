// pages/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  CardContent,
  Paper,
  Stack,
  Container,
  Avatar,
  Grid,
  Alert,
  Badge,
  IconButton,
  Chip,
} from "@mui/material";
import {
  Save as SaveIcon,
  Edit as EditIcon,
  Camera as CameraIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../axiosInstance";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Load admin details from localStorage
  const storedAdmin = localStorage.getItem("adminDetails");
  const adminDetails = storedAdmin ? JSON.parse(storedAdmin) : null;

  const [profileData, setProfileData] = useState({
    name: adminDetails?.name || "",
    email: adminDetails?.email || "",
    role: adminDetails?.role || "",
    joinDate: "January 15, 2020", // dummy (replace if you have)
    lastLogin: "2 hours ago", // dummy (replace if you have)
  });

  const handleInputChange = (field) => (event) => {
    setProfileData({
      ...profileData,
      [field]: event.target.value,
    });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!profileData.name.trim()) {
      newErrors.name = "Name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem("token");

      const { data } = await axiosInstance.put(
        "/users/profile", // ✅ update to match your backend route
        { name: profileData.name, email: profileData.email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update localStorage with new details
      localStorage.setItem("adminDetails", JSON.stringify(data));

      setProfileData({
        ...profileData,
        name: data.name,
        email: data.email,
      });

      setIsEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
  };

  const handleAvatarUpload = () => {
    console.log("Upload avatar");
  };

  return (
    <Box sx={{ minHeight: "100vh" }} p={3}>
      <Container maxWidth="lg">
        {/* Back Button */}
        <Box sx={{ mb: 1 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/admin/dashboard")}
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
            Back to Dashboard
          </Button>
        </Box>

        {/* Header */}
        <Box sx={{ mb: 4 }}>
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
            My Profile
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#64748b",
              fontSize: "1.1rem",
            }}
          >
            Manage your personal information and account settings
          </Typography>
        </Box>

        {/* Success Alert */}
        {success && (
          <Alert
            severity="success"
            sx={{ mb: 3, borderRadius: "16px", fontSize: "1rem" }}
          >
            Profile updated successfully!
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Profile Card */}
          <Grid item xs={12} lg={4}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: "20px",
                border: "1px solid #e2e8f0",
                overflow: "hidden",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            >
              <CardContent sx={{ p: 4, textAlign: "center" }}>
                {/* Avatar */}
                <Box
                  sx={{ position: "relative", display: "inline-block", mb: 3 }}
                >
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    badgeContent={
                      <IconButton
                        onClick={handleAvatarUpload}
                        sx={{
                          bgcolor: "primary.main",
                          color: "white",
                          width: 32,
                          height: 32,
                          "&:hover": { bgcolor: "primary.dark" },
                        }}
                      >
                        <CameraIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    }
                  >
                    <Avatar
                      sx={{
                        width: 120,
                        height: 120,
                        fontSize: "2.5rem",
                        fontWeight: 600,
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      }}
                    >
                      {profileData.name.charAt(0)}
                    </Avatar>
                  </Badge>
                </Box>

                {/* User Info */}
                <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                  {profileData.name}
                </Typography>
                <Chip
                  label={profileData.role}
                  color="primary"
                  sx={{ borderRadius: "8px", fontWeight: 600, mb: 3 }}
                />

                {/* Quick Stats */}
                <Stack spacing={2}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      justifyContent: "center",
                    }}
                  >
                    {/* <CalendarIcon color="primary" sx={{ fontSize: 20 }} /> */}
                    {/* <Typography variant="body2" color="text.secondary">
                      Joined {profileData.joinDate}
                    </Typography> */}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      justifyContent: "center",
                    }}
                  >
                    {/* <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "success.main",
                      }}
                    /> */}
                    {/* <Typography variant="body2" color="text.secondary">
                      Last active {profileData.lastLogin}
                    </Typography> */}
                  </Box>
                </Stack>
              </CardContent>
            </Paper>
          </Grid>

          {/* Profile Details */}
          <Grid item xs={12} lg={8}>
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
                {/* Header */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 4,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#374151",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    👤 Personal Information
                  </Typography>
                  {!isEditing ? (
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => setIsEditing(true)}
                      sx={{
                        borderRadius: "12px",
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <Stack direction="row" spacing={2}>
                      <Button
                        variant="outlined"
                        onClick={handleCancel}
                        sx={{
                          borderRadius: "12px",
                          textTransform: "none",
                          fontWeight: 600,
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                        sx={{
                          borderRadius: "12px",
                          textTransform: "none",
                          fontWeight: 600,
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        }}
                      >
                        Save Changes
                      </Button>
                    </Stack>
                  )}
                </Box>

                {/* Basic Info */}
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      label="Name"
                      value={profileData.name}
                      onChange={handleInputChange("name")}
                      fullWidth
                      disabled={!isEditing}
                      error={!!errors.name}
                      helperText={errors.name}
                      InputProps={{
                        startAdornment: (
                          <PersonIcon sx={{ mr: 1, color: "text.secondary" }} />
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "16px",
                          fontSize: "1rem",
                          "&:hover fieldset": {
                            borderColor: isEditing ? "#3b82f6" : "default",
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
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Email Address"
                      value={profileData.email}
                      fullWidth
                      onChange={handleInputChange("email")}
                      disabled={!isEditing}
                      // // Always disabled
                      InputProps={{
                        startAdornment: (
                          <EmailIcon sx={{ mr: 1, color: "text.secondary" }} />
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "16px",
                          fontSize: "1rem",
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
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProfilePage;
