// src/components/RouteProtection/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";

export default function ProtectedRoute({ children }) {
  const { user } = useUser();
  const location = useLocation();

  if (!user) {
    // Redirect to login, but save the current location so we can go back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Handle the onboarding requirement (must change password)
  if (user.must_change_password && location.pathname !== "/setup-account") {
    return <Navigate to="/setup-account" replace />;
  }

  return children;
}