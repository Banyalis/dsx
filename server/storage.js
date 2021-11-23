const mysql = require('mysql');
const Bluebird = require('bluebird');
const {escape} = mysql;

const config = require('../config');

const pool = mysql.createPool(config.mysql);

const query = Bluebird.promisify(pool.query.bind(pool));

const filterToSql = (where) => {
    return Object.keys(where)
    .map((field) => `${field}=${mysql.escape(where[field])}`)
    .join(' AND ');
};

const buildWhere = (conds) => {
    if (! conds || conds.length < 1) {
        return '';
    }

    return `WHERE ${conds.join(' AND ')}`;
};

const sanitizeSearch = (string) => {
    return string.replace(/[^0-9a-zа-я ]+/gi, '');
};

const find = async function find({
    tableName,
    fields = [],
    filter,
    limit = 1,
    offset = 0,
    order = 'id ASC',
}) {
    if (! tableName) {
        throw new Error('tableName required');
    }
    if (! Array.isArray(fields)) {
        throw new Error('fields must be an array')
    }

    const select = fields.join(',') || '*';

    const sql = `
        SELECT ${select} FROM ${tableName}
        ${filter ? `WHERE ${filterToSql(filter)}` : ''}
        ORDER BY ${escape(order)}
        LIMIT ${escape(limit)}
        OFFSET ${escape(offset)};
    `;

    return await query(sql);
};

const findOne = async function findOne({
    tableName,
    fields = [],
    filter,
}) {
    if (! tableName) {
        throw new Error('tableName required');
    }
    if (! Array.isArray(fields)) {
        throw new Error('fields must be an array');
    }

    const select = fields.join(',') || '*';

    const sql = `
        SELECT ${select} FROM ${tableName}
        ${filter ? `WHERE ${filterToSql(filter)}` : ''};
    `;

    const results = await query(sql);

    return results[0] || null;
};

module.exports = {
    query,
    find,
    findOne,
    disconnect: Bluebird.promisify(pool.end.bind(pool)),
    escape,
    buildWhere,
    sanitizeSearch,
};
