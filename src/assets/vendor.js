// Drop Images only
// Only a concept, not a working upload (yet)
// Desktop version
import $ from 'jquery';

window.onload = function () {
    let dropContainer = $('.drop'),
        val = null,
        center = dropContainer.find('.center > div'),
        circle = center.children('.circle'),
        list = dropContainer.children('.list');

    let started = false,
        currentDistance,
        mouse = {
            x: 0,
            y: 0
        };

    dropContainer.on('dragover', e => {
        dropContainer.addClass('dragged showDrops').css({
            '--r': calculateRotate(dropContainer, e.pageX, e.pageY) + 'deg'
        });
        let bool = $(e.target).is(circle) || $.contains(circle[0], e.target),
            distance = calculateDistance(circle, dropContainer, e.pageX, e.pageY) > 1 ? 1 : calculateDistance(circle, dropContainer, e.pageX, e.pageY);
        mouse = {
            x: e.pageX,
            y: e.pageY
        };
        if (bool == true) {
            if (!started) {
                currentDistance = 0;
                startAnimation(currentDistance, 12, 300);
                started = true;
            }
        } else {
            currentDistance = distance * 12;
            setPathData(currentDistance);
            started = false;
        }
    });

    dropContainer.on('dragend dragleave', e => {
        startAnimation(currentDistance, 12, 400);
    });

    dropContainer.on('dragleave', e => {
        dropContainer.removeClass('dragged showDrops');
    });

    dropContainer.on('drop', e => {

        if (!dropContainer.hasClass('dropped')) {
            dropContainer.addClass('dropped');
            setTimeout(() => {
                startAnimation(currentDistance, 18, 100, () => {
                    dropContainer.removeClass('showDrops');
                    setTimeout(() => {
                        startAnimation(18, 12, 300);
                        setTimeout(() => {
                            dropContainer.addClass('show');

                            //Fake Upload durations
                            setTimeout(() => {
                                list.find('li .progress').each(function () {
                                    startPercent($(this), 0, 100, 1200);
                                });
                            }, 800);

                        }, 400);
                    }, 200);
                });
            }, 400);
        }

        for (let i = 0; i < e.originalEvent.dataTransfer.files.length; i++) {
            let file = e.originalEvent.dataTransfer.files[i],
                reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function (e) {

                let bin = this.result,
                    li = $('<li />'),
                    img = $('<img />'),
                    text = $('<div />').addClass('text'),
                    strong = $('<strong />').text(file.name),
                    small = $('<small />').text(bytesToSize(file.size)),
                    progress = $('<div />').addClass('progress').html('<svg class="pie" width="32" height="32"><circle r="8" cx="16" cy="16" /></svg><svg class="tick" viewBox="0 0 24 24"><polyline points="18,7 11,16 6,12" /></svg>');

                img[0].file = file;
                img[0].src = bin;

                img.appendTo(li);
                text.append(strong).append(small).appendTo(li);
                progress.appendTo(li);

                progress.find('.pie').css('strokeDasharray', 0 + ' ' + 2 * Math.PI * 8);

                if (list.find('li').length < 5) {
                    li.appendTo(list);
                }

            }
        }

    });

    var dotQuantity = 160,
        dotSizeMax = 3,
        dotSizeMin = 1,
        minAngle = .4,
        maxAngle = 1.6,
        dotPool = [],
        dotIndex = 0;

    var dotQuantityDrop = 80,
        dotPoolDrop = [],
        dotIndexDrop = 0;

    function linear(n) {
        return n;
    }

    function startAnimation(from, to, duration, callback) {

        let stop = false,
            dur = duration || 200,
            start = null,
            end = null;

        function startAnim(timeStamp) {
            start = timeStamp;
            end = start + dur;
            draw(timeStamp);
        }

        function draw(now) {
            if (stop) {
                if (callback && typeof (callback) === 'function') {
                    callback();
                }
                return;
            }
            if (now - start >= dur) {
                stop = true;
            }
            let p = (now - start) / dur;
            val = linear(p);
            let x = from + (to - from) * val;
            setPathData(x);
            requestAnimationFrame(draw);
        }

        requestAnimationFrame(startAnim);
    }

    function setPathData(value) {
        circle.find('svg path').attr('d', 'M46,80 C55.3966448,80 63.9029705,76.1880913 70.0569683,70.0262831 C76.2007441,63.8747097 80,55.3810367 80,46 C80,36.6003571 76.1856584,28.0916013 70.0203842,21.9371418 C63.8692805,15.7968278 55.3780386, ' + value + ' 46, ' + value + ' C36.596754, ' + value + ' 28.0850784,15.8172663 21.9300655,21.9867066 C15.7939108,28.1372443 12,36.6255645 12,46 C12,55.4035343 15.8175004,63.9154436 21.9872741,70.0705007 C28.1377665,76.2063225 36.6258528,80 46,80 Z');
    }

    function calculateDistance(elem, parent, mX, mY) {
        let from = {
            x: mX,
            y: mY
        },
            offset = elem.offset(),
            parentOffset = parent.offset(),
            nx1 = offset.left,
            ny1 = offset.top,
            nx2 = nx1 + elem.outerWidth(),
            ny2 = ny1 + elem.outerHeight(),
            elemOffset = {
                top: offset.top - parentOffset.top,
                left: offset.left - parentOffset.left
            },
            maxX1 = Math.max(mX, nx1),
            minX2 = Math.min(mX, nx2),
            maxY1 = Math.max(mY, ny1),
            minY2 = Math.min(mY, ny2),
            intersectX = minX2 >= maxX1,
            intersectY = minY2 >= maxY1,
            to = {
                x: intersectX ? mX : nx2 < mX ? nx2 : nx1,
                y: intersectY ? mY : ny2 < mY ? ny2 : ny1
            },
            distX = to.x - from.x,
            distY = to.y - from.y;
        return Math.sqrt(distX * distX + distY * distY) / elemOffset.left;
    }

    function calculateRotate(elem, mX, mY) {
        let from = {
            x: mX,
            y: mY
        },
            offset = elem.offset(),
            center = {
                x: offset.left + elem.width() / 2,
                y: offset.top + elem.height() / 2
            },
            radians = Math.atan2(mX - center.x, mY - center.y),
            degree = (radians * (180 / Math.PI) * -1) + 180;
        return degree;
    }

    function bytesToSize(bytes) {
        if (bytes == 0) {
            return '0 Byte';
        }
        let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024))),
            sizes = ['Bytes', 'Kb', 'Mb', 'Gb', 'Tb'];
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }

    function startPercent(progress, from, to, duration) {

        let stop = false,
            dur = duration || 200,
            start = null,
            end = null;

        function startAnim(timeStamp) {
            start = timeStamp;
            end = start + dur;
            draw(timeStamp);
        }

        function draw(now) {
            if (stop) {
                return;
            }
            if (now - start >= dur) {
                stop = true;
            }
            let p = (now - start) / dur;
            val = linear(p);
            let x = from + (to - from) * val;
            if (!progress.hasClass('complete')) {
                progress.find('.pie').css('strokeDasharray', (x * 2 * Math.PI * 8 / 100) + ' ' + 2 * Math.PI * 8);
                if (x >= 100) {
                    progress.addClass('complete');
                }
            }
            requestAnimationFrame(draw);
        }

        requestAnimationFrame(startAnim);
    }

    eva.replace({
        fill: 'currentColor'
    });

};
