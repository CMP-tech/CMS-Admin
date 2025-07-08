import React, { useEffect, useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "../../api/axiosInstance"; // adjust the path if needed

const CopyrightPage = () => {
  const [copyrightMessage, setCopyrightMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchSettings = async () => {
    try {
      const res = await axios.get("/api/settings");
      if (res.data?.copyrightMessage) {
        setCopyrightMessage(res.data.copyrightMessage);
      }
    } catch (error) {
      console.error("Error fetching settings:", error.message);
      setSnack({
        open: true,
        message: "Failed to load settings",
        severity: "error",
      });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.put("/api/settings", { copyrightMessage });
      setSnack({
        open: true,
        message: "Copyright updated successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Update failed:", error.message);
      setSnack({ open: true, message: "Failed to update", severity: "error" });
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
        Copyright Settings
      </Typography>

      <TextField
        name="copyrightMessage"
        label="Copyright Message"
        value={copyrightMessage}
        onChange={(e) => setCopyrightMessage(e.target.value)}
        fullWidth
        multiline
        rows={3}
        sx={{ mt: 2 }}
      />

      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save"}
      </Button>

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

export default CopyrightPage;
