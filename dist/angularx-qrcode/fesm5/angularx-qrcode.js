import { __values, __decorate, __param } from 'tslib';
import { Renderer2, Inject, PLATFORM_ID, Input, ViewChild, Component, ChangeDetectionStrategy, NgModule } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { toDataURL, toCanvas, toString } from 'qrcode';

var QRCodeComponent = /** @class */ (function () {
    function QRCodeComponent(renderer, platformId) {
        var _this = this;
        this.renderer = renderer;
        this.platformId = platformId;
        // Deprecated
        this.colordark = "";
        this.colorlight = "";
        this.level = "";
        this.hidetitle = false;
        this.size = 0;
        this.usesvg = false;
        // Valid for 1.x and 2.x
        this.allowEmptyString = false;
        this.qrdata = "";
        // New fields introduced in 2.0.0
        this.colorDark = "#000000ff";
        this.colorLight = "#ffffffff";
        this.cssClass = "qrcode";
        this.elementType = "canvas";
        this.errorCorrectionLevel = "M";
        this.margin = 4;
        this.scale = 4;
        this.width = 10;
        this.qrcode = null;
        this.isValidQrCodeText = function (data) {
            if (_this.allowEmptyString === false) {
                return !(typeof data === "undefined" ||
                    data === "" ||
                    data === "null" ||
                    data === null);
            }
            return !(typeof data === "undefined");
        };
        // Deprectation warnings
        if (this.colordark !== "") {
            console.warn("[angularx-qrcode] colordark is deprecated, use colorDark.");
        }
        if (this.colorlight !== "") {
            console.warn("[angularx-qrcode] colorlight is deprecated, use colorLight.");
        }
        if (this.level !== "") {
            console.warn("[angularx-qrcode] level is deprecated, use errorCorrectionLevel.");
        }
        if (this.hidetitle !== false) {
            console.warn("[angularx-qrcode] hidetitle is deprecated.");
        }
        if (this.size !== 0) {
            console.warn("[angularx-qrcode] size is deprecated, use `width`. Defaults to 10.");
        }
        if (this.usesvg !== false) {
            console.warn("[angularx-qrcode] usesvg is deprecated, use [elementType]=\"'img'\".");
        }
    }
    QRCodeComponent.prototype.ngAfterViewInit = function () {
        if (isPlatformServer(this.platformId)) {
            return;
        }
        // if (!QRCode) {
        //   QRCode = require('qrcode');
        // }
        this.createQRCode();
    };
    QRCodeComponent.prototype.ngOnChanges = function () {
        this.createQRCode();
    };
    QRCodeComponent.prototype.toDataURL = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            toDataURL(_this.qrdata, {
                color: {
                    dark: _this.colorDark,
                    light: _this.colorLight,
                },
                errorCorrectionLevel: _this.errorCorrectionLevel,
                margin: _this.margin,
                scale: _this.scale,
                version: _this.version,
                width: _this.width,
            }, function (err, url) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(url);
                }
            });
        });
    };
    QRCodeComponent.prototype.toCanvas = function (canvas) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            toCanvas(canvas, _this.qrdata, {
                color: {
                    dark: _this.colorDark,
                    light: _this.colorLight,
                },
                errorCorrectionLevel: _this.errorCorrectionLevel,
                margin: _this.margin,
                scale: _this.scale,
                version: _this.version,
                width: _this.width,
            }, function (error) {
                if (error) {
                    reject(error);
                }
                else {
                    resolve("success");
                }
            });
        });
    };
    QRCodeComponent.prototype.toSVG = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            toString(_this.qrdata, {
                color: {
                    dark: _this.colorDark,
                    light: _this.colorLight,
                },
                errorCorrectionLevel: _this.errorCorrectionLevel,
                margin: _this.margin,
                scale: _this.scale,
                type: "svg",
                version: _this.version,
                width: _this.width,
            }, function (err, url) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(url);
                }
            });
        });
    };
    QRCodeComponent.prototype.renderElement = function (element) {
        var e_1, _a;
        try {
            for (var _b = __values(this.qrcElement.nativeElement.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var node = _c.value;
                this.renderer.removeChild(this.qrcElement.nativeElement, node);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this.renderer.appendChild(this.qrcElement.nativeElement, element);
    };
    QRCodeComponent.prototype.createQRCode = function () {
        var _this = this;
        // Set sensitive defaults
        if (this.version && this.version > 40) {
            console.warn("[angularx-qrcode] max value for `version` is 40");
            this.version = 40;
        }
        else if (this.version && this.version < 1) {
            console.warn("[angularx-qrcode]`min value for `version` is 1");
            this.version = 1;
        }
        else if (this.version !== undefined && isNaN(this.version)) {
            console.warn("[angularx-qrcode] version should be a number, defaulting to auto");
            this.version = undefined;
        }
        try {
            if (!this.isValidQrCodeText(this.qrdata)) {
                throw new Error("[angularx-qrcode] Field `qrdata` is empty");
            }
            var element_1;
            switch (this.elementType) {
                case "canvas":
                    element_1 = this.renderer.createElement("canvas");
                    this.toCanvas(element_1)
                        .then(function () {
                        _this.renderElement(element_1);
                    })
                        .catch(function (e) {
                        console.error("[angularx-qrcode] canvas error: ", e);
                    });
                    break;
                case "svg":
                    element_1 = this.renderer.createElement("svg", "svg");
                    this.toSVG()
                        .then(function (svgString) {
                        element_1.innerHTML = svgString;
                        _this.renderer.setAttribute(element_1, "height", "" + _this.width);
                        _this.renderer.setAttribute(element_1, "width", "" + _this.width);
                        _this.renderElement(element_1);
                    })
                        .catch(function (e) {
                        console.error("[angularx-qrcode] svg error: ", e);
                    });
                    break;
                case "url":
                case "img":
                default:
                    element_1 = this.renderer.createElement("img");
                    this.toDataURL()
                        .then(function (dataUrl) {
                        element_1.setAttribute("src", dataUrl);
                        _this.renderElement(element_1);
                    })
                        .catch(function (e) {
                        console.error("[angularx-qrcode] img/url error: ", e);
                    });
            }
        }
        catch (e) {
            console.error("[angularx-qrcode] Error generating QR Code: ", e.message);
        }
    };
    QRCodeComponent.ctorParameters = function () { return [
        { type: Renderer2 },
        { type: undefined, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] }
    ]; };
    __decorate([
        Input()
    ], QRCodeComponent.prototype, "colordark", void 0);
    __decorate([
        Input()
    ], QRCodeComponent.prototype, "colorlight", void 0);
    __decorate([
        Input()
    ], QRCodeComponent.prototype, "level", void 0);
    __decorate([
        Input()
    ], QRCodeComponent.prototype, "hidetitle", void 0);
    __decorate([
        Input()
    ], QRCodeComponent.prototype, "size", void 0);
    __decorate([
        Input()
    ], QRCodeComponent.prototype, "usesvg", void 0);
    __decorate([
        Input()
    ], QRCodeComponent.prototype, "allowEmptyString", void 0);
    __decorate([
        Input()
    ], QRCodeComponent.prototype, "qrdata", void 0);
    __decorate([
        Input()
    ], QRCodeComponent.prototype, "colorDark", void 0);
    __decorate([
        Input()
    ], QRCodeComponent.prototype, "colorLight", void 0);
    __decorate([
        Input()
    ], QRCodeComponent.prototype, "cssClass", void 0);
    __decorate([
        Input()
    ], QRCodeComponent.prototype, "elementType", void 0);
    __decorate([
        Input()
    ], QRCodeComponent.prototype, "errorCorrectionLevel", void 0);
    __decorate([
        Input()
    ], QRCodeComponent.prototype, "margin", void 0);
    __decorate([
        Input()
    ], QRCodeComponent.prototype, "scale", void 0);
    __decorate([
        Input()
    ], QRCodeComponent.prototype, "version", void 0);
    __decorate([
        Input()
    ], QRCodeComponent.prototype, "width", void 0);
    __decorate([
        ViewChild("qrcElement", { static: true })
    ], QRCodeComponent.prototype, "qrcElement", void 0);
    QRCodeComponent = __decorate([
        Component({
            selector: "qrcode",
            changeDetection: ChangeDetectionStrategy.OnPush,
            template: "<div #qrcElement [class]=\"cssClass\"></div>"
        }),
        __param(1, Inject(PLATFORM_ID))
    ], QRCodeComponent);
    return QRCodeComponent;
}());

var QRCodeModule = /** @class */ (function () {
    function QRCodeModule() {
    }
    QRCodeModule = __decorate([
        NgModule({
            providers: [],
            declarations: [
                QRCodeComponent,
            ],
            exports: [
                QRCodeComponent,
            ]
        })
    ], QRCodeModule);
    return QRCodeModule;
}());

/*
 * Public API Surface of angularx-qrcode
 */

/**
 * Generated bundle index. Do not edit.
 */

export { QRCodeComponent, QRCodeModule };
//# sourceMappingURL=angularx-qrcode.js.map
