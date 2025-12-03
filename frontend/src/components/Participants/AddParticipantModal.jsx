// src/components/Participants/AddParticipantModal.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { createParticipant, updateParticipant, getParticipants } from "../../api/participants";
import { assignProtocolToParticipant } from "../../api/participantProtocols";
import Modal from "../ProtocolEditor/Modal";
import "./AddParticipantModal.css"; 

export default function AddParticipantModal({ 
  open, 
  onClose, 
  projectId, 
  protocols, 
  onSuccess,
  participantToEdit = null,
  isAssignMode = false
}) {
  const { t } = useTranslation(["admin", "common"]);

  // Determine standard Edit Mode (only if we have data AND we are NOT in Assign Mode)
  const isEditMode = !!participantToEdit && !isAssignMode;

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
  const [submitError, setSubmitError] = useState("");

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
          // If in Assign Mode, we want the user to pick a NEW protocol, so reset this.
          // If in Edit Mode, we ignore protocol anyway.
          protocol_id: "" 
        });
      } else {
        setFormData(initialFormState);
      }
    }
  }, [open, participantToEdit]);

  // --- Validation Logic ---
  const isFormValid = useMemo(() => {
    // Protocol is required for Create AND Assign mode (but not Edit mode)
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
    if (submitError) setSubmitError(""); 
  };

  const handleSubmit = async () => {
    setSubmitError("");
    if (!isFormValid) return;

    // --- DUPLICATE CHECK (Only for new participants) ---
    if (!isEditMode && !isAssignMode) {
      const inputExtId = formData.external_id.trim();
      const inputName = formData.full_name.trim().toLowerCase();
      const inputDob = formData.birth_date;
      const inputSex = formData.sex;

      const duplicate = existingParticipants.find(p => {
        if (isEditMode && p.participant_id === participantToEdit.participant_id) return false;

        if (inputExtId && p.external_id && p.external_id.trim() === inputExtId) {
          return true;
        }
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
        setSubmitError(
          `${t("participantDashboard.alerts.createError")}: Participant already exists (ID: ${duplicate.external_id || "N/A"})`
        );
        return; 
      }
    }

    const payload = {
        ...formData,
        birth_date: formData.birth_date || null,
        sex: formData.sex || null,
        external_id: formData.external_id || null,
        contact_email: formData.contact_email || null,
        contact_phone: formData.contact_phone || null,
        notes: formData.notes || null
    };

    try {
      if (isAssignMode) {
        // ASSIGN MODE: Call specific assignment API
        await assignProtocolToParticipant({
            participant_id: participantToEdit.participant_id, // Must use ID from the edited object
            protocol_id: formData.protocol_id,
            project_id: projectId
        });
        console.log('Assign mode')
      } else if (isEditMode) {
          // EDIT MODE: Update details
          await updateParticipant(participantToEdit.participant_id, payload);
        } else {
          // CREATE MODE: Create new
          await createParticipant({ ...payload, project_id: projectId });
        }
        
        onSuccess(); 
        onClose();
      } catch (err) {
        setSubmitError(t("participantDashboard.alerts.createError") + ": " + err.message);
      }
  };

  // Title Logic
  let modalTitle = t("participantDashboard.modal.title"); // "Add New Participant"
  if (isEditMode) modalTitle = t("participantDashboard.modal.editTitle");
  if (isAssignMode) modalTitle = t("participantDashboard.modal.assignTitle", "Assign Other Protocol To Existing Participant"); 

  return (
    <Modal 
      open={open} 
      onClose={onClose} 
      title={modalTitle}
      onSave={handleSubmit}
      showSaveButton={false}
    >
      <div className="participant-form">
        {/* Instruction only for new participants */}
        {!isEditMode && !isAssignMode && (
          <p className="participant-instruction">
            {t("participantDashboard.modal.instruction")}
          </p>
        )}
        {/* Instruction for ASSIGN mode */}
        {isAssignMode && (
          <div className="assign-instruction">
            <strong>{t("participantDashboard.modal.assignInfoTitle")}</strong>
            {t("participantDashboard.modal.assignInfo")}
          </div>
        )}

        {/* Row 1: Name & External ID */}
        <div className="form-row">
          <div className="form-col flex-2">
            <label className="form-label">{t("participantDashboard.modal.labels.fullName")}</label>
            <input 
              className={`participant-input ${isAssignMode ? 'input-disabled' : ''}`}
              name="full_name" 
              value={formData.full_name} 
              onChange={handleInputChange} 
              placeholder={t("participantDashboard.modal.placeholders.fullName")}
              disabled={isAssignMode} 
            />
          </div>

          <div className="form-col flex-1">
            <label className="form-label">{t("participantDashboard.modal.labels.externalId")}</label>
            <input 
              className={`participant-input ${isAssignMode ? 'input-disabled' : ''}`}
              name="external_id" 
              value={formData.external_id} 
              onChange={handleInputChange} 
              placeholder={t("participantDashboard.modal.placeholders.externalId")} 
              disabled={isAssignMode}
            />
          </div>
        </div>

        {/* Row 2: DOB & Sex */}
        <div className="form-row">
          <div className="form-col flex-1">
            <label className="form-label">{t("participantDashboard.modal.labels.birthDate")}</label>
            <input 
              className={`participant-input ${isAssignMode ? 'input-disabled' : ''}`}
              type="date" 
              name="birth_date" 
              value={formData.birth_date} 
              onChange={handleInputChange} 
              disabled={isAssignMode}
            />
          </div>

          <div className="form-col flex-1">
            <label className="form-label">{t("participantDashboard.modal.labels.sex")}</label>
            <select className={`participant-input ${isAssignMode ? 'input-disabled' : ''}`}
              name="sex" 
              value={formData.sex} 
              onChange={handleInputChange}
              disabled={isAssignMode}
            >
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
              className={`participant-input ${isAssignMode ? 'input-disabled' : ''}`}
              type="email" 
              name="contact_email" 
              value={formData.contact_email} 
              onChange={handleInputChange} 
              disabled={isAssignMode}
            />
          </div>
          <div className="form-col flex-1">
            <label className="form-label">{t("participantDashboard.modal.labels.phone")}</label>
            <input 
              className={`participant-input ${isAssignMode ? 'input-disabled' : ''}`}
              type="tel" 
              name="contact_phone" 
              value={formData.contact_phone} 
              onChange={handleInputChange} 
              disabled={isAssignMode}
            />
          </div>
        </div>

        {/* Notes */}
        <div className="form-col">
          <label className="form-label">{t("participantDashboard.modal.labels.notes")}</label>
          <textarea 
            className={`participant-input ${isAssignMode ? 'input-disabled' : ''}`}
            name="notes" 
            value={formData.notes} 
            onChange={handleInputChange} 
            rows={1} 
            disabled={isAssignMode}
          />
        </div>

        {/* Protocol Assignment (HIDDEN IN EDIT MODE) */}
        {!isEditMode && (
            <div className="form-col select-container">
            <label className="form-label">
                {t("participantDashboard.modal.labels.protocol")} 
                <span className="label-required">*</span>
            </label>
            <select 
                className={`participant-input select ${formData.protocol_id ? 'valid' : ''}`}
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
              {/* Dynamic Label */}
              {isAssignMode 
                ? t("participantDashboard.buttons.save", "Save") 
                : isEditMode 
                    ? t("participantDashboard.buttons.update") 
                    : t("participantDashboard.buttons.create")
              }
            </button>
        </div>
      </div>
    </Modal>
  );
}