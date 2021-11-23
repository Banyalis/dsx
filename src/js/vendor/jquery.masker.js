import $ from 'jquery';

(function( $ ) {
    var controller;
    var maskId = 0;

    //only one option is available:
    //{ destroy: true }
    //to set all things back to
    $.fn.masker = function(options) {
        options = options || {};

        if (!options.destroy) {
            controller = new options.ScrollMagic.Controller();
        }


        var Masker = function($el) {
            this.type = $el.attr('data-mask-type');
            this.start = $el.attr('data-mask-start') - 0;
            this.once = $el.attr('data-mask-once') == 'true';
            this.durations = ($el.attr('data-mask-duration')).split(',');
            this.delays = ($el.attr('data-mask-delay')).split(',');
            this.points = JSON.parse($el.attr('data-mask-points'));
            this.w = $el.attr('data-mask-w');
            this.h = $el.attr('data-mask-h');
            this.progress = undefined;
            this.direction = 'forward';
            this.reverseHideAnimation = false;
            this.timeScale = 1;

            //backward compatibility
            if (this.durations.length == 1 && this.points.length > 1) {
                this.points = [this.points];
            }

            this.totalDuration = 0;
            for (var i = 0; i < this.durations.length; i++) {
                this.totalDuration = Math.max(this.totalDuration, (this.durations[i] - 0) + (this.delays[i] - 0));
            }

            this.onProgress = this.onProgress.bind(this);
            this.onTrigger = this.onTrigger.bind(this);
            this.animationStep = this.animationStep.bind(this);
            this.onManualPlayForward = this.onManualPlayForward.bind(this);
            this.onManualPlayBackward = this.onManualPlayBackward.bind(this);

            this.wrapImageWithSvg($el);

            this.setAnimationProgress(0);

            this.scene = new options.ScrollMagic.Scene({
                triggerElement: this.$el[0],
                triggerHook: this.start / 100,
                duration: (this.type == 'scroll' ? this.totalDuration: 100) + "%", //100% is for proper 'after' state for trigger
            })
                .addTo(controller);


            if (this.type == 'scroll') {
                this.scene.on('progress', this.onProgress);
            }

            if (this.type == 'trigger') {
                this.scene.on('start', this.onTrigger)
            }
        }

        Masker.prototype = {
            wrapImageWithSvg: function($el) {
                var $wrapper1 = $('<div>');
                $wrapper1.css({
                    position: 'relative',
                    width: '100%',
                    height: 0,
                    'padding-top': (100 * this.h / this.w) + '%'
                })

                var $wrapper2 = $('<div>');
                $wrapper2.css({
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    top: 0
                });
                $wrapper1.append($wrapper2);

                var svgNS = "http://www.w3.org/2000/svg";
                var id = 'masker_' + (maskId++);

                var svg = document.createElementNS(svgNS, "svg");
                svg.setAttribute('width', '100%');
                svg.setAttribute('height', '100%');
                svg.setAttribute('viewBox', '0 0 ' + this.w + ' ' + this.h);
                $wrapper2.append(svg);
                $(svg).css('position', 'absolute');

                var defs = document.createElementNS(svgNS, "defs");
                svg.appendChild(defs);

                var mask = document.createElementNS(svgNS, "mask");
                mask.setAttribute('id', id);
                defs.appendChild(mask);

                var image = document.createElementNS(svgNS, "image");
                image.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', $el.attr('src'));
                image.setAttribute('x', '0');
                image.setAttribute('y', '0');
                image.setAttribute('width', '100%');
                image.setAttribute('height', '100%');
                image.setAttribute('mask', 'url(#' + id + ')');
                svg.appendChild(image);

                this.curMasks = [];

                for (var i = 0; i < this.points.length; i++) {
                    var points = this.points[i];

                    for (var j = 0; j < points.length; j++) {
                        var circle = document.createElementNS(svgNS, "circle");

                        var point = points[j];
                        points[j] = {
                            x: point[0],
                            y: point[1],
                            s: point[2],
                            t: point[3],
                            el: circle
                        }
                        point = points[j];

                        circle.setAttribute("cx", point.x);
                        circle.setAttribute("cy", point.y);
                        circle.setAttribute("r", point.s / 2);
                        circle.setAttribute('fill', 'white');
                        mask.appendChild(circle);
                    }

                    var curMask = document.createElementNS(svgNS, "image");
                    curMask.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJkAAACZCAMAAAALgmiIAAAAulBMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yHCTBAAAAPXRSTlMAA/z69gcJ8+4T6hcNKwvwQN3ORxvWx7Tn4zHarsKDH3lTD3Q3JiLf0riIbU3hnzvLaFeNYr2ZlFyRqaV/Bd+sBQAACXtJREFUeNrc2etS4kAQBeCke3IhF0JCIEC4CgKCoKyKgnve/7UWcbcUVkKGRNja70dKC4o6dHqaGVD+W+r22rkblDqbf7SirvwjdF0t6lqp6Qket7v9crk7vR3ajnOlFzcPbXOfn6rp2uZiD912zNggMu8DT5itab/Zmj88TMr6Jpl69nSOo4WlsFjs/HgS+K3ysPYArpkEsTGaD84YTFXUsKBtrppWmFTuo6g6Y/wRL5sePuG5U+icKVrjLiy4g2vbtrXGq4c99eaTic+s1WKxvaFqoaB8I3VoNwaNcqPbbEb9dsDYF/9c7qUVQU/RHF1pvEaLhqN8l+vHUqiXbyoWM1kG/lZ7bXrYFZTc/mq1rBK88frlewpXLE1/9htXEwMHsbBM7DLuq4YgbJF103fzb7tSVBvN4vZjCwmEJ7CHdp9w0xvmWzh3TXgT31tIwAYjmbcsN8L86nbVNvCOmJKCETOOsFZ3rmsr+Ri0kI4QOM6av5TLQyUPjxZSYkYKPG73ymEeFQuQFglCCmRVH6YlXcnELrnTGtJiywDSZavNHjI1m/PTDyqMtIRvIr11J8OsWNUBQmpsCkhoDhVF05QTNJ7wrWgeKqojH6046MaQQzUTMvzFlaLqqmyL3d32fdlkcWDIRZs6iqxCu7VsQZKYVQMBGVazrEneyi7DE5DEbN77BCkryeExbOIEwsCoIiAlcuWOCuEcJ6j7LCzJZDeuIkPvjXEC0zdAkGO0ZfZrWrmFs/F7qqalrliAM5qEHVtL02tqY17DOXnRi1MMi0dzqXqfcF71hVO0neNVs+c4s9Vg8KNsH0umKtdNnNf4dlhquLcNXUmm9WKcV/DD7U0is+kmLcowvL57JpyX8IPYJKBbPPy1xct0uniu4UIqpUOtVphW42pg4mLahUMlWzQFCJfDB/YdavF6iQt70ZQvXUe4sMevk2kvJi7LvP0ymVqu4KLqTxNX/yKX6raQlRkbOBETd21Vu9L+bv9iH5kJi+FZDHmiVhkvrsvXYUHd7zHdDZAZGwIgnEDw+nkdxV07tPejXf1EdrVWHSSdjAAE98Fr1UMw0O0rda/9Z8iuElnUiqVbwADG0ahuEmj+WLJ3W81+RQ6EQexbSI8IYNMgsCBmACJYdcOdkpUs5MCLPUhhQdglbiYNfWdTZiEfwmSZZJ7AHuvZ1RT1I9ntDBch+Istrq5onxaAhXzUR4yMlp2dmhnIA1EOz5r9cFT1I1lMyI4NxnGiemMlBm8NPmpWXFQECMSMLMw64yiqPD+PkMT42Kapd00TbBosBL6dF1SOrd+F/jFnBYHjZpQxGZumx0jCDGLCEV1dV3+vTBMb1rpd3fYn4UQkRmPvyGQlHPfU6BSUN/oUb8ToviKwfU+nYs+gzEsXsNol+73/25/XluFR8mskJCfByIzq1WXPUd44q50HGImMoHZKVQhpcbRaPb4nu3qV+z3Qv5lBDkFGLZpP35PZESB18wRLRZBuXK81LSpvOkHiehOEZMkZWECaNdU/hsYhbBgGZ/pAJEirvR889UnyjDJNpu2EPNqMxAlhZQTudtQOxziGar6xnVXJM8I0sYtxEn5wnMLbzRRIRdQ9Tu65kY9PjKieUNAkQUMP7U2yl9w2YZXg0Aomv1pJfUigSUEJnU2yR4IsMvjLZGMcwKMRUjN7ulrYnptGkMf8xTiIfewhJoKsWlnXnO04i/Law8bx/pwgAXnGoqDq26nxgJz4IwBkCWRU7zrv86yd18lkVt/+mZ1f3tasuEYOhMcGwzSQi6qrbNj3yAUJwczIRbxN1vGRDxa/mrnP5rSBIAzAu7qCTs2il9BBNFNFjc3+/7+VAJkxcQwB6Qx6vsAAA++cdHdIexIzSAOWqZ5KA7mqQVrw8gvpkN/NKgIAASs1Tloc9jQNMq1uIAAEouhuNJ08YKSDWQ/H8pAMwNv9oAQxaquuB4AAqDoWaTEpkQ78vSfhAFWrajFKkHVDHIO1ZW9cr75QcgzVKZktQeayBUqOmo2nNjs8uBlKjkHv1GYKAbyFQcmRb8CRh57j5ylBMjYcoXT9sUkJUmzDiTNrDpO0MWnjwRF2R3NGSZqf6hKOcPZeIj3MMtdZT0c/Y5AeLGVQfNxHOMJsinRhOpL1AzhBP1Edk6io4I8gUYNZafAq4Q81JT10HNTxfeOjli5CSo6878CHYEBECRnRRo3zGr/aUjT6SwKm79hnycSKtIl5/GT54jwZzsykJCvN/koGjbW2HYzzeMm60D5P1u7En6AY+1jpEJ2ZRYQz2OsUyoaeoSxeF2CdHMI54S62ZYojlaITk1McSwV/k936IObGjN8FjPTcWkn4xPO35WfPT+kwF9rwD9lY5cmgZ5r6X655R2ivav2nNtooa8OX0HGb5hOT8WbX+ToYAnQL8ZNFG9AYN+YzJS4mqwzjJ4vWOdPVaug68DVEDC2Ki0drs/dxq9LGS8lEb0qxsbwZqaY59hVc1NiQBgZFkO5cCwaySRpEKlcUu20BVzS2PyYUk5G36H4jG65D1WFxk6VNult5pwRcJ1v92MWZCM2+bin4TP9ifKvM6F6jHsL/5DaMHi49Rvg/r2PSoxUDuEVu9EIP1pRwE9V8cLS1C7cRlXd6FIMzyvhwK5EtPqoQNXmbFytwB9Va00O8jccuwj28jkUPYFTHDYS7qFGKvp1R3O57cCe5MNlgUEoZkUr9JX7Drp8ejlypBNwr19wHQWvZp/tZN8zpbF6feYAIEaCjJKh9iXFG+qVDPOSKCIWjus2fy2KKtKu50FYIkSFKrw3uWvcxJ5uMchCXp1Bt2Z094D/lJ7MatkED3OXpHqc77V3xsnUlggZenZNOxjQHmsjOvNA36GbXrzFI1R3QBoX3Ork9mlUbXv50wQe91GpaLFgfC/ToMjbchUN+6T48HugmHGV38vz402+vVU4X8WFrtrE+v9hPl9KDug3fIXAr4bvF+5MfLXBrl8+sGIVVdvo52Tz0d4EEQAHfQdmV5XJWCV2BremyPr8QzSrUPu9n5v40TiDC9xDtno2n7xeI2aGV4sYt/zWspoBvd3anGtEIOxcXVLB8rfDb+m3Z3BY6Eh4KEYXIDr+IZpCxntmuG/SUREAP4aFQIIBjz2qcpzg7uxKLpQuDmg+y0ZMIT4AIwrHtwJmtXheL/bRYGC4XzYxBZG2yvu9hTsKTIKBEOHaIw9N2QwkhWuvha3B8MwEQzzZwLlCJCHWEmJwsF2hN+AsNXi7CwMDrgQAAAABJRU5ErkJggg==');
                    curMask.setAttribute('x', '0');
                    curMask.setAttribute('y', '0');
                    curMask.setAttribute('width', '0');
                    curMask.setAttribute('height', '0');
                    mask.appendChild(curMask);

                    this.curMasks.push(curMask);
                }


                this.$el = $wrapper1;
                this.$el.insertAfter($el);
                $el.hide();
                this.$img = $el;
            },

            onProgress: function(e) {
                this.setAnimationProgress(e.progress);
            },

            resetCache: function(e) {
                for (var pathInd = 0; pathInd < this.points.length; pathInd++) {
                    var points = this.points[pathInd];
                    for (var i = 1; i < points.length; i++) {
                        delete points[i].curS;
                        delete points[i].curX;
                        delete points[i].curY;
                    }
                }
            },

            onTrigger: function() {
                cancelAnimationFrame(this.animationFrame);

                this.resetCache();

                //start forward
                if (this.scene.state() == 'DURING') {
                    this.animation = {
                        timeStart: +new Date(),
                        timeEnd: +new Date() + this.totalDuration * (1 - this.progress) * this.timeScale,
                        valueStart: this.progress,
                        valueEnd: 1,
                    }
                    this.direction = 'forward';
                    this.animationStep();
                }

                // start backward
                if (this.scene.state() == 'BEFORE' && !this.once) {
                    this.animation = {
                        timeStart: +new Date(),
                        timeEnd: +new Date() + this.totalDuration * this.progress * this.timeScale,
                        valueStart: this.progress,
                        valueEnd: 0,
                    }
                    this.direction = 'backward';
                    this.animationStep();
                }

                //object is scrolled out of screen on plugin init
                if (this.scene.state() == 'AFTER') {
                    this.direction = 'forward';
                    this.setAnimationProgress(1);
                }
            },

            onManualPlayForward: function(e, params) {
                this.timeScale = params.timeScale == undefined ? 1 : params.timeScale;

                cancelAnimationFrame(this.animationFrame);

                this.resetCache();

                this.animation = {
                    timeStart: +new Date(),
                    timeEnd: +new Date() + this.totalDuration * (1 - this.progress) * this.timeScale,
                    valueStart: this.progress,
                    valueEnd: 1,
                }
                this.direction = 'forward';
                this.animationStep();
            },

            onManualPlayBackward: function(e, params) {
                this.timeScale = params.timeScale == undefined ? 1 : params.timeScale;
                this.reverseHideAnimation = params.reverseHideAnimation;

                cancelAnimationFrame(this.animationFrame);

                this.resetCache();

                this.animation = {
                    timeStart: +new Date(),
                    timeEnd: +new Date() + this.totalDuration * this.progress * this.timeScale,
                    valueStart: this.progress,
                    valueEnd: 0,
                }
                this.direction = 'backward';
                this.animationStep();
            },

            animationStep: function() {
                var time = +new Date();
                var duration = this.animation.timeEnd - this.animation.timeStart;

                if (time < this.animation.timeStart) {
                    time = this.animation.timeStart;
                } else if (time > this.animation.timeEnd) {
                    time = this.animation.timeEnd;
                }

                var per = duration ? (time - this.animation.timeStart) / duration : 1;

                this.setAnimationProgress(this.animation.valueStart + (this.animation.valueEnd - this.animation.valueStart) * per);

                if (per < 1) {
                    this.animationFrame = requestAnimationFrame(this.animationStep);
                }
            },

            getPointIndex: function(pathInd, time) {
                var i1 = 0;
                var i2 = this.points[pathInd].length - 1;
                time = Math.max(Math.min(time, 10000), 0);

                while (Math.abs(i1 - i2) > 1) {
                    var i = Math.round((i1 + i2) / 2);

                    if (time >= this.points[pathInd][i1].t && time <= this.points[pathInd][i].t) {
                        i2 = i;
                    } else {
                        i1 = i;
                    }
                }

                return i1 + (time - this.points[pathInd][i1].t) / (this.points[pathInd][i2].t - this.points[pathInd][i1].t);
            },

            setAnimationProgress: function(per) {
                this.progress = per;

                for (var i = 0; i < this.points.length; i++) {
                    if (this.direction == 'forward' || !this.reverseHideAnimation) {
                        var relativePer = (per * this.totalDuration - this.delays[i]) / this.durations[i];
                        this.setAnimationProgressPath(i, relativePer);
                    } else {
                        var relativePer = ((1 - per) * this.totalDuration - this.delays[i]) / this.durations[i];
                        this.setAnimationProgressPath(i, (1 - relativePer));
                    }
                }
            },

            setAnimationProgressPath: function(pathInd, per) {
                var isReverse = this.direction == 'backward' && this.reverseHideAnimation;
                var points = this.points[pathInd];
                var pointIndex = this.getPointIndex(pathInd, (isReverse ? 1 - per : per) * 10000);
                var curPointIndex = Math.ceil(pointIndex);
                var curPointProgress = pointIndex + 1 - curPointIndex;
                var s, x, y;
                var prevPoint = points[0];
                var nextPoint;

                if (curPointIndex == 0) {
                    this.curMasks[pathInd].setAttribute("width", 0);
                    this.curMasks[pathInd].setAttribute("height", 0);
                }

                for (var i = 1; i < points.length; i++) {
                    var point = points[i];

                    nextPoint = i < points.length - 1 ? points[i + 1] : {
                        s: 0,
                        x: points[i].x,
                        y: points[i].y
                    };

                    if ((i < curPointIndex && !isReverse) || (i > curPointIndex && isReverse)) {
                        s = point.s;
                        x = point.x;
                        y = point.y;
                    } else if (i == curPointIndex) {
                        if (!isReverse) {
                            s = prevPoint.s + (point.s - prevPoint.s) * curPointProgress;
                            x = prevPoint.x + (point.x - prevPoint.x) * curPointProgress;
                            y = prevPoint.y + (point.y - prevPoint.y) * curPointProgress;
                        } else {
                            s = point.s + (nextPoint.s - point.s) * curPointProgress;
                            x = point.x + (nextPoint.x - point.x) * curPointProgress;
                            y = point.y + (nextPoint.y - point.y) * curPointProgress;
                        }
                    } else {
                        s = 0;
                        x = point.x;
                        y = point.y;
                    }


                    if (point.curS != s || point.curX != x || point.curY != y) {
                        if (i == curPointIndex) {
                            point.el.setAttribute("r", 0);
                            var mh = s * 1.065;
                            var mw = s * 1.065;
                            var mx = x - mw / 2;
                            var my = y - mh / 2;;
                            this.curMasks[pathInd].setAttribute("x", mx);
                            this.curMasks[pathInd].setAttribute("y", my);
                            this.curMasks[pathInd].setAttribute("width", mw);
                            this.curMasks[pathInd].setAttribute("height", mh);
                        } else {
                            point.el.setAttribute("cx", x);
                            point.el.setAttribute("cy", y);
                            point.el.setAttribute("r", s / 2);
                        }
                        point.curS = s;
                        point.curX = x;
                        point.curY = y;
                    }

                    prevPoint = point;
                }
            },

            destroy: function() {
                cancelAnimationFrame(this.animationFrame);

                if (this.type == 'scroll') {
                    this.scene.off('progress', this.onProgress);
                }
                if (this.type == 'trigger') {
                    this.scene.off('start', this.onTrigger)
                }

                this.scene.remove();

                this.$img.show();
                this.$el.remove();
            }
        }

        this.each(function() {
            var $el = $(this);

            if (options.destroy) {
                if ($el.data('masker')) {
                    $el.data('masker').destroy();
                }
                return;
            }

            if ($el.data('masker')) {
                return;
            }

            var masker = new Masker($el);
            $el.data('masker', masker);

            $el.on('masker-play-forward', masker.onManualPlayForward);
            $el.on('masker-play-backward', masker.onManualPlayBackward);
        });

        return this;
    };

}( $ ));