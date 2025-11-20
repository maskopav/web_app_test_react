import React, { useState } from "react";
import "./ParticipantProtocol.css";
import {
  activateParticipantProtocol,
  deactivateParticipantProtocol
} from "../../api/participantProtocols";
import AssignmentSuccessModal from "./AssignmentSuccessModal";

export default function ParticipantProtocolTable({ rows, onRefresh }) {
  const [showModal, setShowModal] = useState(false);
  const [modalLink, setModalLink] = useState("");
  const [modalText, setModalText] = useState("");

  async function handleActivate(id, protocolName, participantName, uniqueToken) {
    const ok = window.confirm(
      `Send protocol "${protocolName}" to participant "${participantName}"?`
    );
    if (!ok) return;

    await activateParticipantProtocol(id);
    const link = `${window.location.origin}/participant/${uniqueToken}`;

    const emailText = `Dear ${participantName},

You have been assigned a new assessment protocol.
Please open the following link:

${link}

If you prefer, you may scan the QR code in the attached image.

Thank you.`;

    setModalLink(link);
    setModalText(emailText);
    setShowModal(true);

    onRefresh && onRefresh();
  }

  async function handleDeactivate(id, protocolName, participantName) {
    const ok = window.confirm(
      `End assignment of "${protocolName}" for "${participantName}"?`
    );
    if (!ok) return;

    await deactivateParticipantProtocol(id);
    onRefresh && onRefresh();
  }

  return (
    <div className="protocols-container">
      <div className="protocol-list card">
        <div className="protocol-list-header">
          <h3>Participant–Protocol Assignments</h3>
        </div>

        <div className="protocol-table-wrapper">
          <table className="protocol-table">
            <thead>
              <tr>
                <th>Participant</th>
                <th>External ID</th>
                <th>Protocol</th>
                <th>Version</th>
                <th>Project</th>
                <th>Start</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-row">
                    No assignments found
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
                    <td>{r.is_active ? "Active" : "Inactive"}</td>

                    <td className="actions">
                      {!r.is_active && (
                        <button
                          className="btn-view"
                          onClick={() =>
                            handleActivate(
                              r.participant_protocol_id,
                              r.protocol_name,
                              r.full_name,
                              r.unique_token
                            )
                          }
                        >
                          Assign
                        </button>
                      )}

                      {r.is_active && (
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
                          End
                        </button>
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
