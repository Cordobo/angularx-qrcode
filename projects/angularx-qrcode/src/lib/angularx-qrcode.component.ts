import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  ViewChild,
} from "@angular/core"
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import * as QRCode from "@cordobo/qrcode"
import {
  QRCodeErrorCorrectionLevel,
  QRCodeVersion,
  QRCodeElementType,
  QRCodeConfigType,
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
  @Input() public imageSrc?: string
  @Input() public imageHeight?: number
  @Input() public imageWidth?: number
  @Input() public margin = 4
  @Input() public qrdata = ""
  @Input() public scale = 4
  @Input() public version?: QRCodeVersion
  @Input() public width = 10

  // Accessibility features introduced in 13.0.4+
  @Input() public alt?: string
  @Input() public ariaLabel?: string
  @Input() public title?: string
  @ViewChild("qrcElement", { static: true }) public qrcElement!: ElementRef

  public context: CanvasRenderingContext2D | null = null
  private centerImage?: HTMLImageElement

  constructor(private renderer: Renderer2) {}

  public async ngOnChanges(): Promise<void> {
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

  private toDataURL(qrCodeConfig: QRCodeConfigType): Promise<any> {
    return new Promise(
      (resolve: (arg: any) => any, reject: (arg: any) => any) => {
        QRCode.toDataURL(
          this.qrdata,
          qrCodeConfig,
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

  private toCanvas(
    canvas: Element,
    qrCodeConfig: QRCodeConfigType
  ): Promise<any> {
    return new Promise(
      (resolve: (arg: any) => any, reject: (arg: any) => any) => {
        QRCode.toCanvas(canvas, this.qrdata, qrCodeConfig, (error: Error) => {
          if (error) {
            reject(error)
          } else {
            resolve("success")
          }
        })
      }
    )
  }

  private toSVG(qrCodeConfig: QRCodeConfigType): Promise<any> {
    return new Promise(
      (resolve: (arg: any) => any, reject: (arg: any) => any) => {
        QRCode.toString(
          this.qrdata,
          qrCodeConfig,
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

  private async createQRCode(): Promise<void> {
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

      // This is a workaround to allow an empty string as qrdata
      if (this.isValidQrCodeText(this.qrdata) && this.qrdata === "") {
        this.qrdata = " "
      }

      const config: QRCodeConfigType = {
        color: {
          dark: this.colorDark,
          light: this.colorLight,
        },
        errorCorrectionLevel: this.errorCorrectionLevel,
        margin: this.margin,
        scale: this.scale,
        type: this.elementType,
        version: this.version,
        width: this.width,
      }

      const centerImageSrc = this.imageSrc
      const centerImageWidth = this.imageHeight || 40
      const centerImageHeight = this.imageWidth || 40

      switch (this.elementType) {
        case "canvas":
          const canvasElement: HTMLCanvasElement =
            this.renderer.createElement("canvas")
          this.context = canvasElement.getContext("2d")
          this.toCanvas(canvasElement, config)
            .then(() => {
              if (this.ariaLabel) {
                this.renderer.setAttribute(
                  canvasElement,
                  "aria-label",
                  `${this.ariaLabel}`
                )
              }
              if (this.title) {
                this.renderer.setAttribute(
                  canvasElement,
                  "title",
                  `${this.title}`
                )
              }

              if (centerImageSrc && this.context) {
                // if (!this.imageSrc) {
                this.centerImage = new Image(
                  centerImageWidth,
                  centerImageHeight
                )
                // }

                if (centerImageSrc !== this.centerImage.src) {
                  this.centerImage.src = centerImageSrc
                }

                if (centerImageHeight !== this.centerImage.height) {
                  this.centerImage.height = centerImageHeight
                }

                if (centerImageWidth !== this.centerImage.width) {
                  this.centerImage.width = centerImageWidth
                }

                const centerImage = this.centerImage

                if (centerImage) {
                  centerImage.onload = () => {
                    this.context?.drawImage(
                      centerImage,
                      canvasElement.width / 2 - centerImageWidth / 2,
                      canvasElement.height / 2 - centerImageHeight / 2,
                      centerImageWidth,
                      centerImageHeight
                    )
                  }
                }
              }

              this.renderElement(canvasElement)
            })
            .catch((e) => {
              console.error("[angularx-qrcode] canvas error:", e)
            })
          break
        case "svg":
          const svgElement: HTMLElement = this.renderer.createElement("div")
          this.toSVG(config)
            .then((svgString: string) => {
              this.renderer.setProperty(svgElement, "innerHTML", svgString)
              const innerElement = svgElement.firstChild as Element
              this.renderer.setAttribute(
                innerElement,
                "height",
                `${this.width}`
              )
              this.renderer.setAttribute(innerElement, "width", `${this.width}`)
              this.renderElement(innerElement)
            })
            .catch((e) => {
              console.error("[angularx-qrcode] svg error:", e)
            })
          break
        case "url":
        case "img":
        default:
          const imgElement = this.renderer.createElement("img")
          this.toDataURL(config)
            .then((dataUrl: string) => {
              if (this.alt) {
                imgElement.setAttribute("alt", this.alt)
              }
              if (this.ariaLabel) {
                imgElement.setAttribute("aria-label", this.ariaLabel)
              }
              imgElement.setAttribute("src", dataUrl)
              if (this.title) {
                imgElement.setAttribute("title", this.title)
              }
              this.renderElement(imgElement)
            })
            .catch((e) => {
              console.error("[angularx-qrcode] img/url error:", e)
            })
      }
    } catch (e: any) {
      console.error("[angularx-qrcode] Error generating QR Code:", e.message)
    }
  }
}
