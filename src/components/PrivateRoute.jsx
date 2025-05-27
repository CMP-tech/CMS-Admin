import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = () => {
  const token = localStorage.getItem("adminToken");

  // Basic token format check: Must have 3 parts
  if (!token || token.split(".").length !== 3) {
    localStorage.removeItem("adminToken");
    return <Navigate to="/admin/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      // Token expired
      localStorage.removeItem("adminToken");
      return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
  } catch (error) {
    console.error("Invalid token", error);
    localStorage.removeItem("adminToken");
    return <Navigate to="/admin/login" replace />;
  }
};

export default PrivateRoute;
