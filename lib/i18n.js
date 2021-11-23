const path = require('path');
const glob = require('glob');

module.exports = (localesDir) => {
    const locales = {};

    glob.sync('*.json', {cwd: localesDir}).forEach((file) => {
        const locale = path.basename(file, '.json');

        locales[locale] = require(path.resolve(localesDir, file));
    });

    return locales;
};
