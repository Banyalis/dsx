import detectLocale from './detect-locale';

const locales = {
    en: require('../locales/en.json'),
    ru: require('../locales/ru.json'),
    tr: require('../locales/tr.json'),
};

export default {
    get(locale = detectLocale()) {
        return locales[locale];
    }
};
