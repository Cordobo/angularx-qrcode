import { __decorate, __param } from "tslib";
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Inject, Input, OnChanges, PLATFORM_ID, Renderer2, ViewChild, } from "@angular/core";
import { isPlatformServer } from "@angular/common";
import * as QRCode from "qrcode";
let QRCodeComponent = class QRCodeComponent {
    constructor(renderer, platformId) {
        this.renderer = renderer;
        this.platformId = platformId;
        // Deprecated
        this.colordark = "";
        this.colorlight = "";
        this.level = "";
        this.hidetitle = false;
        this.size = 0;
        this.usesvg = false;
        // Valid for 1.x and 2.x
        this.allowEmptyString = false;
        this.qrdata = "";
        // New fields introduced in 2.0.0
        this.colorDark = "#000000ff";
        this.colorLight = "#ffffffff";
        this.cssClass = "qrcode";
        this.elementType = "canvas";
        this.errorCorrectionLevel = "M";
        this.margin = 4;
        this.scale = 4;
        this.width = 10;
        this.qrcode = null;
        this.isValidQrCodeText = (data) => {
            if (this.allowEmptyString === false) {
                return !(typeof data === "undefined" ||
                    data === "" ||
                    data === "null" ||
                    data === null);
            }
            return !(typeof data === "undefined");
        };
        // Deprectation warnings
        if (this.colordark !== "") {
            console.warn("[angularx-qrcode] colordark is deprecated, use colorDark.");
        }
        if (this.colorlight !== "") {
            console.warn("[angularx-qrcode] colorlight is deprecated, use colorLight.");
        }
        if (this.level !== "") {
            console.warn("[angularx-qrcode] level is deprecated, use errorCorrectionLevel.");
        }
        if (this.hidetitle !== false) {
            console.warn("[angularx-qrcode] hidetitle is deprecated.");
        }
        if (this.size !== 0) {
            console.warn("[angularx-qrcode] size is deprecated, use `width`. Defaults to 10.");
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
            console.warn("[angularx-qrcode] version should be a number, defaulting to auto");
            this.version = undefined;
        }
        try {
            if (!this.isValidQrCodeText(this.qrdata)) {
                throw new Error("[angularx-qrcode] Field `qrdata` is empty");
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
                        console.error("[angularx-qrcode] canvas error: ", e);
                    });
                    break;
                case "svg":
                    element = this.renderer.createElement("svg", "svg");
                    this.toSVG()
                        .then((svgString) => {
                        element.innerHTML = svgString;
                        this.renderer.setAttribute(element, "height", "256");
                        this.renderer.setAttribute(element, "width", "256");
                        this.renderElement(element);
                    })
                        .catch((e) => {
                        console.error("[angularx-qrcode] svg error: ", e);
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
                        console.error("[angularx-qrcode] img/url error: ", e);
                    });
            }
        }
        catch (e) {
            console.error("[angularx-qrcode] Error generating QR Code: ", e.message);
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
    ViewChild("qrcElement", { static: true })
], QRCodeComponent.prototype, "qrcElement", void 0);
QRCodeComponent = __decorate([
    Component({
        selector: "qrcode",
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: `<div #qrcElement [class]="cssClass"></div>`
    }),
    __param(1, Inject(PLATFORM_ID))
], QRCodeComponent);
export { QRCodeComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhcngtcXJjb2RlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXJ4LXFyY29kZS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyeC1xcmNvZGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsYUFBYSxFQUNiLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBQ0wsU0FBUyxFQUNULFdBQVcsRUFDWCxTQUFTLEVBQ1QsU0FBUyxHQUNWLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ25ELE9BQU8sS0FBSyxNQUFNLE1BQU0sUUFBUSxDQUFDO0FBWWpDLElBQWEsZUFBZSxHQUE1QixNQUFhLGVBQWU7SUE2QjFCLFlBQ1UsUUFBbUIsRUFDVyxVQUFlO1FBRDdDLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDVyxlQUFVLEdBQVYsVUFBVSxDQUFLO1FBOUJ2RCxhQUFhO1FBQ0csY0FBUyxHQUFXLEVBQUUsQ0FBQztRQUN2QixlQUFVLEdBQVcsRUFBRSxDQUFDO1FBQ3hCLFVBQUssR0FBVyxFQUFFLENBQUM7UUFDbkIsY0FBUyxHQUFZLEtBQUssQ0FBQztRQUMzQixTQUFJLEdBQVcsQ0FBQyxDQUFDO1FBQ2pCLFdBQU0sR0FBWSxLQUFLLENBQUM7UUFFeEMsd0JBQXdCO1FBQ1IscUJBQWdCLEdBQVksS0FBSyxDQUFDO1FBQ2xDLFdBQU0sR0FBVyxFQUFFLENBQUM7UUFFcEMsaUNBQWlDO1FBQ2pCLGNBQVMsR0FBVyxXQUFXLENBQUM7UUFDaEMsZUFBVSxHQUFXLFdBQVcsQ0FBQztRQUNqQyxhQUFRLEdBQVcsUUFBUSxDQUFDO1FBQzVCLGdCQUFXLEdBQW1DLFFBQVEsQ0FBQztRQUVoRSx5QkFBb0IsR0FBNEMsR0FBRyxDQUFDO1FBQzNELFdBQU0sR0FBVyxDQUFDLENBQUM7UUFDbkIsVUFB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QztBQUNuQztJQUFSLEtBQUssRUFBRTtvREFBK0Q7QUFFdkU7SUFEQyxLQUFLLEVBQUU7NkRBQ21FO0FBQ2xFO0lBQVIsS0FBSyxFQUFFOytDQUEyQjtBQUMxQjtJQUFSLEtBQUssRUFBRTs4Q0FBMEI7QUFDekI7SUFBUixLQUFLLEVBQUU7Z0RBQStCO0FBQzlCO0lBQVIsS0FBSyxFQUFFOzhDQUEyQjtBQUVRO0lBQTFDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUM7bURBQStCO0FBekI5RCxlQUFlO0lBTDNCLFNBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxRQUFRO1FBQ2xCLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO1FBQy9DLFFBQVEsRUFBRSw0Q0FBNEM7S0FDdkQsQ0FBQztJQWdDRyxXQUFBLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQTtHQS9CWCxlQUFlLENBb1AzQjtTQXBQWSxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBQTEFURk9STV9JRCxcbiAgUmVuZGVyZXIyLFxuICBWaWV3Q2hpbGQsXG59IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBpc1BsYXRmb3JtU2VydmVyIH0gZnJvbSBcIkBhbmd1bGFyL2NvbW1vblwiO1xuaW1wb3J0ICogYXMgUVJDb2RlIGZyb20gXCJxcmNvZGVcIjtcbmltcG9ydCB7XG4gIFFSQ29kZUVycm9yQ29ycmVjdGlvbkxldmVsLFxuICBRUkNvZGVWZXJzaW9uLFxuICBRUkNvZGVFbGVtZW50VHlwZSxcbn0gZnJvbSBcIi4vdHlwZXNcIjtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiBcInFyY29kZVwiLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgdGVtcGxhdGU6IGA8ZGl2ICNxcmNFbGVtZW50IFtjbGFzc109XCJjc3NDbGFzc1wiPjwvZGl2PmAsXG59KVxuZXhwb3J0IGNsYXNzIFFSQ29kZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgQWZ0ZXJWaWV3SW5pdCB7XG4gIC8vIERlcHJlY2F0ZWRcbiAgQElucHV0KCkgcHVibGljIGNvbG9yZGFyazogc3RyaW5nID0gXCJcIjtcbiAgQElucHV0KCkgcHVibGljIGNvbG9ybGlnaHQ6IHN0cmluZyA9IFwiXCI7XG4gIEBJbnB1dCgpIHB1YmxpYyBsZXZlbDogc3RyaW5nID0gXCJcIjtcbiAgQElucHV0KCkgcHVibGljIGhpZGV0aXRsZTogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKSBwdWJsaWMgc2l6ZTogbnVtYmVyID0gMDtcbiAgQElucHV0KCkgcHVibGljIHVzZXN2ZzogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8vIFZhbGlkIGZvciAxLnggYW5kIDIueFxuICBASW5wdXQoKSBwdWJsaWMgYWxsb3dFbXB0eVN0cmluZzogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKSBwdWJsaWMgcXJkYXRhOiBzdHJpbmcgPSBcIlwiO1xuXG4gIC8vIE5ldyBmaWVsZHMgaW50cm9kdWNlZCBpbiAyLjAuMFxuICBASW5wdXQoKSBwdWJsaWMgY29sb3JEYXJrOiBzdHJpbmcgPSBcIiMwMDAwMDBmZlwiO1xuICBASW5wdXQoKSBwdWJsaWMgY29sb3JMaWdodDogc3RyaW5nID0gXCIjZmZmZmZmZmZcIjtcbiAgQElucHV0KCkgcHVibGljIGNzc0NsYXNzOiBzdHJpbmcgPSBcInFyY29kZVwiO1xuICBASW5wdXQoKSBwdWJsaWMgZWxlbWVudFR5cGU6IGtleW9mIHR5cGVvZiBRUkNvZGVFbGVtZW50VHlwZSA9IFwiY2FudmFzXCI7XG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBlcnJvckNvcnJlY3Rpb25MZXZlbDoga2V5b2YgdHlwZW9mIFFSQ29kZUVycm9yQ29ycmVjdGlvbkxldmVsID0gXCJNXCI7XG4gIEBJbnB1dCgpIHB1YmxpYyBtYXJnaW46IG51bWJlciA9IDQ7XG4gIEBJbnB1dCgpIHB1YmxpYyBzY2FsZTogbnVtYmVyID0gNDtcbiAgQElucHV0KCkgcHVibGljIHZlcnNpb246IFFSQ29kZVZlcnNpb247XG4gIEBJbnB1dCgpIHB1YmxpYyB3aWR0aDogbnVtYmVyID0gMTA7XG5cbiAgQFZpZXdDaGlsZChcInFyY0VsZW1lbnRcIiwgeyBzdGF0aWM6IHRydWUgfSkgcHVibGljIHFyY0VsZW1lbnQ6IEVsZW1lbnRSZWY7XG5cbiAgcHVibGljIHFyY29kZTogYW55ID0gbnVsbDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgQEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSByZWFkb25seSBwbGF0Zm9ybUlkOiBhbnlcbiAgKSB7XG4gICAgLy8gRGVwcmVjdGF0aW9uIHdhcm5pbmdzXG4gICAgaWYgKHRoaXMuY29sb3JkYXJrICE9PSBcIlwiKSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJbYW5ndWxhcngtcXJjb2RlXSBjb2xvcmRhcmsgaXMgZGVwcmVjYXRlZCwgdXNlIGNvbG9yRGFyay5cIik7XG4gICAgfVxuICAgIGlmICh0aGlzLmNvbG9ybGlnaHQgIT09IFwiXCIpIHtcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgXCJbYW5ndWxhcngtcXJjb2RlXSBjb2xvcmxpZ2h0IGlzIGRlcHJlY2F0ZWQsIHVzZSBjb2xvckxpZ2h0LlwiXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAodGhpcy5sZXZlbCAhPT0gXCJcIikge1xuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICBcIlthbmd1bGFyeC1xcmNvZGVdIGxldmVsIGlzIGRlcHJlY2F0ZWQsIHVzZSBlcnJvckNvcnJlY3Rpb25MZXZlbC5cIlxuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuaGlkZXRpdGxlICE9PSBmYWxzZSkge1xuICAgICAgY29uc29sZS53YXJuKFwiW2FuZ3VsYXJ4LXFyY29kZV0gaGlkZXRpdGxlIGlzIGRlcHJlY2F0ZWQuXCIpO1xuICAgIH1cbiAgICBpZiAodGhpcy5zaXplICE9PSAwKSB7XG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgIFwiW2FuZ3VsYXJ4LXFyY29kZV0gc2l6ZSBpcyBkZXByZWNhdGVkLCB1c2UgYHdpZHRoYC4gRGVmYXVsdHMgdG8gMTAuXCJcbiAgICAgICk7XG4gICAgfVxuICAgIGlmICh0aGlzLnVzZXN2ZyAhPT0gZmFsc2UpIHtcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgYFthbmd1bGFyeC1xcmNvZGVdIHVzZXN2ZyBpcyBkZXByZWNhdGVkLCB1c2UgW2VsZW1lbnRUeXBlXT1cIidpbWcnXCIuYFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGlmIChpc1BsYXRmb3JtU2VydmVyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gaWYgKCFRUkNvZGUpIHtcbiAgICAvLyAgIFFSQ29kZSA9IHJlcXVpcmUoJ3FyY29kZScpO1xuICAgIC8vIH1cbiAgICB0aGlzLmNyZWF0ZVFSQ29kZSgpO1xuICB9XG5cbiAgcHVibGljIG5nT25DaGFuZ2VzKCkge1xuICAgIHRoaXMuY3JlYXRlUVJDb2RlKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgaXNWYWxpZFFyQ29kZVRleHQgPSAoZGF0YTogc3RyaW5nIHwgbnVsbCk6IGJvb2xlYW4gPT4ge1xuICAgIGlmICh0aGlzLmFsbG93RW1wdHlTdHJpbmcgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm4gIShcbiAgICAgICAgdHlwZW9mIGRhdGEgPT09IFwidW5kZWZpbmVkXCIgfHxcbiAgICAgICAgZGF0YSA9PT0gXCJcIiB8fFxuICAgICAgICBkYXRhID09PSBcIm51bGxcIiB8fFxuICAgICAgICBkYXRhID09PSBudWxsXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gISh0eXBlb2YgZGF0YSA9PT0gXCJ1bmRlZmluZWRcIik7XG4gIH07XG5cbiAgcHJpdmF0ZSB0b0RhdGFVUkwoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKFxuICAgICAgKHJlc29sdmU6IChhcmc6IGFueSkgPT4gYW55LCByZWplY3Q6IChhcmc6IGFueSkgPT4gYW55KSA9PiB7XG4gICAgICAgIFFSQ29kZS50b0RhdGFVUkwoXG4gICAgICAgICAgdGhpcy5xcmRhdGEsXG4gICAgICAgICAge1xuICAgICAgICAgICAgY29sb3I6IHtcbiAgICAgICAgICAgICAgZGFyazogdGhpcy5jb2xvckRhcmssXG4gICAgICAgICAgICAgIGxpZ2h0OiB0aGlzLmNvbG9yTGlnaHQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3JDb3JyZWN0aW9uTGV2ZWw6IHRoaXMuZXJyb3JDb3JyZWN0aW9uTGV2ZWwsXG4gICAgICAgICAgICBtYXJnaW46IHRoaXMubWFyZ2luLFxuICAgICAgICAgICAgc2NhbGU6IHRoaXMuc2NhbGUsXG4gICAgICAgICAgICB2ZXJzaW9uOiB0aGlzLnZlcnNpb24sXG4gICAgICAgICAgICB3aWR0aDogdGhpcy53aWR0aCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIChlcnIsIHVybCkgPT4ge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJlc29sdmUodXJsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgdG9DYW52YXMoY2FudmFzOiBFbGVtZW50KSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKFxuICAgICAgKHJlc29sdmU6IChhcmc6IGFueSkgPT4gYW55LCByZWplY3Q6IChhcmc6IGFueSkgPT4gYW55KSA9PiB7XG4gICAgICAgIFFSQ29kZS50b0NhbnZhcyhcbiAgICAgICAgICBjYW52YXMsXG4gICAgICAgICAgdGhpcy5xcmRhdGEsXG4gICAgICAgICAge1xuICAgICAgICAgICAgY29sb3I6IHtcbiAgICAgICAgICAgICAgZGFyazogdGhpcy5jb2xvckRhcmssXG4gICAgICAgICAgICAgIGxpZ2h0OiB0aGlzLmNvbG9yTGlnaHQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3JDb3JyZWN0aW9uTGV2ZWw6IHRoaXMuZXJyb3JDb3JyZWN0aW9uTGV2ZWwsXG4gICAgICAgICAgICBtYXJnaW46IHRoaXMubWFyZ2luLFxuICAgICAgICAgICAgc2NhbGU6IHRoaXMuc2NhbGUsXG4gICAgICAgICAgICB2ZXJzaW9uOiB0aGlzLnZlcnNpb24sXG4gICAgICAgICAgICB3aWR0aDogdGhpcy53aWR0aCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIChlcnJvcikgPT4ge1xuICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXNvbHZlKFwic3VjY2Vzc1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgdG9TVkcoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKFxuICAgICAgKHJlc29sdmU6IChhcmc6IGFueSkgPT4gYW55LCByZWplY3Q6IChhcmc6IGFueSkgPT4gYW55KSA9PiB7XG4gICAgICAgIFFSQ29kZS50b1N0cmluZyhcbiAgICAgICAgICB0aGlzLnFyZGF0YSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjb2xvcjoge1xuICAgICAgICAgICAgICBkYXJrOiB0aGlzLmNvbG9yRGFyayxcbiAgICAgICAgICAgICAgbGlnaHQ6IHRoaXMuY29sb3JMaWdodCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvckNvcnJlY3Rpb25MZXZlbDogdGhpcy5lcnJvckNvcnJlY3Rpb25MZXZlbCxcbiAgICAgICAgICAgIG1hcmdpbjogdGhpcy5tYXJnaW4sXG4gICAgICAgICAgICBzY2FsZTogdGhpcy5zY2FsZSxcbiAgICAgICAgICAgIHR5cGU6IFwic3ZnXCIsXG4gICAgICAgICAgICB2ZXJzaW9uOiB0aGlzLnZlcnNpb24sXG4gICAgICAgICAgICB3aWR0aDogdGhpcy53aWR0aCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIChlcnIsIHVybCkgPT4ge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJlc29sdmUodXJsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyRWxlbWVudChlbGVtZW50OiBFbGVtZW50KSB7XG4gICAgZm9yIChjb25zdCBub2RlIG9mIHRoaXMucXJjRWxlbWVudC5uYXRpdmVFbGVtZW50LmNoaWxkTm9kZXMpIHtcbiAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2hpbGQodGhpcy5xcmNFbGVtZW50Lm5hdGl2ZUVsZW1lbnQsIG5vZGUpO1xuICAgIH1cbiAgICB0aGlzLnJlbmRlcmVyLmFwcGVuZENoaWxkKHRoaXMucXJjRWxlbWVudC5uYXRpdmVFbGVtZW50LCBlbGVtZW50KTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlUVJDb2RlKCkge1xuICAgIC8vIFNldCBzZW5zaXRpdmUgZGVmYXVsdHNcbiAgICBpZiAodGhpcy52ZXJzaW9uICYmIHRoaXMudmVyc2lvbiA+IDQwKSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJbYW5ndWxhcngtcXJjb2RlXSBtYXggdmFsdWUgZm9yIGB2ZXJzaW9uYCBpcyA0MFwiKTtcbiAgICAgIHRoaXMudmVyc2lvbiA9IDQwO1xuICAgIH0gZWxzZSBpZiAodGhpcy52ZXJzaW9uICYmIHRoaXMudmVyc2lvbiA8IDEpIHtcbiAgICAgIGNvbnNvbGUud2FybihcIlthbmd1bGFyeC1xcmNvZGVdYG1pbiB2YWx1ZSBmb3IgYHZlcnNpb25gIGlzIDFcIik7XG4gICAgICB0aGlzLnZlcnNpb24gPSAxO1xuICAgIH0gZWxzZSBpZiAodGhpcy52ZXJzaW9uICE9PSB1bmRlZmluZWQgJiYgaXNOYU4odGhpcy52ZXJzaW9uKSkge1xuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICBcIlthbmd1bGFyeC1xcmNvZGVdIHZlcnNpb24gc2hvdWxkIGJlIGEgbnVtYmVyLCBkZWZhdWx0aW5nIHRvIGF1dG9cIlxuICAgICAgKTtcbiAgICAgIHRoaXMudmVyc2lvbiA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgaWYgKCF0aGlzLmlzVmFsaWRRckNvZGVUZXh0KHRoaXMucXJkYXRhKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJbYW5ndWxhcngtcXJjb2RlXSBGaWVsZCBgcXJkYXRhYCBpcyBlbXB0eVwiKTtcbiAgICAgIH1cblxuICAgICAgbGV0IGVsZW1lbnQ6IEVsZW1lbnQ7XG5cbiAgICAgIHN3aXRjaCAodGhpcy5lbGVtZW50VHlwZSkge1xuICAgICAgICBjYXNlIFwiY2FudmFzXCI6XG4gICAgICAgICAgZWxlbWVudCA9IHRoaXMucmVuZGVyZXIuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgICAgICB0aGlzLnRvQ2FudmFzKGVsZW1lbnQpXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyRWxlbWVudChlbGVtZW50KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlthbmd1bGFyeC1xcmNvZGVdIGNhbnZhcyBlcnJvcjogXCIsIGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJzdmdcIjpcbiAgICAgICAgICBlbGVtZW50ID0gdGhpcy5yZW5kZXJlci5jcmVhdGVFbGVtZW50KFwic3ZnXCIsIFwic3ZnXCIpO1xuICAgICAgICAgIHRoaXMudG9TVkcoKVxuICAgICAgICAgICAgLnRoZW4oKHN2Z1N0cmluZzogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gc3ZnU3RyaW5nO1xuICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEF0dHJpYnV0ZShlbGVtZW50LCBcImhlaWdodFwiLCBcIjI1NlwiKTtcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUoZWxlbWVudCwgXCJ3aWR0aFwiLCBcIjI1NlwiKTtcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJFbGVtZW50KGVsZW1lbnQpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCgoZSkgPT4ge1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiW2FuZ3VsYXJ4LXFyY29kZV0gc3ZnIGVycm9yOiBcIiwgZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInVybFwiOlxuICAgICAgICBjYXNlIFwiaW1nXCI6XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgZWxlbWVudCA9IHRoaXMucmVuZGVyZXIuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcbiAgICAgICAgICB0aGlzLnRvRGF0YVVSTCgpXG4gICAgICAgICAgICAudGhlbigoZGF0YVVybDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKFwic3JjXCIsIGRhdGFVcmwpO1xuICAgICAgICAgICAgICB0aGlzLnJlbmRlckVsZW1lbnQoZWxlbWVudCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKChlKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJbYW5ndWxhcngtcXJjb2RlXSBpbWcvdXJsIGVycm9yOiBcIiwgZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiW2FuZ3VsYXJ4LXFyY29kZV0gRXJyb3IgZ2VuZXJhdGluZyBRUiBDb2RlOiBcIiwgZS5tZXNzYWdlKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==