import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "../ProtocolEditor/Modal";
import { createAdminApi } from "../../api/users";

export default function AddAdminModal({ open, onClose, projects, onSuccess }) {
  const { t } = useTranslation(["admin", "common"]);
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    project_ids: []
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleProject = (id) => {
    setFormData(prev => ({
      ...prev,
      project_ids: prev.project_ids.includes(id)
        ? prev.project_ids.filter(p => p !== id)
        : [...prev.project_ids, id]
    }));
  };

  const handleSubmit = async () => {
    // Basic presence check
    if (!formData.email) return setError("Email is required");

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return setError("Please enter a valid email format (e.g., admin@example.com)");
    } 

    setIsSubmitting(true);
    setError("");
    try {
      await createAdminApi({
            email: formData.email,
            full_name: formData.full_name,
            project_ids: formData.project_ids // The array of IDs from the checkboxes
      });
      onSuccess(); // Refreshes the management tables
      onClose();
      setFormData({ email: "", full_name: "", project_ids: [] });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal 
      open={open} 
      onClose={onClose} 
      title="Add New System Administrator"
      onSave={handleSubmit}
      showSaveButton={true}
      saveLabel={isSubmitting ? "Creating..." : "Create Admin"}
    >
      <div className="participant-form">
        <div className="form-col">
          <label className="form-label">Email Address <span className="label-required">*</span></label>
          <input 
            className="participant-input"
            type="email"
            value={formData.email}
            onChange={(e) => {
                setFormData({...formData, email: e.target.value})
                if (error) setError(""); // Clear error when user starts typing again
            }}
            placeholder="admin@example.com"
          />
        </div>
        <div className="form-col">
          <label className="form-label">Full Name (Optional)</label>
          <input 
            className="participant-input"
            value={formData.full_name}
            onChange={(e) => setFormData({...formData, full_name: e.target.value})}
            placeholder="John Doe"
          />
        </div>
        
        <div className="form-col">
          <label className="form-label">Assign to Projects</label>
          <div className="project-selection-list" style={{maxHeight: '150px', overflowY: 'auto', border: '1px solid #ddd', padding: '10px', borderRadius: '4px'}}>
            {projects.map(p => (
              <label key={p.id} style={{display: 'block', marginBottom: '5px', cursor: 'pointer'}}>
                <input 
                  type="checkbox" 
                  checked={formData.project_ids.includes(p.id)}
                  onChange={() => handleToggleProject(p.id)}
                  style={{marginRight: '10px'}}
                />
                {p.name}
              </label>
            ))}
          </div>
        </div>

        {error && <div className="validation-error-msg" style={{marginTop: '10px'}}>{error}</div>}
      </div>
    </Modal>
  );
}