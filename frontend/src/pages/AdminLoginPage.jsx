// frontend/src/pages/AdminLoginPage.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import { useUser } from "../context/UserContext";
import AuthForm from "../components/AuthForm/AuthForm";
import { loginAdmin } from "../api/auth";
import DashboardTopBar from "../components/DashboardTopBar/DashboardTopBar";

export default function AdminLoginPage() {
  const { t } = useTranslation(["admin"]);
  const navigate = useNavigate();
  const { login, logout } = useUser();

  useEffect(() => {
    // Clear the user context and storage immediately on mount
    logout();
  }, []);

  const handleAdminLogin = async (formData) => {
    try {
      const res = await loginAdmin(formData);
      if (res.success) {
        // 4. IMPORTANT: Use the context's login function
        // This updates BOTH localStorage and the React state instantly.
        login(res.user); 
        
        // 5. Logic for onboarding redirect
        if (res.user.must_change_password) {
          navigate("/setup-account");
        } else {
          navigate("/admin"); 
        }
      }
    } catch (err) {
      console.error("Login failed:", err);
      // You could set an error state here to show in the UI
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