import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import namespaces
import enCommon from "./en/common.json";
import enTasks from "./en/tasks.json";
import enRecorder from "./en/recorder.json";
import enAdmin from "./en/admin.json";

import csCommon from "./cs/common.json";
import csTasks from "./cs/tasks.json";
import csRecorder from "./cs/recorder.json";
import csAdmin from "./cs/admin.json";

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    lng: "en",
    ns: ["common", "tasks", "recorder", "admin"],
    defaultNS: "common",
    resources: {
      en: {
        common: enCommon,
        tasks: enTasks,
        recorder: enRecorder,
        admin: enAdmin
      },
      cs: {
        common: csCommon,
        tasks: csTasks,
        recorder: csRecorder,
        admin: csAdmin
      }
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
