// src/components/ProtocolEditor/TaskList.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import { taskBaseConfig } from "../../config/tasksBase";
import { translateTaskName, translateTaskDescription, getAllParams, getDefaultParams } from "../../utils/translations";
import InfoTooltip from "./InfoTooltip";

export default function TaskList({ onCreate }) {
  const { t } = useTranslation(["admin", "tasks"]);

  return (
    <div className="task-section">
      <h3>{t("availableTasks")}</h3>
      <ul className="task-list">
        {Object.keys(taskBaseConfig).map((cat) => {
          const translatedName = translateTaskName(cat);
          const description = translateTaskDescription(cat);
          const params = getAllParams(cat);
          const defaults = getDefaultParams(cat);

          return (
            <li key={cat} className="task-option" onClick={() => onCreate(cat)}>
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
    </div>
  );
}
