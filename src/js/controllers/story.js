import $ from 'jquery';
import transitions from 'transitions';
import ScrollMagic from 'scrollmagic';
const Sharer = require('sharer.js');

const storyController = {
    init: function (app, resolver) {
        const view = app.view;

        resolver.resolve();
    },

    enter: function (app, resolver) {
        let tl;

        // Page animations
        tl = transitions.story.enter(app.view);
        this.magic = transitions.story.magic(app.view);

        app.view.find('.dsx-story-content-top').on('click', () => {
            $('body, html').animate({'scrollTop': 0}, 400);
        });

        this.controller = new ScrollMagic.Controller();

        this.topScene = new ScrollMagic.Scene({
            triggerElement: app.view.find('.dsx-story-content')[0],
            triggerHook: 0.3
        })
            .on('enter', () => {
                app.view.find('.dsx-story-content-top').addClass('visible');
            })
            .on('leave', () => {
                app.view.find('.dsx-story-content-top').removeClass('visible');
            })
            .addTo(this.controller);

        if (tl) {
            tl.eventCallback('onComplete', () => resolver.resolve());
            tl.play();
        } else {
            resolver.resolve();
        }
    },

    leave: function (app, resolver) {
        const view = app.view;

        this.topScene && this.topScene.destroy();
        this.controller && this.controller.destroy();
        this.magic && this.magic.destroy();

        resolver.resolve();
    }
};

export default storyController;