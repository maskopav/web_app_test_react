// src/components/Participants/AddParticipantModal.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { createParticipant, updateParticipant, getParticipants } from "../../api/participants";
import Modal from "../ProtocolEditor/Modal";
import "./ParticipantsDashboard.css"; 

export default function AddParticipantModal({ 
  open, 
  onClose, 
  projectId, 
  protocols, 
  onSuccess,
  participantToEdit = null 
}) {
  const { t } = useTranslation(["admin", "common"]);
  const isEditMode = !!participantToEdit;

  const initialFormState = {
    full_name: "",
    external_id: "",
    birth_date: "",
    sex: "",
    contact_email: "",
    contact_phone: "",
    notes: "",
    protocol_id: ""
  };

  const [formData, setFormData] = useState(initialFormState);
  const [existingParticipants, setExistingParticipants] = useState([]);
  const [submitError, setSubmitError] = useState(""); // <--- New Error State

  // --- Fetch ALL participants when modal opens ---
  useEffect(() => {
    if (open) {
      setSubmitError(""); // Clear errors on open
      getParticipants()
        .then(data => setExistingParticipants(data))
        .catch(err => console.error("Failed to load existing participants", err));
      
      if (participantToEdit) {
        setFormData({
          full_name: participantToEdit.full_name || "",
          external_id: participantToEdit.external_id || "",
          birth_date: participantToEdit.birth_date ? String(participantToEdit.birth_date).slice(0, 10) : "",
          sex: participantToEdit.sex || "",
          contact_email: participantToEdit.contact_email || "",
          contact_phone: participantToEdit.contact_phone || "",
          notes: participantToEdit.notes || "",
          protocol_id: "dummy" 
        });
      } else {
        setFormData(initialFormState);
      }
    }
  }, [open, participantToEdit]);

  // --- Validation Logic ---
  const isFormValid = useMemo(() => {
    if (!isEditMode && !formData.protocol_id) return false;

    const hasFullName = formData.full_name.trim().length > 0;
    const hasDob = formData.birth_date.trim().length > 0;
    const hasSex = formData.sex.trim().length > 0 && formData.sex !== "-"; 
    const hasExternalId = formData.external_id.trim().length > 0;

    const hasPersonalIdentity = hasFullName && hasDob && hasSex;

    return hasPersonalIdentity || hasExternalId;
  }, [formData, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts correcting input
    if (submitError) setSubmitError(""); 
  };

  const handleSubmit = async () => {
    setSubmitError("");
    if (!isFormValid) return;

    // --- FRONTEND DUPLICATE CHECK ---
    const inputExtId = formData.external_id.trim();
    const inputName = formData.full_name.trim().toLowerCase();
    const inputDob = formData.birth_date;
    const inputSex = formData.sex;

    const duplicate = existingParticipants.find(p => {
      if (isEditMode && p.participant_id === participantToEdit.participant_id) return false;

      // 1. External ID match
      if (inputExtId && p.external_id && p.external_id.trim() === inputExtId) {
        return true;
      }
      // 2. Personal Info Check
      if (inputName && inputDob && inputSex) {
        const pName = (p.full_name || "").toLowerCase();
        if (pName !== inputName) return false;

        const pDob = (String(p.birth_date) || "").slice(0, 10); 
        if (pDob !== inputDob) return false;

        const pSex = (p.sex || "");
        if (pSex !== inputSex) return false;
        
        return true;
      }
      return false;
    });

    if (duplicate) {
      // Set error state instead of alert
      setSubmitError(
        `${t("participantDashboard.alerts.createError")}: Participant already exists (ID: ${duplicate.external_id || "N/A"})`
      );
      return; 
    }

    // Payload Preparation
    const payload = {
        ...formData,
        birth_date: formData.birth_date || null,
        sex: formData.sex || null,
        external_id: formData.external_id || null,
        contact_email: formData.contact_email || null,
        contact_phone: formData.contact_phone || null,
        notes: formData.notes || null
    };

    // --- Proceed to Save ---
    try {
        if (isEditMode) {
          await updateParticipant(participantToEdit.participant_id, payload);
        } else {
          await createParticipant({ ...payload, project_id: projectId });
        }
        
        onSuccess(); 
        onClose();
      } catch (err) {
        setSubmitError(t("participantDashboard.alerts.createError") + ": " + err.message);
      }
  };

  return (
    <Modal 
      open={open} 
      onClose={onClose} 
      title={isEditMode ? t("participantDashboard.modal.editTitle") : t("participantDashboard.modal.title")}
      onSave={handleSubmit}
      showSaveButton={false}
    >
      <div className="participant-form">
        {!isEditMode && (
          <p className="participant-instruction">
            {t("participantDashboard.modal.instruction")}
          </p>
        )}

        {/* Row 1: Name & External ID */}
        <div className="form-row">
          <div className="form-col flex-2">
            <label className="form-label">{t("participantDashboard.modal.labels.fullName")}</label>
            <input 
              className="participant-input"
              name="full_name" 
              value={formData.full_name} 
              onChange={handleInputChange} 
              placeholder={t("participantDashboard.modal.placeholders.fullName")} 
            />
          </div>

          <div className="form-col flex-1">
            <label className="form-label">{t("participantDashboard.modal.labels.externalId")}</label>
            <input 
              className="participant-input"
              name="external_id" 
              value={formData.external_id} 
              onChange={handleInputChange} 
              placeholder={t("participantDashboard.modal.placeholders.externalId")} 
            />
          </div>
        </div>

        {/* Row 2: DOB & Sex */}
        <div className="form-row">
          <div className="form-col flex-1">
            <label className="form-label">{t("participantDashboard.modal.labels.birthDate")}</label>
            <input 
              className="participant-input"
              type="date" 
              name="birth_date" 
              value={formData.birth_date} 
              onChange={handleInputChange} 
            />
          </div>

          <div className="form-col flex-1">
            <label className="form-label">{t("participantDashboard.modal.labels.sex")}</label>
            <select className="participant-input" name="sex" value={formData.sex} onChange={handleInputChange}>
              <option value="">-- Select --</option>
              <option value="female">{t("participantDashboard.modal.gender.female")}</option>
              <option value="male">{t("participantDashboard.modal.gender.male")}</option>
            </select>
          </div>
        </div>

        {/* Row 3: Email & Phone */}
        <div className="form-row">
          <div className="form-col flex-1">
            <label className="form-label">{t("participantDashboard.modal.labels.email")}</label>
            <input 
              className="participant-input"
              type="email" 
              name="contact_email" 
              value={formData.contact_email} 
              onChange={handleInputChange} 
            />
          </div>
          <div className="form-col flex-1">
            <label className="form-label">{t("participantDashboard.modal.labels.phone")}</label>
            <input 
              className="participant-input"
              type="tel" 
              name="contact_phone" 
              value={formData.contact_phone} 
              onChange={handleInputChange} 
            />
          </div>
        </div>

        {/* Notes */}
        <div className="form-col">
          <label className="form-label">{t("participantDashboard.modal.labels.notes")}</label>
          <textarea 
            className="participant-input"
            name="notes" 
            value={formData.notes} 
            onChange={handleInputChange} 
            rows={1} 
          />
        </div>

        {/* Protocol Assignment (HIDDEN IN EDIT MODE) */}
        {!isEditMode && (
            <div className="form-col protocol-select-container">
            <label className="form-label">
                {t("participantDashboard.modal.labels.protocol")} 
                <span className="label-required">*</span>
            </label>
            <select 
                className={`participant-input protocol-select ${formData.protocol_id ? 'valid' : ''}`}
                name="protocol_id" 
                value={formData.protocol_id} 
                onChange={handleInputChange}
            >
                <option value="">{t("participantDashboard.modal.placeholders.selectProtocol")}</option>
                {protocols.map(proto => (
                <option key={proto.id} value={proto.id}>
                    {proto.name} (v{proto.version})
                </option>
                ))}
            </select>
            </div>
        )}

        {/* --- ERROR DISPLAY SECTION --- */}
        <div style={{ minHeight: '1.2em', marginTop: '0.5rem' }}>
            {!isFormValid && (
                <div className="validation-error-msg">
                    {t("participantDashboard.modal.validationError")}
                </div>
            )}
            {submitError && (
                <div className="validation-error-msg">
                    {submitError}
                </div>
            )}
        </div>
        
        <div className="modal-actions">
           <button 
              className="btn-save" 
              onClick={handleSubmit} 
              disabled={!isFormValid}
              style={{ opacity: isFormValid ? 1 : 0.5, cursor: isFormValid ? 'pointer' : 'not-allowed' }}
           >
              {isEditMode ? t("participantDashboard.buttons.update") : t("participantDashboard.buttons.save")}
           </button>
        </div>
      </div>
    </Modal>
  );
}