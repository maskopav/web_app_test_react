// src/components/AdminTaskEditor/QuestionnaireModal.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "./Modal";

export default function QuestionnaireModal({ open, onClose, onSave }) {
  const { t } = useTranslation("admin");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: "",
        type: "open", // default type
        options: [],
      },
    ]);
  };

  const updateQuestion = (id, key, value) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [key]: value } : q))
    );
  };

  const addOption = (questionId) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? { ...q, options: [...q.options, ""] }
          : q
      )
    );
  };

  const updateOption = (questionId, index, value) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt, i) =>
                i === index ? value : opt
              ),
            }
          : q
      )
    );
  };

  const removeOption = (questionId, index) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.filter((_, i) => i !== index),
            }
          : q
      )
    );
  };

  const removeQuestion = (id) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleSave = () => {
    const questionnaire = { title, description, questions };
    console.log("Questionnaire JSON:", JSON.stringify(questionnaire, null, 2));
    onSave(questionnaire);
  };

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} onSave={handleSave}>
      <div className="modal-title">{t("addQuestionnaire")}</div>

      <div className="questionnaire-form">
        {/* Header Section */}
        <div className="questionnaire-header">
          <label>{t("questionnaire.questionnaireTitle")}</label>
          <input
            type="text"
            value={title}
            placeholder={t("questionnaire.enterTitle")}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>{t("questionnaire.questionnaireDescription")}</label>
          <textarea
            value={description}
            placeholder={t("questionnaire.enterDescription")}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </div>

        {/* Questions Section */}
        <div className="question-section">
          {questions.map((q, idx) => (
            <div key={q.id} className="question-block compact">
            <div className="question-header">
              <strong>{t("questionnaire.question")} {idx + 1}</strong>
              <button
                className="btn-remove-question-icon"
                onClick={() => removeQuestion(q.id)}
                title={t("questionnaire.removeQuestion")}
              >
                ✖
              </button>
            </div>
            
            <div className="form-group small">
              <label>{t("questionnaire.question")}</label>
              <input
                type="text"
                value={q.text}
                placeholder={t("questionnaire.enterQuestionText")}
                onChange={(e) => updateQuestion(q.id, "text", e.target.value)}
              />
            </div>
          
            <div className="form-group small">
              <label>{t("questionnaire.answerType")}</label>
              <select
                value={q.type}
                onChange={(e) => {
                  const newType = e.target.value;
                  updateQuestion(q.id, "type", newType);
                  if (newType === "open") updateQuestion(q.id, "options", []);
                }}
              >
                <option value="open">{t("questionnaire.Open answer")}</option>
                <option value="single">{t("questionnaire.Single choice")}</option>
                <option value="multiple">{t("questionnaire.Multiple choice")}</option>
                <option value="dropdown">{t("questionnaire.Dropdown")}</option>
              </select>
            </div>

              {/* Options for non-open types */}
              {q.type !== "open" && (
                <div className="options-section">
                  <div className="question-header">
                  <label>{t("questionnaire.answerOptions")}</label>
                  <button
                    className="btn-add-option"
                    onClick={() => addOption(q.id)}
                  >
                    + {t("questionnaire.addOption")}
                  </button>
                  </div>
                  {q.options.map((opt, i) => (
                    <div key={i} className="option-item">
                      <input
                        type="text"
                        value={opt}
                        placeholder={`${t("questionnaire.Option")} ${i + 1}`}
                        onChange={(e) =>
                          updateOption(q.id, i, e.target.value)
                        }
                      />
                      <button
                        className="btn-remove-option"
                        onClick={() => removeOption(q.id, i)}
                      >
                        ✖
                      </button>
                    </div>
                  ))}
                  
                </div>
              )}
            </div>
          ))}

          <button className="btn-add-questionnaire" onClick={addQuestion}>
            + {t("questionnaire.addQuestion")}
          </button>
        </div>
      </div>
    </Modal>
  );
}
