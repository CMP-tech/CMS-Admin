import React, { useEffect, useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Paper,
  Snackbar,
  Alert,
  Stack,
} from "@mui/material";
import axios from "../../api/axiosInstance"; // Adjust path if needed

const SocialMediaPage = () => {
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
  });

  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchSettings = async () => {
    try {
      const res = await axios.get("/api/settings");
      if (res.data) {
        const { facebook, twitter, instagram, linkedin } = res.data;
        setSocialLinks({ facebook, twitter, instagram, linkedin });
      }
    } catch (error) {
      console.error("Fetch error:", error.message);
      setSnack({
        open: true,
        message: "Failed to load settings",
        severity: "error",
      });
    }
  };

  const handleChange = (e) => {
    setSocialLinks({ ...socialLinks, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.put("/api/settings", socialLinks);
      setSnack({
        open: true,
        message: "Social links updated",
        severity: "success",
      });
    } catch (error) {
      console.error("Update error:", error.message);
      setSnack({ open: true, message: "Update failed", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <Paper sx={{ p: 4, maxWidth: 600, margin: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Social Media Settings
      </Typography>

      <Stack spacing={2} mt={2}>
        <TextField
          label="Facebook URL"
          name="facebook"
          value={socialLinks.facebook}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Twitter URL"
          name="twitter"
          value={socialLinks.twitter}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Instagram URL"
          name="instagram"
          value={socialLinks.instagram}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="LinkedIn URL"
          name="linkedin"
          value={socialLinks.linkedin}
          onChange={handleChange}
          fullWidth
        />

        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </Stack>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack({ ...snack, open: false })}
      >
        <Alert
          severity={snack.severity}
          onClose={() => setSnack({ ...snack, open: false })}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default SocialMediaPage;
