// src/pages/ParticipantInterfaceLoader.jsx
import { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProtocolContext } from "../context/ProtocolContext";
import { useMappings } from "../context/MappingContext";
import { fetchParticipantProtocol } from "../api/participantProtocols";
import { initSession } from "../api/sessions";

export default function ParticipantInterfaceLoader() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { setSelectedProtocol } = useContext(ProtocolContext);
  const { mappings } = useMappings();

  const [loading, setLoading] = useState(true);

  // Ref to track if we have already started initialization
  const didInit = useRef(false);

  useEffect(() => {
    // Ensure mappings (languages and tasks) are loaded before running logic.
    // This effect will re-run automatically when 'mappings' updates.
    if (!mappings || !mappings.languages || !mappings.tasks) {
      return;
    }

    // Prevent double-execution (React Strict Mode fix)
    if (didInit.current) {
      return;
    }
    didInit.current = true; // Mark as running

    async function load() {
      try {
        // 1. call backend to resolve token
        const response = await fetchParticipantProtocol(token);
        console.log(response);
        // response contains:
        // {
        //   participant: {...}
        //   project_protocol: {...}
        //   protocol: {... raw protocol ...}
        // }
        const rawProtocol = response.protocol;
        if (!rawProtocol) throw new Error("Protocol missing");

        // 2. Initialize Session (Track visit)
        // We do this in parallel or sequence. Sequence is safer to ensure we have a session ID.
        let sessionId = null;
        try {
            const sessionData = await initSession(token);
            sessionId = sessionData.sessionId;
            console.log("Session started:", sessionId);
        } catch (err) {
            console.error("Warning: Could not init session, proceeding anyway", err);
            // Decide if you want to block user or let them continue without tracking
        }

        // 3. Map Data using existing function
        const mapped = mapProtocol(rawProtocol, mappings);

        // save to global context
        setSelectedProtocol(mapped);

        // --- 3) navigate to real participant interface
        navigate("/participant/interface", {
          replace: true,
          state: {
            protocol: mapped,
            testingMode: false,
            editingMode: false,
            participant: response.participant,
            token,
            sessionId
          }
        });

     } catch (e) {
        console.error(e);
        navigate("/404", { replace: true });
     } finally {
        setLoading(false);
     }
    }

    load();
  }, [token, mappings, navigate, setSelectedProtocol]);

  if (loading) return <p>Loading…</p>;
  return null;
}


// --- helper
function mapProtocol(raw, mappings) {
  const language = mappings.languages.find(l => l.id === raw.language_id);
  const mappedTasks = raw.tasks.map(t => {
    const taskDef = mappings.tasks.find(def => def.id === t.task_id);
    return {
      ...t.params,
      category: taskDef?.category || "unknown",
      task_order: t.task_order,
      protocol_task_id: t.protocol_task_id
    };
  });
  return {
    id: raw.id,
    name: raw.name,
    version: raw.version,
    description: raw.description,
    protocol_group_id: raw.protocol_group_id,
    language: language?.code || "en",
    tasks: mappedTasks,
  };
}
