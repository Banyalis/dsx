export default {
    defaultLocale: 'en',
    locales: ['en', 'ru', 'tr'],
    dataUrls: {
        checkAuth: '/homepage-api/checkAuth',
        register: '/api/register',
        updateLanguage: '/api/updateLanguage'
    },
    cookieLsItem: 'ngStorage-cookie',
    sessionUserState: 'ngStorage-appUserState',
    sessionVerificationStatus: 'ngStorage-verificationStatus',
    localeLsItem: 'locale',
    localeKeys: {
        en: {
            locale: 'en',
            key: 'en-gb',
        },
        ru: {
            locale: 'ru',
            key: 'ru',
        },
        tr: {
            locale: 'tr',
            key: 'tr',
        },
    },
    refererParams: [
        'refId',
        'trafficSource',
        'subid',
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_content',
        'utm_term',
        'pk_source',
        'pk_medium',
        'pk_campaign',
        'pk_content',
        'pk_term'
    ]
};
