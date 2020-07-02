import { ChangeDetectionStrategy, Component, Inject, Input, PLATFORM_ID, Renderer2, ViewChild, } from '@angular/core';
import * as QRCode from 'qrcode';
export class QRCodeComponent {
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
    // public ngAfterViewInit() {
    //   if (isPlatformServer(this.platformId)) {
    //     return;
    //   }
    //   // if (!QRCode) {
    //   //   QRCode = require('qrcode');
    //   // }
    //   this.createQRCode();
    // }
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
                    this.toCanvas(element)
                        .then(() => {
                        this.renderElement(element);
                    })
                        .catch((e) => {
                        console.error('[angularx-qrcode] canvas error: ', e);
                    });
                    break;
                case 'svg':
                    element = this.renderer.createElement('svg', 'svg');
                    this.toSVG()
                        .then((svgString) => {
                        element.innerHTML = svgString;
                        this.renderer.setAttribute(element, 'height', `${this.width}`);
                        this.renderer.setAttribute(element, 'width', `${this.width}`);
                        this.renderElement(element);
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
    { type: Renderer2 },
    { type: undefined, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhcngtcXJjb2RlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXJ4LXFyY29kZS9zcmMvbGliL2FuZ3VsYXJ4LXFyY29kZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixTQUFTLEVBRVQsTUFBTSxFQUNOLEtBQUssRUFFTCxXQUFXLEVBQ1gsU0FBUyxFQUNULFNBQVMsR0FDVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEtBQUssTUFBTSxNQUFNLFFBQVEsQ0FBQztBQVlqQyxNQUFNLE9BQU8sZUFBZTtJQTZCMUIsWUFDVSxRQUFtQixFQUNXLFVBQWU7UUFEN0MsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUNXLGVBQVUsR0FBVixVQUFVLENBQUs7UUE5QnZELGFBQWE7UUFDRyxjQUFTLEdBQUcsRUFBRSxDQUFDO1FBQ2YsZUFBVSxHQUFHLEVBQUUsQ0FBQztRQUNoQixVQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ1gsY0FBUyxHQUFHLEtBQUssQ0FBQztRQUNsQixTQUFJLEdBQUcsQ0FBQyxDQUFDO1FBQ1QsV0FBTSxHQUFHLEtBQUssQ0FBQztRQUUvQix3QkFBd0I7UUFDUixxQkFBZ0IsR0FBRyxLQUFLLENBQUM7UUFDekIsV0FBTSxHQUFHLEVBQUUsQ0FBQztRQUU1QixpQ0FBaUM7UUFDakIsY0FBUyxHQUFHLFdBQVcsQ0FBQztRQUN4QixlQUFVLEdBQUcsV0FBVyxDQUFDO1FBQ3pCLGFBQVEsR0FBRyxRQUFRLENBQUM7UUFDcEIsZ0JBQVcsR0FBbUMsUUFBUSxDQUFDO1FBRWhFLHlCQUFvQixHQUE0QyxHQUFHLENBQUM7UUFDM0QsV0FBTSxHQUFHLENBQUMsQ0FBQztRQUNYLFVBQUssR0FBRyxDQUFDLENBQUM7UUFFVixVQUFLLEdBQUcsRUFBRSxDQUFDO1FBSXBCLFdBQU0sR0FBUSxJQUFJLENBQUM7UUFNeEIsd0JBQXdCO1FBQ3hCLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxFQUFFLEVBQUU7WUFDekIsT0FBTyxDQUFDLElBQUksQ0FBQywyREFBMkQsQ0FBQyxDQUFDO1NBQzNFO1FBQ0QsSUFBSSxJQUFJLENBQUMsVUFBVSxLQUFLLEVBQUUsRUFBRTtZQUMxQixPQUFPLENBQUMsSUFBSSxDQUNWLDZEQUE2RCxDQUM5RCxDQUFDO1NBQ0g7UUFDRCxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssRUFBRSxFQUFFO1lBQ3JCLE9BQU8sQ0FBQyxJQUFJLENBQ1Ysa0VBQWtFLENBQ25FLENBQUM7U0FDSDtRQUNELElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxLQUFLLEVBQUU7WUFDNUIsT0FBTyxDQUFDLElBQUksQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO1NBQzVEO1FBQ0QsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRTtZQUNuQixPQUFPLENBQUMsSUFBSSxDQUNWLG9FQUFvRSxDQUNyRSxDQUFDO1NBQ0g7UUFDRCxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssS0FBSyxFQUFFO1lBQ3pCLE9BQU8sQ0FBQyxJQUFJLENBQ1Ysb0VBQW9FLENBQ3JFLENBQUM7U0FDSDtJQUNILENBQUM7SUFFRCw2QkFBNkI7SUFDN0IsNkNBQTZDO0lBQzdDLGNBQWM7SUFDZCxNQUFNO0lBQ04sc0JBQXNCO0lBQ3RCLHFDQUFxQztJQUNyQyxTQUFTO0lBQ1QseUJBQXlCO0lBQ3pCLElBQUk7SUFFRyxXQUFXO1FBQ2hCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRVMsaUJBQWlCLENBQUMsSUFBbUI7UUFDN0MsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEtBQUssS0FBSyxFQUFFO1lBQ25DLE9BQU8sQ0FBQyxDQUNOLE9BQU8sSUFBSSxLQUFLLFdBQVc7Z0JBQzNCLElBQUksS0FBSyxFQUFFO2dCQUNYLElBQUksS0FBSyxNQUFNO2dCQUNmLElBQUksS0FBSyxJQUFJLENBQ2QsQ0FBQztTQUNIO1FBQ0QsT0FBTyxDQUFDLENBQUMsT0FBTyxJQUFJLEtBQUssV0FBVyxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVPLFNBQVM7UUFDZixPQUFPLElBQUksT0FBTyxDQUNoQixDQUFDLE9BQTBCLEVBQUUsTUFBeUIsRUFBRSxFQUFFO1lBQ3hELE1BQU0sQ0FBQyxTQUFTLENBQ2QsSUFBSSxDQUFDLE1BQU0sRUFDWDtnQkFDRSxLQUFLLEVBQUU7b0JBQ0wsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTO29CQUNwQixLQUFLLEVBQUUsSUFBSSxDQUFDLFVBQVU7aUJBQ3ZCO2dCQUNELG9CQUFvQixFQUFFLElBQUksQ0FBQyxvQkFBb0I7Z0JBQy9DLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtnQkFDbkIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO2dCQUNqQixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87Z0JBQ3JCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSzthQUNsQixFQUNELENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO2dCQUNYLElBQUksR0FBRyxFQUFFO29CQUNQLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDYjtxQkFBTTtvQkFDTCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ2Q7WUFDSCxDQUFDLENBQ0YsQ0FBQztRQUNKLENBQUMsQ0FDRixDQUFDO0lBQ0osQ0FBQztJQUVPLFFBQVEsQ0FBQyxNQUFlO1FBQzlCLE9BQU8sSUFBSSxPQUFPLENBQ2hCLENBQUMsT0FBMEIsRUFBRSxNQUF5QixFQUFFLEVBQUU7WUFDeEQsTUFBTSxDQUFDLFFBQVEsQ0FDYixNQUFNLEVBQ04sSUFBSSxDQUFDLE1BQU0sRUFDWDtnQkFDRSxLQUFLLEVBQUU7b0JBQ0wsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTO29CQUNwQixLQUFLLEVBQUUsSUFBSSxDQUFDLFVBQVU7aUJBQ3ZCO2dCQUNELG9CQUFvQixFQUFFLElBQUksQ0FBQyxvQkFBb0I7Z0JBQy9DLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtnQkFDbkIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO2dCQUNqQixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87Z0JBQ3JCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSzthQUNsQixFQUNELENBQUMsS0FBSyxFQUFFLEVBQUU7Z0JBQ1IsSUFBSSxLQUFLLEVBQUU7b0JBQ1QsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUNmO3FCQUFNO29CQUNMLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztpQkFDcEI7WUFDSCxDQUFDLENBQ0YsQ0FBQztRQUNKLENBQUMsQ0FDRixDQUFDO0lBQ0osQ0FBQztJQUVPLEtBQUs7UUFDWCxPQUFPLElBQUksT0FBTyxDQUNoQixDQUFDLE9BQTBCLEVBQUUsTUFBeUIsRUFBRSxFQUFFO1lBQ3hELE1BQU0sQ0FBQyxRQUFRLENBQ2IsSUFBSSxDQUFDLE1BQU0sRUFDWDtnQkFDRSxLQUFLLEVBQUU7b0JBQ0wsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTO29CQUNwQixLQUFLLEVBQUUsSUFBSSxDQUFDLFVBQVU7aUJBQ3ZCO2dCQUNELG9CQUFvQixFQUFFLElBQUksQ0FBQyxvQkFBb0I7Z0JBQy9DLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtnQkFDbkIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO2dCQUNqQixJQUFJLEVBQUUsS0FBSztnQkFDWCxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87Z0JBQ3JCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSzthQUNsQixFQUNELENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO2dCQUNYLElBQUksR0FBRyxFQUFFO29CQUNQLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDYjtxQkFBTTtvQkFDTCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ2Q7WUFDSCxDQUFDLENBQ0YsQ0FBQztRQUNKLENBQUMsQ0FDRixDQUFDO0lBQ0osQ0FBQztJQUVPLGFBQWEsQ0FBQyxPQUFnQjtRQUNwQyxLQUFLLE1BQU0sSUFBSSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBRTtZQUMzRCxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUNoRTtRQUNELElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFFTyxZQUFZO1FBQ2xCLHlCQUF5QjtRQUN6QixJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLEVBQUU7WUFDckMsT0FBTyxDQUFDLElBQUksQ0FBQyxpREFBaUQsQ0FBQyxDQUFDO1lBQ2hFLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1NBQ25CO2FBQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxFQUFFO1lBQzNDLE9BQU8sQ0FBQyxJQUFJLENBQUMsZ0RBQWdELENBQUMsQ0FBQztZQUMvRCxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztTQUNsQjthQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxTQUFTLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUM1RCxPQUFPLENBQUMsSUFBSSxDQUNWLGtFQUFrRSxDQUNuRSxDQUFDO1lBQ0YsSUFBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUM7U0FDMUI7UUFFRCxJQUFJO1lBQ0YsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQ3hDLE1BQU0sSUFBSSxLQUFLLENBQUMsMkNBQTJDLENBQUMsQ0FBQzthQUM5RDtZQUVELElBQUksT0FBZ0IsQ0FBQztZQUVyQixRQUFRLElBQUksQ0FBQyxXQUFXLEVBQUU7Z0JBQ3hCLEtBQUssUUFBUTtvQkFDWCxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ2hELElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO3lCQUNuQixJQUFJLENBQUMsR0FBRyxFQUFFO3dCQUNULElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQzlCLENBQUMsQ0FBQzt5QkFDRCxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTt3QkFDWCxPQUFPLENBQUMsS0FBSyxDQUFDLGtDQUFrQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUN2RCxDQUFDLENBQUMsQ0FBQztvQkFDTCxNQUFNO2dCQUNSLEtBQUssS0FBSztvQkFDUixPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUNwRCxJQUFJLENBQUMsS0FBSyxFQUFFO3lCQUNULElBQUksQ0FBQyxDQUFDLFNBQWlCLEVBQUUsRUFBRTt3QkFDMUIsT0FBTyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7d0JBQzlCLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQzt3QkFDL0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO3dCQUM5RCxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUM5QixDQUFDLENBQUM7eUJBQ0QsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7d0JBQ1gsT0FBTyxDQUFDLEtBQUssQ0FBQywrQkFBK0IsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDcEQsQ0FBQyxDQUFDLENBQUM7b0JBQ0wsTUFBTTtnQkFDUixLQUFLLEtBQUssQ0FBQztnQkFDWCxLQUFLLEtBQUssQ0FBQztnQkFDWDtvQkFDRSxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQzdDLElBQUksQ0FBQyxTQUFTLEVBQUU7eUJBQ2IsSUFBSSxDQUFDLENBQUMsT0FBZSxFQUFFLEVBQUU7d0JBQ3hCLE9BQU8sQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO3dCQUNyQyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUM5QixDQUFDLENBQUM7eUJBQ0QsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7d0JBQ1gsT0FBTyxDQUFDLEtBQUssQ0FBQyxtQ0FBbUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDeEQsQ0FBQyxDQUFDLENBQUM7YUFDUjtTQUNGO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDVixPQUFPLENBQUMsS0FBSyxDQUFDLDhDQUE4QyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUMxRTtJQUNILENBQUM7OztZQXhQRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxRQUFRLEVBQUUsNENBQTRDO2FBQ3ZEOzs7WUFkQyxTQUFTOzRDQThDTixNQUFNLFNBQUMsV0FBVzs7O3dCQTdCcEIsS0FBSzt5QkFDTCxLQUFLO29CQUNMLEtBQUs7d0JBQ0wsS0FBSzttQkFDTCxLQUFLO3FCQUNMLEtBQUs7K0JBR0wsS0FBSztxQkFDTCxLQUFLO3dCQUdMLEtBQUs7eUJBQ0wsS0FBSzt1QkFDTCxLQUFLOzBCQUNMLEtBQUs7bUNBQ0wsS0FBSztxQkFFTCxLQUFLO29CQUNMLEtBQUs7c0JBQ0wsS0FBSztvQkFDTCxLQUFLO3lCQUVMLFNBQVMsU0FBQyxZQUFZLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBQTEFURk9STV9JRCxcbiAgUmVuZGVyZXIyLFxuICBWaWV3Q2hpbGQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0ICogYXMgUVJDb2RlIGZyb20gJ3FyY29kZSc7XG5pbXBvcnQge1xuICBRUkNvZGVFcnJvckNvcnJlY3Rpb25MZXZlbCxcbiAgUVJDb2RlVmVyc2lvbixcbiAgUVJDb2RlRWxlbWVudFR5cGUsXG59IGZyb20gJy4vdHlwZXMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdxcmNvZGUnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgdGVtcGxhdGU6IGA8ZGl2ICNxcmNFbGVtZW50IFtjbGFzc109XCJjc3NDbGFzc1wiPjwvZGl2PmAsXG59KVxuZXhwb3J0IGNsYXNzIFFSQ29kZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG4gIC8vIERlcHJlY2F0ZWRcbiAgQElucHV0KCkgcHVibGljIGNvbG9yZGFyayA9ICcnO1xuICBASW5wdXQoKSBwdWJsaWMgY29sb3JsaWdodCA9ICcnO1xuICBASW5wdXQoKSBwdWJsaWMgbGV2ZWwgPSAnJztcbiAgQElucHV0KCkgcHVibGljIGhpZGV0aXRsZSA9IGZhbHNlO1xuICBASW5wdXQoKSBwdWJsaWMgc2l6ZSA9IDA7XG4gIEBJbnB1dCgpIHB1YmxpYyB1c2VzdmcgPSBmYWxzZTtcblxuICAvLyBWYWxpZCBmb3IgMS54IGFuZCAyLnhcbiAgQElucHV0KCkgcHVibGljIGFsbG93RW1wdHlTdHJpbmcgPSBmYWxzZTtcbiAgQElucHV0KCkgcHVibGljIHFyZGF0YSA9ICcnO1xuXG4gIC8vIE5ldyBmaWVsZHMgaW50cm9kdWNlZCBpbiAyLjAuMFxuICBASW5wdXQoKSBwdWJsaWMgY29sb3JEYXJrID0gJyMwMDAwMDBmZic7XG4gIEBJbnB1dCgpIHB1YmxpYyBjb2xvckxpZ2h0ID0gJyNmZmZmZmZmZic7XG4gIEBJbnB1dCgpIHB1YmxpYyBjc3NDbGFzcyA9ICdxcmNvZGUnO1xuICBASW5wdXQoKSBwdWJsaWMgZWxlbWVudFR5cGU6IGtleW9mIHR5cGVvZiBRUkNvZGVFbGVtZW50VHlwZSA9ICdjYW52YXMnO1xuICBASW5wdXQoKVxuICBwdWJsaWMgZXJyb3JDb3JyZWN0aW9uTGV2ZWw6IGtleW9mIHR5cGVvZiBRUkNvZGVFcnJvckNvcnJlY3Rpb25MZXZlbCA9ICdNJztcbiAgQElucHV0KCkgcHVibGljIG1hcmdpbiA9IDQ7XG4gIEBJbnB1dCgpIHB1YmxpYyBzY2FsZSA9IDQ7XG4gIEBJbnB1dCgpIHB1YmxpYyB2ZXJzaW9uOiBRUkNvZGVWZXJzaW9uO1xuICBASW5wdXQoKSBwdWJsaWMgd2lkdGggPSAxMDtcblxuICBAVmlld0NoaWxkKCdxcmNFbGVtZW50JywgeyBzdGF0aWM6IHRydWUgfSkgcHVibGljIHFyY0VsZW1lbnQ6IEVsZW1lbnRSZWY7XG5cbiAgcHVibGljIHFyY29kZTogYW55ID0gbnVsbDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgQEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSByZWFkb25seSBwbGF0Zm9ybUlkOiBhbnlcbiAgKSB7XG4gICAgLy8gRGVwcmVjdGF0aW9uIHdhcm5pbmdzXG4gICAgaWYgKHRoaXMuY29sb3JkYXJrICE9PSAnJykge1xuICAgICAgY29uc29sZS53YXJuKCdbYW5ndWxhcngtcXJjb2RlXSBjb2xvcmRhcmsgaXMgZGVwcmVjYXRlZCwgdXNlIGNvbG9yRGFyay4nKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuY29sb3JsaWdodCAhPT0gJycpIHtcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgJ1thbmd1bGFyeC1xcmNvZGVdIGNvbG9ybGlnaHQgaXMgZGVwcmVjYXRlZCwgdXNlIGNvbG9yTGlnaHQuJ1xuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubGV2ZWwgIT09ICcnKSB7XG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICdbYW5ndWxhcngtcXJjb2RlXSBsZXZlbCBpcyBkZXByZWNhdGVkLCB1c2UgZXJyb3JDb3JyZWN0aW9uTGV2ZWwuJ1xuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuaGlkZXRpdGxlICE9PSBmYWxzZSkge1xuICAgICAgY29uc29sZS53YXJuKCdbYW5ndWxhcngtcXJjb2RlXSBoaWRldGl0bGUgaXMgZGVwcmVjYXRlZC4nKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuc2l6ZSAhPT0gMCkge1xuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAnW2FuZ3VsYXJ4LXFyY29kZV0gc2l6ZSBpcyBkZXByZWNhdGVkLCB1c2UgYHdpZHRoYC4gRGVmYXVsdHMgdG8gMTAuJ1xuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKHRoaXMudXNlc3ZnICE9PSBmYWxzZSkge1xuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICBgW2FuZ3VsYXJ4LXFyY29kZV0gdXNlc3ZnIGlzIGRlcHJlY2F0ZWQsIHVzZSBbZWxlbWVudFR5cGVdPVwiJ2ltZydcIi5gXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIC8vIHB1YmxpYyBuZ0FmdGVyVmlld0luaXQoKSB7XG4gIC8vICAgaWYgKGlzUGxhdGZvcm1TZXJ2ZXIodGhpcy5wbGF0Zm9ybUlkKSkge1xuICAvLyAgICAgcmV0dXJuO1xuICAvLyAgIH1cbiAgLy8gICAvLyBpZiAoIVFSQ29kZSkge1xuICAvLyAgIC8vICAgUVJDb2RlID0gcmVxdWlyZSgncXJjb2RlJyk7XG4gIC8vICAgLy8gfVxuICAvLyAgIHRoaXMuY3JlYXRlUVJDb2RlKCk7XG4gIC8vIH1cblxuICBwdWJsaWMgbmdPbkNoYW5nZXMoKTogdm9pZCB7XG4gICAgdGhpcy5jcmVhdGVRUkNvZGUoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBpc1ZhbGlkUXJDb2RlVGV4dChkYXRhOiBzdHJpbmcgfCBudWxsKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuYWxsb3dFbXB0eVN0cmluZyA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiAhKFxuICAgICAgICB0eXBlb2YgZGF0YSA9PT0gJ3VuZGVmaW5lZCcgfHxcbiAgICAgICAgZGF0YSA9PT0gJycgfHxcbiAgICAgICAgZGF0YSA9PT0gJ251bGwnIHx8XG4gICAgICAgIGRhdGEgPT09IG51bGxcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiAhKHR5cGVvZiBkYXRhID09PSAndW5kZWZpbmVkJyk7XG4gIH1cblxuICBwcml2YXRlIHRvRGF0YVVSTCgpOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShcbiAgICAgIChyZXNvbHZlOiAoYXJnOiBhbnkpID0+IGFueSwgcmVqZWN0OiAoYXJnOiBhbnkpID0+IGFueSkgPT4ge1xuICAgICAgICBRUkNvZGUudG9EYXRhVVJMKFxuICAgICAgICAgIHRoaXMucXJkYXRhLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvbG9yOiB7XG4gICAgICAgICAgICAgIGRhcms6IHRoaXMuY29sb3JEYXJrLFxuICAgICAgICAgICAgICBsaWdodDogdGhpcy5jb2xvckxpZ2h0LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yQ29ycmVjdGlvbkxldmVsOiB0aGlzLmVycm9yQ29ycmVjdGlvbkxldmVsLFxuICAgICAgICAgICAgbWFyZ2luOiB0aGlzLm1hcmdpbixcbiAgICAgICAgICAgIHNjYWxlOiB0aGlzLnNjYWxlLFxuICAgICAgICAgICAgdmVyc2lvbjogdGhpcy52ZXJzaW9uLFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXG4gICAgICAgICAgfSxcbiAgICAgICAgICAoZXJyLCB1cmwpID0+IHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXNvbHZlKHVybCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfVxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIHRvQ2FudmFzKGNhbnZhczogRWxlbWVudCk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKFxuICAgICAgKHJlc29sdmU6IChhcmc6IGFueSkgPT4gYW55LCByZWplY3Q6IChhcmc6IGFueSkgPT4gYW55KSA9PiB7XG4gICAgICAgIFFSQ29kZS50b0NhbnZhcyhcbiAgICAgICAgICBjYW52YXMsXG4gICAgICAgICAgdGhpcy5xcmRhdGEsXG4gICAgICAgICAge1xuICAgICAgICAgICAgY29sb3I6IHtcbiAgICAgICAgICAgICAgZGFyazogdGhpcy5jb2xvckRhcmssXG4gICAgICAgICAgICAgIGxpZ2h0OiB0aGlzLmNvbG9yTGlnaHQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3JDb3JyZWN0aW9uTGV2ZWw6IHRoaXMuZXJyb3JDb3JyZWN0aW9uTGV2ZWwsXG4gICAgICAgICAgICBtYXJnaW46IHRoaXMubWFyZ2luLFxuICAgICAgICAgICAgc2NhbGU6IHRoaXMuc2NhbGUsXG4gICAgICAgICAgICB2ZXJzaW9uOiB0aGlzLnZlcnNpb24sXG4gICAgICAgICAgICB3aWR0aDogdGhpcy53aWR0aCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIChlcnJvcikgPT4ge1xuICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXNvbHZlKCdzdWNjZXNzJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfVxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIHRvU1ZHKCk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKFxuICAgICAgKHJlc29sdmU6IChhcmc6IGFueSkgPT4gYW55LCByZWplY3Q6IChhcmc6IGFueSkgPT4gYW55KSA9PiB7XG4gICAgICAgIFFSQ29kZS50b1N0cmluZyhcbiAgICAgICAgICB0aGlzLnFyZGF0YSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjb2xvcjoge1xuICAgICAgICAgICAgICBkYXJrOiB0aGlzLmNvbG9yRGFyayxcbiAgICAgICAgICAgICAgbGlnaHQ6IHRoaXMuY29sb3JMaWdodCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvckNvcnJlY3Rpb25MZXZlbDogdGhpcy5lcnJvckNvcnJlY3Rpb25MZXZlbCxcbiAgICAgICAgICAgIG1hcmdpbjogdGhpcy5tYXJnaW4sXG4gICAgICAgICAgICBzY2FsZTogdGhpcy5zY2FsZSxcbiAgICAgICAgICAgIHR5cGU6ICdzdmcnLFxuICAgICAgICAgICAgdmVyc2lvbjogdGhpcy52ZXJzaW9uLFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXG4gICAgICAgICAgfSxcbiAgICAgICAgICAoZXJyLCB1cmwpID0+IHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXNvbHZlKHVybCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfVxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlckVsZW1lbnQoZWxlbWVudDogRWxlbWVudCk6IHZvaWQge1xuICAgIGZvciAoY29uc3Qgbm9kZSBvZiB0aGlzLnFyY0VsZW1lbnQubmF0aXZlRWxlbWVudC5jaGlsZE5vZGVzKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNoaWxkKHRoaXMucXJjRWxlbWVudC5uYXRpdmVFbGVtZW50LCBub2RlKTtcbiAgICB9XG4gICAgdGhpcy5yZW5kZXJlci5hcHBlbmRDaGlsZCh0aGlzLnFyY0VsZW1lbnQubmF0aXZlRWxlbWVudCwgZWxlbWVudCk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZVFSQ29kZSgpOiB2b2lkIHtcbiAgICAvLyBTZXQgc2Vuc2l0aXZlIGRlZmF1bHRzXG4gICAgaWYgKHRoaXMudmVyc2lvbiAmJiB0aGlzLnZlcnNpb24gPiA0MCkge1xuICAgICAgY29uc29sZS53YXJuKCdbYW5ndWxhcngtcXJjb2RlXSBtYXggdmFsdWUgZm9yIGB2ZXJzaW9uYCBpcyA0MCcpO1xuICAgICAgdGhpcy52ZXJzaW9uID0gNDA7XG4gICAgfSBlbHNlIGlmICh0aGlzLnZlcnNpb24gJiYgdGhpcy52ZXJzaW9uIDwgMSkge1xuICAgICAgY29uc29sZS53YXJuKCdbYW5ndWxhcngtcXJjb2RlXWBtaW4gdmFsdWUgZm9yIGB2ZXJzaW9uYCBpcyAxJyk7XG4gICAgICB0aGlzLnZlcnNpb24gPSAxO1xuICAgIH0gZWxzZSBpZiAodGhpcy52ZXJzaW9uICE9PSB1bmRlZmluZWQgJiYgaXNOYU4odGhpcy52ZXJzaW9uKSkge1xuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAnW2FuZ3VsYXJ4LXFyY29kZV0gdmVyc2lvbiBzaG91bGQgYmUgYSBudW1iZXIsIGRlZmF1bHRpbmcgdG8gYXV0bydcbiAgICAgICk7XG4gICAgICB0aGlzLnZlcnNpb24gPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGlmICghdGhpcy5pc1ZhbGlkUXJDb2RlVGV4dCh0aGlzLnFyZGF0YSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdbYW5ndWxhcngtcXJjb2RlXSBGaWVsZCBgcXJkYXRhYCBpcyBlbXB0eScpO1xuICAgICAgfVxuXG4gICAgICBsZXQgZWxlbWVudDogRWxlbWVudDtcblxuICAgICAgc3dpdGNoICh0aGlzLmVsZW1lbnRUeXBlKSB7XG4gICAgICAgIGNhc2UgJ2NhbnZhcyc6XG4gICAgICAgICAgZWxlbWVudCA9IHRoaXMucmVuZGVyZXIuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgICAgdGhpcy50b0NhbnZhcyhlbGVtZW50KVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLnJlbmRlckVsZW1lbnQoZWxlbWVudCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKChlKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1thbmd1bGFyeC1xcmNvZGVdIGNhbnZhcyBlcnJvcjogJywgZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnc3ZnJzpcbiAgICAgICAgICBlbGVtZW50ID0gdGhpcy5yZW5kZXJlci5jcmVhdGVFbGVtZW50KCdzdmcnLCAnc3ZnJyk7XG4gICAgICAgICAgdGhpcy50b1NWRygpXG4gICAgICAgICAgICAudGhlbigoc3ZnU3RyaW5nOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSBzdmdTdHJpbmc7XG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKGVsZW1lbnQsICdoZWlnaHQnLCBgJHt0aGlzLndpZHRofWApO1xuICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEF0dHJpYnV0ZShlbGVtZW50LCAnd2lkdGgnLCBgJHt0aGlzLndpZHRofWApO1xuICAgICAgICAgICAgICB0aGlzLnJlbmRlckVsZW1lbnQoZWxlbWVudCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKChlKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1thbmd1bGFyeC1xcmNvZGVdIHN2ZyBlcnJvcjogJywgZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndXJsJzpcbiAgICAgICAgY2FzZSAnaW1nJzpcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBlbGVtZW50ID0gdGhpcy5yZW5kZXJlci5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICAgICAgICB0aGlzLnRvRGF0YVVSTCgpXG4gICAgICAgICAgICAudGhlbigoZGF0YVVybDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdzcmMnLCBkYXRhVXJsKTtcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJFbGVtZW50KGVsZW1lbnQpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCgoZSkgPT4ge1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdbYW5ndWxhcngtcXJjb2RlXSBpbWcvdXJsIGVycm9yOiAnLCBlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1thbmd1bGFyeC1xcmNvZGVdIEVycm9yIGdlbmVyYXRpbmcgUVIgQ29kZTogJywgZS5tZXNzYWdlKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==