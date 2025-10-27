// src/components/CompletionScreen.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import doneCheckmarkIcon from "../assets/done-checkmark-icon.svg";

export default function CompletionScreen() {
  const { t } = useTranslation();

  return (
    <div className="completion-screen">
      <h1>{t("completion.title")}</h1>
      <p>{t("completion.message")}</p>
      <img
        src={doneCheckmarkIcon}
        alt="Completion checkmark"
        style={{ width: 120, height: 120 }}
      />
    </div>
  );
}
