const error = require('debug')('app:error');

const config = require('../config');
const {buildLangUrl, link, addLangPath} = require('../lib/utils');
const locales = require('../lib/i18n')(config.localesDir);

module.exports = (req, res, next) => {
    res.setHeader('Last-Modified', (new Date()).toUTCString());

    next();
};
