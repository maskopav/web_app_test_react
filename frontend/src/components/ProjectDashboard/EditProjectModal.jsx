import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Modal from "../ProtocolEditor/Modal";
import { updateProjectApi } from "../../api/projects";
import { useUser } from "../../context/UserContext";

export default function EditProjectModal({ open, onClose, project, onSuccess }) {
  const { t } = useTranslation(["admin", "common"]);
  const { user } = useUser();
  const [formData, setFormData] = useState({
    name: "", description: "", frequency: "", country: "", contact_person: ""
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        description: project.description || "",
        frequency: project.frequency || "",
        country: project.country || "",
        contact_person: project.contact_person || ""
      });
    }
  }, [project]);

  const handleSubmit = async () => {
    if (!formData.name) return setError(t("projectDashboard.errors.nameRequired"));
    setIsSubmitting(true);
    try {
      await updateProjectApi({
        id: project.id,
        ...formData,
        updated_by: user.id
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal 
      open={open} onClose={onClose} 
      title={t("projectDashboard.editProject")}
      onSave={handleSubmit} showSaveButton={true}
      saveLabel={isSubmitting ? t("saving", {ns: "common"}) : t("save", {ns: "common"})}
    >
      <div className="participant-form">
        <div className="form-col">
          <label className="form-label">{t("projectDashboard.fields.name")}*</label>
          <input 
            className="participant-input"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div className="form-col">
          <label className="form-label">{t("projectDashboard.fields.description")}</label>
          <textarea 
            className="participant-input description-textarea"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>
        <div className="form-grid-2">
           <div className="form-col">
              <label className="form-label">{t("projectDashboard.fields.country")}</label>
              <input 
                className="participant-input"
                value={formData.country}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
              />
           </div>
           <div className="form-col">
              <label className="form-label">{t("projectDashboard.fields.frequency")}</label>
              <input 
                className="participant-input"
                value={formData.frequency}
                onChange={(e) => setFormData({...formData, frequency: e.target.value})}
              />
           </div>
        </div>
        <div className="form-col">
          <label className="form-label">{t("projectDashboard.fields.contact")}</label>
          <input 
            className="participant-input"
            value={formData.contact_person}
            onChange={(e) => setFormData({...formData, contact_person: e.target.value})}
          />
        </div>
        {error && <div className="validation-error-msg">{error}</div>}
      </div>
    </Modal>
  );
}