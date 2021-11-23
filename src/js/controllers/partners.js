import $ from 'jquery';
import transitions from 'transitions';

import ScrollMagic from 'scrollmagic';
import quotes from 'blocks/quotes';
import faq from 'blocks/faq';

const partnersController = {
    init: function (app, resolver) {
        const view = app.view;

        resolver.resolve();
    },

    enter: function (app, resolver) {
        let tl;

        // Page animations
        tl = transitions.partners.enter(app.view);
        this.magic = transitions.partners.magic(app.view);

        if ('IntersectionObserver' in window) {
            let callback = (entries, observer) => {
              entries.forEach(entry => {
                let $title = $(entry.target).parent();
                if (entry.intersectionRect.height > 0 && entry.intersectionRect.top <= 0) {
                    $title.addClass('sticked');
                } else {
                    $title.removeClass('sticked');
                }
              });
            };

            let options = {
              root: null,
              rootMargin: '0px',
              threshold: 1.0
            }

            this.observer = new IntersectionObserver(callback, options);
            this.observer.observe(app.view.find('.dsx-powerful-title.dsx-powerful-title--1 div')[0]);
            this.observer.observe(app.view.find('.dsx-powerful-title.dsx-powerful-title--2 div')[0]);
            this.observer.observe(app.view.find('.dsx-powerful-title.dsx-powerful-title--3 div')[0]);

            this.controller = new ScrollMagic.Controller();

            this.powerfulScene = new ScrollMagic.Scene({
                triggerHook: 0.5,
                triggerElement: app.view.find('.dsx-powerful-text.dsx-powerful-text--3')[0],
                offset: 50
            })
                .on('enter', () => {
                    app.view.find('.dsx-powerful-title').addClass('colored');
                })
                .on('leave', () => {
                    app.view.find('.dsx-powerful-title').removeClass('colored');
                })
                .addTo(this.controller);
        }



        this.quotes = new quotes({
            view: app.view
        });

        this.faq = new faq({
            view: app.view
        });

        if (tl) {
            tl.eventCallback('onComplete', () => resolver.resolve());
            tl.play();
        } else {
            resolver.resolve();
        }
    },

    leave: function (app, resolver) {
        const view = app.view;

        if (this.observer) {
            this.observer.disconnect();
            delete this.observer;
        }

        this.quotes.destroy();
        delete this.quotes;

        this.faq.destroy();
        delete this.faq;

        this.powerfulScene && this.powerfulScene.destroy();
        this.controller && this.controller.destroy();
        this.magic && this.magic.destroy();

        resolver.resolve();
    }
};

export default partnersController;