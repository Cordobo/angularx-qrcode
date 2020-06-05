import { __decorate, __param } from 'tslib';
import { Renderer2, Inject, PLATFORM_ID, Input, ViewChild, Component, ChangeDetectionStrategy, NgModule } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { toDataURL, toCanvas, toString } from 'qrcode';

let QRCodeComponent = class QRCodeComponent {
    constructor(renderer, platformId) {
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
        this.isValidQrCodeText = (data) => {
            if (this.allowEmptyString === false) {
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
            console.warn(`[angularx-qrcode] usesvg is deprecated, use [elementType]="'img'".`);
        }
    }
    ngAfterViewInit() {
        if (isPlatformServer(this.platformId)) {
            return;
        }
        // if (!QRCode) {
        //   QRCode = require('qrcode');
        // }
        this.createQRCode();
    }
    ngOnChanges() {
        this.createQRCode();
    }
    toDataURL() {
        return new Promise((resolve, reject) => {
            toDataURL(this.qrdata, {
                color: {
                    dark: this.colorDark,
                    light: this.colorLight,
                },
                errorCorrectionLevel: this.errorCorrectionLevel,
                margin: this.margin,
                scale: this.scale,
                version: this.version,
                width: this.width,
            }, (err, url) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(url);
                }
            });
        });
    }
    toCanvas(canvas) {
        return new Promise((resolve, reject) => {
            toCanvas(canvas, this.qrdata, {
                color: {
                    dark: this.colorDark,
                    light: this.colorLight,
                },
                errorCorrectionLevel: this.errorCorrectionLevel,
                margin: this.margin,
                scale: this.scale,
                version: this.version,
                width: this.width,
            }, (error) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve("success");
                }
            });
        });
    }
    toSVG() {
        return new Promise((resolve, reject) => {
            toString(this.qrdata, {
                color: {
                    dark: this.colorDark,
                    light: this.colorLight,
                },
                errorCorrectionLevel: this.errorCorrectionLevel,
                margin: this.margin,
                scale: this.scale,
                type: "svg",
                version: this.version,
                width: this.width,
            }, (err, url) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(url);
                }
            });
        });
    }
    renderElement(element) {
        for (const node of this.qrcElement.nativeElement.childNodes) {
            this.renderer.removeChild(this.qrcElement.nativeElement, node);
        }
        this.renderer.appendChild(this.qrcElement.nativeElement, element);
    }
    createQRCode() {
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
            let element;
            switch (this.elementType) {
                case "canvas":
                    element = this.renderer.createElement("canvas");
                    this.toCanvas(element)
                        .then(() => {
                        this.renderElement(element);
                    })
                        .catch((e) => {
                        console.error("[angularx-qrcode] canvas error: ", e);
                    });
                    break;
                case "svg":
                    element = this.renderer.createElement("svg", "svg");
                    this.toSVG()
                        .then((svgString) => {
                        element.innerHTML = svgString;
                        this.renderer.setAttribute(element, "height", `${this.width}`);
                        this.renderer.setAttribute(element, "width", `${this.width}`);
                        this.renderElement(element);
                    })
                        .catch((e) => {
                        console.error("[angularx-qrcode] svg error: ", e);
                    });
                    break;
                case "url":
                case "img":
                default:
                    element = this.renderer.createElement("img");
                    this.toDataURL()
                        .then((dataUrl) => {
                        element.setAttribute("src", dataUrl);
                        this.renderElement(element);
                    })
                        .catch((e) => {
                        console.error("[angularx-qrcode] img/url error: ", e);
                    });
            }
        }
        catch (e) {
            console.error("[angularx-qrcode] Error generating QR Code: ", e.message);
        }
    }
};
QRCodeComponent.ctorParameters = () => [
    { type: Renderer2 },
    { type: undefined, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] }
];
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
        template: `<div #qrcElement [class]="cssClass"></div>`
    }),
    __param(1, Inject(PLATFORM_ID))
], QRCodeComponent);

let QRCodeModule = class QRCodeModule {
};
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

/*
 * Public API Surface of angularx-qrcode
 */

/**
 * Generated bundle index. Do not edit.
 */

export { QRCodeComponent, QRCodeModule };
//# sourceMappingURL=angularx-qrcode.js.map
