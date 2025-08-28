import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  CardContent,
  RadioGroup,
  Radio,
  FormControlLabel,
  Stack,
  Paper,
  Checkbox,
  FormGroup,
  Alert,
} from "@mui/material";
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Analytics as AnalyticsIcon,
  Code as CodeIcon,
  Security as SecurityIcon,
  AdminPanelSettings as AdminIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";

const GoogleAnalyticsSettings = () => {
  const [settings, setSettings] = useState({
    gaTrackingId: "G-H6TGGVX8DF",
    trackingMethod: "ga4",
    trackingCodeLocation: "head",
    customTrackerObjects: "",
    customGaCode: "",
    customCode: "",
    displayCustomCodeBefore: false,
    enableAdminTracking: false,
    disableAdminTracking: false,
  });

  const handleInputChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    console.log("Saving Google Analytics settings...", settings);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f8fafc",
        backgroundImage: `
          radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.03) 0%, transparent 50%)
        `,
      }}
      p={3}
    >
      <Box>
        {/* Back Button */}
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            sx={{
              textTransform: "none",
              fontSize: "0.95rem",
              fontWeight: 500,
              px: 0,
              color: "#64748b",
              "&:hover": {
                bgcolor: "rgba(59, 130, 246, 0.08)",
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
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <AnalyticsIcon sx={{ fontSize: "2rem", color: "#667eea" }} />
            Google Analytics Settings
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#64748b",
              fontSize: "1.1rem",
            }}
          >
            Configure your Google Analytics tracking and advanced options
          </Typography>
        </Box>

        {/* Single Column Layout */}
        <Box sx={{ maxWidth: "800px", mx: "auto" }}>
          <Stack spacing={4}>
            {/* GA Tracking Configuration */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: "20px",
                border: "1px solid #e2e8f0",
                bgcolor: "#ffffff",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    fontWeight: 600,
                    color: "#1e293b",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <TrendingUpIcon sx={{ color: "#3b82f6" }} />
                  GA Tracking ID
                </Typography>

                <TextField
                  label="GA Tracking ID"
                  value={settings.gaTrackingId}
                  onChange={(e) =>
                    handleInputChange("gaTrackingId", e.target.value)
                  }
                  fullWidth
                  variant="outlined"
                  placeholder="Enter your Google Tracking ID"
                  helperText="Enter your Google Tracking ID. Show info"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      bgcolor: "#f8fafc",
                      "&:hover": {
                        bgcolor: "#f1f5f9",
                      },
                      "&:hover fieldset": {
                        borderColor: "#3b82f6",
                      },
                      "&.Mui-focused": {
                        bgcolor: "#ffffff",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#3b82f6",
                        borderWidth: "2px",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#3b82f6",
                    },
                    "& .MuiFormHelperText-root": {
                      color: "#3b82f6",
                      cursor: "pointer",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    },
                  }}
                />
              </CardContent>
            </Paper>

            {/* Tracking Method */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: "20px",
                border: "1px solid #e2e8f0",
                bgcolor: "#ffffff",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    fontWeight: 600,
                    color: "#1e293b",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <CodeIcon sx={{ color: "#3b82f6" }} />
                  Tracking Method
                </Typography>

                <RadioGroup
                  value={settings.trackingMethod}
                  onChange={(e) =>
                    handleInputChange("trackingMethod", e.target.value)
                  }
                >
                  <FormControlLabel
                    value="ga4"
                    control={
                      <Radio
                        sx={{
                          color: "#3b82f6",
                          "&.Mui-checked": { color: "#3b82f6" },
                        }}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          GA4 / Google Analytics 4 (default)
                        </Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="universal"
                    control={
                      <Radio
                        sx={{
                          color: "#3b82f6",
                          "&.Mui-checked": { color: "#3b82f6" },
                        }}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          Universal Analytics
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#64748b" }}>
                          (deprecated)
                        </Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="legacy"
                    control={
                      <Radio
                        sx={{
                          color: "#3b82f6",
                          "&.Mui-checked": { color: "#3b82f6" },
                        }}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          Legacy Tracking
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#64748b" }}>
                          (deprecated)
                        </Typography>
                      </Box>
                    }
                  />
                </RadioGroup>
              </CardContent>
            </Paper>

            {/* Tracking Code Location */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: "20px",
                border: "1px solid #e2e8f0",
                bgcolor: "#ffffff",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    fontWeight: 600,
                    color: "#1e293b",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <CodeIcon sx={{ color: "#3b82f6" }} />
                  Tracking Code Location
                </Typography>

                <RadioGroup
                  value={settings.trackingCodeLocation}
                  onChange={(e) =>
                    handleInputChange("trackingCodeLocation", e.target.value)
                  }
                >
                  <FormControlLabel
                    value="head"
                    control={
                      <Radio
                        sx={{
                          color: "#3b82f6",
                          "&.Mui-checked": { color: "#3b82f6" },
                        }}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          Include tracking code in page head
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#64748b" }}>
                          (via wp_head)
                        </Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="footer"
                    control={
                      <Radio
                        sx={{
                          color: "#3b82f6",
                          "&.Mui-checked": { color: "#3b82f6" },
                        }}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          Include tracking code in page footer
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#64748b" }}>
                          (via wp_footer)
                        </Typography>
                      </Box>
                    }
                  />
                </RadioGroup>

                <Alert
                  severity="info"
                  sx={{
                    mt: 3,
                    borderRadius: "12px",
                    bgcolor: "#f0f9ff",
                    border: "1px solid #bae6fd",
                    "& .MuiAlert-icon": { color: "#0ea5e9" },
                  }}
                >
                  <Typography variant="body2" sx={{ color: "#0c4a6e" }}>
                    Tip: Google recommends including the tracking code in the
                    page head, but including it in the footer can benefit page
                    performance. If in doubt, go with the head option.
                  </Typography>
                </Alert>
              </CardContent>
            </Paper>

            {/* Custom Tracker Objects */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: "20px",
                border: "1px solid #e2e8f0",
                bgcolor: "#ffffff",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    fontWeight: 600,
                    color: "#1e293b",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <CodeIcon sx={{ color: "#3b82f6" }} />
                  Custom Tracker Objects
                </Typography>

                <TextField
                  value={settings.customTrackerObjects}
                  onChange={(e) =>
                    handleInputChange("customTrackerObjects", e.target.value)
                  }
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  placeholder="// Add custom tracker objects here"
                  helperText="Optional code added to gtag('config') for GA4, or added to ga('create') for Universal Analytics."
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      bgcolor: "#f8fafc",
                      fontFamily: "monospace",
                      "&:hover": {
                        bgcolor: "#f1f5f9",
                      },
                      "&:hover fieldset": {
                        borderColor: "#3b82f6",
                      },
                      "&.Mui-focused": {
                        bgcolor: "#ffffff",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#3b82f6",
                        borderWidth: "2px",
                      },
                    },
                  }}
                />
              </CardContent>
            </Paper>

            {/* Custom GA Code */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: "20px",
                border: "1px solid #e2e8f0",
                bgcolor: "#ffffff",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    fontWeight: 600,
                    color: "#1e293b",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <CodeIcon sx={{ color: "#3b82f6" }} />
                  Custom GA Code
                </Typography>

                <TextField
                  value={settings.customGaCode}
                  onChange={(e) =>
                    handleInputChange("customGaCode", e.target.value)
                  }
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  placeholder="// Add custom GA code here"
                  helperText="Optional code added to the GA tracking snippet. This is useful for things like creating multiple trackers and user opt-out. Note: you can use %%userid%% and %%username%% to get the current user ID and login name."
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      bgcolor: "#f8fafc",
                      fontFamily: "monospace",
                      "&:hover": {
                        bgcolor: "#f1f5f9",
                      },
                      "&:hover fieldset": {
                        borderColor: "#3b82f6",
                      },
                      "&.Mui-focused": {
                        bgcolor: "#ffffff",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#3b82f6",
                        borderWidth: "2px",
                      },
                    },
                  }}
                />
              </CardContent>
            </Paper>

            {/* Custom Code */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: "20px",
                border: "1px solid #e2e8f0",
                bgcolor: "#ffffff",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    fontWeight: 600,
                    color: "#1e293b",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <CodeIcon sx={{ color: "#3b82f6" }} />
                  Custom Code
                </Typography>

                <TextField
                  value={settings.customCode}
                  onChange={(e) =>
                    handleInputChange("customCode", e.target.value)
                  }
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  placeholder="<!-- Add custom HTML/JavaScript here -->"
                  helperText="Optional markup added to <head> or footer, depending on the previous setting, Tracking Code Location."
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      bgcolor: "#f8fafc",
                      fontFamily: "monospace",
                      "&:hover": {
                        bgcolor: "#f1f5f9",
                      },
                      "&:hover fieldset": {
                        borderColor: "#3b82f6",
                      },
                      "&.Mui-focused": {
                        bgcolor: "#ffffff",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#3b82f6",
                        borderWidth: "2px",
                      },
                    },
                  }}
                />
              </CardContent>
            </Paper>

            {/* Additional Options */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: "20px",
                border: "1px solid #e2e8f0",
                bgcolor: "#ffffff",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    fontWeight: 600,
                    color: "#1e293b",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <SecurityIcon sx={{ color: "#3b82f6" }} />
                  Additional Options
                </Typography>

                <Stack spacing={3}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, color: "#1e293b" }}
                  >
                    Custom Code Location
                  </Typography>

                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={settings.displayCustomCodeBefore}
                          onChange={(e) =>
                            handleInputChange(
                              "displayCustomCodeBefore",
                              e.target.checked
                            )
                          }
                          sx={{
                            color: "#3b82f6",
                            "&.Mui-checked": { color: "#3b82f6" },
                          }}
                        />
                      }
                      label={
                        <Typography variant="body2">
                          Display Custom Code <strong>before</strong> the GA
                          tracking code (leave unchecked to display{" "}
                          <strong>after</strong> the tracking code)
                        </Typography>
                      }
                    />
                  </FormGroup>

                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, color: "#1e293b", mt: 3 }}
                  >
                    Admin Area
                  </Typography>

                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={settings.enableAdminTracking}
                          onChange={(e) =>
                            handleInputChange(
                              "enableAdminTracking",
                              e.target.checked
                            )
                          }
                          sx={{
                            color: "#3b82f6",
                            "&.Mui-checked": { color: "#3b82f6" },
                          }}
                        />
                      }
                      label={
                        <Typography variant="body2">
                          Enable tracking in WP Admin Area (adds tracking code
                          only; to view stats log into your Google account)
                        </Typography>
                      }
                    />
                  </FormGroup>

                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, color: "#1e293b", mt: 3 }}
                  >
                    Admin Users
                  </Typography>

                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={settings.disableAdminTracking}
                          onChange={(e) =>
                            handleInputChange(
                              "disableAdminTracking",
                              e.target.checked
                            )
                          }
                          sx={{
                            color: "#3b82f6",
                            "&.Mui-checked": { color: "#3b82f6" },
                          }}
                        />
                      }
                      label={
                        <Typography variant="body2">
                          Disable tracking of Admin-level users
                        </Typography>
                      }
                    />
                  </FormGroup>

                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, color: "#1e293b", mt: 3 }}
                  >
                    More Options
                  </Typography>

                  <Alert
                    severity="warning"
                    icon={false}
                    sx={{
                      borderRadius: "12px",
                      bgcolor: "#fef3c7",
                      border: "1px solid #fbbf24",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "#f59e0b",
                        flexShrink: 0,
                      }}
                    />
                    <Typography variant="body2" sx={{ color: "#92400e" }}>
                      For advanced features, check out{" "}
                      <Typography
                        component="span"
                        sx={{
                          color: "#3b82f6",
                          textDecoration: "underline",
                          cursor: "pointer",
                          fontWeight: 500,
                        }}
                      >
                        GA Google Analytics Pro »
                      </Typography>
                    </Typography>
                  </Alert>
                </Stack>
              </CardContent>
            </Paper>

            {/* Save Button */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: "20px",
                border: "1px solid #e2e8f0",
                bgcolor: "#ffffff",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
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
                  Save Changes
                </Button>
              </CardContent>
            </Paper>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default GoogleAnalyticsSettings;
