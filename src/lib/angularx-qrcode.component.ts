import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { isPlatformServer } from "@angular/common";
import * as QRCode from "qrcode";
import {
  QRCodeErrorCorrectionLevel,
  QRCodeVersion,
  QRCodeElementType,
} from "./types";

@Component({
  selector: "qrcode",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div #qrcElement [class]="cssClass"></div>`,
})
export class QRCodeComponent implements OnChanges, AfterViewInit {
  // Deprecated
  @Input() public colordark: string = "";
  @Input() public colorlight: string = "";
  @Input() public level: string = "";
  @Input() public hidetitle: boolean = false;
  @Input() public size: number = 0;
  @Input() public usesvg: boolean = false;

  // Valid for 1.x and 2.x
  @Input() public allowEmptyString: boolean = false;
  @Input() public qrdata: string = "";

  // New fields introduced in 2.0.0
  @Input() public colorDark: string = "#000000ff";
  @Input() public colorLight: string = "#ffffffff";
  @Input() public cssClass: string = "qrcode";
  @Input() public elementType: keyof typeof QRCodeElementType = "canvas";
  @Input()
  public errorCorrectionLevel: keyof typeof QRCodeErrorCorrectionLevel = "M";
  @Input() public margin: number = 4;
  @Input() public scale: number = 4;
  @Input() public version: QRCodeVersion;
  @Input() public width: number = 10;

  @ViewChild("qrcElement", { static: true }) public qrcElement: ElementRef;

  public qrcode: any = null;

  constructor(
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private readonly platformId: any
  ) {
    // Deprectation warnings
    if (this.colordark !== "") {
      console.warn("[angularx-qrcode] colordark is deprecated, use colorDark.");
    }
    if (this.colorlight !== "") {
      console.warn(
        "[angularx-qrcode] colorlight is deprecated, use colorLight."
      );
    }
    if (this.level !== "") {
      console.warn(
        "[angularx-qrcode] level is deprecated, use errorCorrectionLevel."
      );
    }
    if (this.hidetitle !== false) {
      console.warn("[angularx-qrcode] hidetitle is deprecated.");
    }
    if (this.size !== 0) {
      console.warn(
        "[angularx-qrcode] size is deprecated, use `width`. Defaults to 10."
      );
    }
    if (this.usesvg !== false) {
      console.warn(
        `[angularx-qrcode] usesvg is deprecated, use [elementType]="'img'".`
      );
    }
  }

  public ngAfterViewInit() {
    if (isPlatformServer(this.platformId)) {
      return;
    }
    // if (!QRCode) {
    //   QRCode = require('qrcode');
    // }
    this.createQRCode();
  }

  public ngOnChanges() {
    this.createQRCode();
  }

  protected isValidQrCodeText = (data: string | null): boolean => {
    if (this.allowEmptyString === false) {
      return !(
        typeof data === "undefined" ||
        data === "" ||
        data === "null" ||
        data === null
      );
    }
    return !(typeof data === "undefined");
  };

  private toDataURL() {
    return new Promise(
      (resolve: (arg: any) => any, reject: (arg: any) => any) => {
        QRCode.toDataURL(
          this.qrdata,
          {
            color: {
              dark: this.colorDark,
              light: this.colorLight,
            },
            errorCorrectionLevel: this.errorCorrectionLevel,
            margin: this.margin,
            scale: this.scale,
            version: this.version,
            width: this.width,
          },
          (err, url) => {
            if (err) {
              reject(err);
            } else {
              resolve(url);
            }
          }
        );
      }
    );
  }

  private toCanvas(canvas: Element) {
    return new Promise(
      (resolve: (arg: any) => any, reject: (arg: any) => any) => {
        QRCode.toCanvas(
          canvas,
          this.qrdata,
          {
            color: {
              dark: this.colorDark,
              light: this.colorLight,
            },
            errorCorrectionLevel: this.errorCorrectionLevel,
            margin: this.margin,
            scale: this.scale,
            version: this.version,
            width: this.width,
          },
          (error) => {
            if (error) {
              reject(error);
            } else {
              resolve("success");
            }
          }
        );
      }
    );
  }

  private toSVG() {
    return new Promise(
      (resolve: (arg: any) => any, reject: (arg: any) => any) => {
        QRCode.toString(
          this.qrdata,
          {
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
          },
          (err, url) => {
            if (err) {
              reject(err);
            } else {
              resolve(url);
            }
          }
        );
      }
    );
  }

  private renderElement(element: Element) {
    for (const node of this.qrcElement.nativeElement.childNodes) {
      this.renderer.removeChild(this.qrcElement.nativeElement, node);
    }
    this.renderer.appendChild(this.qrcElement.nativeElement, element);
  }

  private createQRCode() {
    // Set sensitive defaults
    if (this.version && this.version > 40) {
      console.warn("[angularx-qrcode] max value for `version` is 40");
      this.version = 40;
    } else if (this.version && this.version < 1) {
      console.warn("[angularx-qrcode]`min value for `version` is 1");
      this.version = 1;
    } else if (this.version !== undefined && isNaN(this.version)) {
      console.warn(
        "[angularx-qrcode] version should be a number, defaulting to auto"
      );
      this.version = undefined;
    }

    try {
      if (!this.isValidQrCodeText(this.qrdata)) {
        throw new Error("[angularx-qrcode] Field `qrdata` is empty");
      }

      let element: Element;

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
            .then((svgString: string) => {
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
            .then((dataUrl: string) => {
              element.setAttribute("src", dataUrl);
              this.renderElement(element);
            })
            .catch((e) => {
              console.error("[angularx-qrcode] img/url error: ", e);
            });
      }
    } catch (e) {
      console.error("[angularx-qrcode] Error generating QR Code: ", e.message);
    }
  }
}
