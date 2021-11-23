const url = require('url');
const error = require('debug')('app:error');

const config = require('../config');
const {buildLangUrl, link, addLangPath} = require('../lib/utils');
const locales = require('../lib/i18n')(config.localesDir);
const documents = require(config.documentsFile);

module.exports = (req, res, next) => {
    const {locale = config.defaultLocale} = req.params;
    const alternateLocale = config.locales.find(loc => loc !== locale);

    req.locale = locale;

    if (! locales[locale]) {
        error(new Error('locale not found'));

        return res.status(500).end();
    }

    res.locals.__ = locales[locale];
    res.locals.documents = documents;

    res.locals.addLangPath = addLangPath(locale);

    const {search} = url.parse(req.url);
    res.locals.link = link(req.path + (search ? search : ''), locale);

    res.locals.alternateLang = alternateLocale;
    res.locals.alternateLangUrl = addLangPath(alternateLocale)(req.path);

    res.locals.currentUrl = `${req.protocol}://${req.hostname}${req.originalUrl}`;
    res.locals.docsLocale = locale === "ru" ? locale : "en";

    next();
};
