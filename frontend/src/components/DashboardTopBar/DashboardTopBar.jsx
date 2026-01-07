// src/components/Common/DashboardTopBar.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "../../context/UserContext";
import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher";
import "./DashboardTopBar.css";

export default function DashboardTopBar({ onBack, backLabel }) {
  const { t } = useTranslation(["common"]);
  const { user, logout } = useUser();
  
  if (!user) return null;

  return (
    <div className="top-bar-container">
      <div className="top-bar-left">
        {onBack && (
          <button className="btn-return" onClick={onBack}>
            ← {backLabel || t("buttons.back")}
          </button>
        )}
      </div>
      
      <div className="top-bar-right">
        <div className="user-info-section">
          <span className="user-name">{user.full_name}</span>
          <span className="user-role-badge">
            {user.role_id === 1 ? "Master" : "Admin"}
          </span>
        </div>
        <div className="top-bar-divider"></div>
        <button className="btn-secondary btn-logout" onClick={logout}>
          {t("buttons.logout")}
        </button>
        <div className="top-bar-divider"></div>
        <div className="language-switcher-wrapper">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}