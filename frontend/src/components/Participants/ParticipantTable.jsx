import React from "react";
import { useTranslation } from "react-i18next";
import "./ParticipantTable.css"; 

const AssignIcon = () => (
  <svg 
    width="18" 
    height="18" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="4" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    title="Assign Other Protocol"
    style={{ display: "block" }} // Removes inline spacing issues
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export default function ParticipantTable({ 
  participants, 
  loading, 
  onEdit,
  onAssignProtocol
}) {
  const { t } = useTranslation(["admin", "common"]);

  return (
      <div className="table-scroll-area">
        <table className="table">
          <thead>
            <tr>
              <th>{t("participantDashboard.table.name")}</th>
              <th>{t("participantDashboard.table.externalId")}</th>
              <th>{t("participantDashboard.table.protocolName")}</th>
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
                <tr key={p.participant_protocol_id}>
                  <td className="highlighted">{p.full_name || "—"}</td>
                  <td>{p.external_id || "—"}</td>
                  <td>{p.protocol_name}</td>
                  <td>{p.birth_date ? new Date(p.birth_date).toLocaleDateString() : "—"}</td>
                  <td>{p.sex 
                    ? t(`participantDashboard.modal.gender.${p.sex}`, { defaultValue: p.sex }) 
                    : "—"
                  }</td>
                  <td>{p.contact_email || "—"}</td>
                  <td>{p.contact_phone || "—"}</td>
                  <td className="cell-notes" title={p.notes}>{p.notes || "—"}</td>
                  <td className="actions" onClick={(e) => e.stopPropagation()}>
                    <button className="btn-edit" onClick={() => onEdit(p)}>
                      {t("participantDashboard.buttons.edit")}
                    </button>
                    <button 
                      className="btn-assign"
                      onClick={() => onAssignProtocol(p)}
                      title={t("participants.actions.assign", "Assign Other Protocol")}
                    >
                      <AssignIcon />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
  );
}