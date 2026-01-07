import React from "react";
import { useTranslation } from "react-i18next";
import StatusBadge from "../ProjectDashboard/StatusBadge";
import "./AdminDashboard.css";

export default function ProjectGrid({ projects, onProjectClick }) {
  const { t } = useTranslation(["admin"]);
  
  return (
    <section className="dashboard-section">
      <h2 className="section-heading">{t("adminDashboard.projectsTitle")}</h2>
      <div className="project-grid">
        {projects.map(project => (
          <div 
            key={project.id} 
            className="project-card action-card" 
            onClick={() => onProjectClick(project.id)}
          >
            <div className="project-card-header">
              <h3>{project.name}</h3>
              <StatusBadge active={project.is_active === 1} />
            </div>
            <div className="project-card-body">
              <p>{project.country} • {project.frequency}</p>
            </div>
            <div className="project-card-footer">
              <span className="card-link">{t("adminDashboard.enterProject")}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}