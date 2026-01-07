import React from "react";
import "./AdminDashboard.css";

export default function MasterTools() {
  return (
    <section className="dashboard-section master-tools">
      <h2 className="section-heading">Master Administrative Tools</h2>
      <div className="admin-management-box">
         <div className="tool-card">
           <h4>Manage Admins</h4>
           <p>Create new admin accounts, assign projects, or reset passwords.</p>
           <button className="btn-green" onClick={() => alert("Admin Management Placeholder")}>
             Open Admin Manager
           </button>
         </div>
         <div className="tool-card">
           <h4>Global Settings</h4>
           <p>Manage system-wide protocols and global task templates.</p>
           <button className="btn-primary" onClick={() => alert("Settings Placeholder")}>
             System Settings
           </button>
         </div>
      </div>
    </section>
  );
}