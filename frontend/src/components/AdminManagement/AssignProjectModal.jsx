import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchProjectsList } from "../../api/auth";
import "./AdminManagement.css";

export default function AssignProjectModal({ user, onClose, onAssign }) {
  const { t } = useTranslation(["admin", "common"]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectsList()
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="modal-overlay">
      <div className="modal-content card">
        <div className="modal-header">
          <h3>Assign Project to {user.full_name}</h3>
          <button className="btn-close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-body">
          {loading ? <p>Loading projects...</p> : (
            <div className="project-selection-list">
              {projects.map(p => (
                <div key={p.id} className="project-selection-item">
                  <div>
                    <strong>{p.name}</strong>
                    <p className="text-muted small">{p.description}</p>
                  </div>
                  <button 
                    className="btn-primary btn-sm" 
                    onClick={() => onAssign(user.user_id, p.id)}
                  >
                    + Assign
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}