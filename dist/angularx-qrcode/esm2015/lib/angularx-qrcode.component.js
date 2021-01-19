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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhcngtcXJjb2RlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvYW5kcmVhc2phY29iL0NvZGUvYW5ndWxhcngtcXJjb2RlL3Byb2plY3RzL2FuZ3VsYXJ4LXFyY29kZS9zcmMvIiwic291cmNlcyI6WyJsaWIvYW5ndWxhcngtcXJjb2RlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFFVCxLQUFLLEVBRUwsU0FBUyxFQUNULFNBQVMsR0FDVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEtBQUssTUFBTSxNQUFNLFFBQVEsQ0FBQztBQVlqQyxNQUFNLE9BQU8sZUFBZTtJQTJCMUIsWUFBb0IsUUFBbUI7UUFBbkIsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQTFCdkMsYUFBYTtRQUNHLGNBQVMsR0FBRyxFQUFFLENBQUM7UUFDZixlQUFVLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLFVBQUssR0FBRyxFQUFFLENBQUM7UUFDWCxjQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ2xCLFNBQUksR0FBRyxDQUFDLENBQUM7UUFDVCxXQUFNLEdBQUcsS0FBSyxDQUFDO1FBRS9CLHdCQUF3QjtRQUNSLHFCQUFnQixHQUFHLEtBQUssQ0FBQztRQUN6QixXQUFNLEdBQUcsRUFBRSxDQUFDO1FBRTVCLGlDQUFpQztRQUNqQixjQUFTLEdBQUcsV0FBVyxDQUFDO1FBQ3hCLGVBQVUsR0FBRyxXQUFXLENBQUM7UUFDekIsYUFBUSxHQUFHLFFBQVEsQ0FBQztRQUNwQixnQkFBVyxHQUFtQyxRQUFRLENBQUM7UUFFaEUseUJBQW9CLEdBQTRDLEdBQUcsQ0FBQztRQUMzRCxXQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsVUFBSyxHQUFHLENBQUMsQ0FBQztRQUVWLFVBQUssR0FBRyxFQUFFLENBQUM7UUFLekIsdUJBQXVCO1FBQ3ZCLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxFQUFFLEVBQUU7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QU8sQ0FBQyxLQUFLLENBQUMsbUNBQW1DLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ3hELENBQUMsQ0FBQyxDQUFDO2FBQ1I7U0FDRjtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1YsT0FBTyxDQUFDLEtBQUssQ0FBQyw4Q0FBOEMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDMUU7SUFDSCxDQUFDOzs7WUExT0YsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxRQUFRO2dCQUNsQixlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtnQkFDL0MsUUFBUSxFQUFFLDRDQUE0QzthQUN2RDs7O1lBZEMsU0FBUzs7O3dCQWlCUixLQUFLO3lCQUNMLEtBQUs7b0JBQ0wsS0FBSzt3QkFDTCxLQUFLO21CQUNMLEtBQUs7cUJBQ0wsS0FBSzsrQkFHTCxLQUFLO3FCQUNMLEtBQUs7d0JBR0wsS0FBSzt5QkFDTCxLQUFLO3VCQUNMLEtBQUs7MEJBQ0wsS0FBSzttQ0FDTCxLQUFLO3FCQUVMLEtBQUs7b0JBQ0wsS0FBSztzQkFDTCxLQUFLO29CQUNMLEtBQUs7eUJBRUwsU0FBUyxTQUFDLFlBQVksRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBSZW5kZXJlcjIsXG4gIFZpZXdDaGlsZCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgKiBhcyBRUkNvZGUgZnJvbSAncXJjb2RlJztcbmltcG9ydCB7XG4gIFFSQ29kZUVycm9yQ29ycmVjdGlvbkxldmVsLFxuICBRUkNvZGVWZXJzaW9uLFxuICBRUkNvZGVFbGVtZW50VHlwZSxcbn0gZnJvbSAnLi90eXBlcyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3FyY29kZScsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICB0ZW1wbGF0ZTogYDxkaXYgI3FyY0VsZW1lbnQgW2NsYXNzXT1cImNzc0NsYXNzXCI+PC9kaXY+YCxcbn0pXG5leHBvcnQgY2xhc3MgUVJDb2RlQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzIHtcbiAgLy8gRGVwcmVjYXRlZFxuICBASW5wdXQoKSBwdWJsaWMgY29sb3JkYXJrID0gJyc7XG4gIEBJbnB1dCgpIHB1YmxpYyBjb2xvcmxpZ2h0ID0gJyc7XG4gIEBJbnB1dCgpIHB1YmxpYyBsZXZlbCA9ICcnO1xuICBASW5wdXQoKSBwdWJsaWMgaGlkZXRpdGxlID0gZmFsc2U7XG4gIEBJbnB1dCgpIHB1YmxpYyBzaXplID0gMDtcbiAgQElucHV0KCkgcHVibGljIHVzZXN2ZyA9IGZhbHNlO1xuXG4gIC8vIFZhbGlkIGZvciAxLnggYW5kIDIueFxuICBASW5wdXQoKSBwdWJsaWMgYWxsb3dFbXB0eVN0cmluZyA9IGZhbHNlO1xuICBASW5wdXQoKSBwdWJsaWMgcXJkYXRhID0gJyc7XG5cbiAgLy8gTmV3IGZpZWxkcyBpbnRyb2R1Y2VkIGluIDIuMC4wXG4gIEBJbnB1dCgpIHB1YmxpYyBjb2xvckRhcmsgPSAnIzAwMDAwMGZmJztcbiAgQElucHV0KCkgcHVibGljIGNvbG9yTGlnaHQgPSAnI2ZmZmZmZmZmJztcbiAgQElucHV0KCkgcHVibGljIGNzc0NsYXNzID0gJ3FyY29kZSc7XG4gIEBJbnB1dCgpIHB1YmxpYyBlbGVtZW50VHlwZToga2V5b2YgdHlwZW9mIFFSQ29kZUVsZW1lbnRUeXBlID0gJ2NhbnZhcyc7XG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBlcnJvckNvcnJlY3Rpb25MZXZlbDoga2V5b2YgdHlwZW9mIFFSQ29kZUVycm9yQ29ycmVjdGlvbkxldmVsID0gJ00nO1xuICBASW5wdXQoKSBwdWJsaWMgbWFyZ2luID0gNDtcbiAgQElucHV0KCkgcHVibGljIHNjYWxlID0gNDtcbiAgQElucHV0KCkgcHVibGljIHZlcnNpb246IFFSQ29kZVZlcnNpb247XG4gIEBJbnB1dCgpIHB1YmxpYyB3aWR0aCA9IDEwO1xuXG4gIEBWaWV3Q2hpbGQoJ3FyY0VsZW1lbnQnLCB7IHN0YXRpYzogdHJ1ZSB9KSBwdWJsaWMgcXJjRWxlbWVudDogRWxlbWVudFJlZjtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIpIHtcbiAgICAvLyBEZXByZWNhdGlvbiB3YXJuaW5nc1xuICAgIGlmICh0aGlzLmNvbG9yZGFyayAhPT0gJycpIHtcbiAgICAgIGNvbnNvbGUud2FybignW2FuZ3VsYXJ4LXFyY29kZV0gY29sb3JkYXJrIGlzIGRlcHJlY2F0ZWQsIHVzZSBjb2xvckRhcmsuJyk7XG4gICAgfVxuICAgIGlmICh0aGlzLmNvbG9ybGlnaHQgIT09ICcnKSB7XG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICdbYW5ndWxhcngtcXJjb2RlXSBjb2xvcmxpZ2h0IGlzIGRlcHJlY2F0ZWQsIHVzZSBjb2xvckxpZ2h0LidcbiAgICAgICk7XG4gICAgfVxuICAgIGlmICh0aGlzLmxldmVsICE9PSAnJykge1xuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAnW2FuZ3VsYXJ4LXFyY29kZV0gbGV2ZWwgaXMgZGVwcmVjYXRlZCwgdXNlIGVycm9yQ29ycmVjdGlvbkxldmVsLidcbiAgICAgICk7XG4gICAgfVxuICAgIGlmICh0aGlzLmhpZGV0aXRsZSAhPT0gZmFsc2UpIHtcbiAgICAgIGNvbnNvbGUud2FybignW2FuZ3VsYXJ4LXFyY29kZV0gaGlkZXRpdGxlIGlzIGRlcHJlY2F0ZWQuJyk7XG4gICAgfVxuICAgIGlmICh0aGlzLnNpemUgIT09IDApIHtcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgJ1thbmd1bGFyeC1xcmNvZGVdIHNpemUgaXMgZGVwcmVjYXRlZCwgdXNlIGB3aWR0aGAuIERlZmF1bHRzIHRvIDEwLidcbiAgICAgICk7XG4gICAgfVxuICAgIGlmICh0aGlzLnVzZXN2ZyAhPT0gZmFsc2UpIHtcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgYFthbmd1bGFyeC1xcmNvZGVdIHVzZXN2ZyBpcyBkZXByZWNhdGVkLCB1c2UgW2VsZW1lbnRUeXBlXT1cIidzdmcnXCIuYFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgbmdPbkNoYW5nZXMoKTogdm9pZCB7XG4gICAgdGhpcy5jcmVhdGVRUkNvZGUoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBpc1ZhbGlkUXJDb2RlVGV4dChkYXRhOiBzdHJpbmcgfCBudWxsKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuYWxsb3dFbXB0eVN0cmluZyA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiAhKFxuICAgICAgICB0eXBlb2YgZGF0YSA9PT0gJ3VuZGVmaW5lZCcgfHxcbiAgICAgICAgZGF0YSA9PT0gJycgfHxcbiAgICAgICAgZGF0YSA9PT0gJ251bGwnIHx8XG4gICAgICAgIGRhdGEgPT09IG51bGxcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiAhKHR5cGVvZiBkYXRhID09PSAndW5kZWZpbmVkJyk7XG4gIH1cblxuICBwcml2YXRlIHRvRGF0YVVSTCgpOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShcbiAgICAgIChyZXNvbHZlOiAoYXJnOiBhbnkpID0+IGFueSwgcmVqZWN0OiAoYXJnOiBhbnkpID0+IGFueSkgPT4ge1xuICAgICAgICBRUkNvZGUudG9EYXRhVVJMKFxuICAgICAgICAgIHRoaXMucXJkYXRhLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvbG9yOiB7XG4gICAgICAgICAgICAgIGRhcms6IHRoaXMuY29sb3JEYXJrLFxuICAgICAgICAgICAgICBsaWdodDogdGhpcy5jb2xvckxpZ2h0LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yQ29ycmVjdGlvbkxldmVsOiB0aGlzLmVycm9yQ29ycmVjdGlvbkxldmVsLFxuICAgICAgICAgICAgbWFyZ2luOiB0aGlzLm1hcmdpbixcbiAgICAgICAgICAgIHNjYWxlOiB0aGlzLnNjYWxlLFxuICAgICAgICAgICAgdmVyc2lvbjogdGhpcy52ZXJzaW9uLFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXG4gICAgICAgICAgfSxcbiAgICAgICAgICAoZXJyLCB1cmwpID0+IHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXNvbHZlKHVybCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfVxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIHRvQ2FudmFzKGNhbnZhczogRWxlbWVudCk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKFxuICAgICAgKHJlc29sdmU6IChhcmc6IGFueSkgPT4gYW55LCByZWplY3Q6IChhcmc6IGFueSkgPT4gYW55KSA9PiB7XG4gICAgICAgIFFSQ29kZS50b0NhbnZhcyhcbiAgICAgICAgICBjYW52YXMsXG4gICAgICAgICAgdGhpcy5xcmRhdGEsXG4gICAgICAgICAge1xuICAgICAgICAgICAgY29sb3I6IHtcbiAgICAgICAgICAgICAgZGFyazogdGhpcy5jb2xvckRhcmssXG4gICAgICAgICAgICAgIGxpZ2h0OiB0aGlzLmNvbG9yTGlnaHQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3JDb3JyZWN0aW9uTGV2ZWw6IHRoaXMuZXJyb3JDb3JyZWN0aW9uTGV2ZWwsXG4gICAgICAgICAgICBtYXJnaW46IHRoaXMubWFyZ2luLFxuICAgICAgICAgICAgc2NhbGU6IHRoaXMuc2NhbGUsXG4gICAgICAgICAgICB2ZXJzaW9uOiB0aGlzLnZlcnNpb24sXG4gICAgICAgICAgICB3aWR0aDogdGhpcy53aWR0aCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIChlcnJvcikgPT4ge1xuICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXNvbHZlKCdzdWNjZXNzJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfVxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIHRvU1ZHKCk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKFxuICAgICAgKHJlc29sdmU6IChhcmc6IGFueSkgPT4gYW55LCByZWplY3Q6IChhcmc6IGFueSkgPT4gYW55KSA9PiB7XG4gICAgICAgIFFSQ29kZS50b1N0cmluZyhcbiAgICAgICAgICB0aGlzLnFyZGF0YSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjb2xvcjoge1xuICAgICAgICAgICAgICBkYXJrOiB0aGlzLmNvbG9yRGFyayxcbiAgICAgICAgICAgICAgbGlnaHQ6IHRoaXMuY29sb3JMaWdodCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvckNvcnJlY3Rpb25MZXZlbDogdGhpcy5lcnJvckNvcnJlY3Rpb25MZXZlbCxcbiAgICAgICAgICAgIG1hcmdpbjogdGhpcy5tYXJnaW4sXG4gICAgICAgICAgICBzY2FsZTogdGhpcy5zY2FsZSxcbiAgICAgICAgICAgIHR5cGU6ICdzdmcnLFxuICAgICAgICAgICAgdmVyc2lvbjogdGhpcy52ZXJzaW9uLFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXG4gICAgICAgICAgfSxcbiAgICAgICAgICAoZXJyLCB1cmwpID0+IHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXNvbHZlKHVybCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfVxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlckVsZW1lbnQoZWxlbWVudDogRWxlbWVudCk6IHZvaWQge1xuICAgIGZvciAoY29uc3Qgbm9kZSBvZiB0aGlzLnFyY0VsZW1lbnQubmF0aXZlRWxlbWVudC5jaGlsZE5vZGVzKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNoaWxkKHRoaXMucXJjRWxlbWVudC5uYXRpdmVFbGVtZW50LCBub2RlKTtcbiAgICB9XG4gICAgdGhpcy5yZW5kZXJlci5hcHBlbmRDaGlsZCh0aGlzLnFyY0VsZW1lbnQubmF0aXZlRWxlbWVudCwgZWxlbWVudCk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZVFSQ29kZSgpOiB2b2lkIHtcbiAgICAvLyBTZXQgc2Vuc2l0aXZlIGRlZmF1bHRzXG4gICAgaWYgKHRoaXMudmVyc2lvbiAmJiB0aGlzLnZlcnNpb24gPiA0MCkge1xuICAgICAgY29uc29sZS53YXJuKCdbYW5ndWxhcngtcXJjb2RlXSBtYXggdmFsdWUgZm9yIGB2ZXJzaW9uYCBpcyA0MCcpO1xuICAgICAgdGhpcy52ZXJzaW9uID0gNDA7XG4gICAgfSBlbHNlIGlmICh0aGlzLnZlcnNpb24gJiYgdGhpcy52ZXJzaW9uIDwgMSkge1xuICAgICAgY29uc29sZS53YXJuKCdbYW5ndWxhcngtcXJjb2RlXWBtaW4gdmFsdWUgZm9yIGB2ZXJzaW9uYCBpcyAxJyk7XG4gICAgICB0aGlzLnZlcnNpb24gPSAxO1xuICAgIH0gZWxzZSBpZiAodGhpcy52ZXJzaW9uICE9PSB1bmRlZmluZWQgJiYgaXNOYU4odGhpcy52ZXJzaW9uKSkge1xuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAnW2FuZ3VsYXJ4LXFyY29kZV0gdmVyc2lvbiBzaG91bGQgYmUgYSBudW1iZXIsIGRlZmF1bHRpbmcgdG8gYXV0by4nXG4gICAgICApO1xuICAgICAgdGhpcy52ZXJzaW9uID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBpZiAoIXRoaXMuaXNWYWxpZFFyQ29kZVRleHQodGhpcy5xcmRhdGEpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAnW2FuZ3VsYXJ4LXFyY29kZV0gRmllbGQgYHFyZGF0YWAgaXMgZW1wdHksIHNldGBhbGxvd0VtcHR5U3RyaW5nPVwidHJ1ZVwiYCB0byBvdmVyd3JpdGUgdGhpcyBiZWhhdmlvdXIuJ1xuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBsZXQgZWxlbWVudDogRWxlbWVudDtcblxuICAgICAgc3dpdGNoICh0aGlzLmVsZW1lbnRUeXBlKSB7XG4gICAgICAgIGNhc2UgJ2NhbnZhcyc6XG4gICAgICAgICAgZWxlbWVudCA9IHRoaXMucmVuZGVyZXIuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgICAgdGhpcy50b0NhbnZhcyhlbGVtZW50KVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLnJlbmRlckVsZW1lbnQoZWxlbWVudCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKChlKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1thbmd1bGFyeC1xcmNvZGVdIGNhbnZhcyBlcnJvcjogJywgZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnc3ZnJzpcbiAgICAgICAgICBlbGVtZW50ID0gdGhpcy5yZW5kZXJlci5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICB0aGlzLnRvU1ZHKClcbiAgICAgICAgICAgIC50aGVuKChzdmdTdHJpbmc6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFByb3BlcnR5KGVsZW1lbnQsICdpbm5lckhUTUwnLCBzdmdTdHJpbmcpO1xuICAgICAgICAgICAgICBjb25zdCBpbm5lckVsZW1lbnQgPSBlbGVtZW50LmZpcnN0Q2hpbGQgYXMgRWxlbWVudDtcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJFbGVtZW50KGlubmVyRWxlbWVudCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKChlKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1thbmd1bGFyeC1xcmNvZGVdIHN2ZyBlcnJvcjogJywgZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndXJsJzpcbiAgICAgICAgY2FzZSAnaW1nJzpcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBlbGVtZW50ID0gdGhpcy5yZW5kZXJlci5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICAgICAgICB0aGlzLnRvRGF0YVVSTCgpXG4gICAgICAgICAgICAudGhlbigoZGF0YVVybDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdzcmMnLCBkYXRhVXJsKTtcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJFbGVtZW50KGVsZW1lbnQpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCgoZSkgPT4ge1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdbYW5ndWxhcngtcXJjb2RlXSBpbWcvdXJsIGVycm9yOiAnLCBlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1thbmd1bGFyeC1xcmNvZGVdIEVycm9yIGdlbmVyYXRpbmcgUVIgQ29kZTogJywgZS5tZXNzYWdlKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==