// src/components/ParticipantProtocolTable/ParticipantProtocolTable.jsx
import React from "react";
import "./ParticipantProtocolTable.css";
import {
    activateParticipantProtocol,
    deactivateParticipantProtocol
  } from "../../api/participantProtocols";

  export default function ParticipantProtocolTable({ rows, onRefresh }) {
  
    async function handleActivate(id, protocolName, participantName) {
      const ok = window.confirm(
        `Send protocol "${protocolName}" to participant "${participantName}"?`
      );
      if (!ok) return;
  
      await activateParticipantProtocol(id);
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
                  <th>Active</th>
                  <th>Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
  
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="empty-row">No assignments found</td>
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
                      <td>{r.is_active ? "Yes" : "No"}</td>
  
                      <td className="actions">
  
                        {!r.is_active && (
                          <button
                            className="btn-view"
                            onClick={() =>
                              handleActivate(
                                r.participant_protocol_id,
                                r.protocol_name,
                                r.full_name
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
  
      </div>
    );
  }