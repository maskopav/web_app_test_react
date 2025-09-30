import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import de from "./de.json";
import cs from "./cs.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    de: { translation: de },
    cs: { translation: cs },
  },
  lng: "cs", // default language
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

export default i18n;
