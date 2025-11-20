// src/components/ParticipantProtocolTable/ParticipantProtocolTable.jsx
import React from "react";
import "./ParticipantProtocolTable.css";

export default function ParticipantProtocolTable({ rows }) {
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
              </tr>
            </thead>

            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-row">No assignments found</td>
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
