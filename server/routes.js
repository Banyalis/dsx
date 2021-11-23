const error = require('debug')('app:error');
const routes = require('express').Router();
const moment = require('moment');
const _ = require('lodash');

const config = require('../config');
const {
    formatPair,
    formatStatus,
    formatPaymentSystem,
    formatCommissions,
    preparePost,
    excerpt,
    stripHtml,
} = require('../lib/utils');

const dsxApi = require('./services/dsx-api');

const mockData = require('../mock-data');

const story1 = require('./data/story1');
const story2 = require('./data/story2');
const story3 = require('./data/story3');

routes.get('/', async (req, res) => {
    res.render('home/index');
});

routes.get('/about/?', (req, res) => {
    res.render('about/index');
});

routes.get('/contact/?', (req, res) => {
    res.render('contact/index');
});

routes.get('/legal/terms-conditions/?', (req, res) => {
    res.render('terms-conditions/index');
});

routes.get('/legal/aml-policy/?', (req, res) => {
    res.render('aml-policy/index');
});

routes.get('/legal/complaints-policy/?', (req, res) => {
    res.render('complaints-policy/index');
});

routes.get('/legal/refund-policy/?', (req, res) => {
    res.render('refund-policy/index');
});

routes.get('/legal/risk-warning/?', (req, res) => {
    res.render('risk-warning/index');
});

routes.get('/legal/privacy-notice/?', (req, res) => {
    res.render('privacy-notice/index');
});

routes.get('/legal/cookie-notice/?', (req, res) => {
    res.render('cookie-notice/index');
});

routes.get('/legal/cookie-list/?', (req, res) => {
    res.render('cookie-list/index');
});

routes.get('/pro/?', (req, res) => {
    res.render('pro/index');
});

routes.get('/fees/?', async (req, res) => {
    const scheduleData = await dsxApi.feeSchedule();
//     const scheduleData = {
//         "fiats": [{
//         "depositMinCommission": 0,
//         "depositMaxCommission": 0,
//         "depositMinVolume": 1,
//         "withdrawMinCommission": 0,
//         "withdrawMaxCommission": 0,
//         "withdrawMinVolume": 1,
//         "minConfirmations": 0,
//         "depositEnabled": true,
//         "withdrawEnabled": true,
//         "paymentSystemId": 2,
//         "currencyName": "USD",
//         "direction": "BOTH",
//         "withdrawCommission": 0,
//         "depositCommission": 0,
//         "ePayments": {
//             "depositCommission": 0,
//             "depositMinCommission": 0,
//             "depositMaxCommission": 0,
//             "withdrawCommission": 0,
//             "withdrawMinCommission": 0,
//             "withdrawMaxCommission": 0,
//             "depositEnabled": true,
//             "withdrawEnabled": true
//         },
//         "card": {
//             "depositCommission": 0.026,
//             "depositMinCommission": 1,
//             "depositMaxCommission": 0,
//             "withdrawCommission": 0,
//             "withdrawMinCommission": 0,
//             "withdrawMaxCommission": 0,
//             "depositEnabled": true,
//             "withdrawEnabled": false
//         },
//         "bankSwift": {
//             "depositCommission": 0,
//             "depositMinCommission": 0,
//             "depositMaxCommission": 0,
//             "withdrawCommission": 0.008,
//             "withdrawMinCommission": 85,
//             "withdrawMaxCommission": 135,
//             "depositEnabled": false,
//             "withdrawEnabled": false
//         }
//     }, {
//         "depositMinCommission": 0,
//         "depositMaxCommission": 0,
//         "depositMinVolume": 1,
//         "withdrawMinCommission": 0,
//         "withdrawMaxCommission": 0,
//         "withdrawMinVolume": 1,
//         "minConfirmations": 0,
//         "depositEnabled": true,
//         "withdrawEnabled": true,
//         "paymentSystemId": 2,
//         "currencyName": "EUR",
//         "direction": "BOTH",
//         "withdrawCommission": 0,
//         "depositCommission": 0,
//         "ePayments": {
//             "depositCommission": 0,
//             "depositMinCommission": 0,
//             "depositMaxCommission": 0,
//             "withdrawCommission": 0,
//             "withdrawMinCommission": 0,
//             "withdrawMaxCommission": 0,
//             "depositEnabled": true,
//             "withdrawEnabled": true
//         },
//         "card": {
//             "depositCommission": 0.026,
//             "depositMinCommission": 1,
//             "depositMaxCommission": 0,
//             "withdrawCommission": 0,
//             "withdrawMinCommission": 0,
//             "withdrawMaxCommission": 0,
//             "depositEnabled": true,
//             "withdrawEnabled": false
//         },
//         "bankSwift": {
//             "depositCommission": 0,
//             "depositMinCommission": 0,
//             "depositMaxCommission": 0,
//             "withdrawCommission": 0.008,
//             "withdrawMinCommission": 30,
//             "withdrawMaxCommission": 30,
//             "depositEnabled": true,
//             "withdrawEnabled": true
//         }
//     }, {
//         "depositMinCommission": 1,
//         "depositMaxCommission": 0,
//         "depositMinVolume": 10,
//         "withdrawMinCommission": 0,
//         "withdrawMaxCommission": 0,
//         "withdrawMinVolume": 1,
//         "minConfirmations": 0,
//         "depositEnabled": true,
//         "withdrawEnabled": false,
//         "paymentSystemId": 12,
//         "currencyName": "GBP",
//         "direction": "DEPOSIT",
//         "withdrawCommission": 0,
//         "depositCommission": 0.026,
//         "card": {
//             "depositCommission": 0.026,
//             "depositMinCommission": 1,
//             "depositMaxCommission": 0,
//             "withdrawCommission": 0,
//             "withdrawMinCommission": 0,
//             "withdrawMaxCommission": 0,
//             "depositEnabled": true,
//             "withdrawEnabled": false
//         },
//         "bankSwift": {
//             "depositCommission": 0,
//             "depositMinCommission": 0,
//             "depositMaxCommission": 0,
//             "withdrawCommission": 0,
//             "withdrawMinCommission": 50,
//             "withdrawMaxCommission": 50,
//             "depositEnabled": true,
//             "withdrawEnabled": true
//         }
//     }, {
//         "depositMinCommission": 0,
//         "depositMaxCommission": 0,
//         "depositMinVolume": 1,
//         "withdrawMinCommission": 6000,
//         "withdrawMaxCommission": 9500,
//         "withdrawMinVolume": 500,
//         "minConfirmations": 0,
//         "depositEnabled": true,
//         "withdrawEnabled": true,
//         "paymentSystemId": 6,
//         "currencyName": "RUB",
//         "direction": "BOTH",
//         "withdrawCommission": 0.008,
//         "depositCommission": 0,
//         "bankSwift": {
//             "depositCommission": 0,
//             "depositMinCommission": 0,
//             "depositMaxCommission": 0,
//             "withdrawCommission": 0.008,
//             "withdrawMinCommission": 6000,
//             "withdrawMaxCommission": 9500,
//             "depositEnabled": true,
//             "withdrawEnabled": true
//         },
//         "card": {
//             "depositCommission": 0.026,
//             "depositMinCommission": 20,
//             "depositMaxCommission": 0,
//             "withdrawCommission": 0,
//             "withdrawMinCommission": 0,
//             "withdrawMaxCommission": 0,
//             "depositEnabled": true,
//             "withdrawEnabled": false
//         },
//         "ePayments": {
//             "depositCommission": 0,
//             "depositMinCommission": 0,
//             "depositMaxCommission": 0,
//             "withdrawCommission": 0,
//             "withdrawMinCommission": 0,
//             "withdrawMaxCommission": 0,
//             "depositEnabled": true,
//             "withdrawEnabled": true
//         }
//     }, {
//         "depositMinCommission": 40,
//         "depositMaxCommission": 40,
//         "depositMinVolume": 1,
//         "withdrawMinCommission": 150,
//         "withdrawMaxCommission": 0,
//         "withdrawMinVolume": 100,
//         "minConfirmations": 0,
//         "depositEnabled": false,
//         "withdrawEnabled": false,
//         "paymentSystemId": 6,
//         "currencyName": "TRY",
//         "direction": "BOTH",
//         "withdrawCommission": 0.001,
//         "depositCommission": 0,
//         "bankSwift": {
//             "depositCommission": 0,
//             "depositMinCommission": 40,
//             "depositMaxCommission": 40,
//             "withdrawCommission": 0.001,
//             "withdrawMinCommission": 150,
//             "withdrawMaxCommission": 0,
//             "depositEnabled": false,
//             "withdrawEnabled": false
//         }
//     }],
//     "cryptos": [{
//         "depositMinCommission": 0,
//         "depositMaxCommission": 0,
//         "depositMinVolume": 0,
//         "withdrawMinCommission": 0.0004,
//         "withdrawMaxCommission": 0,
//         "withdrawMinVolume": 0.0001,
//         "minConfirmations": 3,
//         "depositEnabled": true,
//         "withdrawEnabled": true,
//         "paymentSystemId": 1,
//         "currencyName": "BTC",
//         "direction": "BOTH",
//         "userDefinedCommissionPercent": 1,
//         "withdrawCommission": 0,
//         "depositCommission": 0
//     }, {
//         "depositMinCommission": 0,
//         "depositMaxCommission": 0,
//         "depositMinVolume": 0,
//         "withdrawMinCommission": 0.001,
//         "withdrawMaxCommission": 0,
//         "withdrawMinVolume": 0.001,
//         "minConfirmations": 6,
//         "depositEnabled": true,
//         "withdrawEnabled": true,
//         "paymentSystemId": 1,
//         "currencyName": "LTC",
//         "direction": "BOTH",
//         "userDefinedCommissionPercent": 1,
//         "withdrawCommission": 0,
//         "depositCommission": 0
//     }, {
//         "depositMinCommission": 0,
//         "depositMaxCommission": 0,
//         "depositMinVolume": 0,
//         "withdrawMinCommission": 0.1,
//         "withdrawMaxCommission": 0,
//         "withdrawMinVolume": 0.01,
//         "minConfirmations": 20,
//         "depositEnabled": true,
//         "withdrawEnabled": true,
//         "paymentSystemId": 1,
//         "currencyName": "EOS",
//         "direction": "BOTH",
//         "userDefinedCommissionPercent": 1,
//         "withdrawCommission": 0,
//         "depositCommission": 0
//     }, {
//         "depositMinCommission": 0,
//         "depositMaxCommission": 0,
//         "depositMinVolume": 0,
//         "withdrawMinCommission": 0.003,
//         "withdrawMaxCommission": 0,
//         "withdrawMinVolume": 1e-8,
//         "minConfirmations": 15,
//         "depositEnabled": true,
//         "withdrawEnabled": true,
//         "paymentSystemId": 1,
//         "currencyName": "ETH",
//         "direction": "BOTH",
//         "userDefinedCommissionPercent": 1,
//         "withdrawCommission": 0,
//         "depositCommission": 0
//     }, {
//         "depositMinCommission": 0,
//         "depositMaxCommission": 0,
//         "depositMinVolume": 0,
//         "withdrawMinCommission": 0.0005,
//         "withdrawMaxCommission": 0,
//         "withdrawMinVolume": 0.0001,
//         "minConfirmations": 20,
//         "depositEnabled": true,
//         "withdrawEnabled": true,
//         "paymentSystemId": 1,
//         "currencyName": "BCH",
//         "direction": "BOTH",
//         "userDefinedCommissionPercent": 1,
//         "withdrawCommission": 0,
//         "depositCommission": 0
//     }, {
//         "depositMinCommission": 0,
//         "depositMaxCommission": 0,
//         "depositMinVolume": 0,
//         "withdrawMinCommission": 0.001,
//         "withdrawMaxCommission": 0,
//         "withdrawMinVolume": 0.0001,
//         "minConfirmations": 20,
//         "depositEnabled": true,
//         "withdrawEnabled": true,
//         "paymentSystemId": 1,
//         "currencyName": "BTG",
//         "direction": "BOTH",
//         "userDefinedCommissionPercent": 1,
//         "withdrawCommission": 0,
//         "depositCommission": 0
//     }, {
//         "depositMinCommission": 0,
//         "depositMaxCommission": 0,
//         "depositMinVolume": 0,
//         "withdrawMinCommission": 1,
//         "withdrawMaxCommission": 0,
//         "withdrawMinVolume": 1,
//         "minConfirmations": 25,
//         "depositEnabled": true,
//         "withdrawEnabled": true,
//         "paymentSystemId": 1,
//         "currencyName": "EURS",
//         "direction": "BOTH",
//         "userDefinedCommissionPercent": 1,
//         "withdrawCommission": 0,
//         "depositCommission": 0
//     }, {
//         "depositMinCommission": 0,
//         "depositMaxCommission": 0,
//         "depositMinVolume": 0,
//         "withdrawMinCommission": 1,
//         "withdrawMaxCommission": 0,
//         "withdrawMinVolume": 1,
//         "minConfirmations": 25,
//         "depositEnabled": true,
//         "withdrawEnabled": true,
//         "paymentSystemId": 1,
//         "currencyName": "USDT",
//         "direction": "BOTH",
//         "userDefinedCommissionPercent": 1,
//         "withdrawCommission": 0,
//         "depositCommission": 0
//     }, {
//         "depositMinCommission": 0,
//         "depositMaxCommission": 0,
//         "depositMinVolume": 0,
//         "withdrawMinCommission": 0.0005,
//         "withdrawMaxCommission": 0,
//         "withdrawMinVolume": 0.0005,
//         "minConfirmations": 40,
//         "depositEnabled": true,
//         "withdrawEnabled": true,
//         "paymentSystemId": 1,
//         "currencyName": "BSV",
//         "direction": "BOTH",
//         "userDefinedCommissionPercent": 1,
//         "withdrawCommission": 0,
//         "depositCommission": 0
//     }],
//     "commissions": [{
//         "bonusPointsVolume": 100000,
//         "standardAgressiveCom": 0.0025,
//         "standardPassiveCom": 0.0015,
//         "refAgressiveCom": 0.0015,
//         "refPassiveCom": 0.001
//     }, {
//         "bonusPointsVolume": 250000,
//         "standardAgressiveCom": 0.0023,
//         "standardPassiveCom": 0.0014,
//         "refAgressiveCom": 0.0014,
//         "refPassiveCom": 0.0009
//     }, {
//         "bonusPointsVolume": 500000,
//         "standardAgressiveCom": 0.0021,
//         "standardPassiveCom": 0.0013,
//         "refAgressiveCom": 0.0013,
//         "refPassiveCom": 0.0008
//     }, {
//         "bonusPointsVolume": 750000,
//         "standardAgressiveCom": 0.002,
//         "standardPassiveCom": 0.0012,
//         "refAgressiveCom": 0.0012,
//         "refPassiveCom": 0.0007
//     }, {
//         "bonusPointsVolume": 1000000,
//         "standardAgressiveCom": 0.0019,
//         "standardPassiveCom": 0.0011,
//         "refAgressiveCom": 0.0011,
//         "refPassiveCom": 0.0006
//     }, {
//         "bonusPointsVolume": 2500000,
//         "standardAgressiveCom": 0.0018,
//         "standardPassiveCom": 0.001,
//         "refAgressiveCom": 0.001,
//         "refPassiveCom": 0.0005
//     }, {
//         "bonusPointsVolume": 5000000,
//         "standardAgressiveCom": 0.0017,
//         "standardPassiveCom": 0.0009,
//         "refAgressiveCom": 0.0009,
//         "refPassiveCom": 0.0004
//     }, {
//         "bonusPointsVolume": 7500000,
//         "standardAgressiveCom": 0.0016,
//         "standardPassiveCom": 0.0008,
//         "refAgressiveCom": 0.0008,
//         "refPassiveCom": 0.0003
//     }, {
//         "bonusPointsVolume": 10000000,
//         "standardAgressiveCom": 0.0015,
//         "standardPassiveCom": 0.0007,
//         "refAgressiveCom": 0.0007,
//         "refPassiveCom": 0.0002
//     }, {
//         "bonusPointsVolume": 12500000,
//         "standardAgressiveCom": 0.0014,
//         "standardPassiveCom": 0.0006,
//         "refAgressiveCom": 0.0006,
//         "refPassiveCom": 0.0001
//     }, {
//         "bonusPointsVolume": 15000000,
//         "standardAgressiveCom": 0.0012,
//         "standardPassiveCom": 0.0005,
//         "refAgressiveCom": 0.0005,
//         "refPassiveCom": 0.0001
//     }, {
//         "bonusPointsVolume": 15000000,
//         "standardAgressiveCom": 0.001,
//         "standardPassiveCom": 0,
//         "refAgressiveCom": 0.0005,
//         "refPassiveCom": 0
//     }]
// }

    res.render('fees/index', {
        fiats: scheduleData.fiats.map(formatPaymentSystem(res.locals.__)),
        cryptos: scheduleData.cryptos.map(formatPaymentSystem(res.locals.__)),
        commissions: scheduleData.commissions.map(formatCommissions),

        // commissions: JSON.stringify(scheduleData.commissions.map(formatCommissions)),
        // commissions: JSON.stringify(scheduleData.commissions),
    });
});


routes.get('/stories/?', (req, res) => {
    res.render('stories/index');
});


//stories categories
routes.get('/stories/announcements/?', (req, res) => {
    res.render('storiesCategories/index', {
        category: "Announcements"
    });
});
routes.get('/stories/getting-started/?', (req, res) => {
    res.render('storiesCategories/index', {
        category: "Getting Started"
    });
});
routes.get('/stories/industry/?', (req, res) => {
    res.render('storiesCategories/index', {
        category: "Industry"
    });
});
routes.get('/stories/case-studies/?', (req, res) => {
    res.render('storiesCategories/index', {
        category: "Case Studies"
    });
});


//hardcode for testing
routes.get('/stories/1/?', (req, res) => {
    res.render('story/index', {
        story: story1.story
    });
});

routes.get('/stories/2/?', (req, res) => {
    res.render('story/index', {
        story: story2.story
    });
});

routes.get('/stories/3/?', (req, res) => {
    res.render('story/index', {
        story: story3.story
    });
});


routes.get('/legal/?', (req, res) => {
    res.render('legal/index');
});

/*routes.get('/partners/?', (req, res) => {
    res.render('partners/index');
});*/

routes.get('/homepage-api/ticker', async (req, res) => {
    const pairs = await dsxApi.ticker();

    res.json(pairs);
});

routes.get('/homepage-api/system', async (req, res) => {
    const statuses = await dsxApi.systemHealth();

    res.json(statuses);
});

routes.post('/homepage-api/checkAuth', async (req, res) => {
    const authStatus = await dsxApi.checkAuth({
        cookie: req.body.cookie,
        timestamp: Date.now(),
    });

    res.json({success: true});
});

routes.get(/\..{3,4}$/, async (req, res) => {
    res.status(404).end();
});

routes.get(/\/+/, async (req, res) => {
    const pairs = await dsxApi.ticker();
    res.render('home/index', {pairs: pairs.map(formatPair)});
});

routes.get('/*', async (req, res) => {
    res.status(404).render('404/index');
});

module.exports = routes;
