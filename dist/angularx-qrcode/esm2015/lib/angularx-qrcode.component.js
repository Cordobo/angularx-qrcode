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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhcngtcXJjb2RlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyeC1xcmNvZGUvc3JjLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXJ4LXFyY29kZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBRVQsS0FBSyxFQUVMLFNBQVMsRUFDVCxTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxLQUFLLE1BQU0sTUFBTSxRQUFRLENBQUM7QUFZakMsTUFBTSxPQUFPLGVBQWU7SUEyQjFCLFlBQW9CLFFBQW1CO1FBQW5CLGFBQVEsR0FBUixRQUFRLENBQVc7UUExQnZDLGFBQWE7UUFDRyxjQUFTLEdBQUcsRUFBRSxDQUFDO1FBQ2YsZUFBVSxHQUFHLEVBQUUsQ0FBQztRQUNoQixVQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ1gsY0FBUyxHQUFHLEtBQUssQ0FBQztRQUNsQixTQUFJLEdBQUcsQ0FBQyxDQUFDO1FBQ1QsV0FBTSxHQUFHLEtBQUssQ0FBQztRQUUvQix3QkFBd0I7UUFDUixxQkFBZ0IsR0FBRyxLQUFLLENBQUM7UUFDekIsV0FBTSxHQUFHLEVBQUUsQ0FBQztRQUU1QixpQ0FBaUM7UUFDakIsY0FBUyxHQUFHLFdBQVcsQ0FBQztRQUN4QixlQUFVLEdBQUcsV0FBVyxDQUFDO1FBQ3pCLGFBQVEsR0FBRyxRQUFRLENBQUM7UUFDcEIsZ0JBQVcsR0FBbUMsUUFBUSxDQUFDO1FBRWhFLHlCQUFvQixHQUE0QyxHQUFHLENBQUM7UUFDM0QsV0FBTSxHQUFHLENBQUMsQ0FBQztRQUNYLFVBQUssR0FBRyxDQUFDLENBQUM7UUFFVixVQUFLLEdBQUcsRUFBRSxDQUFDO1FBS3pCLHVCQUF1QjtRQUN2QixJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssRUFBRSxFQUFFO1lBQ3pCLE9BQU8sQ0FBQyxJQUFJLENBQUMsMkRBQTJE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QkFDeEIsT0FBTyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7d0JBQ3JDLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQzlCLENBQUMsQ0FBQzt5QkFDRCxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTt3QkFDWCxPQUFPLENBQUMsS0FBSyxDQUFDLG1DQUFtQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUN4RCxDQUFDLENBQUMsQ0FBQzthQUNSO1NBQ0Y7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNWLE9BQU8sQ0FBQyxLQUFLLENBQUMsOENBQThDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzFFO0lBQ0gsQ0FBQzs7O1lBclBGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsUUFBUTtnQkFDbEIsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLFFBQVEsRUFBRSw0Q0FBNEM7YUFDdkQ7OztZQWRDLFNBQVM7Ozt3QkFpQlIsS0FBSzt5QkFDTCxLQUFLO29CQUNMLEtBQUs7d0JBQ0wsS0FBSzttQkFDTCxLQUFLO3FCQUNMLEtBQUs7K0JBR0wsS0FBSztxQkFDTCxLQUFLO3dCQUdMLEtBQUs7eUJBQ0wsS0FBSzt1QkFDTCxLQUFLOzBCQUNMLEtBQUs7bUNBQ0wsS0FBSztxQkFFTCxLQUFLO29CQUNMLEtBQUs7c0JBQ0wsS0FBSztvQkFDTCxLQUFLO3lCQUVMLFNBQVMsU0FBQyxZQUFZLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgUmVuZGVyZXIyLFxuICBWaWV3Q2hpbGQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0ICogYXMgUVJDb2RlIGZyb20gJ3FyY29kZSc7XG5pbXBvcnQge1xuICBRUkNvZGVFcnJvckNvcnJlY3Rpb25MZXZlbCxcbiAgUVJDb2RlVmVyc2lvbixcbiAgUVJDb2RlRWxlbWVudFR5cGUsXG59IGZyb20gJy4vdHlwZXMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdxcmNvZGUnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgdGVtcGxhdGU6IGA8ZGl2ICNxcmNFbGVtZW50IFtjbGFzc109XCJjc3NDbGFzc1wiPjwvZGl2PmAsXG59KVxuZXhwb3J0IGNsYXNzIFFSQ29kZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG4gIC8vIERlcHJlY2F0ZWRcbiAgQElucHV0KCkgcHVibGljIGNvbG9yZGFyayA9ICcnO1xuICBASW5wdXQoKSBwdWJsaWMgY29sb3JsaWdodCA9ICcnO1xuICBASW5wdXQoKSBwdWJsaWMgbGV2ZWwgPSAnJztcbiAgQElucHV0KCkgcHVibGljIGhpZGV0aXRsZSA9IGZhbHNlO1xuICBASW5wdXQoKSBwdWJsaWMgc2l6ZSA9IDA7XG4gIEBJbnB1dCgpIHB1YmxpYyB1c2VzdmcgPSBmYWxzZTtcblxuICAvLyBWYWxpZCBmb3IgMS54IGFuZCAyLnhcbiAgQElucHV0KCkgcHVibGljIGFsbG93RW1wdHlTdHJpbmcgPSBmYWxzZTtcbiAgQElucHV0KCkgcHVibGljIHFyZGF0YSA9ICcnO1xuXG4gIC8vIE5ldyBmaWVsZHMgaW50cm9kdWNlZCBpbiAyLjAuMFxuICBASW5wdXQoKSBwdWJsaWMgY29sb3JEYXJrID0gJyMwMDAwMDBmZic7XG4gIEBJbnB1dCgpIHB1YmxpYyBjb2xvckxpZ2h0ID0gJyNmZmZmZmZmZic7XG4gIEBJbnB1dCgpIHB1YmxpYyBjc3NDbGFzcyA9ICdxcmNvZGUnO1xuICBASW5wdXQoKSBwdWJsaWMgZWxlbWVudFR5cGU6IGtleW9mIHR5cGVvZiBRUkNvZGVFbGVtZW50VHlwZSA9ICdjYW52YXMnO1xuICBASW5wdXQoKVxuICBwdWJsaWMgZXJyb3JDb3JyZWN0aW9uTGV2ZWw6IGtleW9mIHR5cGVvZiBRUkNvZGVFcnJvckNvcnJlY3Rpb25MZXZlbCA9ICdNJztcbiAgQElucHV0KCkgcHVibGljIG1hcmdpbiA9IDQ7XG4gIEBJbnB1dCgpIHB1YmxpYyBzY2FsZSA9IDQ7XG4gIEBJbnB1dCgpIHB1YmxpYyB2ZXJzaW9uOiBRUkNvZGVWZXJzaW9uIHwgdW5kZWZpbmVkO1xuICBASW5wdXQoKSBwdWJsaWMgd2lkdGggPSAxMDtcblxuICBAVmlld0NoaWxkKCdxcmNFbGVtZW50JywgeyBzdGF0aWM6IHRydWUgfSkgcHVibGljIHFyY0VsZW1lbnQ6IEVsZW1lbnRSZWY7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyKSB7XG4gICAgLy8gRGVwcmVjYXRpb24gd2FybmluZ3NcbiAgICBpZiAodGhpcy5jb2xvcmRhcmsgIT09ICcnKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1thbmd1bGFyeC1xcmNvZGVdIGNvbG9yZGFyayBpcyBkZXByZWNhdGVkLCB1c2UgY29sb3JEYXJrLicpO1xuICAgIH1cbiAgICBpZiAodGhpcy5jb2xvcmxpZ2h0ICE9PSAnJykge1xuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAnW2FuZ3VsYXJ4LXFyY29kZV0gY29sb3JsaWdodCBpcyBkZXByZWNhdGVkLCB1c2UgY29sb3JMaWdodC4nXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAodGhpcy5sZXZlbCAhPT0gJycpIHtcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgJ1thbmd1bGFyeC1xcmNvZGVdIGxldmVsIGlzIGRlcHJlY2F0ZWQsIHVzZSBlcnJvckNvcnJlY3Rpb25MZXZlbC4nXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAodGhpcy5oaWRldGl0bGUgIT09IGZhbHNlKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1thbmd1bGFyeC1xcmNvZGVdIGhpZGV0aXRsZSBpcyBkZXByZWNhdGVkLicpO1xuICAgIH1cbiAgICBpZiAodGhpcy5zaXplICE9PSAwKSB7XG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICdbYW5ndWxhcngtcXJjb2RlXSBzaXplIGlzIGRlcHJlY2F0ZWQsIHVzZSBgd2lkdGhgLiBEZWZhdWx0cyB0byAxMC4nXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAodGhpcy51c2VzdmcgIT09IGZhbHNlKSB7XG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgIGBbYW5ndWxhcngtcXJjb2RlXSB1c2VzdmcgaXMgZGVwcmVjYXRlZCwgdXNlIFtlbGVtZW50VHlwZV09XCInc3ZnJ1wiLmBcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG5nT25DaGFuZ2VzKCk6IHZvaWQge1xuICAgIHRoaXMuY3JlYXRlUVJDb2RlKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgaXNWYWxpZFFyQ29kZVRleHQoZGF0YTogc3RyaW5nIHwgbnVsbCk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLmFsbG93RW1wdHlTdHJpbmcgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm4gIShcbiAgICAgICAgdHlwZW9mIGRhdGEgPT09ICd1bmRlZmluZWQnIHx8XG4gICAgICAgIGRhdGEgPT09ICcnIHx8XG4gICAgICAgIGRhdGEgPT09ICdudWxsJyB8fFxuICAgICAgICBkYXRhID09PSBudWxsXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gISh0eXBlb2YgZGF0YSA9PT0gJ3VuZGVmaW5lZCcpO1xuICB9XG5cbiAgcHJpdmF0ZSB0b0RhdGFVUkwoKTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoXG4gICAgICAocmVzb2x2ZTogKGFyZzogYW55KSA9PiBhbnksIHJlamVjdDogKGFyZzogYW55KSA9PiBhbnkpID0+IHtcbiAgICAgICAgUVJDb2RlLnRvRGF0YVVSTChcbiAgICAgICAgICB0aGlzLnFyZGF0YSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjb2xvcjoge1xuICAgICAgICAgICAgICBkYXJrOiB0aGlzLmNvbG9yRGFyayxcbiAgICAgICAgICAgICAgbGlnaHQ6IHRoaXMuY29sb3JMaWdodCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvckNvcnJlY3Rpb25MZXZlbDogdGhpcy5lcnJvckNvcnJlY3Rpb25MZXZlbCxcbiAgICAgICAgICAgIG1hcmdpbjogdGhpcy5tYXJnaW4sXG4gICAgICAgICAgICBzY2FsZTogdGhpcy5zY2FsZSxcbiAgICAgICAgICAgIHZlcnNpb246IHRoaXMudmVyc2lvbixcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgKGVyciwgdXJsKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVzb2x2ZSh1cmwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSB0b0NhbnZhcyhjYW52YXM6IEVsZW1lbnQpOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShcbiAgICAgIChyZXNvbHZlOiAoYXJnOiBhbnkpID0+IGFueSwgcmVqZWN0OiAoYXJnOiBhbnkpID0+IGFueSkgPT4ge1xuICAgICAgICBRUkNvZGUudG9DYW52YXMoXG4gICAgICAgICAgY2FudmFzLFxuICAgICAgICAgIHRoaXMucXJkYXRhLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvbG9yOiB7XG4gICAgICAgICAgICAgIGRhcms6IHRoaXMuY29sb3JEYXJrLFxuICAgICAgICAgICAgICBsaWdodDogdGhpcy5jb2xvckxpZ2h0LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yQ29ycmVjdGlvbkxldmVsOiB0aGlzLmVycm9yQ29ycmVjdGlvbkxldmVsLFxuICAgICAgICAgICAgbWFyZ2luOiB0aGlzLm1hcmdpbixcbiAgICAgICAgICAgIHNjYWxlOiB0aGlzLnNjYWxlLFxuICAgICAgICAgICAgdmVyc2lvbjogdGhpcy52ZXJzaW9uLFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXG4gICAgICAgICAgfSxcbiAgICAgICAgICAoZXJyb3IpID0+IHtcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVzb2x2ZSgnc3VjY2VzcycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSB0b1NWRygpOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShcbiAgICAgIChyZXNvbHZlOiAoYXJnOiBhbnkpID0+IGFueSwgcmVqZWN0OiAoYXJnOiBhbnkpID0+IGFueSkgPT4ge1xuICAgICAgICBRUkNvZGUudG9TdHJpbmcoXG4gICAgICAgICAgdGhpcy5xcmRhdGEsXG4gICAgICAgICAge1xuICAgICAgICAgICAgY29sb3I6IHtcbiAgICAgICAgICAgICAgZGFyazogdGhpcy5jb2xvckRhcmssXG4gICAgICAgICAgICAgIGxpZ2h0OiB0aGlzLmNvbG9yTGlnaHQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3JDb3JyZWN0aW9uTGV2ZWw6IHRoaXMuZXJyb3JDb3JyZWN0aW9uTGV2ZWwsXG4gICAgICAgICAgICBtYXJnaW46IHRoaXMubWFyZ2luLFxuICAgICAgICAgICAgc2NhbGU6IHRoaXMuc2NhbGUsXG4gICAgICAgICAgICB0eXBlOiAnc3ZnJyxcbiAgICAgICAgICAgIHZlcnNpb246IHRoaXMudmVyc2lvbixcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgKGVyciwgdXJsKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVzb2x2ZSh1cmwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJFbGVtZW50KGVsZW1lbnQ6IEVsZW1lbnQpOiB2b2lkIHtcbiAgICBmb3IgKGNvbnN0IG5vZGUgb2YgdGhpcy5xcmNFbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY2hpbGROb2Rlcykge1xuICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDaGlsZCh0aGlzLnFyY0VsZW1lbnQubmF0aXZlRWxlbWVudCwgbm9kZSk7XG4gICAgfVxuICAgIHRoaXMucmVuZGVyZXIuYXBwZW5kQ2hpbGQodGhpcy5xcmNFbGVtZW50Lm5hdGl2ZUVsZW1lbnQsIGVsZW1lbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVRUkNvZGUoKTogdm9pZCB7XG4gICAgLy8gU2V0IHNlbnNpdGl2ZSBkZWZhdWx0c1xuICAgIGlmICh0aGlzLnZlcnNpb24gJiYgdGhpcy52ZXJzaW9uID4gNDApIHtcbiAgICAgIGNvbnNvbGUud2FybignW2FuZ3VsYXJ4LXFyY29kZV0gbWF4IHZhbHVlIGZvciBgdmVyc2lvbmAgaXMgNDAnKTtcbiAgICAgIHRoaXMudmVyc2lvbiA9IDQwO1xuICAgIH0gZWxzZSBpZiAodGhpcy52ZXJzaW9uICYmIHRoaXMudmVyc2lvbiA8IDEpIHtcbiAgICAgIGNvbnNvbGUud2FybignW2FuZ3VsYXJ4LXFyY29kZV1gbWluIHZhbHVlIGZvciBgdmVyc2lvbmAgaXMgMScpO1xuICAgICAgdGhpcy52ZXJzaW9uID0gMTtcbiAgICB9IGVsc2UgaWYgKHRoaXMudmVyc2lvbiAhPT0gdW5kZWZpbmVkICYmIGlzTmFOKHRoaXMudmVyc2lvbikpIHtcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgJ1thbmd1bGFyeC1xcmNvZGVdIHZlcnNpb24gc2hvdWxkIGJlIGEgbnVtYmVyLCBkZWZhdWx0aW5nIHRvIGF1dG8uJ1xuICAgICAgKTtcbiAgICAgIHRoaXMudmVyc2lvbiA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgaWYgKCF0aGlzLmlzVmFsaWRRckNvZGVUZXh0KHRoaXMucXJkYXRhKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgJ1thbmd1bGFyeC1xcmNvZGVdIEZpZWxkIGBxcmRhdGFgIGlzIGVtcHR5LCBzZXRgYWxsb3dFbXB0eVN0cmluZz1cInRydWVcImAgdG8gb3ZlcndyaXRlIHRoaXMgYmVoYXZpb3VyLidcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgbGV0IGVsZW1lbnQ6IEVsZW1lbnQ7XG5cbiAgICAgIHN3aXRjaCAodGhpcy5lbGVtZW50VHlwZSkge1xuICAgICAgICBjYXNlICdjYW52YXMnOlxuICAgICAgICAgIGVsZW1lbnQgPSB0aGlzLnJlbmRlcmVyLmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgICAgIHRoaXMudG9DYW52YXMoZWxlbWVudClcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJFbGVtZW50KGVsZW1lbnQpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCgoZSkgPT4ge1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdbYW5ndWxhcngtcXJjb2RlXSBjYW52YXMgZXJyb3I6ICcsIGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3N2Zyc6XG4gICAgICAgICAgZWxlbWVudCA9IHRoaXMucmVuZGVyZXIuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgdGhpcy50b1NWRygpXG4gICAgICAgICAgICAudGhlbigoc3ZnU3RyaW5nOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRQcm9wZXJ0eShlbGVtZW50LCAnaW5uZXJIVE1MJywgc3ZnU3RyaW5nKTtcbiAgICAgICAgICAgICAgY29uc3QgaW5uZXJFbGVtZW50ID0gZWxlbWVudC5maXJzdENoaWxkIGFzIEVsZW1lbnQ7XG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKFxuICAgICAgICAgICAgICAgIGlubmVyRWxlbWVudCxcbiAgICAgICAgICAgICAgICAnaGVpZ2h0JyxcbiAgICAgICAgICAgICAgICBgJHt0aGlzLndpZHRofWBcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgICAgICAgaW5uZXJFbGVtZW50LFxuICAgICAgICAgICAgICAgICd3aWR0aCcsXG4gICAgICAgICAgICAgICAgYCR7dGhpcy53aWR0aH1gXG4gICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJFbGVtZW50KGlubmVyRWxlbWVudCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKChlKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1thbmd1bGFyeC1xcmNvZGVdIHN2ZyBlcnJvcjogJywgZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndXJsJzpcbiAgICAgICAgY2FzZSAnaW1nJzpcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBlbGVtZW50ID0gdGhpcy5yZW5kZXJlci5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICAgICAgICB0aGlzLnRvRGF0YVVSTCgpXG4gICAgICAgICAgICAudGhlbigoZGF0YVVybDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdzcmMnLCBkYXRhVXJsKTtcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJFbGVtZW50KGVsZW1lbnQpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCgoZSkgPT4ge1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdbYW5ndWxhcngtcXJjb2RlXSBpbWcvdXJsIGVycm9yOiAnLCBlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1thbmd1bGFyeC1xcmNvZGVdIEVycm9yIGdlbmVyYXRpbmcgUVIgQ29kZTogJywgZS5tZXNzYWdlKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==