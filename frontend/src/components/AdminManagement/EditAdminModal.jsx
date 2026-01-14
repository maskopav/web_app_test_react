import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Modal from "../ProtocolEditor/Modal";
import { updateUserApi } from "../../api/users";

export default function EditAdminModal({ open, onClose, user, onSuccess }) {
  const { t } = useTranslation(["admin", "common"]);
  const [formData, setFormData] = useState({ email: "", full_name: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prefill data when the user prop changes
  useEffect(() => {
    if (user) {
      setFormData({
        email: user.user_email || "",
        full_name: user.full_name || ""
      });
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!formData.email) return setError("Email is required");
    
    setIsSubmitting(true);
    setError("");
    try {
      await updateUserApi({
        user_id: user.user_id,
        email: formData.email,
        full_name: formData.full_name
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
      open={open} 
      onClose={onClose} 
      title={t("management.buttons.edit")}
      onSave={handleSubmit}
      showSaveButton={true}
      saveLabel={isSubmitting ? t("saving", { ns: "common" }) : t("save", { ns: "common" })}
    >
      <div className="participant-form">
        <div className="form-col">
          <label className="form-label">{t("management.table.user")} <span className="label-required">*</span></label>
          <input 
            className="participant-input"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
        <div className="form-col">
          <label className="form-label">{t("management.table.fullName")}</label>
          <input 
            className="participant-input"
            value={formData.full_name}
            onChange={(e) => setFormData({...formData, full_name: e.target.value})}
          />
        </div>
        {error && <div className="validation-error-msg" style={{marginTop: '10px'}}>{error}</div>}
      </div>
    </Modal>
  );
}