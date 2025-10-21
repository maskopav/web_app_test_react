// src/components/AdminTaskEditor/QuestionnaireModal.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "./Modal";

export default function QuestionnaireModal({ open, onClose, onSave }) {
  const { t } = useTranslation("admin");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = () => {
    const questionnaire = { title, description };
    onSave(questionnaire);
  };

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} onSave={handleSave}>
      <div className="modal-title">{t("addQuestionnaire")}</div>

      <div className="modal-form">
        <div className="form-group">
          <label>{t("questionnaireTitle")}</label>
          <input
            type="text"
            value={title}
            placeholder={t("enterTitle")}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>{t("questionnaireDescription")}</label>
          <textarea
            value={description}
            placeholder={t("enterDescription")}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
}
