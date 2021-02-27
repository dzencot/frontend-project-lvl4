import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import LanguageDetector from 'i18next-browser-languagedetector';
import en from '../locales/en/translation.json';
import ru from '../locales/ru/translation.json';

const resources = {
  ru: {
    translation: ru,
  },
  en: {
    translation: en,
  },
};

const i18nInit = () => i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: true,
    resources,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });


export default i18nInit;
