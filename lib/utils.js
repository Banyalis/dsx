const url = require('url');
const _ = require('lodash');
const numeral = require('numeral');
const moment = require('moment');
const humanizeDuration = require('humanize-duration');
const ellipsize = require('ellipsize');
const cheerio = require('cheerio');

const config = require('../config');

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

exports.formatDate = formatDate;

exports.mergePairs = (newPairs, oldPairs) => {
    return newPairs.map((newPair) => {
        const oldPair = oldPairs.find((oldPair) => oldPair.pair === newPair.pair) || {};

        return Object.assign({}, oldPair, newPair);
    });
}

exports.splitCurrencies = (code) => {
    const currencyVar = config.currencies
    .sort((cur1, cur2) => cur2.length - cur1.length)
    .join('|');
    const regex = new RegExp(`(${currencyVar})(${currencyVar})`, 'i');

    const match = code.match(regex);

    if (! match) {
        return [code];
    }

    const [, cur1, cur2] = match;

    return [cur1, cur2];
}

function formatPairName(currencies, code) {
    if (! currencies || currencies.length < 2) {
        return code;
    }

    const [cur1, cur2] = currencies;

    return `${cur1.toUpperCase()}/${cur2.toUpperCase()}`;
}

function formatNumber(n, format = '0,0.00') {
    return numeral(n).format(format);
}

exports.formatPair = (pair) => {
    return {
        ...pair,
        pair: pair.pair,
        name: formatPairName(pair.currencies, pair.pair),
        last: formatNumber(pair.last),
        change: formatNumber(pair.change),
        high: formatNumber(pair.high),
        low: formatNumber(pair.low),
        buy: formatNumber(pair.buy),
        sell: formatNumber(pair.sell),
        vol_cur: formatNumber(pair.vol_cur),
    };
};

exports.formatStatusDate = (date) => {
    const dateFormat = 'YYYY-MM-DD HH:mm';

    return date
        ? moment(date).format(dateFormat)
        : null;
}

function decimalSeconds(ms) {
    return Math.round(ms / 10) * 10;
}

exports.formatStatus = (status) => {
    const result = {
        name: status.name,
    };

    if (status.statisticForLastSuccessful) {
        result.statisticForLastSuccessful = {
            low: humanizeDuration(
                decimalSeconds(status.statisticForLastSuccessful.low),
                {largest: 1}
            ),
            high: humanizeDuration(
                decimalSeconds(status.statisticForLastSuccessful.high),
                {largest: 1}
            ),
            avg: humanizeDuration(
                decimalSeconds(status.statisticForLastSuccessful.avg),
                {largest: 1}
            ),
        };
    }

    if (status.depositPayments) {
        result.depositOnline = status.depositPayments.online;
        result.depositLastSuccessful = status.depositPayments.lastSuccessful;

        if (status.depositPayments.payments && status.depositPayments.payments.WaitingForConfirms) {
            result.depositCount = status.depositPayments.payments.WaitingForConfirms.count;
            result.depositOldest = status.depositPayments.payments.WaitingForConfirms.oldest;
        }
    }

    if (status.withdrawalsPayments) {
        result.withdrawalOnline = status.withdrawalsPayments.online;
        result.withdrawlLastSuccessful = status.withdrawalsPayments.lastSuccessful;

        if (status.withdrawalsPayments.payments && status.withdrawalsPayments.payments.WaitingWithdrawals) {
            result.withdrawalCount = status.withdrawalsPayments.payments.WaitingWithdrawals.count;
            result.withdrawalOldest = status.withdrawalsPayments.payments.WaitingWithdrawals.oldest;
        }
    }

    return result;
}

function formatCommissionString(commission, type, locale) {
    if (! commission || ! commission[`${type}Enabled`]) {
        return '—';
    }

    const minCommission = commission[`${type}MinCommission`];
    const maxCommission = commission[`${type}MaxCommission`];
    const commissionValue = commission[`${type}Commission`] || minCommission;

    if (commissionValue === 0) {
        return locale ? locale.fees.FREE : 'Free';
    }


    if (! minCommission && ! maxCommission) {
        return `${commissionValue}%`;
    }

    if (minCommission === maxCommission) {
        return formatNumber(minCommission, '0,0');
    }

    const values = [
        minCommission ? `min. ${formatNumber(minCommission, '0,0')}` : null,
        maxCommission ? `max. ${formatNumber(maxCommission, '0,0')}` : null,
    ]
    .filter((val) => val)
    .join(', ');

    return `${commissionValue}% <div class="dsx-fees-methods-info__type-list__item-hint">${values}</div>`;
}

exports.formatPaymentSystem = (locale) => (system) => {
    system = _.cloneDeep(system);

    const currencyLabel = config.currencyLabels[system.currencyName] || system.currencyName;

    config.requiredPaymentSystems.forEach((paymentSystem) => {
        if (! system[paymentSystem]) {
            system[paymentSystem] = {};
        }
        const paymentSystemData = system[paymentSystem];

        paymentSystemData.depositCommission = (paymentSystemData.depositCommission * 100) || 0;
        paymentSystemData.withdrawCommission = (paymentSystemData.withdrawCommission * 100) || 0;
        paymentSystemData.depositString = formatCommissionString(paymentSystemData, 'deposit', locale);
        paymentSystemData.withdrawString = formatCommissionString(paymentSystemData, 'withdraw', locale);
    });

    return {
        ...system,
        currencyLabel,
    };
};

exports.formatCommissions = (com) => {
    return {
        bonusPointsVolume: formatNumber(com.bonusPointsVolume),
        standardAgressiveCom: formatNumber(com.standardAgressiveCom * 100),
        standardPassiveCom: formatNumber(com.standardPassiveCom * 100),
        refAgressiveCom: formatNumber(com.refAgressiveCom * 100),
        refPassiveCom: formatNumber(com.refPassiveCom * 100),
    };
};

const splitParagraphs = (text) => {
    if (! text) {
        return '';
    }

    return text.split('\n\n')
    .map((p) => `<p>${p}</p>`)
    .join('\n');
};
exports.splitParagraphs = splitParagraphs;

exports.excerpt = (text, chars = 300) => {
    return splitParagraphs(ellipsize(text, chars));
};

exports.addLangPath = (locale) => (path) => {
    return locale === config.defaultLocale ? path : `/${locale}${path}`
};

exports.blockCyclical = (path, currentPath) => {
    return (
        currentPath.replace(/\/([?$])/, '$1').toLowerCase() === path.replace(/\/([?$])/, '$1').toLowerCase()
        ? false
        : path
    );
};

exports.link = (currentPath, locale) => (path) => {
    path = path.replace(/\s+/g, '+');

    return exports.blockCyclical(exports.addLangPath(locale)(path), currentPath);
};

exports.chunk = (array, size) => {
    size = Math.max(size, 0);
    const length = array == null ? 0 : array.length;
    if (!length || size < 1) {
        return [];
    }
    let index = 0;
    let resIndex = 0;
    const result = new Array(Math.ceil(length / size));

    while (index < length) {
        result[resIndex++] = array.slice(index, (index += size));
    }
    return result;
};

exports.absolutifySrc = (src) => {
    const {protocol, host, pathname} = url.parse(src || '');

    if (! pathname || protocol || host) {
        return src;
    }

    return url.format({
        protocol: 'https',
        host: config.blog.host,
        pathname,
    });
}

exports.absolutifyHtmlSrcs = (html) => {
    const $ = cheerio.load(html);

    $('img').each((i, img) => {
        img.attribs.src = exports.absolutifySrc(img.attribs.src);
    });

    return $.html();
};

exports.preparePost = (post) => {
    if (typeof post !== 'object') {
        return;
    }

    return {
        ...post,
        date: moment(post.published_at).format('D MMM YYYY'),
        feature_image: exports.absolutifySrc(post.feature_image),
        html: post.html ? exports.absolutifyHtmlSrcs(post.html) : post.html,
    };
};

exports.stripHtml = (text) => {
    return typeof text === 'string'
        ? text.replace(/<.+?>/g, '')
        : text;
};
