import de from './locales/de.json';
import en from './locales/en.json';
import es from './locales/es.json';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

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

i18n.use(Backend).use(LanguageDetector).use(initReactI18next).init({
  fallbackLng: 'en',
  resources,
  lng: 'en',
});

const userLocale = navigator.language;
if (userLocale) {
  localStorage.setItem('locale', userLocale);
}

if (localStorage.getItem('language') !== null) {
  i18n.changeLanguage(localStorage.getItem('language') || 'en');
}

export default i18n;
