import { saveProtocol } from "../api/protocols";

export function useProtocolManager() {
  async function saveNewProtocol(tasks, languageId, mappings) {
    const protocolData = {
      name: "Placeholder protocol name 9",
      language_id: languageId,
      description: "Created via AdminTaskEditor",
      created_by: 1,
      tasks: tasks.map((task, index) => ({
        task_id: mappings.tasks.find(t => t.key === task.category)?.id,
        task_order: index + 1,
        params: task,
      })),
    };
    return await saveProtocol(protocolData);
  }

  return { saveNewProtocol };
}
