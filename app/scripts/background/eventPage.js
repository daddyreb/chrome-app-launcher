(function (window) {

    chrome.runtime.onStartup.addListener(updateIcon);
    chrome.runtime.onInstalled.addListener(updateIcon);

    chrome.runtime.onMessage.addListener(updateIcon);

    var ICON_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH3QsRCikwkgmOKwAAAKdJREFUeNrt3cEJwCAMQFHtSlkwCzpTO0EPBSElvndVyOF7EsQxAABONN8WIuLeOWitNb/sP2X+5QzWEkAAARBAAAQQAAEEQAABEEAABBAAAQRAAAAAAADo4bfvAzJz6/zM9D4AAQRAAAEQQAAEEAABBBAAAQRAAAEQQAAEAAAAAICu/B9QPN9taDEBBBAAAQRAAAEQQAAEEAABBEAAARBAAAQAAKCfB2V0JHaRqsQJAAAAAElFTkSuQmCC';

    var ICON_SIZE = 38;

    function updateIcon() {

        chrome.storage.local.get('settings', function (settings) {
            //if (true || !settings || !settings.iconColor) {
            //    return;
            //}

            produceIcon(settings.iconColor || '#ff0000', function (iconData) {
                chrome.browserAction.setIcon(iconData);
            });
        });

    }

    function produceIcon(color, callback) {

        var canvas = document.createElement('canvas');
        canvas.setAttribute('width', ICON_SIZE);
        canvas.setAttribute('height', ICON_SIZE);

        var context = canvas.getContext('2d');

        var img = new Image();
        img.src = ICON_DATA_URL;

        img.onload = function () {
            context.drawImage(img, 0, 0, ICON_SIZE, ICON_SIZE);
            var imageData = context.getImageData(0, 0, ICON_SIZE, ICON_SIZE);
            colorize(color, imageData);
            callback(imageData);
        };
    }

    function colorize(color, imageData) {
        var rgbColor = hexToRgb(color);

        for (var i = 0; i < imageData.data.length; i+4) {
            var red = imageData[i],
                green = imageData[i + 1],
                blue = imageData[i + 2],
                alpha = imageData[i + 3];

            if (red === 255 && green === 255 && blue === 255) {
                continue;
            }

            red = invert(red) + rgbColor.r;
            green = invert(green) + rgbColor.g;
            blue = invert(blue) + rgbColor.b;
        }

        return imageData;
    }

    function invert(val) {
        return 255 - val;
    }

    function hexToRgb(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

})(window);
