import React from "react";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../i18n";

export default function ProtocolLanguageSelector({ value, onChange }) {
  const { t } = useTranslation(["admin"]);

  return (
    <div className="protocol-field">
      <label className="protocol-label">
        {t("protocolEditor.protocolLanguage")}
      </label>
      <select
        className="protocol-language-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}
