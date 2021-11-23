import $ from 'jquery';
import transitions from 'transitions';

const proController = {
    init: function (app, resolver) {
        const view = app.view;

        resolver.resolve();
    },

    enter: function (app, resolver) {

        // Page anchors
        function pageAnchors() {
            app.view.find('.dsx-pro-services-nav__item').on('click', (e) => {
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

        let tl;

        // Page animations
        tl = transitions.fees.enter(app.view);
        this.magic = transitions.fees.magic(app.view);

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

export default proController;