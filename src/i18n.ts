import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Importieren der Übersetzungsdateien
import translationEN from "./locales/en/translation.json";
import translationDE from "./locales/de/translation.json";

// Ressourcen für die Übersetzungen
const resources = {
  en: {
    translation: translationEN,
  },
  de: {
    translation: translationDE,
  },
};


i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: "en", // Standard-Sprache, wenn keine andere gefunden wird
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: [
        "navigator"
      ]
    },
  });

export default i18n;
