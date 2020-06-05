import { __decorate, __param, __values } from "tslib";
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Inject, Input, OnChanges, PLATFORM_ID, Renderer2, ViewChild, } from "@angular/core";
import { isPlatformServer } from "@angular/common";
import * as QRCode from "qrcode";
var QRCodeComponent = /** @class */ (function () {
    function QRCodeComponent(renderer, platformId) {
        var _this = this;
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
        this.isValidQrCodeText = function (data) {
            if (_this.allowEmptyString === false) {
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
            console.warn("[angularx-qrcode] usesvg is deprecated, use [elementType]=\"'img'\".");
        }
    }
    QRCodeComponent.prototype.ngAfterViewInit = function () {
        if (isPlatformServer(this.platformId)) {
            return;
        }
        // if (!QRCode) {
        //   QRCode = require('qrcode');
        // }
        this.createQRCode();
    };
    QRCodeComponent.prototype.ngOnChanges = function () {
        this.createQRCode();
    };
    QRCodeComponent.prototype.toDataURL = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            QRCode.toDataURL(_this.qrdata, {
                color: {
                    dark: _this.colorDark,
                    light: _this.colorLight,
                },
                errorCorrectionLevel: _this.errorCorrectionLevel,
                margin: _this.margin,
                scale: _this.scale,
                version: _this.version,
                width: _this.width,
            }, function (err, url) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(url);
                }
            });
        });
    };
    QRCodeComponent.prototype.toCanvas = function (canvas) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            QRCode.toCanvas(canvas, _this.qrdata, {
                color: {
                    dark: _this.colorDark,
                    light: _this.colorLight,
                },
                errorCorrectionLevel: _this.errorCorrectionLevel,
                margin: _this.margin,
                scale: _this.scale,
                version: _this.version,
                width: _this.width,
            }, function (error) {
                if (error) {
                    reject(error);
                }
                else {
                    resolve("success");
                }
            });
        });
    };
    QRCodeComponent.prototype.toSVG = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            QRCode.toString(_this.qrdata, {
                color: {
                    dark: _this.colorDark,
                    light: _this.colorLight,
                },
                errorCorrectionLevel: _this.errorCorrectionLevel,
                margin: _this.margin,
                scale: _this.scale,
                type: "svg",
                version: _this.version,
                width: _this.width,
            }, function (err, url) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(url);
                }
            });
        });
    };
    QRCodeComponent.prototype.renderElement = function (element) {
        var e_1, _a;
        try {
            for (var _b = __values(this.qrcElement.nativeElement.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var node = _c.value;
                this.renderer.removeChild(this.qrcElement.nativeElement, node);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this.renderer.appendChild(this.qrcElement.nativeElement, element);
    };
    QRCodeComponent.prototype.createQRCode = function () {
        var _this = this;
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
            var element_1;
            switch (this.elementType) {
                case "canvas":
                    element_1 = this.renderer.createElement("canvas");
                    this.toCanvas(element_1)
                        .then(function () {
                        _this.renderElement(element_1);
                    })
                        .catch(function (e) {
                        console.error("[angularx-qrcode] canvas error: ", e);
                    });
                    break;
                case "svg":
                    element_1 = this.renderer.createElement("svg", "svg");
                    this.toSVG()
                        .then(function (svgString) {
                        element_1.innerHTML = svgString;
                        _this.renderer.setAttribute(element_1, "height", "" + _this.width);
                        _this.renderer.setAttribute(element_1, "width", "" + _this.width);
                        _this.renderElement(element_1);
                    })
                        .catch(function (e) {
                        console.error("[angularx-qrcode] svg error: ", e);
                    });
                    break;
                case "url":
                case "img":
                default:
                    element_1 = this.renderer.createElement("img");
                    this.toDataURL()
                        .then(function (dataUrl) {
                        element_1.setAttribute("src", dataUrl);
                        _this.renderElement(element_1);
                    })
                        .catch(function (e) {
                        console.error("[angularx-qrcode] img/url error: ", e);
                    });
            }
        }
        catch (e) {
            console.error("[angularx-qrcode] Error generating QR Code: ", e.message);
        }
    };
    QRCodeComponent.ctorParameters = function () { return [
        { type: Renderer2 },
        { type: undefined, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] }
    ]; };
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
            template: "<div #qrcElement [class]=\"cssClass\"></div>"
        }),
        __param(1, Inject(PLATFORM_ID))
    ], QRCodeComponent);
    return QRCodeComponent;
}());
export { QRCodeComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhcngtcXJjb2RlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXJ4LXFyY29kZS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyeC1xcmNvZGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsYUFBYSxFQUNiLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBQ0wsU0FBUyxFQUNULFdBQVcsRUFDWCxTQUFTLEVBQ1QsU0FBUyxHQUNWLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ25ELE9BQU8sS0FBSyxNQUFNLE1BQU0sUUFBUSxDQUFDO0FBWWpDO0lBNkJFLHlCQUNVLFFBQW1CLEVBQ1csVUFBZTtRQUZ2RCxpQkErQkM7UUE5QlMsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUNXLGVBQVUsR0FBVixVQUFVLENBQUs7UUE5QnZELGFBQWE7UUFDRyxjQUFTLEdBQVcsRUFBRSxDQUFDO1FBQ3ZCLGVBQVUsR0FBVyxFQUFFLENBQUM7UUFDeEIsVUFBSyxHQUFXLEVBQUUsQ0FBQztRQUNuQixjQUFTLEdBQVksS0FBSyxDQUFDO1FBQzNCLFNBQUksR0FBVyxDQUFDLENBQUM7UUFDakIsV0FBTSxHQUFZLEtBQUssQ0FBQztRQUV4Qyx3QkFBd0I7UUFDUixxQkFBZ0IsR0FBWSxLQUFLLENBQUM7UUFDbEMsV0FBTSxHQUFXLEVBQUUsQ0FBQztRQUVwQyxpQ0FBaUM7UUFDakIsY0FBUyxHQUFXLFdBQVcsQ0FBQztRQUNoQyxlQUFVLEdBQVcsV0FBVyxDQUFDO1FBQ2pDLGFBQVEsR0FBVyxRQUFRLENBQUM7UUFDNUIsZ0JBQVcsR0FBbUMsUUFBUSxDQUFDO1FBRWhFLHlCQUFvQixHQUE0QyxHQUFHLENBQUM7UUFDM0QsV0FBTSxHQUFXLENBQUMsQ0FBQztRQUNuQixVQUFLLEdBQVcsQ0FBQyxD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QztRQUFSLEtBQUssRUFBRTtxREFBb0M7SUFDbkM7UUFBUixLQUFLLEVBQUU7d0RBQStEO0lBRXZFO1FBREMsS0FBSyxFQUFFO2lFQUNtRTtJQUNsRTtRQUFSLEtBQUssRUFBRTttREFBMkI7SUFDMUI7UUFBUixLQUFLLEVBQUU7a0RBQTBCO0lBQ3pCO1FBQVIsS0FBSyxFQUFFO29EQUErQjtJQUM5QjtRQUFSLEtBQUssRUFBRTtrREFBMkI7SUFFUTtRQUExQyxTQUFTLENBQUMsWUFBWSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDO3VEQUErQjtJQXpCOUQsZUFBZTtRQUwzQixTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsUUFBUTtZQUNsQixlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtZQUMvQyxRQUFRLEVBQUUsOENBQTRDO1NBQ3ZELENBQUM7UUFnQ0csV0FBQSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUE7T0EvQlgsZUFBZSxDQW9QM0I7SUFBRCxzQkFBQztDQUFBLEFBcFBELElBb1BDO1NBcFBZLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIFBMQVRGT1JNX0lELFxuICBSZW5kZXJlcjIsXG4gIFZpZXdDaGlsZCxcbn0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IGlzUGxhdGZvcm1TZXJ2ZXIgfSBmcm9tIFwiQGFuZ3VsYXIvY29tbW9uXCI7XG5pbXBvcnQgKiBhcyBRUkNvZGUgZnJvbSBcInFyY29kZVwiO1xuaW1wb3J0IHtcbiAgUVJDb2RlRXJyb3JDb3JyZWN0aW9uTGV2ZWwsXG4gIFFSQ29kZVZlcnNpb24sXG4gIFFSQ29kZUVsZW1lbnRUeXBlLFxufSBmcm9tIFwiLi90eXBlc1wiO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6IFwicXJjb2RlXCIsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICB0ZW1wbGF0ZTogYDxkaXYgI3FyY0VsZW1lbnQgW2NsYXNzXT1cImNzc0NsYXNzXCI+PC9kaXY+YCxcbn0pXG5leHBvcnQgY2xhc3MgUVJDb2RlQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzLCBBZnRlclZpZXdJbml0IHtcbiAgLy8gRGVwcmVjYXRlZFxuICBASW5wdXQoKSBwdWJsaWMgY29sb3JkYXJrOiBzdHJpbmcgPSBcIlwiO1xuICBASW5wdXQoKSBwdWJsaWMgY29sb3JsaWdodDogc3RyaW5nID0gXCJcIjtcbiAgQElucHV0KCkgcHVibGljIGxldmVsOiBzdHJpbmcgPSBcIlwiO1xuICBASW5wdXQoKSBwdWJsaWMgaGlkZXRpdGxlOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpIHB1YmxpYyBzaXplOiBudW1iZXIgPSAwO1xuICBASW5wdXQoKSBwdWJsaWMgdXNlc3ZnOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLy8gVmFsaWQgZm9yIDEueCBhbmQgMi54XG4gIEBJbnB1dCgpIHB1YmxpYyBhbGxvd0VtcHR5U3RyaW5nOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpIHB1YmxpYyBxcmRhdGE6IHN0cmluZyA9IFwiXCI7XG5cbiAgLy8gTmV3IGZpZWxkcyBpbnRyb2R1Y2VkIGluIDIuMC4wXG4gIEBJbnB1dCgpIHB1YmxpYyBjb2xvckRhcms6IHN0cmluZyA9IFwiIzAwMDAwMGZmXCI7XG4gIEBJbnB1dCgpIHB1YmxpYyBjb2xvckxpZ2h0OiBzdHJpbmcgPSBcIiNmZmZmZmZmZlwiO1xuICBASW5wdXQoKSBwdWJsaWMgY3NzQ2xhc3M6IHN0cmluZyA9IFwicXJjb2RlXCI7XG4gIEBJbnB1dCgpIHB1YmxpYyBlbGVtZW50VHlwZToga2V5b2YgdHlwZW9mIFFSQ29kZUVsZW1lbnRUeXBlID0gXCJjYW52YXNcIjtcbiAgQElucHV0KClcbiAgcHVibGljIGVycm9yQ29ycmVjdGlvbkxldmVsOiBrZXlvZiB0eXBlb2YgUVJDb2RlRXJyb3JDb3JyZWN0aW9uTGV2ZWwgPSBcIk1cIjtcbiAgQElucHV0KCkgcHVibGljIG1hcmdpbjogbnVtYmVyID0gNDtcbiAgQElucHV0KCkgcHVibGljIHNjYWxlOiBudW1iZXIgPSA0O1xuICBASW5wdXQoKSBwdWJsaWMgdmVyc2lvbjogUVJDb2RlVmVyc2lvbjtcbiAgQElucHV0KCkgcHVibGljIHdpZHRoOiBudW1iZXIgPSAxMDtcblxuICBAVmlld0NoaWxkKFwicXJjRWxlbWVudFwiLCB7IHN0YXRpYzogdHJ1ZSB9KSBwdWJsaWMgcXJjRWxlbWVudDogRWxlbWVudFJlZjtcblxuICBwdWJsaWMgcXJjb2RlOiBhbnkgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBASW5qZWN0KFBMQVRGT1JNX0lEKSBwcml2YXRlIHJlYWRvbmx5IHBsYXRmb3JtSWQ6IGFueVxuICApIHtcbiAgICAvLyBEZXByZWN0YXRpb24gd2FybmluZ3NcbiAgICBpZiAodGhpcy5jb2xvcmRhcmsgIT09IFwiXCIpIHtcbiAgICAgIGNvbnNvbGUud2FybihcIlthbmd1bGFyeC1xcmNvZGVdIGNvbG9yZGFyayBpcyBkZXByZWNhdGVkLCB1c2UgY29sb3JEYXJrLlwiKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuY29sb3JsaWdodCAhPT0gXCJcIikge1xuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICBcIlthbmd1bGFyeC1xcmNvZGVdIGNvbG9ybGlnaHQgaXMgZGVwcmVjYXRlZCwgdXNlIGNvbG9yTGlnaHQuXCJcbiAgICAgICk7XG4gICAgfVxuICAgIGlmICh0aGlzLmxldmVsICE9PSBcIlwiKSB7XG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgIFwiW2FuZ3VsYXJ4LXFyY29kZV0gbGV2ZWwgaXMgZGVwcmVjYXRlZCwgdXNlIGVycm9yQ29ycmVjdGlvbkxldmVsLlwiXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAodGhpcy5oaWRldGl0bGUgIT09IGZhbHNlKSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJbYW5ndWxhcngtcXJjb2RlXSBoaWRldGl0bGUgaXMgZGVwcmVjYXRlZC5cIik7XG4gICAgfVxuICAgIGlmICh0aGlzLnNpemUgIT09IDApIHtcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgXCJbYW5ndWxhcngtcXJjb2RlXSBzaXplIGlzIGRlcHJlY2F0ZWQsIHVzZSBgd2lkdGhgLiBEZWZhdWx0cyB0byAxMC5cIlxuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKHRoaXMudXNlc3ZnICE9PSBmYWxzZSkge1xuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICBgW2FuZ3VsYXJ4LXFyY29kZV0gdXNlc3ZnIGlzIGRlcHJlY2F0ZWQsIHVzZSBbZWxlbWVudFR5cGVdPVwiJ2ltZydcIi5gXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgaWYgKGlzUGxhdGZvcm1TZXJ2ZXIodGhpcy5wbGF0Zm9ybUlkKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBpZiAoIVFSQ29kZSkge1xuICAgIC8vICAgUVJDb2RlID0gcmVxdWlyZSgncXJjb2RlJyk7XG4gICAgLy8gfVxuICAgIHRoaXMuY3JlYXRlUVJDb2RlKCk7XG4gIH1cblxuICBwdWJsaWMgbmdPbkNoYW5nZXMoKSB7XG4gICAgdGhpcy5jcmVhdGVRUkNvZGUoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBpc1ZhbGlkUXJDb2RlVGV4dCA9IChkYXRhOiBzdHJpbmcgfCBudWxsKTogYm9vbGVhbiA9PiB7XG4gICAgaWYgKHRoaXMuYWxsb3dFbXB0eVN0cmluZyA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiAhKFxuICAgICAgICB0eXBlb2YgZGF0YSA9PT0gXCJ1bmRlZmluZWRcIiB8fFxuICAgICAgICBkYXRhID09PSBcIlwiIHx8XG4gICAgICAgIGRhdGEgPT09IFwibnVsbFwiIHx8XG4gICAgICAgIGRhdGEgPT09IG51bGxcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiAhKHR5cGVvZiBkYXRhID09PSBcInVuZGVmaW5lZFwiKTtcbiAgfTtcblxuICBwcml2YXRlIHRvRGF0YVVSTCgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoXG4gICAgICAocmVzb2x2ZTogKGFyZzogYW55KSA9PiBhbnksIHJlamVjdDogKGFyZzogYW55KSA9PiBhbnkpID0+IHtcbiAgICAgICAgUVJDb2RlLnRvRGF0YVVSTChcbiAgICAgICAgICB0aGlzLnFyZGF0YSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjb2xvcjoge1xuICAgICAgICAgICAgICBkYXJrOiB0aGlzLmNvbG9yRGFyayxcbiAgICAgICAgICAgICAgbGlnaHQ6IHRoaXMuY29sb3JMaWdodCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvckNvcnJlY3Rpb25MZXZlbDogdGhpcy5lcnJvckNvcnJlY3Rpb25MZXZlbCxcbiAgICAgICAgICAgIG1hcmdpbjogdGhpcy5tYXJnaW4sXG4gICAgICAgICAgICBzY2FsZTogdGhpcy5zY2FsZSxcbiAgICAgICAgICAgIHZlcnNpb246IHRoaXMudmVyc2lvbixcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgKGVyciwgdXJsKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVzb2x2ZSh1cmwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSB0b0NhbnZhcyhjYW52YXM6IEVsZW1lbnQpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoXG4gICAgICAocmVzb2x2ZTogKGFyZzogYW55KSA9PiBhbnksIHJlamVjdDogKGFyZzogYW55KSA9PiBhbnkpID0+IHtcbiAgICAgICAgUVJDb2RlLnRvQ2FudmFzKFxuICAgICAgICAgIGNhbnZhcyxcbiAgICAgICAgICB0aGlzLnFyZGF0YSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjb2xvcjoge1xuICAgICAgICAgICAgICBkYXJrOiB0aGlzLmNvbG9yRGFyayxcbiAgICAgICAgICAgICAgbGlnaHQ6IHRoaXMuY29sb3JMaWdodCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvckNvcnJlY3Rpb25MZXZlbDogdGhpcy5lcnJvckNvcnJlY3Rpb25MZXZlbCxcbiAgICAgICAgICAgIG1hcmdpbjogdGhpcy5tYXJnaW4sXG4gICAgICAgICAgICBzY2FsZTogdGhpcy5zY2FsZSxcbiAgICAgICAgICAgIHZlcnNpb246IHRoaXMudmVyc2lvbixcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgKGVycm9yKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJlc29sdmUoXCJzdWNjZXNzXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSB0b1NWRygpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoXG4gICAgICAocmVzb2x2ZTogKGFyZzogYW55KSA9PiBhbnksIHJlamVjdDogKGFyZzogYW55KSA9PiBhbnkpID0+IHtcbiAgICAgICAgUVJDb2RlLnRvU3RyaW5nKFxuICAgICAgICAgIHRoaXMucXJkYXRhLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvbG9yOiB7XG4gICAgICAgICAgICAgIGRhcms6IHRoaXMuY29sb3JEYXJrLFxuICAgICAgICAgICAgICBsaWdodDogdGhpcy5jb2xvckxpZ2h0LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yQ29ycmVjdGlvbkxldmVsOiB0aGlzLmVycm9yQ29ycmVjdGlvbkxldmVsLFxuICAgICAgICAgICAgbWFyZ2luOiB0aGlzLm1hcmdpbixcbiAgICAgICAgICAgIHNjYWxlOiB0aGlzLnNjYWxlLFxuICAgICAgICAgICAgdHlwZTogXCJzdmdcIixcbiAgICAgICAgICAgIHZlcnNpb246IHRoaXMudmVyc2lvbixcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgKGVyciwgdXJsKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVzb2x2ZSh1cmwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJFbGVtZW50KGVsZW1lbnQ6IEVsZW1lbnQpIHtcbiAgICBmb3IgKGNvbnN0IG5vZGUgb2YgdGhpcy5xcmNFbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY2hpbGROb2Rlcykge1xuICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDaGlsZCh0aGlzLnFyY0VsZW1lbnQubmF0aXZlRWxlbWVudCwgbm9kZSk7XG4gICAgfVxuICAgIHRoaXMucmVuZGVyZXIuYXBwZW5kQ2hpbGQodGhpcy5xcmNFbGVtZW50Lm5hdGl2ZUVsZW1lbnQsIGVsZW1lbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVRUkNvZGUoKSB7XG4gICAgLy8gU2V0IHNlbnNpdGl2ZSBkZWZhdWx0c1xuICAgIGlmICh0aGlzLnZlcnNpb24gJiYgdGhpcy52ZXJzaW9uID4gNDApIHtcbiAgICAgIGNvbnNvbGUud2FybihcIlthbmd1bGFyeC1xcmNvZGVdIG1heCB2YWx1ZSBmb3IgYHZlcnNpb25gIGlzIDQwXCIpO1xuICAgICAgdGhpcy52ZXJzaW9uID0gNDA7XG4gICAgfSBlbHNlIGlmICh0aGlzLnZlcnNpb24gJiYgdGhpcy52ZXJzaW9uIDwgMSkge1xuICAgICAgY29uc29sZS53YXJuKFwiW2FuZ3VsYXJ4LXFyY29kZV1gbWluIHZhbHVlIGZvciBgdmVyc2lvbmAgaXMgMVwiKTtcbiAgICAgIHRoaXMudmVyc2lvbiA9IDE7XG4gICAgfSBlbHNlIGlmICh0aGlzLnZlcnNpb24gIT09IHVuZGVmaW5lZCAmJiBpc05hTih0aGlzLnZlcnNpb24pKSB7XG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgIFwiW2FuZ3VsYXJ4LXFyY29kZV0gdmVyc2lvbiBzaG91bGQgYmUgYSBudW1iZXIsIGRlZmF1bHRpbmcgdG8gYXV0b1wiXG4gICAgICApO1xuICAgICAgdGhpcy52ZXJzaW9uID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBpZiAoIXRoaXMuaXNWYWxpZFFyQ29kZVRleHQodGhpcy5xcmRhdGEpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlthbmd1bGFyeC1xcmNvZGVdIEZpZWxkIGBxcmRhdGFgIGlzIGVtcHR5XCIpO1xuICAgICAgfVxuXG4gICAgICBsZXQgZWxlbWVudDogRWxlbWVudDtcblxuICAgICAgc3dpdGNoICh0aGlzLmVsZW1lbnRUeXBlKSB7XG4gICAgICAgIGNhc2UgXCJjYW52YXNcIjpcbiAgICAgICAgICBlbGVtZW50ID0gdGhpcy5yZW5kZXJlci5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgICAgICAgIHRoaXMudG9DYW52YXMoZWxlbWVudClcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJFbGVtZW50KGVsZW1lbnQpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCgoZSkgPT4ge1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiW2FuZ3VsYXJ4LXFyY29kZV0gY2FudmFzIGVycm9yOiBcIiwgZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInN2Z1wiOlxuICAgICAgICAgIGVsZW1lbnQgPSB0aGlzLnJlbmRlcmVyLmNyZWF0ZUVsZW1lbnQoXCJzdmdcIiwgXCJzdmdcIik7XG4gICAgICAgICAgdGhpcy50b1NWRygpXG4gICAgICAgICAgICAudGhlbigoc3ZnU3RyaW5nOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSBzdmdTdHJpbmc7XG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKGVsZW1lbnQsIFwiaGVpZ2h0XCIsIGAke3RoaXMud2lkdGh9YCk7XG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKGVsZW1lbnQsIFwid2lkdGhcIiwgYCR7dGhpcy53aWR0aH1gKTtcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJFbGVtZW50KGVsZW1lbnQpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCgoZSkgPT4ge1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiW2FuZ3VsYXJ4LXFyY29kZV0gc3ZnIGVycm9yOiBcIiwgZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInVybFwiOlxuICAgICAgICBjYXNlIFwiaW1nXCI6XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgZWxlbWVudCA9IHRoaXMucmVuZGVyZXIuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcbiAgICAgICAgICB0aGlzLnRvRGF0YVVSTCgpXG4gICAgICAgICAgICAudGhlbigoZGF0YVVybDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKFwic3JjXCIsIGRhdGFVcmwpO1xuICAgICAgICAgICAgICB0aGlzLnJlbmRlckVsZW1lbnQoZWxlbWVudCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKChlKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJbYW5ndWxhcngtcXJjb2RlXSBpbWcvdXJsIGVycm9yOiBcIiwgZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiW2FuZ3VsYXJ4LXFyY29kZV0gRXJyb3IgZ2VuZXJhdGluZyBRUiBDb2RlOiBcIiwgZS5tZXNzYWdlKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==