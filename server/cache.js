// const redis = require('redis');

const config = require('../config');

// const redisClient = redis.createClient();
const cacheStorage = {};

exports.get = (key, {forceOld = false} = {}) => {
    const cached = cacheStorage[key];

    if (! cached || ! cached.data) {
        return null;
    }

    const {expireAt, data} = cached;
    if (! forceOld && (! expireAt || (expireAt < Date.now()))) {
        // cacheStorage[key] = null;

        return null;
    }

    return data;
};

exports.set = (key, data, {ttl = config.cache.ttl} = {}) => {
    cacheStorage[key] = {
        expireAt: Date.now() + ttl,
        data,
    };
};
