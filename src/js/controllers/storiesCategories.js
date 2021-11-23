import $ from 'jquery';
import transitions from 'transitions';
import search from 'blocks/search';


const storiesCategories = {
    init: function (app, resolver) {
        const view = app.view;

        resolver.resolve();
    },

    enter: function (app, resolver) {
        let tl;

        // Page animations
        // tl = transitions.articles.enter(app.view);
        // this.magic = transitions.articles.magic(app.view);

        this.search = new search({
            view: app.view
        });

        // if (tl) {
        //     tl.eventCallback('onComplete', () => resolver.resolve());
        //     tl.play();
        // } else {
            resolver.resolve();
        // }
    },

    leave: function (app, resolver) {
        const view = app.view;

        this.magic && this.magic.destroy();

        this.search && this.search.destroy();
        delete this.search;

        resolver.resolve();
    }
};

export default storiesCategories;