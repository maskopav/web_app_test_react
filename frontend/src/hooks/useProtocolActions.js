import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ProtocolContext } from "../context/ProtocolContext";
import { useMappings } from "../context/MappingContext";
import { getProtocolById } from "../api/protocols";

export function useProtocolActions() {
  const { setSelectedProtocol } = useContext(ProtocolContext);
  const { mappings } = useMappings();
  const navigate = useNavigate();

  async function viewProtocol(protocolId) {
    console.log("Getting protocolId:", protocolId);

    try {
      const rawProtocol = await getProtocolById(protocolId);
      const mappedProtocol = mapProtocolWithNames(rawProtocol, mappings);

      setSelectedProtocol(mappedProtocol);

      navigate("/participant/test", {
        state: {
          testing: true,
          protocol: mappedProtocol,
        },
      });
    } catch (error) {
      console.error("Error loading protocol:", error);
      alert("Failed to load protocol");
    }
  }

  return { viewProtocol };
}

/**
 * Reverse-map backend IDs into readable protocol object.
 */
function mapProtocolWithNames(raw, mappings) {
  if (!raw || !mappings) return null;

  const language = mappings.languages.find(l => l.id === raw.language_id);
  const mappedTasks = raw.tasks.map(t => {
    const taskDef = mappings.tasks.find(task => task.id === t.task_id);
    return {
      ...t.params,
      category: taskDef?.category || `unknown(${t.task_id})`,
      task_order: t.task_order,
    };
  });

  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    language: language?.code || "unknown",
    tasks: mappedTasks,
  };
}
