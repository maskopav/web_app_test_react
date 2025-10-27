import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Modal from "./Modal";
import {
  getAllParams,
  translateTaskName,
  translateTaskDescription,
} from "../../utils/translations";
import InfoTooltip from "./InfoTooltip";

export default function TaskModal({
  open,
  creatingNewTask,
  editingTask,
  editingData,
  setEditingData,
  tasks,
  onClose,
  onSave,
}) {
  const { t } = useTranslation(["admin", "tasks"]);

  // Initialize editing data when modal opens (like in original code)
  useEffect(() => {
    if (!open) return;
    if (!editingData && !creatingNewTask && editingTask != null && tasks?.[editingTask]) {
      setEditingData({ ...tasks[editingTask] });
    }
  }, [open, editingTask, editingData, creatingNewTask, tasks, setEditingData]);

  if (!open) return null;

  const category = creatingNewTask
    ? editingData?.category
    : tasks?.[editingTask]?.category;

  if (!category) return null;

  const params = getAllParams(category);
  const translatedName = translateTaskName(category);
  const description = translateTaskDescription(category);

  const handleSave = () => {
    onSave(editingData);
  };

  return (
    <Modal open={open} onClose={onClose} onSave={handleSave}>
      <div className="modal-title">
        {creatingNewTask
          ? t("addTask", { category: translatedName })
          : t("editTask", { category: translatedName })}
      </div>

      <div className="modal-form">
        {Object.keys(params).map((param) => {
          const paramInfo = params[param];

          const currentValue = editingData?.[param];
          const value =
            currentValue !== undefined && currentValue !== null
              ? currentValue
              : paramInfo.default ?? "";

          const hasEnumValues = paramInfo.values && paramInfo.values.length > 0;
          const isNumeric = paramInfo.type === "number";

          return (
            <div key={param} className="form-group">
              <label>{paramInfo.label}</label>

              {hasEnumValues ? (
                <select
                  value={value}
                  onChange={(e) =>
                    setEditingData((prev) => ({
                      ...prev,
                      [param]: e.target.value,
                    }))
                  }
                >
                  {paramInfo.values.map((v) => (
                    <option key={v.key} value={v.key}>
                      {v.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={isNumeric ? "number" : "text"}
                  value={value}
                  onChange={(e) =>
                    setEditingData((prev) => ({
                      ...prev,
                      [param]: isNumeric
                        ? Number(e.target.value)
                        : e.target.value,
                    }))
                  }
                />
              )}
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
