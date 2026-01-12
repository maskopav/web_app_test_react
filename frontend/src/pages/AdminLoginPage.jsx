// frontend/src/pages/AdminLoginPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import AuthForm from "../components/AuthForm/AuthForm";
import { loginAdmin } from "../api/auth";
import DashboardTopBar from "../components/DashboardTopBar/DashboardTopBar";

export default function AdminLoginPage() {
  const { t } = useTranslation(["admin"]);
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
      <DashboardTopBar />
      <AuthForm
        title={t("adminLogin.title")}
        subtitle=<Trans
        i18nKey="adminLogin.subtitle"
        ns="admin"
        components={{ 
          strong: <strong />
        }}
      />
        onLogin={handleAdminLogin}
      />
    </div>
  );
}