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
        ViewChild('qrcElement', { static: true })
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhcngtcXJjb2RlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXJ4LXFyY29kZS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyeC1xcmNvZGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsYUFBYSxFQUNiLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBQ0wsU0FBUyxFQUNULFdBQVcsRUFDWCxTQUFTLEVBQ1QsU0FBUyxHQUNWLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ25ELE9BQU8sS0FBSyxNQUFNLE1BQU0sUUFBUSxDQUFDO0FBUWpDO0lBNkJFLHlCQUNVLFFBQW1CLEVBQ1csVUFBZTtRQUZ2RCxpQkF1QkM7UUF0QlMsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUNXLGVBQVUsR0FBVixVQUFVLENBQUs7UUE3QnZELGFBQWE7UUFDRyxjQUFTLEdBQVcsRUFBRSxDQUFDO1FBQ3ZCLGVBQVUsR0FBVyxFQUFFLENBQUM7UUFDeEIsVUFBSyxHQUFXLEVBQUUsQ0FBQztRQUNuQixjQUFTLEdBQVksS0FBSyxDQUFDO1FBQzNCLFNBQUksR0FBVyxDQUFDLENBQUM7UUFDakIsV0FBTSxHQUFZLEtBQUssQ0FBQztRQUV4Qyx3QkFBd0I7UUFDUixxQkFBZ0IsR0FBWSxLQUFLLENBQUM7UUFDbEMsV0FBTSxHQUFXLEVBQUUsQ0FBQztRQUVwQyxpQ0FBaUM7UUFDakIsY0FBUyxHQUFXLFdBQVcsQ0FBQztRQUNoQyxlQUFVLEdBQVcsV0FBVyxDQUFDO1FBQ2pDLGFBQVEsR0FBVyxRQUFRLENBQUM7UUFDNUIsZ0JBQVcsR0FBbUMsUUFBUSxDQUFDO1FBQ3ZELHlCQUFvQixHQUE0QyxHQUFHLENBQUM7UUFDcEUsV0FBTSxHQUFXLENBQUMsQ0FBQztRQUNuQixVQUFLLEdBQVcsQ0FBQyxD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LFNBQVMsQ0FBQyxZQUFZLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUM7dURBQStCO0lBekI5RCxlQUFlO1FBTDNCLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxRQUFRO1lBQ2xCLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO1lBQy9DLFFBQVEsRUFBRSw4Q0FBNEM7U0FDdkQsQ0FBQztRQWdDRyxtQkFBQSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUE7T0EvQlgsZUFBZSxDQWlMM0I7SUFBRCxzQkFBQztDQUFBLEFBakxELElBaUxDO1NBakxZLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIFBMQVRGT1JNX0lELFxuICBSZW5kZXJlcjIsXG4gIFZpZXdDaGlsZCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBpc1BsYXRmb3JtU2VydmVyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCAqIGFzIFFSQ29kZSBmcm9tICdxcmNvZGUnO1xuaW1wb3J0IHsgUVJDb2RlRXJyb3JDb3JyZWN0aW9uTGV2ZWwsIFFSQ29kZVZlcnNpb24sIFFSQ29kZUVsZW1lbnRUeXBlIH0gZnJvbSAnLi90eXBlcyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3FyY29kZScsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICB0ZW1wbGF0ZTogYDxkaXYgI3FyY0VsZW1lbnQgW2NsYXNzXT1cImNzc0NsYXNzXCI+PC9kaXY+YCxcbn0pXG5leHBvcnQgY2xhc3MgUVJDb2RlQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzLCBBZnRlclZpZXdJbml0IHtcblxuICAvLyBEZXByZWNhdGVkXG4gIEBJbnB1dCgpIHB1YmxpYyBjb2xvcmRhcms6IHN0cmluZyA9ICcnO1xuICBASW5wdXQoKSBwdWJsaWMgY29sb3JsaWdodDogc3RyaW5nID0gJyc7XG4gIEBJbnB1dCgpIHB1YmxpYyBsZXZlbDogc3RyaW5nID0gJyc7XG4gIEBJbnB1dCgpIHB1YmxpYyBoaWRldGl0bGU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KCkgcHVibGljIHNpemU6IG51bWJlciA9IDA7XG4gIEBJbnB1dCgpIHB1YmxpYyB1c2Vzdmc6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvLyBWYWxpZCBmb3IgMS54IGFuZCAyLnhcbiAgQElucHV0KCkgcHVibGljIGFsbG93RW1wdHlTdHJpbmc6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KCkgcHVibGljIHFyZGF0YTogc3RyaW5nID0gJyc7XG5cbiAgLy8gTmV3IGZpZWxkcyBpbnRyb2R1Y2VkIGluIDIuMC4wXG4gIEBJbnB1dCgpIHB1YmxpYyBjb2xvckRhcms6IHN0cmluZyA9ICcjMDAwMDAwZmYnO1xuICBASW5wdXQoKSBwdWJsaWMgY29sb3JMaWdodDogc3RyaW5nID0gJyNmZmZmZmZmZic7XG4gIEBJbnB1dCgpIHB1YmxpYyBjc3NDbGFzczogc3RyaW5nID0gJ3FyY29kZSc7XG4gIEBJbnB1dCgpIHB1YmxpYyBlbGVtZW50VHlwZToga2V5b2YgdHlwZW9mIFFSQ29kZUVsZW1lbnRUeXBlID0gJ2NhbnZhcyc7XG4gIEBJbnB1dCgpIHB1YmxpYyBlcnJvckNvcnJlY3Rpb25MZXZlbDoga2V5b2YgdHlwZW9mIFFSQ29kZUVycm9yQ29ycmVjdGlvbkxldmVsID0gJ00nO1xuICBASW5wdXQoKSBwdWJsaWMgbWFyZ2luOiBudW1iZXIgPSA0O1xuICBASW5wdXQoKSBwdWJsaWMgc2NhbGU6IG51bWJlciA9IDQ7XG4gIEBJbnB1dCgpIHB1YmxpYyB2ZXJzaW9uOiBRUkNvZGVWZXJzaW9uO1xuICBASW5wdXQoKSBwdWJsaWMgd2lkdGg6IG51bWJlciA9IDEwO1xuXG4gIEBWaWV3Q2hpbGQoJ3FyY0VsZW1lbnQnLCB7IHN0YXRpYzogdHJ1ZSB9KSBwdWJsaWMgcXJjRWxlbWVudDogRWxlbWVudFJlZjtcblxuICBwdWJsaWMgcXJjb2RlOiBhbnkgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBASW5qZWN0KFBMQVRGT1JNX0lEKSBwcml2YXRlIHJlYWRvbmx5IHBsYXRmb3JtSWQ6IGFueSxcbiAgKSB7XG4gICAgLy8gRGVwcmVjdGF0aW9uIHdhcm5pbmdzXG4gICAgaWYgKHRoaXMuY29sb3JkYXJrICE9PSAnJykge1xuICAgICAgY29uc29sZS53YXJuKCdbYW5ndWxhcngtcXJjb2RlXSBjb2xvcmRhcmsgaXMgZGVwcmVjYXRlZCwgdXNlIGNvbG9yRGFyay4nKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuY29sb3JsaWdodCAhPT0gJycpIHtcbiAgICAgIGNvbnNvbGUud2FybignW2FuZ3VsYXJ4LXFyY29kZV0gY29sb3JsaWdodCBpcyBkZXByZWNhdGVkLCB1c2UgY29sb3JMaWdodC4nKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubGV2ZWwgIT09ICcnKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1thbmd1bGFyeC1xcmNvZGVdIGxldmVsIGlzIGRlcHJlY2F0ZWQsIHVzZSBlcnJvckNvcnJlY3Rpb25MZXZlbC4nKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuaGlkZXRpdGxlICE9PSBmYWxzZSkge1xuICAgICAgY29uc29sZS53YXJuKCdbYW5ndWxhcngtcXJjb2RlXSBoaWRldGl0bGUgaXMgZGVwcmVjYXRlZC4nKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuc2l6ZSAhPT0gMCkge1xuICAgICAgY29uc29sZS53YXJuKCdbYW5ndWxhcngtcXJjb2RlXSBzaXplIGlzIGRlcHJlY2F0ZWQsIHVzZSBgd2lkdGhgLiBEZWZhdWx0cyB0byAxMC4nKTtcbiAgICB9XG4gICAgaWYgKHRoaXMudXNlc3ZnICE9PSBmYWxzZSkge1xuICAgICAgY29uc29sZS53YXJuKGBbYW5ndWxhcngtcXJjb2RlXSB1c2VzdmcgaXMgZGVwcmVjYXRlZCwgdXNlIFtlbGVtZW50VHlwZV09XCInaW1nJ1wiLmApO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgaWYgKGlzUGxhdGZvcm1TZXJ2ZXIodGhpcy5wbGF0Zm9ybUlkKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBpZiAoIVFSQ29kZSkge1xuICAgIC8vICAgUVJDb2RlID0gcmVxdWlyZSgncXJjb2RlJyk7XG4gICAgLy8gfVxuICAgIHRoaXMuY3JlYXRlUVJDb2RlKCk7XG4gIH1cblxuICBwdWJsaWMgbmdPbkNoYW5nZXMoKSB7XG4gICAgdGhpcy5jcmVhdGVRUkNvZGUoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBpc1ZhbGlkUXJDb2RlVGV4dCA9IChkYXRhOiBzdHJpbmcgfCBudWxsKTogYm9vbGVhbiA9PiB7XG4gICAgaWYgKHRoaXMuYWxsb3dFbXB0eVN0cmluZyA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiAhKHR5cGVvZiBkYXRhID09PSAndW5kZWZpbmVkJyB8fCBkYXRhID09PSAnJyB8fCBkYXRhID09PSAnbnVsbCcpO1xuICAgIH1cbiAgICByZXR1cm4gISh0eXBlb2YgZGF0YSA9PT0gJ3VuZGVmaW5lZCcpO1xuICB9XG5cbiAgcHJpdmF0ZSB0b0RhdGFVUkwoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlOiAoYXJnOiBhbnkpID0+IGFueSwgcmVqZWN0OiAoYXJnOiBhbnkpID0+IGFueSkgPT4ge1xuICAgICAgUVJDb2RlLnRvRGF0YVVSTCh0aGlzLnFyZGF0YSxcbiAgICAgICAge1xuICAgICAgICAgIGNvbG9yOiB7XG4gICAgICAgICAgICBkYXJrOiB0aGlzLmNvbG9yRGFyayxcbiAgICAgICAgICAgIGxpZ2h0OiB0aGlzLmNvbG9yTGlnaHRcbiAgICAgICAgICB9LFxuICAgICAgICAgIGVycm9yQ29ycmVjdGlvbkxldmVsOiB0aGlzLmVycm9yQ29ycmVjdGlvbkxldmVsLFxuICAgICAgICAgIG1hcmdpbjogdGhpcy5tYXJnaW4sXG4gICAgICAgICAgc2NhbGU6IHRoaXMuc2NhbGUsXG4gICAgICAgICAgdmVyc2lvbjogdGhpcy52ZXJzaW9uLFxuICAgICAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxuICAgICAgICB9LCAoZXJyLCB1cmwpID0+IHtcbiAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzb2x2ZSh1cmwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHRvQ2FudmFzKGNhbnZhczogRWxlbWVudCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZTogKGFyZzogYW55KSA9PiBhbnksIHJlamVjdDogKGFyZzogYW55KSA9PiBhbnkpID0+IHtcbiAgICAgIFFSQ29kZS50b0NhbnZhcyhjYW52YXMsIHRoaXMucXJkYXRhLCB7XG4gICAgICAgIGNvbG9yOiB7XG4gICAgICAgICAgZGFyazogdGhpcy5jb2xvckRhcmssXG4gICAgICAgICAgbGlnaHQ6IHRoaXMuY29sb3JMaWdodFxuICAgICAgICB9LFxuICAgICAgICBlcnJvckNvcnJlY3Rpb25MZXZlbDogdGhpcy5lcnJvckNvcnJlY3Rpb25MZXZlbCxcbiAgICAgICAgbWFyZ2luOiB0aGlzLm1hcmdpbixcbiAgICAgICAgc2NhbGU6IHRoaXMuc2NhbGUsXG4gICAgICAgIHZlcnNpb246IHRoaXMudmVyc2lvbixcbiAgICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXG4gICAgICB9LCAoZXJyb3IpID0+IHtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKCdzdWNjZXNzJyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJFbGVtZW50KGVsZW1lbnQ6IEVsZW1lbnQpIHtcbiAgICBmb3IgKGNvbnN0IG5vZGUgb2YgdGhpcy5xcmNFbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY2hpbGROb2Rlcykge1xuICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDaGlsZCh0aGlzLnFyY0VsZW1lbnQubmF0aXZlRWxlbWVudCwgbm9kZSk7XG4gICAgfVxuICAgIHRoaXMucmVuZGVyZXIuYXBwZW5kQ2hpbGQodGhpcy5xcmNFbGVtZW50Lm5hdGl2ZUVsZW1lbnQsIGVsZW1lbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVRUkNvZGUoKSB7XG5cbiAgICAvLyBTZXQgc2Vuc2l0aXZlIGRlZmF1bHRzXG4gICAgaWYgKHRoaXMudmVyc2lvbiAmJiB0aGlzLnZlcnNpb24gPiA0MCkge1xuICAgICAgY29uc29sZS53YXJuKCdbYW5ndWxhcngtcXJjb2RlXSBtYXggdmFsdWUgZm9yIGB2ZXJzaW9uYCBpcyA0MCcpO1xuICAgICAgdGhpcy52ZXJzaW9uID0gNDA7XG4gICAgfSBlbHNlIGlmICh0aGlzLnZlcnNpb24gJiYgdGhpcy52ZXJzaW9uIDwgMSkge1xuICAgICAgY29uc29sZS53YXJuKCdbYW5ndWxhcngtcXJjb2RlXWBtaW4gdmFsdWUgZm9yIGB2ZXJzaW9uYCBpcyAxJyk7XG4gICAgICB0aGlzLnZlcnNpb24gPSAxO1xuICAgIH0gZWxzZSBpZiAodGhpcy52ZXJzaW9uICE9PSB1bmRlZmluZWQgJiYgaXNOYU4odGhpcy52ZXJzaW9uKSkge1xuICAgICAgY29uc29sZS53YXJuKCdbYW5ndWxhcngtcXJjb2RlXSB2ZXJzaW9uIHNob3VsZCBiZSBhIG51bWJlciwgZGVmYXVsdGluZyB0byBhdXRvJyk7XG4gICAgICB0aGlzLnZlcnNpb24gPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGlmICghdGhpcy5pc1ZhbGlkUXJDb2RlVGV4dCh0aGlzLnFyZGF0YSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdbYW5ndWxhcngtcXJjb2RlXSBGaWVsZCBgcXJkYXRhYCBpcyBlbXB0eScpO1xuICAgICAgfVxuXG4gICAgICBsZXQgZWxlbWVudDogRWxlbWVudDtcblxuICAgICAgc3dpdGNoICh0aGlzLmVsZW1lbnRUeXBlKSB7XG4gICAgICAgIGNhc2UgJ2NhbnZhcyc6XG4gICAgICAgICAgZWxlbWVudCA9IHRoaXMucmVuZGVyZXIuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgICAgdGhpcy50b0NhbnZhcyhlbGVtZW50KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyRWxlbWVudChlbGVtZW50KTtcbiAgICAgICAgICB9KS5jYXRjaCgoZSkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignW2FuZ3VsYXJ4LXFyY29kZV0gZXJyb3I6ICcsIGUpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyBjYXNlICdzdmcnOlxuICAgICAgICAvLyAgIGJyZWFrO1xuICAgICAgICBjYXNlICd1cmwnOlxuICAgICAgICBjYXNlICdpbWcnOlxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGVsZW1lbnQgPSB0aGlzLnJlbmRlcmVyLmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgICAgICAgIHRoaXMudG9EYXRhVVJMKCkudGhlbigoZGF0YVVybDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnc3JjJywgZGF0YVVybCk7XG4gICAgICAgICAgICB0aGlzLnJlbmRlckVsZW1lbnQoZWxlbWVudCk7XG4gICAgICAgICAgfSkuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1thbmd1bGFyeC1xcmNvZGVdIGVycm9yOiAnLCBlKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1thbmd1bGFyeC1xcmNvZGVdIEVycm9yIGdlbmVyYXRpbmcgUVIgQ29kZTogJywgZS5tZXNzYWdlKTtcbiAgICB9XG5cbiAgfVxuXG59XG4iXX0=