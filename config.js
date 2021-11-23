require('dotenv').config();

const path = require('path');

const envs = {
    DEVELOPMENT: 'development',
    STAGE: 'stage',
    PRODUCTION: 'production',
};
const env = process.env.NODE_ENV || envs.PRODUCTION;
const isDev = env === envs.DEVELOPMENT;

const currencies = [
    'usd',
    'eur',
    'gbp',
    'rub',
    'try',
    'btc',
    'ltc',
    'eth',
    'bch',
    'bth',
    'btg',
    'eurs',
    'usdt',
    'bsv',
    'eos'
];

module.exports = {
    env,
    isDev,
    port: process.env.DSX_HP_PORT,
    webUrl: process.env.DSX_HP_WEB_URL,
    defaultLocale: 'en',
    locales: ['en', 'ru', 'tr'],

    dataUrls: {
        ticker: process.env.DSX_API_TICKER_URL,
        systemHealth: process.env.DSX_API_SYSTEM_HEALTH_URL,
        feeSchedule: process.env.DSX_API_FEE_SCHEDULE_URL,
        checkAuth: process.env.DSX_API_CHECK_AUTH,
        register: process.env.REGISTER,
    },

    localesDir: path.resolve(__dirname, './src/locales'),
    documentsFile: path.resolve(__dirname, './src/documents/documents.json'),
    viewDir: path.resolve(__dirname, './src/pug'),

    staticDir: isDev
        ? path.resolve(__dirname, './tmp')
        : path.resolve(__dirname, './dist'),

    clientBuildDir: isDev
        ? path.join(__dirname, 'tmp/homepage')
        : path.join(__dirname, 'dist/homepage'),

    cache: {
        ttl: 6e4,
    },

    mysql: {
        connectionLimit : 10,
        host: process.env.DSX_HP_MYSQL_HOST,
        port: process.env.DSX_HP_MYSQL_PORT,
        user: process.env.DSX_HP_MYSQL_USER,
        password: process.env.DSX_HP_MYSQL_PASS,
        database: process.env.DSX_HP_MYSQL_DB_NAME,
    },

    blog: {
        postsTable: process.env.DSX_HP_BLOG_POST_TABLE,
        pageSize: Number(process.env.DSX_HP_BLOG_PAGE_SIZE),
        host: process.env.DSX_HP_BLOG_HOST,
    },

    paymentSystems: {
        2: 'ePayments',
        6: 'bankSwift',
        12: 'card'
    },

    requiredPaymentSystems: ['ePayments', 'bankSwift', 'card'],

    currencies,

    fiatCurrencies: [
        'USD',
        'EUR',
        'GBP',
        'RUB',
        'TRY'
    ],

    currencyLabels: {
        BTC: 'Bitcoin',
        LTC: 'Litecoin',
        ETH: 'Ether',
        BCH: 'Bitcoin Cash',
        BTG: 'Bitcoin Gold',
        EURS: 'EURS',
        USDT: 'TetherUSE',
        BSV: 'Bitcoin SV',
        EOS: 'EOS',
        XRP: 'Ripple'
    },

    templateLocals: {
        companyTwitter: '@DSX_UK',
    },

    htmlLog: true,
};
