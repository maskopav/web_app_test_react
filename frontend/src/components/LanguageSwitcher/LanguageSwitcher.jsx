// src/components/LanguageSwitcher.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../../i18n/index";
import "./LanguageSwitcher.css";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { t } = useTranslation(["admin"]);

  const handleChange = (event) => {
    const newLang = event.target.value;
    i18n.changeLanguage(newLang);
    localStorage.setItem("appLanguage", newLang);
  };

  React.useEffect(() => {
    const savedLang = localStorage.getItem("appLanguage");
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
  }, []);

  return (
    <div className="language-switcher">
      <label className="protocol-language-label">{t("protocolEditor.editorLanguage")}
        <select 
          className="language-select"
          value={i18n.language} 
          onChange={handleChange}
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
