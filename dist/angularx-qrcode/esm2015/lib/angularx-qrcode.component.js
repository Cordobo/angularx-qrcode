import { __decorate, __param } from "tslib";
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
    ViewChild('qrcElement', { static: true })
], QRCodeComponent.prototype, "qrcElement", void 0);
QRCodeComponent = __decorate([
    Component({
        selector: 'qrcode',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: `<div #qrcElement [class]="cssClass"></div>`
    }),
    __param(1, Inject(PLATFORM_ID))
], QRCodeComponent);
export { QRCodeComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhcngtcXJjb2RlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXJ4LXFyY29kZS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyeC1xcmNvZGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsYUFBYSxFQUNiLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBQ0wsU0FBUyxFQUNULFdBQVcsRUFDWCxTQUFTLEVBQ1QsU0FBUyxHQUNWLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ25ELE9BQU8sS0FBSyxNQUFNLE1BQU0sUUFBUSxDQUFDO0FBUWpDLElBQWEsZUFBZSxHQUE1QixNQUFhLGVBQWU7SUE2QjFCLFlBQ1UsUUFBbUIsRUFDVyxVQUFlO1FBRDdDLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDVyxlQUFVLEdBQVYsVUFBVSxDQUFLO1FBN0J2RCxhQUFhO1FBQ0csY0FBUyxHQUFXLEVBQUUsQ0FBQztRQUN2QixlQUFVLEdBQVcsRUFBRSxDQUFDO1FBQ3hCLFVBQUssR0FBVyxFQUFFLENBQUM7UUFDbkIsY0FBUyxHQUFZLEtBQUssQ0FBQztRQUMzQixTQUFJLEdBQVcsQ0FBQyxDQUFDO1FBQ2pCLFdBQU0sR0FBWSxLQUFLLENBQUM7UUFFeEMsd0JBQXdCO1FBQ1IscUJBQWdCLEdBQVksS0FBSyxDQUFDO1FBQ2xDLFdBQU0sR0FBVyxFQUFFLENBQUM7UUFFcEMsaUNBQWlDO1FBQ2pCLGNBQVMsR0FBVyxXQUFXLENBQUM7UUFDaEMsZUFBVSxHQUFXLFdBQVcsQ0FBQztRQUNqQyxhQUFRLEdBQVcsUUFBUSxDQUFDO1FBQzVCLGdCQUFXLEdBQW1DLFFBQVEsQ0FBQztRQUN2RCx5QkFBb0IsR0FBNEMsR0FBRyxDQUFDO1FBQ3BFLFdBQU0sR0FBVyxDQUFDLENBQUM7UUFDbkIsVUFB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WSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDO21EQUErQjtBQXpCOUQsZUFBZTtJQUwzQixTQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsUUFBUTtRQUNsQixlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtRQUMvQyxRQUFRLEVBQUUsNENBQTRDO0tBQ3ZELENBQUM7SUFnQ0csV0FBQSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUE7R0EvQlgsZUFBZSxDQWlMM0I7U0FqTFksZUFBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgUExBVEZPUk1fSUQsXG4gIFJlbmRlcmVyMixcbiAgVmlld0NoaWxkLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGlzUGxhdGZvcm1TZXJ2ZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0ICogYXMgUVJDb2RlIGZyb20gJ3FyY29kZSc7XG5pbXBvcnQgeyBRUkNvZGVFcnJvckNvcnJlY3Rpb25MZXZlbCwgUVJDb2RlVmVyc2lvbiwgUVJDb2RlRWxlbWVudFR5cGUgfSBmcm9tICcuL3R5cGVzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncXJjb2RlJyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHRlbXBsYXRlOiBgPGRpdiAjcXJjRWxlbWVudCBbY2xhc3NdPVwiY3NzQ2xhc3NcIj48L2Rpdj5gLFxufSlcbmV4cG9ydCBjbGFzcyBRUkNvZGVDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMsIEFmdGVyVmlld0luaXQge1xuXG4gIC8vIERlcHJlY2F0ZWRcbiAgQElucHV0KCkgcHVibGljIGNvbG9yZGFyazogc3RyaW5nID0gJyc7XG4gIEBJbnB1dCgpIHB1YmxpYyBjb2xvcmxpZ2h0OiBzdHJpbmcgPSAnJztcbiAgQElucHV0KCkgcHVibGljIGxldmVsOiBzdHJpbmcgPSAnJztcbiAgQElucHV0KCkgcHVibGljIGhpZGV0aXRsZTogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKSBwdWJsaWMgc2l6ZTogbnVtYmVyID0gMDtcbiAgQElucHV0KCkgcHVibGljIHVzZXN2ZzogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8vIFZhbGlkIGZvciAxLnggYW5kIDIueFxuICBASW5wdXQoKSBwdWJsaWMgYWxsb3dFbXB0eVN0cmluZzogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKSBwdWJsaWMgcXJkYXRhOiBzdHJpbmcgPSAnJztcblxuICAvLyBOZXcgZmllbGRzIGludHJvZHVjZWQgaW4gMi4wLjBcbiAgQElucHV0KCkgcHVibGljIGNvbG9yRGFyazogc3RyaW5nID0gJyMwMDAwMDBmZic7XG4gIEBJbnB1dCgpIHB1YmxpYyBjb2xvckxpZ2h0OiBzdHJpbmcgPSAnI2ZmZmZmZmZmJztcbiAgQElucHV0KCkgcHVibGljIGNzc0NsYXNzOiBzdHJpbmcgPSAncXJjb2RlJztcbiAgQElucHV0KCkgcHVibGljIGVsZW1lbnRUeXBlOiBrZXlvZiB0eXBlb2YgUVJDb2RlRWxlbWVudFR5cGUgPSAnY2FudmFzJztcbiAgQElucHV0KCkgcHVibGljIGVycm9yQ29ycmVjdGlvbkxldmVsOiBrZXlvZiB0eXBlb2YgUVJDb2RlRXJyb3JDb3JyZWN0aW9uTGV2ZWwgPSAnTSc7XG4gIEBJbnB1dCgpIHB1YmxpYyBtYXJnaW46IG51bWJlciA9IDQ7XG4gIEBJbnB1dCgpIHB1YmxpYyBzY2FsZTogbnVtYmVyID0gNDtcbiAgQElucHV0KCkgcHVibGljIHZlcnNpb246IFFSQ29kZVZlcnNpb247XG4gIEBJbnB1dCgpIHB1YmxpYyB3aWR0aDogbnVtYmVyID0gMTA7XG5cbiAgQFZpZXdDaGlsZCgncXJjRWxlbWVudCcsIHsgc3RhdGljOiB0cnVlIH0pIHB1YmxpYyBxcmNFbGVtZW50OiBFbGVtZW50UmVmO1xuXG4gIHB1YmxpYyBxcmNvZGU6IGFueSA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIEBJbmplY3QoUExBVEZPUk1fSUQpIHByaXZhdGUgcmVhZG9ubHkgcGxhdGZvcm1JZDogYW55LFxuICApIHtcbiAgICAvLyBEZXByZWN0YXRpb24gd2FybmluZ3NcbiAgICBpZiAodGhpcy5jb2xvcmRhcmsgIT09ICcnKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1thbmd1bGFyeC1xcmNvZGVdIGNvbG9yZGFyayBpcyBkZXByZWNhdGVkLCB1c2UgY29sb3JEYXJrLicpO1xuICAgIH1cbiAgICBpZiAodGhpcy5jb2xvcmxpZ2h0ICE9PSAnJykge1xuICAgICAgY29uc29sZS53YXJuKCdbYW5ndWxhcngtcXJjb2RlXSBjb2xvcmxpZ2h0IGlzIGRlcHJlY2F0ZWQsIHVzZSBjb2xvckxpZ2h0LicpO1xuICAgIH1cbiAgICBpZiAodGhpcy5sZXZlbCAhPT0gJycpIHtcbiAgICAgIGNvbnNvbGUud2FybignW2FuZ3VsYXJ4LXFyY29kZV0gbGV2ZWwgaXMgZGVwcmVjYXRlZCwgdXNlIGVycm9yQ29ycmVjdGlvbkxldmVsLicpO1xuICAgIH1cbiAgICBpZiAodGhpcy5oaWRldGl0bGUgIT09IGZhbHNlKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1thbmd1bGFyeC1xcmNvZGVdIGhpZGV0aXRsZSBpcyBkZXByZWNhdGVkLicpO1xuICAgIH1cbiAgICBpZiAodGhpcy5zaXplICE9PSAwKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1thbmd1bGFyeC1xcmNvZGVdIHNpemUgaXMgZGVwcmVjYXRlZCwgdXNlIGB3aWR0aGAuIERlZmF1bHRzIHRvIDEwLicpO1xuICAgIH1cbiAgICBpZiAodGhpcy51c2VzdmcgIT09IGZhbHNlKSB7XG4gICAgICBjb25zb2xlLndhcm4oYFthbmd1bGFyeC1xcmNvZGVdIHVzZXN2ZyBpcyBkZXByZWNhdGVkLCB1c2UgW2VsZW1lbnRUeXBlXT1cIidpbWcnXCIuYCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBpZiAoaXNQbGF0Zm9ybVNlcnZlcih0aGlzLnBsYXRmb3JtSWQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIGlmICghUVJDb2RlKSB7XG4gICAgLy8gICBRUkNvZGUgPSByZXF1aXJlKCdxcmNvZGUnKTtcbiAgICAvLyB9XG4gICAgdGhpcy5jcmVhdGVRUkNvZGUoKTtcbiAgfVxuXG4gIHB1YmxpYyBuZ09uQ2hhbmdlcygpIHtcbiAgICB0aGlzLmNyZWF0ZVFSQ29kZSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGlzVmFsaWRRckNvZGVUZXh0ID0gKGRhdGE6IHN0cmluZyB8IG51bGwpOiBib29sZWFuID0+IHtcbiAgICBpZiAodGhpcy5hbGxvd0VtcHR5U3RyaW5nID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuICEodHlwZW9mIGRhdGEgPT09ICd1bmRlZmluZWQnIHx8IGRhdGEgPT09ICcnIHx8IGRhdGEgPT09ICdudWxsJyk7XG4gICAgfVxuICAgIHJldHVybiAhKHR5cGVvZiBkYXRhID09PSAndW5kZWZpbmVkJyk7XG4gIH1cblxuICBwcml2YXRlIHRvRGF0YVVSTCgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmU6IChhcmc6IGFueSkgPT4gYW55LCByZWplY3Q6IChhcmc6IGFueSkgPT4gYW55KSA9PiB7XG4gICAgICBRUkNvZGUudG9EYXRhVVJMKHRoaXMucXJkYXRhLFxuICAgICAgICB7XG4gICAgICAgICAgY29sb3I6IHtcbiAgICAgICAgICAgIGRhcms6IHRoaXMuY29sb3JEYXJrLFxuICAgICAgICAgICAgbGlnaHQ6IHRoaXMuY29sb3JMaWdodFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZXJyb3JDb3JyZWN0aW9uTGV2ZWw6IHRoaXMuZXJyb3JDb3JyZWN0aW9uTGV2ZWwsXG4gICAgICAgICAgbWFyZ2luOiB0aGlzLm1hcmdpbixcbiAgICAgICAgICBzY2FsZTogdGhpcy5zY2FsZSxcbiAgICAgICAgICB2ZXJzaW9uOiB0aGlzLnZlcnNpb24sXG4gICAgICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXG4gICAgICAgIH0sIChlcnIsIHVybCkgPT4ge1xuICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXNvbHZlKHVybCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgdG9DYW52YXMoY2FudmFzOiBFbGVtZW50KSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlOiAoYXJnOiBhbnkpID0+IGFueSwgcmVqZWN0OiAoYXJnOiBhbnkpID0+IGFueSkgPT4ge1xuICAgICAgUVJDb2RlLnRvQ2FudmFzKGNhbnZhcywgdGhpcy5xcmRhdGEsIHtcbiAgICAgICAgY29sb3I6IHtcbiAgICAgICAgICBkYXJrOiB0aGlzLmNvbG9yRGFyayxcbiAgICAgICAgICBsaWdodDogdGhpcy5jb2xvckxpZ2h0XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yQ29ycmVjdGlvbkxldmVsOiB0aGlzLmVycm9yQ29ycmVjdGlvbkxldmVsLFxuICAgICAgICBtYXJnaW46IHRoaXMubWFyZ2luLFxuICAgICAgICBzY2FsZTogdGhpcy5zY2FsZSxcbiAgICAgICAgdmVyc2lvbjogdGhpcy52ZXJzaW9uLFxuICAgICAgICB3aWR0aDogdGhpcy53aWR0aCxcbiAgICAgIH0sIChlcnJvcikgPT4ge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc29sdmUoJ3N1Y2Nlc3MnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlckVsZW1lbnQoZWxlbWVudDogRWxlbWVudCkge1xuICAgIGZvciAoY29uc3Qgbm9kZSBvZiB0aGlzLnFyY0VsZW1lbnQubmF0aXZlRWxlbWVudC5jaGlsZE5vZGVzKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNoaWxkKHRoaXMucXJjRWxlbWVudC5uYXRpdmVFbGVtZW50LCBub2RlKTtcbiAgICB9XG4gICAgdGhpcy5yZW5kZXJlci5hcHBlbmRDaGlsZCh0aGlzLnFyY0VsZW1lbnQubmF0aXZlRWxlbWVudCwgZWxlbWVudCk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZVFSQ29kZSgpIHtcblxuICAgIC8vIFNldCBzZW5zaXRpdmUgZGVmYXVsdHNcbiAgICBpZiAodGhpcy52ZXJzaW9uICYmIHRoaXMudmVyc2lvbiA+IDQwKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1thbmd1bGFyeC1xcmNvZGVdIG1heCB2YWx1ZSBmb3IgYHZlcnNpb25gIGlzIDQwJyk7XG4gICAgICB0aGlzLnZlcnNpb24gPSA0MDtcbiAgICB9IGVsc2UgaWYgKHRoaXMudmVyc2lvbiAmJiB0aGlzLnZlcnNpb24gPCAxKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1thbmd1bGFyeC1xcmNvZGVdYG1pbiB2YWx1ZSBmb3IgYHZlcnNpb25gIGlzIDEnKTtcbiAgICAgIHRoaXMudmVyc2lvbiA9IDE7XG4gICAgfSBlbHNlIGlmICh0aGlzLnZlcnNpb24gIT09IHVuZGVmaW5lZCAmJiBpc05hTih0aGlzLnZlcnNpb24pKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1thbmd1bGFyeC1xcmNvZGVdIHZlcnNpb24gc2hvdWxkIGJlIGEgbnVtYmVyLCBkZWZhdWx0aW5nIHRvIGF1dG8nKTtcbiAgICAgIHRoaXMudmVyc2lvbiA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgaWYgKCF0aGlzLmlzVmFsaWRRckNvZGVUZXh0KHRoaXMucXJkYXRhKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1thbmd1bGFyeC1xcmNvZGVdIEZpZWxkIGBxcmRhdGFgIGlzIGVtcHR5Jyk7XG4gICAgICB9XG5cbiAgICAgIGxldCBlbGVtZW50OiBFbGVtZW50O1xuXG4gICAgICBzd2l0Y2ggKHRoaXMuZWxlbWVudFR5cGUpIHtcbiAgICAgICAgY2FzZSAnY2FudmFzJzpcbiAgICAgICAgICBlbGVtZW50ID0gdGhpcy5yZW5kZXJlci5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgICAgICB0aGlzLnRvQ2FudmFzKGVsZW1lbnQpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJFbGVtZW50KGVsZW1lbnQpO1xuICAgICAgICAgIH0pLmNhdGNoKChlKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdbYW5ndWxhcngtcXJjb2RlXSBlcnJvcjogJywgZSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vIGNhc2UgJ3N2Zyc6XG4gICAgICAgIC8vICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3VybCc6XG4gICAgICAgIGNhc2UgJ2ltZyc6XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgZWxlbWVudCA9IHRoaXMucmVuZGVyZXIuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgICAgICAgdGhpcy50b0RhdGFVUkwoKS50aGVuKChkYXRhVXJsOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdzcmMnLCBkYXRhVXJsKTtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyRWxlbWVudChlbGVtZW50KTtcbiAgICAgICAgICB9KS5jYXRjaCgoZSkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignW2FuZ3VsYXJ4LXFyY29kZV0gZXJyb3I6ICcsIGUpO1xuICAgICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5lcnJvcignW2FuZ3VsYXJ4LXFyY29kZV0gRXJyb3IgZ2VuZXJhdGluZyBRUiBDb2RlOiAnLCBlLm1lc3NhZ2UpO1xuICAgIH1cblxuICB9XG5cbn1cbiJdfQ==