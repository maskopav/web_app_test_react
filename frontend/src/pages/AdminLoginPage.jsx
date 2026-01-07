// frontend/src/pages/AdminLoginPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AuthForm from "../components/AuthForm/AuthForm";
import { loginAdmin } from "../api/auth";

export default function AdminLoginPage() {
  const { t } = useTranslation(["common"]);
  const navigate = useNavigate();

  const handleAdminLogin = async (data) => {
    const res = await loginAdmin(data);
    if (res.success) {
      // Save user info/token to localStorage or Context
      localStorage.setItem("adminUser", JSON.stringify(res.user));
      
      // Redirect 
      navigate("/admin"); // Project Admin view
    }
  };

  return (
    <div className="dashboard-page">
      <AuthForm
        title="TaskProtocoller Admin"
        subtitle="Manage your research projects and participants."
        onLogin={handleAdminLogin}
        // Omitting onSignup automatically hides the registration tabs
      />
    </div>
  );
}