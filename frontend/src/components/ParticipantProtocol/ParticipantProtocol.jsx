// src/components/ParticipantProtocol/ParticipantProtocol.jsx
import React, { useState } from "react";
import "./ParticipantProtocol.css";
import {
  activateParticipantProtocol,
  deactivateParticipantProtocol,
} from "../../api/participantProtocols";
import AssignmentSuccessModal from "./AssignmentSuccessModal";
import { useTranslation } from "react-i18next";
import { useConfirm } from "../ConfirmDialog/ConfirmDialogContext";

export default function ParticipantProtocolTable({ rows, onRefresh }) {
  const { t } = useTranslation(["admin"]);
  const confirm = useConfirm();

  const [showModal, setShowModal] = useState(false);
  const [modalLink, setModalLink] = useState("");
  const [modalText, setModalText] = useState("");

  async function handleActivate(id, protocolName, participantName, uniqueToken) {
    const ok = await confirm({
      title: t("participantProtocol.confirm.assign.title"),
      message: t("participantProtocol.confirm.assign.message", {
        protocol: protocolName,
        participant: participantName,
      }),
      confirmText: t("participantProtocol.confirm.confirm"),
      cancelText: t("participantProtocol.confirm.cancel"),
    });
    
    if (!ok) return;
    

    await activateParticipantProtocol(id);

    const link = `${window.location.origin}/#/participant/${uniqueToken}`;
    const emailText = generateEmail(participantName, link);

    setModalLink(link);
    setModalText(emailText);
    setShowModal(true);

    onRefresh && onRefresh();
  }

  function generateEmail(name, link) {
    const finalName = name || t("assignmentModal.participant");
  
    return t("assignmentModal.emailText", {
      name: finalName,
      link,
    });
  }
  

  async function handleDeactivate(id, protocolName, participantName) {
    const ok = await confirm({
      title: t("participantProtocol.confirm.end.title"),
      message: t("participantProtocol.confirm.end.message", {
        protocol: protocolName,
        participant: participantName,
      }),
      confirmText: t("participantProtocol.confirm.confirm"),
      cancelText: t("participantProtocol.confirm.cancel"),
    });
    
    if (!ok) return;

    await deactivateParticipantProtocol(id);
    onRefresh && onRefresh();
  }

  return (
    <div className="protocols-container">
      <div className="protocol-list card">
        <div className="protocol-list-header">
          <h3>{t("participantProtocol.title")}</h3>
        </div>

        <div className="protocol-table-wrapper">
          <table className="protocol-table">
            <thead>
              <tr>
                <th>{t("participantProtocol.table.participant")}</th>
                <th>{t("participantProtocol.table.externalId")}</th>
                <th>{t("participantProtocol.table.protocol")}</th>
                <th>{t("participantProtocol.table.version")}</th>
                <th>{t("participantProtocol.table.project")}</th>
                <th>{t("participantProtocol.table.start")}</th>
                <th>{t("participantProtocol.table.end")}</th>
                <th>{t("participantProtocol.table.status")}</th>
                <th>{t("participantProtocol.table.actions")}</th>
              </tr>
            </thead>

            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan="9" className="empty-row">
                    {t("participantProtocol.noAssignments")}
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.participant_protocol_id}>
                    <td className="highlighted">{r.full_name}</td>
                    <td>{r.external_id || "-"}</td>
                    <td>{r.protocol_name}</td>
                    <td>{r.protocol_version}</td>
                    <td>{r.project_name}</td>
                    <td>{r.start_date?.slice(0, 10)}</td>
                    <td>{r.end_date?.slice(0, 10) || "-"}</td>
                    <td>
                      {r.is_active
                        ? t("participantProtocol.status.active")
                        : t("participantProtocol.status.inactive")}
                    </td>

                    <td className="actions">
                      {r.is_active == 0 && (
                        <button
                          className="btn-view"
                          onClick={() =>
                            handleActivate(
                              r.participant_protocol_id,
                              r.protocol_name,
                              r.full_name,
                              r.access_token
                            )
                          }
                        >
                          {t("participantProtocol.buttons.assign")}
                        </button>
                      )}

                      {r.is_active == 1 && (
                        <>
                          <button
                            className="btn-edit"
                            onClick={() =>
                              handleDeactivate(
                                r.participant_protocol_id,
                                r.protocol_name,
                                r.full_name
                              )
                            }
                          >
                            {t("participantProtocol.buttons.end")}
                          </button>

                          {/* EXTRA BUTTON TO SHOW MODAL */}
                          <button
                            className="btn-show-modal"
                            onClick={() => {
                              const link = `${window.location.origin}/#/participant/${r.access_token}`;
                              const emailText = generateEmail(
                                r.full_name,
                                link
                              );
                              setModalLink(link);
                              setModalText(emailText);
                              setShowModal(true);
                            }}
                          >
                            {t("participantProtocol.buttons.showModal")}
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <AssignmentSuccessModal
          link={modalLink}
          emailText={modalText}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
