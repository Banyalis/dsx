import $ from 'jquery';
import _ from 'lodash';
import transitions from 'transitions';
import ScrollMagic from 'scrollmagic';

const genericController = {
    init: function (app, resolver) {
        const view = app.view;

        resolver.resolve();
    },

    enter: function (app, resolver) {
        // Sticky nav
        function stickyNav() {
            const controller = new ScrollMagic.Controller();

            const $pageContent = app.view.find('.dsx-generic-content__inner');
            const $nav = app.view.find('.dsx-generic-content-nav');

            const scene = new ScrollMagic.Scene({
                triggerElement: $nav[0],
                triggerHook: 0,
                offset: -100,
                duration: getDuration
            }).addTo(controller);

            scene.setPin($nav[0], {pushFollowers: false});

            function getDuration() {
                const duration = $pageContent.outerHeight() - $nav.outerHeight();
                return duration;
            }

            function onResize() {
                const windowWidth = $(window).outerWidth();
    
                if (windowWidth >= 1024) {
                    scene.setPin($nav[0], {pushFollowers: false});
                } else {
                    scene.removePin($nav[0], true);
                }
            }
            onResize();
            $(window).on('resize', onResize);
        }
        stickyNav();

        // Page anchors
        function pageAnchors() {
            $(document).on('click', '.dsx-generic-js-link-anchor', (e) => {
                const anchor = $(e.currentTarget).attr('href');
                const offset = 0;
                const target = $(anchor).offset().top - offset;
    
                $('html, body').animate({
                    scrollTop: target
                }, 600);
                return false;
            });
        }
        pageAnchors();

        // Scroll top
        function scrollTop() {
            app.view.find('.dsx-generic-scroll-top').on('click', () => {
                $('html, body').animate({
                    scrollTop: 0
                }, 600);
                return false;
            });
        }
        scrollTop();

        // Reading progress
        const positions = [];

        const buildNav = function() {
            let output = '';
            const indicator = '<svg viewBox="0 0 36 36" y="0px" x="0px"><circle transform="rotate(-90 18 18)" stroke-dashoffset="100" stroke-dasharray="100 100" r="16" cy="18" cx="18" stroke-width="4" fill="none"/></svg>';

            app.view.find('.dsx-generic-content').find('.dsx-generic-content__title.--large').each(function(i) {
                $(this).attr('id', 'anchor-' + ++i)
                output += '<a href="#anchor-' + i + '" class="dsx-generic-content-nav__item dsx-generic-js-link-anchor dsx-js-title-anchor-' + i + '">' + indicator + $(this).text() + '</a>';
            });
            return output;
        };

        const getContent = function() {
            const $content = app.view.find('.dsx-generic-content');
            const offset = $content.offset();
            
            return $content.outerHeight() + offset.top;
        };

        const getPositions = function() {
            app.view.find('.dsx-generic-content').find('.dsx-generic-content__title.--large').each(function(i) {
                const offset = $(this).offset();
                positions['title-anchor-' + ++i] = offset.top;
            });
            return positions;
        };

        const setReading = function() {
            const scrollTop = $(document).scrollTop();
            let count = 0;
            
            for (const item in positions) {
                let difference = 0;
                const n = parseInt(item.replace('title-anchor-', ''));
                const hasNext = typeof positions['title-anchor-' + (n + 1)] !== 'undefined';
                const notNext = hasNext && scrollTop < positions['title-anchor-' + (n + 1) ] ? true : false;
                const $navItem = app.view.find('.dsx-js-' + item);
                
                if (hasNext) {
                    difference = (scrollTop - positions[item]) / (positions['title-anchor-' + (n + 1)] - positions[item]) * 100;
                } else {
                    difference = (scrollTop - positions[item]) / (getContent() - positions[item]) * 100;
                }
                
                $navItem.find('circle').attr('stroke-dashoffset', Math.round(100 - difference));
                
                if (scrollTop >= positions[item] && notNext && hasNext) {
                    $('.dsx-js-' + item).addClass('--reading');
                } else if (scrollTop >= positions[item] && ! notNext && hasNext) {
                    $('.dsx-js-' + item).removeClass('--reading');
                } else if (scrollTop >= positions[item] && ! notNext && ! hasNext) {
                    $('.dsx-js-' + item).addClass('--reading');
                }
                
                if (scrollTop >= positions[item]) {
                    $('.dsx-js-' + item).addClass('--read');
                } else {
                    $('.dsx-js-' + item).removeClass('--read');
                }
                
                if (scrollTop < positions[item]) {
                    $('.dsx-js-' + item).removeClass('--read --reading');
                }

                count++;
            }
        };

        app.view.find('.dsx-generic-content-nav').html(buildNav());

        getPositions();

        const getPositionsThrottled = _.throttle(getPositions, 100);
         
        $(window).on('resize', getPositionsThrottled);

        // const setReadingThrottled = _.throttle(setReading, 100);

        $(document).on('scroll', setReading);

        let tl;

        // Page animations
        tl = transitions.generic.enter(app.view);
        this.magic = transitions.generic.magic(app.view);

        if (tl) {
            tl.eventCallback('onComplete', () => resolver.resolve());
            tl.play();
        } else {
            resolver.resolve();
        }
    },

    leave: function (app, resolver) {
        const view = app.view;

        this.magic && this.magic.destroy();

        resolver.resolve();
    }
};

export default genericController;