// src/hooks/useProtocolManager.js
import { saveProtocolToBackend } from "../api/protocols";
import { useMappings } from "../context/MappingContext";

export function useProtocolManager() {
  const { mappings } = useMappings();

  async function saveNewProtocol(tasks, selectedProtocol) {
    console.log(tasks);
    console.log(selectedProtocol);

    const languageId = mappings.languages.find(l => l.code === selectedProtocol.language)?.id;

    const protocolData = {
      name: selectedProtocol.name,
      language_id: languageId,
      description: selectedProtocol.description,
      created_by: 1,
      tasks: tasks.map((task, index) => ({
        task_id: mappings.tasks.find(t => t.category === task.category)?.id,
        task_order: index + 1,
        params: task,
      })),
    };
    console.log("Saving protocol:", protocolData);
    const result = await saveProtocolToBackend(protocolData);
    return result;
  }

  return { saveNewProtocol };
}
