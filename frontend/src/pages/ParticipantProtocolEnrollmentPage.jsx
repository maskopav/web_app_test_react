import { useState, useEffect } from "react";
import { createParticipantProtocol } from "../api/participantProtocols";
import { useMappings } from "../context/MappingContext";

export default function ParticipantAssignmentPage() {
  const { mappings } = useMappings();
  const [participantId, setParticipantId] = useState("");
  const [projectProtocolId, setProjectProtocolId] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");

  async function handleGenerate() {
    try {
      const result = await createParticipantProtocol(participantId, projectProtocolId);
      const token = result.unique_token;

      setGeneratedLink(`${window.location.origin}/participant/${token}`);
    } catch (err) {
      alert("Failed to generate link");
    }
  }

  return (
    <div>
      <h2>Generate Participant Link</h2>

      <label>Participant</label>
      <select value={participantId} onChange={e => setParticipantId(e.target.value)}>
        <option value="">--select--</option>
        {mappings.participants?.map(p => (
          <option key={p.id} value={p.id}>{p.full_name}</option>
        ))}
      </select>

      <label>Project Protocol</label>
      <select value={projectProtocolId} onChange={e => setProjectProtocolId(e.target.value)}>
        <option value="">--select--</option>
        {mappings.project_protocols?.map(pp => (
          <option key={pp.id} value={pp.id}>
            {pp.id} – protocol {pp.protocol_id}
          </option>
        ))}
      </select>

      <button onClick={handleGenerate} disabled={!participantId || !projectProtocolId}>
        Generate Link
      </button>

      {generatedLink && (
        <div>
          <p>Generated link:</p>
          <code>{generatedLink}</code>
        </div>
      )}
    </div>
  );
}
