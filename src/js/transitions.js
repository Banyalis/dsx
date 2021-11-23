import $ from 'jquery';
import TweenLite from "gsap/TweenLite";
import TimelineLite from "gsap/TimelineLite";
import CSSPlugin from "gsap/CSSPlugin";
import BezierPlugin from "gsap/BezierPlugin";
import {Linear, Power0, Power1, Power2, Power3, Power4, Back, Circ, Expo, Sine, Bounce, Elastic} from "gsap/EasePack";
import MorphSVGPlugin from "vendor/gsap/plugins/MorphSVGPlugin";
import DrawSVGPlugin from "vendor/gsap/plugins/DrawSVGPlugin";
import SplitText from "vendor/gsap/utils/SplitText";
import ScrollMagic from 'scrollmagic';
import 'vendor/scrollmagic/animation.gsap';
import 'vendor/jquery.masker.js';
import {animateNumber} from './utils';

const gsapPlugins = [CSSPlugin, BezierPlugin, MorphSVGPlugin, DrawSVGPlugin];

const transitions = {
    // TEXT_ANIMATION_DURATION: 4,
    // TEXT_ANIMATION_DELAY: 1,
    // BUTTON_ANIMATION_DURATION: 4,
    // BUTTON_ANIMATION_DELAY: 1,
    // IMAGE_ANIMATION_DURATION: 5,
    TEXT_ANIMATION_DURATION: 1,
    TEXT_ANIMATION_DELAY: 0.07,
    BUTTON_ANIMATION_DURATION: 1,
    BUTTON_ANIMATION_DELAY: 0.07,
    INFO_ANIMATION_DURATION: 1.5,
    INFO_ANIMATION_DELAY: 0.3,
    IMAGE_ANIMATION_DURATION: 2,
    LOADER_HIDE_DELAY: 0.8,
    createTextShowTransition: ($el, isClipped, clipOffset) => {
        const tl = new TimelineLite();
        let split;

        if ($el.hasClass('splitted')) {
            $el.data('tl').stop();
            split = $el.data('split');

            tl.staggerTo($el.data('split-lines'), transitions.TEXT_ANIMATION_DURATION, {
                y: 0,
                opacity: 1,
                ease: Expo.easeOut
            }, transitions.TEXT_ANIMATION_DELAY, 0);
        } else {
            split = new SplitText($el, {type: "lines"});
            $el.addClass('splitted');

            if (isClipped) {
                $(split.lines).wrap(`<div style='overflow: hidden; padding-bottom: ${clipOffset}px; margin-bottom: ${-clipOffset}px'></div>`);
            }

            tl.staggerFromTo(split.lines, transitions.TEXT_ANIMATION_DURATION, {
                y: 40,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                ease: Expo.easeOut
            }, transitions.TEXT_ANIMATION_DELAY, 0);
        }


        $el.data('tl', tl);
        $el.data('split', split);
        $el.data('split-lines', split.lines);

        tl.add(() => {
            $el.removeClass('splitted');
            split.revert()
        });

        return tl;
    },
    createTextHideTransition: ($el, isClipped, clipOffset) => {
        const tl = new TimelineLite();
        let split;

        if ($el.hasClass('splitted')) {
            $el.data('tl').stop();
            split = $el.data('split');

            tl.staggerTo($el.data('split-lines'), transitions.TEXT_ANIMATION_DURATION, {
                y: -40,
                opacity: 0,
                ease: Expo.easeOut
            }, transitions.TEXT_ANIMATION_DELAY, 0);
        } else {
            split = new SplitText($el, {type: "lines"});
            $el.addClass('splitted');

            if (isClipped) {
                $(split.lines).wrap(`<div style='overflow: hidden; padding-bottom: ${clipOffset}px; margin-bottom: ${-clipOffset}px'></div>`);
            }

            tl.staggerFromTo(split.lines, transitions.TEXT_ANIMATION_DURATION, {
                y: 0,
                opacity: 1
            }, {
                y: -40,
                opacity: 0,
                ease: Expo.easeOut
            }, transitions.TEXT_ANIMATION_DELAY, 0);
        }

        $el.data('tl', tl);
        $el.data('split', split);
        $el.data('split-lines', split.lines);

        tl.add(() => {
            $el.removeClass('splitted');
            split.revert()
        });

        return tl;
    },
    createButtonShowTransition: ($el) => {
        const tl = new TimelineLite();

        tl.fromTo($el, transitions.BUTTON_ANIMATION_DURATION, {
            y: 40,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            ease: Expo.easeOut
        }, 0);

        return tl;
    },
    createImageShowTransition: ($el, noOpacityAnimate, startPos) => {
        const tl1 = new TimelineLite();
        const w = $el.parent().width();
        const h = $el.parent().height();

        startPos = startPos == undefined ? 0.7 : startPos;

        tl1.fromTo($el.parent(), transitions.IMAGE_ANIMATION_DURATION, {
            opacity: noOpacityAnimate ? 1 : 0,
            clip: `rect(0,${w*startPos}px,${h}px,0)`
        }, {
            opacity: 1,
            clip: `rect(0,${w}px,${h}px,0)`,
            ease: Expo.easeOut
        }, 0);

        const tl2 = new TimelineLite();

        tl2.fromTo($el, transitions.IMAGE_ANIMATION_DURATION, {
            scale: 1.1
        }, {
            scale: 1,
            ease: Expo.easeOut
        }, 0);

        const tl = new TimelineLite();
        tl.add(tl1, 0);
        tl.add(tl2, 0);

        tl.add(() => {
            $el.parent().css('clip','');
        })

        return tl;
    },
    createImageScrollTransition: ($el) => {
        const tl = new TimelineLite();
        const h = $el.height();
        const parentH = $el.parent().height();

        tl.fromTo($el, 1, {
            y: 0
        }, {
            y: -100 * (h - parentH) / h + '%',
            ease: Power0.easeOut
        }, 0);

        return tl;
    },
    createImageScrollLeftTransition: ($el) => {
        const tl = new TimelineLite();

        tl.fromTo($el, 1, {
            x: '-50%',
            opacity: 0
        }, {
            x: '0%',
            opacity: 1,
            ease: Expo.easeOut
        }, 0);

        return tl;
    },


    readyBlockMagic: ($container, controller) => {

        const $readyClipper = $container.find('.dsx-ready-image-clipper');
        const readySizes = {};

        const updateReadyPos = () => {
            let originalPer = $readyClipper.attr('data-pos');
            let posL = [
                0.15 * readySizes.imageBaseW,
                0,
                0 //buffer
            ];
            let posR = [
                0.85 * readySizes.imageBaseW,
                readySizes.imageBaseW,
                0 //buffer
            ];
            let ind = Math.floor(originalPer);
            let per = originalPer - ind;
            let l = posL[ind] + (posL[ind + 1] - posL[ind]) * per;
            let r = posR[ind] + (posR[ind + 1] - posR[ind]) * per;

            $readyClipper.css('clip', `rect(auto,${r}px,auto,${l}px)`);
        };

        let $tmp = $container.find('.dsx-ready-image-wrapper');
        let tmpTl = new TimelineLite();

        tmpTl.fromTo($tmp, transitions.IMAGE_ANIMATION_DURATION, {
            scale: 1.1,
            opacity: 0
        }, {
            scale: 1,
            opacity: 1,
            ease: Expo.easeOut
        }, 0);

        new ScrollMagic.Scene({
            triggerElement: $tmp[0],
            triggerHook: 'onEnter',
            offset: 100,
            reverse: false
        })
            .setTween(tmpTl)
            .addTo(controller);

        new ScrollMagic.Scene({
            triggerHook: 0.7,
            triggerElement: $tmp[0],
            duration: '120%'
        })
            .setTween(transitions.createImageScrollTransition($tmp))
            .addTo(controller);



        tmpTl = new TweenLite.to($readyClipper, 1, {
            attr:{'data-pos': 1},
            ease: Expo.easeOut,
            onUpdate: updateReadyPos,
            onUpdateParams:["{self}"]}
        );

        new ScrollMagic.Scene({
            triggerElement: $readyClipper[0],
            triggerHook: 'onEnter',
            offset: 100,
            reverse: false
            // duration: '50%'
        })
            .setTween(tmpTl)
            .addTo(controller);

        $container.find('.dsx-ready-image-text').css('opacity', 0);
        new ScrollMagic.Scene({
            triggerElement: $tmp[0],
            triggerHook: 'onEnter',
            offset: 100,
            reverse: false
        })
            .on('enter', () => {
                $container.find('.dsx-ready-image-text').css('opacity', '');
                tmpTl = new TimelineLite();
                tmpTl.add(transitions.createTextShowTransition($container.find('.dsx-ready-image-text h2'), true, 10), 0);
                if ($container.find('.dsx-ready-image-text p').length) {
                    tmpTl.add(transitions.createTextShowTransition($container.find('.dsx-ready-image-text p'), false), '=' + (transitions.TEXT_ANIMATION_DELAY - transitions.TEXT_ANIMATION_DURATION));
                }
                tmpTl.add(transitions.createButtonShowTransition($container.find('.dsx-ready-image-text button')), '=' + (transitions.BUTTON_ANIMATION_DELAY - transitions.TEXT_ANIMATION_DURATION));
                tmpTl.play();
            })
            .addTo(controller);


        const onResize = () => {
            readySizes.imageBaseW = $container.find('.dsx-ready-container').width(),

            updateReadyPos();
        }

        onResize();
        $(window).on('resize', onResize);

        return {
            destroy: () => {
                $(window).off('resize', onResize);
            }
        };
    },

    faqBlockMagic: ($container, controller) => {
        let $tmp = $container.find('.dsx-faq h2').css('opacity', 0);
        $container.find('.dsx-faq .dsx-faq-left button').css('opacity', 0);
        let tmpTl;

        new ScrollMagic.Scene({
            triggerElement: $tmp[0],
            triggerHook: 'onEnter',
            offset: 100,
            reverse: false
        })
            .on('enter', () => {
                $tmp = $container.find('.dsx-faq h2').css('opacity', '');
                $container.find('.dsx-faq .dsx-faq-left button').css('opacity', '');
                tmpTl = new TimelineLite();
                tmpTl.add(transitions.createTextShowTransition($tmp, true), 0);
                tmpTl.add(transitions.createButtonShowTransition($container.find('.dsx-faq .dsx-faq-left button')), '=' + (transitions.TEXT_ANIMATION_DELAY - transitions.TEXT_ANIMATION_DURATION));
                tmpTl.play();
            })
            .addTo(controller);

        $container.find('.dsx-faq-item-question').each((index, item) => {
            $(item).css('opacity', 0);
            new ScrollMagic.Scene({
                triggerElement: item,
                triggerHook: 'onEnter',
                offset: 100,
                reverse: false
            })
                .on('enter', () => {
                    $(item).css('opacity', '');
                    tmpTl = new TimelineLite();
                    tmpTl.add(transitions.createTextShowTransition($(item), false), 0);
                    tmpTl.delay(index * 0.12);
                    tmpTl.play();
                })
                .addTo(controller);
        });
    },

    quotesBlockMagic: ($container, controller) => {
        let $tmp = $container.find('.dsx-quotes-wrapper');
        let tmpTl = new TimelineLite();

        tmpTl.fromTo($container.find('.dsx-quotes-controls'), transitions.TEXT_ANIMATION_DURATION, {
            y: 40,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            ease: Expo.easeOut
        }, 0);

        tmpTl.delay(0.25);

        new ScrollMagic.Scene({
            triggerElement: $tmp[0],
            triggerHook: 'onEnter',
            offset: 100,
            reverse: false
        })
            .setTween(tmpTl)
            .addTo(controller);
    },


    latestBlockMagic: ($container, controller) => {
        return;




        //latest stories block
        let $tmp = $container.find('.dsx-latest h2').css('opacity', 0);
        new ScrollMagic.Scene({
            triggerElement: $tmp[0],
            triggerHook: 'onEnter',
            offset: 100,
            reverse: false
        })
            .on('enter', () => {
                $tmp = $container.find('.dsx-latest h2').css('opacity', '');
                transitions.createTextShowTransition($tmp).play();
            })
            .addTo(controller);

        $tmp = $container.find('.dsx-latest button').css('opacity', 0);
        new ScrollMagic.Scene({
            triggerElement: $tmp[0],
            triggerHook: 'onEnter',
            offset: 100,
            reverse: false
        })
            .on('enter', () => {
                $tmp = $container.find('.dsx-latest button').css('opacity', '');
                transitions.createButtonShowTransition($tmp).play();
            })
            .addTo(controller);

        $container.find('.dsx-latest-block').each((index, item) => {
            $(item).css('opacity', 0);
            new ScrollMagic.Scene({
                triggerElement: item,
                triggerHook: 'onEnter',
                offset: 100,
                reverse: false
            })
                .on('enter', () => {
                    $(item).css('opacity', '');
                    let tmpTl = new TimelineLite();
                    tmpTl.add(transitions.createTextShowTransition($('p', item), false), 0);
                    tmpTl.add(transitions.createTextShowTransition($('h3', item), false), '=' + (transitions.TEXT_ANIMATION_DELAY - transitions.TEXT_ANIMATION_DURATION));
                    tmpTl.add(transitions.createTextShowTransition($('time', item)), '=' + (transitions.TEXT_ANIMATION_DELAY - transitions.TEXT_ANIMATION_DURATION));
                    tmpTl.add(transitions.createImageShowTransition($('.dsx-latest-block-image-wrapper', item)), 0);
                    tmpTl.delay(index * 0.25);
                    tmpTl.play();
                })
                .addTo(controller);

            $tmp = $('.dsx-latest-block-image-wrapper', item);
            new ScrollMagic.Scene({
                triggerHook: 0.7,
                triggerElement: $tmp.parent()[0],
                duration: '120%'
            })
                .setTween(transitions.createImageScrollTransition($tmp))
                .addTo(controller);
        });
    },


    home: {
        enter: ($container) => {
            const tl = new TimelineLite({paused: true});

            const $hero = $container.find('.dsx-hero');
            const sliderTl = transitions.createImageShowTransition($hero.find('.dsx-hero-slider-wrapper'));
            const headerTl = transitions.createTextShowTransition($hero.find('.dsx-hero-texts h1'), true, 10);
            const textTl = transitions.createTextShowTransition($hero.find('.dsx-hero-texts p'), false);
            const buttonTl = transitions.createButtonShowTransition($hero.find('.dsx-hero-texts button'));
            const imageTl = transitions.createImageShowTransition($hero.find('.dsx-hero-image-wrapper'));

            tl.add(headerTl, 0.167);
            tl.add(textTl, '=' + (transitions.TEXT_ANIMATION_DELAY - transitions.TEXT_ANIMATION_DURATION));
            tl.add(buttonTl, '=' + (transitions.BUTTON_ANIMATION_DELAY - transitions.TEXT_ANIMATION_DURATION));
            tl.add(sliderTl, 0);
            tl.add(imageTl, 0.417);

            tl.delay(0.3 + transitions.LOADER_HIDE_DELAY);

            return tl;
        },
        magic: ($container) => {
            const controller = new ScrollMagic.Controller();
            let $tmp;
            let tmpTl;


            //hero block
            $tmp = $container.find('.dsx-hero-slider-wrapper');
            new ScrollMagic.Scene({
                triggerHook: 0.7,
                triggerElement: $tmp.parent()[0],
                duration: '120%',
            })
                .setTween(transitions.createImageScrollTransition($tmp))
                .addTo(controller);

            $tmp = $container.find('.dsx-hero-image-wrapper');
            new ScrollMagic.Scene({
                triggerHook: 0.9,
                triggerElement: $tmp.parent()[0],
                duration: '120%'
            })
                .setTween(transitions.createImageScrollTransition($tmp))
                .addTo(controller);


            //numbers block
            $tmp = $container.find('.dsx-numbers-left p').css('opacity', 0);
            new ScrollMagic.Scene({
                triggerElement: $tmp[0],
                triggerHook: 'onEnter',
                offset: 100,
                reverse: false
            })
                .on('enter', () => {
                    $tmp = $container.find('.dsx-numbers-left p').css('opacity', '');
                    transitions.createTextShowTransition($tmp).play();
                })
                .addTo(controller);

            $container.find('.dsx-numbers-item').each((index, item) => {
                $(item).css('opacity', 0);
                new ScrollMagic.Scene({
                    triggerElement: item,
                    triggerHook: 'onEnter',
                    offset: 100,
                    reverse: false
                })
                    .on('enter', () => {
                        $(item).css('opacity', '');
                        const tl = new TimelineLite();
                        tl.add(transitions.createTextShowTransition($('.dsx-numbers-item-value', item), true, 0), 0);
                        tl.add(transitions.createTextShowTransition($('.dsx-numbers-item-caption', item)), 0);
                        tl.delay(index * 0.12);
                        tl.play();
                        const $span = $(item).find('.dsx-numbers-item-value span');
                        if (!$span.length) return;

                        animateNumber(
                            $span,
                            $span.attr('data-start'),
                            $span.attr('data-end'),
                            0,
                            transitions.TEXT_ANIMATION_DURATION * 1000,
                            null,
                            'easeOutExpo',
                            ','
                        );
                    })
                    .addTo(controller);
            });


            //dive block
            const $diveClipper = $container.find('.dsx-dive-image-clipper');
            const diveSizes = {};

            const updateDivePos = () => {
                let originalPer = $diveClipper.attr('data-pos');
                let posL = [
                    diveSizes.imageBaseX + 0.15 * diveSizes.imageBaseW,
                    diveSizes.imageBaseX,
                    0,
                    0 //buffer
                ];
                let posR = [
                    diveSizes.imageBaseX + 0.85 * diveSizes.imageBaseW,
                    diveSizes.imageBaseX + diveSizes.imageBaseW,
                    diveSizes.containerW,
                    0 //buffer
                ];
                let ind = Math.floor(originalPer);
                let per = originalPer - ind;
                let l = posL[ind] + (posL[ind + 1] - posL[ind]) * per;
                let r = posR[ind] + (posR[ind + 1] - posR[ind]) * per;

                $diveClipper.css('clip', `rect(auto,${r}px,auto,${l}px)`);
            };


            $tmp = $container.find('.dsx-dive-image-wrapper');
            tmpTl = new TimelineLite();

            tmpTl.fromTo($tmp, transitions.IMAGE_ANIMATION_DURATION, {
                scale: 1.1,
                opacity: 0
            }, {
                scale: 1,
                opacity: 1,
                ease: Expo.easeOut
            }, 0);

            new ScrollMagic.Scene({
                triggerElement: $tmp[0],
                triggerHook: 'onEnter',
                offset: 100,
                reverse: false
            })
                .setTween(tmpTl)
                .addTo(controller);

            new ScrollMagic.Scene({
                triggerHook: 0.9,
                triggerElement: $tmp[0],
                duration: '120%'
            })
                .setTween(transitions.createImageScrollTransition($tmp))
                .addTo(controller);



            tmpTl = new TweenLite.to($diveClipper, 1, {
                attr:{'data-pos': 1},
                ease: Expo.easeOut,
                onUpdate: updateDivePos,
                onUpdateParams:["{self}"]}
            );

            new ScrollMagic.Scene({
                triggerElement: $diveClipper[0],
                triggerHook: 'onEnter',
                offset: 100,
                reverse: false
                // duration: '50%'
            })
                .setTween(tmpTl)
                .addTo(controller);


            tmpTl = new TweenLite.to($diveClipper, 1, {
                attr:{'data-pos': 2},
                ease: Expo.easeOut,
                onUpdate: updateDivePos,
                onUpdateParams:["{self}"]}
            );

            new ScrollMagic.Scene({
                triggerElement: $diveClipper[0],
                triggerHook: 'onLeave',
                offset: 100,
                duration: '50%'
            })
                .setTween(tmpTl)
                .addTo(controller);

            $container.find('.dsx-dive-image-text img').masker({
                ScrollMagic: ScrollMagic
            });




            //why block
            $tmp = $container.find('.dsx-why h2').css('opacity', 0);
            new ScrollMagic.Scene({
                triggerElement: $tmp[0],
                triggerHook: 'onEnter',
                offset: 100,
                reverse: false
            })
                .on('enter', () => {
                    $tmp = $container.find('.dsx-why h2').css('opacity', '');
                    transitions.createTextShowTransition($tmp, true, 10).play();
                })
                .addTo(controller);


            $container.find('.dsx-why-small-wrap').each((index, item) => {
                $(item).css('opacity', 0);
                new ScrollMagic.Scene({
                    triggerElement: item,
                    triggerHook: 'onEnter',
                    offset: 100,
                    reverse: false
                })
                    .on('enter', () => {
                        $(item).css('opacity', '');
                        tmpTl = new TimelineLite();
                        tmpTl.add(transitions.createTextShowTransition($('h3', item), false), 0);
                        tmpTl.add(transitions.createTextShowTransition($('p', item), false), '=' + (transitions.TEXT_ANIMATION_DELAY - transitions.TEXT_ANIMATION_DURATION));
                        tmpTl.add(transitions.createImageShowTransition($('.dsx-why-small-image-wrapper', item)), 0);
                        tmpTl.play();
                    })
                    .addTo(controller);

                $tmp = $('.dsx-why-small-image-wrapper', item);
                new ScrollMagic.Scene({
                    triggerHook: 0.7,
                    triggerElement: $tmp.parent()[0],
                    duration: '120%'
                })
                    .setTween(transitions.createImageScrollTransition($tmp))
                    .addTo(controller);
            });


            $container.find('.dsx-why-big-wrap').each((index, item) => {
                $tmp = $('.dsx-why-big-image-clipper', item);

                let bigTl;
                if (index == 0) {
                    bigTl = new TweenLite.fromTo($tmp, transitions.IMAGE_ANIMATION_DURATION, {
                        x: '-3%',
                        y: '13%',
                        scale: 1.05,
                        opacity: 0
                    }, {
                        x: '0%',
                        y: '0%',
                        scale: 1,
                        opacity: 1,
                        ease: Expo.easeOut,
                        paused: true
                    }, 0);
                } else {
                    bigTl = new TweenLite.fromTo($tmp, transitions.IMAGE_ANIMATION_DURATION, {
                        scale: 1.15,
                        opacity: 0
                    }, {
                        scale: 1,
                        opacity: 1,
                        ease: Expo.easeOut,
                        paused: true
                    }, 0);
                }


                $(item).css('opacity', 0);
                new ScrollMagic.Scene({
                    triggerElement: item,
                    triggerHook: 'onEnter',
                    offset: 100,
                    reverse: false
                })
                    .on('enter', () => {
                        $(item).css('opacity', '');
                        let tmpTlText = new TimelineLite();
                        tmpTlText.add(transitions.createTextShowTransition($('h3', item), false), 0);
                        tmpTlText.add(transitions.createTextShowTransition($('p', item), false), '=' + (transitions.TEXT_ANIMATION_DELAY - transitions.TEXT_ANIMATION_DURATION));
                        tmpTlText.play();
                        bigTl.play();
                    })
                    .addTo(controller);

                tmpTl = new TimelineLite();
                tmpTl.add(transitions.createImageScrollTransition($('.dsx-why-big-image-wrapper', item)), 0);
                if (index > 0) {
                    tmpTl.add(new TweenLite.fromTo($('.dsx-why-big-overlay', item), transitions.IMAGE_ANIMATION_DURATION, {
                        opacity: 0
                    }, {
                        opacity: 1,
                        ease: Power0.easeOut
                    }, 0), 0);
                }

                new ScrollMagic.Scene({
                    triggerHook: 1,
                    triggerElement: $('.dsx-why-big-barrier', item)[0],
                    duration: '88%'
                })
                    .setTween(tmpTl)
                    .addTo(controller);
            });



            //discover block
            $container.find('.dsx-discover-image-text img').masker({
                ScrollMagic: ScrollMagic
            });

            $tmp = $container.find('.dsx-discover h2 span').css('opacity', 0);
            new ScrollMagic.Scene({
                triggerElement: $tmp[0],
                triggerHook: 'onEnter',
                offset: 100,
                reverse: false
            })
                .on('enter', () => {
                    $tmp = $container.find('.dsx-discover h2 span').css('opacity', '');
                    transitions.createTextShowTransition($tmp).play();
                })
                .addTo(controller);


            let discoverZIndex = 1;
            let discoverAnimatingImage;
            let hideTimeout;
            $container.find('.dsx-discover-block').each((index, item) => {
                $(item).css('opacity', 0);
                new ScrollMagic.Scene({
                    triggerElement: item,
                    triggerHook: 'onEnter',
                    offset: 100,
                    reverse: false
                })
                    .on('enter', () => {
                        $(item).css('opacity', '');
                        tmpTl = new TimelineLite();
                        tmpTl.add(transitions.createTextShowTransition($('h3', item), false), 0);
                        tmpTl.add(transitions.createTextShowTransition($('p', item), false), '=' + (transitions.TEXT_ANIMATION_DELAY - transitions.TEXT_ANIMATION_DURATION));
                        tmpTl.add(transitions.createButtonShowTransition($('button', item)), '=' + (transitions.BUTTON_ANIMATION_DELAY - transitions.TEXT_ANIMATION_DURATION));
                        tmpTl.add(transitions.createImageShowTransition($('.dsx-discover-block-image-wrapper', item)), 0);
                        tmpTl.delay(index * 0.25);
                        tmpTl.play();
                    })
                    .addTo(controller);

                $tmp = $('.dsx-discover-block-image-wrapper', item);
                new ScrollMagic.Scene({
                    triggerHook: 0.7,
                    triggerElement: $tmp.parent()[0],
                    duration: '120%'
                })
                    .setTween(transitions.createImageScrollTransition($tmp))
                    .addTo(controller);


                // $(item)
                //     .on('mouseenter', (e) => {
                //         clearTimeout(hideTimeout);
                //         if (index == discoverAnimatingImage) return;
                //         $tmp = $container.find('.dsx-discover-bg-image').eq(index).css('z-index', discoverZIndex++);
                //         tmpTl = transitions.createImageShowTransition($('.dsx-discover-bg-image-wrapper', $tmp), true, 0);
                //         tmpTl.play();
                //         discoverAnimatingImage = index;
                //     })
                //     .on('mouseleave', (e) => {
                //         hideTimeout = setTimeout(() => {
                //             tmpTl = new TimelineLite();
                //             //fade out both images
                //             tmpTl.fromTo($container.find('.dsx-discover-bg-image-clipper'), 1, {
                //                 opacity: 1
                //             }, {
                //                 opacity: 0,
                //                 ease: Expo.easeOut
                //             }, 0);

                //             tmpTl.play();
                //             discoverAnimatingImage = undefined;
                //         }, 100);
                //     })

            });


            $tmp = $container.find('.dsx-discover-bg-wrapper');
            new ScrollMagic.Scene({
                triggerHook: 0.7,
                triggerElement: $container.find('.dsx-discover-barrier')[0],
                duration: '70%'
            })
                .setTween(transitions.createImageScrollTransition($tmp))
                .addTo(controller);


            //quote block
            transitions.quotesBlockMagic($container, controller);

            //latest stories
            transitions.latestBlockMagic($container, controller);

            //faq block
            transitions.faqBlockMagic($container, controller);

            //ready block
            let readyTransitions = transitions.readyBlockMagic($container, controller);


            const onResize = () => {
                let $parent = $container.find('.dsx-dive-container');
                let $marker = $container.find('.dsx-dive-marker');

                diveSizes.containerW = $parent.width(),
                diveSizes.imageBaseW = $marker.width(),
                diveSizes.imageBaseX = $marker.offset().left - $parent.offset().left

                updateDivePos();
            }

            onResize();
            $(window).on('resize', onResize);


            return {
                destroy: () => {
                    readyTransitions && readyTransitions.destroy();
                    $container.find('.dsx-dive-image-text img').masker({ destroy: true});
                    $container.find('.dsx-discover-image-text img').masker({ destroy: true});
                    $container.find('.dsx-discover-block').off('mouseenter');
                    controller.destroy();
                    $(window).off('resize', onResize);
                }
            };
        }
    },

    contacts: {
        enter: ($container) => {
            const tl = new TimelineLite({paused: true});

            const $contacts = $container.find('.dsx-contacts');
            const headerTl = transitions.createTextShowTransition($contacts.find('.dsx-contacts-header-title h1'), true, 10);
            const textTl = transitions.createTextShowTransition($contacts.find('.dsx-contacts-header-title p'), false);
            const imageTl = transitions.createImageScrollLeftTransition($contacts.find('.dsx-contacts-box'));
            const input1Tl = transitions.createButtonShowTransition($contacts.find('#dsx-contacts_input_1'));
            const input2Tl = transitions.createButtonShowTransition($contacts.find('#dsx-contacts_input_2'));
            const input3Tl = transitions.createButtonShowTransition($contacts.find('#dsx-contacts_input_3'));
            const input4Tl = transitions.createButtonShowTransition($contacts.find('#dsx-contacts_input_4'));
            const buttonTl = transitions.createButtonShowTransition($contacts.find('.dsx-contacts-button'));

            tl.add(headerTl, 0.167);
            tl.add(textTl, '=' + (transitions.TEXT_ANIMATION_DELAY - transitions.TEXT_ANIMATION_DURATION));
            tl.add(imageTl, 0);
            tl.add(input1Tl, transitions.BUTTON_ANIMATION_DELAY);
            tl.add(input2Tl, transitions.BUTTON_ANIMATION_DELAY * 2);
            tl.add(input3Tl, transitions.BUTTON_ANIMATION_DELAY * 3);
            tl.add(input4Tl, transitions.BUTTON_ANIMATION_DELAY * 4);
            tl.add(buttonTl, transitions.BUTTON_ANIMATION_DELAY * 5);

            tl.delay(0.3 + transitions.LOADER_HIDE_DELAY);

            return tl;
        },

        magic: ($container) => {
            const controller = new ScrollMagic.Controller();
            let $tmp = $container.find('.dsx-contacts-map-wrapper');
            let tmpTl = new TimelineLite();

            tmpTl.fromTo($tmp, transitions.IMAGE_ANIMATION_DURATION, {
                opacity: 0
            }, {
                opacity: 1,
                ease: Expo.easeOut
            }, 0);

            new ScrollMagic.Scene({
                triggerElement: $tmp[0],
                triggerHook: 'onEnter',
                offset: 100,
                reverse: false
            })
                .setTween(tmpTl)
                .addTo(controller);

            tmpTl.delay(transitions.INFO_ANIMATION_DELAY);


            $tmp = $container.find('.dsx-contacts-info');
            tmpTl = new TimelineLite();

            tmpTl.fromTo($tmp, transitions.INFO_ANIMATION_DURATION, {
                y: '-50%',
                opacity: 0.5
            }, {
                y: '0%',
                opacity: 1,
                ease: Expo.easeOut
            }, 0);

            new ScrollMagic.Scene({
                triggerElement: $tmp[0],
                triggerHook: 'onEnter',
                offset: 100,
                reverse: false
            })
                .setTween(tmpTl)
                .addTo(controller);

            $container.find('.dsx-contacts-info-email-wrapper > *').each((index, item) => {
                $(item).css('opacity', 0);
                new ScrollMagic.Scene({
                    triggerElement: item,
                    triggerHook: 'onEnter',
                    offset: 100,
                    reverse: false
                })
                    .on('enter', () => {
                        $(item).css('opacity', '');
                        tmpTl = new TimelineLite();
                        tmpTl.add(transitions.createButtonShowTransition($(item)), 0);
                        tmpTl.delay(transitions.INFO_ANIMATION_DELAY);
                        tmpTl.play();
                    })
                    .addTo(controller);
            });

            $container.find('.dsx-contacts-info-phone-wrapper').each((index, item) => {
                $(item).css('opacity', 0);
                new ScrollMagic.Scene({
                    triggerElement: item,
                    triggerHook: 'onEnter',
                    offset: 100,
                    reverse: false
                })
                    .on('enter', () => {
                        $(item).css('opacity', '');
                        tmpTl = new TimelineLite();
                        tmpTl.add(transitions.createTextShowTransition($(item), false), 0);
                        tmpTl.delay(transitions.INFO_ANIMATION_DELAY * 2);
                        tmpTl.play();
                    })
                    .addTo(controller);
            });

            $container.find('.dsx-contacts-info-address').each((index, item) => {
                $(item).css('opacity', 0);
                new ScrollMagic.Scene({
                    triggerElement: item,
                    triggerHook: 'onEnter',
                    offset: 100,
                    reverse: false
                })
                    .on('enter', () => {
                        $(item).css('opacity', '');
                        tmpTl = new TimelineLite();
                        tmpTl.add(transitions.createTextShowTransition($(item), false), 0);
                        tmpTl.delay(transitions.INFO_ANIMATION_DELAY * 3);
                        tmpTl.play();
                    })
                    .addTo(controller);
            });


            return {
                destroy: () => {
                    controller.destroy();
                }
            };
        },
    },

    legal: {
        enter: ($container) => {
            const tl = new TimelineLite({paused: true});

            const $legal = $container.find('.dsx-legal');
            const headerTl = transitions.createTextShowTransition($legal.find('.dsx-legal-header'), true, 10);

            tl.add(headerTl, 0.167);

            tl.staggerFrom('.dsx-legal-doc', 1, {
                opacity: 0,
                y: 30,
                ease: Expo.easeOut
            }, 0.1, 0);

            tl.delay(0.3 + transitions.LOADER_HIDE_DELAY);

            return tl;
        },
    },

    generic: {
        enter: ($container) => {
            const tl = new TimelineLite({paused: true});

            const $generic = $container.find('.dsx-generic');
            const introBack = $generic.find('.dsx-generic-intro__back');
            const introTitle = transitions.createTextShowTransition($generic.find('.dsx-generic-intro__title'), true, 10);
            const introDownload = $generic.find('.dsx-generic-intro__download');

            tl.from(introBack, 1, {
                opacity: 0,
                y: 30,
                ease: Expo.easeOut
            }, 0);

            tl.add(introTitle, 0);

            if ($('.dsx-generic-intro__text').length > 0) {
                const introText = transitions.createTextShowTransition($generic.find('.dsx-generic-intro__text'), false);
                tl.add(introText, 0.2);
            }

            if ($('.dsx-generic-intro-contents__title').length > 0) {
                const introContentsTitle = $generic.find('.dsx-generic-intro-contents__title');
                const introContentsList = $generic.find('.dsx-generic-intro-contents__nav-item');

                tl.from(introContentsTitle, 1, {
                    opacity: 0,
                    y: 20,
                    ease: Expo.easeOut
                }, 0.2);

                tl.staggerFrom(introContentsList, 1, {
                    opacity: 0,
                    y: 20,
                    ease: Expo.easeOut
                }, 0.1, 0.2);
            }

            tl.from(introDownload, 1, {
                opacity: 0,
                y: 30,
                ease: Expo.easeOut
            }, 0.2);

            tl.delay(0.3 + transitions.LOADER_HIDE_DELAY);

            return tl;
        },

        magic: ($container) => {
            let tmpTl = new TimelineLite();
            const controller = new ScrollMagic.Controller();

            let $tmp = $container.find('.dsx-generic-content__inner');

            tmpTl.from($tmp, 1, {
                opacity: 0,
                y: 50,
                ease: Expo.easeOut
            }, 0);

            new ScrollMagic.Scene({
                triggerElement: $tmp[0],
                triggerHook: 'onEnter',
                offset: 100,
                reverse: false
            })
                .setTween(tmpTl)
                .addTo(controller);

            tmpTl = new TimelineLite();

            $tmp = $container.find('.dsx-generic-content');

            if ($('.dsx-generic-intro-contents__title').length > 0) {
                const contentsNav = $tmp.find('.dsx-generic-content-nav');

                tmpTl.staggerFrom(contentsNav, 1, {
                    opacity: 0,
                    y: 20,
                    ease: Expo.easeOut
                }, 0.1);
            }

            new ScrollMagic.Scene({
                triggerElement: $tmp[0],
                triggerHook: 'onLeave',
                offset: -100,
                reverse: false
            })
                .setTween(tmpTl)
                .addTo(controller);

            tmpTl = new TimelineLite();

            $tmp = $container.find('.dsx-generic-content');
            const scrollTop = $tmp.find('.dsx-generic-scroll-top');

            tmpTl.from(scrollTop, 0.4, {
                autoAlpha: 0,
                y: 50,
                ease: Expo.easeOut
            }, 0);

            new ScrollMagic.Scene({
                triggerElement: $tmp[0],
                triggerHook: 'onLeave',
                offset: 0,
                reverse: true
            })
                .setTween(tmpTl)
                .addTo(controller);

            return {
                destroy: () => {
                    controller.destroy();
                }
            };
        }
    },

    fees: {
        enter: ($container) => {
            const tl = new TimelineLite({paused: true});

            const $fees = $container.find('.dsx-fees');
            const introTitle = transitions.createTextShowTransition($fees.find('.dsx-fees-intro__title'), true, 10);
            const introText = transitions.createTextShowTransition($fees.find('.dsx-fees-intro__text'), false);
            const introBenefits = $fees.find('.dsx-fees-intro-benefits__item');
            const introImage = transitions.createImageShowTransition($fees.find('.dsx-fees-intro-image__inner'));

            tl.add(introTitle, 0);
            tl.add(introText, 0.2);

            tl.staggerFrom(introBenefits, 1, {
                opacity: 0,
                y: 30,
                ease: Expo.easeOut
            }, 0.2, 0.2);

            tl.add(introImage, 0)

            tl.delay(0.3 + transitions.LOADER_HIDE_DELAY);

            return tl;
        },

        magic: ($container) => {
            let tmpTl = new TimelineLite();
            const controller = new ScrollMagic.Controller();

            let $tmp = $container.find('.dsx-fees-calculation');
            const calculationTitle = transitions.createTextShowTransition($tmp.find('.dsx-fees-calculation__title'), true, 10);
            const calculationControl = $tmp.find('.dsx-fees-calculation-control');
            const calculationInfo = $tmp.find('.dsx-fees-calculation-info');

            tmpTl.add(calculationTitle, 0);

            tmpTl.from(calculationControl, 1, {
                opacity: 0,
                y: 50,
                ease: Expo.easeOut
            }, 0);

            tmpTl.from(calculationInfo, 1, {
                opacity: 0,
                y: 50,
                ease: Expo.easeOut
            }, 0.2);

            new ScrollMagic.Scene({
                triggerElement: $tmp[0],
                triggerHook: 'onEnter',
                offset: 300,
                reverse: false
            })
                .setTween(tmpTl)
                .addTo(controller);

            tmpTl = new TimelineLite();

            $tmp = $container.find('.dsx-fees-commission');
            const commissionTitle = transitions.createTextShowTransition($tmp.find('.dsx-fees-commission__title'), true, 10);
            const commissionSidebar = $tmp.find('.dsx-fees-commission__sidebar');
            const commissionContent = $tmp.find('.dsx-fees-commission__content');

            tmpTl.add(commissionTitle, 0);

            tmpTl.from(commissionSidebar, 1, {
                opacity: 0,
                y: 50,
                ease: Expo.easeOut
            }, 0);

            tmpTl.from(commissionContent, 1, {
                opacity: 0,
                y: 50,
                ease: Expo.easeOut
            }, 0.2);

            new ScrollMagic.Scene({
                triggerElement: $tmp[0],
                triggerHook: 'onEnter',
                offset: 300,
                reverse: false
            })
                .setTween(tmpTl)
                .addTo(controller);

            tmpTl = new TimelineLite();

            $tmp = $container.find('.dsx-fees-methods');
            const methodsTitle = transitions.createTextShowTransition($tmp.find('.dsx-fees-methods__title'), true, 10);
            const methodsSwitch = $tmp.find('.dsx-fees-methods-switch__item');
            const methodsInfo = $tmp.find('.dsx-fees-methods__inner');

            tmpTl.add(methodsTitle, 0);

            tmpTl.staggerFrom(methodsSwitch, 1, {
                opacity: 0,
                y: 30,
                ease: Expo.easeOut
            }, 0.1, 0);

            tmpTl.from(methodsInfo, 1, {
                opacity: 0,
                y: 50,
                ease: Expo.easeOut
            }, 0.2);

            new ScrollMagic.Scene({
                triggerElement: $tmp[0],
                triggerHook: 'onEnter',
                offset: 300,
                reverse: false
            })
                .setTween(tmpTl)
                .addTo(controller);

            return {
                destroy: () => {
                    controller.destroy();
                }
            };
        }
    },

    stories: {
        enter: ($container) => {
            const tl = new TimelineLite({paused: true});

            return tl;
        },

        magic: ($container) => {
            let tmpTl = new TimelineLite();
            const controller = new ScrollMagic.Controller();

            let $tmp = $container.find('.dsx-stories-general-articles');
            $container.find('.dsx-stories-general-articles__item').each((index, item) => {
                $(item).css('opacity', 0);
                new ScrollMagic.Scene({
                    triggerElement: item,
                    triggerHook: 'onEnter',
                    offset: 200,
                    reverse: false
                })
                    .on('enter', () => {
                        $(item).css('opacity', '');
                        tmpTl = new TimelineLite();
                        tmpTl.add(transitions.createImageShowTransition($('.dsx-stories-general-articles__item-image__box', item)), 0);
                        tmpTl.add(transitions.createTextShowTransition($('.dsx-stories-general-articles__item-type', item), false), 0.2);
                        tmpTl.add(transitions.createTextShowTransition($('.dsx-stories-general-articles__item-title', item), true, 10), 0.4);
                        tmpTl.play();
                    })
                    .addTo(controller);
            });

            tmpTl = new TimelineLite();

            $tmp = $container.find('.dsx-stories-announcements');
            const announcementsTitleText = transitions.createTextShowTransition($tmp.find('.dsx-stories-announcements-title__text'), true, 10);
            const announcementsTitleButton = $tmp.find('.dsx-stories-announcements-title__button');
            const announcementsArticleImage = transitions.createImageShowTransition($tmp.find('.dsx-stories-announcements-articles__item-image__box'));
            const announcementsArticleDate = transitions.createTextShowTransition($tmp.find('.dsx-stories-announcements-articles__item-date'), false);
            const announcementsArticleTitle = transitions.createTextShowTransition($tmp.find('.dsx-stories-announcements-articles__item-title'), true, 10);

            tmpTl.add(announcementsTitleText, 0);

            tmpTl.from(announcementsTitleButton, 1, {
                opacity: 0,
                x: 50,
                ease: Expo.easeOut
            }, 0);

            tmpTl.add(announcementsArticleImage, 0);
            tmpTl.add(announcementsArticleDate, 0.2);
            tmpTl.add(announcementsArticleTitle, 0.4);

            new ScrollMagic.Scene({
                triggerElement: $tmp[0],
                triggerHook: 'onEnter',
                offset: 300,
                reverse: false
            })
                .setTween(tmpTl)
                .addTo(controller);

            tmpTl = new TimelineLite();

            $tmp = $container.find('.dsx-stories-started');
            const startedTitleText = transitions.createTextShowTransition($tmp.find('.dsx-stories-started-title__text'), true, 10);
            const startedTitleButton = $tmp.find('.dsx-stories-started-title__button');
            const startedArticleImage = transitions.createImageShowTransition($tmp.find('.dsx-stories-started-articles__item-image__box'));
            const startedArticleTitle = transitions.createTextShowTransition($tmp.find('.dsx-stories-started-articles__item-title'), true, 10);

            tmpTl.add(startedTitleText, 0);

            tmpTl.from(startedTitleButton, 1, {
                opacity: 0,
                x: 50,
                ease: Expo.easeOut
            }, 0);

            tmpTl.add(startedArticleImage, 0);
            tmpTl.add(startedArticleTitle, 0.2);

            new ScrollMagic.Scene({
                triggerElement: $tmp[0],
                triggerHook: 'onEnter',
                offset: 300,
                reverse: false
            })
                .setTween(tmpTl)
                .addTo(controller);

            tmpTl = new TimelineLite();

            $tmp = $container.find('.dsx-stories-studies');
            const studiesTitleText = transitions.createTextShowTransition($tmp.find('.dsx-stories-studies-title__text'), true, 10);
            const studiesTitleButton = $tmp.find('.dsx-stories-studies-title__button');
            const studiesArticleImage = transitions.createImageShowTransition($tmp.find('.dsx-stories-studies-articles__item-image__box'));
            const studiesArticleType = transitions.createTextShowTransition($tmp.find('.dsx-stories-studies-articles__item-type'), false);
            const studiesArticleTitle = transitions.createTextShowTransition($tmp.find('.dsx-stories-studies-articles__item-title'), true, 10);

            tmpTl.add(studiesTitleText, 0);

            tmpTl.from(studiesTitleButton, 1, {
                opacity: 0,
                x: 50,
                ease: Expo.easeOut
            }, 0);

            tmpTl.add(studiesArticleImage, 0);
            tmpTl.add(studiesArticleType, 0.2);
            tmpTl.add(studiesArticleTitle, 0.4);

            new ScrollMagic.Scene({
                triggerElement: $tmp[0],
                triggerHook: 'onEnter',
                offset: 300,
                reverse: false
            })
                .setTween(tmpTl)
                .addTo(controller);

            tmpTl = new TimelineLite();

            $tmp = $container.find('.dsx-stories-industry');
            const industryTitleText = transitions.createTextShowTransition($tmp.find('.dsx-stories-industry-title__text'), true, 10);
            const industryTitleButton = $tmp.find('.dsx-stories-industry-title__button');
            const industryArticleImage = transitions.createImageShowTransition($tmp.find('.dsx-stories-industry-articles__item-image__box'));
            const industryArticleTitle = transitions.createTextShowTransition($tmp.find('.dsx-stories-industry-articles__item-title'), true, 10);
            const industryArticleText = transitions.createTextShowTransition($tmp.find('.dsx-stories-industry-articles__item-text'), true, 10);

            tmpTl.add(industryTitleText, 0);

            tmpTl.from(industryTitleButton, 1, {
                opacity: 0,
                x: 50,
                ease: Expo.easeOut
            }, 0);

            tmpTl.add(industryArticleImage, 0);
            tmpTl.add(industryArticleTitle, 0.2);
            tmpTl.add(industryArticleText, 0.4);

            new ScrollMagic.Scene({
                triggerElement: $tmp[0],
                triggerHook: 'onEnter',
                offset: 300,
                reverse: false
            })
                .setTween(tmpTl)
                .addTo(controller);

            tmpTl = new TimelineLite();

            $tmp = $container.find('.dsx-stories-offer');
            const offerTitle = transitions.createTextShowTransition($tmp.find('.dsx-stories-offer__title'), true, 10);
            const offerInput = $tmp.find('.dsx-stories-offer__input');
            const offerButton = $tmp.find('.dsx-stories-offer__button');

            tmpTl.add(offerTitle, 0);

            tmpTl.from(offerInput, 1, {
                opacity: 0,
                y: 50,
                ease: Expo.easeOut
            }, 0.2);

            tmpTl.from(offerButton, 1, {
                opacity: 0,
                y: 50,
                ease: Expo.easeOut
            }, 0.4);

            new ScrollMagic.Scene({
                triggerElement: $tmp[0],
                triggerHook: 'onEnter',
                offset: 300,
                reverse: false
            })
                .setTween(tmpTl)
                .addTo(controller);

            return {
                destroy: () => {
                    controller.destroy();
                }
            };
        }
    },

    about: {
        enter: ($container) => {
            const tl = new TimelineLite({paused: true});

            const $mission = $container.find('.dsx-mission');
            const textTl = transitions.createTextShowTransition($mission.find('.dsx-mission-texts h1'), true, 0);

            tl.add(textTl, 0);

            tl.delay(0.3 + transitions.LOADER_HIDE_DELAY);

            return tl;
        },

        magic: ($container) => {
            const controller = new ScrollMagic.Controller();

            //mission block
            $container.find('.dsx-mission-image').each((index, item) => {
                $(item).css('opacity', 0);
                new ScrollMagic.Scene({
                    triggerElement: item,
                    triggerHook: 'onEnter',
                    offset: 0,
                    reverse: false
                })
                    .on('enter', () => {
                        $(item).css('opacity', '');
                        let tmpTl = new TimelineLite();
                        tmpTl.add(transitions.createImageShowTransition($('.dsx-mission-image-wrapper', item)), 0);
                        tmpTl.play();
                    })
                    .addTo(controller);

                let $tmp = $('.dsx-mission-image-wrapper', item);
                new ScrollMagic.Scene({
                    triggerHook: 0.7,
                    triggerElement: $tmp.parent()[0],
                    duration: '120%'
                })
                    .setTween(transitions.createImageScrollTransition($tmp))
                    .addTo(controller);
            });

            //gradient animation
            let $tmp = $container.find('.dsx-mission-bg-1');
            let tmpTl = new TimelineLite();

            tmpTl.fromTo($tmp, transitions.IMAGE_ANIMATION_DURATION, {
                opacity: 0
            }, {
                opacity: 0.7,
                ease: Expo.easeOut
            }, 0);


            new ScrollMagic.Scene({
                triggerElement: $container.find('.dsx-mission-image.-image1')[0],
                triggerHook: 0.8,
                duration: '150%'
            })
                .setTween(tmpTl)
                .addTo(controller);

            $container.find('.dsx-mission-text p').css('max-height', 0);
            let collapsedTimeout;


            new ScrollMagic.Scene({
                triggerElement: $container.find('.dsx-mission-image.-image1')[0],
                triggerHook: 0.8
            })
                .on('enter', () => {
                    let tween = new TimelineLite();

                    let tmpTl = new TimelineLite();
                    tmpTl.add(transitions.createTextShowTransition($container.find('.dsx-mission-text p.-answer1'), true, 10), 0);
                    tmpTl.add(() => {
                        $container.find('.dsx-mission-text p.-answer1 span').css('color', '#3725D3');
                    });

                    tween.add(tmpTl, 0.15);

                    let span1Tl = new TimelineLite();
                    span1Tl.to($container.find('.dsx-mission-text p.-answer1 span:first-child'), 1, {
                        'color': '#3725D3',
                        ease: Expo.easeOut
                    }, 0);
                    tween.add(span1Tl, 0.167);

                    let span2Tl = new TimelineLite();
                    span2Tl.to($container.find('.dsx-mission-text p.-answer1 span:last-child'), 1, {
                        'color': '#3725D3',
                        ease: Expo.easeOut
                    }, 0);
                    tween.add(span2Tl, 0.3333);

                    tmpTl = new TimelineLite();
                    tmpTl.fromTo($container.find('.dsx-mission-text p.-answer1'), transitions.TEXT_ANIMATION_DURATION * 1.5, {
                        'max-height': 0,
                        'height': ''
                    }, {
                        'max-height': 300,
                        ease: Power1.easeOut
                    }, 0);
                    tween.add(tmpTl, 0);

                    tween.play();

                    clearTimeout(collapsedTimeout);
                    $container.find('.dsx-mission-text h1').addClass('-collapsed');

                    let oldTween = $container.find('.dsx-mission-text p.-answer1').data('tween');
                    oldTween && oldTween.stop();

                    $container.find('.dsx-mission-text p.-answer1').data('tween', tween);
                })
                .on('leave', () => {
                    let tween = new TimelineLite();

                    let tmpTl = new TimelineLite();
                    tmpTl.add(transitions.createTextHideTransition($container.find('.dsx-mission-text p.-answer1'), true, 10), 0);
                    tween.add(tmpTl, 0);

                    tmpTl = new TimelineLite();
                    tmpTl.to($container.find('.dsx-mission-text p.-answer1'), transitions.TEXT_ANIMATION_DURATION * 0.7, {
                        'height': 0,
                        'max-height': 0,
                        ease: Power1.easeOut
                    }, 0);
                    tmpTl.delay(0.15);
                    tween.add(tmpTl, 0);

                    clearTimeout(collapsedTimeout);
                    collapsedTimeout = setTimeout(() => {
                        $container.find('.dsx-mission-text h1').removeClass('-collapsed');
                    }, 150);

                    tween.play();

                    let oldTween = $container.find('.dsx-mission-text p.-answer1').data('tween');
                    oldTween && oldTween.stop();

                    $container.find('.dsx-mission-text p.-answer1').data('tween', tween);
                })
                .addTo(controller);



            //gradient animation
            $tmp = $container.find('.dsx-mission-bg-2');
            tmpTl = new TimelineLite();

            tmpTl.fromTo($tmp, transitions.IMAGE_ANIMATION_DURATION, {
                opacity: 0
            }, {
                opacity: 1,
                ease: Expo.easeOut
            }, 0);


            new ScrollMagic.Scene({
                triggerElement: $container.find('.dsx-mission-image.-image2')[0],
                triggerHook: 0.7,
                duration: '150%'
            })
                .setTween(tmpTl)
                .addTo(controller);

            new ScrollMagic.Scene({
                triggerElement: $container.find('.dsx-mission-image.-image2')[0],
                triggerHook: 0.7
            })
                .on('enter', () => {
                    let tween = new TimelineLite();

                    $container.find('.dsx-mission-text p.-answer2').css('max-height', '');

                    let tmpTl = new TimelineLite();
                    tmpTl.add(transitions.createTextShowTransition($container.find('.dsx-mission-text p.-answer2'), true, 10), 0);
                    tmpTl.add(() => {
                        $container.find('.dsx-mission-text p.-answer2 span').css('color', '#F5BE02');
                    });
                    tween.add(tmpTl, 0);

                    let span1Tl = new TimelineLite();
                    span1Tl.to($container.find('.dsx-mission-text p.-answer2 span:first-child'), 1, {
                        'color': '#F5BE02',
                        ease: Expo.easeOut
                    }, 0);
                    tween.add(span1Tl, 0.167);

                    let span2Tl = new TimelineLite();
                    span2Tl.to($container.find('.dsx-mission-text p.-answer2 span:nth-child(1n+1)'), 1, {
                        'color': '#F5BE02',
                        ease: Expo.easeOut
                    }, 0);
                    tween.add(span2Tl, 0.233);

                    tmpTl = new TimelineLite();
                    tmpTl.add(transitions.createTextHideTransition($container.find('.dsx-mission-text p.-answer1'), true, 10), 0);
                    tmpTl.add(() => {
                        $container.find('.dsx-mission-text p.-answer1').css('opacity', 0);
                    })
                    tween.add(tmpTl, 0);

                    tween.play();

                    let oldTween = $container.find('.dsx-mission-text p.-answer2').data('tween');
                    oldTween && oldTween.stop();

                    $container.find('.dsx-mission-text p.-answer2').data('tween', tween);
                })
                .on('leave', () => {
                    let tween = new TimelineLite();

                    $container.find('.dsx-mission-text p.-answer1').css('opacity', '');

                    let tmpTl = new TimelineLite();
                    tmpTl.add(transitions.createTextHideTransition($container.find('.dsx-mission-text p.-answer2'), true, 10), 0);
                    tmpTl.add(() => {
                        $container.find('.dsx-mission-text p.-answer2').css('max-height', 0);
                    });
                    tween.add(tmpTl, 0);

                    tmpTl = new TimelineLite();
                    tmpTl.add(transitions.createTextShowTransition($container.find('.dsx-mission-text p.-answer1'), true, 10), 0);
                    tween.add(tmpTl, 0);

                    tween.play();

                    let oldTween = $container.find('.dsx-mission-text p.-answer2').data('tween');
                    oldTween && oldTween.stop();

                    $container.find('.dsx-mission-text p.-answer2').data('tween', tween);
                })
                .addTo(controller);



            //standout block
            $container.find('.dsx-standout-image, .dsx-standout-founder-image').each((index, item) => {
                let $wrapper = $('.dsx-standout-image-wrapper, .dsx-standout-founder-image-wrapper', item);
                $(item).css('opacity', 0);

                new ScrollMagic.Scene({
                    triggerElement: item,
                    triggerHook: 'onEnter',
                    offset: 100,
                    reverse: false
                })
                    .on('enter', () => {
                        $(item).css('opacity', '');
                        let tmpTl = new TimelineLite();
                        tmpTl.add(transitions.createImageShowTransition($wrapper), 0);
                        tmpTl.play();
                    })
                    .addTo(controller);

                new ScrollMagic.Scene({
                    triggerHook: 0.7,
                    triggerElement: $wrapper.parent()[0],
                    duration: '120%'
                })
                    .setTween(transitions.createImageScrollTransition($wrapper))
                    .addTo(controller);
            });


            $tmp = $container.find('.dsx-standout-bg img');
            tmpTl = new TimelineLite();

            tmpTl.fromTo($tmp, transitions.IMAGE_ANIMATION_DURATION, {
                opacity: 0
            }, {
                opacity: 1,
                ease: Expo.easeOut
            }, 0);

            new ScrollMagic.Scene({
                triggerElement: $tmp[0],
                triggerHook: 'onEnter',
                offset: 100,
                reverse: false
            })
                .setTween(tmpTl)
                .addTo(controller);


            $container.find('.dsx-standout-text').each((index, item) => {
                $(item).css('opacity', 0);
                new ScrollMagic.Scene({
                    triggerElement: item,
                    triggerHook: 'onEnter',
                    offset: 100,
                    reverse: false
                })
                    .on('enter', () => {
                        $(item).css('opacity', '');
                        tmpTl = new TimelineLite();
                        tmpTl.add(transitions.createTextShowTransition($('h2', item), false), 0);
                        tmpTl.add(transitions.createTextShowTransition($('p', item), false), '=' + (transitions.TEXT_ANIMATION_DELAY - transitions.TEXT_ANIMATION_DURATION));
                        tmpTl.play();
                    })
                    .addTo(controller);
            });


            $container.find('.dsx-standout-founder-text').each((index, item) => {
                $(item).css('opacity', 0);
                new ScrollMagic.Scene({
                    triggerElement: item,
                    triggerHook: 'onEnter',
                    offset: 100,
                    reverse: false
                })
                    .on('enter', () => {
                        $(item).css('opacity', '');
                        tmpTl = new TimelineLite();
                        tmpTl.add(transitions.createTextShowTransition($('.dsx-standout-founder-name', item), false), 0);
                        tmpTl.add(transitions.createTextShowTransition($('.dsx-standout-founder-position', item), false), '=' + (transitions.TEXT_ANIMATION_DELAY - transitions.TEXT_ANIMATION_DURATION));
                        tmpTl.play();
                    })
                    .addTo(controller);
            });


            //spontaneous block
            $container.find('.dsx-spontaneous-text').each((index, item) => {
                $(item).css('opacity', 0);
                new ScrollMagic.Scene({
                    triggerElement: item,
                    triggerHook: 'onEnter',
                    offset: 100,
                    reverse: false
                })
                    .on('enter', () => {
                        $(item).css('opacity', '');
                        tmpTl = new TimelineLite();
                        tmpTl.add(transitions.createTextShowTransition($(item), false), 0);
                        tmpTl.play();
                    })
                    .addTo(controller);
            });



            const $spontaneousClipper = $container.find('.dsx-spontaneous-image-clipper');
            const spontaneousSizes = {};

            const updateSpontaneousPos = () => {
                let originalPer = $spontaneousClipper.attr('data-pos');
                let posL = [
                    0.15 * spontaneousSizes.imageBaseW,
                    0,
                    0 //buffer
                ];
                let posR = [
                    0.85 * spontaneousSizes.imageBaseW,
                    spontaneousSizes.imageBaseW,
                    0 //buffer
                ];
                let ind = Math.floor(originalPer);
                let per = originalPer - ind;
                let l = posL[ind] + (posL[ind + 1] - posL[ind]) * per;
                let r = posR[ind] + (posR[ind + 1] - posR[ind]) * per;

                $spontaneousClipper.css('clip', `rect(auto,${r}px,auto,${l}px)`);
            };

            $tmp = $container.find('.dsx-spontaneous-image-wrapper');
            tmpTl = new TimelineLite();

            tmpTl.fromTo($tmp, transitions.IMAGE_ANIMATION_DURATION, {
                scale: 1.1,
                opacity: 0
            }, {
                scale: 1,
                opacity: 1,
                ease: Expo.easeOut
            }, 0);

            new ScrollMagic.Scene({
                triggerElement: $tmp[0],
                triggerHook: 'onEnter',
                offset: 100,
                reverse: false
            })
                .setTween(tmpTl)
                .addTo(controller);

            new ScrollMagic.Scene({
                triggerHook: 0.7,
                triggerElement: $tmp[0],
                duration: '120%'
            })
                .setTween(transitions.createImageScrollTransition($tmp))
                .addTo(controller);



            tmpTl = new TweenLite.to($spontaneousClipper, 1, {
                attr:{'data-pos': 1},
                ease: Expo.easeOut,
                onUpdate: updateSpontaneousPos,
                onUpdateParams:["{self}"]}
            );

            new ScrollMagic.Scene({
                triggerElement: $spontaneousClipper[0],
                triggerHook: 'onEnter',
                offset: 100,
                reverse: false
                // duration: '50%'
            })
                .setTween(tmpTl)
                .addTo(controller);

            let $maskerImg = $container.find('.dsx-spontaneous-image-text img');


            //services block
            $tmp = $container.find('.dsx-services-container h2').css('opacity', 0);
            new ScrollMagic.Scene({
                triggerElement: $tmp[0],
                triggerHook: 'onEnter',
                offset: 100,
                reverse: false
            })
                .on('enter', () => {
                    $tmp = $container.find('.dsx-services-container h2').css('opacity', '');
                    transitions.createTextShowTransition($tmp).play();
                })
                .addTo(controller);


            $container.find('.dsx-services-item').each((index, item) => {
                let tmpTl = new TweenLite.fromTo($(item), transitions.TEXT_ANIMATION_DURATION, {
                    y: 40,
                    opacity: 0
                }, {
                    y: 0,
                    opacity: 1,
                    ease: Expo.easeOut
                }, 0);

                tmpTl.delay(index * 0.15);

                new ScrollMagic.Scene({
                    triggerElement: item,
                    triggerHook: 'onEnter',
                    offset: 100,
                    reverse: false
                })
                    .setTween(tmpTl)
                    .addTo(controller);
            });


            //team block
            $container.find('.dsx-team-container h2, .dsx-team-text-top, .dsx-team-text-bottom').each((index, item) => {
                $(item).css('opacity', 0);
                new ScrollMagic.Scene({
                    triggerElement: item,
                    triggerHook: 'onEnter',
                    offset: 100,
                    reverse: false
                })
                    .on('enter', () => {
                        $(item).css('opacity', '');
                        tmpTl = new TimelineLite();
                        tmpTl.add(transitions.createTextShowTransition($(item), false), 0);
                        tmpTl.play();
                    })
                    .addTo(controller);
            });


            $tmp = $container.find('.dsx-team-controls').parent();
            tmpTl = new TimelineLite();

            tmpTl.fromTo($tmp, transitions.TEXT_ANIMATION_DURATION, {
                y: 40,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                ease: Expo.easeOut
            }, 0);

            tmpTl.delay(0.25);

            new ScrollMagic.Scene({
                triggerElement: $tmp[0],
                triggerHook: 'onEnter',
                offset: 100,
                reverse: false
            })
                .setTween(tmpTl)
                .addTo(controller);


            const $teamClipper = $container.find('.dsx-team-slider-clipper');
            const teamSizes = {};

            const updateTeamPos = () => {
                let originalPer = $teamClipper.attr('data-pos');
                let posL = [
                    0.15 * teamSizes.imageBaseW,
                    0,
                    0 //buffer
                ];
                let posR = [
                    0.85 * teamSizes.imageBaseW,
                    teamSizes.imageBaseW,
                    0 //buffer
                ];
                let ind = Math.floor(originalPer);
                let per = originalPer - ind;
                let l = posL[ind] + (posL[ind + 1] - posL[ind]) * per;
                let r = posR[ind] + (posR[ind + 1] - posR[ind]) * per;

                $teamClipper.css('clip', `rect(auto,${r}px,auto,${l}px)`);
            };

            $tmp = $container.find('.dsx-team-slider-wrapper');
            tmpTl = new TimelineLite();

            tmpTl.fromTo($tmp, transitions.IMAGE_ANIMATION_DURATION, {
                scale: 1.1,
                opacity: 0
            }, {
                scale: 1,
                opacity: 1,
                ease: Expo.easeOut
            }, 0);

            new ScrollMagic.Scene({
                triggerElement: $tmp[0],
                triggerHook: 'onEnter',
                offset: 100,
                reverse: false
            })
                .setTween(tmpTl)
                .addTo(controller);

            new ScrollMagic.Scene({
                triggerHook: 0.9,
                triggerElement: $tmp[0],
                duration: '150%'
            })
                .setTween(transitions.createImageScrollTransition($tmp))
                .addTo(controller);



            tmpTl = new TweenLite.to($teamClipper, 1, {
                attr:{'data-pos': 1},
                ease: Expo.easeOut,
                onUpdate: updateTeamPos,
                onUpdateParams:["{self}"]}
            );

            new ScrollMagic.Scene({
                triggerElement: $teamClipper[0],
                triggerHook: 'onEnter',
                offset: 100,
                reverse: false
                // duration: '50%'
            })
                .setTween(tmpTl)
                .addTo(controller);



            //staff block
            $container.find('.dsx-staff-tomorrow-wrapper, .dsx-staff-gallery-wrapper, .dsx-staff-info-wrapper').each((index, item) => {
                let tmpTl = new TimelineLite();

                tmpTl.fromTo($(item), transitions.TEXT_ANIMATION_DURATION, {
                    y: 40,
                    opacity: 0
                }, {
                    y: 0,
                    opacity: 1,
                    ease: Expo.easeOut
                }, 0);

                new ScrollMagic.Scene({
                    triggerElement: item,
                    triggerHook: 'onEnter',
                    offset: 100,
                    reverse: false
                })
                    .setTween(tmpTl)
                    .addTo(controller);
            });


            //latest stories
            transitions.latestBlockMagic($container, controller);




            const onResize = () => {
                spontaneousSizes.imageBaseW = $container.find('.dsx-spontaneous-image-container').width(),
                teamSizes.imageBaseW = $container.find('.dsx-team-slider').width(),

                updateSpontaneousPos();
                updateTeamPos();
            }

            onResize();
            $(window).on('resize', onResize);


            return {
                destroy: () => {
                    controller.destroy();
                    $(window).off('resize', onResize);
                }
            };
        }
    },

    partners: {
        enter: ($container) => {
            const tl = new TimelineLite({paused: true});

            const $partnering = $container.find('.dsx-partnering');
            const imageTl = transitions.createImageShowTransition($partnering.find('.dsx-partnering-image-wrapper'));
            const headerTl = transitions.createTextShowTransition($partnering.find('.dsx-partnering-texts h1'), true, 10);
            const textTl = transitions.createTextShowTransition($partnering.find('.dsx-partnering-texts p'), false);

            let bgTl;

            if ($(window).scrollTop() < 100) {
                bgTl = new TweenLite.fromTo($container.find('.dsx-studies-bg'), 0.83, {
                    y: 50,
                    opacity: 0
                }, {
                    y: 0,
                    opacity: 1,
                    ease: Expo.easeOut
                }, 0);
            }

            tl.add(headerTl, 0.167);
            tl.add(textTl, '=' + (transitions.TEXT_ANIMATION_DELAY - transitions.TEXT_ANIMATION_DURATION));
            bgTl && tl.add(bgTl, 0.167 + 0.217);
            tl.add(imageTl, 0);

            tl.delay(0.3 + transitions.LOADER_HIDE_DELAY);

            return tl;
        },

        magic: ($container) => {
            let tmpTl;
            let $tmp;
            const controller = new ScrollMagic.Controller();

            //delay if visible initially, at the same time with hero block
            let instantDelay = 0.3 + transitions.LOADER_HIDE_DELAY + 0.5;
            let startTime = + new Date();

            //partnering block
            $tmp = $container.find('.dsx-partnering-image-wrapper');
            new ScrollMagic.Scene({
                triggerHook: 0.7,
                triggerElement: $tmp.parent()[0],
                duration: '120%',
            })
                .setTween(transitions.createImageScrollTransition($tmp))
                .addTo(controller);


            //case studies block
            $container.find('.dsx-studies h2, .dsx-studies-case-category, .dsx-studies-case-title, .dsx-studies-case-text, .dsx-studies-case-improvement-text').each((index, item) => {
                $(item).css('opacity', 0);
                new ScrollMagic.Scene({
                    triggerElement: item,
                    triggerHook: 'onEnter',
                    offset: 100,
                    reverse: false
                })
                    .on('enter', () => {
                        if (startTime + 200 < +new Date()) {
                            instantDelay = 0;
                        }

                        $(item).css('opacity', '');
                        tmpTl = new TimelineLite();
                        tmpTl.add(transitions.createTextShowTransition($(item), false), 0);
                        tmpTl.delay(($(item).attr('data-delay') || 0) / 1000 + instantDelay);
                        tmpTl.play();
                    })
                    .addTo(controller);
            });

            $container.find('.dsx-studies-case-improvement-image, button.dsx-btn.dsx-btn_stroke-yellow ').each((index, item) => {
                let tmpTl = new TweenLite.fromTo($(item), transitions.TEXT_ANIMATION_DURATION, {
                    y: 40,
                    opacity: 0
                }, {
                    y: 0,
                    opacity: 1,
                    ease: Expo.easeOut
                }, 0);
                tmpTl.pause();

                new ScrollMagic.Scene({
                    triggerElement: item,
                    triggerHook: 'onEnter',
                    offset: 100,
                    reverse: false
                })
                    .on('enter', () => {
                        if (startTime + 200 < +new Date()) {
                            instantDelay = 0;
                        }
                        console.log(instantDelay);

                        tmpTl.delay(($(item).attr('data-delay') || 0) / 1000 + instantDelay);
                        tmpTl.play();
                    })
                    .addTo(controller);
            });

            $container.find('.dsx-studies-case-image').each((index, item) => {
                $(item).css('opacity', 0);
                new ScrollMagic.Scene({
                    triggerElement: item,
                    triggerHook: 'onEnter',
                    offset: 0,
                    reverse: false
                })
                    .on('enter', () => {
                        if (startTime + 200 < +new Date()) {
                            instantDelay = 0;
                        }
                        $(item).css('opacity', '');
                        let tmpTl = new TimelineLite();
                        tmpTl.add(transitions.createImageShowTransition($('.dsx-studies-case-image-wrapper', item)), 0);
                        tmpTl.delay(instantDelay);
                        tmpTl.play();
                    })
                    .addTo(controller);

                let $tmp = $('.dsx-studies-case-image-wrapper', item);
                new ScrollMagic.Scene({
                    triggerHook: 0.7,
                    triggerElement: $tmp.parent()[0],
                    duration: '120%'
                })
                    .setTween(transitions.createImageScrollTransition($tmp))
                    .addTo(controller);
            });

            $container.find('.dsx-studies-case-image-logo').each((index, item) => {
                let tmpTl = new TweenLite.fromTo($(item), transitions.TEXT_ANIMATION_DURATION, {
                    opacity: 0
                }, {
                    opacity: 1,
                    ease: Expo.easeOut
                }, 0);
                tmpTl.pause();


                new ScrollMagic.Scene({
                    triggerElement: item,
                    triggerHook: 'onEnter',
                    offset: 100,
                    reverse: false
                })
                    .on('enter', () => {
                        if (startTime + 200 < +new Date()) {
                            instantDelay = 0;
                        }

                        tmpTl.delay(0.1 + instantDelay);
                        tmpTl.play();
                    })
                    .addTo(controller);
            });


            //powerful
            $container.find('.dsx-powerful h2, .dsx-powerful h3 span, .dsx-powerful-text, .dsx-powerful-bottom').each((index, item) => {
                $(item).css('opacity', 0);
                new ScrollMagic.Scene({
                    triggerElement: item,
                    triggerHook: 'onEnter',
                    offset: 100,
                    reverse: false
                })
                    .on('enter', () => {
                        $(item).css('opacity', '');
                        tmpTl = new TimelineLite();
                        tmpTl.add(transitions.createTextShowTransition($(item), false), 0);
                        tmpTl.play();
                    })
                    .addTo(controller);
            });

            $container.find('.dsx-powerful button ').each((index, item) => {
                let tmpTl = new TweenLite.fromTo($(item), transitions.TEXT_ANIMATION_DURATION, {
                    y: 30,
                    opacity: 0
                }, {
                    y: 0,
                    opacity: 1,
                    ease: Expo.easeOut
                }, 0);

                new ScrollMagic.Scene({
                    triggerElement: item,
                    triggerHook: 'onEnter',
                    offset: 100,
                    reverse: false
                })
                    .setTween(tmpTl)
                    .addTo(controller);
            });


            //safe
            $container.find('.dsx-safe-texts > *').each((index, item) => {
                $(item).css('opacity', 0);
                new ScrollMagic.Scene({
                    triggerElement: item,
                    triggerHook: 'onEnter',
                    offset: 100,
                    reverse: false
                })
                    .on('enter', () => {
                        $(item).css('opacity', '');
                        tmpTl = new TimelineLite();
                        tmpTl.add(transitions.createTextShowTransition($(item), false), 0);
                        tmpTl.play();
                    })
                    .addTo(controller);
            });


            $container.find('.dsx-safe-image').each((index, item) => {
                $(item).css('opacity', 0);
                new ScrollMagic.Scene({
                    triggerElement: item,
                    triggerHook: 'onEnter',
                    offset: 100,
                    reverse: false
                })
                    .on('enter', () => {
                        $(item).css('opacity', '');
                        tmpTl = new TimelineLite();
                        tmpTl.add(transitions.createImageShowTransition($('.dsx-safe-image-wrapper', item)), 0);
                        tmpTl.play();
                    })
                    .addTo(controller);

                $tmp = $('.dsx-safe-image-wrapper', item);
                new ScrollMagic.Scene({
                    triggerHook: 0.7,
                    triggerElement: $tmp.parent()[0],
                    duration: '120%'
                })
                    .setTween(transitions.createImageScrollTransition($tmp))
                    .addTo(controller);
            });


            //quote block
            transitions.quotesBlockMagic($container, controller);

            //faq block
            transitions.faqBlockMagic($container, controller);

            //ready block
            let readyTransitions = transitions.readyBlockMagic($container, controller);


            return {
                destroy: () => {
                    readyTransitions && readyTransitions.destroy();
                    controller.destroy();
                }
            };
        }
    },



    story: {
        enter: ($container) => {
            const tl = new TimelineLite({paused: true});

            const $head = $container.find('.dsx-story-head');
            const imageTl = transitions.createImageShowTransition($head.find('.dsx-story-head-image-wrapper'));
            const backTl = transitions.createButtonShowTransition($head.find('.dsx-story-head-texts-back'));
            const headerTl = transitions.createTextShowTransition($head.find('.dsx-story-head-texts h1'), true, 10);
            const metaTl = transitions.createTextShowTransition($head.find('.dsx-story-head-texts-meta'), false);

            const contentTl = new TimelineLite();
            contentTl.fromTo($container.find('.dsx-story-content-inner'), 1, {
                opacity: 0,
                y: 50
            }, {
                opacity: 1,
                y: 0,
                ease: Expo.easeOut
            }, 0);


            // let bgTl = new TweenLite.fromTo($container.find('.dsx-story-head-bg'), 0.83, {
            //     y: 50,
            //     opacity: 0
            // }, {
            //     y: 0,
            //     opacity: 1,
            //     ease: Expo.easeOut
            // }, 0);

            tl.add(backTl, 0.167);
            tl.add(headerTl, 0.167 + transitions.TEXT_ANIMATION_DELAY);
            tl.add(metaTl, '=' + (transitions.TEXT_ANIMATION_DELAY - transitions.TEXT_ANIMATION_DURATION));
            tl.add(contentTl, '=' + (transitions.TEXT_ANIMATION_DELAY - transitions.TEXT_ANIMATION_DURATION));
            tl.add(imageTl, 0);

            tl.delay(0.3 + transitions.LOADER_HIDE_DELAY);

            return tl;
        },

        magic: ($container) => {
            let tmpTl;
            let $tmp;
            const controller = new ScrollMagic.Controller();

            //head block
            $tmp = $container.find('.dsx-story-head-image-wrapper');
            new ScrollMagic.Scene({
                triggerHook: 0.7,
                triggerElement: $tmp.parent()[0],
                duration: '120%',
            })
                .setTween(transitions.createImageScrollTransition($tmp))
                .addTo(controller);

            //more block
            $tmp = $container.find('.dsx-story-more h2').css('opacity', 0);
            new ScrollMagic.Scene({
                triggerElement: $tmp[0],
                triggerHook: 'onEnter',
                offset: 100,
                reverse: false
            })
                .on('enter', () => {
                    $tmp = $container.find('.dsx-story-more h2').css('opacity', '');
                    transitions.createTextShowTransition($tmp).play();
                })
                .addTo(controller);

            $tmp = $container.find('.dsx-story-more button').css('opacity', 0);
            new ScrollMagic.Scene({
                triggerElement: $tmp[0],
                triggerHook: 'onEnter',
                offset: 100,
                reverse: false
            })
                .on('enter', () => {
                    $tmp = $container.find('.dsx-story-more button').css('opacity', '');
                    transitions.createButtonShowTransition($tmp).play();
                })
                .addTo(controller);

            $container.find('.dsx-story-more-block').each((index, item) => {
                $(item).css('opacity', 0);
                new ScrollMagic.Scene({
                    triggerElement: item,
                    triggerHook: 'onEnter',
                    offset: 100,
                    reverse: false
                })
                    .on('enter', () => {
                        $(item).css('opacity', '');
                        let tmpTl = new TimelineLite();
                        let isFirst = true;
                        if ($('p', item).length) {
                            tmpTl.add(transitions.createTextShowTransition($('p', item), false), isFirst ? 0 : '=' + (transitions.TEXT_ANIMATION_DELAY - transitions.TEXT_ANIMATION_DURATION));
                            isFirst = false;
                        }
                        if ($('time', item).length) {
                            tmpTl.add(transitions.createTextShowTransition($('time', item)), isFirst ? 0 : '=' + (transitions.TEXT_ANIMATION_DELAY - transitions.TEXT_ANIMATION_DURATION));
                            isFirst = false;
                        }
                        tmpTl.add(transitions.createTextShowTransition($('h3', item), false), isFirst ? 0 : '=' + (transitions.TEXT_ANIMATION_DELAY - transitions.TEXT_ANIMATION_DURATION));
                        tmpTl.add(transitions.createImageShowTransition($('.dsx-story-more-block-image-wrapper', item)), 0);
                        tmpTl.delay(index * 0.25);
                        tmpTl.play();
                    })
                    .addTo(controller);

                $tmp = $('.dsx-story-more-block-image-wrapper', item);
                new ScrollMagic.Scene({
                    triggerHook: 0.7,
                    triggerElement: $tmp.parent()[0],
                    duration: '120%'
                })
                    .setTween(transitions.createImageScrollTransition($tmp))
                    .addTo(controller);
            });

            return {
                destroy: () => {
                    controller.destroy();
                }
            };
        }
    },

    navbar: {
        logo: {
            morph: (tween) => {
                const tl = new TimelineLite({paused: true});
                const paths = tween.find('path');

                tl.to(paths[2], 0.2, {
                    morphSVG: {
                        shape: "M14.07,0a12.5,12.5,0,1,0,12.5,12.5A12.5,12.5,0,0,0,14.07,0Zm0,18.75a6.25,6.25,0,1,1,6.31-6.25A6.28,6.28,0,0,1,14.07,18.75Z"
                    }, ease: Sine.easeOut
                }, 0);

                tl.to(paths[1], 0.2, {
                    morphSVG: {
                        shape: "M48.24,25a12.5,12.5,0,1,1,12.5-12.5A12.5,12.5,0,0,1,48.24,25Z",
                        shapeIndex: [-7, -61]
                    }, ease: Sine.easeOut
                }, 0.03);

                tl.to(paths[0], 0.2, {
                    morphSVG: {
                        shape: "M84.85,25a12.5,12.5,0,1,1,12.5-12.5A12.5,12.5,0,0,1,84.85,25Z"
                    }, ease: Sine.easeOut
                }, 0.06);

                return tl;
            }
        },
        enter: ($container) => {
            const tl = new TimelineLite({paused: true});

            $('.dsx-navbar-links > *:visible, .dsx-navbar-actions > *:visible').each((index, item) => {
                const tempTl = new TimelineLite();

                tempTl.fromTo($(item), 1, {
                    y: 30,
                    opacity: 0
                }, {
                    y: 0,
                    opacity: 1,
                    ease: Expo.easeOut
                }, 0);

                tl.add(tempTl, 0.05 * index);
            });

            tl.delay(transitions.LOADER_HIDE_DELAY);

            return tl;
        }
    },
    footer: {
        magic: ($container) => {
            const controller = new ScrollMagic.Controller();
            let $tmp = $('.dsx-footer');
            let tmpTl = new TimelineLite();

            tmpTl.fromTo($('.dsx-footer').find('.dsx-footer-overlay'), 0, {
                y: 0,
            }, {
                y: '100%',
                ease: Power1.easeOut
            }, 0);

            new ScrollMagic.Scene({
                triggerElement: $tmp[0],
                triggerHook: 'onEnter',
                offset: 100,
                reverse: false
            })
                .setTween(tmpTl)
                .addTo(controller);

            return {
                destroy: () => {
                    controller.destroy();
                }
            };
        },
    },
};

export default transitions;
