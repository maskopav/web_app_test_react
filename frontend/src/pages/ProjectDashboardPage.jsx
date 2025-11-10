// src/pages/ProjectDashboardPage.jsx
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Pages.css"

export default function ProjectDashboardPage() {
  const { t } = useTranslation(["tasks", "common"]);
  const { projectId } = useParams();
  const currentProject = projectId || "demo"; // fallback for test

  return (
    <div>
      <h2>{t("projectDashboard.title", { ns: "admin" })}</h2>
      <p>{t("projectDashboard.subtitle", { ns: "admin" })} {currentProject}</p>
    </div>
  );
  }