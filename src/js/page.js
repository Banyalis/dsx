import _ from 'lodash';
import $ from 'jquery';
import svg4everybody from 'svg4everybody';
import browser from 'browser-detect';
import transitions from 'transitions';
import Cookie from 'js-cookie';
import ScrollMagic from 'scrollmagic';

import {addLangPath, parseQs} from './utils';
import detectLocale from './detect-locale';
import config from './config';
import { reloadIntercom } from './third-party-script-loaders';

const objectFitImages = require('object-fit-images');

const menuUserStatusEnum = {
    NON_AUTH: 0,
    IN_REGISTRATION_PROCESS: 1,
    AUTH_NOT_VERIFIED: 2,
    AUTH_PROCESSING: 3,
    AUTH_REJECTED: 4,
    AUTH_VERIFIED: 5,
    UPDATE_PASSWORD: 6,
    ADD_PHONE: 7
};

const userStateEnum = {
    ANONYMOUS: 1,
    AUTH_INCOMPLETE: 2,
    AUTH_FAILED: 3,
    LOGGED_IN: 4,
    REGISTER_INCOMPLETE: 5,
    UPDATE_PASSWORD: 6,
    ADD_PHONE: 7
};

const page = {
    init: function (app) {

        // Base components
        app.window = $(window);
        app.document = $(document);
        app.html = $("html");
        app.body = $("body");
        app.viewport = $("html,body");
        app.view = $("#view-main");
        app.navbar = $("#navbar");
        app.footer = $(".dsx-footer");

        // App params
        app.browser = browser();
        app.mobile = app.browser.mobile;
        app.html.removeClass('no-js').addClass(app.mobile ? "mobile" : "desktop").addClass(app.browser.name);

        // Scroll Handler
        app.window.on('scroll', (e) => app.window.trigger('scrolling', window.pageYOffset, window.pageXOffset));

        let resizeTransitionResetTimeout;
        app.window.on('resize', (e) => {
            $('html').addClass('no-transitions');

            clearTimeout(resizeTransitionResetTimeout);

            resizeTransitionResetTimeout = setTimeout((e) => {
                $('html').removeClass('no-transitions');
            }, 1000);
        });

        // log in user
        (function () {
            page._pingAuthInterval = setInterval(() => {
                const sessionId = getSessionId();

                if (! sessionId) {
                    return;
                }

                $.ajax({
                    method: 'POST',
                    url: config.dataUrls.checkAuth,
                    contentType: 'application/json',
                    data: JSON.stringify({
                        cookie: sessionId,
                        timestamp: Date.now()
                    }),
                    json: true,
                });
            }, 5000);
        })();


        //clean intercom cookies if user has no autorization cookie
        (function () {
            const userState = JSON.parse(sessionStorage.getItem(config.sessionUserState)) || 1;

            if (userState !== 4 && userState !== 5) {
                cleanIntercomCookies();
            }
        })();

        // redirect to locale
        (function () {
            const {defaultLocale, locales} = config;

            let locale = detectLocale();

            const {search} = window.location;
            const localeMatch = window.location.pathname.match(new RegExp(`^\/(${locales.join('|')})\/`));

            if ((localeMatch && localeMatch[1] === locale) || (! localeMatch && locale === defaultLocale)) {
                return;
            }

            const locallessPath = window.location.pathname.replace(new RegExp(`^\/(${locales.join('|')})`), '');

            window.location.href = addLangPath(locale)(locallessPath + search);
        })();

        // svg4everybody | Init
        if (!app.mobile) {
            svg4everybody();
        }

        // Navbar | Init
        (function () {
            // Hiding
            app.window.on('scrolling', (e, y) => {
                if (y > 0) {
                    app.navbar.addClass('-collapsed');
                } else {
                    app.navbar.removeClass('-collapsed');
                }
            });
        })();

        // Footer | Select locale
        (function () {
            const {locales, localeLsItem, localeKeys, defaultLocale} = config;

            $(document).on('click', '.-lang-dropdown a', function() {
                const lang = this.dataset.lang;
                const lsKey = localeKeys[lang];
                const key =  lsKey ? lsKey.key : lang;

                Cookie.set(localeLsItem, key);
                const localeMatch = window.location.pathname.match(new RegExp(`^\/(${locales.join('|')})\/`));

                if ((localeMatch && localeMatch[1] === lang) || (! localeMatch && lang === defaultLocale)) {
                    return;
                }

                const sessionId = getSessionId(),
                    userState = JSON.parse(sessionStorage.getItem(config.sessionUserState)) || 1;
                if (sessionId && key
                    && (userState === userStateEnum.LOGGED_IN || userState === userStateEnum.REGISTER_INCOMPLETE)) {
                    const params = {
                        cookie: sessionId,
                        langCode: key
                    };
                    $.ajax({
                        type: 'POST',
                        url: config.dataUrls.updateLanguage,
                        data: params
                    });
                }

                const locallessPath = window.location.pathname.replace(new RegExp(`^\/(${locales.join('|')})`), '');
                window.location.pathname = addLangPath(lang)(locallessPath);
            });
        })();

        // Save referer params to cookieStorage
        (function () {
            const {refererParams} = config;

            const params = parseQs(window.location.search);
            // console.log(params);
            Object.keys(params).forEach((param) => {
                // console.log(refererParams.includes(param));
                if (! refererParams.includes(param)) {
                    return;
                }

                sessionStorage.setItem(param, params[param]);
            });
        })();
    },

    refresh: function (app) {
        $('html').css('overflow', ''); //reset overflow is page goes to another url from menu

        let menuScrollY;

        app.navbar.find('.dsx-navbar-toggle').on('click', () => {
            if (app.navbar.hasClass('-open')) {
                $('html').css('overflow', '');
            } else {
                $('html').css('overflow', 'hidden');
            }

            app.navbar.find('.dsx-navbar-menu').height(window.innerHeight);
            app.navbar.find('.dsx-navbar-menu-links').css('min-height', window.innerHeight);

            setTimeout(() => {
                app.navbar.toggleClass('-open');
            }, 17);
        });

        objectFitImages();

        app.navbar.find('.dsx-navbar-menu').on('touchstart', (e) => {
            menuScrollY = e.originalEvent.touches.item(0).clientY;
        });

        app.navbar.find('.dsx-navbar-menu').on('touchmove', (e) => {
            let $scrollbox = $('.dsx-navbar-menu-scrollbox', app.navbar);
            let $target = $(e.target);
            let delta = menuScrollY - e.originalEvent.touches.item(0).clientY;

            if (!$target.closest($scrollbox).length) {
                e.preventDefault();
            }

            if ((delta < 0 && $scrollbox.scrollTop() <= 0) ||
                (delta > 0 && $scrollbox.scrollTop() + $scrollbox.height() >= $scrollbox[0].scrollHeight)) {
                e.preventDefault();
            }

            menuScrollY = e.originalEvent.touches.item(0).clientY;
        });



        this.controller = new ScrollMagic.Controller();

        const self = this;


        this.startSectionsColorsMonitoring();

          // Dropdown | Init
        app.view.add(app.navbar).find('[data-dropdown-toggle]').each(function () {
            const toggle = $(this);
            const container = toggle.parents('.dsx-dropdown,[data-dropdown]');

            const onBodyClick = (e) => {
                if ($(e.target).closest(container).length) {
                    return;
                }
                $('body').off('touchstart', onBodyClick);
                container.removeClass('-open')
            }

            container.attr('tabindex', -1).on('blur', () => {
                $('body').off('touchstart', onBodyClick);
                container.removeClass('-open')
            });
            toggle.on('click', () => {
                container.toggleClass('-open');
                container.find(':input').focus();

                $('body').off('touchstart', onBodyClick);

                if (container.hasClass('-open')) {
                    $('body').on('touchstart', onBodyClick);
                }
            });
        });

        // Navbar | Logo morph
        (function() {

            app.navbarLogo = app.navbar.find('#navbar_logo');
            const tl = transitions.navbar.logo.morph(app.navbarLogo);

            app.navbarLogo.on('mouseenter', () => {
                tl.play(0);
            }).on('mouseleave', () => {
                tl.reverse(0);
            });
        })();


        // Cookies warning | Init
        (function() {
            const cookiePanel = $(".dsx-cookies");
            const footer = $('#footer');
            const storageKey = 'isCookieNotAccepted';

            let csValue;
            try {
                csValue = JSON.parse(Cookie.get(storageKey));
            }
            catch (e) {

            }

            const hideCookiesWarning = csValue === false;

            if (hideCookiesWarning) {
                return;
            }

            footer.addClass('-pb');
            cookiePanel.addClass('-visible');

            cookiePanel.find('button').on('click', function() {
                cookiePanel.removeClass('-visible');
                footer.removeClass('-pb');

                Cookie.set(storageKey, JSON.stringify(false));
            });
        })();

        // // Navs | sync cyclical links
        (function() {
            const rootPath = '/';
            const navbarLogo = app.navbar.find('#navbar_logo');
            const currentPath = window.location.pathname + window.location.search;

            if (currentPath === rootPath && navbarLogo.attr('href')) {
                navbarLogo.removeAttr('href');
            }
            else if (currentPath !== rootPath && ! navbarLogo.attr('href')) {
                navbarLogo.attr('href', rootPath);
            }

            const links = $(document).find('a').each((_, link) => {
                const $link = $(link);
                const href = $link.attr('href');

                if (currentPath === href) {
                    $link.removeAttr('href');
                    $link.data('href', href);
                }
                else if (! href) {
                    $link.attr('href', $link.data('href'));
                }
            });
        })();


        // Auth buttons | show/hide
        // log in user
        (function () {
            processAuthLinks();

            app.navbar.find('a[logout]').on('click', () => {
                sessionStorage.removeItem(config.cookieLsItem);
                sessionStorage.removeItem(config.sessionUserState);
                sessionStorage.removeItem(config.sessionVerificationStatus);

                processAuthLinks();
                reloadIntercom();
            });


            function processAuthLinks() {
                const userStatus = getMenuUserStatus();
                const classes = ['.-non-auth', '.-in-register', '.-auth-non-verified', '.-auth-processing', '.-auth-rejected', '.-auth-verified', '.-add-phone', '.-update-password'];
                $(classes.join(',')).css('display', 'none');
                $(classes[userStatus]).css('display', '');
            }
        })();


        //navbar and footer animation
        (function() {
            app.footerMagic = transitions.footer.magic(app.view);
        })();

        // send GA event
        (function() {
            if (window.dsxCredentials.googleMetrics && window.ga) {
                window.ga(
                   'send', {
                       hitType: 'pageview',
                       page: window.location.pathname.replace(new RegExp(`^\/(${config.locales.join('|')})`), ''),
                   }
               );
           }
        })();
    },
    update: function (app) {
        const html = app.req.html;
        const view = html.filter('#view-main');
        const navbar = html.filter('#navbar');
        const title = html.filter('title').text();

        // Title | Update
        document.title = title;

        // View | Update
        app.view.replaceWith(view);
        app.view = view;

        // Navbar | Update
        app.navbar.replaceWith(navbar);
        app.navbar = navbar;
    },
    away: function (app) {
        this.controller && this.controller.destroy();
        app.footerMagic && app.footerMagic.destroy();
        this.stopSectionsColorsMonitoring();
    },
    complete: function (app) {},

    startSectionsColorsMonitoring: function() {
        this.monitoringData = {
            lastScrollEvent: +new Date()
        };

        const onScroll = _.throttle(() => {
            //if pass more than 0.5s from last scroll event
            if (this.monitoringData.lastScrollEvent + 500 < +new Date()) {
                recalcSectionsPos();
            }

            const scrollTop = $(window).scrollTop();

            let navbarTheme = 'light';
            let bestTop = -99999999;

            let cookieTheme = 'light';
            let bestBottom = -99999999;

            _.each(this.monitoringData.items, (item, ind) => {
                const itemTop = item.top - scrollTop - this.monitoringData.navbarHeight;
                const itemBottom = scrollTop + this.monitoringData.windowHeight - (item.top + item.height);

                if (itemTop <= 0 && itemTop > bestTop) {
                    navbarTheme = item.theme;
                    bestTop = itemTop;
                }

                if (itemBottom <= 0 && itemBottom > bestBottom) {
                    cookieTheme = item.theme;
                    bestBottom = itemBottom;
                }
            });

            if (navbarTheme != this.monitoringData.navbarTheme) {
                this.monitoringData.navbarTheme = navbarTheme;
                $('html')
                    .toggleClass('-menu-dark', navbarTheme == 'dark')
                    .toggleClass('-menu-purple', navbarTheme == 'purple')
                    .toggleClass('-menu-grey', navbarTheme == 'grey');
            }

            if (cookieTheme != this.monitoringData.cookieTheme) {
                this.monitoringData.cookieTheme = cookieTheme;
                $('html')
                    .toggleClass('-cookie-dark', cookieTheme == 'dark')
                    .toggleClass('-cookie-purple', cookieTheme == 'purple')
                    .toggleClass('-cookie-grey', cookieTheme == 'grey');
            }

            this.monitoringData.lastScrollEvent = +new Date();
        }, 100);

        const onResize = _.throttle(() => {
            recalcSectionsPos();
            onScroll();
        }, 300);

        const recalcSectionsPos = () => {
            this.monitoringData.items = [];

            $('[data-theme]').each((index, section) => {
                const item = {};
                const $section = $(section);
                item.height = $section.height();
                item.top = $section.offset().top;
                item.theme = $section.attr('data-theme');
                item.$el = $section;
                this.monitoringData.items.push(item);
            });

            this.monitoringData.windowHeight = window.innerHeight;
            this.monitoringData.navbarHeight = app.navbar.height();
        }

        this.monitoringData.onScroll = onScroll;
        this.monitoringData.onResize = onResize;

        $(window).on('scroll', onScroll);
        $(window).on('resize', onResize);

        onResize();
    },

    stopSectionsColorsMonitoring: function() {
        if (this.monitoringData) {
            $(window).on('scroll', this.monitoringData.onScroll);
            $(window).on('resize', this.monitoringData.onResize);
        }
    },
};


function getSessionId() {
    const {cookieLsItem} = config;

    try {
        return JSON.parse(sessionStorage.getItem(cookieLsItem));
    }
    catch (err) {
        return null;
    }
}

function getMenuUserStatus() {
    const statusesEnum = {
        NOT_VERIFIED: 'NOT_VERIFIED',
        PROCESSING: 'PROCESSING',
        REJECTED: 'REJECTED',
        VERIFIED: 'VERIFIED',
    };

    let userState = JSON.parse(sessionStorage.getItem(config.sessionUserState)) || 1;
    let verificationStatus = JSON.parse(sessionStorage.getItem(config.sessionVerificationStatus)) || statusesEnum.VERIFIED;

    // userState = userStateEnum.REGISTER_INCOMPLETE;
    // userState = userStateEnum.LOGGED_IN;
    // verificationStatus = 'VERIFIED';

    switch (userState) {
        case userStateEnum.ANONYMOUS:
        case userStateEnum.AUTH_FAILED:
        case userStateEnum.AUTH_INCOMPLETE:
            return menuUserStatusEnum.NON_AUTH;
        case userStateEnum.REGISTER_INCOMPLETE:
            return menuUserStatusEnum.IN_REGISTRATION_PROCESS;
        case userStateEnum.LOGGED_IN:
            return menuUserStatusEnum[`AUTH_${verificationStatus}`];
        case userStateEnum.ADD_PHONE:
            return menuUserStatusEnum.ADD_PHONE;
        case userStateEnum.UPDATE_PASSWORD:
            return menuUserStatusEnum.UPDATE_PASSWORD;
    }
}

function cleanIntercomCookies() {
    const intercomPrefix = 'intercom-';
    const cookies = document.cookie.split("; ").filter(item => item.substr(0, intercomPrefix.length) === intercomPrefix);
    for (let i = 0; i < cookies.length; i++) {
        const value = cookies[i];
        document.cookie = value.split('=')[0] + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=.'+window.location.hostname;
    }
}

export default page;
