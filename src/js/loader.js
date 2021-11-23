
;setTimeout(function() {
    var startedTime = + new Date();
    var sizes;
    var totalSize;

    var updateResourcesList = function() {
        sizes = {}
        totalSize = 0;

        var imgs = document.getElementsByTagName('img');
        for (var i = 0; i < imgs.length; i++) {
            var img = imgs[i];
            var src = img.currentSrc || img.src;

            if (src) {
                src = src.replace(/^.*?\/img\//, '');

                if (!filesSizes[src]) continue;

                if (!sizes[src]) {
                    totalSize += filesSizes[src];
                }

                sizes[src] = {
                    node: img,
                    size: filesSizes[src]
                }
            }
        }
    }

    updateResourcesList();

    var checkPeriod = 17;
    var currentPercentage = 0;
    var loaderMask = document.getElementById('loader-mask');
    var loaderTextInactive = document.getElementById('loader-text-inactive');
    var loaderTextActive = document.getElementById('loader-text-active');
    var tuningModifier = 1;
    var lastTimeUpdate = startedTime;
    var currentSpeed = 0;
    var loadedModifier = 1;
    var loadedFired = false;

    loaderTextActive.setAttribute('d', loaderTextInactive.getAttribute('d'));

    document.getElementsByTagName('html')[0].style.opacity = '';

    window.addEventListener('load', function() {
        loadedFired = true;
    });

    var createNewEvent = function(eventName) {
        var event;
        if (typeof(Event) === 'function') {
            event = new Event(eventName);
        } else {
            event = document.createEvent('Event');
            event.initEvent(eventName, true, true);
        }
        return event;
    }

    var checkInterval = setInterval(function() {
        var loadedSize = 0;
        var curTime = +new Date();

        for (var prop in sizes) {
            if (sizes.hasOwnProperty(prop)) {
                var item = sizes[prop];
                if (item.node.complete) {
                    loadedSize += item.size;
                }
            }
        }
        loadedFired && (loadedModifier *= 1.03);
        var currentInstantSpeed = loadedSize / (curTime - startedTime);
        currentSpeed += (currentInstantSpeed - currentSpeed) * 0.01; //smooth speed changes
        currentPercentage += (checkPeriod * currentSpeed * tuningModifier * loadedModifier) / totalSize;
        if (currentPercentage > 0 && loadedSize > 0) {
            tuningModifier = Math.pow((loadedSize / totalSize) / currentPercentage, 2);
            tuningModifier = Math.min(Math.max(tuningModifier, 0.01), 50);
        }

        currentPercentage = Math.min(currentPercentage, 1);

        loaderMask.setAttribute('x', (currentPercentage * 100 - 100) + '%');

        if (currentPercentage == 1 || isNaN(currentPercentage)) {
            clearInterval(checkInterval);
            window.loaderCompleted = true;
            var event = createNewEvent('loaderCompleted');
            document.dispatchEvent(event);
        }

        if (curTime - lastTimeUpdate > 500) {
            updateResourcesList();
            lastTimeUpdate = curTime;
        }

    }, checkPeriod);
}, 100); //wait for dom parse