import { ChangeDetectionStrategy, Component, Inject, Input, PLATFORM_ID, Renderer2, ViewChild, } from "@angular/core";
import { isPlatformServer } from "@angular/common";
import * as QRCode from "qrcode";
export class QRCodeComponent {
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
                        this.renderer.setAttribute(element, "height", `${this.width}`);
                        this.renderer.setAttribute(element, "width", `${this.width}`);
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
}
QRCodeComponent.decorators = [
    { type: Component, args: [{
                selector: "qrcode",
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
    qrcElement: [{ type: ViewChild, args: ["qrcElement", { static: true },] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhcngtcXJjb2RlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvYW5ndWxhcngtcXJjb2RlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFFVCxNQUFNLEVBQ04sS0FBSyxFQUVMLFdBQVcsRUFDWCxTQUFTLEVBQ1QsU0FBUyxHQUNWLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ25ELE9BQU8sS0FBSyxNQUFNLE1BQU0sUUFBUSxDQUFDO0FBWWpDLE1BQU0sT0FBTyxlQUFlO0lBNkIxQixZQUNVLFFBQW1CLEVBQ1csVUFBZTtRQUQ3QyxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ1csZUFBVSxHQUFWLFVBQVUsQ0FBSztRQTlCdkQsYUFBYTtRQUNHLGNBQVMsR0FBVyxFQUFFLENBQUM7UUFDdkIsZUFBVSxHQUFXLEVBQUUsQ0FBQztRQUN4QixVQUFLLEdBQVcsRUFBRSxDQUFDO1FBQ25CLGNBQVMsR0FBWSxLQUFLLENBQUM7UUFDM0IsU0FBSSxHQUFXLENBQUMsQ0FBQztRQUNqQixXQUFNLEdBQVksS0FBSyxDQUFDO1FBRXhDLHdCQUF3QjtRQUNSLHFCQUFnQixHQUFZLEtBQUssQ0FBQztRQUNsQyxXQUFNLEdBQVcsRUFBRSxDQUFDO1FBRXBDLGlDQUFpQztRQUNqQixjQUFTLEdBQVcsV0FBVyxDQUFDO1FBQ2hDLGVBQVUsR0FBVyxXQUFXLENBQUM7UUFDakMsYUFBUSxHQUFXLFFBQVEsQ0FBQztRQUM1QixnQkFBVyxHQUFtQyxRQUFRLENBQUM7UUFFaEUseUJBQW9CLEdBQTRDLEdBQUcsQ0FBQztRQUMzRCxXQUFNLEdBQVcsQ0FBQyxDQUFDO1FBQ25CLFVBQUssR0FBVyxDQUFDLENBQUM7UUFFbEIsVUFBSyxHQUFXLEVBQUUsQ0FBQztRQUk1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TUFBTSxFQUFFLElBQUksRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgQWZ0ZXJWaWV3SW5pdCxcclxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcclxuICBDb21wb25lbnQsXHJcbiAgRWxlbWVudFJlZixcclxuICBJbmplY3QsXHJcbiAgSW5wdXQsXHJcbiAgT25DaGFuZ2VzLFxyXG4gIFBMQVRGT1JNX0lELFxyXG4gIFJlbmRlcmVyMixcclxuICBWaWV3Q2hpbGQsXHJcbn0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHsgaXNQbGF0Zm9ybVNlcnZlciB9IGZyb20gXCJAYW5ndWxhci9jb21tb25cIjtcclxuaW1wb3J0ICogYXMgUVJDb2RlIGZyb20gXCJxcmNvZGVcIjtcclxuaW1wb3J0IHtcclxuICBRUkNvZGVFcnJvckNvcnJlY3Rpb25MZXZlbCxcclxuICBRUkNvZGVWZXJzaW9uLFxyXG4gIFFSQ29kZUVsZW1lbnRUeXBlLFxyXG59IGZyb20gXCIuL3R5cGVzXCI7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogXCJxcmNvZGVcIixcclxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcclxuICB0ZW1wbGF0ZTogYDxkaXYgI3FyY0VsZW1lbnQgW2NsYXNzXT1cImNzc0NsYXNzXCI+PC9kaXY+YCxcclxufSlcclxuZXhwb3J0IGNsYXNzIFFSQ29kZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgQWZ0ZXJWaWV3SW5pdCB7XHJcbiAgLy8gRGVwcmVjYXRlZFxyXG4gIEBJbnB1dCgpIHB1YmxpYyBjb2xvcmRhcms6IHN0cmluZyA9IFwiXCI7XHJcbiAgQElucHV0KCkgcHVibGljIGNvbG9ybGlnaHQ6IHN0cmluZyA9IFwiXCI7XHJcbiAgQElucHV0KCkgcHVibGljIGxldmVsOiBzdHJpbmcgPSBcIlwiO1xyXG4gIEBJbnB1dCgpIHB1YmxpYyBoaWRldGl0bGU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBASW5wdXQoKSBwdWJsaWMgc2l6ZTogbnVtYmVyID0gMDtcclxuICBASW5wdXQoKSBwdWJsaWMgdXNlc3ZnOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIC8vIFZhbGlkIGZvciAxLnggYW5kIDIueFxyXG4gIEBJbnB1dCgpIHB1YmxpYyBhbGxvd0VtcHR5U3RyaW5nOiBib29sZWFuID0gZmFsc2U7XHJcbiAgQElucHV0KCkgcHVibGljIHFyZGF0YTogc3RyaW5nID0gXCJcIjtcclxuXHJcbiAgLy8gTmV3IGZpZWxkcyBpbnRyb2R1Y2VkIGluIDIuMC4wXHJcbiAgQElucHV0KCkgcHVibGljIGNvbG9yRGFyazogc3RyaW5nID0gXCIjMDAwMDAwZmZcIjtcclxuICBASW5wdXQoKSBwdWJsaWMgY29sb3JMaWdodDogc3RyaW5nID0gXCIjZmZmZmZmZmZcIjtcclxuICBASW5wdXQoKSBwdWJsaWMgY3NzQ2xhc3M6IHN0cmluZyA9IFwicXJjb2RlXCI7XHJcbiAgQElucHV0KCkgcHVibGljIGVsZW1lbnRUeXBlOiBrZXlvZiB0eXBlb2YgUVJDb2RlRWxlbWVudFR5cGUgPSBcImNhbnZhc1wiO1xyXG4gIEBJbnB1dCgpXHJcbiAgcHVibGljIGVycm9yQ29ycmVjdGlvbkxldmVsOiBrZXlvZiB0eXBlb2YgUVJDb2RlRXJyb3JDb3JyZWN0aW9uTGV2ZWwgPSBcIk1cIjtcclxuICBASW5wdXQoKSBwdWJsaWMgbWFyZ2luOiBudW1iZXIgPSA0O1xyXG4gIEBJbnB1dCgpIHB1YmxpYyBzY2FsZTogbnVtYmVyID0gNDtcclxuICBASW5wdXQoKSBwdWJsaWMgdmVyc2lvbjogUVJDb2RlVmVyc2lvbjtcclxuICBASW5wdXQoKSBwdWJsaWMgd2lkdGg6IG51bWJlciA9IDEwO1xyXG5cclxuICBAVmlld0NoaWxkKFwicXJjRWxlbWVudFwiLCB7IHN0YXRpYzogdHJ1ZSB9KSBwdWJsaWMgcXJjRWxlbWVudDogRWxlbWVudFJlZjtcclxuXHJcbiAgcHVibGljIHFyY29kZTogYW55ID0gbnVsbDtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXHJcbiAgICBASW5qZWN0KFBMQVRGT1JNX0lEKSBwcml2YXRlIHJlYWRvbmx5IHBsYXRmb3JtSWQ6IGFueVxyXG4gICkge1xyXG4gICAgLy8gRGVwcmVjdGF0aW9uIHdhcm5pbmdzXHJcbiAgICBpZiAodGhpcy5jb2xvcmRhcmsgIT09IFwiXCIpIHtcclxuICAgICAgY29uc29sZS53YXJuKFwiW2FuZ3VsYXJ4LXFyY29kZV0gY29sb3JkYXJrIGlzIGRlcHJlY2F0ZWQsIHVzZSBjb2xvckRhcmsuXCIpO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuY29sb3JsaWdodCAhPT0gXCJcIikge1xyXG4gICAgICBjb25zb2xlLndhcm4oXHJcbiAgICAgICAgXCJbYW5ndWxhcngtcXJjb2RlXSBjb2xvcmxpZ2h0IGlzIGRlcHJlY2F0ZWQsIHVzZSBjb2xvckxpZ2h0LlwiXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5sZXZlbCAhPT0gXCJcIikge1xyXG4gICAgICBjb25zb2xlLndhcm4oXHJcbiAgICAgICAgXCJbYW5ndWxhcngtcXJjb2RlXSBsZXZlbCBpcyBkZXByZWNhdGVkLCB1c2UgZXJyb3JDb3JyZWN0aW9uTGV2ZWwuXCJcclxuICAgICAgKTtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLmhpZGV0aXRsZSAhPT0gZmFsc2UpIHtcclxuICAgICAgY29uc29sZS53YXJuKFwiW2FuZ3VsYXJ4LXFyY29kZV0gaGlkZXRpdGxlIGlzIGRlcHJlY2F0ZWQuXCIpO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuc2l6ZSAhPT0gMCkge1xyXG4gICAgICBjb25zb2xlLndhcm4oXHJcbiAgICAgICAgXCJbYW5ndWxhcngtcXJjb2RlXSBzaXplIGlzIGRlcHJlY2F0ZWQsIHVzZSBgd2lkdGhgLiBEZWZhdWx0cyB0byAxMC5cIlxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMudXNlc3ZnICE9PSBmYWxzZSkge1xyXG4gICAgICBjb25zb2xlLndhcm4oXHJcbiAgICAgICAgYFthbmd1bGFyeC1xcmNvZGVdIHVzZXN2ZyBpcyBkZXByZWNhdGVkLCB1c2UgW2VsZW1lbnRUeXBlXT1cIidpbWcnXCIuYFxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcclxuICAgIGlmIChpc1BsYXRmb3JtU2VydmVyKHRoaXMucGxhdGZvcm1JZCkpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgLy8gaWYgKCFRUkNvZGUpIHtcclxuICAgIC8vICAgUVJDb2RlID0gcmVxdWlyZSgncXJjb2RlJyk7XHJcbiAgICAvLyB9XHJcbiAgICB0aGlzLmNyZWF0ZVFSQ29kZSgpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIG5nT25DaGFuZ2VzKCkge1xyXG4gICAgdGhpcy5jcmVhdGVRUkNvZGUoKTtcclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBpc1ZhbGlkUXJDb2RlVGV4dCA9IChkYXRhOiBzdHJpbmcgfCBudWxsKTogYm9vbGVhbiA9PiB7XHJcbiAgICBpZiAodGhpcy5hbGxvd0VtcHR5U3RyaW5nID09PSBmYWxzZSkge1xyXG4gICAgICByZXR1cm4gIShcclxuICAgICAgICB0eXBlb2YgZGF0YSA9PT0gXCJ1bmRlZmluZWRcIiB8fFxyXG4gICAgICAgIGRhdGEgPT09IFwiXCIgfHxcclxuICAgICAgICBkYXRhID09PSBcIm51bGxcIiB8fFxyXG4gICAgICAgIGRhdGEgPT09IG51bGxcclxuICAgICAgKTtcclxuICAgIH1cclxuICAgIHJldHVybiAhKHR5cGVvZiBkYXRhID09PSBcInVuZGVmaW5lZFwiKTtcclxuICB9O1xyXG5cclxuICBwcml2YXRlIHRvRGF0YVVSTCgpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShcclxuICAgICAgKHJlc29sdmU6IChhcmc6IGFueSkgPT4gYW55LCByZWplY3Q6IChhcmc6IGFueSkgPT4gYW55KSA9PiB7XHJcbiAgICAgICAgUVJDb2RlLnRvRGF0YVVSTChcclxuICAgICAgICAgIHRoaXMucXJkYXRhLFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBjb2xvcjoge1xyXG4gICAgICAgICAgICAgIGRhcms6IHRoaXMuY29sb3JEYXJrLFxyXG4gICAgICAgICAgICAgIGxpZ2h0OiB0aGlzLmNvbG9yTGlnaHQsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yQ29ycmVjdGlvbkxldmVsOiB0aGlzLmVycm9yQ29ycmVjdGlvbkxldmVsLFxyXG4gICAgICAgICAgICBtYXJnaW46IHRoaXMubWFyZ2luLFxyXG4gICAgICAgICAgICBzY2FsZTogdGhpcy5zY2FsZSxcclxuICAgICAgICAgICAgdmVyc2lvbjogdGhpcy52ZXJzaW9uLFxyXG4gICAgICAgICAgICB3aWR0aDogdGhpcy53aWR0aCxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICAoZXJyLCB1cmwpID0+IHtcclxuICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHJlc29sdmUodXJsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHRvQ2FudmFzKGNhbnZhczogRWxlbWVudCkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKFxyXG4gICAgICAocmVzb2x2ZTogKGFyZzogYW55KSA9PiBhbnksIHJlamVjdDogKGFyZzogYW55KSA9PiBhbnkpID0+IHtcclxuICAgICAgICBRUkNvZGUudG9DYW52YXMoXHJcbiAgICAgICAgICBjYW52YXMsXHJcbiAgICAgICAgICB0aGlzLnFyZGF0YSxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgY29sb3I6IHtcclxuICAgICAgICAgICAgICBkYXJrOiB0aGlzLmNvbG9yRGFyayxcclxuICAgICAgICAgICAgICBsaWdodDogdGhpcy5jb2xvckxpZ2h0LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvckNvcnJlY3Rpb25MZXZlbDogdGhpcy5lcnJvckNvcnJlY3Rpb25MZXZlbCxcclxuICAgICAgICAgICAgbWFyZ2luOiB0aGlzLm1hcmdpbixcclxuICAgICAgICAgICAgc2NhbGU6IHRoaXMuc2NhbGUsXHJcbiAgICAgICAgICAgIHZlcnNpb246IHRoaXMudmVyc2lvbixcclxuICAgICAgICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgcmVzb2x2ZShcInN1Y2Nlc3NcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgICB9XHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB0b1NWRygpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShcclxuICAgICAgKHJlc29sdmU6IChhcmc6IGFueSkgPT4gYW55LCByZWplY3Q6IChhcmc6IGFueSkgPT4gYW55KSA9PiB7XHJcbiAgICAgICAgUVJDb2RlLnRvU3RyaW5nKFxyXG4gICAgICAgICAgdGhpcy5xcmRhdGEsXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbG9yOiB7XHJcbiAgICAgICAgICAgICAgZGFyazogdGhpcy5jb2xvckRhcmssXHJcbiAgICAgICAgICAgICAgbGlnaHQ6IHRoaXMuY29sb3JMaWdodCxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3JDb3JyZWN0aW9uTGV2ZWw6IHRoaXMuZXJyb3JDb3JyZWN0aW9uTGV2ZWwsXHJcbiAgICAgICAgICAgIG1hcmdpbjogdGhpcy5tYXJnaW4sXHJcbiAgICAgICAgICAgIHNjYWxlOiB0aGlzLnNjYWxlLFxyXG4gICAgICAgICAgICB0eXBlOiBcInN2Z1wiLFxyXG4gICAgICAgICAgICB2ZXJzaW9uOiB0aGlzLnZlcnNpb24sXHJcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIChlcnIsIHVybCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgcmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgcmVzb2x2ZSh1cmwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVuZGVyRWxlbWVudChlbGVtZW50OiBFbGVtZW50KSB7XHJcbiAgICBmb3IgKGNvbnN0IG5vZGUgb2YgdGhpcy5xcmNFbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY2hpbGROb2Rlcykge1xyXG4gICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNoaWxkKHRoaXMucXJjRWxlbWVudC5uYXRpdmVFbGVtZW50LCBub2RlKTtcclxuICAgIH1cclxuICAgIHRoaXMucmVuZGVyZXIuYXBwZW5kQ2hpbGQodGhpcy5xcmNFbGVtZW50Lm5hdGl2ZUVsZW1lbnQsIGVsZW1lbnQpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjcmVhdGVRUkNvZGUoKSB7XHJcbiAgICAvLyBTZXQgc2Vuc2l0aXZlIGRlZmF1bHRzXHJcbiAgICBpZiAodGhpcy52ZXJzaW9uICYmIHRoaXMudmVyc2lvbiA+IDQwKSB7XHJcbiAgICAgIGNvbnNvbGUud2FybihcIlthbmd1bGFyeC1xcmNvZGVdIG1heCB2YWx1ZSBmb3IgYHZlcnNpb25gIGlzIDQwXCIpO1xyXG4gICAgICB0aGlzLnZlcnNpb24gPSA0MDtcclxuICAgIH0gZWxzZSBpZiAodGhpcy52ZXJzaW9uICYmIHRoaXMudmVyc2lvbiA8IDEpIHtcclxuICAgICAgY29uc29sZS53YXJuKFwiW2FuZ3VsYXJ4LXFyY29kZV1gbWluIHZhbHVlIGZvciBgdmVyc2lvbmAgaXMgMVwiKTtcclxuICAgICAgdGhpcy52ZXJzaW9uID0gMTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy52ZXJzaW9uICE9PSB1bmRlZmluZWQgJiYgaXNOYU4odGhpcy52ZXJzaW9uKSkge1xyXG4gICAgICBjb25zb2xlLndhcm4oXHJcbiAgICAgICAgXCJbYW5ndWxhcngtcXJjb2RlXSB2ZXJzaW9uIHNob3VsZCBiZSBhIG51bWJlciwgZGVmYXVsdGluZyB0byBhdXRvXCJcclxuICAgICAgKTtcclxuICAgICAgdGhpcy52ZXJzaW9uID0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIGlmICghdGhpcy5pc1ZhbGlkUXJDb2RlVGV4dCh0aGlzLnFyZGF0YSkpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJbYW5ndWxhcngtcXJjb2RlXSBGaWVsZCBgcXJkYXRhYCBpcyBlbXB0eVwiKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IGVsZW1lbnQ6IEVsZW1lbnQ7XHJcblxyXG4gICAgICBzd2l0Y2ggKHRoaXMuZWxlbWVudFR5cGUpIHtcclxuICAgICAgICBjYXNlIFwiY2FudmFzXCI6XHJcbiAgICAgICAgICBlbGVtZW50ID0gdGhpcy5yZW5kZXJlci5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xyXG4gICAgICAgICAgdGhpcy50b0NhbnZhcyhlbGVtZW50KVxyXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJFbGVtZW50KGVsZW1lbnQpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goKGUpID0+IHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiW2FuZ3VsYXJ4LXFyY29kZV0gY2FudmFzIGVycm9yOiBcIiwgZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcInN2Z1wiOlxyXG4gICAgICAgICAgZWxlbWVudCA9IHRoaXMucmVuZGVyZXIuY3JlYXRlRWxlbWVudChcInN2Z1wiLCBcInN2Z1wiKTtcclxuICAgICAgICAgIHRoaXMudG9TVkcoKVxyXG4gICAgICAgICAgICAudGhlbigoc3ZnU3RyaW5nOiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgICBlbGVtZW50LmlubmVySFRNTCA9IHN2Z1N0cmluZztcclxuICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEF0dHJpYnV0ZShlbGVtZW50LCBcImhlaWdodFwiLCBgJHt0aGlzLndpZHRofWApO1xyXG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKGVsZW1lbnQsIFwid2lkdGhcIiwgYCR7dGhpcy53aWR0aH1gKTtcclxuICAgICAgICAgICAgICB0aGlzLnJlbmRlckVsZW1lbnQoZWxlbWVudCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5jYXRjaCgoZSkgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJbYW5ndWxhcngtcXJjb2RlXSBzdmcgZXJyb3I6IFwiLCBlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwidXJsXCI6XHJcbiAgICAgICAgY2FzZSBcImltZ1wiOlxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBlbGVtZW50ID0gdGhpcy5yZW5kZXJlci5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgICAgdGhpcy50b0RhdGFVUkwoKVxyXG4gICAgICAgICAgICAudGhlbigoZGF0YVVybDogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgZGF0YVVybCk7XHJcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJFbGVtZW50KGVsZW1lbnQpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goKGUpID0+IHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiW2FuZ3VsYXJ4LXFyY29kZV0gaW1nL3VybCBlcnJvcjogXCIsIGUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBjb25zb2xlLmVycm9yKFwiW2FuZ3VsYXJ4LXFyY29kZV0gRXJyb3IgZ2VuZXJhdGluZyBRUiBDb2RlOiBcIiwgZS5tZXNzYWdlKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19