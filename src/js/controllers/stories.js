import $ from 'jquery';
import 'slick-carousel';
import 'slick-carousel/slick/slick.scss';
import transitions from 'transitions';
import storiesGallery from 'blocks/stories-gallery';
import search from 'blocks/search';

const storiesController = {
    init: function (app, resolver) {
        const view = app.view;

        this.onStoriesSearchOpened = this.onStoriesSearchOpened.bind(this);
        this.onStoriesSearchClosed = this.onStoriesSearchClosed.bind(this);

        resolver.resolve();
    },

    enter: function (app, resolver) {
        this.search = new search({
            view: app.view
        });

        this.galleryAnnouncements = new storiesGallery({
            $container: app.view.find('.dsx-stories-announcements-articles__inner'),
            $scroller: app.view.find('.dsx-stories-announcements-articles__slider'),
            $leftHoverArea: app.view.find('.dsx-stories-announcements__hover-area-left'),
            $rightHoverArea: app.view.find('.dsx-stories-announcements__hover-area-right'),
            itemsSelector: '.dsx-stories-announcements-articles__item'
        });

        this.galleryStarted = new storiesGallery({
            $container: app.view.find('.dsx-stories-started-articles__inner'),
            $scroller: app.view.find('.dsx-stories-started-articles__slider'),
            $leftHoverArea: app.view.find('.dsx-stories-started__hover-area-left'),
            $rightHoverArea: app.view.find('.dsx-stories-started__hover-area-right'),
            itemsSelector: '.dsx-stories-started-articles__item'
        });

        this.galleryStudies = new storiesGallery({
            $container: app.view.find('.dsx-stories-studies-articles__inner'),
            $scroller: app.view.find('.dsx-stories-studies-articles__slider'),
            $leftHoverArea: app.view.find('.dsx-stories-studies__hover-area-left'),
            $rightHoverArea: app.view.find('.dsx-stories-studies__hover-area-right'),
            itemsSelector: '.dsx-stories-studies-articles__item'
        });

        this.galleryIndustry = new storiesGallery({
            $container: app.view.find('.dsx-stories-industry-articles__inner'),
            $scroller: app.view.find('.dsx-stories-industry-articles__slider'),
            $leftHoverArea: app.view.find('.dsx-stories-industry__hover-area-left'),
            $rightHoverArea: app.view.find('.dsx-stories-industry__hover-area-right'),
            itemsSelector: '.dsx-stories-industry-articles__item'
        });

        $(window).on('stories-search-opened', this.onStoriesSearchOpened);
        $(window).on('stories-search-closed', this.onStoriesSearchClosed);

        let tl;

        // Page animations
        tl = transitions.stories.enter(app.view);
        this.magic = transitions.stories.magic(app.view);

        if (tl) {
            tl.eventCallback('onComplete', () => resolver.resolve());
            tl.play();
        } else {
            resolver.resolve();
        }
    },

    onStoriesSearchOpened: function() {
        app.view.find('.dsx-stories-content-wrapper').hide();
    },

    onStoriesSearchClosed: function() {
        app.view.find('.dsx-stories-content-wrapper').show();
    },


    leave: function (app, resolver) {
        const view = app.view;

        this.magic && this.magic.destroy();

        this.search && this.search.destroy();
        delete this.search;

        this.galleryAnnouncements && this.galleryAnnouncements.destroy();
        this.galleryStarted && this.galleryStarted.destroy();
        this.galleryStudies && this.galleryStudies.destroy();
        this.galleryIndustry && this.galleryIndustry.destroy();

        $(window).off('stories-search-opened', this.onStoriesSearchOpened);
        $(window).off('stories-search-closed', this.onStoriesSearchClosed);

        resolver.resolve();
    }
};

export default storiesController;