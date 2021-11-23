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

let storiesGallery = function(params) {
    _.bindAll(this, 'onMouseenterRight', 'onMouseenterLeft', 'onMouseleave', 'startShiftAnimation', 'stopShiftAnimation', 'makeShiftStep', 'onResize');

    if (app.mobile) return;

    this.$container = params.$container;
    this.$scroller = params.$scroller;
    this.$rightHoverArea = params.$rightHoverArea;
    this.$leftHoverArea = params.$leftHoverArea;
    this.$firstItem = this.$scroller.find(params.itemsSelector + ':first-child');
    this.$lastItem = this.$scroller.find(params.itemsSelector + ':last-child');

    this.$rightHoverArea.on('mouseenter', this.onMouseenterRight);
    this.$rightHoverArea.on('mouseleave', this.onMouseleave);
    this.$leftHoverArea.on('mouseenter', this.onMouseenterLeft);
    this.$leftHoverArea.on('mouseleave', this.onMouseleave);

    this.shiftData = {
        val: 0,
        delta: 0,
        hasRightHover: true,
        hasLeftHover: true
    };

    $(window).on('resize', this.onResize);

    this.onResize();
}

storiesGallery.prototype = {
    destroy() {
        if (app.mobile) return;

        this.$rightHoverArea.off('mouseenter', this.onMouseenterRight);
        this.$rightHoverArea.off('mouseleave', this.onMouseleave);
        this.$leftHoverArea.off('mouseenter', this.onMouseenterLeft);
        this.$leftHoverArea.off('mouseleave', this.onMouseleave);

        $(window).off('resize', this.onResize);

        this.stopShiftAnimation();
    },

    onMouseenterRight() {
        this.startShiftAnimation(-1, 4);
    },

    onMouseenterLeft() {
        this.startShiftAnimation(1, 4);
    },

    onMouseleave() {
        this.stopShiftAnimation();
    },

    startShiftAnimation(dir, speed) {
        clearTimeout(this.stopTimeout);
        window.cancelAnimationFrame(this.shiftData.frameID);

        this.shiftData.stop = false;
        this.shiftData.dir = dir;
        this.shiftData.speed = speed;

        this.makeShiftStep();
    },

    stopShiftAnimation() {
        clearTimeout(this.stopTimeout);

        this.shiftData.stop = true;

        this.stopTimeout = setTimeout(() => {
            window.cancelAnimationFrame(this.shiftData.frameID);
            this.shiftData.delta = 0;
        }, 2000);
    },

    makeShiftStep() {
        this.shiftData.delta += (this.shiftData.stop ? -5 : 2) * 0.01; //acceleration/decelaration speed
        this.shiftData.delta = Math.min(Math.max(this.shiftData.delta, 0), 2);
        this.shiftData.val += this.shiftData.dir * Math.pow(this.shiftData.delta, 0.9) * this.shiftData.speed;//3 - speed

        this.makeShift();

        this.shiftData.frameID = window.requestAnimationFrame(this.makeShiftStep);
    },

    makeShift: function() {
        this.shiftData.val = Math.min(this.shiftData.val, 0);
        this.shiftData.val = Math.max(this.shiftData.val, -this.shiftRange);

        const hasLeftHover = this.shiftData.val != 0;
        const hasRightHover = this.shiftData.val != -this.shiftRange;

        if (hasLeftHover != this.shiftData.hasLeftHover) {
            this.$leftHoverArea.toggle(hasLeftHover);
            this.shiftData.hasLeftHover = hasLeftHover;
        }

        if (hasRightHover != this.shiftData.hasRightHover) {
            this.$rightHoverArea.toggle(hasRightHover);
            this.shiftData.hasRightHover = hasRightHover;
        }

        this.$scroller.css('transform', 'translateX(' + this.shiftData.val + 'px)');
    },

    onResize() {
        const left = this.$firstItem[0].getBoundingClientRect().left;
        const right = this.$lastItem[0].getBoundingClientRect().right;

        this.shiftRange = Math.round(right - left) - this.$container.width();

        this.makeShift();//to update position for range constraints
    }
}



export default storiesGallery;