import detectLocale from './detect-locale';

const locale = detectLocale();

export const loadIntercom = () => {
    const intercomSettings = {
        app_id: window.dsxCredentials.intercomId,
        language_override: locale,
    };

    var w = window;
    var ic = w.Intercom;

    if (typeof ic === "function") {
        ic('reattach_activator');
        ic('update', intercomSettings);
    } else {
        var d = document;
        var i = function() {
            i.c(arguments)
        };
        i.q = [];
        i.c = function(args) {
            i.q.push(args)
        };
        w.Intercom = i;

        var s = d.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = `https://widget.intercom.io/widget/${intercomSettings.app_id}`;

        document.getElementsByTagName('head')[0].appendChild(s);

        s.addEventListener('load', () => {
            var ic = w.Intercom;

            ic('reattach_activator');
            ic('update', intercomSettings);
        });
    }
};

export const reloadIntercom = () => {
    if (window.Intercom) {

        window.Intercom('shutdown');
        window.Intercom(
            'boot',
            {
                app_id: window.dsxCredentials.intercomId,
                language_override: locale,
            }
        );
    }
};

export const loadMatomo = () => {
    if (! window.dsxCredentials.matomo) {
        return;
    }

    window._paq = window._paq || [];
    window._paq.push(["setDocumentTitle", document.domain + "/" + document.title]);
    window._paq.push(["setCookieDomain", window.dsxCredentials.matomoCookieDomain]);
    window._paq.push(["setDomains", window.dsxCredentials.matomoDomains]);
    window._paq.push(['trackPageView']);
    window._paq.push(['enableLinkTracking']);
    (function () {
        var u = window.dsxCredentials.matomoUrl;
        window._paq.push(['setTrackerUrl', u + 'piwik.php']);
        window._paq.push(['setSiteId', window.dsxCredentials.matomoSiteId]);
        var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
        g.type = 'text/javascript';
        g.async = true;
        g.defer = true;
        g.src = u + 'piwik.js';
        s.parentNode.insertBefore(g, s);
    })();
};

export const loadGa = () => {
    if (! window.dsxCredentials.googleMetrics) {
        return;
    }

    (function (i, s, o, g, r, a, m) {
        i.GoogleAnalyticsObject = r;
        i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments);
        };
        i[r].l = 1 * new Date();
        a = s.createElement(o);
        m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m);

        ga('create', window.dsxCredentials.googleAnalytics, {siteSpeedSampleRate: 50});
    }(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga'));
};

export const loadGoogleMaps = (done) => {
    const googleMapsKey = 'AIzaSyCd0ulXR-bgxbs7ogHOp_hem5vTzfV3zp0';
    const src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsKey}&language=${locale}`;
    const id = '#maps-script';

    const script = document.createElement('script');
    if (document.getElementById(id)) {
        done();
        return;
    }
    script.id = id;
    script.type = 'text/javascript';
    script.async = true;
    script.src = src;
    script.addEventListener('load', done);
    document.getElementsByTagName('head')[0].appendChild(script);
};
