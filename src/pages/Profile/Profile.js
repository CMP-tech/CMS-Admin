// pages/ProfilePage.jsx
import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Card,
  CardContent,
  Paper,
  Stack,
  Container,
  Avatar,
  Grid,
  Divider,
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
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  CalendarToday as CalendarIcon,
  Security as SecurityIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    firstName: "Roshan",
    lastName: "Admin",
    email: "roshan@admin.com",
    phone: "+1 (555) 123-4567",
    location: "New York, USA",
    position: "System Administrator",
    department: "IT Department",
    bio: "Experienced system administrator with over 5 years of expertise in managing content management systems, user permissions, and database optimization.",
    joinDate: "January 15, 2020",
    lastLogin: "2 hours ago",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field) => (event) => {
    setProfileData({
      ...profileData,
      [field]: event.target.value,
    });
    // Clear error for this field
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!profileData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!profileData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!profileData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = "Email is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      console.log("Saving profile...", profileData);
      setIsEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset any changes
    setErrors({});
  };

  const handleAvatarUpload = () => {
    // Handle avatar upload logic
    console.log("Upload avatar");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        // bgcolor: "#f8fafc",
      }}
      p={3}
    >
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

        {/* Modern Header */}
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
            sx={{
              mb: 3,
              borderRadius: "16px",
              fontSize: "1rem",
            }}
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
                {/* Profile Picture */}
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
                          "&:hover": {
                            bgcolor: "primary.dark",
                          },
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
                      {profileData.firstName.charAt(0)}
                      {profileData.lastName.charAt(0)}
                    </Avatar>
                  </Badge>
                </Box>

                {/* User Info */}
                <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                  {profileData.firstName} {profileData.lastName}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {profileData.position}
                </Typography>
                <Chip
                  label="Administrator"
                  color="primary"
                  sx={{
                    borderRadius: "8px",
                    fontWeight: 600,
                    mb: 3,
                  }}
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
                    <CalendarIcon color="primary" sx={{ fontSize: 20 }} />
                    <Typography variant="body2" color="text.secondary">
                      Joined {profileData.joinDate}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "success.main",
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Last active {profileData.lastLogin}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Paper>

            {/* Quick Actions */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: "20px",
                border: "1px solid #e2e8f0",
                overflow: "hidden",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                mt: 3,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Quick Actions
                </Typography>
                <Stack spacing={2}>
                  <Button
                    variant="outlined"
                    startIcon={<SecurityIcon />}
                    onClick={() => navigate("/admin/change-password")}
                    fullWidth
                    sx={{
                      borderRadius: "12px",
                      py: 1.5,
                      justifyContent: "flex-start",
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    Change Password
                  </Button>
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

                <Stack spacing={4}>
                  {/* Basic Info */}
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="First Name"
                        value={profileData.firstName}
                        onChange={handleInputChange("firstName")}
                        fullWidth
                        disabled={!isEditing}
                        error={!!errors.firstName}
                        helperText={errors.firstName}
                        InputProps={{
                          startAdornment: (
                            <PersonIcon
                              sx={{ mr: 1, color: "text.secondary" }}
                            />
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
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Last Name"
                        value={profileData.lastName}
                        onChange={handleInputChange("lastName")}
                        fullWidth
                        disabled={!isEditing}
                        error={!!errors.lastName}
                        helperText={errors.lastName}
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
                  </Grid>

                  {/* Contact Info */}
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: "#374151",
                        mb: 3,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      📧 Contact Information
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Email Address"
                          value={profileData.email}
                          onChange={handleInputChange("email")}
                          fullWidth
                          disabled={!isEditing}
                          error={!!errors.email}
                          helperText={errors.email}
                          InputProps={{
                            startAdornment: (
                              <EmailIcon
                                sx={{ mr: 1, color: "text.secondary" }}
                              />
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
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Phone Number"
                          value={profileData.phone}
                          onChange={handleInputChange("phone")}
                          fullWidth
                          disabled={!isEditing}
                          InputProps={{
                            startAdornment: (
                              <PhoneIcon
                                sx={{ mr: 1, color: "text.secondary" }}
                              />
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
                    </Grid>
                  </Box>

                  {/* Work Info */}
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: "#374151",
                        mb: 3,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      💼 Work Information
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Position"
                          value={profileData.position}
                          onChange={handleInputChange("position")}
                          fullWidth
                          disabled={!isEditing}
                          InputProps={{
                            startAdornment: (
                              <WorkIcon
                                sx={{ mr: 1, color: "text.secondary" }}
                              />
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
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Department"
                          value={profileData.department}
                          onChange={handleInputChange("department")}
                          fullWidth
                          disabled={!isEditing}
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
                          label="Location"
                          value={profileData.location}
                          onChange={handleInputChange("location")}
                          fullWidth
                          disabled={!isEditing}
                          InputProps={{
                            startAdornment: (
                              <LocationIcon
                                sx={{ mr: 1, color: "text.secondary" }}
                              />
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
                    </Grid>
                  </Box>

                  {/* Bio */}
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: "#374151",
                        mb: 3,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      📝 Bio
                    </Typography>
                    <TextField
                      label="About Me"
                      value={profileData.bio}
                      onChange={handleInputChange("bio")}
                      fullWidth
                      multiline
                      rows={4}
                      disabled={!isEditing}
                      placeholder="Tell us about yourself..."
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
                  </Box>
                </Stack>
              </CardContent>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProfilePage;
