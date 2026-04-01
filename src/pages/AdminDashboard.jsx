import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminDashboardContent from "./AdminDashboardContent"; // your current dashboard JSX

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isSuperAdmin = localStorage.getItem("isSuperAdmin");
    if (!isSuperAdmin) {
      navigate("/superadmin"); // redirect to login if not logged in
    }
  }, [navigate]);

  return <AdminDashboardContent />;
};

export default AdminDashboard;