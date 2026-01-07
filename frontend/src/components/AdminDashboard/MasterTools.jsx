// src/components/AdminDashboard/MasterTools.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import "./AdminDashboard.css";

export default function MasterTools() {
  const { t } = useTranslation(["admin", "common"]);

  // Note: Navigation logic can be added to the onClick handlers later
  return (
    <section className="dashboard-section master-tools">
      <h2 className="section-heading">Master Administrative Tools</h2>
      
      <div className="actions-grid">
        {/* Admin User Management Card */}
        <button className="action-card btn-users" onClick={() => console.log("Navigate to Users")}>
          <div className="icon">👤</div>
          <div className="text">
            <h3>Admin User Management</h3>
            <p>Manage administrator accounts, assign project permissions, and reset credentials.</p>
          </div>
        </button>

        {/* Global Projects Card */}
        <button className="action-card btn-projects" onClick={() => console.log("Navigate to Projects")}>
          <div className="icon">📂</div>
          <div className="text">
            <h3>Global Project Overview</h3>
            <p>View and manage all system projects, archive old studies, or create new protocol templates.</p>
          </div>
        </button>
      </div>
    </section>
  );
}