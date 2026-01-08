import React from "react";
import "./AdminManagement.css";

export default function UserProjectTable({ assignments, onRemove }) {
  return (
    <section className="section card">
      <div className="section-header-row">
        <h3 className="section-title">Project Assignments</h3>
        <button className="btn-green btn-sm">+ Assign Project</button>
      </div>

      <div className="table-scroll-area">
        <table className="table">
          <thead>
            <tr>
              <th>Administrator</th>
              <th>Assigned Project</th>
              <th>Date Assigned</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a) => (
              <tr key={a.assignment_id}>
                <td>{a.user_name}</td>
                <td><span className="project-tag">{a.project_name}</span></td>
                <td>{new Date(a.assigned_at).toLocaleDateString()}</td>
                <td>
                  <button 
                    className="btn-icon danger" 
                    title="Remove Assignment"
                    onClick={() => onRemove(a.assignment_id)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
            {assignments.length === 0 && (
              <tr><td colSpan="4" className="empty-row">No projects assigned to administrators yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}