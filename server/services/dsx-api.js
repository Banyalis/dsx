const error = require('debug')('app:error');
const logDsxApi = require('debug')('app:dsxApi');
const https = require('https');
const request = require('request-promise-native');
const _ = require('lodash');

const config = require('../../config');
const storage = require('../storage');
const cache = require('../cache');
const {splitCurrencies, mergePairs, formatPair} = require('../../lib/utils');

require('tls').DEFAULT_ECDH_CURVE = 'auto';

const dsxApi = {
    async request(opts) {
        const res = await request({
            ...opts,
            json: true,
            agentOptions: {
                secureProtocol: 'TLSv1_2_method'
            },
            simple: false,
            resolveWithFullResponse: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const {statusCode: status, body} = res;

        logDsxApi('url: %s\nresStatus: %s\nresDump: %j', opts.url, status, body);

        if (status < 200 || (status >= 300 && ! (status === 304))) {
            throw new Error(`dsx request failed with status ${status}: ${body}`);
        }

        return body;
    },

    async ticker() {
        const pairsCached = cache.get('pairs');

        if (pairsCached) {
            return pairsCached;
        }

        let pairs = [];

        try {
            pairs = await this.request({
                method: 'POST',
                url: config.dataUrls.ticker,
            });

            pairs = pairs.map((pair) => ({
                ...pair,
                currencies: splitCurrencies(pair.pair),
            }));

            cache.set('pairs', pairs);
        }
        catch (err) {
            error(err);

            return pairs;
        }

        return pairs;
    },

    async systemHealth() {
        const statusesCached = cache.get('statuses');

        if (statusesCached) {
            return statusesCached;
        }

        let statuses = [];
        try {
            const res = await this.request({
                method: 'POST',
                url: config.dataUrls.systemHealth,
            });

            if (! res.return || ! res.return.currencyStatistic) {
                throw new Error('invalid systemHealth response');
            }

            statuses = Object.keys(res.return.currencyStatistic).map((key) => ({
                ...res.return.currencyStatistic[key],
                name: key,
            }));

            cache.set('statuses', statuses);
        }
        catch (err) {
            error(err);

            return cache.get('statuses', {forceOld: true}) || statuses;
        }

        return statuses;
    },

    async feeSchedule() {
        const scheduleDataCached = cache.get('scheduleData');

        if (scheduleDataCached) {
            return scheduleDataCached;
        }

        let scheduleData = {
            fiats: [],
            cryptos: [],
            commissions: [],
        };
        try {
            const res = await this.request({
                method: 'POST',
                url: config.dataUrls.feeSchedule,
            });

            if (! res.return || ! res.return.paymentSystems || ! res.return.tariffs) {
                throw new Error('invalid feeSchedule response');
            }

            const [standardTariff, refTariff] = res.return.tariffs;

            scheduleData.fiats = res.return.paymentSystems.filter((system) =>
                config.fiatCurrencies.includes(system.currencyName)
            )
            .reduce((result, fiat) => {
                const existingFiat = result.find((existingFiat) =>
                    existingFiat.currencyName === fiat.currencyName
                );
                const paymentSystem = config.paymentSystems[fiat.paymentSystemId];
                const paymentSystemData = _.pick(fiat, [
                    'depositCommission',
                    'depositMinCommission',
                    'depositMaxCommission',
                    'withdrawCommission',
                    'withdrawMinCommission',
                    'withdrawMaxCommission',
                    'depositEnabled',
                    'withdrawEnabled',
                ]);

                if (existingFiat) {
                    existingFiat[paymentSystem] = paymentSystemData;
                } else {
                    return result.concat({
                        ...fiat,
                        [paymentSystem]: paymentSystemData,
                    })
                }

                return result;
            }, [])
            .sort((sys1, sys2) =>
                config.fiatCurrencies.indexOf(sys1.currencyName) > config.fiatCurrencies.indexOf(sys2.currencyName)
            );
            scheduleData.cryptos = res.return.paymentSystems.filter((system) =>
                ! config.fiatCurrencies.includes(system.currencyName)
            );
            scheduleData.commissions = standardTariff.commissions.map((standardCom, index) => {
                return {
                    bonusPointsVolume: standardCom.bonusPointsVolume,
                    standardAgressiveCom: standardCom.aggressiveCommission,
                    standardPassiveCom: standardCom.passiveCommission,
                    refAgressiveCom: refTariff.commissions[index].aggressiveCommission,
                    refPassiveCom: refTariff.commissions[index].passiveCommission,
                };
            });

            cache.set('scheduleData', scheduleData);
        }
        catch (err) {
            error(err);

            return scheduleData;
        }

        return scheduleData;
    },

    async checkAuth({cookie, timestamp}) {
        let authStatus = {};
        try {
            authStatus = await this.request({
                method: 'POST',
                url: config.dataUrls.checkAuth,
                form: {
                    cookie,
                    timestamp,
                },
            });
        }
        catch (err) {
            error(err);

            return authStatus;
        }

        return authStatus;
    },
};

module.exports = dsxApi;
