import $ from 'jquery';
import _ from 'lodash';
import transitions from 'transitions';
import quotes from 'blocks/quotes';
import faq from 'blocks/faq';

import TweenLite from "gsap/TweenLite";
import TimelineLite from "gsap/TimelineLite";
import TimelineMax from "gsap/TimelineMax";
import CSSPlugin from "gsap/CSSPlugin";
import AttrPlugin from "gsap/AttrPlugin";
import {Linear, Power0, Power1, Power2, Power3, Power4, Back, Circ, Expo, Sine, Bounce, Elastic} from "gsap/EasePack";
import {PageVisibilityManager} from '../utils';

import ScrollMagic from 'scrollmagic';
import 'vendor/scrollmagic/animation.gsap';

const defaultController = {
    SLIDE_IDLE_DURATION: 3.5,
    SLIDE_TRANSITION_DURATION: 1.5,

    init(app, resolver) {
        resolver.resolve();
    },
    enter(app, resolver) {
        let tl;

        // Page animations
        tl = transitions.home.enter(app.view);
        this.magic = transitions.home.magic(app.view);

        // app.view.find('.dsx-discover-block').on('click', (e) => {
        //     e.stopPropagation();
        //     e.preventDefault();
        //     window.Intercom && Intercom('show')
        // });

        this._onPageVisibilityChange = this._onPageVisibilityChange.bind(this);

        this.quotes = new quotes({
            view: app.view
        });

        this.faq = new faq({
            view: app.view
        });

        this.sliderManager = this._startSlider(app.view.find('.dsx-hero-slider-wrapper'));

        PageVisibilityManager.addEventListener(this._onPageVisibilityChange);

        this.controller = new ScrollMagic.Controller();

        this.sceneHero = new ScrollMagic.Scene({
            triggerElement: app.view.find('.dsx-hero-slider')[0],
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

        this.quotes && this.quotes.destroy();
        delete this.quotes;

        this.faq && this.faq.destroy();
        delete this.faq;

        this.sceneHero && this.sceneHero.destroy();
        this.controller && this.controller.destroy();

        this.magic && this.magic.destroy();

        resolver.resolve();
    },
    _onPageVisibilityChange() {
        if (PageVisibilityManager.isPageHidden()) {
            this.sliderManager.pause('visibility');
        } else {
            this.sliderManager.resume('visibility');
        }
    },
    _startSlider($container) {
        let current = 0;
        let mediaList = [];
        let zIndex = 1;
        let state = {};

        $container.find(' > *').each((index, item) => {
            mediaList.push({
                isLoadingStarted: !!$(item).attr('src'),
                isVideo: !!$(item).find('video').length,
                $media: $(item).find('img, video'),
                $container: $(item)
            });
        });

        const loadNext = () => {
            let mediaNext = mediaList[(current + 1) % mediaList.length];
            if (mediaNext.isLoadingStarted) return;

            mediaNext.$media
                .attr('srcset', mediaNext.$media.attr('data-srcset'))
                .attr('src', mediaNext.$media.attr('data-src'))
                .removeAttr('data-srcset data-src')
                .css('display', '');

            if (mediaNext.isVideo) {
                mediaNext.$media[0].load();
            }

            mediaNext.isLoadingStarted = true;
        };

        const showMedia = (prevMedia, media) => {
            const tl = new TimelineLite();
            const tl1 = new TimelineLite();
            const tl2 = new TimelineLite();
            const w = media.$container.width();
            const h = media.$container.height();

            media.$media
                .css('z-index', ++zIndex)
                .css('opacity', '');

            tl1.fromTo(media.$container, defaultController.SLIDE_TRANSITION_DURATION, {
                clip: `rect(0,${w*0}px,${h}px,0)`
            }, {
                clip: `rect(0,${w}px,${h}px,0)`,
                ease: Expo.easeOut
            }, 0);

            if (media.isVideo) {
                tl2.fromTo(media.$media, defaultController.SLIDE_TRANSITION_DURATION, {
                    scale: 1.25,
                    x: "-50%"
                }, {
                    scale: 1,
                    x: "0%",
                    ease: Expo.easeOut
                }, 0);
            } else {
                tl2.fromTo(media.$media, defaultController.SLIDE_TRANSITION_DURATION, {
                    x: "-50%"
                }, {
                    x: "0%",
                    ease: Expo.easeOut
                }, 0);
            }

            tl.add(tl1, 0);
            tl.add(tl2, 0);
            tl.add(() => {
                prevMedia.$media.css('opacity', '0');
                media.$container.css('clip', '');
            });
        }


        const playVideo = (media) => {
            media.$media.off('canplay');
            media.$media.off('canplaythrough');
            media.$media[0].play();
        }

        const pauseVideo = (media) => {
            media.$media.off('canplay');
            media.$media.off('canplaythrough');
            media.$media[0].pause();
        }

        const playMedia = (media) => {
            loadNext();

            if (media.isVideo) {
                if (media.$media[0].readyState === 3 || media.$media[0].readyState === 4)  {
                    playVideo(media);
                } else {
                    media.$media.on('canplay', () => playVideo(media));
                    media.$media.on('canplaythrough', () => playVideo(media));
                }

                if (media.tl) {
                    media.tl.play();
                    return;
                }

                const tl = new TimelineMax();

                tl.fromTo(media.$media, defaultController.SLIDE_TRANSITION_DURATION * 2 + defaultController.SLIDE_IDLE_DURATION, {
                    attr: {'data-progress': 0}
                }, {
                    attr: {'data-progress': 1},
                    ease: Power0.easeOut
                }, 0);

                media.tl = tl;

                tl.addCallback(() => {
                    pauseVideo(media);
                });

                tl.addCallback(() => {
                    delete media.tl;
                    const prev = current;
                    current = (current + 1) % mediaList.length;
                    playMedia(mediaList[current]);
                    showMedia(mediaList[prev], mediaList[current]);
                    loadNext();
                }, defaultController.SLIDE_TRANSITION_DURATION + defaultController.SLIDE_IDLE_DURATION);
            } else {
                if (media.tl) {
                    media.tl.play();
                    return;
                }

                const tl = new TimelineMax();

                tl.fromTo(media.$media, defaultController.SLIDE_TRANSITION_DURATION * 2 + defaultController.SLIDE_IDLE_DURATION, {
                    scale: 1.15,
                }, {
                    scale: 1,
                    ease: Power1.easeOut
                }, 0);

                media.tl = tl;

                tl.addCallback(() => {
                    delete media.tl;
                    const prev = current;
                    current = (current + 1) % mediaList.length;
                    playMedia(mediaList[current]);
                    showMedia(mediaList[prev], mediaList[current]);
                    loadNext();
                }, defaultController.SLIDE_TRANSITION_DURATION + defaultController.SLIDE_IDLE_DURATION);
            }
        };

        const pauseMedia = (media) => {
            media.tl && media.tl.pause();

            media.isVideo && pauseVideo(media);
        };

        playMedia(mediaList[0]);

        return {
            pause: (tp) => {
                if (state[tp] == 'paused') return;

                state[tp] = 'paused';

                pauseMedia(mediaList[current]);
            },
            resume: (tp) => {
                if (state[tp] == 'playing') return;
                state[tp] = 'playing';

                var isAllPlaying = _.every(state, (item) => item == 'playing');

                isAllPlaying && playMedia(mediaList[current]);
            }
        };
    },

};

export default defaultController;
