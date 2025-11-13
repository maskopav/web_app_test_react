// src/components/ProtocolEditor/TaskList.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { taskBaseConfig } from "../../config/tasksBase";
import { translateTaskName, translateTaskDescription, getAllParams, getDefaultParams } from "../../utils/translations";
import InfoTooltip from "./InfoTooltip";

export default function TaskList({ onCreate }) {
  const { t } = useTranslation(["admin", "tasks", "common"]);
  const [expandedTypes, setExpandedTypes] = useState({});

  // Group tasks by their `type`
  const tasksByType = Object.entries(taskBaseConfig).reduce((acc, [category, task]) => {
    const type = task.type || "other";
    if (!acc[type]) acc[type] = [];
    acc[type].push({ category, ...task });
    return acc;
  }, {});

  const toggleType = (type) => {
    setExpandedTypes((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <div className="task-section">
      <h3 className="task-list-title">{t("protocolEditor.availableTasks")}</h3>
      
      <ul className="task-type-list">
        {Object.keys(tasksByType).map((type) => (
          <li key={type} className="task-type">
            {/* TYPE HEADER */}
            <div
              className="task-type-header"
              onClick={() => toggleType(type)}
            >
              <span>{t(`taskLabels.${type}`, { ns: "common", defaultValue: type })}</span>
              <span>{expandedTypes[type] ? "▲" : "▼"}</span>
            </div>

            {/* TASK LIST FOR THIS TYPE */}
            {expandedTypes[type] && (
            <ul className="task-list">
              {tasksByType[type].map(({ category }) => {
              //{Object.keys(taskBaseConfig).map((cat) => {
                const translatedName = translateTaskName(category);
                const description = translateTaskDescription(category);
                const params = getAllParams(category);
                const defaults = getDefaultParams(category);

                return (
                  <li key={category} className="task-option" onClick={() => onCreate(category)}>
                    <div className="task-title">
                      {translatedName}
                      <InfoTooltip text={description} />
                    </div>
                    <div className="param-inline">
                      {Object.entries(params).map(([key, p], i) => {
                        const val = defaults[key] ?? p.default ?? "";
                        const enumLabel = p.values?.find((v) => v.key === val)?.label || val;
                        return (
                          <span key={key}>
                            {i > 0 && " • "}
                            <strong>{p.label}:</strong> <em>{enumLabel}</em>
                          </span>
                        );
                      })}
                    </div>
                  </li>
                );
              })}
            </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
