const fs = require('fs');
const path = require('path');

const config = require('../config');

const origFileName = 'loaders.css';
let cssFile = path.join(config.clientBuildDir, `assets/css/${origFileName}`);

if (! config.isDev) {
    try {
        cssManifestFile = path.join(config.staticDir, 'homepage/assets/css/rev-manifest.json');
        const cssByChunkName = require(cssManifestFile);

        cssFile = cssFile.replace(origFileName, cssByChunkName[origFileName]);
    } catch (e) {
        console.error(e);
    }
}

module.exports = () => {
    if (fs.existsSync(cssFile)) {
        return fs.readFileSync(cssFile, 'utf8');
    }
    else {
        return '';
    }
};
