import React from "react";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../i18n";

export default function ProtocolLanguageSelector({ value, onChange }) {
  const { t } = useTranslation(["admin", "common"]);

  return (
    <label className="protocol-language-label">
      {t("protocolLanguage")}
      <select
        className="language-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </label>
  );
}
