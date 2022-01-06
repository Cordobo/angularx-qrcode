import { ChangeDetectionStrategy, Component, Input, ViewChild, } from "@angular/core";
import * as QRCode from "qrcode";
import * as i0 from "@angular/core";
export class QRCodeComponent {
    constructor(renderer) {
        this.renderer = renderer;
        this.allowEmptyString = false;
        this.colorDark = "#000000ff";
        this.colorLight = "#ffffffff";
        this.cssClass = "qrcode";
        this.elementType = "canvas";
        this.errorCorrectionLevel = "M";
        this.margin = 4;
        this.qrdata = "";
        this.scale = 4;
        this.width = 10;
    }
    ngOnChanges() {
        this.createQRCode();
    }
    isValidQrCodeText(data) {
        if (this.allowEmptyString === false) {
            return !(typeof data === "undefined" ||
                data === "" ||
                data === "null" ||
                data === null);
        }
        return !(typeof data === "undefined");
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
                    resolve("success");
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
                type: "svg",
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
            console.warn("[angularx-qrcode] max value for `version` is 40");
            this.version = 40;
        }
        else if (this.version && this.version < 1) {
            console.warn("[angularx-qrcode]`min value for `version` is 1");
            this.version = 1;
        }
        else if (this.version !== undefined && isNaN(this.version)) {
            console.warn("[angularx-qrcode] version should be a number, defaulting to auto.");
            this.version = undefined;
        }
        try {
            if (!this.isValidQrCodeText(this.qrdata)) {
                throw new Error("[angularx-qrcode] Field `qrdata` is empty, set 'allowEmptyString=\"true\"' to overwrite this behaviour.");
            }
            // This is a fix to allow an empty string as qrdata
            if (this.isValidQrCodeText(this.qrdata) && this.qrdata === "") {
                this.qrdata = " ";
            }
            let element;
            switch (this.elementType) {
                case "canvas":
                    element = this.renderer.createElement("canvas");
                    this.toCanvas(element)
                        .then(() => {
                        this.renderElement(element);
                    })
                        .catch((e) => {
                        console.error("[angularx-qrcode] canvas error:", e);
                    });
                    break;
                case "svg":
                    element = this.renderer.createElement("div");
                    this.toSVG()
                        .then((svgString) => {
                        this.renderer.setProperty(element, "innerHTML", svgString);
                        const innerElement = element.firstChild;
                        this.renderer.setAttribute(innerElement, "height", `${this.width}`);
                        this.renderer.setAttribute(innerElement, "width", `${this.width}`);
                        this.renderElement(innerElement);
                    })
                        .catch((e) => {
                        console.error("[angularx-qrcode] svg error:", e);
                    });
                    break;
                case "url":
                case "img":
                default:
                    element = this.renderer.createElement("img");
                    this.toDataURL()
                        .then((dataUrl) => {
                        element.setAttribute("src", dataUrl);
                        this.renderElement(element);
                    })
                        .catch((e) => {
                        console.error("[angularx-qrcode] img/url error:", e);
                    });
            }
        }
        catch (e) {
            console.error("[angularx-qrcode] Error generating QR Code:", e.message);
        }
    }
}
QRCodeComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: QRCodeComponent, deps: [{ token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Component });
QRCodeComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.1.1", type: QRCodeComponent, selector: "qrcode", inputs: { allowEmptyString: "allowEmptyString", colorDark: "colorDark", colorLight: "colorLight", cssClass: "cssClass", elementType: "elementType", errorCorrectionLevel: "errorCorrectionLevel", margin: "margin", qrdata: "qrdata", scale: "scale", version: "version", width: "width" }, viewQueries: [{ propertyName: "qrcElement", first: true, predicate: ["qrcElement"], descendants: true, static: true }], usesOnChanges: true, ngImport: i0, template: `<div #qrcElement [class]="cssClass"></div>`, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.1", ngImport: i0, type: QRCodeComponent, decorators: [{
            type: Component,
            args: [{
                    selector: "qrcode",
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
                args: ["qrcElement", { static: true }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhcngtcXJjb2RlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXJ4LXFyY29kZS9zcmMvbGliL2FuZ3VsYXJ4LXFyY29kZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBRVQsS0FBSyxFQUdMLFNBQVMsR0FDVixNQUFNLGVBQWUsQ0FBQTtBQUN0QixPQUFPLEtBQUssTUFBTSxNQUFNLFFBQVEsQ0FBQTs7QUFZaEMsTUFBTSxPQUFPLGVBQWU7SUFnQjFCLFlBQW9CLFFBQW1CO1FBQW5CLGFBQVEsR0FBUixRQUFRLENBQVc7UUFmdkIscUJBQWdCLEdBQUcsS0FBSyxDQUFBO1FBQ3hCLGNBQVMsR0FBRyxXQUFXLENBQUE7UUFDdkIsZUFBVSxHQUFHLFdBQVcsQ0FBQTtRQUN4QixhQUFRLEdBQUcsUUFBUSxDQUFBO1FBQ25CLGdCQUFXLEdBQXNCLFFBQVEsQ0FBQTtRQUVsRCx5QkFBb0IsR0FBK0IsR0FBRyxDQUFBO1FBQzdDLFdBQU0sR0FBRyxDQUFDLENBQUE7UUFDVixXQUFNLEdBQUcsRUFBRSxDQUFBO1FBQ1gsVUFBSyxHQUFHLENBQUMsQ0FBQTtRQUVULFVBQUssR0FBRyxFQUFFLENBQUE7SUFJZ0IsQ0FBQztJQUVwQyxXQUFXO1FBQ2hCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQTtJQUNyQixDQUFDO0lBRVMsaUJBQWlCLENBQUMsSUFBbUI7UUFDN0MsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEtBQUssS0FBSyxFQUFFO1lBQ25DLE9BQU8sQ0FBQyxDQUNOLE9BQU8sSUFBSSxLQUFLLFdBQVc7Z0JBQzNCLElBQUksS0FBSyxFQUFFO2dCQUNYLElBQUksS0FBSyxNQUFNO2dCQUNmLElBQUksS0FBSyxJQUFJLENBQ2QsQ0FBQTtTQUNGO1FBQ0QsT0FBTyxDQUFDLENBQUMsT0FBTyxJQUFJLEtB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O2dCQUVDLG9CQUFvQjtzQkFEMUIsS0FBSztnQkFFVSxNQUFNO3NCQUFyQixLQUFLO2dCQUNVLE1BQU07c0JBQXJCLEtBQUs7Z0JBQ1UsS0FBSztzQkFBcEIsS0FBSztnQkFDVSxPQUFPO3NCQUF0QixLQUFLO2dCQUNVLEtBQUs7c0JBQXBCLEtBQUs7Z0JBRTRDLFVBQVU7c0JBQTNELFNBQVM7dUJBQUMsWUFBWSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIFJlbmRlcmVyMixcbiAgVmlld0NoaWxkLFxufSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiXG5pbXBvcnQgKiBhcyBRUkNvZGUgZnJvbSBcInFyY29kZVwiXG5pbXBvcnQge1xuICBRUkNvZGVFcnJvckNvcnJlY3Rpb25MZXZlbCxcbiAgUVJDb2RlVmVyc2lvbixcbiAgUVJDb2RlRWxlbWVudFR5cGUsXG59IGZyb20gXCIuL3R5cGVzXCJcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiBcInFyY29kZVwiLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgdGVtcGxhdGU6IGA8ZGl2ICNxcmNFbGVtZW50IFtjbGFzc109XCJjc3NDbGFzc1wiPjwvZGl2PmAsXG59KVxuZXhwb3J0IGNsYXNzIFFSQ29kZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG4gIEBJbnB1dCgpIHB1YmxpYyBhbGxvd0VtcHR5U3RyaW5nID0gZmFsc2VcbiAgQElucHV0KCkgcHVibGljIGNvbG9yRGFyayA9IFwiIzAwMDAwMGZmXCJcbiAgQElucHV0KCkgcHVibGljIGNvbG9yTGlnaHQgPSBcIiNmZmZmZmZmZlwiXG4gIEBJbnB1dCgpIHB1YmxpYyBjc3NDbGFzcyA9IFwicXJjb2RlXCJcbiAgQElucHV0KCkgcHVibGljIGVsZW1lbnRUeXBlOiBRUkNvZGVFbGVtZW50VHlwZSA9IFwiY2FudmFzXCJcbiAgQElucHV0KClcbiAgcHVibGljIGVycm9yQ29ycmVjdGlvbkxldmVsOiBRUkNvZGVFcnJvckNvcnJlY3Rpb25MZXZlbCA9IFwiTVwiXG4gIEBJbnB1dCgpIHB1YmxpYyBtYXJnaW4gPSA0XG4gIEBJbnB1dCgpIHB1YmxpYyBxcmRhdGEgPSBcIlwiXG4gIEBJbnB1dCgpIHB1YmxpYyBzY2FsZSA9IDRcbiAgQElucHV0KCkgcHVibGljIHZlcnNpb246IFFSQ29kZVZlcnNpb24gfCB1bmRlZmluZWRcbiAgQElucHV0KCkgcHVibGljIHdpZHRoID0gMTBcblxuICBAVmlld0NoaWxkKFwicXJjRWxlbWVudFwiLCB7IHN0YXRpYzogdHJ1ZSB9KSBwdWJsaWMgcXJjRWxlbWVudCE6IEVsZW1lbnRSZWZcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIpIHt9XG5cbiAgcHVibGljIG5nT25DaGFuZ2VzKCk6IHZvaWQge1xuICAgIHRoaXMuY3JlYXRlUVJDb2RlKClcbiAgfVxuXG4gIHByb3RlY3RlZCBpc1ZhbGlkUXJDb2RlVGV4dChkYXRhOiBzdHJpbmcgfCBudWxsKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuYWxsb3dFbXB0eVN0cmluZyA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiAhKFxuICAgICAgICB0eXBlb2YgZGF0YSA9PT0gXCJ1bmRlZmluZWRcIiB8fFxuICAgICAgICBkYXRhID09PSBcIlwiIHx8XG4gICAgICAgIGRhdGEgPT09IFwibnVsbFwiIHx8XG4gICAgICAgIGRhdGEgPT09IG51bGxcbiAgICAgIClcbiAgICB9XG4gICAgcmV0dXJuICEodHlwZW9mIGRhdGEgPT09IFwidW5kZWZpbmVkXCIpXG4gIH1cblxuICBwcml2YXRlIHRvRGF0YVVSTCgpOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShcbiAgICAgIChyZXNvbHZlOiAoYXJnOiBhbnkpID0+IGFueSwgcmVqZWN0OiAoYXJnOiBhbnkpID0+IGFueSkgPT4ge1xuICAgICAgICBRUkNvZGUudG9EYXRhVVJMKFxuICAgICAgICAgIHRoaXMucXJkYXRhLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvbG9yOiB7XG4gICAgICAgICAgICAgIGRhcms6IHRoaXMuY29sb3JEYXJrLFxuICAgICAgICAgICAgICBsaWdodDogdGhpcy5jb2xvckxpZ2h0LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yQ29ycmVjdGlvbkxldmVsOiB0aGlzLmVycm9yQ29ycmVjdGlvbkxldmVsLFxuICAgICAgICAgICAgbWFyZ2luOiB0aGlzLm1hcmdpbixcbiAgICAgICAgICAgIHNjYWxlOiB0aGlzLnNjYWxlLFxuICAgICAgICAgICAgdmVyc2lvbjogdGhpcy52ZXJzaW9uLFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXG4gICAgICAgICAgfSxcbiAgICAgICAgICAoZXJyLCB1cmwpID0+IHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgcmVqZWN0KGVycilcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJlc29sdmUodXJsKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgICAgfVxuICAgIClcbiAgfVxuXG4gIHByaXZhdGUgdG9DYW52YXMoY2FudmFzOiBFbGVtZW50KTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoXG4gICAgICAocmVzb2x2ZTogKGFyZzogYW55KSA9PiBhbnksIHJlamVjdDogKGFyZzogYW55KSA9PiBhbnkpID0+IHtcbiAgICAgICAgUVJDb2RlLnRvQ2FudmFzKFxuICAgICAgICAgIGNhbnZhcyxcbiAgICAgICAgICB0aGlzLnFyZGF0YSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjb2xvcjoge1xuICAgICAgICAgICAgICBkYXJrOiB0aGlzLmNvbG9yRGFyayxcbiAgICAgICAgICAgICAgbGlnaHQ6IHRoaXMuY29sb3JMaWdodCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvckNvcnJlY3Rpb25MZXZlbDogdGhpcy5lcnJvckNvcnJlY3Rpb25MZXZlbCxcbiAgICAgICAgICAgIG1hcmdpbjogdGhpcy5tYXJnaW4sXG4gICAgICAgICAgICBzY2FsZTogdGhpcy5zY2FsZSxcbiAgICAgICAgICAgIHZlcnNpb246IHRoaXMudmVyc2lvbixcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgKGVycm9yKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVzb2x2ZShcInN1Y2Nlc3NcIilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIClcbiAgICAgIH1cbiAgICApXG4gIH1cblxuICBwcml2YXRlIHRvU1ZHKCk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKFxuICAgICAgKHJlc29sdmU6IChhcmc6IGFueSkgPT4gYW55LCByZWplY3Q6IChhcmc6IGFueSkgPT4gYW55KSA9PiB7XG4gICAgICAgIFFSQ29kZS50b1N0cmluZyhcbiAgICAgICAgICB0aGlzLnFyZGF0YSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjb2xvcjoge1xuICAgICAgICAgICAgICBkYXJrOiB0aGlzLmNvbG9yRGFyayxcbiAgICAgICAgICAgICAgbGlnaHQ6IHRoaXMuY29sb3JMaWdodCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvckNvcnJlY3Rpb25MZXZlbDogdGhpcy5lcnJvckNvcnJlY3Rpb25MZXZlbCxcbiAgICAgICAgICAgIG1hcmdpbjogdGhpcy5tYXJnaW4sXG4gICAgICAgICAgICBzY2FsZTogdGhpcy5zY2FsZSxcbiAgICAgICAgICAgIHR5cGU6IFwic3ZnXCIsXG4gICAgICAgICAgICB2ZXJzaW9uOiB0aGlzLnZlcnNpb24sXG4gICAgICAgICAgICB3aWR0aDogdGhpcy53aWR0aCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIChlcnIsIHVybCkgPT4ge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICByZWplY3QoZXJyKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVzb2x2ZSh1cmwpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICApXG4gICAgICB9XG4gICAgKVxuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJFbGVtZW50KGVsZW1lbnQ6IEVsZW1lbnQpOiB2b2lkIHtcbiAgICBmb3IgKGNvbnN0IG5vZGUgb2YgdGhpcy5xcmNFbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY2hpbGROb2Rlcykge1xuICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDaGlsZCh0aGlzLnFyY0VsZW1lbnQubmF0aXZlRWxlbWVudCwgbm9kZSlcbiAgICB9XG4gICAgdGhpcy5yZW5kZXJlci5hcHBlbmRDaGlsZCh0aGlzLnFyY0VsZW1lbnQubmF0aXZlRWxlbWVudCwgZWxlbWVudClcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlUVJDb2RlKCk6IHZvaWQge1xuICAgIC8vIFNldCBzZW5zaXRpdmUgZGVmYXVsdHNcbiAgICBpZiAodGhpcy52ZXJzaW9uICYmIHRoaXMudmVyc2lvbiA+IDQwKSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJbYW5ndWxhcngtcXJjb2RlXSBtYXggdmFsdWUgZm9yIGB2ZXJzaW9uYCBpcyA0MFwiKVxuICAgICAgdGhpcy52ZXJzaW9uID0gNDBcbiAgICB9IGVsc2UgaWYgKHRoaXMudmVyc2lvbiAmJiB0aGlzLnZlcnNpb24gPCAxKSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJbYW5ndWxhcngtcXJjb2RlXWBtaW4gdmFsdWUgZm9yIGB2ZXJzaW9uYCBpcyAxXCIpXG4gICAgICB0aGlzLnZlcnNpb24gPSAxXG4gICAgfSBlbHNlIGlmICh0aGlzLnZlcnNpb24gIT09IHVuZGVmaW5lZCAmJiBpc05hTih0aGlzLnZlcnNpb24pKSB7XG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgIFwiW2FuZ3VsYXJ4LXFyY29kZV0gdmVyc2lvbiBzaG91bGQgYmUgYSBudW1iZXIsIGRlZmF1bHRpbmcgdG8gYXV0by5cIlxuICAgICAgKVxuICAgICAgdGhpcy52ZXJzaW9uID0gdW5kZWZpbmVkXG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGlmICghdGhpcy5pc1ZhbGlkUXJDb2RlVGV4dCh0aGlzLnFyZGF0YSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIFwiW2FuZ3VsYXJ4LXFyY29kZV0gRmllbGQgYHFyZGF0YWAgaXMgZW1wdHksIHNldCAnYWxsb3dFbXB0eVN0cmluZz1cXFwidHJ1ZVxcXCInIHRvIG92ZXJ3cml0ZSB0aGlzIGJlaGF2aW91ci5cIlxuICAgICAgICApXG4gICAgICB9XG5cbiAgICAgIC8vIFRoaXMgaXMgYSBmaXggdG8gYWxsb3cgYW4gZW1wdHkgc3RyaW5nIGFzIHFyZGF0YVxuICAgICAgaWYgKHRoaXMuaXNWYWxpZFFyQ29kZVRleHQodGhpcy5xcmRhdGEpICYmIHRoaXMucXJkYXRhID09PSBcIlwiKSB7XG4gICAgICAgIHRoaXMucXJkYXRhID0gXCIgXCJcbiAgICAgIH1cblxuICAgICAgbGV0IGVsZW1lbnQ6IEVsZW1lbnRcblxuICAgICAgc3dpdGNoICh0aGlzLmVsZW1lbnRUeXBlKSB7XG4gICAgICAgIGNhc2UgXCJjYW52YXNcIjpcbiAgICAgICAgICBlbGVtZW50ID0gdGhpcy5yZW5kZXJlci5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpXG4gICAgICAgICAgdGhpcy50b0NhbnZhcyhlbGVtZW50KVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLnJlbmRlckVsZW1lbnQoZWxlbWVudClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlthbmd1bGFyeC1xcmNvZGVdIGNhbnZhcyBlcnJvcjpcIiwgZSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSBcInN2Z1wiOlxuICAgICAgICAgIGVsZW1lbnQgPSB0aGlzLnJlbmRlcmVyLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcbiAgICAgICAgICB0aGlzLnRvU1ZHKClcbiAgICAgICAgICAgIC50aGVuKChzdmdTdHJpbmc6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFByb3BlcnR5KGVsZW1lbnQsIFwiaW5uZXJIVE1MXCIsIHN2Z1N0cmluZylcbiAgICAgICAgICAgICAgY29uc3QgaW5uZXJFbGVtZW50ID0gZWxlbWVudC5maXJzdENoaWxkIGFzIEVsZW1lbnRcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgICAgICAgaW5uZXJFbGVtZW50LFxuICAgICAgICAgICAgICAgIFwiaGVpZ2h0XCIsXG4gICAgICAgICAgICAgICAgYCR7dGhpcy53aWR0aH1gXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUoaW5uZXJFbGVtZW50LCBcIndpZHRoXCIsIGAke3RoaXMud2lkdGh9YClcblxuICAgICAgICAgICAgICB0aGlzLnJlbmRlckVsZW1lbnQoaW5uZXJFbGVtZW50KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCgoZSkgPT4ge1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiW2FuZ3VsYXJ4LXFyY29kZV0gc3ZnIGVycm9yOlwiLCBlKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIFwidXJsXCI6XG4gICAgICAgIGNhc2UgXCJpbWdcIjpcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBlbGVtZW50ID0gdGhpcy5yZW5kZXJlci5jcmVhdGVFbGVtZW50KFwiaW1nXCIpXG4gICAgICAgICAgdGhpcy50b0RhdGFVUkwoKVxuICAgICAgICAgICAgLnRoZW4oKGRhdGFVcmw6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcInNyY1wiLCBkYXRhVXJsKVxuICAgICAgICAgICAgICB0aGlzLnJlbmRlckVsZW1lbnQoZWxlbWVudClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlthbmd1bGFyeC1xcmNvZGVdIGltZy91cmwgZXJyb3I6XCIsIGUpXG4gICAgICAgICAgICB9KVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgY29uc29sZS5lcnJvcihcIlthbmd1bGFyeC1xcmNvZGVdIEVycm9yIGdlbmVyYXRpbmcgUVIgQ29kZTpcIiwgZS5tZXNzYWdlKVxuICAgIH1cbiAgfVxufVxuIl19