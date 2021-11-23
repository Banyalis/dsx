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
import transitions from 'transitions';
require('jquery-ellipsis');

let search = function(params) {
    this.onSearchClick = this.onSearchClick.bind(this);
    this.onSearchClose = this.onSearchClose.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onInputKeyPress = this.onInputKeyPress.bind(this);

    this.$el = $(params.view).find('.dsx-search');
    this.category = this.$el.attr('data-category');
    this.$blockTemplate = this.$el.find('.dsx-search-results-block.-template');

    this.$el.find('.dsx-search-panel-list__action.-make-search').on('click', this.onSearchClick);
    this.$el.find('.dsx-search-panel-close').on('click', this.onSearchClose);
    this.$el.find('.dsx-search-panel-input input').on('keypress', this.onInputKeyPress);
    $(window).on('keydown', this.onKeyDown);

    this.cache = [];
    this.currentPage = 1;

    //TODO: should be initially rendered on backend
    //show all from current category
    if (this.category != 'All') {
        this.makeSearch('', 1);
    }
}

search.prototype = {
    onSearchClick() {
        this.$el.addClass('-search-opened');
        this.$el.find('input').focus();
    },

    onSearchClose() {
        this.$el.removeClass('-sticked');
        $(window).trigger('navbar-forced-minimize-off');
        this.$el.removeClass('-not-found');

        this.$el.removeClass('-search-opened');

        //show all from current category
        //if was search by query, otherwise no update needed
        if (this.lastSearchQuery != '') {
            if (this.category != 'All') {
                this.makeSearch('', 1);
            } else {
                $(window).trigger('stories-search-closed');
                this.$el.find('.dsx-search-results-container').empty();
                this.$el.find('.dsx-search-pagination').hide();
            }
        }
    },

    onKeyDown(e) {
        if (e.keyCode == 27) {
            this.onSearchClose();
        }
    },

    onInputKeyPress(e) {
        const str = $(e.target).val();

        if (!str) return;

        if (e.keyCode == 13) {
            this.makeSearch(str, 1);
            this.$el.addClass('-sticked');
            $(window).trigger('navbar-forced-minimize-on');
        }
    },

    makeSearch(str, page) {

        this.lastSearchQuery = str;

        var strEncoded = 'cache_' + encodeURIComponent(_.escape(str)); //to prevent own object properties intersection and other bad situations

        //get from local cache
        if (this.cache[strEncoded + '_' + page]) {
            this._render(this.cache[strEncoded + '_' + page]);
            return;
        }

        //TODO: made real ajax request + reset previous one
        //ajax request imitation
        const categories = [
            'Announcements',
            'Getting Started',
            'Industry',
            'Case Studies'
        ];
        const blockchainTitles = [
            '<span>Blockchain</span> in the shipping industry',
            'What is <span>Blockchain</span> Technology? A Step-by-Step Guide',
            'How <span>blockchain</span>s could change the world'
        ];
        const cryptoTitles = [
            '<span>Crypto</span>currency News and Breaking <span>Crypto</span> Updates',
            'Coin Market Capitalization lists of <span>Crypto</span> Currencies',
            '<span>Crypto</span> Trading Signals'
        ];
        const allTitles = [
            'Blockchain in the shipping industry',
            'What is Blockchain Technology? A Step-by-Step Guide',
            'How blockchains could change the world',
            'Cryptocurrency News and Breaking Crypto Updates',
            'Coin Market Capitalization lists of Crypto Currencies',
            'Crypto Trading Signals'
        ];
        const times = [
            '8 Nov 2019',
            '2 Jan 2019',
            '15 Dec 2018',
            '29 Apr 2018',
            '18 May 2019'
        ];
        const subcategories = [
            'Shipping Industry',
            'IT Industry',
            'Food Industry',
            'ePayments'
        ];
        const texts = [
            'We are happy to announce that DSX is now fully integrated with Crypto Pro.We are happy to announce that DSX is now fully integrated with Crypto Pro.',
            'Growing up in the post-internet era can make you much more open to all kinds of epayments.Growing up in the post-internet era can make you much more open to all kinds of epayments.',
            'Apps of all types rule our lives today. From paying bills to personalising suggestions.Apps of all types rule our lives today. From paying bills to personalising suggestions.',
            'Over the past decade or so, increasingly affordable mobile phones tendency revealed. Over the past decade or so, increasingly affordable mobile phones tendency revealed.'
        ];
        const imagesStarted = [4, 5, 4];
        const imagesOther = [1, 2, 3, 6, 7];


        setTimeout(() => {
            const notFound = str != 'blockchain' && str != 'crypto' && str != '';
            let titles;
            let cnt;
            const perPage = 12;

            if (notFound) {
                cnt = 8;
                titles = allTitles;
            }

            if (str == '') {
                cnt = 140;
                titles = allTitles;
            }

            if (str == 'blockchain') {
                cnt = 125;
                titles = blockchainTitles;
            }

            if (str == 'crypto') {
                cnt = 15;
                titles = cryptoTitles;
            }

            var data = [];
            for (let i = 0; i < cnt; i++) {
                let category = categories[i % categories.length];
                let images = category == 'Getting Started' ? imagesStarted : imagesOther;
                let story = {
                    'url': '/stories/' + i,
                    'image': '/homepage/assets/img/story/more_' + images[i % images.length] + '.jpg',
                    'image2x': '/homepage/assets/img/story/more_' + images[i % images.length] + '@2x.jpg',
                    'time': times[i % times.length],
                    'category': category,
                    'subcategory': subcategories[i % subcategories.length],
                    'title': titles[i % titles.length],
                    'text': texts[i % texts.length]
                }

                data.push(story);
            }

            //filter data by current category
            data = _.filter(data, (item) => {
                return item.category == this.category || this.category == 'All';
            });

            let totalPages = Math.ceil(data.length / perPage);
            let currentPage = Math.min(page, totalPages);

            data = data.slice((currentPage - 1) * 12, page * 12);

            this.cache[strEncoded + '_' + page] = {
                mostRead: notFound ? data : [],
                stories: notFound ? [] : data,
                totalPages: totalPages,
                currentPage: currentPage
            },

            this._render(this.cache[strEncoded + '_' + page]);
        }, 700 + Math.random(700));
    },

    _render(data) {

        if (this.category == 'All') {
            $(window).trigger('stories-search-opened');
        }

        this.$el.toggleClass('-not-found', !data.stories.length);

        this.$el.find('.dsx-search-results-container').empty();

        _.each(data.stories.length ? data.stories : data.mostRead, (item) => {
            let $block = this.$blockTemplate.clone().removeClass('-template');

            $block.attr('href', item.url);

            $block.find('img')
                .attr('src', item.image)
                .attr('srcset', item.image2x + ' 2x');

            if (item.time) {
                $block.find('.dsx-search-results-block-texts time').html(item.time);
            } else {
                $block.find('.dsx-search-results-block-texts time').remove();
            }

            if (item.subcategory) {
                $block.find('.dsx-search-results-block-texts p').html(item.subcategory);
            } else {
                $block.find('.dsx-search-results-block-texts p').remove();
            }

            $block.find('.dsx-search-results-block-texts h3').html(item.title);

            if (item.text) {
                $block.find('.dsx-search-results-block-texts div').html(item.text);
            } else {
                $block.find('.dsx-search-results-block-texts div').remove();
            }

            $block.appendTo(this.$el.find('.dsx-search-results-container'));
        })

        this.$el.find('.dsx-search-results-container .dsx-search-results-block-texts div').ellipsis({
            type: 'lines',
            count: 2
        });

        const $pagination = this.$el.find('.dsx-search-pagination');
        const $pages = this.$el.find('.dsx-search-pagination-pages');
        const $button = this.$el.find('.dsx-search-pagination button');
        let pages = [];

        if (data.totalPages == 1) {
            pages = []
        } else if (data.currentPage < 3) {
            pages = [1, 2, 3, 4];
        } else if (data.currentPage < 5) {
            pages = [1, 2, 3, 4, 5];
        } else {
            pages = [1, 0, data.currentPage - 1, data.currentPage, data.currentPage + 1];
        }

        $pages.empty();
        _.each(pages, (item) => {
            if (item <= data.totalPages) {
                const $page = $('<div>')
                    .addClass('dsx-search-pagination-page')
                    .toggleClass('-ellipsis', item == 0)
                    .toggleClass('-current', item == data.currentPage)
                    .text(item == 0 ? '' : item)
                    .on('click', () => {
                        this.makeSearch(this.lastSearchQuery, item);
                    });
                $pages.append($page);
            }
        });

        $pagination.toggle(data.totalPages > 1);

        $button
            .toggleClass('-visible', data.currentPage != data.totalPages)
            .off('click')
            .on('click', () => {
                this.makeSearch(this.lastSearchQuery, data.currentPage + 1);
            });
    },

    destroy() {
        $(window).off('keydown', this.onKeyDown);
    }
}



export default search;