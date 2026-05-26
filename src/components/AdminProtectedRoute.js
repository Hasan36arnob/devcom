import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated: reduxAuth } = useSelector((state) => state.adminReducer);
  const localAuth = isAuthenticated();

  if (!reduxAuth || !localAuth) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
