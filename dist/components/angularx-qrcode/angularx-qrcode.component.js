/// <reference path="angularx-qrcode.component.d.ts" />
import { Component, Input, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import * as QRCode from 'qrcodejs2';
var QRCodeComponent = /** @class */ (function () {
    function QRCodeComponent(el) {
        this.el = el;
        this.qrdata = '';
        this.size = 256;
        this.level = 'M';
        this.colordark = '#000000';
        this.colorlight = '#ffffff';
        this.usesvg = false;
    }
    QRCodeComponent.prototype.ngOnInit = function () {
        try {
            if (!this.isValidQrCodeText(this.qrdata)) {
                throw new Error('Empty QR Code data');
            }
            this.qrcode = new QRCode(this.el.nativeElement, {
                colorDark: this.colordark,
                colorLight: this.colorlight,
                correctLevel: QRCode.CorrectLevel[this.level.toString()],
                height: this.size,
                text: this.qrdata,
                useSVG: this.usesvg,
                width: this.size,
            });
        }
        catch (e) {
            console.error('Error generating QR Code: ' + e.message);
        }
    };
    QRCodeComponent.prototype.ngOnChanges = function (changes) {
        if (!this.qrcode) {
            return;
        }
        var qrData = changes['qrdata'];
        if (qrData && this.isValidQrCodeText(qrData.currentValue)) {
            this.qrcode.clear();
            this.qrcode.makeCode(qrData.currentValue);
        }
    };
    QRCodeComponent.prototype.isValidQrCodeText = function (data) {
        return !(typeof data === 'undefined' || data === '');
    };
    QRCodeComponent.decorators = [
        { type: Component, args: [{
                    selector: 'qrcode',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    template: ''
                },] },
    ];
    /** @nocollapse */
    QRCodeComponent.ctorParameters = function () { return [
        { type: ElementRef, },
    ]; };
    QRCodeComponent.propDecorators = {
        'qrdata': [{ type: Input },],
        'size': [{ type: Input },],
        'level': [{ type: Input },],
        'colordark': [{ type: Input },],
        'colorlight': [{ type: Input },],
        'usesvg': [{ type: Input },],
    };
    return QRCodeComponent;
}());
export { QRCodeComponent };
//# sourceMappingURL=angularx-qrcode.component.js.map