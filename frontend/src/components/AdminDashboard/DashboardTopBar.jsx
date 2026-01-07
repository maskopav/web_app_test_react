import React from "react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher";
import "./AdminDashboard.css";

export default function DashboardTopBar({ user, onLogout }) {
  const { t } = useTranslation(["common"]);
  
  if (!user) return null;

  return (
    <div className="top-bar">
      <div className="user-info">
        <span className="user-name">{user.full_name}</span>
        <span className="user-role-badge">
          {user.role_id === 1 ? "Master" : "Admin"}
        </span>
      </div>
      <div className="top-bar-actions">
        <button className="btn-secondary btn-sm" onClick={onLogout}>
          {t("buttons.logout")}
        </button>
        <LanguageSwitcher />
      </div>
    </div>
  );
}