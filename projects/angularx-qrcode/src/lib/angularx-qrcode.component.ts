import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Renderer2,
  viewChild,
  input,
  output,
  effect,
  inject,
} from '@angular/core'
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'
import {
  QRCodeRenderersOptions,
  QRCodeToDataURLOptions,
  QRCodeToStringOptions,
  toCanvas,
  toDataURL,
  toString,
} from 'qrcode'
import {
  QRCodeVersion,
  QRCodeElementType,
  QRCodeConfigType,
  QRCodeErrorCorrectionLevel,
} from './types'

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'qrcode',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div #qrcElement [class]="cssClass()"></div>`,
})
export class QRCodeComponent {
  public allowEmptyString = input(false)
  public colorDark = input('#000000ff')
  public colorLight = input('#ffffffff')
  public cssClass = input('qrcode')
  public elementType = input<QRCodeElementType>('canvas')
  public errorCorrectionLevel = input<QRCodeErrorCorrectionLevel>('M')
  public imageSrc = input<string | undefined>(undefined)
  public imageHeight = input<number | undefined>(undefined)
  public imageWidth = input<number | undefined>(undefined)
  public margin = input(4)
  public qrdata = input('')
  public scale = input(4)
  public version = input<QRCodeVersion | undefined>(undefined)
  public width = input(10)

  // Accessibility features introduced in 13.0.4+
  public alt = input<string | undefined>(undefined)
  public ariaLabel = input<string | undefined>(undefined)
  public title = input<string | undefined>(undefined)

  public qrCodeURL = output<SafeUrl>()

  public qrcElement = viewChild.required<ElementRef>('qrcElement')

  public context: CanvasRenderingContext2D | null = null
  private centerImage?: HTMLImageElement

  private renderer = inject(Renderer2)
  private sanitizer = inject(DomSanitizer)

  constructor() {
    effect(() => {
      // This effect depends on all inputs used in createQRCode
      // It will automatically re-run when any of them change
      this.createQRCode()
    })
  }

  protected isValidQrCodeText(data: string | null): boolean {
    if (this.allowEmptyString() === false) {
      return !(typeof data === 'undefined' || data === '' || data === 'null' || data === null)
    }
    return !(typeof data === 'undefined')
  }

  private toDataURL(qrData: string, qrCodeConfig: QRCodeToDataURLOptions): Promise<string> {
    return new Promise((resolve: (arg: string) => void, reject: (arg: unknown) => void) => {
      toDataURL(qrData, qrCodeConfig, (err: Error | null | undefined, url: string) => {
        if (err) {
          reject(err)
        } else {
          resolve(url)
        }
      })
    })
  }

  private toCanvas(
    canvas: HTMLCanvasElement,
    qrData: string,
    qrCodeConfig: QRCodeRenderersOptions
  ): Promise<string> {
    return new Promise((resolve: (arg: string) => void, reject: (arg: unknown) => void) => {
      toCanvas(canvas, qrData, qrCodeConfig, (error: Error | null | undefined) => {
        if (error) {
          reject(error)
        } else {
          resolve('success')
        }
      })
    })
  }

  private toSVG(qrData: string, qrCodeConfig: QRCodeToStringOptions): Promise<string> {
    return new Promise((resolve: (arg: string) => void, reject: (arg: unknown) => void) => {
      toString(qrData, qrCodeConfig, (err: Error | null | undefined, url: string) => {
        if (err) {
          reject(err)
        } else {
          resolve(url)
        }
      })
    })
  }

  private renderElement(element: Element): void {
    for (const node of this.qrcElement().nativeElement.childNodes) {
      this.renderer.removeChild(this.qrcElement().nativeElement, node)
    }
    this.renderer.appendChild(this.qrcElement().nativeElement, element)
  }

  private async createQRCode(): Promise<void> {
    let version = this.version()
    // Set sensitive defaults
    if (version && version > 40) {
      console.warn('[angularx-qrcode] max value for `version` is 40')
      version = 40
    } else if (version && version < 1) {
      console.warn('[angularx-qrcode]`min value for `version` is 1')
      version = 1
    } else if (version !== undefined && isNaN(version)) {
      console.warn('[angularx-qrcode] version should be a number, defaulting to auto.')
      version = undefined
    }

    try {
      if (!this.isValidQrCodeText(this.qrdata())) {
        throw new Error(
          '[angularx-qrcode] Field `qrdata` is empty, set \'allowEmptyString="true"\' to overwrite this behaviour.'
        )
      }

      // This is a workaround to allow an empty string as qrdata
      // Note: We can't modify the signal, so we use a local variable if needed,
      // but toDataURL uses this.qrdata().
      // If qrdata is empty string and valid (allowEmptyString=true), toDataURL might fail if it expects non-empty?
      // The original code did: if (valid && qrdata === "") qrdata = " "
      // We can't mutate the signal. We should handle this by passing the modified data to the generation functions.
      // However, the generation functions read `this.qrdata()`.
      // I will modify `toDataURL`, `toCanvas`, `toSVG` to take the data as argument instead of reading `this.qrdata()`.

      let qrData = this.qrdata()
      if (this.isValidQrCodeText(qrData) && qrData === '') {
        qrData = ' '
      }

      const config: QRCodeConfigType = {
        color: {
          dark: this.colorDark(),
          light: this.colorLight(),
        },
        errorCorrectionLevel: this.errorCorrectionLevel(),
        margin: this.margin(),
        scale: this.scale(),
        version: version,
        width: this.width(),
      }

      const centerImageSrc = this.imageSrc()
      const centerImageHeight = this.imageHeight() || 40
      const centerImageWidth = this.imageWidth() || 40

      switch (this.elementType()) {
        case 'canvas': {
          const canvasElement: HTMLCanvasElement = this.renderer.createElement('canvas')
          this.context = canvasElement.getContext('2d')
          this.toCanvas(canvasElement, qrData, config)
            .then(() => {
              if (this.ariaLabel()) {
                this.renderer.setAttribute(canvasElement, 'aria-label', `${this.ariaLabel()}`)
              }
              if (this.title()) {
                this.renderer.setAttribute(canvasElement, 'title', `${this.title()}`)
              }

              if (centerImageSrc && this.context) {
                this.centerImage = new Image(centerImageWidth, centerImageHeight)

                if (centerImageSrc !== this.centerImage.src) {
                  this.centerImage.crossOrigin = 'anonymous'
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
              console.error('[angularx-qrcode] canvas error:', e)
            })
          break
        }
        case 'svg': {
          const svgParentElement: HTMLElement = this.renderer.createElement('div')
          this.toSVG(qrData, config)
            .then((svgString: string) => {
              this.renderer.setProperty(svgParentElement, 'innerHTML', svgString)
              const svgElement = svgParentElement.firstChild as SVGSVGElement
              this.renderer.setAttribute(svgElement, 'height', `${this.width()}`)
              this.renderer.setAttribute(svgElement, 'width', `${this.width()}`)
              this.renderElement(svgElement)
              this.emitQRCodeURL(svgElement)
            })
            .catch((e) => {
              console.error('[angularx-qrcode] svg error:', e)
            })
          break
        }
        case 'url':
        case 'img':
        default: {
          const imgElement: HTMLImageElement = this.renderer.createElement('img')
          this.toDataURL(qrData, config)
            .then((dataUrl: string) => {
              if (this.alt()) {
                imgElement.setAttribute('alt', this.alt()!)
              }
              if (this.ariaLabel()) {
                imgElement.setAttribute('aria-label', this.ariaLabel()!)
              }
              imgElement.setAttribute('src', dataUrl)
              if (this.title()) {
                imgElement.setAttribute('title', this.title()!)
              }
              this.renderElement(imgElement)
              this.emitQRCodeURL(imgElement)
            })
            .catch((e) => {
              console.error('[angularx-qrcode] img/url error:', e)
            })
        }
      }
    } catch (e: unknown) {
      console.error(
        '[angularx-qrcode] Error generating QR Code:',
        e instanceof Error ? e.message : e
      )
    }
  }

  // Helper methods to pass data explicitly
  // I will modify the helper methods to accept data as an argument
  // But wait, I can't modify the private methods in the same pass if I use write_to_file with the content above...
  // Actually, I am rewriting the whole file, so I can change the private methods too.

  convertBase64ImageUrlToBlob(base64ImageUrl: string) {
    // split into two parts
    const parts = base64ImageUrl.split(';base64,')
    // hold the content/mime type f.e. image/png
    const imageType = parts[0].split(':')[1]
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
      const blob = new Blob([svgHTML], { type: 'image/svg+xml' })
      const urlSvg = URL.createObjectURL(blob)
      const urlSanitized = this.sanitizer.bypassSecurityTrustUrl(urlSvg)
      this.qrCodeURL.emit(urlSanitized)
      return
    }

    let urlImage = ''

    if (className === HTMLCanvasElement.name) {
      urlImage = (element as HTMLCanvasElement).toDataURL('image/png')
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
