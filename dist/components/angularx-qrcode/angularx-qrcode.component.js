var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { ChangeDetectionStrategy, Component, ElementRef, Inject, Input, PLATFORM_ID, } from '@angular/core';
import { isPlatformServer } from '@angular/common';
var QRCode;
var QRCodeComponent = /** @class */ (function () {
    function QRCodeComponent(el, platformId) {
        var _this = this;
        this.el = el;
        this.platformId = platformId;
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
    QRCodeComponent.prototype.ngAfterViewInit = function () {
        if (isPlatformServer(this.platformId)) {
            return;
        }
        if (!QRCode) {
            QRCode = require('qrcodejs2');
        }
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
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], QRCodeComponent.prototype, "allowEmptyString", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], QRCodeComponent.prototype, "colordark", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], QRCodeComponent.prototype, "colorlight", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], QRCodeComponent.prototype, "level", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], QRCodeComponent.prototype, "hidetitle", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], QRCodeComponent.prototype, "qrdata", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], QRCodeComponent.prototype, "size", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], QRCodeComponent.prototype, "usesvg", void 0);
    QRCodeComponent = __decorate([
        Component({
            selector: 'qrcode',
            changeDetection: ChangeDetectionStrategy.OnPush,
            template: ''
        }),
        __param(1, Inject(PLATFORM_ID)),
        __metadata("design:paramtypes", [ElementRef, Object])
    ], QRCodeComponent);
    return QRCodeComponent;
}());
export { QRCodeComponent };
//# sourceMappingURL=angularx-qrcode.component.js.map