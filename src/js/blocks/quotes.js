import $ from 'jquery';
import _ from 'lodash';
import TweenLite from "gsap/TweenLite";
import TimelineLite from "gsap/TimelineLite";
import CSSPlugin from "gsap/CSSPlugin";
import BezierPlugin from "gsap/BezierPlugin";
import {Linear, Power0, Power1, Power2, Power3, Power4, Back, Circ, Expo, Sine, Bounce, Elastic} from "gsap/EasePack";
import SplitText from "vendor/gsap/utils/SplitText";
import ScrollMagic from 'scrollmagic';
import 'vendor/scrollmagic/animation.gsap';
const gsapPlugins = [CSSPlugin, BezierPlugin, MorphSVGPlugin, DrawSVGPlugin];

import {PageVisibilityManager} from '../utils';

let quotes = function(params) {
    this.QUOTE_DURATION = 10;
    this.QUOTE_CHANGE_DELAY = 0.17;
    this.QUOTE_HIDE_DURATION = 0.5;
    this.QUOTE_HIDE_DURATION_OPACITY = 0.33;
    this.QUOTE_HIDE_DELAY = 0.05;
    this.QUOTE_SHOW_DURATION = 1.67 ;
    this.QUOTE_SHOW_DURATION_OPACITY = 1.67;
    this.QUOTE_SHOW_DELAY = 0.05;

    this.quoteManager = this._startQuote(params.view.find('.dsx-quotes'));

    this._onPageVisibilityChange = this._onPageVisibilityChange.bind(this);

    this.controller = new ScrollMagic.Controller();

    this.sceneQuote = new ScrollMagic.Scene({
        triggerElement: params.view.find('.dsx-quotes-wrapper')[0],
        triggerHook: 'onEnter',
        duration: '200%',
    })
        .on('enter', () => {
            this.quoteManager.resume('scroll')
        })
        .on('leave', () => {
            this.quoteManager.pause('scroll')
        })
        .addTo(this.controller);

    params.view.find('.dsx-quotes-arrow-left').on('click', () => this.quoteManager.gotoPrev());
    params.view.find('.dsx-quotes-arrow-right').on('click', () => this.quoteManager.gotoNext());

    PageVisibilityManager.addEventListener(this._onPageVisibilityChange);
}

quotes.prototype = {
    destroy() {
        this.sceneQuote && this.sceneQuote.destroy();
        this.controller && this.controller.destroy();

        PageVisibilityManager.removeEventListener(this._onPageVisibilityChange);
    },

    _onPageVisibilityChange() {
        if (PageVisibilityManager.isPageHidden()) {
            this.quoteManager.pause('visibility');
        } else {
            this.quoteManager.resume('visibility');
        }
    },

    _startQuote($container) {
        let current = 0;
        let quotesList = [];
        let state = {};
        let firstTime = true;
        let direction  = 1;
        const $indicator = $container.find('.dsx-quotes-progress-indicator');

        $container.find('.dsx-quotes-item').each((index, item) => {
            quotesList.push({
                $text: $(item).find('.dsx-quotes-item-text'),
                $author: $(item).find('.dsx-quotes-item-author'),
                index: index
            });

            quotesList[quotesList.length - 1].$text.css({'opacity': 0, 'visibility': 'hidden'});
            quotesList[quotesList.length - 1].$author.css({'opacity': 0, 'visibility': 'hidden'});
        });

        const animateQuote = (tp, quote, elType, $el) => {
            quote.animateTl = quote.animateTl || {};

            if (quote.animateTl[elType]) {
                quote.animateTl[elType].progress(1).kill();
                delete quote.animateTl[elType];
            }

            let tl;
            let tlShift;
            let tlOpacity;
            let split;

            $el.addClass('splitted');

            if (tp == 'show') {
                $el.css({'opacity': '', 'visibility': ''});

                split = new SplitText($el, {type: "lines"});
                tl = new TimelineLite();
                tlShift = new TimelineLite();
                tlOpacity = new TimelineLite();

                tlShift.staggerFromTo(split.lines, this.QUOTE_SHOW_DURATION, {
                    y: 30
                }, {
                    y: 0,
                    ease: Expo.easeOut
                }, this.QUOTE_SHOW_DELAY, 0);

                tlOpacity.staggerFromTo(split.lines, this.QUOTE_SHOW_DURATION_OPACITY, {
                    opacity: 0
                }, {
                    opacity: 1,
                    ease: Expo.easeOut
                }, this.QUOTE_SHOW_DELAY, 0);

                tl.add(tlShift, 0);
                tl.add(tlOpacity, 0);

                tl.add(() => {
                    $el.removeClass('splitted');
                    split.revert()
                    delete quote.animateTl[elType];
                });
            } else {
                split = new SplitText($el, {type: "lines"});
                tl = new TimelineLite();
                tlShift = new TimelineLite();
                tlOpacity = new TimelineLite();

                tlShift.staggerFromTo(split.lines, this.QUOTE_HIDE_DURATION, {
                    y: 0
                }, {
                    y: -30,
                    ease: Expo.easeOut
                }, this.QUOTE_HIDE_DELAY, 0);

                tlOpacity.staggerFromTo(split.lines, this.QUOTE_HIDE_DURATION_OPACITY, {
                    opacity: 1
                }, {
                    opacity: 0,
                    ease: Expo.easeOut
                }, this.QUOTE_HIDE_DELAY, 0);

                tl.add(tlShift, 0);
                tl.add(tlOpacity, 0);

                tl.add(() => {
                    $el.removeClass('splitted');
                    split.revert();
                    delete quote.animateTl[elType];
                    $el.css({'opacity': 0, 'visibility': 'hidden'});
                });
            }

            quote.animateTl[elType] = tl;

            return tl;
        }


        const showQuote = (prevQuote, quote) => {
            const tl = new TimelineLite();

            if (prevQuote) {
                tl.add(animateQuote('hide', prevQuote, 'text', prevQuote.$text), 0);
                tl.add(animateQuote('hide', prevQuote, 'author', prevQuote.$author), '=' + (this.QUOTE_HIDE_DELAY - this.QUOTE_HIDE_DURATION));
            }

            tl.add(animateQuote('show', quote, 'text', quote.$text), prevQuote ? this.QUOTE_CHANGE_DELAY : 0);
            tl.add(animateQuote('show', quote, 'author', quote.$author), '=' + (this.QUOTE_SHOW_DELAY - this.QUOTE_SHOW_DURATION));

            tl.play();

            $container.find('.dsx-quotes-numbers span').eq(0).text(quote.index + 1);
            $container.find('.dsx-quotes-numbers span').eq(1).text('/' + quotesList.length);
        }

        const playQuote = (quote) => {
            if (firstTime) {
                showQuote(null, quotesList[current]);
            }

            firstTime = false;

            if (quote.tl) {
                quote.tl.play();
                return;
            }

            const tl = new TimelineMax();

            tl.fromTo(quote.$text, this.QUOTE_DURATION, {
                attr: {'data-progress': 0}
            }, {
                attr: {'data-progress': 1},
                onUpdate: () => {
                    $indicator.css('width', quote.$text.attr('data-progress') * 100 + '%');
                },
                ease: Power0.easeOut
            }, 0);

            quote.tl = tl;

            tl.add

            tl.add(() => {
                delete quote.tl;
                const prev = current;
                current = (current + direction + quotesList.length) % quotesList.length;
                playQuote(quotesList[current]);
                showQuote(quotesList[prev], quotesList[current]);
                direction = 1; //restore forward direction
            });
        };

        const pauseQuote = (quote) => {
            quote.tl && quote.tl.pause();
        };


        return {
            pause: (tp) => {
                if (state[tp] == 'paused') return;

                state[tp] = 'paused';

                pauseQuote(quotesList[current]);
            },
            resume: (tp) => {
                if (state[tp] == 'playing') return;
                state[tp] = 'playing';

                var isAllPlaying = _.every(state, (item) => item == 'playing');

                isAllPlaying && playQuote(quotesList[current]);
            },
            gotoPrev: () => {
                direction = -1; //set reverse direction once
                quotesList[current].tl && quotesList[current].tl.progress(1);
            },
            gotoNext: () => {
                quotesList[current].tl && quotesList[current].tl.progress(1);
            }
        };
    }
}



export default quotes;