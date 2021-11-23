import $ from 'jquery';
import _ from 'lodash';
import page from './page';
import transitions from 'transitions';
import homeController from 'controllers/home';
import contactsController from 'controllers/contacts';
import aboutController from 'controllers/about';
import legalController from 'controllers/legal';
import genericController from 'controllers/generic';
import feesController from 'controllers/fees';
import storiesController from 'controllers/stories';
import partnersController from 'controllers/partners';
import storyController from 'controllers/story';
import storiesCategoriesController from 'controllers/storiesCategories';
import proController from 'controllers/pro';
import {loadIntercom, loadMatomo, loadGa} from './third-party-script-loaders';
import config from './config';
// const FontFaceObserver = require('fontfaceobserver');

//fix for hovers|active on mobile, WEIRD!
//fastclick solves this problem, but adds a bunch of other
$('body').on('touchstart', '*', () => {});

const app = {
    req: {
        url: window.location.href
    },
    controllers: {
        homeController,
        contactsController,
        aboutController,
        legalController,
        genericController,
        feesController,
        storiesController,
        partnersController,
        storyController,
        storiesCategoriesController,
        proController
    }
};

app.init = function () {
    // Init page
    this.page = page;
    this.page.init(app);

    // Loader promises
    let loadResolver = $.Deferred();
    window.addEventListener('load', () => {
        loadResolver.resolve();
    });
    this.loaders = [loadResolver.promise()];

    // Init controller
    let ctrl = this.view.data('controller');
    if (ctrl && app.controllers[ctrl]) {
        var controller = app.controllers[ctrl];
        let initResolver = $.Deferred();
        controller.init(app, initResolver);
        this.loaders.push(initResolver.promise());
    }

    // const lang = $('html').attr('lang');
    // const fontName = lang == 'ru' ? 'Aeroport' : 'Aeonik';

    // var font400 = new FontFaceObserver(fontName, {
    //     weight: 400,
    //     style: 'normal'
    // });

    // var font500 = new FontFaceObserver(fontName, {
    //     weight: 500,
    //     style: 'normal'
    // });

    // var font700 = new FontFaceObserver(fontName, {
    //     weight: 700,
    //     style: 'normal'
    // });

    // this.loaders.push(font400.load(null, 60000));
    // this.loaders.push(font500.load(null, 60000));
    // this.loaders.push(font700.load(null, 60000));


    if (!window.loaderCompleted) {
        const loadedResolver = $.Deferred();

        // Listen for the loaderCompleted Event.
        document.addEventListener('loaderCompleted', function (e) {
            loadedResolver.resolve();
        }, false);

        this.loaders.push(loadedResolver.promise());
    }


    // Loader wait
    $.when.apply($, this.loaders).done(function () {
        $('html').removeClass('loading')

        loadIntercom();
        setTimeout(loadMatomo, 200);
        loadGa();

        app.page.refresh(app);

        //navbar and footer animation
        (function() {
            //start navbar animation after auth processing
            transitions.navbar.enter(app.view).play();
        })();

        app.hideLoader();

        // Enter animation
        if (ctrl && controller && controller.enter) {
            const enterResolver = $.Deferred();
            controller.enter(app, enterResolver);
            enterResolver.done(() => page.complete(app));
        } else {
            page.complete(app);
        }
    });
};

app.showLoader = function(req) {
    $(".dsx-loader").addClass('-visible');
}

app.hideLoader = function() {
    $(".dsx-loader").removeClass('-visible');
}

app.reqPage = function (params) {
    const options = params || this.req;
    const req = $.ajax({
        url: options.url,
        data: options.query,
        // xhr: function() {
        //     var xhr = new window.XMLHttpRequest();
        //     //Download progress
        //     xhr.addEventListener("progress", function(evt) {
        //         console.log(evt.lengthComputable, evt.loaded, evt.total);
        //         if (evt.lengthComputable) {
        //             var percentComplete = evt.loaded / evt.total;
        //             //Do something with upload progress
        //             console.log(percentComplete);
        //         }
        //     }, false);

        //     return xhr;
        // },
    });
    // app.showLoader(req);

    page.away(app);

    req.done(function (data) {
        app.req.html = $(data);

        let ctrl = app.req.html.filter('#view-main').data('controller');
        let loaders = [];

        setTimeout(() => {

            $(window).scrollTop(0);

            // Update data & refresh page
            page.update(app);
            page.refresh(app);
            app.hideLoader();

            // Callback
            if (typeof(options.onDone) === "function") {
                options.onDone.call(app);
            }

            // Init controller
            if (ctrl && app.controllers[ctrl]) {
                var controller = app.controllers[ctrl];
                let initResolver = $.Deferred();
                controller.init(app, initResolver);
                loaders.push(initResolver.promise());
            }

            // Enter animation
            if (options.triggerEnter && ctrl && controller && controller.enter) {
                const enterResolver = $.Deferred();
                controller.enter(app, enterResolver);
                enterResolver.done(() => page.complete(app));
            } else {
                page.complete(app);
            }
        }, 200);
    });

    req.fail(function (jqXHR, textStatus) {
        if (jqXHR.status === 404) {
            return;
        }

        alert(`Failed to load page: ${textStatus}`);
        page.refresh(app);
        app.hideLoader();
    });

    return req;
};

app.goTo = function (url, params = {}) {
    const prevCtrl = app.view.data('controller');

    const defaults = {
        replace: false,
        query: {},
        triggerLeave: true,
        triggerEnter: true,
        prevCtrl: prevCtrl,
        onDone: null,
        pushState: true,
    };

    if (typeof(url) === "string") {
        params.url = url;
    } else {
        params = url;
    }

    let options = $.extend(defaults, params);
    app.req = options;

    // Trigger Leave
    if (options.triggerLeave && prevCtrl) {
        const leaveResovler = $.Deferred();

        if (app.controllers[prevCtrl] && app.controllers[prevCtrl].leave) {
            app.controllers[prevCtrl].leave(app, leaveResovler);
        }

        leaveResovler.done(() => {
            app.reqPage();
        });
    }

    if (options.pushState) {
        if (options.replace) {
            window.history.replaceState({}, '', options.url);
        } else {
            window.history.pushState({}, '', options.url);
        }
    }

    // Make request
    if (!options.triggerLeave) {
        app.reqPage();
    }
};

$(window).on('navbar-forced-minimize-on', () => {
    $("#navbar").addClass('-forced-minimize');
});


$(window).on('navbar-forced-minimize-off', () => {
    $("#navbar").removeClass('-forced-minimize');
});


app.init();

//handle history
window.addEventListener('popstate', function () {
    app.goTo(window.location.href, {pushState: false});
});

//handle navigation
$('body').on("click", "a", function (e) {
    const self = $(this);
    const href = self.attr('href');
    const isInternalAttr = self.attr('internal');
    const isInternal = typeof isInternalAttr !== 'undefined' && isInternalAttr !== false;

    if (isInternal && href && typeof (href) === "string") {
        e.preventDefault();
        app.goTo(href);
    }
});

window.app = app;
