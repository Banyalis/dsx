import find from 'lodash/find';

import config from './config';

function trimLocale(locale) {
    return locale ? locale.substring(0,2).toLowerCase() : null;
}
const Cookie = require('js-cookie');

function findLocale(search) {
    const {localeKeys} = config;

    const locale = trimLocale(search);

    const key = localeKeys[locale];

    return key ? key.locale : null;
}

function detectCookieLocale() {
    const {localeLsItem} = config;

    let locale;
    try {
        locale = Cookie.get(localeLsItem);
    }
    catch (e) {}

    if (! locale) {
        return null;
    }

    return findLocale(locale);
}

function detectBrowserLocale() {
    let locale = null;

    if (navigator.languages) {
        find(navigator.languages, (navigatorLocale) => {
            return locale = findLocale(navigatorLocale);
        });
    }

    return (
        locale ||
        findLocale(navigator.language) ||
        findLocale(navigator.userLanguage)
    );
}

module.exports = () => {
    const {localeLsItem} = config;

    let locale = detectCookieLocale();

    if (locale) {
        return locale;
    }

    locale = detectBrowserLocale() || config.defaultLocale;

    const localeObject = config.localeKeys[locale];
    Cookie.set(
        localeLsItem,
        localeObject ? localeObject.key : locale
    );

    return locale;
};
