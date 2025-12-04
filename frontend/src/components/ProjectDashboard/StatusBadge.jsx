// src/components/ProjectDashboard/StatusBadge.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import "./ProjectDashboard.css";

export default function StatusBadge({ active }) {
  const { t } = useTranslation(["admin"]);
  return (
    <span className={`status-badge ${active ? "active" : "inactive"}`}>
      {active
        ? t("projectDashboard.status.active")
        : t("projectDashboard.status.inactive")}
    </span>
  );
}