// src/components/Questionnaire/Questionnaire.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./Questionnaire.css";

export default function Questionnaire({ data, onNextTask }) {
  const { t } = useTranslation(["common", "admin"]);
  const [answers, setAnswers] = useState({});

  const handleChange = (questionId, value, type) => {
    setAnswers((prev) => {
      // Handle multiple choice (checkboxes) specifically
      if (type === "multiple") {
        const current = prev[questionId] || [];
        if (current.includes(value)) {
          return { ...prev, [questionId]: current.filter((v) => v !== value) };
        } else {
          return { ...prev, [questionId]: [...current, value] };
        }
      }
      // Handle other types (single value)
      return { ...prev, [questionId]: value };
    });
  };

  const handleSubmit = () => {
    // Package the result
    const result = {
      taskType: "questionnaire",
      questionnaireTitle: data.title,
      timestamp: new Date().toISOString(),
      answers: Object.entries(answers).map(([qId, val]) => ({
        questionId: qId,
        questionText: data.questions.find(q => q.id === Number(qId))?.text,
        answer: val
      }))
    };
    
    onNextTask(result);
  };

  if (!data || !data.questions) return null;

  return (
    <div className="questionnaire-container">
      <div className="questionnaire-header-section">
        <h2>{data.title || t("protocolEditor.questionnaire.title", { ns: "admin", defaultValue: "Questionnaire" })}</h2>
        {data.description && <p className="questionnaire-description">{data.description}</p>}
      </div>

      <div className="questions-list">
        {data.questions.map((q, index) => (
          <div key={q.id} className="question-card">
            <h4 className="question-text">
              <span className="question-number">{index + 1}.</span> {q.text}
            </h4>

            <div className="answer-area">
              {/* OPEN ANSWER */}
              {q.type === "open" && (
                <textarea
                  className="answer-input-text"
                  rows={3}
                  placeholder={t("protocolEditor.questionnaire.enterAnswer", { ns: "admin", defaultValue: "Your answer..." })}
                  value={answers[q.id] || ""}
                  onChange={(e) => handleChange(q.id, e.target.value, "open")}
                />
              )}

              {/* SINGLE CHOICE (RADIO) */}
              {q.type === "single" && (
                <div className="options-group">
                  {q.options?.map((opt, i) => (
                    <label key={i} className="option-label">
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        value={opt}
                        checked={answers[q.id] === opt}
                        onChange={() => handleChange(q.id, opt, "single")}
                      />
                      <span className="option-text">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* MULTIPLE CHOICE (CHECKBOX) */}
              {q.type === "multiple" && (
                <div className="options-group">
                  {q.options?.map((opt, i) => (
                    <label key={i} className="option-label">
                      <input
                        type="checkbox"
                        name={`q-${q.id}`}
                        value={opt}
                        checked={(answers[q.id] || []).includes(opt)}
                        onChange={() => handleChange(q.id, opt, "multiple")}
                      />
                      <span className="option-text">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* DROPDOWN */}
              {q.type === "dropdown" && (
                <select
                  className="answer-select"
                  value={answers[q.id] || ""}
                  onChange={(e) => handleChange(q.id, e.target.value, "dropdown")}
                >
                  <option value="" disabled>
                    -- {t("protocolEditor.questionnaire.selectOption", { ns: "admin", defaultValue: "Select an option" })} --
                  </option>
                  {q.options?.map((opt, i) => (
                    <option key={i} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="questionnaire-footer">
        <button className="btn-submit-questionnaire" onClick={handleSubmit}>
          {t("buttons.next", { ns: "common" })}
        </button>
      </div>
    </div>
  );
}