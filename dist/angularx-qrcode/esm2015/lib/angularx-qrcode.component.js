import { ChangeDetectionStrategy, Component, Input, Renderer2, ViewChild, } from '@angular/core';
import * as QRCode from 'qrcode';
export class QRCodeComponent {
    constructor(renderer) {
        this.renderer = renderer;
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
        // Deprecation warnings
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
            console.warn(`[angularx-qrcode] usesvg is deprecated, use [elementType]="'svg'".`);
        }
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
                throw new Error('[angularx-qrcode] Field `qrdata` is empty, set`allowEmptyString="true"` to overwrite this behaviour.');
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
                        console.error('[angularx-qrcode] canvas error: ', e);
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
                        console.error('[angularx-qrcode] svg error: ', e);
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
                        console.error('[angularx-qrcode] img/url error: ', e);
                    });
            }
        }
        catch (e) {
            console.error('[angularx-qrcode] Error generating QR Code: ', e.message);
        }
    }
}
QRCodeComponent.decorators = [
    { type: Component, args: [{
                selector: 'qrcode',
                changeDetection: ChangeDetectionStrategy.OnPush,
                template: `<div #qrcElement [class]="cssClass"></div>`
            },] }
];
QRCodeComponent.ctorParameters = () => [
    { type: Renderer2 }
];
QRCodeComponent.propDecorators = {
    colordark: [{ type: Input }],
    colorlight: [{ type: Input }],
    level: [{ type: Input }],
    hidetitle: [{ type: Input }],
    size: [{ type: Input }],
    usesvg: [{ type: Input }],
    allowEmptyString: [{ type: Input }],
    qrdata: [{ type: Input }],
    colorDark: [{ type: Input }],
    colorLight: [{ type: Input }],
    cssClass: [{ type: Input }],
    elementType: [{ type: Input }],
    errorCorrectionLevel: [{ type: Input }],
    margin: [{ type: Input }],
    scale: [{ type: Input }],
    version: [{ type: Input }],
    width: [{ type: Input }],
    qrcElement: [{ type: ViewChild, args: ['qrcElement', { static: true },] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhcngtcXJjb2RlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXJ4LXFyY29kZS9zcmMvbGliL2FuZ3VsYXJ4LXFyY29kZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBRVQsS0FBSyxFQUVMLFNBQVMsRUFDVCxTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxLQUFLLE1BQU0sTUFBTSxRQUFRLENBQUM7QUFZakMsTUFBTSxPQUFPLGVBQWU7SUEyQjFCLFlBQW9CLFFBQW1CO1FBQW5CLGFBQVEsR0FBUixRQUFRLENBQVc7UUExQnZDLGFBQWE7UUFDRyxjQUFTLEdBQUcsRUFBRSxDQUFDO1FBQ2YsZUFBVSxHQUFHLEVBQUUsQ0FBQztRQUNoQixVQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ1gsY0FBUyxHQUFHLEtBQUssQ0FBQztRQUNsQixTQUFJLEdBQUcsQ0FBQyxDQUFDO1FBQ1QsV0FBTSxHQUFHLEtBQUssQ0FBQztRQUUvQix3QkFBd0I7UUFDUixxQkFBZ0IsR0FBRyxLQUFLLENBQUM7UUFDekIsV0FBTSxHQUFHLEVBQUUsQ0FBQztRQUU1QixpQ0FBaUM7UUFDakIsY0FBUyxHQUFHLFdBQVcsQ0FBQztRQUN4QixlQUFVLEdBQUcsV0FBVyxDQUFDO1FBQ3pCLGFBQVEsR0FBRyxRQUFRLENBQUM7UUFDcEIsZ0JBQVcsR0FBbUMsUUFBUSxDQUFDO1FBRWhFLHlCQUFvQixHQUE0QyxHQUFHLENBQUM7UUFDM0QsV0FBTSxHQUFHLENBQUMsQ0FBQztRQUNYLFVBQUssR0FBRyxDQUFDLENBQUM7UUFFVixVQUFLLEdBQUcsRUFBRSxDQUFDO1FBS3pCLHVCQUF1QjtRQUN2QixJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssRUFBRSxFQUFFO1lBQ3pCLE9BQU8sQ0FBQyxJQUFJLENBQUMsMkRB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RTt3QkFDeEIsT0FBTyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7d0JBQ3JDLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQzlCLENBQUMsQ0FBQzt5QkFDRCxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTt3QkFDWCxPQUFPLENBQUMsS0FBSyxDQUFDLG1DQUFtQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUN4RCxDQUFDLENBQUMsQ0FBQzthQUNSO1NBQ0Y7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNWLE9BQU8sQ0FBQyxLQUFLLENBQUMsOENBQThDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzFFO0lBQ0gsQ0FBQzs7O1lBclBGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsUUFBUTtnQkFDbEIsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLFFBQVEsRUFBRSw0Q0FBNEM7YUFDdkQ7OztZQWRDLFNBQVM7Ozt3QkFpQlIsS0FBSzt5QkFDTCxLQUFLO29CQUNMLEtBQUs7d0JBQ0wsS0FBSzttQkFDTCxLQUFLO3FCQUNMLEtBQUs7K0JBR0wsS0FBSztxQkFDTCxLQUFLO3dCQUdMLEtBQUs7eUJBQ0wsS0FBSzt1QkFDTCxLQUFLOzBCQUNMLEtBQUs7bUNBQ0wsS0FBSztxQkFFTCxLQUFLO29CQUNMLEtBQUs7c0JBQ0wsS0FBSztvQkFDTCxLQUFLO3lCQUVMLFNBQVMsU0FBQyxZQUFZLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcclxuICBDb21wb25lbnQsXHJcbiAgRWxlbWVudFJlZixcclxuICBJbnB1dCxcclxuICBPbkNoYW5nZXMsXHJcbiAgUmVuZGVyZXIyLFxyXG4gIFZpZXdDaGlsZCxcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0ICogYXMgUVJDb2RlIGZyb20gJ3FyY29kZSc7XHJcbmltcG9ydCB7XHJcbiAgUVJDb2RlRXJyb3JDb3JyZWN0aW9uTGV2ZWwsXHJcbiAgUVJDb2RlVmVyc2lvbixcclxuICBRUkNvZGVFbGVtZW50VHlwZSxcclxufSBmcm9tICcuL3R5cGVzJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAncXJjb2RlJyxcclxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcclxuICB0ZW1wbGF0ZTogYDxkaXYgI3FyY0VsZW1lbnQgW2NsYXNzXT1cImNzc0NsYXNzXCI+PC9kaXY+YCxcclxufSlcclxuZXhwb3J0IGNsYXNzIFFSQ29kZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XHJcbiAgLy8gRGVwcmVjYXRlZFxyXG4gIEBJbnB1dCgpIHB1YmxpYyBjb2xvcmRhcmsgPSAnJztcclxuICBASW5wdXQoKSBwdWJsaWMgY29sb3JsaWdodCA9ICcnO1xyXG4gIEBJbnB1dCgpIHB1YmxpYyBsZXZlbCA9ICcnO1xyXG4gIEBJbnB1dCgpIHB1YmxpYyBoaWRldGl0bGUgPSBmYWxzZTtcclxuICBASW5wdXQoKSBwdWJsaWMgc2l6ZSA9IDA7XHJcbiAgQElucHV0KCkgcHVibGljIHVzZXN2ZyA9IGZhbHNlO1xyXG5cclxuICAvLyBWYWxpZCBmb3IgMS54IGFuZCAyLnhcclxuICBASW5wdXQoKSBwdWJsaWMgYWxsb3dFbXB0eVN0cmluZyA9IGZhbHNlO1xyXG4gIEBJbnB1dCgpIHB1YmxpYyBxcmRhdGEgPSAnJztcclxuXHJcbiAgLy8gTmV3IGZpZWxkcyBpbnRyb2R1Y2VkIGluIDIuMC4wXHJcbiAgQElucHV0KCkgcHVibGljIGNvbG9yRGFyayA9ICcjMDAwMDAwZmYnO1xyXG4gIEBJbnB1dCgpIHB1YmxpYyBjb2xvckxpZ2h0ID0gJyNmZmZmZmZmZic7XHJcbiAgQElucHV0KCkgcHVibGljIGNzc0NsYXNzID0gJ3FyY29kZSc7XHJcbiAgQElucHV0KCkgcHVibGljIGVsZW1lbnRUeXBlOiBrZXlvZiB0eXBlb2YgUVJDb2RlRWxlbWVudFR5cGUgPSAnY2FudmFzJztcclxuICBASW5wdXQoKVxyXG4gIHB1YmxpYyBlcnJvckNvcnJlY3Rpb25MZXZlbDoga2V5b2YgdHlwZW9mIFFSQ29kZUVycm9yQ29ycmVjdGlvbkxldmVsID0gJ00nO1xyXG4gIEBJbnB1dCgpIHB1YmxpYyBtYXJnaW4gPSA0O1xyXG4gIEBJbnB1dCgpIHB1YmxpYyBzY2FsZSA9IDQ7XHJcbiAgQElucHV0KCkgcHVibGljIHZlcnNpb246IFFSQ29kZVZlcnNpb24gfCB1bmRlZmluZWQ7XHJcbiAgQElucHV0KCkgcHVibGljIHdpZHRoID0gMTA7XHJcblxyXG4gIEBWaWV3Q2hpbGQoJ3FyY0VsZW1lbnQnLCB7IHN0YXRpYzogdHJ1ZSB9KSBwdWJsaWMgcXJjRWxlbWVudDogRWxlbWVudFJlZjtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyKSB7XHJcbiAgICAvLyBEZXByZWNhdGlvbiB3YXJuaW5nc1xyXG4gICAgaWYgKHRoaXMuY29sb3JkYXJrICE9PSAnJykge1xyXG4gICAgICBjb25zb2xlLndhcm4oJ1thbmd1bGFyeC1xcmNvZGVdIGNvbG9yZGFyayBpcyBkZXByZWNhdGVkLCB1c2UgY29sb3JEYXJrLicpO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuY29sb3JsaWdodCAhPT0gJycpIHtcclxuICAgICAgY29uc29sZS53YXJuKFxyXG4gICAgICAgICdbYW5ndWxhcngtcXJjb2RlXSBjb2xvcmxpZ2h0IGlzIGRlcHJlY2F0ZWQsIHVzZSBjb2xvckxpZ2h0LidcclxuICAgICAgKTtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLmxldmVsICE9PSAnJykge1xyXG4gICAgICBjb25zb2xlLndhcm4oXHJcbiAgICAgICAgJ1thbmd1bGFyeC1xcmNvZGVdIGxldmVsIGlzIGRlcHJlY2F0ZWQsIHVzZSBlcnJvckNvcnJlY3Rpb25MZXZlbC4nXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5oaWRldGl0bGUgIT09IGZhbHNlKSB7XHJcbiAgICAgIGNvbnNvbGUud2FybignW2FuZ3VsYXJ4LXFyY29kZV0gaGlkZXRpdGxlIGlzIGRlcHJlY2F0ZWQuJyk7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5zaXplICE9PSAwKSB7XHJcbiAgICAgIGNvbnNvbGUud2FybihcclxuICAgICAgICAnW2FuZ3VsYXJ4LXFyY29kZV0gc2l6ZSBpcyBkZXByZWNhdGVkLCB1c2UgYHdpZHRoYC4gRGVmYXVsdHMgdG8gMTAuJ1xyXG4gICAgICApO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMudXNlc3ZnICE9PSBmYWxzZSkge1xyXG4gICAgICBjb25zb2xlLndhcm4oXHJcbiAgICAgICAgYFthbmd1bGFyeC1xcmNvZGVdIHVzZXN2ZyBpcyBkZXByZWNhdGVkLCB1c2UgW2VsZW1lbnRUeXBlXT1cIidzdmcnXCIuYFxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIG5nT25DaGFuZ2VzKCk6IHZvaWQge1xyXG4gICAgdGhpcy5jcmVhdGVRUkNvZGUoKTtcclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBpc1ZhbGlkUXJDb2RlVGV4dChkYXRhOiBzdHJpbmcgfCBudWxsKTogYm9vbGVhbiB7XHJcbiAgICBpZiAodGhpcy5hbGxvd0VtcHR5U3RyaW5nID09PSBmYWxzZSkge1xyXG4gICAgICByZXR1cm4gIShcclxuICAgICAgICB0eXBlb2YgZGF0YSA9PT0gJ3VuZGVmaW5lZCcgfHxcclxuICAgICAgICBkYXRhID09PSAnJyB8fFxyXG4gICAgICAgIGRhdGEgPT09ICdudWxsJyB8fFxyXG4gICAgICAgIGRhdGEgPT09IG51bGxcclxuICAgICAgKTtcclxuICAgIH1cclxuICAgIHJldHVybiAhKHR5cGVvZiBkYXRhID09PSAndW5kZWZpbmVkJyk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHRvRGF0YVVSTCgpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKFxyXG4gICAgICAocmVzb2x2ZTogKGFyZzogYW55KSA9PiBhbnksIHJlamVjdDogKGFyZzogYW55KSA9PiBhbnkpID0+IHtcclxuICAgICAgICBRUkNvZGUudG9EYXRhVVJMKFxyXG4gICAgICAgICAgdGhpcy5xcmRhdGEsXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbG9yOiB7XHJcbiAgICAgICAgICAgICAgZGFyazogdGhpcy5jb2xvckRhcmssXHJcbiAgICAgICAgICAgICAgbGlnaHQ6IHRoaXMuY29sb3JMaWdodCxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3JDb3JyZWN0aW9uTGV2ZWw6IHRoaXMuZXJyb3JDb3JyZWN0aW9uTGV2ZWwsXHJcbiAgICAgICAgICAgIG1hcmdpbjogdGhpcy5tYXJnaW4sXHJcbiAgICAgICAgICAgIHNjYWxlOiB0aGlzLnNjYWxlLFxyXG4gICAgICAgICAgICB2ZXJzaW9uOiB0aGlzLnZlcnNpb24sXHJcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIChlcnIsIHVybCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgcmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgcmVzb2x2ZSh1cmwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgdG9DYW52YXMoY2FudmFzOiBFbGVtZW50KTogUHJvbWlzZTxhbnk+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShcclxuICAgICAgKHJlc29sdmU6IChhcmc6IGFueSkgPT4gYW55LCByZWplY3Q6IChhcmc6IGFueSkgPT4gYW55KSA9PiB7XHJcbiAgICAgICAgUVJDb2RlLnRvQ2FudmFzKFxyXG4gICAgICAgICAgY2FudmFzLFxyXG4gICAgICAgICAgdGhpcy5xcmRhdGEsXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbG9yOiB7XHJcbiAgICAgICAgICAgICAgZGFyazogdGhpcy5jb2xvckRhcmssXHJcbiAgICAgICAgICAgICAgbGlnaHQ6IHRoaXMuY29sb3JMaWdodCxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3JDb3JyZWN0aW9uTGV2ZWw6IHRoaXMuZXJyb3JDb3JyZWN0aW9uTGV2ZWwsXHJcbiAgICAgICAgICAgIG1hcmdpbjogdGhpcy5tYXJnaW4sXHJcbiAgICAgICAgICAgIHNjYWxlOiB0aGlzLnNjYWxlLFxyXG4gICAgICAgICAgICB2ZXJzaW9uOiB0aGlzLnZlcnNpb24sXHJcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHJlc29sdmUoJ3N1Y2Nlc3MnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHRvU1ZHKCk6IFByb21pc2U8YW55PiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoXHJcbiAgICAgIChyZXNvbHZlOiAoYXJnOiBhbnkpID0+IGFueSwgcmVqZWN0OiAoYXJnOiBhbnkpID0+IGFueSkgPT4ge1xyXG4gICAgICAgIFFSQ29kZS50b1N0cmluZyhcclxuICAgICAgICAgIHRoaXMucXJkYXRhLFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBjb2xvcjoge1xyXG4gICAgICAgICAgICAgIGRhcms6IHRoaXMuY29sb3JEYXJrLFxyXG4gICAgICAgICAgICAgIGxpZ2h0OiB0aGlzLmNvbG9yTGlnaHQsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yQ29ycmVjdGlvbkxldmVsOiB0aGlzLmVycm9yQ29ycmVjdGlvbkxldmVsLFxyXG4gICAgICAgICAgICBtYXJnaW46IHRoaXMubWFyZ2luLFxyXG4gICAgICAgICAgICBzY2FsZTogdGhpcy5zY2FsZSxcclxuICAgICAgICAgICAgdHlwZTogJ3N2ZycsXHJcbiAgICAgICAgICAgIHZlcnNpb246IHRoaXMudmVyc2lvbixcclxuICAgICAgICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgKGVyciwgdXJsKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICByZXNvbHZlKHVybCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgICB9XHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZW5kZXJFbGVtZW50KGVsZW1lbnQ6IEVsZW1lbnQpOiB2b2lkIHtcclxuICAgIGZvciAoY29uc3Qgbm9kZSBvZiB0aGlzLnFyY0VsZW1lbnQubmF0aXZlRWxlbWVudC5jaGlsZE5vZGVzKSB7XHJcbiAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2hpbGQodGhpcy5xcmNFbGVtZW50Lm5hdGl2ZUVsZW1lbnQsIG5vZGUpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5yZW5kZXJlci5hcHBlbmRDaGlsZCh0aGlzLnFyY0VsZW1lbnQubmF0aXZlRWxlbWVudCwgZWxlbWVudCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNyZWF0ZVFSQ29kZSgpOiB2b2lkIHtcclxuICAgIC8vIFNldCBzZW5zaXRpdmUgZGVmYXVsdHNcclxuICAgIGlmICh0aGlzLnZlcnNpb24gJiYgdGhpcy52ZXJzaW9uID4gNDApIHtcclxuICAgICAgY29uc29sZS53YXJuKCdbYW5ndWxhcngtcXJjb2RlXSBtYXggdmFsdWUgZm9yIGB2ZXJzaW9uYCBpcyA0MCcpO1xyXG4gICAgICB0aGlzLnZlcnNpb24gPSA0MDtcclxuICAgIH0gZWxzZSBpZiAodGhpcy52ZXJzaW9uICYmIHRoaXMudmVyc2lvbiA8IDEpIHtcclxuICAgICAgY29uc29sZS53YXJuKCdbYW5ndWxhcngtcXJjb2RlXWBtaW4gdmFsdWUgZm9yIGB2ZXJzaW9uYCBpcyAxJyk7XHJcbiAgICAgIHRoaXMudmVyc2lvbiA9IDE7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMudmVyc2lvbiAhPT0gdW5kZWZpbmVkICYmIGlzTmFOKHRoaXMudmVyc2lvbikpIHtcclxuICAgICAgY29uc29sZS53YXJuKFxyXG4gICAgICAgICdbYW5ndWxhcngtcXJjb2RlXSB2ZXJzaW9uIHNob3VsZCBiZSBhIG51bWJlciwgZGVmYXVsdGluZyB0byBhdXRvLidcclxuICAgICAgKTtcclxuICAgICAgdGhpcy52ZXJzaW9uID0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIGlmICghdGhpcy5pc1ZhbGlkUXJDb2RlVGV4dCh0aGlzLnFyZGF0YSkpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgICAnW2FuZ3VsYXJ4LXFyY29kZV0gRmllbGQgYHFyZGF0YWAgaXMgZW1wdHksIHNldGBhbGxvd0VtcHR5U3RyaW5nPVwidHJ1ZVwiYCB0byBvdmVyd3JpdGUgdGhpcyBiZWhhdmlvdXIuJ1xyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBlbGVtZW50OiBFbGVtZW50O1xyXG5cclxuICAgICAgc3dpdGNoICh0aGlzLmVsZW1lbnRUeXBlKSB7XHJcbiAgICAgICAgY2FzZSAnY2FudmFzJzpcclxuICAgICAgICAgIGVsZW1lbnQgPSB0aGlzLnJlbmRlcmVyLmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG4gICAgICAgICAgdGhpcy50b0NhbnZhcyhlbGVtZW50KVxyXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJFbGVtZW50KGVsZW1lbnQpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goKGUpID0+IHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdbYW5ndWxhcngtcXJjb2RlXSBjYW52YXMgZXJyb3I6ICcsIGUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ3N2Zyc6XHJcbiAgICAgICAgICBlbGVtZW50ID0gdGhpcy5yZW5kZXJlci5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgIHRoaXMudG9TVkcoKVxyXG4gICAgICAgICAgICAudGhlbigoc3ZnU3RyaW5nOiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFByb3BlcnR5KGVsZW1lbnQsICdpbm5lckhUTUwnLCBzdmdTdHJpbmcpO1xyXG4gICAgICAgICAgICAgIGNvbnN0IGlubmVyRWxlbWVudCA9IGVsZW1lbnQuZmlyc3RDaGlsZCBhcyBFbGVtZW50O1xyXG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKFxyXG4gICAgICAgICAgICAgICAgaW5uZXJFbGVtZW50LFxyXG4gICAgICAgICAgICAgICAgJ2hlaWdodCcsXHJcbiAgICAgICAgICAgICAgICBgJHt0aGlzLndpZHRofWBcclxuICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKFxyXG4gICAgICAgICAgICAgICAgaW5uZXJFbGVtZW50LFxyXG4gICAgICAgICAgICAgICAgJ3dpZHRoJyxcclxuICAgICAgICAgICAgICAgIGAke3RoaXMud2lkdGh9YFxyXG4gICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyRWxlbWVudChpbm5lckVsZW1lbnQpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goKGUpID0+IHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdbYW5ndWxhcngtcXJjb2RlXSBzdmcgZXJyb3I6ICcsIGUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ3VybCc6XHJcbiAgICAgICAgY2FzZSAnaW1nJzpcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgZWxlbWVudCA9IHRoaXMucmVuZGVyZXIuY3JlYXRlRWxlbWVudCgnaW1nJyk7XHJcbiAgICAgICAgICB0aGlzLnRvRGF0YVVSTCgpXHJcbiAgICAgICAgICAgIC50aGVuKChkYXRhVXJsOiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnc3JjJywgZGF0YVVybCk7XHJcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJFbGVtZW50KGVsZW1lbnQpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goKGUpID0+IHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdbYW5ndWxhcngtcXJjb2RlXSBpbWcvdXJsIGVycm9yOiAnLCBlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgY29uc29sZS5lcnJvcignW2FuZ3VsYXJ4LXFyY29kZV0gRXJyb3IgZ2VuZXJhdGluZyBRUiBDb2RlOiAnLCBlLm1lc3NhZ2UpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=