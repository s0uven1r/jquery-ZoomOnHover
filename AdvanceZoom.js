
(function ($) {

    $.fn.AdvanceZoom = function (options) {

        var AdvanceZoom = {
            init: function ($element) {
                var $parent = $(this).parent();
                if ($parent.is("span")) {
                    $parent.css('display', 'inline');
                } else {
                    $element.wrap('<span id="adv-zoom" style="display:inline-block"></span>')
                }

                if (!settings.url) {
                    console.error('missing value for url parameter');
                }

                var img = document.createElement('img');
                img.src = settings.url;
                img.onload = function () {
                    AdvanceZoom.zoom(img, settings.magnify)
                }

            },
            zoom: function (img, magnify) {
                var displayWidth,
                    displayHeight,
                    xRatio,
                    yRatio,
                    offset,
                    parent = document.getElementById('adv-zoom'),
                    $parent = $(parent),
                    position = $parent.css('position');
                parent.style.position = /(absolute|fixed)/.test(position) ? position : 'relative';
                parent.style.overflow = 'hidden';
                img.style.width = img.style.height = '';

                $(img)
                    .addClass('ImgToZoom')
                    .css({
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        opacity: 0,
                        width: img.width * magnify,
                        height: img.height * magnify,
                        border: 'none',
                        maxWidth: 'none',
                        maxHeight: 'none'
                    })
                    .appendTo(parent);
                function start(e) {

                    displayWidth = $parent.outerWidth();
                    displayHeight = $parent.outerHeight();

                    xRatio = (img.width - displayWidth) / displayWidth;
                    yRatio = (img.height - displayHeight) / displayHeight;
                    //console.log('imgH' + img.height + 'imgW' + img.width);
                    offset = $parent.offset();
                    $(img).stop()
                        .fadeTo($.support.opacity ? settings.duration : 0, 1, false);
                }


                function move(e) {

                    var left = (e.pageX - offset.left),
                        top = (e.pageY - offset.top);

                    top = Math.max(Math.min(top, displayHeight), 0);
                    left = Math.max(Math.min(left, displayWidth), 0);

                    img.style.left = (left * -xRatio) + 'px';
                    img.style.top = (top * -yRatio) + 'px';
                }

                function stop() {
                    $(img).stop()
                        .fadeTo(settings.duration, 0, false);

                }

                $parent
                    .on('mouseenter', function () { start(); })
                    .on('mouseleave', function () { stop(); })
                    .mousemove(function (e) { move(e) }).hover(function () {
                        $(this).css('cursor','crosshair');

                    });
            }


        }
        var settings = $.extend({
            url: false,
            magnify: 1,
            duration: 150
        }, options);;

        return (this.each(function () {
            var $image = $(this);
            AdvanceZoom.init($image);
        }));
    }

}(jQuery));