// frontend/src/pages/AdminLoginPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import AuthForm from "../components/AuthForm/AuthForm";
import { loginAdmin } from "../api/auth";
import DashboardTopBar from "../components/DashboardTopBar/DashboardTopBar";
import { useUser } from "../context/UserContext"; //
import "./AdminLoginPage.css"; // Dedicated styles for this page

export default function AdminLoginPage() {
  const { t } = useTranslation(["admin", "common"]);
  const navigate = useNavigate();
  const { login, logout } = useUser(); //
  
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Ensure a clean state whenever this page is visited
    logout(); 
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAdminLogin = async (formData) => {
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const res = await loginAdmin(formData);
      
      if (res.success && res.user) {
        // Use context login to update state and storage simultaneously
        login(res.user); 
        
        // Logical redirection based on onboarding status
        if (res.user.must_change_password) {
          navigate("/setup-account");
        } else {
          navigate("/admin");
        }
      }
    } catch (err) {
      console.error("Login submission error:", err);
      
      // Check if the error is specifically about credentials
      if (err.message.includes("credentials")) {
        setErrorMessage(t("adminLogin.errorGeneric"));
      } else {
        // If it's a network timeout or 500 error, show connection error
        setErrorMessage(t("adminLogin.errorConnection"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-page">
      <DashboardTopBar />
      
      <div className="auth-page-wrapper">
        <AuthForm
          title={t("adminLogin.title")}
          subtitle={
            <Trans
              i18nKey="adminLogin.subtitle"
              ns="admin"
              components={{ strong: <strong /> }}
            />
          }
          onLogin={handleAdminLogin}
          isLoading={isSubmitting}
        />

        {/* CSS-based error state feedback */}
        {errorMessage && (
          <div className="auth-error-box fade-in">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{errorMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}