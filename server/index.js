const path = require('path');
const http = require('http');
const Bluebird = require('bluebird');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const env = process.env.NODE_ENV || 'production';
const isDev = env === 'development';

const config = require('../config.js');
const utils = require('../lib/utils');
const loaderCss = require('./loader-css');

if (! config) {
    throw new Error('No config for enviroment');
}

const app = express();
const server = http.createServer(app);

app.locals = {
    ...config.templateLocals,
    basedir: config.viewDir,
    excerpt: utils.excerpt,
    splitParagraphs: utils.splitParagraphs,
    chunk: utils.chunk,
    formatStatusDate: utils.formatStatusDate,
    pretty: true,
    PACKAGE: {version: 1},
    DEV: config.isDev,
    intercomId: config.intercomId,
    loaderCss: loaderCss(),
    webUrl: config.webUrl,
};

try {
    const jsManifestFile = path.join(config.staticDir, 'homepage/assets/js/stats.json');
    const {assetsByChunkName: jsByChunkName} = require(jsManifestFile);
    app.locals.jsBundles = Object.keys(jsByChunkName).map((chunkName) => {
        return Array.isArray(jsByChunkName[chunkName])
            ? jsByChunkName[chunkName][0]
            : jsByChunkName[chunkName];
    });

    if (! isDev) {
        const cssManifestFile = path.join(config.staticDir, 'homepage/assets/css/rev-manifest.json');
        const cssByChunkName = require(cssManifestFile);
        app.locals.cssBundles = Object.keys(cssByChunkName).map((chunkName) => {
            return cssByChunkName[chunkName];
        });
    } else {
        app.locals.cssBundles = ['main.css'];
    }
} catch (e) {
    console.error(e);
}

app.set('views', config.viewDir);
app.set('view engine', 'pug');
app.use(bodyParser.json());

if (config.htmlLog) {
    app.use(morgan('tiny'));
}

app.use(express.static(config.staticDir));

app.use(`(/:locale(${config.locales.join('|')}))?`,
    require('./last-modified'),
    require('./locales'),
    require('./routes')
);

const storage = require('./storage');

(async function() {
    await Bluebird.promisify(server.listen.bind(server))(config.port);

    console.log(`DSX Homepage is running on port ${config.port}`);
})();

process.on('exit', async () => {
    await Bluebird.promisify(server.close.bind(server))();
    await storage.disconnect();
});

process.on('unhandledRejection', (err, p) => {
    throw err;
});

process.on('SIGINT', process.exit);
process.on('SIGUSR1', process.exit);
process.on('SIGUSR2', process.exit);
