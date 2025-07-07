import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
  Tooltip,
  CircularProgress,
  TablePagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axiosInstance from "../api/axiosInstance";

export default function ContactRequest() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Pagination
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/contact/all");
      if (Array.isArray(res.data)) {
        setContacts(res.data);
      } else {
        setContacts([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setSnackbar({
        open: true,
        message: "Failed to fetch contact requests",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await axiosInstance.delete(`/api/contact/${id}`);
      setSnackbar({
        open: true,
        message: "Contact request deleted",
        severity: "success",
      });
      fetchContacts();
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to delete contact request",
        severity: "error",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Get current page rows
  const paginatedContacts = contacts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Contact Requests
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>Submitted At</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedContacts.map((contact) => (
                  <TableRow key={contact._id}>
                    <TableCell>{contact.name}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell sx={{ maxWidth: 400, whiteSpace: "pre-wrap" }}>
                      {contact.message}
                    </TableCell>
                    <TableCell>
                      {new Date(contact.createdAt).toLocaleDateString()}{" "}
                      {new Date(contact.createdAt).toLocaleTimeString()}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Delete">
                        <span>
                          <IconButton
                            onClick={() => handleDelete(contact._id)}
                            color="error"
                            disabled={deletingId === contact._id}
                          >
                            {deletingId === contact._id ? (
                              <CircularProgress size={20} />
                            ) : (
                              <DeleteIcon />
                            )}
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedContacts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No contact requests found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={contacts.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[10]}
          />
        </>
      )}

      {/* Snackbar for messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
