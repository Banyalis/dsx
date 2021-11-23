import $ from 'jquery';
import transitions from 'transitions';

const feesController = {
    init: function (app, resolver) {
        const view = app.view;

        resolver.resolve();
    },

    enter: function (app, resolver) {
        const calculatorSlider = document.querySelector('.dsx-fees-calculation-control-slider');
        const sliders = [calculatorSlider];

        function Slider(slider) { //- TODO: Remake slider
            this.slider = slider;
            slider.addEventListener('input', function() {
                this.updateSliderThumb();
                this.updateSliderLevel();
            }.bind(this), false);

            app.view.find('.dsx-fees-calculation-control-value__item:first-child').addClass('--active');
            app.view.find('.dsx-fees-calculation-info__item:first-child').addClass('--active');
            
            this.getLevel = function() {
                var level = this.slider.querySelector('.dsx-fees-calculation-control-slider__input');

                app.view.find('.dsx-fees-calculation-control-value__item').removeClass('--active');
                app.view.find('.dsx-fees-calculation-info__item').removeClass('--active');
                
                if (level.value < 1000) {
                    app.view.find('.dsx-fees-calculation-control-value__item:first-child').addClass('--active');
                    app.view.find('.dsx-fees-calculation-info__item:first-child').addClass('--active');
                } else if (1000 < level.value && level.value <= 2000) {
                    app.view.find('.dsx-fees-calculation-control-value__item:nth-child(2)').addClass('--active');
                    app.view.find('.dsx-fees-calculation-info__item:nth-child(2)').addClass('--active');
                } else if (2000 < level.value && level.value <= 3000) {
                    app.view.find('.dsx-fees-calculation-control-value__item:nth-child(3)').addClass('--active');
                    app.view.find('.dsx-fees-calculation-info__item:nth-child(3)').addClass('--active');
                } else if (3000 < level.value && level.value <= 4000) {
                    app.view.find('.dsx-fees-calculation-control-value__item:nth-child(4)').addClass('--active');
                    app.view.find('.dsx-fees-calculation-info__item:nth-child(4)').addClass('--active');
                } else if (4000 < level.value && level.value <= 5000) {
                    app.view.find('.dsx-fees-calculation-control-value__item:nth-child(5)').addClass('--active');
                    app.view.find('.dsx-fees-calculation-info__item:nth-child(5)').addClass('--active');
                } else if (5000 < level.value && level.value <= 6000) {
                    app.view.find('.dsx-fees-calculation-control-value__item:nth-child(6)').addClass('--active');
                    app.view.find('.dsx-fees-calculation-info__item:nth-child(6)').addClass('--active');
                } else if (6000 < level.value && level.value <= 7000) {
                    app.view.find('.dsx-fees-calculation-control-value__item:nth-child(7)').addClass('--active');
                    app.view.find('.dsx-fees-calculation-info__item:nth-child(7)').addClass('--active');
                } else if (7000 < level.value && level.value <= 8000) {
                    app.view.find('.dsx-fees-calculation-control-value__item:nth-child(8)').addClass('--active');
                    app.view.find('.dsx-fees-calculation-info__item:nth-child(8)').addClass('--active');
                } else if (8000 < level.value && level.value <= 9000) {
                    app.view.find('.dsx-fees-calculation-control-value__item:nth-child(9)').addClass('--active');
                    app.view.find('.dsx-fees-calculation-info__item:nth-child(9)').addClass('--active');
                } else if (9000 < level.value && level.value <= 10000) {
                    app.view.find('.dsx-fees-calculation-control-value__item:nth-child(10)').addClass('--active');
                    app.view.find('.dsx-fees-calculation-info__item:nth-child(10)').addClass('--active');
                } else if (10000 < level.value && level.value <= 11000) {
                    app.view.find('.dsx-fees-calculation-control-value__item:nth-child(11)').addClass('--active');
                    app.view.find('.dsx-fees-calculation-info__item:nth-child(11)').addClass('--active');
                } else if (11000 < level.value && level.value <= 12000) {
                    app.view.find('.dsx-fees-calculation-control-value__item:last-child').addClass('--active');
                    app.view.find('.dsx-fees-calculation-info__item:last-child').addClass('--active');
                }
                
                // console.log(level.value, level.getAttribute('max'));
                return level.value / level.getAttribute('max');
            }
            
            this.getLevelPercentage = function() {
                return this.getLevel() * 100;
            }
            
            this.updateSliderThumb = function() {
                var thumb = this.slider.querySelector('.dsx-fees-calculation-control-slider__thumb');
                thumb.style.left = this.getLevelPercentage() + '%';
            }
            
            this.updateSlider = function(num) {
                var input = this.slider.querySelector('.dsx-fees-calculation-control-slider__input');
                input.value = num;
            }
            
            this.updateSliderLevel =function() {
                var level = this.slider.querySelector('.dsx-fees-calculation-control-slider__level');
                level.style.width = this.getLevelPercentage() + '%';
            }

            // var commissions = JSON.parse(app.view.find('.dsx-fees-calculation-info').attr('data-commissions'));
            // console.log(commissions);

            // var test = document.querySelector(".test");
            // for (var i = 0; i < commissions.length; i++) {
            //     test.innerHTML = test.innerHTML + "<div>" + commissions[i].standardPassiveCom + ' ' + commissions[i].standardAgressiveCom + ' ' + commissions[i].refPassiveCom + ' ' + commissions[i].refAgressiveCom + "</div>";
            // }

            // for (var i = 0; i < commissions.length; i++) {
        //     console.log(commissions[i].bonusPointsVolume + ' ' + commissions[i].standardPassiveCom + ' ' + commissions[i].standardAgressiveCom + ' ' + commissions[i].refPassiveCom + ' ' + commissions[i].refAgressiveCom);
        // }
        }

        sliders.forEach(function(slider) {
            new Slider(slider);
        });

        // Show more elements
        function showMoreElements() {
            const windowWidth = $(window).outerWidth();
            const $hiddenElements = app.view.find('.dsx-fees-commission-select__switch-item').slice(6, 9);

            if (windowWidth >= 768) {
                $hiddenElements.hide();
            } else {
                $hiddenElements.show().slideUp(0).removeAttr('style');
                app.view.find('.dsx-fees-commission__more').removeClass('--active');
            }

            app.view.find('.dsx-fees-commission__more').off('click').on('click', (e) => {
                const tl = new TimelineMax({paused: true, reversed: true});

                tl.staggerFrom($hiddenElements, 0.3, {opacity: 0, y: 20, ease: SlowMo.easeIn}, 0.2, 0.3);

                if ($(e.currentTarget).hasClass('--active')) {
                    $hiddenElements.slideUp(0);
                } else {
                    $hiddenElements.slideDown(300);
                }

                $(e.currentTarget).toggleClass('--active');
                tl.reversed() ? tl.play() : tl.reverse();
                return false;
            });
        }
        showMoreElements();
        $(window).on('resize', showMoreElements);

        // Dropdown select
        function dropdownSelect() {
            app.view.find('.dsx-fees-commission-select__inner').on('click', (e) => {
                $(e.currentTarget).parent().toggleClass('--open');
            });
        }
        dropdownSelect();

        // Switch tabs
        function switchTabs() {
            const defaultValue = app.view.find('.dsx-fees-commission-select__switch-item:first-child').attr('data-value');

            app.view.find('.dsx-fees-commission-select__value').text(defaultValue);

            app.view.find('.dsx-fees-js-open-tab').on('click', (e) => {
                $(e.currentTarget).addClass('--active').siblings().removeClass('--active')
                    .closest('.dsx-fees-js-tabs').find('.dsx-fees-js-tab')
                    .removeClass('--open').eq($(e.currentTarget).index()).addClass('--open');

                const currentValue = $(e.currentTarget).attr('data-value');
                app.view.find('.dsx-fees-commission-select__value').text(currentValue);
            });
        }
        switchTabs();

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

export default feesController;