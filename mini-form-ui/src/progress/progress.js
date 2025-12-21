var progress = (function () {
    var settings = {};
    function config(_settings) {
        _settings =  _settings ?? {};
        settings.minimum = _settings.minimum ?? 0.08;
        settings.speed = _settings.speed ?? 200;
        settings.easing = _settings.easing ?? 'linear';
    }
    config();
    var ele = null;
    function init() {
        if (!ele) {
            ele = document.createElement('div');
            ele.className = 'progress';
            ele.style.transition = 'all ' + settings.speed + 'ms ' + settings.easing;
            ele.style.opacity = 1;
            ele.style.width = '0px';
            document.body.appendChild(ele);
        }
    }
    var percent = 0;
    var started = false;
    function start() {
        if (!started) {
            started = true;
            inc();
            setTimeout(function () {
                if (started) {
                    inc();
                    setTimeout(arguments.callee, settings.speed);
                }
            }, settings.speed);
        }
    }
    function done() {
        inc(0.3 + 0.5 * Math.random());
        set(1);
    }
    function inc(num) {
        if (percent >= 1) {
            return;
        }
        if (typeof num !== 'number') {
            if (percent >= 0 && percent < 0.2)
                num = 0.1;
            else if (percent >= 0.2 && percent < 0.5)
                num = 0.04;
            else if (percent >= 0.5 && percent < 0.8)
                num = 0.02;
            else if (percent >= 0.8 && percent < 0.99)
                num = 0.005;
        }
        return set(minmax(percent + num, 0, 0.994));
    }
    function set(num) {
        init();
        if (num === 1) {
            started = false;
        }
        queue.push(function(next) {
            setTimeout(function() {
                num = minmax(num, settings.minimum, 1);
                ele.style.opacity = 1;
                ele.style.width = num * 100 + '%';
                percent = num;
                if (num === 1) {
                    setTimeout(function() {
                        ele.style.opacity = 0;
                        setTimeout(function() {
                            ele.style.width = '0px';
                            percent = 0;
                            next();
                        }, settings.speed);
                    }, settings.speed);
                    return;
                }
                next();
            }, 1);
        });
    }
    var queue = (function() {
        var tasks = [];
        var working = false;
        function next() {
            var task = tasks.shift();
            if (!task) {
                working = false;
                return;
            }
            task(next);
        }
        function push(func) {
            tasks.push(func);
            if (!working) {
                working = true;
                next();
            }
        }
        return {
            push: push
        }
    })();
    function minmax(n, min, max) {
        if (n < min) return min;
        if (n > max) return max;
        return n;
    }
    return {
        start: start,
        inc: inc,
        set: set,
        done: done,
        config: config
    }
})();