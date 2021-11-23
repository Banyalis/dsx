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

let faq = function(params) {
    this.onFaqQuestionClick = this.onFaqQuestionClick.bind(this);

    params.view.find('.dsx-faq-item-question').on('click', this.onFaqQuestionClick);
}

faq.prototype = {
    destroy() {
    },

    openQuestion($question) {
        let $wrapper = $question.parent().find('.dsx-faq-item-wrapper');
        let $answer = $wrapper.find('.dsx-faq-item-answer')

        $question.addClass('-active');
        $answer.css('opacity', 0);
        setTimeout(() => {
            $answer.css('opacity', '');
            let tl = transitions.createTextShowTransition($answer);
            tl.play();
        }, 150);
        $wrapper.slideDown(300);
    },

    closeQuestion($question) {
        let $wrapper = $question.parent().find('.dsx-faq-item-wrapper');
        let $answer = $wrapper.find('.dsx-faq-item-answer')

        $question.removeClass('-active');
        $wrapper.slideUp(300);
        let tl = transitions.createTextHideTransition($answer);
        tl.play();
    },

    onFaqQuestionClick(e) {
        let $question = $(e.currentTarget);

        if ($question.hasClass('-active')) {
            this.closeQuestion($question);

            delete this.$lastOpenedQuestion;
        } else {
            if (this.$lastOpenedQuestion) {
                this.closeQuestion(this.$lastOpenedQuestion);
            }
            this.openQuestion($question);

            this.$lastOpenedQuestion = $question;
        }
    },
}



export default faq;