import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  Renderer2,
  ViewChild,
} from "@angular/core"
import { DomSanitizer, SafeUrl } from "@angular/platform-browser"
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import * as QRCode from "@cordobo/qrcode"
import {
  QRCodeErrorCorrectionLevel,
  QRCodeVersion,
  QRCodeElementType,
} from "./types"

@Component({
  selector: "qrcode",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div #qrcElement [class]="cssClass"></div>`,
})
export class QRCodeComponent implements OnChanges {
  @Input() public allowEmptyString = false
  @Input() public colorDark = "#000000ff"
  @Input() public colorLight = "#ffffffff"
  @Input() public cssClass = "qrcode"
  @Input() public elementType: QRCodeElementType = "canvas"
  @Input()
  public errorCorrectionLevel: QRCodeErrorCorrectionLevel = "M"
  @Input() public margin = 4
  @Input() public qrdata = ""
  @Input() public scale = 4
  @Input() public version: QRCodeVersion | undefined
  @Input() public width = 10
  @Output() qrCodeURL = new EventEmitter<SafeUrl>()

  // Accessibility features introduced in 13.0.4+
  @Input() public alt: string | null = null
  @Input() public ariaLabel: string | null = null
  @Input() public title: string | null = null

  @ViewChild("qrcElement", { static: true }) public qrcElement!: ElementRef

  constructor(private renderer: Renderer2, private sanitizer: DomSanitizer) {}

  public ngOnChanges(): void {
    this.createQRCode()
  }

  protected isValidQrCodeText(data: string | null): boolean {
    if (this.allowEmptyString === false) {
      return !(
        typeof data === "undefined" ||
        data === "" ||
        data === "null" ||
        data === null
      )
    }
    return !(typeof data === "undefined")
  }

  private toDataURL(): Promise<any> {
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
          (err: Error, url: string) => {
            if (err) {
              reject(err)
            } else {
              resolve(url)
            }
          }
        )
      }
    )
  }

  private toCanvas(canvas: Element): Promise<any> {
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
          (error: Error) => {
            if (error) {
              reject(error)
            } else {
              resolve("success")
            }
          }
        )
      }
    )
  }

  private toSVG(): Promise<any> {
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
          (err: Error, url: string) => {
            if (err) {
              reject(err)
            } else {
              resolve(url)
            }
          }
        )
      }
    )
  }

  private renderElement(element: Element): void {
    for (const node of this.qrcElement.nativeElement.childNodes) {
      this.renderer.removeChild(this.qrcElement.nativeElement, node)
    }
    this.renderer.appendChild(this.qrcElement.nativeElement, element)
  }

  private createQRCode(): void {
    // Set sensitive defaults
    if (this.version && this.version > 40) {
      console.warn("[angularx-qrcode] max value for `version` is 40")
      this.version = 40
    } else if (this.version && this.version < 1) {
      console.warn("[angularx-qrcode]`min value for `version` is 1")
      this.version = 1
    } else if (this.version !== undefined && isNaN(this.version)) {
      console.warn(
        "[angularx-qrcode] version should be a number, defaulting to auto."
      )
      this.version = undefined
    }

    try {
      if (!this.isValidQrCodeText(this.qrdata)) {
        throw new Error(
          "[angularx-qrcode] Field `qrdata` is empty, set 'allowEmptyString=\"true\"' to overwrite this behaviour."
        )
      }

      // This is a fix to allow an empty string as qrdata
      if (this.isValidQrCodeText(this.qrdata) && this.qrdata === "") {
        this.qrdata = " "
      }

      let element: Element

      switch (this.elementType) {
        case "canvas":
          element = this.renderer.createElement("canvas")
          this.toCanvas(element)
            .then(() => {
              if (this.ariaLabel) {
                this.renderer.setAttribute(
                  element,
                  "aria-label",
                  `${this.ariaLabel}`
                )
              }
              if (this.title) {
                this.renderer.setAttribute(element, "title", `${this.title}`)
              }
              this.renderElement(element)
              this.emitQRCodeURL(element as HTMLCanvasElement)
            })
            .catch((e) => {
              console.error("[angularx-qrcode] canvas error:", e)
            })
          break
        case "svg":
          element = this.renderer.createElement("div")
          this.toSVG()
            .then((svgString: string) => {
              this.renderer.setProperty(element, "innerHTML", svgString)
              const innerElement = element.firstChild as Element
              this.renderer.setAttribute(
                innerElement,
                "height",
                `${this.width}`
              )
              this.renderer.setAttribute(innerElement, "width", `${this.width}`)
              this.renderElement(innerElement)
              this.emitQRCodeURL(innerElement as SVGSVGElement)
            })
            .catch((e) => {
              console.error("[angularx-qrcode] svg error:", e)
            })
          break
        case "url":
        case "img":
        default:
          element = this.renderer.createElement("img")
          this.toDataURL()
            .then((dataUrl: string) => {
              if (this.alt) {
                element.setAttribute("alt", this.alt)
              }
              if (this.ariaLabel) {
                element.setAttribute("aria-label", this.ariaLabel)
              }
              element.setAttribute("src", dataUrl)
              if (this.title) {
                element.setAttribute("title", this.title)
              }
              this.renderElement(element)
              this.emitQRCodeURL(element as HTMLImageElement)
            })
            .catch((e) => {
              console.error("[angularx-qrcode] img/url error:", e)
            })
      }
    } catch (e: any) {
      console.error("[angularx-qrcode] Error generating QR Code:", e.message)
    }
  }

  emitQRCodeURL(element: HTMLCanvasElement | HTMLImageElement | SVGSVGElement) {
    const className = element.constructor.name
    if (className === SVGSVGElement.name) {
      const svgHTML = element.outerHTML
      const blob = new Blob([svgHTML], {type: "image/svg+xml"})
      const urlSvg = URL.createObjectURL(blob)
      const urlSanitized = this.sanitizer.bypassSecurityTrustUrl(urlSvg)
      this.qrCodeURL.emit(urlSanitized)
      return
    }

    let urlImage = ""
    if (className === HTMLCanvasElement.name) {
      urlImage = (element as HTMLCanvasElement).toDataURL("image/png")
    }

    if (className === HTMLImageElement.name) {
      urlImage = (element as HTMLImageElement).src
    }

    fetch(urlImage)
      .then((urlResponse: Response) => urlResponse.blob())
      .then((blob: Blob) => URL.createObjectURL(blob))
      .then((url: string) => this.sanitizer.bypassSecurityTrustUrl(url))
      .then((urlSanitized: SafeUrl) => {
        this.qrCodeURL.emit(urlSanitized)
      })
      .catch((error) => {
        console.error("[angularx-qrcode] Error when fetching image/png URL: "+error)
      })
  }
}
