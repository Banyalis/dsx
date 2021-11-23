import $ from 'jquery';
import transitions from 'transitions';

const legalController = {
    init: function (app, resolver) {
        const view = app.view;

        resolver.resolve();
    },

    enter: function (app, resolver) {
        let tl;

        // Page animations
        tl = transitions.legal.enter(app.view);

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

export default legalController;
