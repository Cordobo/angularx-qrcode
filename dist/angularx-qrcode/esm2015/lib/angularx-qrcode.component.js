import * as tslib_1 from "tslib";
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Inject, Input, OnChanges, PLATFORM_ID, Renderer2, ViewChild, } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import * as QRCode from 'qrcode';
let QRCodeComponent = class QRCodeComponent {
    constructor(renderer, platformId) {
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
        this.isValidQrCodeText = (data) => {
            if (this.allowEmptyString === false) {
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
            QRCode.toDataURL(this.qrdata, {
                color: {
                    dark: this.colorDark,
                    light: this.colorLight
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
            QRCode.toCanvas(canvas, this.qrdata, {
                color: {
                    dark: this.colorDark,
                    light: this.colorLight
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
            console.warn('[angularx-qrcode] version should be a number, defaulting to auto');
            this.version = undefined;
        }
        try {
            if (!this.isValidQrCodeText(this.qrdata)) {
                throw new Error('[angularx-qrcode] Field `qrdata` is empty');
            }
            let element;
            switch (this.elementType) {
                case 'canvas':
                    element = this.renderer.createElement('canvas');
                    this.toCanvas(element).then(() => {
                        this.renderElement(element);
                    }).catch((e) => {
                        console.error('[angularx-qrcode] error: ', e);
                    });
                    break;
                // case 'svg':
                //   break;
                case 'url':
                case 'img':
                default:
                    element = this.renderer.createElement('img');
                    this.toDataURL().then((dataUrl) => {
                        element.setAttribute('src', dataUrl);
                        this.renderElement(element);
                    }).catch((e) => {
                        console.error('[angularx-qrcode] error: ', e);
                    });
            }
        }
        catch (e) {
            console.error('[angularx-qrcode] Error generating QR Code: ', e.message);
        }
    }
};
QRCodeComponent.ctorParameters = () => [
    { type: Renderer2 },
    { type: undefined, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] }
];
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
        template: `<div #qrcElement [class]="cssClass"></div>`
    }),
    tslib_1.__param(1, Inject(PLATFORM_ID))
], QRCodeComponent);
export { QRCodeComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhcngtcXJjb2RlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXJ4LXFyY29kZS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyeC1xcmNvZGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsYUFBYSxFQUNiLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBQ0wsU0FBUyxFQUNULFdBQVcsRUFDWCxTQUFTLEVBQ1QsU0FBUyxHQUNWLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ25ELE9BQU8sS0FBSyxNQUFNLE1BQU0sUUFBUSxDQUFDO0FBUWpDLElBQWEsZUFBZSxHQUE1QixNQUFhLGVBQWU7SUE2QjFCLFlBQ1UsUUFBbUIsRUFDVyxVQUFlO1FBRDdDLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDVyxlQUFVLEdBQVYsVUFBVSxDQUFLO1FBN0J2RCxhQUFhO1FBQ0csY0FBUyxHQUFXLEVBQUUsQ0FBQztRQUN2QixlQUFVLEdBQVcsRUFBRSxDQUFDO1FBQ3hCLFVBQUssR0FBVyxFQUFFLENBQUM7UUFDbkIsY0FBUyxHQUFZLEtBQUssQ0FBQztRQUMzQixTQUFJLEdBQVcsQ0FBQyxDQUFDO1FBQ2pCLFdBQU0sR0FBWSxLQUFLLENBQUM7UUFFeEMsd0JBQXdCO1FBQ1IscUJBQWdCLEdBQVksS0FBSyxDQUFDO1FBQ2xDLFdBQU0sR0FBVyxFQUFFLENBQUM7UUFFcEMsaUNBQWlDO1FBQ2pCLGNBQVMsR0FBVyxXQUFXLENBQUM7UUFDaEMsZUFBVSxHQUFXLFdBQVcsQ0FBQztRQUNqQyxhQUFRLEdBQVcsUUFBUSxDQUFDO1FBQzVCLGdCQUFXLEdBQW1DLFFBQVEsQ0FBQztRQUN2RCx5QkFBb0IsR0FBNEMsR0FBRyxDQUFDO1FBQ3BFLFdBQU0sR0FBVyxDQUFDLENBQUM7UUFDbkIsVUFB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WSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDO21EQUErQjtBQXpCOUQsZUFBZTtJQUwzQixTQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsUUFBUTtRQUNsQixlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtRQUMvQyxRQUFRLEVBQUUsNENBQTRDO0tBQ3ZELENBQUM7SUFnQ0csbUJBQUEsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFBO0dBL0JYLGVBQWUsQ0FpTDNCO1NBakxZLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIFBMQVRGT1JNX0lELFxuICBSZW5kZXJlcjIsXG4gIFZpZXdDaGlsZCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBpc1BsYXRmb3JtU2VydmVyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCAqIGFzIFFSQ29kZSBmcm9tICdxcmNvZGUnO1xuaW1wb3J0IHsgUVJDb2RlRXJyb3JDb3JyZWN0aW9uTGV2ZWwsIFFSQ29kZVZlcnNpb24sIFFSQ29kZUVsZW1lbnRUeXBlIH0gZnJvbSAnLi90eXBlcyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3FyY29kZScsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICB0ZW1wbGF0ZTogYDxkaXYgI3FyY0VsZW1lbnQgW2NsYXNzXT1cImNzc0NsYXNzXCI+PC9kaXY+YCxcbn0pXG5leHBvcnQgY2xhc3MgUVJDb2RlQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzLCBBZnRlclZpZXdJbml0IHtcblxuICAvLyBEZXByZWNhdGVkXG4gIEBJbnB1dCgpIHB1YmxpYyBjb2xvcmRhcms6IHN0cmluZyA9ICcnO1xuICBASW5wdXQoKSBwdWJsaWMgY29sb3JsaWdodDogc3RyaW5nID0gJyc7XG4gIEBJbnB1dCgpIHB1YmxpYyBsZXZlbDogc3RyaW5nID0gJyc7XG4gIEBJbnB1dCgpIHB1YmxpYyBoaWRldGl0bGU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KCkgcHVibGljIHNpemU6IG51bWJlciA9IDA7XG4gIEBJbnB1dCgpIHB1YmxpYyB1c2Vzdmc6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvLyBWYWxpZCBmb3IgMS54IGFuZCAyLnhcbiAgQElucHV0KCkgcHVibGljIGFsbG93RW1wdHlTdHJpbmc6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KCkgcHVibGljIHFyZGF0YTogc3RyaW5nID0gJyc7XG5cbiAgLy8gTmV3IGZpZWxkcyBpbnRyb2R1Y2VkIGluIDIuMC4wXG4gIEBJbnB1dCgpIHB1YmxpYyBjb2xvckRhcms6IHN0cmluZyA9ICcjMDAwMDAwZmYnO1xuICBASW5wdXQoKSBwdWJsaWMgY29sb3JMaWdodDogc3RyaW5nID0gJyNmZmZmZmZmZic7XG4gIEBJbnB1dCgpIHB1YmxpYyBjc3NDbGFzczogc3RyaW5nID0gJ3FyY29kZSc7XG4gIEBJbnB1dCgpIHB1YmxpYyBlbGVtZW50VHlwZToga2V5b2YgdHlwZW9mIFFSQ29kZUVsZW1lbnRUeXBlID0gJ2NhbnZhcyc7XG4gIEBJbnB1dCgpIHB1YmxpYyBlcnJvckNvcnJlY3Rpb25MZXZlbDoga2V5b2YgdHlwZW9mIFFSQ29kZUVycm9yQ29ycmVjdGlvbkxldmVsID0gJ00nO1xuICBASW5wdXQoKSBwdWJsaWMgbWFyZ2luOiBudW1iZXIgPSA0O1xuICBASW5wdXQoKSBwdWJsaWMgc2NhbGU6IG51bWJlciA9IDQ7XG4gIEBJbnB1dCgpIHB1YmxpYyB2ZXJzaW9uOiBRUkNvZGVWZXJzaW9uO1xuICBASW5wdXQoKSBwdWJsaWMgd2lkdGg6IG51bWJlciA9IDEwO1xuXG4gIEBWaWV3Q2hpbGQoJ3FyY0VsZW1lbnQnLCB7IHN0YXRpYzogdHJ1ZSB9KSBwdWJsaWMgcXJjRWxlbWVudDogRWxlbWVudFJlZjtcblxuICBwdWJsaWMgcXJjb2RlOiBhbnkgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBASW5qZWN0KFBMQVRGT1JNX0lEKSBwcml2YXRlIHJlYWRvbmx5IHBsYXRmb3JtSWQ6IGFueSxcbiAgKSB7XG4gICAgLy8gRGVwcmVjdGF0aW9uIHdhcm5pbmdzXG4gICAgaWYgKHRoaXMuY29sb3JkYXJrICE9PSAnJykge1xuICAgICAgY29uc29sZS53YXJuKCdbYW5ndWxhcngtcXJjb2RlXSBjb2xvcmRhcmsgaXMgZGVwcmVjYXRlZCwgdXNlIGNvbG9yRGFyay4nKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuY29sb3JsaWdodCAhPT0gJycpIHtcbiAgICAgIGNvbnNvbGUud2FybignW2FuZ3VsYXJ4LXFyY29kZV0gY29sb3JsaWdodCBpcyBkZXByZWNhdGVkLCB1c2UgY29sb3JMaWdodC4nKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubGV2ZWwgIT09ICcnKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1thbmd1bGFyeC1xcmNvZGVdIGxldmVsIGlzIGRlcHJlY2F0ZWQsIHVzZSBlcnJvckNvcnJlY3Rpb25MZXZlbC4nKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuaGlkZXRpdGxlICE9PSBmYWxzZSkge1xuICAgICAgY29uc29sZS53YXJuKCdbYW5ndWxhcngtcXJjb2RlXSBoaWRldGl0bGUgaXMgZGVwcmVjYXRlZC4nKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuc2l6ZSAhPT0gMCkge1xuICAgICAgY29uc29sZS53YXJuKCdbYW5ndWxhcngtcXJjb2RlXSBzaXplIGlzIGRlcHJlY2F0ZWQsIHVzZSBgd2lkdGhgLiBEZWZhdWx0cyB0byAxMC4nKTtcbiAgICB9XG4gICAgaWYgKHRoaXMudXNlc3ZnICE9PSBmYWxzZSkge1xuICAgICAgY29uc29sZS53YXJuKGBbYW5ndWxhcngtcXJjb2RlXSB1c2VzdmcgaXMgZGVwcmVjYXRlZCwgdXNlIFtlbGVtZW50VHlwZV09XCInaW1nJ1wiLmApO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgaWYgKGlzUGxhdGZvcm1TZXJ2ZXIodGhpcy5wbGF0Zm9ybUlkKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBpZiAoIVFSQ29kZSkge1xuICAgIC8vICAgUVJDb2RlID0gcmVxdWlyZSgncXJjb2RlJyk7XG4gICAgLy8gfVxuICAgIHRoaXMuY3JlYXRlUVJDb2RlKCk7XG4gIH1cblxuICBwdWJsaWMgbmdPbkNoYW5nZXMoKSB7XG4gICAgdGhpcy5jcmVhdGVRUkNvZGUoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBpc1ZhbGlkUXJDb2RlVGV4dCA9IChkYXRhOiBzdHJpbmcgfCBudWxsKTogYm9vbGVhbiA9PiB7XG4gICAgaWYgKHRoaXMuYWxsb3dFbXB0eVN0cmluZyA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiAhKHR5cGVvZiBkYXRhID09PSAndW5kZWZpbmVkJyB8fCBkYXRhID09PSAnJyB8fCBkYXRhID09PSAnbnVsbCcpO1xuICAgIH1cbiAgICByZXR1cm4gISh0eXBlb2YgZGF0YSA9PT0gJ3VuZGVmaW5lZCcpO1xuICB9XG5cbiAgcHJpdmF0ZSB0b0RhdGFVUkwoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlOiAoYXJnOiBhbnkpID0+IGFueSwgcmVqZWN0OiAoYXJnOiBhbnkpID0+IGFueSkgPT4ge1xuICAgICAgUVJDb2RlLnRvRGF0YVVSTCh0aGlzLnFyZGF0YSxcbiAgICAgICAge1xuICAgICAgICAgIGNvbG9yOiB7XG4gICAgICAgICAgICBkYXJrOiB0aGlzLmNvbG9yRGFyayxcbiAgICAgICAgICAgIGxpZ2h0OiB0aGlzLmNvbG9yTGlnaHRcbiAgICAgICAgICB9LFxuICAgICAgICAgIGVycm9yQ29ycmVjdGlvbkxldmVsOiB0aGlzLmVycm9yQ29ycmVjdGlvbkxldmVsLFxuICAgICAgICAgIG1hcmdpbjogdGhpcy5tYXJnaW4sXG4gICAgICAgICAgc2NhbGU6IHRoaXMuc2NhbGUsXG4gICAgICAgICAgdmVyc2lvbjogdGhpcy52ZXJzaW9uLFxuICAgICAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxuICAgICAgICB9LCAoZXJyLCB1cmwpID0+IHtcbiAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzb2x2ZSh1cmwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHRvQ2FudmFzKGNhbnZhczogRWxlbWVudCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZTogKGFyZzogYW55KSA9PiBhbnksIHJlamVjdDogKGFyZzogYW55KSA9PiBhbnkpID0+IHtcbiAgICAgIFFSQ29kZS50b0NhbnZhcyhjYW52YXMsIHRoaXMucXJkYXRhLCB7XG4gICAgICAgIGNvbG9yOiB7XG4gICAgICAgICAgZGFyazogdGhpcy5jb2xvckRhcmssXG4gICAgICAgICAgbGlnaHQ6IHRoaXMuY29sb3JMaWdodFxuICAgICAgICB9LFxuICAgICAgICBlcnJvckNvcnJlY3Rpb25MZXZlbDogdGhpcy5lcnJvckNvcnJlY3Rpb25MZXZlbCxcbiAgICAgICAgbWFyZ2luOiB0aGlzLm1hcmdpbixcbiAgICAgICAgc2NhbGU6IHRoaXMuc2NhbGUsXG4gICAgICAgIHZlcnNpb246IHRoaXMudmVyc2lvbixcbiAgICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXG4gICAgICB9LCAoZXJyb3IpID0+IHtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKCdzdWNjZXNzJyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJFbGVtZW50KGVsZW1lbnQ6IEVsZW1lbnQpIHtcbiAgICBmb3IgKGNvbnN0IG5vZGUgb2YgdGhpcy5xcmNFbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY2hpbGROb2Rlcykge1xuICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDaGlsZCh0aGlzLnFyY0VsZW1lbnQubmF0aXZlRWxlbWVudCwgbm9kZSk7XG4gICAgfVxuICAgIHRoaXMucmVuZGVyZXIuYXBwZW5kQ2hpbGQodGhpcy5xcmNFbGVtZW50Lm5hdGl2ZUVsZW1lbnQsIGVsZW1lbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVRUkNvZGUoKSB7XG5cbiAgICAvLyBTZXQgc2Vuc2l0aXZlIGRlZmF1bHRzXG4gICAgaWYgKHRoaXMudmVyc2lvbiAmJiB0aGlzLnZlcnNpb24gPiA0MCkge1xuICAgICAgY29uc29sZS53YXJuKCdbYW5ndWxhcngtcXJjb2RlXSBtYXggdmFsdWUgZm9yIGB2ZXJzaW9uYCBpcyA0MCcpO1xuICAgICAgdGhpcy52ZXJzaW9uID0gNDA7XG4gICAgfSBlbHNlIGlmICh0aGlzLnZlcnNpb24gJiYgdGhpcy52ZXJzaW9uIDwgMSkge1xuICAgICAgY29uc29sZS53YXJuKCdbYW5ndWxhcngtcXJjb2RlXWBtaW4gdmFsdWUgZm9yIGB2ZXJzaW9uYCBpcyAxJyk7XG4gICAgICB0aGlzLnZlcnNpb24gPSAxO1xuICAgIH0gZWxzZSBpZiAodGhpcy52ZXJzaW9uICE9PSB1bmRlZmluZWQgJiYgaXNOYU4odGhpcy52ZXJzaW9uKSkge1xuICAgICAgY29uc29sZS53YXJuKCdbYW5ndWxhcngtcXJjb2RlXSB2ZXJzaW9uIHNob3VsZCBiZSBhIG51bWJlciwgZGVmYXVsdGluZyB0byBhdXRvJyk7XG4gICAgICB0aGlzLnZlcnNpb24gPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGlmICghdGhpcy5pc1ZhbGlkUXJDb2RlVGV4dCh0aGlzLnFyZGF0YSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdbYW5ndWxhcngtcXJjb2RlXSBGaWVsZCBgcXJkYXRhYCBpcyBlbXB0eScpO1xuICAgICAgfVxuXG4gICAgICBsZXQgZWxlbWVudDogRWxlbWVudDtcblxuICAgICAgc3dpdGNoICh0aGlzLmVsZW1lbnRUeXBlKSB7XG4gICAgICAgIGNhc2UgJ2NhbnZhcyc6XG4gICAgICAgICAgZWxlbWVudCA9IHRoaXMucmVuZGVyZXIuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgICAgdGhpcy50b0NhbnZhcyhlbGVtZW50KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyRWxlbWVudChlbGVtZW50KTtcbiAgICAgICAgICB9KS5jYXRjaCgoZSkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignW2FuZ3VsYXJ4LXFyY29kZV0gZXJyb3I6ICcsIGUpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyBjYXNlICdzdmcnOlxuICAgICAgICAvLyAgIGJyZWFrO1xuICAgICAgICBjYXNlICd1cmwnOlxuICAgICAgICBjYXNlICdpbWcnOlxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGVsZW1lbnQgPSB0aGlzLnJlbmRlcmVyLmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgICAgICAgIHRoaXMudG9EYXRhVVJMKCkudGhlbigoZGF0YVVybDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnc3JjJywgZGF0YVVybCk7XG4gICAgICAgICAgICB0aGlzLnJlbmRlckVsZW1lbnQoZWxlbWVudCk7XG4gICAgICAgICAgfSkuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1thbmd1bGFyeC1xcmNvZGVdIGVycm9yOiAnLCBlKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1thbmd1bGFyeC1xcmNvZGVdIEVycm9yIGdlbmVyYXRpbmcgUVIgQ29kZTogJywgZS5tZXNzYWdlKTtcbiAgICB9XG5cbiAgfVxuXG59XG4iXX0=