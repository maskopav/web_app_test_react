import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./i18n/en.json";
//import de from "./i18/de.json";
//import cs from "./i18/cs.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    //de: { translation: de },
    //cs: { translation: cs },
  },
  lng: "en", // default language
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

export default i18n;
