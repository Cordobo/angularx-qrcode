/// <reference path="./qrcodejs2.d.ts" />
import { ChangeDetectionStrategy, Component, ElementRef, Input } from '@angular/core';
import * as QRCode from 'qrcodejs2';
var QRCodeComponent = /** @class */ (function () {
    function QRCodeComponent(el) {
        var _this = this;
        this.el = el;
        /** @internal */
        this.allowEmptyString = false;
        this.colordark = '#000000';
        this.colorlight = '#ffffff';
        this.level = 'M';
        this.hidetitle = false;
        this.qrdata = '';
        this.size = 256;
        this.usesvg = false;
        this.isValidQrCodeText = function (data) {
            if (_this.allowEmptyString === false) {
                return !(typeof data === 'undefined' || data === '');
            }
            return !(typeof data === 'undefined');
        };
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
                text: this.qrdata || ' ',
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
    QRCodeComponent.decorators = [
        { type: Component, args: [{
                    selector: 'qrcode',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    template: ''
                },] },
    ];
    /** @nocollapse */
    QRCodeComponent.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    QRCodeComponent.propDecorators = {
        allowEmptyString: [{ type: Input }],
        colordark: [{ type: Input }],
        colorlight: [{ type: Input }],
        level: [{ type: Input }],
        hidetitle: [{ type: Input }],
        qrdata: [{ type: Input }],
        size: [{ type: Input }],
        usesvg: [{ type: Input }]
    };
    return QRCodeComponent;
}());
export { QRCodeComponent };
//# sourceMappingURL=angularx-qrcode.component.js.map