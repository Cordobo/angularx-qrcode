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
import {
  QRCodeRenderersOptions,
  QRCodeToDataURLOptions,
  QRCodeToStringOptions,
  toCanvas,
  toDataURL,
  toString,
} from "qrcode"
import {
  QRCodeVersion,
  QRCodeElementType,
  FixMeLater,
  QRCodeConfigType,
  QRCodeErrorCorrectionLevel,
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

  @Output() qrCodeURL = new EventEmitter<SafeUrl>()

  @ViewChild("qrcElement", { static: true }) public qrcElement!: ElementRef

  public context: CanvasRenderingContext2D | null = null
  private centerImage?: HTMLImageElement

  constructor(
    private renderer: Renderer2,
    private sanitizer: DomSanitizer
  ) {}

  public async ngOnChanges(): Promise<void> {
    await this.createQRCode()
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

  private toDataURL(qrCodeConfig: QRCodeToDataURLOptions): Promise<FixMeLater> {
    return new Promise(
      (
        resolve: (arg: FixMeLater) => FixMeLater,
        reject: (arg: FixMeLater) => FixMeLater
      ) => {
        toDataURL(
          this.qrdata,
          qrCodeConfig,
          (err: Error | null | undefined, url: string) => {
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
    canvas: HTMLCanvasElement,
    qrCodeConfig: QRCodeRenderersOptions
  ): Promise<FixMeLater> {
    return new Promise(
      (
        resolve: (arg: FixMeLater) => FixMeLater,
        reject: (arg: FixMeLater) => FixMeLater
      ) => {
        toCanvas(
          canvas,
          this.qrdata,
          qrCodeConfig,
          (error: Error | null | undefined) => {
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

  private toSVG(qrCodeConfig: QRCodeToStringOptions): Promise<FixMeLater> {
    return new Promise(
      (
        resolve: (arg: FixMeLater) => FixMeLater,
        reject: (arg: FixMeLater) => FixMeLater
      ) => {
        toString(
          this.qrdata,
          qrCodeConfig,
          (err: Error | null | undefined, url: string) => {
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
        version: this.version,
        width: this.width,
      }

      const centerImageSrc = this.imageSrc
      const centerImageHeight = this.imageHeight || 40
      const centerImageWidth = this.imageWidth || 40

      switch (this.elementType) {
        case "canvas": {
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
                this.centerImage = new Image(
                  centerImageWidth,
                  centerImageHeight
                )

                if (centerImageSrc !== this.centerImage.src) {
                  this.centerImage.crossOrigin = "anonymous"
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
              this.emitQRCodeURL(canvasElement as HTMLCanvasElement)
            })
            .catch((e) => {
              console.error("[angularx-qrcode] canvas error:", e)
            })
          break
        }
        case "svg": {
          const svgParentElement: HTMLElement =
            this.renderer.createElement("div")
          this.toSVG(config)
            .then((svgString: string) => {
              this.renderer.setProperty(
                svgParentElement,
                "innerHTML",
                svgString
              )
              const svgElement = svgParentElement.firstChild as SVGSVGElement
              this.renderer.setAttribute(svgElement, "height", `${this.width}`)
              this.renderer.setAttribute(svgElement, "width", `${this.width}`)
              this.renderElement(svgElement)
              this.emitQRCodeURL(svgElement)
            })
            .catch((e) => {
              console.error("[angularx-qrcode] svg error:", e)
            })
          break
        }
        case "url":
        case "img":
        default: {
          const imgElement: HTMLImageElement =
            this.renderer.createElement("img")
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
              this.emitQRCodeURL(imgElement)
            })
            .catch((e) => {
              console.error("[angularx-qrcode] img/url error:", e)
            })
        }
      }
    } catch (e: FixMeLater) {
      console.error("[angularx-qrcode] Error generating QR Code:", e.message)
    }
  }

  convertBase64ImageUrlToBlob(base64ImageUrl: string) {
    // split into two parts
    const parts = base64ImageUrl.split(";base64,")
    // hold the content/mime type f.e. image/png
    const imageType = parts[0].split(":")[1]
    // decode base64 string
    const decodedData = atob(parts[1])
    // create unit8array of size same as row data length
    const uInt8Array = new Uint8Array(decodedData.length)
    // insert all character code into uint8array
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i)
    }
    // return blob image after conversion
    return new Blob([uInt8Array], { type: imageType })
  }

  emitQRCodeURL(element: HTMLCanvasElement | HTMLImageElement | SVGSVGElement) {
    const className = element.constructor.name
    if (className === SVGSVGElement.name) {
      const svgHTML = element.outerHTML
      const blob = new Blob([svgHTML], { type: "image/svg+xml" })
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

    const blobData: Blob = this.convertBase64ImageUrlToBlob(urlImage)
    const urlBlob = URL.createObjectURL(blobData)
    const urlSanitized = this.sanitizer.bypassSecurityTrustUrl(urlBlob)
    this.qrCodeURL.emit(urlSanitized)
  }
}
