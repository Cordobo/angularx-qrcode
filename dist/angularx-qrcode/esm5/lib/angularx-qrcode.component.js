import { __decorate, __param, __values } from "tslib";
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
        // Introduced in 13.0.4, backported to 2.3.6
        this.alt = null;
        this.ariaLabel = null;
        this.title = null;
        this.qrcode = null;
        this.isValidQrCodeText = function (data) {
            if (_this.allowEmptyString === false) {
                return !(typeof data === 'undefined' ||
                    data === '' ||
                    data === 'null' ||
                    data === null);
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
            QRCode.toCanvas(canvas, _this.qrdata, {
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
                    resolve('success');
                }
            });
        });
    };
    QRCodeComponent.prototype.toSVG = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            QRCode.toString(_this.qrdata, {
                color: {
                    dark: _this.colorDark,
                    light: _this.colorLight,
                },
                errorCorrectionLevel: _this.errorCorrectionLevel,
                margin: _this.margin,
                scale: _this.scale,
                type: 'svg',
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
                    this.toCanvas(element_1)
                        .then(function () {
                        if (_this.ariaLabel) {
                            _this.renderer.setAttribute(element_1, 'aria-label', "" + _this.ariaLabel);
                        }
                        if (_this.title) {
                            _this.renderer.setAttribute(element_1, 'title', "" + _this.title);
                        }
                        _this.renderElement(element_1);
                    })
                        .catch(function (e) {
                        console.error('[angularx-qrcode] canvas error: ', e);
                    });
                    break;
                case 'svg':
                    element_1 = this.renderer.createElement('svg', 'svg');
                    this.toSVG()
                        .then(function (svgString) {
                        element_1.innerHTML = svgString;
                        _this.renderer.setAttribute(element_1, 'height', "" + _this.width);
                        _this.renderer.setAttribute(element_1, 'width', "" + _this.width);
                        _this.renderElement(element_1);
                    })
                        .catch(function (e) {
                        console.error('[angularx-qrcode] svg error: ', e);
                    });
                    break;
                case 'url':
                case 'img':
                default:
                    element_1 = this.renderer.createElement('img');
                    this.toDataURL()
                        .then(function (dataUrl) {
                        if (_this.alt) {
                            element_1.setAttribute('alt', _this.alt);
                        }
                        if (_this.ariaLabel) {
                            element_1.setAttribute('aria-label', _this.ariaLabel);
                        }
                        element_1.setAttribute('src', dataUrl);
                        if (_this.title) {
                            element_1.setAttribute('title', _this.title);
                        }
                        _this.renderElement(element_1);
                    })
                        .catch(function (e) {
                        console.error('[angularx-qrcode] img/url error: ', e);
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
        Input()
    ], QRCodeComponent.prototype, "alt", void 0);
    __decorate([
        Input()
    ], QRCodeComponent.prototype, "ariaLabel", void 0);
    __decorate([
        Input()
    ], QRCodeComponent.prototype, "title", void 0);
    __decorate([
        ViewChild('qrcElement', { static: true })
    ], QRCodeComponent.prototype, "qrcElement", void 0);
    QRCodeComponent = __decorate([
        Component({
            selector: 'qrcode',
            changeDetection: ChangeDetectionStrategy.OnPush,
            template: "<div #qrcElement [class]=\"cssClass\"></div>"
        }),
        __param(1, Inject(PLATFORM_ID))
    ], QRCodeComponent);
    return QRCodeComponent;
}());
export { QRCodeComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhcngtcXJjb2RlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXJ4LXFyY29kZS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyeC1xcmNvZGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsYUFBYSxFQUNiLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBQ0wsU0FBUyxFQUNULFdBQVcsRUFDWCxTQUFTLEVBQ1QsU0FBUyxHQUNWLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ25ELE9BQU8sS0FBSyxNQUFNLE1BQU0sUUFBUSxDQUFDO0FBWWpDO0lBa0NFLHlCQUNVLFFBQW1CLEVBQ1csVUFBZTtRQUZ2RCxpQkErQkM7UUE5QlMsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUNXLGVBQVUsR0FBVixVQUFVLENBQUs7UUFuQ3ZELGFBQWE7UUFDRyxjQUFTLEdBQVcsRUFBRSxDQUFDO1FBQ3ZCLGVBQVUsR0FBVyxFQUFFLENBQUM7UUFDeEIsVUFBSyxHQUFXLEVBQUUsQ0FBQztRQUNuQixjQUFTLEdBQVksS0FBSyxDQUFDO1FBQzNCLFNBQUksR0FBVyxDQUFDLENBQUM7UUFDakIsV0FBTSxHQUFZLEtBQUssQ0FBQztRQUV4Qyx3QkFBd0I7UUFDUixxQkFBZ0IsR0FBWSxLQUFLLENBQUM7UUFDbEMsV0FBTSxHQUFXLEVBQUUsQ0FBQztRQUVwQyxpQ0FBaUM7UUFDakIsY0FBUyxHQUFXLFdBQVcsQ0FBQztRQUNoQyxlQUFVLEdBQVcsV0FBVyxDQUFDO1FBQ2pDLGFBQVEsR0FBVyxRQUFRLENBQUM7UUFDNUIsZ0JBQVcsR0FBbUMsUUFBUSxDQUFDO1FBRWhFLHlCQUFvQixHQUE0QyxHQUFHLENBQUM7UUFDM0QsV0FBTSxHQUFXLENBQUMsQ0FBQztRQUNuQixVQUFLLEdBQVcsQ0FBQyxD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LEtBQUssRUFBRTtrREFBb0M7SUFFRDtRQUExQyxTQUFTLENBQUMsWUFBWSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDO3VEQUErQjtJQTlCOUQsZUFBZTtRQUwzQixTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsUUFBUTtZQUNsQixlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtZQUMvQyxRQUFRLEVBQUUsOENBQTRDO1NBQ3ZELENBQUM7UUFxQ0csV0FBQSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUE7T0FwQ1gsZUFBZSxDQTRRM0I7SUFBRCxzQkFBQztDQUFBLEFBNVFELElBNFFDO1NBNVFZLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIFBMQVRGT1JNX0lELFxuICBSZW5kZXJlcjIsXG4gIFZpZXdDaGlsZCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBpc1BsYXRmb3JtU2VydmVyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCAqIGFzIFFSQ29kZSBmcm9tICdxcmNvZGUnO1xuaW1wb3J0IHtcbiAgUVJDb2RlRXJyb3JDb3JyZWN0aW9uTGV2ZWwsXG4gIFFSQ29kZVZlcnNpb24sXG4gIFFSQ29kZUVsZW1lbnRUeXBlLFxufSBmcm9tICcuL3R5cGVzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncXJjb2RlJyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHRlbXBsYXRlOiBgPGRpdiAjcXJjRWxlbWVudCBbY2xhc3NdPVwiY3NzQ2xhc3NcIj48L2Rpdj5gLFxufSlcbmV4cG9ydCBjbGFzcyBRUkNvZGVDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMsIEFmdGVyVmlld0luaXQge1xuICAvLyBEZXByZWNhdGVkXG4gIEBJbnB1dCgpIHB1YmxpYyBjb2xvcmRhcms6IHN0cmluZyA9ICcnO1xuICBASW5wdXQoKSBwdWJsaWMgY29sb3JsaWdodDogc3RyaW5nID0gJyc7XG4gIEBJbnB1dCgpIHB1YmxpYyBsZXZlbDogc3RyaW5nID0gJyc7XG4gIEBJbnB1dCgpIHB1YmxpYyBoaWRldGl0bGU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KCkgcHVibGljIHNpemU6IG51bWJlciA9IDA7XG4gIEBJbnB1dCgpIHB1YmxpYyB1c2Vzdmc6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvLyBWYWxpZCBmb3IgMS54IGFuZCAyLnhcbiAgQElucHV0KCkgcHVibGljIGFsbG93RW1wdHlTdHJpbmc6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KCkgcHVibGljIHFyZGF0YTogc3RyaW5nID0gJyc7XG5cbiAgLy8gTmV3IGZpZWxkcyBpbnRyb2R1Y2VkIGluIDIuMC4wXG4gIEBJbnB1dCgpIHB1YmxpYyBjb2xvckRhcms6IHN0cmluZyA9ICcjMDAwMDAwZmYnO1xuICBASW5wdXQoKSBwdWJsaWMgY29sb3JMaWdodDogc3RyaW5nID0gJyNmZmZmZmZmZic7XG4gIEBJbnB1dCgpIHB1YmxpYyBjc3NDbGFzczogc3RyaW5nID0gJ3FyY29kZSc7XG4gIEBJbnB1dCgpIHB1YmxpYyBlbGVtZW50VHlwZToga2V5b2YgdHlwZW9mIFFSQ29kZUVsZW1lbnRUeXBlID0gJ2NhbnZhcyc7XG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBlcnJvckNvcnJlY3Rpb25MZXZlbDoga2V5b2YgdHlwZW9mIFFSQ29kZUVycm9yQ29ycmVjdGlvbkxldmVsID0gJ00nO1xuICBASW5wdXQoKSBwdWJsaWMgbWFyZ2luOiBudW1iZXIgPSA0O1xuICBASW5wdXQoKSBwdWJsaWMgc2NhbGU6IG51bWJlciA9IDQ7XG4gIEBJbnB1dCgpIHB1YmxpYyB2ZXJzaW9uOiBRUkNvZGVWZXJzaW9uO1xuICBASW5wdXQoKSBwdWJsaWMgd2lkdGg6IG51bWJlciA9IDEwO1xuXG4gIC8vIEludHJvZHVjZWQgaW4gMTMuMC40LCBiYWNrcG9ydGVkIHRvIDIuMy42XG4gIEBJbnB1dCgpIHB1YmxpYyBhbHQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBASW5wdXQoKSBwdWJsaWMgYXJpYUxhYmVsOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgQElucHV0KCkgcHVibGljIHRpdGxlOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICBAVmlld0NoaWxkKCdxcmNFbGVtZW50JywgeyBzdGF0aWM6IHRydWUgfSkgcHVibGljIHFyY0VsZW1lbnQ6IEVsZW1lbnRSZWY7XG5cbiAgcHVibGljIHFyY29kZTogYW55ID0gbnVsbDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgQEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSByZWFkb25seSBwbGF0Zm9ybUlkOiBhbnlcbiAgKSB7XG4gICAgLy8gRGVwcmVjdGF0aW9uIHdhcm5pbmdzXG4gICAgaWYgKHRoaXMuY29sb3JkYXJrICE9PSAnJykge1xuICAgICAgY29uc29sZS53YXJuKCdbYW5ndWxhcngtcXJjb2RlXSBjb2xvcmRhcmsgaXMgZGVwcmVjYXRlZCwgdXNlIGNvbG9yRGFyay4nKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuY29sb3JsaWdodCAhPT0gJycpIHtcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgJ1thbmd1bGFyeC1xcmNvZGVdIGNvbG9ybGlnaHQgaXMgZGVwcmVjYXRlZCwgdXNlIGNvbG9yTGlnaHQuJ1xuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubGV2ZWwgIT09ICcnKSB7XG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICdbYW5ndWxhcngtcXJjb2RlXSBsZXZlbCBpcyBkZXByZWNhdGVkLCB1c2UgZXJyb3JDb3JyZWN0aW9uTGV2ZWwuJ1xuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuaGlkZXRpdGxlICE9PSBmYWxzZSkge1xuICAgICAgY29uc29sZS53YXJuKCdbYW5ndWxhcngtcXJjb2RlXSBoaWRldGl0bGUgaXMgZGVwcmVjYXRlZC4nKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuc2l6ZSAhPT0gMCkge1xuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAnW2FuZ3VsYXJ4LXFyY29kZV0gc2l6ZSBpcyBkZXByZWNhdGVkLCB1c2UgYHdpZHRoYC4gRGVmYXVsdHMgdG8gMTAuJ1xuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKHRoaXMudXNlc3ZnICE9PSBmYWxzZSkge1xuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICBgW2FuZ3VsYXJ4LXFyY29kZV0gdXNlc3ZnIGlzIGRlcHJlY2F0ZWQsIHVzZSBbZWxlbWVudFR5cGVdPVwiJ2ltZydcIi5gXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgaWYgKGlzUGxhdGZvcm1TZXJ2ZXIodGhpcy5wbGF0Zm9ybUlkKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBpZiAoIVFSQ29kZSkge1xuICAgIC8vICAgUVJDb2RlID0gcmVxdWlyZSgncXJjb2RlJyk7XG4gICAgLy8gfVxuICAgIHRoaXMuY3JlYXRlUVJDb2RlKCk7XG4gIH1cblxuICBwdWJsaWMgbmdPbkNoYW5nZXMoKSB7XG4gICAgdGhpcy5jcmVhdGVRUkNvZGUoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBpc1ZhbGlkUXJDb2RlVGV4dCA9IChkYXRhOiBzdHJpbmcgfCBudWxsKTogYm9vbGVhbiA9PiB7XG4gICAgaWYgKHRoaXMuYWxsb3dFbXB0eVN0cmluZyA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiAhKFxuICAgICAgICB0eXBlb2YgZGF0YSA9PT0gJ3VuZGVmaW5lZCcgfHxcbiAgICAgICAgZGF0YSA9PT0gJycgfHxcbiAgICAgICAgZGF0YSA9PT0gJ251bGwnIHx8XG4gICAgICAgIGRhdGEgPT09IG51bGxcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiAhKHR5cGVvZiBkYXRhID09PSAndW5kZWZpbmVkJyk7XG4gIH07XG5cbiAgcHJpdmF0ZSB0b0RhdGFVUkwoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKFxuICAgICAgKHJlc29sdmU6IChhcmc6IGFueSkgPT4gYW55LCByZWplY3Q6IChhcmc6IGFueSkgPT4gYW55KSA9PiB7XG4gICAgICAgIFFSQ29kZS50b0RhdGFVUkwoXG4gICAgICAgICAgdGhpcy5xcmRhdGEsXG4gICAgICAgICAge1xuICAgICAgICAgICAgY29sb3I6IHtcbiAgICAgICAgICAgICAgZGFyazogdGhpcy5jb2xvckRhcmssXG4gICAgICAgICAgICAgIGxpZ2h0OiB0aGlzLmNvbG9yTGlnaHQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3JDb3JyZWN0aW9uTGV2ZWw6IHRoaXMuZXJyb3JDb3JyZWN0aW9uTGV2ZWwsXG4gICAgICAgICAgICBtYXJnaW46IHRoaXMubWFyZ2luLFxuICAgICAgICAgICAgc2NhbGU6IHRoaXMuc2NhbGUsXG4gICAgICAgICAgICB2ZXJzaW9uOiB0aGlzLnZlcnNpb24sXG4gICAgICAgICAgICB3aWR0aDogdGhpcy53aWR0aCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIChlcnIsIHVybCkgPT4ge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJlc29sdmUodXJsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgdG9DYW52YXMoY2FudmFzOiBFbGVtZW50KSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKFxuICAgICAgKHJlc29sdmU6IChhcmc6IGFueSkgPT4gYW55LCByZWplY3Q6IChhcmc6IGFueSkgPT4gYW55KSA9PiB7XG4gICAgICAgIFFSQ29kZS50b0NhbnZhcyhcbiAgICAgICAgICBjYW52YXMsXG4gICAgICAgICAgdGhpcy5xcmRhdGEsXG4gICAgICAgICAge1xuICAgICAgICAgICAgY29sb3I6IHtcbiAgICAgICAgICAgICAgZGFyazogdGhpcy5jb2xvckRhcmssXG4gICAgICAgICAgICAgIGxpZ2h0OiB0aGlzLmNvbG9yTGlnaHQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3JDb3JyZWN0aW9uTGV2ZWw6IHRoaXMuZXJyb3JDb3JyZWN0aW9uTGV2ZWwsXG4gICAgICAgICAgICBtYXJnaW46IHRoaXMubWFyZ2luLFxuICAgICAgICAgICAgc2NhbGU6IHRoaXMuc2NhbGUsXG4gICAgICAgICAgICB2ZXJzaW9uOiB0aGlzLnZlcnNpb24sXG4gICAgICAgICAgICB3aWR0aDogdGhpcy53aWR0aCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIChlcnJvcikgPT4ge1xuICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXNvbHZlKCdzdWNjZXNzJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfVxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIHRvU1ZHKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShcbiAgICAgIChyZXNvbHZlOiAoYXJnOiBhbnkpID0+IGFueSwgcmVqZWN0OiAoYXJnOiBhbnkpID0+IGFueSkgPT4ge1xuICAgICAgICBRUkNvZGUudG9TdHJpbmcoXG4gICAgICAgICAgdGhpcy5xcmRhdGEsXG4gICAgICAgICAge1xuICAgICAgICAgICAgY29sb3I6IHtcbiAgICAgICAgICAgICAgZGFyazogdGhpcy5jb2xvckRhcmssXG4gICAgICAgICAgICAgIGxpZ2h0OiB0aGlzLmNvbG9yTGlnaHQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3JDb3JyZWN0aW9uTGV2ZWw6IHRoaXMuZXJyb3JDb3JyZWN0aW9uTGV2ZWwsXG4gICAgICAgICAgICBtYXJnaW46IHRoaXMubWFyZ2luLFxuICAgICAgICAgICAgc2NhbGU6IHRoaXMuc2NhbGUsXG4gICAgICAgICAgICB0eXBlOiAnc3ZnJyxcbiAgICAgICAgICAgIHZlcnNpb246IHRoaXMudmVyc2lvbixcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgKGVyciwgdXJsKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVzb2x2ZSh1cmwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJFbGVtZW50KGVsZW1lbnQ6IEVsZW1lbnQpIHtcbiAgICBmb3IgKGNvbnN0IG5vZGUgb2YgdGhpcy5xcmNFbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY2hpbGROb2Rlcykge1xuICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDaGlsZCh0aGlzLnFyY0VsZW1lbnQubmF0aXZlRWxlbWVudCwgbm9kZSk7XG4gICAgfVxuICAgIHRoaXMucmVuZGVyZXIuYXBwZW5kQ2hpbGQodGhpcy5xcmNFbGVtZW50Lm5hdGl2ZUVsZW1lbnQsIGVsZW1lbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVRUkNvZGUoKSB7XG4gICAgLy8gU2V0IHNlbnNpdGl2ZSBkZWZhdWx0c1xuICAgIGlmICh0aGlzLnZlcnNpb24gJiYgdGhpcy52ZXJzaW9uID4gNDApIHtcbiAgICAgIGNvbnNvbGUud2FybignW2FuZ3VsYXJ4LXFyY29kZV0gbWF4IHZhbHVlIGZvciBgdmVyc2lvbmAgaXMgNDAnKTtcbiAgICAgIHRoaXMudmVyc2lvbiA9IDQwO1xuICAgIH0gZWxzZSBpZiAodGhpcy52ZXJzaW9uICYmIHRoaXMudmVyc2lvbiA8IDEpIHtcbiAgICAgIGNvbnNvbGUud2FybignW2FuZ3VsYXJ4LXFyY29kZV1gbWluIHZhbHVlIGZvciBgdmVyc2lvbmAgaXMgMScpO1xuICAgICAgdGhpcy52ZXJzaW9uID0gMTtcbiAgICB9IGVsc2UgaWYgKHRoaXMudmVyc2lvbiAhPT0gdW5kZWZpbmVkICYmIGlzTmFOKHRoaXMudmVyc2lvbikpIHtcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgJ1thbmd1bGFyeC1xcmNvZGVdIHZlcnNpb24gc2hvdWxkIGJlIGEgbnVtYmVyLCBkZWZhdWx0aW5nIHRvIGF1dG8nXG4gICAgICApO1xuICAgICAgdGhpcy52ZXJzaW9uID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBpZiAoIXRoaXMuaXNWYWxpZFFyQ29kZVRleHQodGhpcy5xcmRhdGEpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignW2FuZ3VsYXJ4LXFyY29kZV0gRmllbGQgYHFyZGF0YWAgaXMgZW1wdHknKTtcbiAgICAgIH1cblxuICAgICAgbGV0IGVsZW1lbnQ6IEVsZW1lbnQ7XG5cbiAgICAgIHN3aXRjaCAodGhpcy5lbGVtZW50VHlwZSkge1xuICAgICAgICBjYXNlICdjYW52YXMnOlxuICAgICAgICAgIGVsZW1lbnQgPSB0aGlzLnJlbmRlcmVyLmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgICAgIHRoaXMudG9DYW52YXMoZWxlbWVudClcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgaWYgKHRoaXMuYXJpYUxhYmVsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgICAgICAgICAgJ2FyaWEtbGFiZWwnLFxuICAgICAgICAgICAgICAgICAgYCR7dGhpcy5hcmlhTGFiZWx9YFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKHRoaXMudGl0bGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEF0dHJpYnV0ZShlbGVtZW50LCAndGl0bGUnLCBgJHt0aGlzLnRpdGxlfWApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyRWxlbWVudChlbGVtZW50KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignW2FuZ3VsYXJ4LXFyY29kZV0gY2FudmFzIGVycm9yOiAnLCBlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdzdmcnOlxuICAgICAgICAgIGVsZW1lbnQgPSB0aGlzLnJlbmRlcmVyLmNyZWF0ZUVsZW1lbnQoJ3N2ZycsICdzdmcnKTtcbiAgICAgICAgICB0aGlzLnRvU1ZHKClcbiAgICAgICAgICAgIC50aGVuKChzdmdTdHJpbmc6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgICBlbGVtZW50LmlubmVySFRNTCA9IHN2Z1N0cmluZztcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUoZWxlbWVudCwgJ2hlaWdodCcsIGAke3RoaXMud2lkdGh9YCk7XG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKGVsZW1lbnQsICd3aWR0aCcsIGAke3RoaXMud2lkdGh9YCk7XG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyRWxlbWVudChlbGVtZW50KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignW2FuZ3VsYXJ4LXFyY29kZV0gc3ZnIGVycm9yOiAnLCBlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd1cmwnOlxuICAgICAgICBjYXNlICdpbWcnOlxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGVsZW1lbnQgPSB0aGlzLnJlbmRlcmVyLmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgICAgICAgIHRoaXMudG9EYXRhVVJMKClcbiAgICAgICAgICAgIC50aGVuKChkYXRhVXJsOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgaWYgKHRoaXMuYWx0KSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FsdCcsIHRoaXMuYWx0KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAodGhpcy5hcmlhTGFiZWwpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIHRoaXMuYXJpYUxhYmVsKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnc3JjJywgZGF0YVVybCk7XG4gICAgICAgICAgICAgIGlmICh0aGlzLnRpdGxlKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3RpdGxlJywgdGhpcy50aXRsZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJFbGVtZW50KGVsZW1lbnQpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCgoZSkgPT4ge1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdbYW5ndWxhcngtcXJjb2RlXSBpbWcvdXJsIGVycm9yOiAnLCBlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1thbmd1bGFyeC1xcmNvZGVdIEVycm9yIGdlbmVyYXRpbmcgUVIgQ29kZTogJywgZS5tZXNzYWdlKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==