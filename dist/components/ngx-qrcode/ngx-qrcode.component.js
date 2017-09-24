/// <reference path="qrcodejs2.d.ts" />
import { Component, Input, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import * as QRCode from 'qrcodejs2';
var NgxQrcodeComponent = /** @class */ (function () {
    function NgxQrcodeComponent(el) {
        this.el = el;
        this.qrdata = '';
        this.size = 256;
        this.level = 'M';
        this.colordark = '#000000';
        this.colorlight = '#ffffff';
        this.usesvg = false;
    }
    NgxQrcodeComponent.prototype.ngOnInit = function () {
        try {
            if (!this.isValidQrCodeText(this.qrdata)) {
                throw new Error('Empty QR Code data');
            }
            this.qrcode = new QRCode(this.el.nativeElement, {
                text: this.qrdata,
                width: this.size,
                height: this.size,
                colorDark: this.colordark,
                colorLight: this.colorlight,
                useSVG: this.usesvg,
                correctLevel: QRCode.CorrectLevel[this.level.toString()]
            });
        }
        catch (e) {
            console.error('Error generating QR Code: ' + e.message);
        }
    };
    NgxQrcodeComponent.prototype.ngOnChanges = function (changes) {
        if (!this.qrcode) {
            return;
        }
        var qrData = changes['qrdata'];
        if (qrData && this.isValidQrCodeText(qrData.currentValue)) {
            this.qrcode.clear();
            this.qrcode.makeCode(qrData.currentValue);
        }
    };
    NgxQrcodeComponent.prototype.isValidQrCodeText = function (data) {
        return !(typeof data === 'undefined' || data === '');
    };
    NgxQrcodeComponent.decorators = [
        { type: Component, args: [{
                    selector: 'qrcode',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    template: ''
                },] },
    ];
    /** @nocollapse */
    NgxQrcodeComponent.ctorParameters = function () { return [
        { type: ElementRef, },
    ]; };
    NgxQrcodeComponent.propDecorators = {
        'qrdata': [{ type: Input },],
        'size': [{ type: Input },],
        'level': [{ type: Input },],
        'colordark': [{ type: Input },],
        'colorlight': [{ type: Input },],
        'usesvg': [{ type: Input },],
    };
    return NgxQrcodeComponent;
}());
export { NgxQrcodeComponent };
//# sourceMappingURL=ngx-qrcode.component.js.map