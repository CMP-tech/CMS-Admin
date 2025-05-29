import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

export default function AdminLogout() {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        await axiosInstance.post("/api/admin/logout");
      } catch (error) {
        console.error("Logout error:", error);
      }

      localStorage.removeItem("token");
      navigate("/login");
    };

    logout();
  }, [navigate]);

  return <div>Logging out...</div>;
}
