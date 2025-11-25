// src/pages/ParticipantDashboardPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../components/LanguageSwitcher/LanguageSwitcher";
import { useMappings } from "../context/MappingContext";
import { getParticipants, createParticipant } from "../api/participants";
import { getProtocolsByProjectId } from "../api/protocols";
import Modal from "../components/ProtocolEditor/Modal"; 
import "./Pages.css";
import "../components/Protocols/Protocols.css"; // Reusing general table styles
import "../components/participants/ParticipantsDashboard.css"; // Specific styles

export default function ParticipantDashboardPage() {
  const { t } = useTranslation(["admin", "common"]);
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { mappings, refreshMappings } = useMappings();

  const [participants, setParticipants] = useState([]);
  const [protocols, setProtocols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const initialFormState = {
    full_name: "",
    external_id: "",
    birth_date: "",
    sex: "",
    contact_email: "",
    notes: "",
    protocol_id: "" 
  };

  const [formData, setFormData] = useState(initialFormState);

  // --- Data Loading ---
  useEffect(() => {
    async function initData() {
      setLoading(true);
      try {
        const [parts, protos] = await Promise.all([
          getParticipants(projectId),
          getProtocolsByProjectId(projectId) // Fetch from API not mappings
        ]);
        setParticipants(parts);
        setProtocols(protos);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    initData();
  }, [projectId]);

  // --- Validation Logic ---
  const isFormValid = useMemo(() => {
    // 1. Protocol is mandatory
    if (!formData.protocol_id) return false;

    // 2. Identity Check: (Name + DOB + Sex) OR (External ID)
    const hasFullName = formData.full_name.trim().length > 0;
    const hasDob = formData.birth_date.trim().length > 0;
    const hasSex = formData.sex.trim().length > 0;
    const hasExternalId = formData.external_id.trim().length > 0;

    const hasPersonalIdentity = hasFullName && hasDob && hasSex;

    return hasPersonalIdentity || hasExternalId;
  }, [formData]);

  // --- Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;

    try {
      await createParticipant({ ...formData, project_id: projectId });
      setShowAddModal(false);
      setFormData(initialFormState); // Reset form
      // Refresh participants list
      const updatedParts = await getParticipants(projectId);
      setParticipants(updatedParts);
    } catch (err) {
      alert(t("participantDashboard.alerts.createError") + ": " + err.message);
    }
  };

  return (
    <div className="project-dashboard-page">
      {/* Top Bar */}
      <div className="top-bar">
        <button className="btn-back" onClick={() => navigate(`/projects/${projectId}`)}>
          ← {t("buttons.back", { ns: "common" })}
        </button>
        <LanguageSwitcher />
      </div>

      <div className="protocols-container">
        
        {/* Header */}
        <div className="participant-list-header">
          <h2>{t("participantDashboard.title")}</h2>
          <button className="btn-create" onClick={() => setShowAddModal(true)}>
            {t("participantDashboard.addParticipant")}
          </button>
        </div>

        {/* Table */}
        <div className="protocol-list card">
          <div className="protocol-table-wrapper">
            <table className="protocol-table">
              <thead>
                <tr>
                  <th>{t("participantDashboard.table.name")}</th>
                  <th>{t("participantDashboard.table.externalId")}</th>
                  <th>{t("participantDashboard.table.birthDate")}</th>
                  <th>{t("participantDashboard.table.sex")}</th>
                  <th>{t("participantDashboard.table.email")}</th>
                  <th>{t("participantDashboard.table.phone")}</th>
                  <th>{t("participantDashboard.table.notes")}</th>
                  <th>{t("participantDashboard.table.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="8" className="empty-row">{t("loading", { ns: "common" })}...</td></tr>
                ) : participants.length === 0 ? (
                  <tr><td colSpan="8" className="empty-row">{t("participantDashboard.noData")}</td></tr>
                ) : (
                  participants.map((p) => (
                    <tr key={p.participant_id}>
                      <td className="highlighted">{p.full_name || "—"}</td>
                      <td>{p.external_id || "—"}</td>
                      <td>{p.birth_date ? new Date(p.birth_date).toLocaleDateString() : "—"}</td>
                      <td>{t(`participantDashboard.modal.gender.${p.sex}`, { defaultValue: p.sex })}</td>
                      <td>{p.contact_email || "—"}</td>
                      <td>{p.contact_phone || "—"}</td>
                      <td className="cell-notes" title={p.notes}>{p.notes}</td>
                      <td className="actions">
                        <button className="btn-edit" onClick={() => alert("Edit feature coming soon")}>
                          {t("participantDashboard.buttons.edit")}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Participant Modal */}
      <Modal 
        open={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        title={t("participantDashboard.modal.title")}
        onSave={handleSubmit}
        showSaveButton={false} // We use a custom button inside to handle disabled state visuals better
      >
        <div className="participant-form">
          
          <p className="participant-instruction">
            {t("participantDashboard.modal.instruction")}
          </p>

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
                <option value="female">{t("participantDashboard.modal.gender.female")}</option>
                <option value="male">{t("participantDashboard.modal.gender.male")}</option>
              </select>
            </div>
          </div>

          {/* Row 3: Email (Optional) and Phone (Optional)*/}
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
                type="phone" 
                name="contact_phone" 
                value={formData.contact_email} 
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

          {/* Protocol Assignment (Required) */}
          <div className="form-col protocol-select-container">
            <label className="form-label label-required">
              {t("participantDashboard.modal.labels.protocol")} *
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


          {/* Actions & Errors */}
          {!isFormValid && (
            <div className="validation-error-msg">
              {t("participantDashboard.modal.validationError")}
            </div>
          )}
          
          <div className="modal-actions">
             <button 
                className={`btn-save ${!isFormValid ? "btn-disabled" : ""}`}
                onClick={handleSubmit} 
                disabled={!isFormValid}
             >
                {t("participantDashboard.buttons.save")}
             </button>
          </div>

        </div>
      </Modal>
    </div>
  );
}