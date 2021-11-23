import $ from 'jquery';
import _ from 'lodash';
import transitions from 'transitions';

import TweenLite from "gsap/TweenLite";
import TimelineLite from "gsap/TimelineLite";
import TimelineMax from "gsap/TimelineMax";
import CSSPlugin from "gsap/CSSPlugin";
import AttrPlugin from "gsap/AttrPlugin";
import {Linear, Power0, Power1, Power2, Power3, Power4, Back, Circ, Expo, Sine, Bounce, Elastic} from "gsap/EasePack";
import {PageVisibilityManager} from '../utils';

import ScrollMagic from 'scrollmagic';
import 'vendor/scrollmagic/animation.gsap';
const JqueryTouchwipe = require('jquery-touchswipe');


import 'owl.carousel/src/scss/_core.scss';
import 'owl.carousel/src/scss/_animate.scss';
import 'owl.carousel';

const defaultController = {
    SLIDE_IDLE_DURATION: 4.15,
    SLIDE_TRANSITION_DURATION: 1.5,
    ANIMATED_TEXTS_IDLE_DURATION: 5.830,
    ANIMATED_TEXTS_OVERLAP: 0.3,
    TEXT_DURATION: 5,
    TEXT_CHANGE_DELAY: 0.17,
    TEXT_HIDE_DURATION: 0.5,
    TEXT_HIDE_DURATION_OPACITY: 0.33,
    TEXT_HIDE_DELAY: 0.05,
    TEXT_SHOW_DURATION: 1.67 ,
    TEXT_SHOW_DURATION_OPACITY: 1.67,
    TEXT_SHOW_DELAY: 0.05,
    init(app, resolver) {
        resolver.resolve();
    },
    enter(app, resolver) {
        let tl;

        // Page animations
        tl = transitions.about.enter(app.view);
        this.magic = transitions.about.magic(app.view);

        // app.view.find('.dsx-services-item').on('click', (e) => {
        //     e.stopPropagation();
        //     e.preventDefault();
        //     window.Intercom && Intercom('show')
        // });


        this._onPageVisibilityChange = this._onPageVisibilityChange.bind(this);

        // this.sliderManager = this._startSlider(app.view.find('.dsx-team'));

        this.animatedTextsManager = this._startAnimatedTexts(app.view.find('.dsx-spontaneous-image-texts'));

        PageVisibilityManager.addEventListener(this._onPageVisibilityChange);

        this.controller = new ScrollMagic.Controller();

        if (this.sliderManager) {
            this.sceneSlider = new ScrollMagic.Scene({
                triggerElement: app.view.find('.dsx-team-slider-wrapper')[0],
                triggerHook: 'onEnter',
                duration: '200%',
            })
                .on('enter', () => {
                    this.sliderManager.resume('scroll')
                })
                .on('leave', () => {
                    this.sliderManager.pause('scroll')
                })
                .addTo(this.controller);

            app.view.find('.dsx-team-arrow-left').on('click', _.throttle(() => this.sliderManager.gotoPrev(), 1000));
            app.view.find('.dsx-team-arrow-right').on('click', _.throttle(() => this.sliderManager.gotoNext(), 1000));
        }

        this.sceneAnimatedTexts = new ScrollMagic.Scene({
            triggerElement: app.view.find('.dsx-spontaneous-image-text--1')[0],
            triggerHook: '0.8',
            duration: '100%',
        })
            .on('enter', () => {
                this.animatedTextsManager.resume('scroll')
            })
            .on('leave', () => {
                this.animatedTextsManager.pause('scroll')
            })
            .addTo(this.controller);

        app.view.find('.owl-carousel').children().each( function( index ) {
            $(this).attr( 'data-position', index );
        });

        app.view.find('.owl-carousel').owlCarousel({
            center: true,
            items: 5,
            loop: true,
            dots: true,
            mouseDrag: false,
            touchDrag: false,


            responsive: {
                320: {
                    margin: 11
                },
                568: {
                    margin: 32
                },
                768: {
                    margin: 11
                },
                1024: {
                    margin: 15
                },
                1440: {
                    margin: 22
                },
                1920: {
                    margin: 48,
                    items: 7
                }
            }
        });

        let prevIndex = 0;
        let resetTimeout;
        let personsTexts = [];


        app.view.find('.dsx-staff-info-item').each((index, item) => {
            personsTexts.push({
                $name: $(item).find('.dsx-staff-info-item-name'),
                $department: $(item).find('.dsx-staff-info-item-department'),
                $text: $(item).find('.dsx-staff-info-item-text'),
                $item: $(item),
                index: index
            });

            if (index > 0) {
                personsTexts[personsTexts.length - 1].$item.css({'opacity': 0, 'visibility': 'hidden'});
            }
        });

        const animateText = (tp, text, elType, $el) => {
            text.animateTl = text.animateTl || {};

            if (text.animateTl[elType]) {
                text.animateTl[elType].progress(1).kill();
                delete text.animateTl[elType];
            }

            let tl;
            let tlShift;
            let tlOpacity;
            let split;

            if (tp == 'show') {
                text.$item.css({'opacity': '', 'visibility': ''});

                split = new SplitText($el, {type: "lines"});
                tl = new TimelineLite();
                tlShift = new TimelineLite();
                tlOpacity = new TimelineLite();

                tlShift.staggerFromTo(split.lines, this.TEXT_SHOW_DURATION, {
                    y: 30
                }, {
                    y: 0,
                    ease: Expo.easeOut
                }, this.TEXT_SHOW_DELAY, 0);

                tlOpacity.staggerFromTo(split.lines, this.TEXT_SHOW_DURATION_OPACITY, {
                    opacity: 0
                }, {
                    opacity: 1,
                    ease: Expo.easeOut
                }, this.TEXT_SHOW_DELAY, 0);

                tl.add(tlShift, 0);
                tl.add(tlOpacity, 0);

                tl.add(() => {
                    split.revert()
                    delete text.animateTl[elType];
                });
            } else {
                split = new SplitText($el, {type: "lines"});
                tl = new TimelineLite();
                tlShift = new TimelineLite();
                tlOpacity = new TimelineLite();

                tlShift.staggerFromTo(split.lines, this.TEXT_HIDE_DURATION, {
                    y: 0
                }, {
                    y: -30,
                    ease: Expo.easeOut
                }, this.TEXT_HIDE_DELAY, 0);

                tlOpacity.staggerFromTo(split.lines, this.TEXT_HIDE_DURATION_OPACITY, {
                    opacity: 1
                }, {
                    opacity: 0,
                    ease: Expo.easeOut
                }, this.TEXT_HIDE_DELAY, 0);

                tl.add(tlShift, 0);
                tl.add(tlOpacity, 0);

                tl.add(() => {
                    split.revert();
                    delete text.animateTl[elType];
                    text.$item.css({'opacity': 0, 'visibility': 'hidden'});
                });
            }

            text.animateTl[elType] = tl;

            return tl;
        }


        const showText = (prevText, text) => {
            const tl = new TimelineLite();

            if (prevText) {
                tl.add(animateText('hide', prevText, 'name', prevText.$name), 0);
                tl.add(animateText('hide', prevText, 'department', prevText.$department), '=' + (this.TEXT_HIDE_DELAY - this.TEXT_HIDE_DURATION));
                tl.add(animateText('hide', prevText, 'text', prevText.$text), '=' + (this.TEXT_HIDE_DELAY - this.TEXT_HIDE_DURATION));
            }

            tl.add(animateText('show', text, 'name', text.$name), prevText ? this.TEXT_CHANGE_DELAY : 0);
            tl.add(animateText('show', text, 'department', text.$department), '=' + (this.TEXT_SHOW_DELAY - this.TEXT_SHOW_DURATION));
            tl.add(animateText('show', text, 'text', text.$text), '=' + (this.TEXT_SHOW_DELAY - this.TEXT_SHOW_DURATION));

            tl.play();
        }


        app.view.find('.owl-carousel').on('changed.owl.carousel', function (e) {
            let curIndex = e.page.index;
            let $curItem = app.view.find('.owl-item').eq(e.item.index);
            let forwardDistance = ((curIndex + e.page.count) - prevIndex) % e.page.count;
            let backwardDistance = ((prevIndex + e.page.count) - curIndex) % e.page.count;
            let direction = forwardDistance <= backwardDistance ? 'forward' : 'backward';

            showText(personsTexts[prevIndex], personsTexts[curIndex]);

            if (direction == 'forward') {
                $curItem
                    .css('transform', 'translateX(25.97%)')
                    .next()
                    .css('transform', 'translateX(15.58%)')
                    .next()
                    .css('transform', 'translateX(5.19%)')
                    .next()
                    .css('transform', 'translateX(-5.19%)')

                $curItem
                    .prev()
                    .css('transform', 'translateX(36.36%)')
                    .prev()
                    .css('transform', 'translateX(46.75%)')
                    .prev()
                    .css('transform', 'translateX(57.14%)')
            } else {
                $curItem
                    .css('transform', 'translateX(-25.97%)')
                    .prev()
                    .css('transform', 'translateX(-15.58%)')
                    .prev()
                    .css('transform', 'translateX(-5.19%)')
                    .prev()
                    .css('transform', 'translateX(5.19%)')

                $curItem
                    .next()
                    .css('transform', 'translateX(-36.36%)')
                    .next()
                    .css('transform', 'translateX(-46.75%)')
                    .next()
                    .css('transform', 'translateX(-57.14%)')
            }

            clearTimeout(resetTimeout);

            resetTimeout = setTimeout(() => {
                app.view.find('.owl-item').css('transform', '');
            }, 150);

            prevIndex = curIndex;
        }.bind(this));

        app.view.find('.dsx-staff-arrow-left').on('click', () => app.view.find('.owl-carousel').trigger('prev.owl.carousel'));
        app.view.find('.dsx-staff-arrow-right').on('click', () => app.view.find('.owl-carousel').trigger('next.owl.carousel'));

        if (app.mobile) {
            app.view.find('.owl-carousel').swipe( {
                allowPageScroll: 'vertical',
                threshold: 50,
                swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
                    if (direction == 'left') {
                        app.view.find('.owl-carousel').trigger('next.owl.carousel')
                    }
                    if (direction == 'right') {
                        app.view.find('.owl-carousel').trigger('prev.owl.carousel')
                    }
                }.bind(this)
            });
        }


        let switchTimeout;

        app.view.find('.owl-item')
            .on('mouseenter', '.dsx-staff-gallery-item' ,(e) => {
                clearTimeout(switchTimeout);
                switchTimeout= setTimeout(() => {
                    app.view.find('.dsx-staff-gallery-item').addClass('-unselected');
                    $(e.currentTarget).removeClass('-unselected');
                }, 170);
            })
            .on('mouseleave', '.dsx-staff-gallery-item', (e) => {
                clearTimeout(switchTimeout);
                switchTimeout= setTimeout(() => {
                    app.view.find('.dsx-staff-gallery-item').removeClass('-unselected');
                }, 170);
            })
            .on('click', '.dsx-staff-gallery-item', (e) => {
                app.view.find('.owl-carousel').trigger('to.owl.carousel', $(e.currentTarget).data('position'));
            })

        if (tl) {
            tl.eventCallback('onComplete', () => resolver.resolve());
            tl.play();
        } else {
            resolver.resolve();
        }
    },
    leave(app, resolver) {
        const view = app.view;

        PageVisibilityManager.removeEventListener(this._onPageVisibilityChange);

        this.sceneSlider && this.sceneSlider.destroy();
        this.controller && this.controller.destroy();

        app.view.find('.owl-carousel').off('changed.owl.carousel');

        this.magic && this.magic.destroy();

        resolver.resolve();
    },
    _onPageVisibilityChange() {
        if (PageVisibilityManager.isPageHidden()) {
            this.sliderManager && this.sliderManager.pause('visibility');
            this.animatedTextsManager.pause('visibility');
        } else {
            this.sliderManager && this.sliderManager.resume('visibility');
            this.animatedTextsManager.resume('visibility');
        }
    },
    _startSlider($container) {
        let current = 0;
        let itemsList = [];
        let zIndex = 1;
        let state = {};
        let direction  = 1;
        let firstTime = true;
        const $indicator = $container.find('.dsx-team-progress-indicator');

        $container.find('.dsx-team-slider-item').each((index, item) => {
            itemsList.push({
                isLoadingStarted: !!$(item).find('img').attr('src'),
                $img: $(item).find('img'),
                $container: $(item),
                index: index
            });
        });

        const loadNext = () => {
            let itemNext = itemsList[(current + 1) % itemsList.length];
            if (itemNext.isLoadingStarted) return;

            itemNext.$img
                .attr('srcset', itemNext.$img.attr('data-srcset'))
                .attr('src', itemNext.$img.attr('data-src'))
                .removeAttr('data-srcset data-src')
                .css('display', '');

            itemNext.isLoadingStarted = true;
        };


        const playItem = (item) => {
            if (item.tl) {
                item.tl.play();
                return;
            }

            loadNext();

            $container.find('.dsx-team-numbers span').eq(0).text(item.index + 1);
            $container.find('.dsx-team-numbers span').eq(1).text('/' + itemsList.length);

            const tl1 = new TimelineLite();

            tl1.fromTo(item.$img, defaultController.SLIDE_IDLE_DURATION, {
                attr: {'data-progress': 0}
            }, {
                attr: {'data-progress': 1},
                onUpdate: () => {
                    $indicator.css('width', item.$img.attr('data-progress') * 100 + '%');
                },
                ease: Power0.easeOut
            }, 0);

            tl1.add(() => {
                delete item.tl;
                current = (current + direction + itemsList.length) % itemsList.length;
                playItem(itemsList[current]);
                direction = 1; //restore forward direction
            });


            const tl2 = new TimelineLite();

            if (!firstTime) {
                const w = item.$container.width();
                const h = item.$container.height();

                item.$img.css('z-index', ++zIndex);

                tl2.fromTo(item.$container, defaultController.SLIDE_TRANSITION_DURATION, {
                    clip: `rect(0,${w*0}px,${h}px,0)`,
                }, {
                    clip: `rect(0,${w}px,${h}px,0)`,
                    ease: Expo.easeOut
                }, 0);

                tl2.add(() => {
                    item.$container.css('clip', '');
                });
            }

            const tl3 = new TimelineLite();

            if (!firstTime) {
                tl3.fromTo(item.$img, defaultController.SLIDE_TRANSITION_DURATION, {
                    scale: 1.1,
                }, {
                    scale: 1,
                    ease: Expo.easeOut
                }, 0);
            }

            const tl = new TimelineLite();
            tl.add(tl1, 0);
            tl.add(tl2, 0);
            tl.add(tl3, 0);

            item.tl = tl;

            firstTime = false;
        };

        const pauseItem = (item) => {
            item.tl && item.tl.pause();
        };


        return {
            pause: (tp) => {
                if (state[tp] == 'paused') return;

                state[tp] = 'paused';

                pauseItem(itemsList[current]);
            },
            resume: (tp) => {
                if (state[tp] == 'playing') return;
                state[tp] = 'playing';

                var isAllPlaying = _.every(state, (item) => item == 'playing');

                isAllPlaying && playItem(itemsList[current]);
            },
            gotoPrev: () => {
                direction = -1; //set reverse direction once
                itemsList[current].tl && itemsList[current].tl.progress(1);
            },
            gotoNext: () => {
                itemsList[current].tl && itemsList[current].tl.progress(1);
            }
        };
    },
    _startAnimatedTexts($container) {
        let current = 0;
        let itemsList = [];
        let state = {};
        let firstTime = true;

        $container.find('.dsx-spontaneous-image-text').each((index, item) => {
            itemsList.push({
                $img: $(item).find('img'),
                $container: $(item),
                index: index
            });

            $(item).find('img').masker({
                ScrollMagic: ScrollMagic
            });
        });

        const playItem = (item) => {
            if (item.tl) {
                item.tl.play();
                return;
            }

            const tl = new TimelineLite();

            itemsList[current].$img.trigger('masker-play-forward', {});

            tl.fromTo(item.$container, defaultController.ANIMATED_TEXTS_IDLE_DURATION, {
                attr: {'data-progress': 0}
            }, {
                attr: {'data-progress': 1},
                ease: Power0.easeOut
            }, 0);

            tl.add(() => {
                delete item.tl;
                current = (current + 1 + itemsList.length) % itemsList.length;
                playItem(itemsList[current]);
            });

            tl.add(() => {
                itemsList[current].$img.trigger('masker-play-backward', {
                    reverseHideAnimation: true,
                    timeScale: 0.37
                });
            }, '=-' + defaultController.ANIMATED_TEXTS_OVERLAP);


            item.tl = tl;

            firstTime = false;
        };

        const pauseItem = (item) => {
            item.tl && item.tl.pause();
        };


        return {
            pause: (tp) => {
                if (state[tp] == 'paused') return;

                state[tp] = 'paused';

                pauseItem(itemsList[current]);
            },
            resume: (tp) => {
                if (state[tp] == 'playing') return;
                state[tp] = 'playing';

                var isAllPlaying = _.every(state, (item) => item == 'playing');

                isAllPlaying && playItem(itemsList[current]);
            }
        };
    }
};

export default defaultController;
