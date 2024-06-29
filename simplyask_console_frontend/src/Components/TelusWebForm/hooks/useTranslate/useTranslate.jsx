import { useState } from 'react';

import translations from './translations.json';

const getLanguage = () => {
  const language = typeof navigator !== 'undefined'
    ? navigator.language || navigator.userLanguage
    : 'en';

  return language;
};

const useTranslate = (initLanguage = null) => {
  const [language, setLanguage] = useState(initLanguage || getLanguage().split('-')[0]);

  const translate = (key) => {
    const keys = key.split('.');

    return keys.reduce((acc, key) => {
      if (acc[key]) {
        return acc[key];
      }

      return key;
    }, translations[language]);
  };

  return { language, setLanguage, t: translate };
};

export default useTranslate;
