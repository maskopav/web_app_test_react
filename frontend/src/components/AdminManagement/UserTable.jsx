import React from "react";
import { useTranslation } from "react-i18next";
import "./AdminManagement.css";

export default function UserTable({ users, onToggleStatus, onEdit, onAssignProject, onAddClick }) {
  const { t } = useTranslation(["admin", "common"]);

  return (
    <section className="section card">
      <div className="section-header-row">
        <h3 className="section-title">System Administrators</h3>
        <button className="btn-primary btn-sm" onClick={onAddClick}>
          + {t("auth.tabSignup", { ns: "common" })}
        </button>
      </div>

      <div className="table-scroll-area">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User (Email)</th>
              <th>Full Name</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.user_id}>
                <td>{u.user_id}</td>
                <td><strong>{u.user_email}</strong></td>
                <td>{u.full_name}</td>
                <td><span className="user-role-badge">{u.role}</span></td>
                <td>
                  <span className={`status-badge ${u.is_active ? "active" : "inactive"}`}>
                    {u.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="actions">
                  <button className="btn-icon" title="Edit" onClick={() => onEdit(u)}>✏️</button>
                  <button 
                    className="btn-icon" 
                    title="Assign Project" 
                    onClick={() => onAssignProject(u)}
                  >
                    📂
                  </button>
                  <button 
                    className="btn-icon" 
                    onClick={() => onToggleStatus(u.user_id, u.is_active)}
                    title={u.is_active ? "Deactivate" : "Activate"}
                  >
                    {u.is_active ? "🚫" : "✅"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}