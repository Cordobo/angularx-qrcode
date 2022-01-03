import { ChangeDetectionStrategy, Component, Input, ViewChild, } from '@angular/core';
import * as QRCode from 'qrcode';
import * as i0 from "@angular/core";
export class QRCodeComponent {
    constructor(renderer) {
        this.renderer = renderer;
        this.allowEmptyString = false;
        this.colorDark = '#000000ff';
        this.colorLight = '#ffffffff';
        this.cssClass = 'qrcode';
        this.elementType = 'canvas';
        this.errorCorrectionLevel = 'M';
        this.margin = 4;
        this.qrdata = '';
        this.scale = 4;
        this.width = 10;
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
            QRCode.toDataURL(this.qrdata, {
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
            QRCode.toCanvas(canvas, this.qrdata, {
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
            QRCode.toString(this.qrdata, {
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
                throw new Error('[angularx-qrcode] Field `qrdata` is empty, set `allowEmptyString="true"` to overwrite this behaviour.');
            }
            // This is a fix to allow an empty string as qrdata
            if (this.isValidQrCodeText(this.qrdata) && this.qrdata === '') {
                this.qrdata = ' ';
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
                        console.error('[angularx-qrcode] canvas error:', e);
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
                        console.error('[angularx-qrcode] svg error:', e);
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
                        console.error('[angularx-qrcode] img/url error:', e);
                    });
            }
        }
        catch (e) {
            console.error('[angularx-qrcode] Error generating QR Code:', e.message);
        }
    }
}
QRCodeComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: QRCodeComponent, deps: [{ token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Component });
QRCodeComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.1.1", type: QRCodeComponent, selector: "qrcode", inputs: { allowEmptyString: "allowEmptyString", colorDark: "colorDark", colorLight: "colorLight", cssClass: "cssClass", elementType: "elementType", errorCorrectionLevel: "errorCorrectionLevel", margin: "margin", qrdata: "qrdata", scale: "scale", version: "version", width: "width" }, viewQueries: [{ propertyName: "qrcElement", first: true, predicate: ["qrcElement"], descendants: true, static: true }], usesOnChanges: true, ngImport: i0, template: `<div #qrcElement [class]="cssClass"></div>`, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: QRCodeComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'qrcode',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    template: `<div #qrcElement [class]="cssClass"></div>`,
                }]
        }], ctorParameters: function () { return [{ type: i0.Renderer2 }]; }, propDecorators: { allowEmptyString: [{
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
            }], qrdata: [{
                type: Input
            }], scale: [{
                type: Input
            }], version: [{
                type: Input
            }], width: [{
                type: Input
            }], qrcElement: [{
                type: ViewChild,
                args: ['qrcElement', { static: true }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhcngtcXJjb2RlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXJ4LXFyY29kZS9zcmMvbGliL2FuZ3VsYXJ4LXFyY29kZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBRVQsS0FBSyxFQUdMLFNBQVMsR0FDVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEtBQUssTUFBTSxNQUFNLFFBQVEsQ0FBQzs7QUFZakMsTUFBTSxPQUFPLGVBQWU7SUFnQjFCLFlBQW9CLFFBQW1CO1FBQW5CLGFBQVEsR0FBUixRQUFRLENBQVc7UUFmdkIscUJBQWdCLEdBQUcsS0FBSyxDQUFDO1FBQ3pCLGNBQVMsR0FBRyxXQUFXLENBQUM7UUFDeEIsZUFBVSxHQUFHLFdBQVcsQ0FBQztRQUN6QixhQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3BCLGdCQUFXLEdBQW1DLFFBQVEsQ0FBQztRQUVoRSx5QkFBb0IsR0FBNEMsR0FBRyxDQUFDO1FBQzNELFdBQU0sR0FBRyxDQUFDLENBQUM7UUFDWCxXQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ1osVUFBSyxHQUFHLENBQUMsQ0FBQztRQUVWLFVBQUssR0FBRyxFQUFFLENBQUM7SUFJZSxDQUFDO0lBRXBDLFdBQVc7UUFDaEIsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3RCLENBQUM7SUFFUyxpQkFBaUIsQ0FBQyxJQUFtQjtRQUM3QyxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsS0FBSyxLQUFLLEVBQUU7WUFDbkMsT0FBTyxDQUFDLENBQ04sT0FBTyxJQUFJLEtBQUssV0FBVztnQkFDM0IsSUFBSSxLQUFLLEVBQUU7Z0JBQ1gsSUFBSSxLQUFLLE1BQU07Z0JBQ2YsSUFBSSxLQUFLLElBQUksQ0FDZCxDQUFDO1NBQ0g7UUFDRCxPQUFPLENBQUMsQ0FBQyxPQUFPLElBQUksS0FB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O2dCQUVDLG9CQUFvQjtzQkFEMUIsS0FBSztnQkFFVSxNQUFNO3NCQUFyQixLQUFLO2dCQUNVLE1BQU07c0JBQXJCLEtBQUs7Z0JBQ1UsS0FBSztzQkFBcEIsS0FBSztnQkFDVSxPQUFPO3NCQUF0QixLQUFLO2dCQUNVLEtBQUs7c0JBQXBCLEtBQUs7Z0JBRTRDLFVBQVU7c0JBQTNELFNBQVM7dUJBQUMsWUFBWSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIFJlbmRlcmVyMixcbiAgVmlld0NoaWxkLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCAqIGFzIFFSQ29kZSBmcm9tICdxcmNvZGUnO1xuaW1wb3J0IHtcbiAgUVJDb2RlRXJyb3JDb3JyZWN0aW9uTGV2ZWwsXG4gIFFSQ29kZVZlcnNpb24sXG4gIFFSQ29kZUVsZW1lbnRUeXBlLFxufSBmcm9tICcuL3R5cGVzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncXJjb2RlJyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHRlbXBsYXRlOiBgPGRpdiAjcXJjRWxlbWVudCBbY2xhc3NdPVwiY3NzQ2xhc3NcIj48L2Rpdj5gLFxufSlcbmV4cG9ydCBjbGFzcyBRUkNvZGVDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xuICBASW5wdXQoKSBwdWJsaWMgYWxsb3dFbXB0eVN0cmluZyA9IGZhbHNlO1xuICBASW5wdXQoKSBwdWJsaWMgY29sb3JEYXJrID0gJyMwMDAwMDBmZic7XG4gIEBJbnB1dCgpIHB1YmxpYyBjb2xvckxpZ2h0ID0gJyNmZmZmZmZmZic7XG4gIEBJbnB1dCgpIHB1YmxpYyBjc3NDbGFzcyA9ICdxcmNvZGUnO1xuICBASW5wdXQoKSBwdWJsaWMgZWxlbWVudFR5cGU6IGtleW9mIHR5cGVvZiBRUkNvZGVFbGVtZW50VHlwZSA9ICdjYW52YXMnO1xuICBASW5wdXQoKVxuICBwdWJsaWMgZXJyb3JDb3JyZWN0aW9uTGV2ZWw6IGtleW9mIHR5cGVvZiBRUkNvZGVFcnJvckNvcnJlY3Rpb25MZXZlbCA9ICdNJztcbiAgQElucHV0KCkgcHVibGljIG1hcmdpbiA9IDQ7XG4gIEBJbnB1dCgpIHB1YmxpYyBxcmRhdGEgPSAnJztcbiAgQElucHV0KCkgcHVibGljIHNjYWxlID0gNDtcbiAgQElucHV0KCkgcHVibGljIHZlcnNpb246IFFSQ29kZVZlcnNpb24gfCB1bmRlZmluZWQ7XG4gIEBJbnB1dCgpIHB1YmxpYyB3aWR0aCA9IDEwO1xuXG4gIEBWaWV3Q2hpbGQoJ3FyY0VsZW1lbnQnLCB7IHN0YXRpYzogdHJ1ZSB9KSBwdWJsaWMgcXJjRWxlbWVudCE6IEVsZW1lbnRSZWY7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyKSB7fVxuXG4gIHB1YmxpYyBuZ09uQ2hhbmdlcygpOiB2b2lkIHtcbiAgICB0aGlzLmNyZWF0ZVFSQ29kZSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGlzVmFsaWRRckNvZGVUZXh0KGRhdGE6IHN0cmluZyB8IG51bGwpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5hbGxvd0VtcHR5U3RyaW5nID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuICEoXG4gICAgICAgIHR5cGVvZiBkYXRhID09PSAndW5kZWZpbmVkJyB8fFxuICAgICAgICBkYXRhID09PSAnJyB8fFxuICAgICAgICBkYXRhID09PSAnbnVsbCcgfHxcbiAgICAgICAgZGF0YSA9PT0gbnVsbFxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuICEodHlwZW9mIGRhdGEgPT09ICd1bmRlZmluZWQnKTtcbiAgfVxuXG4gIHByaXZhdGUgdG9EYXRhVVJMKCk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKFxuICAgICAgKHJlc29sdmU6IChhcmc6IGFueSkgPT4gYW55LCByZWplY3Q6IChhcmc6IGFueSkgPT4gYW55KSA9PiB7XG4gICAgICAgIFFSQ29kZS50b0RhdGFVUkwoXG4gICAgICAgICAgdGhpcy5xcmRhdGEsXG4gICAgICAgICAge1xuICAgICAgICAgICAgY29sb3I6IHtcbiAgICAgICAgICAgICAgZGFyazogdGhpcy5jb2xvckRhcmssXG4gICAgICAgICAgICAgIGxpZ2h0OiB0aGlzLmNvbG9yTGlnaHQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3JDb3JyZWN0aW9uTGV2ZWw6IHRoaXMuZXJyb3JDb3JyZWN0aW9uTGV2ZWwsXG4gICAgICAgICAgICBtYXJnaW46IHRoaXMubWFyZ2luLFxuICAgICAgICAgICAgc2NhbGU6IHRoaXMuc2NhbGUsXG4gICAgICAgICAgICB2ZXJzaW9uOiB0aGlzLnZlcnNpb24sXG4gICAgICAgICAgICB3aWR0aDogdGhpcy53aWR0aCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIChlcnIsIHVybCkgPT4ge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJlc29sdmUodXJsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgdG9DYW52YXMoY2FudmFzOiBFbGVtZW50KTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoXG4gICAgICAocmVzb2x2ZTogKGFyZzogYW55KSA9PiBhbnksIHJlamVjdDogKGFyZzogYW55KSA9PiBhbnkpID0+IHtcbiAgICAgICAgUVJDb2RlLnRvQ2FudmFzKFxuICAgICAgICAgIGNhbnZhcyxcbiAgICAgICAgICB0aGlzLnFyZGF0YSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjb2xvcjoge1xuICAgICAgICAgICAgICBkYXJrOiB0aGlzLmNvbG9yRGFyayxcbiAgICAgICAgICAgICAgbGlnaHQ6IHRoaXMuY29sb3JMaWdodCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvckNvcnJlY3Rpb25MZXZlbDogdGhpcy5lcnJvckNvcnJlY3Rpb25MZXZlbCxcbiAgICAgICAgICAgIG1hcmdpbjogdGhpcy5tYXJnaW4sXG4gICAgICAgICAgICBzY2FsZTogdGhpcy5zY2FsZSxcbiAgICAgICAgICAgIHZlcnNpb246IHRoaXMudmVyc2lvbixcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgKGVycm9yKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJlc29sdmUoJ3N1Y2Nlc3MnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgdG9TVkcoKTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoXG4gICAgICAocmVzb2x2ZTogKGFyZzogYW55KSA9PiBhbnksIHJlamVjdDogKGFyZzogYW55KSA9PiBhbnkpID0+IHtcbiAgICAgICAgUVJDb2RlLnRvU3RyaW5nKFxuICAgICAgICAgIHRoaXMucXJkYXRhLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvbG9yOiB7XG4gICAgICAgICAgICAgIGRhcms6IHRoaXMuY29sb3JEYXJrLFxuICAgICAgICAgICAgICBsaWdodDogdGhpcy5jb2xvckxpZ2h0LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yQ29ycmVjdGlvbkxldmVsOiB0aGlzLmVycm9yQ29ycmVjdGlvbkxldmVsLFxuICAgICAgICAgICAgbWFyZ2luOiB0aGlzLm1hcmdpbixcbiAgICAgICAgICAgIHNjYWxlOiB0aGlzLnNjYWxlLFxuICAgICAgICAgICAgdHlwZTogJ3N2ZycsXG4gICAgICAgICAgICB2ZXJzaW9uOiB0aGlzLnZlcnNpb24sXG4gICAgICAgICAgICB3aWR0aDogdGhpcy53aWR0aCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIChlcnIsIHVybCkgPT4ge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJlc29sdmUodXJsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyRWxlbWVudChlbGVtZW50OiBFbGVtZW50KTogdm9pZCB7XG4gICAgZm9yIChjb25zdCBub2RlIG9mIHRoaXMucXJjRWxlbWVudC5uYXRpdmVFbGVtZW50LmNoaWxkTm9kZXMpIHtcbiAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2hpbGQodGhpcy5xcmNFbGVtZW50Lm5hdGl2ZUVsZW1lbnQsIG5vZGUpO1xuICAgIH1cbiAgICB0aGlzLnJlbmRlcmVyLmFwcGVuZENoaWxkKHRoaXMucXJjRWxlbWVudC5uYXRpdmVFbGVtZW50LCBlbGVtZW50KTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlUVJDb2RlKCk6IHZvaWQge1xuICAgIC8vIFNldCBzZW5zaXRpdmUgZGVmYXVsdHNcbiAgICBpZiAodGhpcy52ZXJzaW9uICYmIHRoaXMudmVyc2lvbiA+IDQwKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1thbmd1bGFyeC1xcmNvZGVdIG1heCB2YWx1ZSBmb3IgYHZlcnNpb25gIGlzIDQwJyk7XG4gICAgICB0aGlzLnZlcnNpb24gPSA0MDtcbiAgICB9IGVsc2UgaWYgKHRoaXMudmVyc2lvbiAmJiB0aGlzLnZlcnNpb24gPCAxKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1thbmd1bGFyeC1xcmNvZGVdYG1pbiB2YWx1ZSBmb3IgYHZlcnNpb25gIGlzIDEnKTtcbiAgICAgIHRoaXMudmVyc2lvbiA9IDE7XG4gICAgfSBlbHNlIGlmICh0aGlzLnZlcnNpb24gIT09IHVuZGVmaW5lZCAmJiBpc05hTih0aGlzLnZlcnNpb24pKSB7XG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICdbYW5ndWxhcngtcXJjb2RlXSB2ZXJzaW9uIHNob3VsZCBiZSBhIG51bWJlciwgZGVmYXVsdGluZyB0byBhdXRvLidcbiAgICAgICk7XG4gICAgICB0aGlzLnZlcnNpb24gPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGlmICghdGhpcy5pc1ZhbGlkUXJDb2RlVGV4dCh0aGlzLnFyZGF0YSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICdbYW5ndWxhcngtcXJjb2RlXSBGaWVsZCBgcXJkYXRhYCBpcyBlbXB0eSwgc2V0IGBhbGxvd0VtcHR5U3RyaW5nPVwidHJ1ZVwiYCB0byBvdmVyd3JpdGUgdGhpcyBiZWhhdmlvdXIuJ1xuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICAvLyBUaGlzIGlzIGEgZml4IHRvIGFsbG93IGFuIGVtcHR5IHN0cmluZyBhcyBxcmRhdGFcbiAgICAgIGlmICh0aGlzLmlzVmFsaWRRckNvZGVUZXh0KHRoaXMucXJkYXRhKSAmJiB0aGlzLnFyZGF0YSA9PT0gJycpIHtcbiAgICAgICAgdGhpcy5xcmRhdGEgPSAnICc7XG4gICAgICB9XG5cbiAgICAgIGxldCBlbGVtZW50OiBFbGVtZW50O1xuXG4gICAgICBzd2l0Y2ggKHRoaXMuZWxlbWVudFR5cGUpIHtcbiAgICAgICAgY2FzZSAnY2FudmFzJzpcbiAgICAgICAgICBlbGVtZW50ID0gdGhpcy5yZW5kZXJlci5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgICAgICB0aGlzLnRvQ2FudmFzKGVsZW1lbnQpXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyRWxlbWVudChlbGVtZW50KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignW2FuZ3VsYXJ4LXFyY29kZV0gY2FudmFzIGVycm9yOicsIGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3N2Zyc6XG4gICAgICAgICAgZWxlbWVudCA9IHRoaXMucmVuZGVyZXIuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgdGhpcy50b1NWRygpXG4gICAgICAgICAgICAudGhlbigoc3ZnU3RyaW5nOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRQcm9wZXJ0eShlbGVtZW50LCAnaW5uZXJIVE1MJywgc3ZnU3RyaW5nKTtcbiAgICAgICAgICAgICAgY29uc3QgaW5uZXJFbGVtZW50ID0gZWxlbWVudC5maXJzdENoaWxkIGFzIEVsZW1lbnQ7XG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKFxuICAgICAgICAgICAgICAgIGlubmVyRWxlbWVudCxcbiAgICAgICAgICAgICAgICAnaGVpZ2h0JyxcbiAgICAgICAgICAgICAgICBgJHt0aGlzLndpZHRofWBcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgICAgICAgaW5uZXJFbGVtZW50LFxuICAgICAgICAgICAgICAgICd3aWR0aCcsXG4gICAgICAgICAgICAgICAgYCR7dGhpcy53aWR0aH1gXG4gICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJFbGVtZW50KGlubmVyRWxlbWVudCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKChlKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1thbmd1bGFyeC1xcmNvZGVdIHN2ZyBlcnJvcjonLCBlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd1cmwnOlxuICAgICAgICBjYXNlICdpbWcnOlxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGVsZW1lbnQgPSB0aGlzLnJlbmRlcmVyLmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgICAgICAgIHRoaXMudG9EYXRhVVJMKClcbiAgICAgICAgICAgIC50aGVuKChkYXRhVXJsOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3NyYycsIGRhdGFVcmwpO1xuICAgICAgICAgICAgICB0aGlzLnJlbmRlckVsZW1lbnQoZWxlbWVudCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKChlKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1thbmd1bGFyeC1xcmNvZGVdIGltZy91cmwgZXJyb3I6JywgZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1thbmd1bGFyeC1xcmNvZGVdIEVycm9yIGdlbmVyYXRpbmcgUVIgQ29kZTonLCBlLm1lc3NhZ2UpO1xuICAgIH1cbiAgfVxufVxuIl19