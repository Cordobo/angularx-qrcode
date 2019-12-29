import * as tslib_1 from "tslib";
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Inject, Input, OnChanges, PLATFORM_ID, Renderer2, ViewChild, } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import * as QRCode from 'qrcode';
var QRCodeComponent = /** @class */ (function () {
    function QRCodeComponent(renderer, platformId) {
        var _this = this;
        this.renderer = renderer;
        this.platformId = platformId;
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
        this.qrcode = null;
        this.isValidQrCodeText = function (data) {
            if (_this.allowEmptyString === false) {
                return !(typeof data === 'undefined' || data === '' || data === 'null');
            }
            return !(typeof data === 'undefined');
        };
        // Deprectation warnings
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
            QRCode.toDataURL(_this.qrdata, {
                color: {
                    dark: _this.colorDark,
                    light: _this.colorLight
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
            QRCode.toCanvas(canvas, _this.qrdata, {
                color: {
                    dark: _this.colorDark,
                    light: _this.colorLight
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
                    resolve('success');
                }
            });
        });
    };
    QRCodeComponent.prototype.renderElement = function (element) {
        var e_1, _a;
        try {
            for (var _b = tslib_1.__values(this.qrcElement.nativeElement.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
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
            console.warn('[angularx-qrcode] max value for `version` is 40');
            this.version = 40;
        }
        else if (this.version && this.version < 1) {
            console.warn('[angularx-qrcode]`min value for `version` is 1');
            this.version = 1;
        }
        else if (this.version !== undefined && isNaN(this.version)) {
            console.warn('[angularx-qrcode] version should be a number, defaulting to auto');
            this.version = undefined;
        }
        try {
            if (!this.isValidQrCodeText(this.qrdata)) {
                throw new Error('[angularx-qrcode] Field `qrdata` is empty');
            }
            var element_1;
            switch (this.elementType) {
                case 'canvas':
                    element_1 = this.renderer.createElement('canvas');
                    this.toCanvas(element_1).then(function () {
                        _this.renderElement(element_1);
                    }).catch(function (e) {
                        console.error('[angularx-qrcode] error: ', e);
                    });
                    break;
                // case 'svg':
                //   break;
                case 'url':
                case 'img':
                default:
                    element_1 = this.renderer.createElement('img');
                    this.toDataURL().then(function (dataUrl) {
                        element_1.setAttribute('src', dataUrl);
                        _this.renderElement(element_1);
                    }).catch(function (e) {
                        console.error('[angularx-qrcode] error: ', e);
                    });
            }
        }
        catch (e) {
            console.error('[angularx-qrcode] Error generating QR Code: ', e.message);
        }
    };
    QRCodeComponent.ctorParameters = function () { return [
        { type: Renderer2 },
        { type: undefined, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] }
    ]; };
    tslib_1.__decorate([
        Input()
    ], QRCodeComponent.prototype, "colordark", void 0);
    tslib_1.__decorate([
        Input()
    ], QRCodeComponent.prototype, "colorlight", void 0);
    tslib_1.__decorate([
        Input()
    ], QRCodeComponent.prototype, "level", void 0);
    tslib_1.__decorate([
        Input()
    ], QRCodeComponent.prototype, "hidetitle", void 0);
    tslib_1.__decorate([
        Input()
    ], QRCodeComponent.prototype, "size", void 0);
    tslib_1.__decorate([
        Input()
    ], QRCodeComponent.prototype, "usesvg", void 0);
    tslib_1.__decorate([
        Input()
    ], QRCodeComponent.prototype, "allowEmptyString", void 0);
    tslib_1.__decorate([
        Input()
    ], QRCodeComponent.prototype, "qrdata", void 0);
    tslib_1.__decorate([
        Input()
    ], QRCodeComponent.prototype, "colorDark", void 0);
    tslib_1.__decorate([
        Input()
    ], QRCodeComponent.prototype, "colorLight", void 0);
    tslib_1.__decorate([
        Input()
    ], QRCodeComponent.prototype, "cssClass", void 0);
    tslib_1.__decorate([
        Input()
    ], QRCodeComponent.prototype, "elementType", void 0);
    tslib_1.__decorate([
        Input()
    ], QRCodeComponent.prototype, "errorCorrectionLevel", void 0);
    tslib_1.__decorate([
        Input()
    ], QRCodeComponent.prototype, "margin", void 0);
    tslib_1.__decorate([
        Input()
    ], QRCodeComponent.prototype, "scale", void 0);
    tslib_1.__decorate([
        Input()
    ], QRCodeComponent.prototype, "version", void 0);
    tslib_1.__decorate([
        Input()
    ], QRCodeComponent.prototype, "width", void 0);
    tslib_1.__decorate([
        ViewChild('qrcElement', null)
    ], QRCodeComponent.prototype, "qrcElement", void 0);
    QRCodeComponent = tslib_1.__decorate([
        Component({
            selector: 'qrcode',
            changeDetection: ChangeDetectionStrategy.OnPush,
            template: "<div #qrcElement [class]=\"cssClass\"></div>"
        }),
        tslib_1.__param(1, Inject(PLATFORM_ID))
    ], QRCodeComponent);
    return QRCodeComponent;
}());
export { QRCodeComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhcngtcXJjb2RlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXJ4LXFyY29kZS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyeC1xcmNvZGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsYUFBYSxFQUNiLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBQ0wsU0FBUyxFQUNULFdBQVcsRUFDWCxTQUFTLEVBQ1QsU0FBUyxHQUNWLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ25ELE9BQU8sS0FBSyxNQUFNLE1BQU0sUUFBUSxDQUFDO0FBUWpDO0lBNkJFLHlCQUNVLFFBQW1CLEVBQ1csVUFBZTtRQUZ2RCxpQkF1QkM7UUF0QlMsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUNXLGVBQVUsR0FBVixVQUFVLENBQUs7UUE3QnZELGFBQWE7UUFDRyxjQUFTLEdBQVcsRUFBRSxDQUFDO1FBQ3ZCLGVBQVUsR0FBVyxFQUFFLENBQUM7UUFDeEIsVUFBSyxHQUFXLEVBQUUsQ0FBQztRQUNuQixjQUFTLEdBQVksS0FBSyxDQUFDO1FBQzNCLFNBQUksR0FBVyxDQUFDLENBQUM7UUFDakIsV0FBTSxHQUFZLEtBQUssQ0FBQztRQUV4Qyx3QkFBd0I7UUFDUixxQkFBZ0IsR0FBWSxLQUFLLENBQUM7UUFDbEMsV0FBTSxHQUFXLEVBQUUsQ0FBQztRQUVwQyxpQ0FBaUM7UUFDakIsY0FBUyxHQUFXLFdBQVcsQ0FBQztRQUNoQyxlQUFVLEdBQVcsV0FBVyxDQUFDO1FBQ2pDLGFBQVEsR0FBVyxRQUFRLENBQUM7UUFDNUIsZ0JBQVcsR0FBbUMsUUFBUSxDQUFDO1FBQ3ZELHlCQUFvQixHQUE0QyxHQUFHLENBQUM7UUFDcEUsV0FBTSxHQUFXLENBQUMsQ0FBQztRQUNuQixVQUFLLEdBQVcsQ0FBQyxD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LFNBQVMsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDO3VEQUErQjtJQXpCbEQsZUFBZTtRQUwzQixTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsUUFBUTtZQUNsQixlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtZQUMvQyxRQUFRLEVBQUUsOENBQTRDO1NBQ3ZELENBQUM7UUFnQ0csbUJBQUEsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFBO09BL0JYLGVBQWUsQ0FpTDNCO0lBQUQsc0JBQUM7Q0FBQSxBQWpMRCxJQWlMQztTQWpMWSxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBQTEFURk9STV9JRCxcbiAgUmVuZGVyZXIyLFxuICBWaWV3Q2hpbGQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgaXNQbGF0Zm9ybVNlcnZlciB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgKiBhcyBRUkNvZGUgZnJvbSAncXJjb2RlJztcbmltcG9ydCB7IFFSQ29kZUVycm9yQ29ycmVjdGlvbkxldmVsLCBRUkNvZGVWZXJzaW9uLCBRUkNvZGVFbGVtZW50VHlwZSB9IGZyb20gJy4vdHlwZXMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdxcmNvZGUnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgdGVtcGxhdGU6IGA8ZGl2ICNxcmNFbGVtZW50IFtjbGFzc109XCJjc3NDbGFzc1wiPjwvZGl2PmAsXG59KVxuZXhwb3J0IGNsYXNzIFFSQ29kZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgQWZ0ZXJWaWV3SW5pdCB7XG5cbiAgLy8gRGVwcmVjYXRlZFxuICBASW5wdXQoKSBwdWJsaWMgY29sb3JkYXJrOiBzdHJpbmcgPSAnJztcbiAgQElucHV0KCkgcHVibGljIGNvbG9ybGlnaHQ6IHN0cmluZyA9ICcnO1xuICBASW5wdXQoKSBwdWJsaWMgbGV2ZWw6IHN0cmluZyA9ICcnO1xuICBASW5wdXQoKSBwdWJsaWMgaGlkZXRpdGxlOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpIHB1YmxpYyBzaXplOiBudW1iZXIgPSAwO1xuICBASW5wdXQoKSBwdWJsaWMgdXNlc3ZnOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLy8gVmFsaWQgZm9yIDEueCBhbmQgMi54XG4gIEBJbnB1dCgpIHB1YmxpYyBhbGxvd0VtcHR5U3RyaW5nOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpIHB1YmxpYyBxcmRhdGE6IHN0cmluZyA9ICcnO1xuXG4gIC8vIE5ldyBmaWVsZHMgaW50cm9kdWNlZCBpbiAyLjAuMFxuICBASW5wdXQoKSBwdWJsaWMgY29sb3JEYXJrOiBzdHJpbmcgPSAnIzAwMDAwMGZmJztcbiAgQElucHV0KCkgcHVibGljIGNvbG9yTGlnaHQ6IHN0cmluZyA9ICcjZmZmZmZmZmYnO1xuICBASW5wdXQoKSBwdWJsaWMgY3NzQ2xhc3M6IHN0cmluZyA9ICdxcmNvZGUnO1xuICBASW5wdXQoKSBwdWJsaWMgZWxlbWVudFR5cGU6IGtleW9mIHR5cGVvZiBRUkNvZGVFbGVtZW50VHlwZSA9ICdjYW52YXMnO1xuICBASW5wdXQoKSBwdWJsaWMgZXJyb3JDb3JyZWN0aW9uTGV2ZWw6IGtleW9mIHR5cGVvZiBRUkNvZGVFcnJvckNvcnJlY3Rpb25MZXZlbCA9ICdNJztcbiAgQElucHV0KCkgcHVibGljIG1hcmdpbjogbnVtYmVyID0gNDtcbiAgQElucHV0KCkgcHVibGljIHNjYWxlOiBudW1iZXIgPSA0O1xuICBASW5wdXQoKSBwdWJsaWMgdmVyc2lvbjogUVJDb2RlVmVyc2lvbjtcbiAgQElucHV0KCkgcHVibGljIHdpZHRoOiBudW1iZXIgPSAxMDtcblxuICBAVmlld0NoaWxkKCdxcmNFbGVtZW50JywgbnVsbCkgcHVibGljIHFyY0VsZW1lbnQ6IEVsZW1lbnRSZWY7XG5cbiAgcHVibGljIHFyY29kZTogYW55ID0gbnVsbDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgQEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSByZWFkb25seSBwbGF0Zm9ybUlkOiBhbnksXG4gICkge1xuICAgIC8vIERlcHJlY3RhdGlvbiB3YXJuaW5nc1xuICAgIGlmICh0aGlzLmNvbG9yZGFyayAhPT0gJycpIHtcbiAgICAgIGNvbnNvbGUud2FybignW2FuZ3VsYXJ4LXFyY29kZV0gY29sb3JkYXJrIGlzIGRlcHJlY2F0ZWQsIHVzZSBjb2xvckRhcmsuJyk7XG4gICAgfVxuICAgIGlmICh0aGlzLmNvbG9ybGlnaHQgIT09ICcnKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1thbmd1bGFyeC1xcmNvZGVdIGNvbG9ybGlnaHQgaXMgZGVwcmVjYXRlZCwgdXNlIGNvbG9yTGlnaHQuJyk7XG4gICAgfVxuICAgIGlmICh0aGlzLmxldmVsICE9PSAnJykge1xuICAgICAgY29uc29sZS53YXJuKCdbYW5ndWxhcngtcXJjb2RlXSBsZXZlbCBpcyBkZXByZWNhdGVkLCB1c2UgZXJyb3JDb3JyZWN0aW9uTGV2ZWwuJyk7XG4gICAgfVxuICAgIGlmICh0aGlzLmhpZGV0aXRsZSAhPT0gZmFsc2UpIHtcbiAgICAgIGNvbnNvbGUud2FybignW2FuZ3VsYXJ4LXFyY29kZV0gaGlkZXRpdGxlIGlzIGRlcHJlY2F0ZWQuJyk7XG4gICAgfVxuICAgIGlmICh0aGlzLnNpemUgIT09IDApIHtcbiAgICAgIGNvbnNvbGUud2FybignW2FuZ3VsYXJ4LXFyY29kZV0gc2l6ZSBpcyBkZXByZWNhdGVkLCB1c2UgYHdpZHRoYC4gRGVmYXVsdHMgdG8gMTAuJyk7XG4gICAgfVxuICAgIGlmICh0aGlzLnVzZXN2ZyAhPT0gZmFsc2UpIHtcbiAgICAgIGNvbnNvbGUud2FybihgW2FuZ3VsYXJ4LXFyY29kZV0gdXNlc3ZnIGlzIGRlcHJlY2F0ZWQsIHVzZSBbZWxlbWVudFR5cGVdPVwiJ2ltZydcIi5gKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGlmIChpc1BsYXRmb3JtU2VydmVyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gaWYgKCFRUkNvZGUpIHtcbiAgICAvLyAgIFFSQ29kZSA9IHJlcXVpcmUoJ3FyY29kZScpO1xuICAgIC8vIH1cbiAgICB0aGlzLmNyZWF0ZVFSQ29kZSgpO1xuICB9XG5cbiAgcHVibGljIG5nT25DaGFuZ2VzKCkge1xuICAgIHRoaXMuY3JlYXRlUVJDb2RlKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgaXNWYWxpZFFyQ29kZVRleHQgPSAoZGF0YTogc3RyaW5nIHwgbnVsbCk6IGJvb2xlYW4gPT4ge1xuICAgIGlmICh0aGlzLmFsbG93RW1wdHlTdHJpbmcgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm4gISh0eXBlb2YgZGF0YSA9PT0gJ3VuZGVmaW5lZCcgfHwgZGF0YSA9PT0gJycgfHwgZGF0YSA9PT0gJ251bGwnKTtcbiAgICB9XG4gICAgcmV0dXJuICEodHlwZW9mIGRhdGEgPT09ICd1bmRlZmluZWQnKTtcbiAgfVxuXG4gIHByaXZhdGUgdG9EYXRhVVJMKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZTogKGFyZzogYW55KSA9PiBhbnksIHJlamVjdDogKGFyZzogYW55KSA9PiBhbnkpID0+IHtcbiAgICAgIFFSQ29kZS50b0RhdGFVUkwodGhpcy5xcmRhdGEsXG4gICAgICAgIHtcbiAgICAgICAgICBjb2xvcjoge1xuICAgICAgICAgICAgZGFyazogdGhpcy5jb2xvckRhcmssXG4gICAgICAgICAgICBsaWdodDogdGhpcy5jb2xvckxpZ2h0XG4gICAgICAgICAgfSxcbiAgICAgICAgICBlcnJvckNvcnJlY3Rpb25MZXZlbDogdGhpcy5lcnJvckNvcnJlY3Rpb25MZXZlbCxcbiAgICAgICAgICBtYXJnaW46IHRoaXMubWFyZ2luLFxuICAgICAgICAgIHNjYWxlOiB0aGlzLnNjYWxlLFxuICAgICAgICAgIHZlcnNpb246IHRoaXMudmVyc2lvbixcbiAgICAgICAgICB3aWR0aDogdGhpcy53aWR0aCxcbiAgICAgICAgfSwgKGVyciwgdXJsKSA9PiB7XG4gICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc29sdmUodXJsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSB0b0NhbnZhcyhjYW52YXM6IEVsZW1lbnQpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmU6IChhcmc6IGFueSkgPT4gYW55LCByZWplY3Q6IChhcmc6IGFueSkgPT4gYW55KSA9PiB7XG4gICAgICBRUkNvZGUudG9DYW52YXMoY2FudmFzLCB0aGlzLnFyZGF0YSwge1xuICAgICAgICBjb2xvcjoge1xuICAgICAgICAgIGRhcms6IHRoaXMuY29sb3JEYXJrLFxuICAgICAgICAgIGxpZ2h0OiB0aGlzLmNvbG9yTGlnaHRcbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3JDb3JyZWN0aW9uTGV2ZWw6IHRoaXMuZXJyb3JDb3JyZWN0aW9uTGV2ZWwsXG4gICAgICAgIG1hcmdpbjogdGhpcy5tYXJnaW4sXG4gICAgICAgIHNjYWxlOiB0aGlzLnNjYWxlLFxuICAgICAgICB2ZXJzaW9uOiB0aGlzLnZlcnNpb24sXG4gICAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxuICAgICAgfSwgKGVycm9yKSA9PiB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZSgnc3VjY2VzcycpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyRWxlbWVudChlbGVtZW50OiBFbGVtZW50KSB7XG4gICAgZm9yIChjb25zdCBub2RlIG9mIHRoaXMucXJjRWxlbWVudC5uYXRpdmVFbGVtZW50LmNoaWxkTm9kZXMpIHtcbiAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2hpbGQodGhpcy5xcmNFbGVtZW50Lm5hdGl2ZUVsZW1lbnQsIG5vZGUpO1xuICAgIH1cbiAgICB0aGlzLnJlbmRlcmVyLmFwcGVuZENoaWxkKHRoaXMucXJjRWxlbWVudC5uYXRpdmVFbGVtZW50LCBlbGVtZW50KTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlUVJDb2RlKCkge1xuXG4gICAgLy8gU2V0IHNlbnNpdGl2ZSBkZWZhdWx0c1xuICAgIGlmICh0aGlzLnZlcnNpb24gJiYgdGhpcy52ZXJzaW9uID4gNDApIHtcbiAgICAgIGNvbnNvbGUud2FybignW2FuZ3VsYXJ4LXFyY29kZV0gbWF4IHZhbHVlIGZvciBgdmVyc2lvbmAgaXMgNDAnKTtcbiAgICAgIHRoaXMudmVyc2lvbiA9IDQwO1xuICAgIH0gZWxzZSBpZiAodGhpcy52ZXJzaW9uICYmIHRoaXMudmVyc2lvbiA8IDEpIHtcbiAgICAgIGNvbnNvbGUud2FybignW2FuZ3VsYXJ4LXFyY29kZV1gbWluIHZhbHVlIGZvciBgdmVyc2lvbmAgaXMgMScpO1xuICAgICAgdGhpcy52ZXJzaW9uID0gMTtcbiAgICB9IGVsc2UgaWYgKHRoaXMudmVyc2lvbiAhPT0gdW5kZWZpbmVkICYmIGlzTmFOKHRoaXMudmVyc2lvbikpIHtcbiAgICAgIGNvbnNvbGUud2FybignW2FuZ3VsYXJ4LXFyY29kZV0gdmVyc2lvbiBzaG91bGQgYmUgYSBudW1iZXIsIGRlZmF1bHRpbmcgdG8gYXV0bycpO1xuICAgICAgdGhpcy52ZXJzaW9uID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBpZiAoIXRoaXMuaXNWYWxpZFFyQ29kZVRleHQodGhpcy5xcmRhdGEpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignW2FuZ3VsYXJ4LXFyY29kZV0gRmllbGQgYHFyZGF0YWAgaXMgZW1wdHknKTtcbiAgICAgIH1cblxuICAgICAgbGV0IGVsZW1lbnQ6IEVsZW1lbnQ7XG5cbiAgICAgIHN3aXRjaCAodGhpcy5lbGVtZW50VHlwZSkge1xuICAgICAgICBjYXNlICdjYW52YXMnOlxuICAgICAgICAgIGVsZW1lbnQgPSB0aGlzLnJlbmRlcmVyLmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgICAgIHRoaXMudG9DYW52YXMoZWxlbWVudCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlbmRlckVsZW1lbnQoZWxlbWVudCk7XG4gICAgICAgICAgfSkuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1thbmd1bGFyeC1xcmNvZGVdIGVycm9yOiAnLCBlKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gY2FzZSAnc3ZnJzpcbiAgICAgICAgLy8gICBicmVhaztcbiAgICAgICAgY2FzZSAndXJsJzpcbiAgICAgICAgY2FzZSAnaW1nJzpcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBlbGVtZW50ID0gdGhpcy5yZW5kZXJlci5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICAgICAgICB0aGlzLnRvRGF0YVVSTCgpLnRoZW4oKGRhdGFVcmw6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3NyYycsIGRhdGFVcmwpO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJFbGVtZW50KGVsZW1lbnQpO1xuICAgICAgICAgIH0pLmNhdGNoKChlKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdbYW5ndWxhcngtcXJjb2RlXSBlcnJvcjogJywgZSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdbYW5ndWxhcngtcXJjb2RlXSBFcnJvciBnZW5lcmF0aW5nIFFSIENvZGU6ICcsIGUubWVzc2FnZSk7XG4gICAgfVxuXG4gIH1cblxufVxuIl19