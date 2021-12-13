import { Component, ChangeDetectionStrategy, Renderer2, Input, ViewChild, NgModule } from '@angular/core';
import { toDataURL, toCanvas, toString } from 'qrcode';

import * as ɵngcc0 from '@angular/core';

const _c0 = ["qrcElement"];
class QRCodeComponent {
    constructor(renderer) {
        this.renderer = renderer;
        // Deprecated
        this.colordark = '';
        this.colorlight = '';
        this.level = '';
        this.hidetitle = false;
        this.size = 0;
        this.usesvg = false;
        // Valid for 1.x and 2.x
        this.allowEmptyString = false;
        this.qrdata = '';
        // New fields introduced in 2.0.0
        this.colorDark = '#000000ff';
        this.colorLight = '#ffffffff';
        this.cssClass = 'qrcode';
        this.elementType = 'canvas';
        this.errorCorrectionLevel = 'M';
        this.margin = 4;
        this.scale = 4;
        this.width = 10;
        // Deprecation warnings
        if (this.colordark !== '') {
            console.warn('[angularx-qrcode] colordark is deprecated, use colorDark.');
        }
        if (this.colorlight !== '') {
            console.warn('[angularx-qrcode] colorlight is deprecated, use colorLight.');
        }
        if (this.level !== '') {
            console.warn('[angularx-qrcode] level is deprecated, use errorCorrectionLevel.');
        }
        if (this.hidetitle !== false) {
            console.warn('[angularx-qrcode] hidetitle is deprecated.');
        }
        if (this.size !== 0) {
            console.warn('[angularx-qrcode] size is deprecated, use `width`. Defaults to 10.');
        }
        if (this.usesvg !== false) {
            console.warn(`[angularx-qrcode] usesvg is deprecated, use [elementType]="'svg'".`);
        }
    }
    ngOnChanges() {
        this.createQRCode();
    }
    isValidQrCodeText(data) {
        if (this.allowEmptyString === false) {
            return !(typeof data === 'undefined' ||
                data === '' ||
                data === 'null' ||
                data === null);
        }
        return !(typeof data === 'undefined');
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
                    resolve('success');
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
                type: 'svg',
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
            console.warn('[angularx-qrcode] max value for `version` is 40');
            this.version = 40;
        }
        else if (this.version && this.version < 1) {
            console.warn('[angularx-qrcode]`min value for `version` is 1');
            this.version = 1;
        }
        else if (this.version !== undefined && isNaN(this.version)) {
            console.warn('[angularx-qrcode] version should be a number, defaulting to auto.');
            this.version = undefined;
        }
        try {
            if (!this.isValidQrCodeText(this.qrdata)) {
                throw new Error('[angularx-qrcode] Field `qrdata` is empty, set`allowEmptyString="true"` to overwrite this behaviour.');
            }
            let element;
            switch (this.elementType) {
                case 'canvas':
                    element = this.renderer.createElement('canvas');
                    this.toCanvas(element)
                        .then(() => {
                        this.renderElement(element);
                    })
                        .catch((e) => {
                        console.error('[angularx-qrcode] canvas error: ', e);
                    });
                    break;
                case 'svg':
                    element = this.renderer.createElement('div');
                    this.toSVG()
                        .then((svgString) => {
                        this.renderer.setProperty(element, 'innerHTML', svgString);
                        const innerElement = element.firstChild;
                        this.renderer.setAttribute(innerElement, 'height', `${this.width}`);
                        this.renderer.setAttribute(innerElement, 'width', `${this.width}`);
                        this.renderElement(innerElement);
                    })
                        .catch((e) => {
                        console.error('[angularx-qrcode] svg error: ', e);
                    });
                    break;
                case 'url':
                case 'img':
                default:
                    element = this.renderer.createElement('img');
                    this.toDataURL()
                        .then((dataUrl) => {
                        element.setAttribute('src', dataUrl);
                        this.renderElement(element);
                    })
                        .catch((e) => {
                        console.error('[angularx-qrcode] img/url error: ', e);
                    });
            }
        }
        catch (e) {
            console.error('[angularx-qrcode] Error generating QR Code: ', e.message);
        }
    }
}
QRCodeComponent.ɵfac = function QRCodeComponent_Factory(t) { return new (t || QRCodeComponent)(ɵngcc0.ɵɵdirectiveInject(ɵngcc0.Renderer2)); };
QRCodeComponent.ɵcmp = /*@__PURE__*/ ɵngcc0.ɵɵdefineComponent({ type: QRCodeComponent, selectors: [["qrcode"]], viewQuery: function QRCodeComponent_Query(rf, ctx) { if (rf & 1) {
        ɵngcc0.ɵɵviewQuery(_c0, 7);
    } if (rf & 2) {
        let _t;
        ɵngcc0.ɵɵqueryRefresh(_t = ɵngcc0.ɵɵloadQuery()) && (ctx.qrcElement = _t.first);
    } }, inputs: { colordark: "colordark", colorlight: "colorlight", level: "level", hidetitle: "hidetitle", size: "size", usesvg: "usesvg", allowEmptyString: "allowEmptyString", qrdata: "qrdata", colorDark: "colorDark", colorLight: "colorLight", cssClass: "cssClass", elementType: "elementType", errorCorrectionLevel: "errorCorrectionLevel", margin: "margin", scale: "scale", width: "width", version: "version" }, features: [ɵngcc0.ɵɵNgOnChangesFeature], decls: 2, vars: 2, consts: [["qrcElement", ""]], template: function QRCodeComponent_Template(rf, ctx) { if (rf & 1) {
        ɵngcc0.ɵɵelement(0, "div", null, 0);
    } if (rf & 2) {
        ɵngcc0.ɵɵclassMap(ctx.cssClass);
    } }, encapsulation: 2, changeDetection: 0 });
QRCodeComponent.ctorParameters = () => [
    { type: Renderer2 }
];
QRCodeComponent.propDecorators = {
    colordark: [{ type: Input }],
    colorlight: [{ type: Input }],
    level: [{ type: Input }],
    hidetitle: [{ type: Input }],
    size: [{ type: Input }],
    usesvg: [{ type: Input }],
    allowEmptyString: [{ type: Input }],
    qrdata: [{ type: Input }],
    colorDark: [{ type: Input }],
    colorLight: [{ type: Input }],
    cssClass: [{ type: Input }],
    elementType: [{ type: Input }],
    errorCorrectionLevel: [{ type: Input }],
    margin: [{ type: Input }],
    scale: [{ type: Input }],
    version: [{ type: Input }],
    width: [{ type: Input }],
    qrcElement: [{ type: ViewChild, args: ['qrcElement', { static: true },] }]
};
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && ɵngcc0.ɵsetClassMetadata(QRCodeComponent, [{
        type: Component,
        args: [{
                selector: 'qrcode',
                changeDetection: ChangeDetectionStrategy.OnPush,
                template: `<div #qrcElement [class]="cssClass"></div>`
            }]
    }], function () { return [{ type: ɵngcc0.Renderer2 }]; }, { colordark: [{
            type: Input
        }], colorlight: [{
            type: Input
        }], level: [{
            type: Input
        }], hidetitle: [{
            type: Input
        }], size: [{
            type: Input
        }], usesvg: [{
            type: Input
        }], allowEmptyString: [{
            type: Input
        }], qrdata: [{
            type: Input
        }], colorDark: [{
            type: Input
        }], colorLight: [{
            type: Input
        }], cssClass: [{
            type: Input
        }], elementType: [{
            type: Input
        }], errorCorrectionLevel: [{
            type: Input
        }], margin: [{
            type: Input
        }], scale: [{
            type: Input
        }], width: [{
            type: Input
        }], version: [{
            type: Input
        }], qrcElement: [{
            type: ViewChild,
            args: ['qrcElement', { static: true }]
        }] }); })();

class QRCodeModule {
}
QRCodeModule.ɵfac = function QRCodeModule_Factory(t) { return new (t || QRCodeModule)(); };
QRCodeModule.ɵmod = /*@__PURE__*/ ɵngcc0.ɵɵdefineNgModule({ type: QRCodeModule });
QRCodeModule.ɵinj = /*@__PURE__*/ ɵngcc0.ɵɵdefineInjector({ providers: [] });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && ɵngcc0.ɵsetClassMetadata(QRCodeModule, [{
        type: NgModule,
        args: [{
                providers: [],
                declarations: [QRCodeComponent],
                exports: [QRCodeComponent]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && ɵngcc0.ɵɵsetNgModuleScope(QRCodeModule, { declarations: [QRCodeComponent], exports: [QRCodeComponent] }); })();

/*
 * Public API Surface of angularx-qrcode
 */

/**
 * Generated bundle index. Do not edit.
 */

export { QRCodeComponent, QRCodeModule };


//# sourceMappingURL=angularx-qrcode.js.map