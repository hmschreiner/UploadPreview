/*!
 * UploadPreview
 * Preview images to upload
 * (c) 2015 Henrique Schreiner <@hmschreiner>
 */
(function (window, document) {

    String.prototype.sprintf = function () {
        var formatted = this;
        for (var i = 0; i < arguments.length; i++) {
            var regexp = new RegExp('\\{' + i + '\\}', 'gi');
            formatted = formatted.replace(regexp, arguments[i]);
        }
        return formatted;
    };

    function isEmpty(obj) {
        return (Object.getOwnPropertyNames(obj).length === 0);
    }

    UploadPreview = {} || UploadPreview;
    var _self = UploadPreview;

    UploadPreview.settings = {
        container: 'uploadPreview',
        debug: false,
        maxSize: 12000, // 12Mb
        minWidth: 800,
        maxWidth: 1920,
        minHeigth: 600,
        maxHeigth: 1024
    };

    UploadPreview.messages = {
        type: "Invalid file type: '{0}'.",
        maxSize: "Selected image '{0}' is too big. Image size must be less than {1}KB.",
        minWidth: "Selected image '{0}' width must be greater than {1}px.",
        maxWidth: "Selected image '{0}' width must be less than {1}px.",
        minHeigth: "Selected image '{0}' heigth must be greater than {1}px.",
        maxHeigth: "Selected image '{0}' heigth must be less than {1}px."
    };

    UploadPreview.errors = {
        type: function (type) {
            return _self.messages.type.sprintf(type);
        },
        maxSize: function (name) {
            return _self.messages.maxSize.sprintf(name, _self.settings.maxSize);
        },
        minWidth: function (name) {
            return _self.messages.minWidth.sprintf(name, _self.settings.minWidth);
        },
        maxWidth: function (name) {
            return _self.messages.maxWidth.sprintf(name, _self.settings.maxWidth);
        },
        minHeigth: function (name) {
            return _self.messages.minHeigth.sprintf(name, _self.settings.minHeigth);
        },
        maxHeigth: function (name) {
            return _self.messages.maxHeigth.sprintf(name, _self.settings.maxHeigth);
        }
    };

    UploadPreview.load = function (file, settings, callback) {

        if (undefined !== settings) {

            for (var index in settings) {
                if (this.settings[index] !== undefined)
                    this.settings[index] = settings[index];
            }

            if (undefined !== settings.messages) {
                for (var index in settings.messages) {
                    if (this.messages[index] !== undefined)
                        this.messages[index] = settings.messages[index];
                }
            }
        }

        var reader = new FileReader,
                image = new Image,
                errors = {},
                isValid = false;

        reader.readAsDataURL(file);
        reader.onload = function (_file) {

            image.src = _file.target.result;

            image.onload = function () {

                var width = this.width,
                        heigth = this.height,
                        type = file.type,
                        name = file.name,
                        size = ~~(file.size / 1024),
                        img = document.createElement('img');

                if (_self.settings.debug) {
                    console.log(
                            'Image name: ' + name + '\n'
                            + 'Image size: ' + size + "KB\n"
                            + 'Image type: ' + type + '\n'
                            + 'Image width: ' + width + "px\n"
                            + 'Image height: ' + heigth + "px\n\n"
                            );
                }

                if (width < _self.settings.minWidth)
                    errors.minWidth = _self.errors.minWidth(name, width);

                if (width > _self.settings.maxWidth)
                    errors.maxWidth = _self.errors.maxWidth(name, width);

                if (heigth < _self.settings.minHeigth)
                    errors.minHeigth = _self.errors.minHeigth(name, heigth);

                if (heigth > _self.settings.maxHeigth)
                    errors.maxHeigth = _self.errors.maxHeigth(name, heigth);

                if (size > _self.settings.maxSize)
                    errors.maxSize = _self.errors.maxSize(name, size);

                if (isEmpty(errors)) {
                    isValid = true;
                    img.src = this.src;
                    img.title = name;
                    img.className = 'img-responsive';
                    var div = document.getElementById(_self.settings.container);
                    div.innerHTML = "";
                    div.appendChild(img);
                    div.insertAdjacentHTML('beforeend', '<br/>');
                }

                callback(isValid, errors);
            };

            image.onerror = function () {
                errors.type = _self.errors.type(file.type);
                callback(isValid, errors);
            };
        };
    };

    window.UploadPreview = UploadPreview;

})(window, document);
