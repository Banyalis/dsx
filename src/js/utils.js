import config from './config';

function easingFunctions(st, ed, per, easing) {
    var functions = {
        //simple linear tweening - no easing, no acceleration
        linearTween: function (t, b, c, d) {
            return c*t/d + b;
        },

        // quadratic easing in - accelerating from zero velocity
        easeInQuad: function (t, b, c, d) {
            t /= d;
            return c*t*t + b;
        },

        // quadratic easing out - decelerating to zero velocity
        easeOutQuad: function (t, b, c, d) {
            t /= d;
            return -c * t*(t-2) + b;
        },

        // quadratic easing in/out - acceleration until halfway, then deceleration
        easeInOutQuad: function (t, b, c, d) {
            t /= d/2;
            if (t < 1) return c/2*t*t + b;
            t--;
            return -c/2 * (t*(t-2) - 1) + b;
        },

        // cubic easing in - accelerating from zero velocity
        easeInCubic: function (t, b, c, d) {
            t /= d;
            return c*t*t*t + b;
        },

        // cubic easing out - decelerating to zero velocity
        easeOutCubic: function (t, b, c, d) {
            t /= d;
            t--;
            return c*(t*t*t + 1) + b;
        },

        // cubic easing in/out - acceleration until halfway, then deceleration
        easeInOutCubic: function (t, b, c, d) {
            t /= d/2;
            if (t < 1) return c/2*t*t*t + b;
            t -= 2;
            return c/2*(t*t*t + 2) + b;
        },

        // quartic easing in - accelerating from zero velocity
        easeInQuart: function (t, b, c, d) {
            t /= d;
            return c*t*t*t*t + b;
        },

        // quartic easing out - decelerating to zero velocity
        easeOutQuart: function (t, b, c, d) {
            t /= d;
            t--;
            return -c * (t*t*t*t - 1) + b;
        },

        // quartic easing in/out - acceleration until halfway, then deceleration
        easeInOutQuart: function (t, b, c, d) {
            t /= d/2;
            if (t < 1) return c/2*t*t*t*t + b;
            t -= 2;
            return -c/2 * (t*t*t*t - 2) + b;
        },

        // quintic easing in - accelerating from zero velocity
        easeInQuint: function (t, b, c, d) {
            t /= d;
            return c*t*t*t*t*t + b;
        },

        // quintic easing out - decelerating to zero velocity
        easeOutQuint: function (t, b, c, d) {
            t /= d;
            t--;
            return c*(t*t*t*t*t + 1) + b;
        },

        // quintic easing in/out - acceleration until halfway, then deceleration
        easeInOutQuint: function (t, b, c, d) {
            t /= d/2;
            if (t < 1) return c/2*t*t*t*t*t + b;
            t -= 2;
            return c/2*(t*t*t*t*t + 2) + b;
        },

        // sinusoidal easing in - accelerating from zero velocity
        easeInSine: function (t, b, c, d) {
            return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
        },

        // sinusoidal easing out - decelerating to zero velocity
        easeOutSine: function (t, b, c, d) {
            return c * Math.sin(t/d * (Math.PI/2)) + b;
        },

        // sinusoidal easing in/out - accelerating until halfway, then decelerating
        easeInOutSine: function (t, b, c, d) {
            return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
        },

        // exponential easing in - accelerating from zero velocity
        easeInExpo: function (t, b, c, d) {
            return c * Math.pow( 2, 10 * (t/d - 1) ) + b;
        },

        // exponential easing out - decelerating to zero velocity
        easeOutExpo: function (t, b, c, d) {
            return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
        },

        // exponential easing in/out - accelerating until halfway, then decelerating
        easeInOutExpo: function (t, b, c, d) {
            t /= d/2;
            if (t < 1) return c/2 * Math.pow( 2, 10 * (t - 1) ) + b;
            t--;
            return c/2 * ( -Math.pow( 2, -10 * t) + 2 ) + b;
        },

        // circular easing in - accelerating from zero velocity
        easeInCirc: function (t, b, c, d) {
            t /= d;
            return -c * (Math.sqrt(1 - t*t) - 1) + b;
        },

        // circular easing out - decelerating to zero velocity
        easeOutCirc: function (t, b, c, d) {
            t /= d;
            t--;
            return c * Math.sqrt(1 - t*t) + b;
        },

        // circular easing in/out - acceleration until halfway, then deceleration
        easeInOutCirc: function (t, b, c, d) {
            t /= d/2;
            if (t < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
            t -= 2;
            return c/2 * (Math.sqrt(1 - t*t) + 1) + b;
        }
    };

    return functions[easing](per, st, ed - st, 1);
};

exports.animateNumber = function($number, fromValue, toValue, delay, duration, cb, easing, separator) {
    var sepReg = new RegExp('\\' + (separator||'') + '+', 'g'),
        start_val = fromValue == undefined ? parseFloat($number.text().replace(sepReg, ''), 10) : fromValue,
        end_val = toValue - 0,
        start_time = +new Date() + delay,
        end_time = start_time + duration,
        self = this;

    if (start_val < end_val) {
        start_val = Math.ceil(start_val);
        end_val = Math.floor(end_val);
    } else {
        start_val = Math.floor(start_val);
        end_val = Math.ceil(end_val);
    }

    window.cancelAnimationFrame($number.data('animateNumberTimer'));

    changeNumber();

    function changeNumber() {

        var cur_time = Math.min(Math.max(+new Date(), start_time), end_time),
            per, val;

        if (duration > 0) {
            per = (cur_time - start_time) / duration;
        } else {
            per = 1;
        }

        //val = Math.round(start_val + (end_val - start_val) * per);
        val = Math.round(easingFunctions(start_val, end_val, per, easing));

        if (per == 1) {
            val = toValue - 0;
        }

        cb ? cb(val) : $number.text(val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator || ''));

        if (per < 1) {
            $number.data('animateNumberTimer', window.requestAnimationFrame(changeNumber));
        }
    }
},


exports.easingFunctions = easingFunctions;


exports.PageVisibilityManager = function () {
    // Set the name of the hidden property and the change event for visibility
    var hidden; var visibilityChange;
    if (typeof document.hidden !== 'undefined') {
        hidden = 'hidden';
        visibilityChange = 'visibilitychange';
    } else if (typeof document.mozHidden !== 'undefined') {
        hidden = 'mozHidden';
        visibilityChange = 'mozvisibilitychange';
    } else if (typeof document.msHidden !== 'undefined') {
        hidden = 'msHidden';
        visibilityChange = 'msvisibilitychange';
    } else if (typeof document.webkitHidden !== 'undefined') {
        hidden = 'webkitHidden';
        visibilityChange = 'webkitvisibilitychange';
    }

    var add = function (callback) {
        if (!hidden) {
            return false;
        }
        document.addEventListener(visibilityChange, callback);
    };

    var remove = function (callback) {
        if (!hidden) {
            return false;
        }
        document.removeEventListener(visibilityChange, callback);
    };

    var isHidden = function () {
        return document[hidden];
    };

    return {
        addEventListener : add,
        removeEventListener: remove,
        isPageHidden: isHidden
    };
}();


exports.addLangPath = (locale) => (path) => {
    return locale === config.defaultLocale ? path : `/${locale}${path}`
};


exports.parseQs = (qs) => {
    const params = {};

    qs.replace('?', '').split('&').forEach((pair) => {
        const match = pair.match(/(.+)=(.+)/);

        if (! match) {
            return;
        }

        const param = match[1];
        const value = match[2];

        params[param] = value;
    });

    return params;
}
