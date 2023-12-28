import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Importieren der Übersetzungsdateien
import translationEN from "./locales/en/translation.json";
import translationDE from "./locales/de/translation.json";
import translationES from "./locales/es/translation.json";
import translationFR from "./locales/fr/translation.json";
import translationZH from "./locales/zh/translation.json";

import translationAR from "./locales/ar/translation.json";
import translationHI from "./locales/hi/translation.json";
import translationJA from "./locales/ja/translation.json";
import translationKO from "./locales/ko/translation.json";
import translationPT from "./locales/pt/translation.json";




const resources = {
  en: {
    translation: translationEN,
  },
  de: {
    translation: translationDE,
  },
  es: {
    translation: translationES,
  },
  fr: {
    translation: translationFR,
  },
  zh: {
    translation: translationZH,
  },
  ar: {
    translation: translationAR,
  },
  hi: {
    translation: translationHI,
  },
  ja: {
    translation: translationJA,
  },
  ko: {
    translation: translationKO,
  },
  pt: {
    translation: translationPT,
  },
};

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: {
      "de-AT": ["de"], // Deutsch (Österreich) auf Deutsch
      "de-CH": ["de"], // Deutsch (Schweiz) auf Deutsch
      "de-DE": ["de"], // Deutsch (Deutschland) auf Deutsch
      "de-LI": ["de"], // Deutsch (Liechtenstein) auf Deutsch
      "de-LU": ["de"], // Deutsch (Luxemburg) auf Deutsch

      "es-AR": ["es"], // Spanisch (Argentinien) auf Spanisch
      "es-BO": ["es"], // Spanisch (Bolivien) auf Spanisch
      "es-CL": ["es"], // Spanisch (Chile) auf Spanisch
      "es-CO": ["es"], // Spanisch (Kolumbien) auf Spanisch
      "es-CR": ["es"], // Spanisch (Costa Rica) auf Spanisch
      "es-DO": ["es"], // Spanisch (Dominikanische Republik) auf Spanisch
      "es-EC": ["es"], // Spanisch (Ecuador) auf Spanisch
      "es-SV": ["es"], // Spanisch (El Salvador) auf Spanisch
      "es-GT": ["es"], // Spanisch (Guatemala) auf Spanisch
      "es-HN": ["es"], // Spanisch (Honduras) auf Spanisch
      "es-MX": ["es"], // Spanisch (Mexiko) auf Spanisch
      "es-NI": ["es"], // Spanisch (Nicaragua) auf Spanisch
      "es-PA": ["es"], // Spanisch (Panama) auf Spanisch
      "es-PY": ["es"], // Spanisch (Paraguay) auf Spanisch
      "es-PE": ["es"], // Spanisch (Peru) auf Spanisch
      "es-PR": ["es"], // Spanisch (Puerto Rico) auf Spanisch
      "es-ES": ["es"], // Spanisch (Spanien) auf Spanisch
      "es-US": ["es"], // Spanisch (USA) auf Spanisch
      "es-UY": ["es"], // Spanisch (Uruguay) auf Spanisch
      "es-VE": ["es"], // Spanisch (Venezuela) auf Spanisch

      "fr-CA": ["fr"], // Französisch (Kanada) auf Französisch
      "fr-BE": ["fr"], // Französisch (Belgien) auf Französisch
      "fr-CH": ["fr"], // Französisch (Schweiz) auf Französisch
      "fr-FR": ["fr"], // Französisch (Frankreich) auf Französisch
      "fr-LU": ["fr"], // Französisch (Luxemburg) auf Französisch
      "fr-MC": ["fr"], // Französisch (Monaco) auf Französisch

      "zh-CN": ["zh"], // Vereinfachtes Chinesisch (China)
      "zh-SG": ["zh"], // Singapur-Chinesisch auf vereinfachtes Chinesisch
      "zh-TW": ["zh"], // Traditionelles Chinesisch (Taiwan) auf vereinfachtes Chinesisch
      "zh-HK": ["zh"], // Traditionelles Chinesisch (Hongkong) auf vereinfachtes Chinesisch
      "zh-MO": ["zh"], // Traditionelles Chinesisch (Macao) auf vereinfachtes Chinesisch

      // Hindi Fallbacks
      "hi-IN": ["hi"],

      // Japanisch Fallbacks
      "ja-JP": ["ja"],

      // Koreanisch Fallbacks
      "ko-KR": ["ko"],

      // Portugiesisch Fallbacks
      "pt-BR": ["pt"], // Brasilien
      "pt-PT": ["pt"], // Portugal
      "pt-AO": ["pt"], // Angola
      "pt-MZ": ["pt"], // Mosambik
      "pt-GW": ["pt"], // Guinea-Bissau
      "pt-ST": ["pt"], // São Tomé und Príncipe
      "pt-CV": ["pt"], // Kap Verde
      "pt-TL": ["pt"], // Osttimor

      // Arabisch Fallbacks
      "ar-DZ": ["ar"], // Algerien
      "ar-BH": ["ar"], // Bahrain
      "ar-TD": ["ar"], // Tschad
      "ar-KM": ["ar"], // Komoren
      "ar-DJ": ["ar"], // Dschibuti
      "ar-EG": ["ar"], // Ägypten
      "ar-ER": ["ar"], // Eritrea
      "ar-IQ": ["ar"], // Irak
      "ar-IL": ["ar"], // Israel
      "ar-JO": ["ar"], // Jordanien
      "ar-KW": ["ar"], // Kuwait
      "ar-LB": ["ar"], // Libanon
      "ar-LY": ["ar"], // Libyen
      "ar-MR": ["ar"], // Mauretanien
      "ar-MA": ["ar"], // Marokko
      "ar-OM": ["ar"], // Oman
      "ar-PS": ["ar"], // Palästina
      "ar-QA": ["ar"], // Katar
      "ar-SA": ["ar"], // Saudi-Arabien
      "ar-SO": ["ar"], // Somalia
      "ar-SS": ["ar"], // Südsudan
      "ar-SD": ["ar"], // Sudan
      "ar-SY": ["ar"], // Syrien
      "ar-TN": ["ar"], // Tunesien
      "ar-AE": ["ar"], // Vereinigte Arabische Emirate
      "ar-YE": ["ar"], // Jemen

      default: ["en"], // Allgemeiner Fallback
    },
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["navigator"],
    },
  });

export default i18n;
