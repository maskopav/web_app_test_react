// src/tasks.js
import { t } from "i18next";

// NOTE: Tasks will appear in this order
export const TASKS = () => [
  {
    type: "voice",
    title: t("tasks.prolongedPhonationA.title"),
    subtitle: t("tasks.prolongedPhonationA.subtitle"),
  },
  {
    type: "voice",
    title: t("tasks.pataka.title"),
    subtitle: t("tasks.pataka.subtitle"),
    audioExample: "/audio/pataka.mp3",
    maxDuration: 10,
  },
  {
    type: "voice",
    title: t("tasks.readingSeedling.title"),
    subtitle: t("tasks.readingSeedling.subtitle"),
    subtitleActive: t("tasks.readingSeedling.subtitleActive"),
  }
];
