import en from './locales/en.json';
import de from './locales/de.json';
import es from './locales/es.json';

const resources = {
  en: {
    translation: en,
  },
  de: {
    translation: de,
  },
  es: {
    translation: es,
  },
};

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

const userLocale = navigator.language;
if (userLocale) {
  localStorage.setItem('locale', userLocale);
}

i18n.use(Backend).use(LanguageDetector).use(initReactI18next).init({
  fallbackLng: 'en',
  resources,
  lng: 'en',
});

export default i18n;
