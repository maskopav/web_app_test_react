import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getMappings } from "../api/mappings";

// Shared & Local Components
import DashboardTopBar from "../components/DashboardTopBar/DashboardTopBar";
import ProjectGrid from "../components/AdminDashboard/ProjectGrid";
import MasterTools from "../components/AdminDashboard/MasterTools";

import "./Pages.css";

export default function AdminDashboardPage() {
  const { t } = useTranslation(["admin", "common"]);
  const navigate = useNavigate();

  // Development Placeholder User Logic
  const getStoredUser = () => {
    const stored = localStorage.getItem("adminUser");
    if (stored) return JSON.parse(stored);
    
    if (import.meta.env.DEV) {
       console.warn("Dev mode: Using Master placeholder");
       return { id: 1, full_name: "Master User", role_id: 1, email: "master_user@example.com" };
    }
    return null;
  };

  const [user, setUser] = useState(getStoredUser());
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    async function loadDashboardData() {
      try {
        const data = await getMappings(["projects"]);
        setProjects(data.projects || []);
      } catch (err) {
        console.error("Dashboard data error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    navigate("/login");
  };

  if (loading) return <div className="app-container"><p>{t("loading", {ns: "common"})}...</p></div>;

  return (
    <div className="dashboard-page">
      <DashboardTopBar user={user} onLogout={handleLogout} />

      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="project-description">
          Select a project to manage protocols and participants, or use administrative tools below.
        </p>
      </div>

      <ProjectGrid 
        projects={projects} 
        onProjectClick={(id) => navigate(`/projects/${id}`)} 
      />

      {user.role_id === 1 && <MasterTools />}
    </div>
  );
}