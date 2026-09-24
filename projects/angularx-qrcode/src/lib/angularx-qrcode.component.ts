import { isPlatformBrowser } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  PLATFORM_ID,
  Output,
  output,
  Renderer2,
  ViewChild,
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
  QRCodeGenerationError,
  QRCodeVersion,
  QRCodeElementType,
  QRCodeConfigType,
  QRCodeErrorCorrectionLevel,
} from './types'

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'qrcode',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div #qrcElement [class]="cssClass"></div>`,
})
export class QRCodeComponent implements OnChanges, OnDestroy {
  @Input() public allowEmptyString = false
  @Input() public colorDark = '#000000ff'
  @Input() public colorLight = '#ffffffff'
  @Input() public cssClass = 'qrcode'
  @Input() public elementType: QRCodeElementType = 'canvas'
  @Input()
  public errorCorrectionLevel: QRCodeErrorCorrectionLevel = 'M'
  @Input() public imageSrc?: string
  @Input() public imageHeight?: number | string
  @Input() public imageWidth?: number | string
  @Input() public margin = 4
  @Input() public qrdata = ''
  @Input() public scale = 4
  @Input() public version?: QRCodeVersion
  @Input() public width = 10

  // Accessibility features introduced in 13.0.4+
  @Input() public alt?: string
  @Input() public ariaLabel?: string
  @Input() public title?: string

  @Output() qrCodeURL = new EventEmitter<SafeUrl>()
  readonly qrCodeError = output<QRCodeGenerationError>()

  @ViewChild('qrcElement', { static: true }) public qrcElement!: ElementRef

  public context: CanvasRenderingContext2D | null = null
  private renderVersion = 0
  private currentObjectUrl?: string

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID))
  private renderer = inject(Renderer2)
  private sanitizer = inject(DomSanitizer)

  public async ngOnChanges(): Promise<void> {
    this.renderVersion += 1
    const currentVersion = this.renderVersion
    // Server rendering preserves the host placeholder; QR visuals and exports need browser APIs.
    if (!this.isBrowser) {
      return
    }
    await this.createQRCode(currentVersion)
  }

  public ngOnDestroy(): void {
    this.renderVersion += 1
    this.revokeCurrentObjectUrl()
  }

  protected isValidQrCodeText(data: string | null): boolean {
    return typeof data === 'string' && (this.allowEmptyString || (data !== '' && data !== 'null'))
  }

  private reportError(
    cause: unknown,
    renderVersion: number,
    elementType: QRCodeElementType,
    code: QRCodeGenerationError['code']
  ): void {
    if (renderVersion !== this.renderVersion) {
      return
    }
    const error = cause instanceof Error ? cause : new Error(String(cause))
    const label =
      code === 'invalid-input'
        ? 'Error generating QR Code'
        : `${elementType === 'img' || elementType === 'url' ? 'img/url' : elementType} error`
    console.error(`[angularx-qrcode] ${label}:`, error)
    this.qrCodeError.emit({ code, elementType, error })
  }

  private toDataURL(data: string, qrCodeConfig: QRCodeToDataURLOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      toDataURL(data, qrCodeConfig, (err: Error | null | undefined, url: string) => {
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
    data: string,
    qrCodeConfig: QRCodeRenderersOptions
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      toCanvas(canvas, data, qrCodeConfig, (error: Error | null | undefined) => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }

  private toSVG(data: string, qrCodeConfig: QRCodeToStringOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      toString(data, qrCodeConfig, (err: Error | null | undefined, url: string) => {
        if (err) {
          reject(err)
        } else {
          resolve(url)
        }
      })
    })
  }

  private renderElement(element: Element): void {
    for (const node of this.qrcElement.nativeElement.childNodes) {
      this.renderer.removeChild(this.qrcElement.nativeElement, node)
    }
    this.renderer.appendChild(this.qrcElement.nativeElement, element)
  }

  private drawCenterImage(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    source: string,
    width: number,
    height: number,
    renderVersion: number
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const image = new Image(width, height)
      const clearHandlers = (): void => {
        image.onload = null
        image.onerror = null
      }
      image.onload = () => {
        clearHandlers()
        if (renderVersion !== this.renderVersion) {
          resolve()
          return
        }
        try {
          context.drawImage(
            image,
            canvas.width / 2 - width / 2,
            canvas.height / 2 - height / 2,
            width,
            height
          )
          resolve()
        } catch (error: unknown) {
          reject(error)
        }
      }
      image.onerror = () => {
        clearHandlers()
        reject(new Error('[angularx-qrcode] Failed to load center image.'))
      }
      image.crossOrigin = 'anonymous'
      image.src = source
    })
  }

  private async createQRCode(renderVersion: number): Promise<void> {
    // Accept numeric strings for compatibility with runtime template bindings, but
    // reject values whose coercion would disguise an invalid version (null, booleans, etc.).
    const runtimeVersion: unknown = this.version
    const isNumericVersion =
      (typeof runtimeVersion === 'number' && !Number.isNaN(runtimeVersion)) ||
      (typeof runtimeVersion === 'string' &&
        runtimeVersion.trim() !== '' &&
        !Number.isNaN(Number(runtimeVersion)))
    let normalizedVersion = this.version
    if (runtimeVersion !== undefined && !isNumericVersion) {
      console.warn('[angularx-qrcode] version should be a number, defaulting to auto.')
      normalizedVersion = undefined
    } else if (normalizedVersion !== undefined && normalizedVersion > 40) {
      console.warn('[angularx-qrcode] max value for `version` is 40')
      normalizedVersion = 40
    } else if (normalizedVersion !== undefined && normalizedVersion < 1) {
      console.warn('[angularx-qrcode]`min value for `version` is 1')
      normalizedVersion = 1
    }

    const elementType = this.elementType
    let errorCode: QRCodeGenerationError['code'] = 'invalid-input'
    try {
      if (!this.isValidQrCodeText(this.qrdata)) {
        throw new Error(
          '[angularx-qrcode] Field `qrdata` is empty, set \'allowEmptyString="true"\' to overwrite this behaviour.'
        )
      }

      errorCode = 'render-failure'

      // This is a workaround to allow an empty string as qrdata
      const normalizedQrData = this.qrdata === '' ? ' ' : this.qrdata

      const config: QRCodeConfigType = {
        color: {
          dark: this.colorDark,
          light: this.colorLight,
        },
        errorCorrectionLevel: this.errorCorrectionLevel,
        margin: this.margin,
        scale: this.scale,
        version: normalizedVersion,
        width: this.width,
      }

      const centerImageSrc = this.imageSrc
      const centerImageHeight = this.imageHeight ? +this.imageHeight : 40
      const centerImageWidth = this.imageWidth ? +this.imageWidth : 40

      switch (elementType) {
        case 'canvas': {
          const canvasElement: HTMLCanvasElement = this.renderer.createElement('canvas')
          const canvasContext = canvasElement.getContext('2d')
          this.context = canvasContext
          await this.toCanvas(canvasElement, normalizedQrData, config)
            .then(async () => {
              if (renderVersion !== this.renderVersion) {
                return
              }
              if (this.ariaLabel) {
                this.renderer.setAttribute(canvasElement, 'aria-label', `${this.ariaLabel}`)
              }
              if (this.title) {
                this.renderer.setAttribute(canvasElement, 'title', `${this.title}`)
              }

              if (centerImageSrc) {
                if (!canvasContext) {
                  throw new Error(
                    '[angularx-qrcode] Canvas context is unavailable for center image.'
                  )
                }
                await this.drawCenterImage(
                  canvasElement,
                  canvasContext,
                  centerImageSrc,
                  centerImageWidth,
                  centerImageHeight,
                  renderVersion
                )
              }

              if (renderVersion !== this.renderVersion) {
                return
              }

              this.renderElement(canvasElement)
              this.emitQRCodeURL(canvasElement as HTMLCanvasElement)
            })
            .catch((e: unknown) => {
              this.reportError(e, renderVersion, elementType, 'render-failure')
            })
          break
        }
        case 'svg': {
          const svgParentElement: HTMLElement = this.renderer.createElement('div')
          await this.toSVG(normalizedQrData, config)
            .then((svgString: string) => {
              if (renderVersion !== this.renderVersion) {
                return
              }
              this.renderer.setProperty(svgParentElement, 'innerHTML', svgString)
              const svgElement = svgParentElement.firstChild as SVGSVGElement
              this.renderer.setAttribute(svgElement, 'height', `${this.width}`)
              this.renderer.setAttribute(svgElement, 'width', `${this.width}`)
              this.renderElement(svgElement)
              this.emitQRCodeURL(svgElement)
            })
            .catch((e: unknown) => {
              this.reportError(e, renderVersion, elementType, 'render-failure')
            })
          break
        }
        case 'url':
        case 'img':
        default: {
          const imgElement: HTMLImageElement = this.renderer.createElement('img')
          await this.toDataURL(normalizedQrData, config)
            .then((dataUrl: string) => {
              if (renderVersion !== this.renderVersion) {
                return
              }
              if (this.alt) {
                imgElement.setAttribute('alt', this.alt)
              }
              if (this.ariaLabel) {
                imgElement.setAttribute('aria-label', this.ariaLabel)
              }
              imgElement.setAttribute('src', dataUrl)
              if (this.title) {
                imgElement.setAttribute('title', this.title)
              }
              this.renderElement(imgElement)
              this.emitQRCodeURL(imgElement)
            })
            .catch((e: unknown) => {
              this.reportError(e, renderVersion, elementType, 'render-failure')
            })
        }
      }
    } catch (e: unknown) {
      this.reportError(e, renderVersion, elementType, errorCode)
    }
  }

  convertBase64ImageUrlToBlob(base64ImageUrl: string): Blob {
    // split into two parts
    const parts = base64ImageUrl.split(';base64,')
    if (parts.length !== 2) {
      throw new Error('[angularx-qrcode] Invalid base64 image URL.')
    }
    // hold the content/mime type f.e. image/png
    const imageType = parts[0].split(':')[1]
    if (!imageType) {
      throw new Error('[angularx-qrcode] Missing image MIME type.')
    }
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

  private revokeCurrentObjectUrl(): void {
    if (!this.currentObjectUrl) {
      return
    }
    URL.revokeObjectURL(this.currentObjectUrl)
    this.currentObjectUrl = undefined
  }

  private emitObjectUrl(url: string): void {
    this.revokeCurrentObjectUrl()
    this.currentObjectUrl = url
    const urlSanitized = this.sanitizer.bypassSecurityTrustUrl(url)
    this.qrCodeURL.emit(urlSanitized)
  }

  emitQRCodeURL(element: HTMLCanvasElement | HTMLImageElement | SVGSVGElement): void {
    const className = element.constructor.name
    if (className === SVGSVGElement.name) {
      const svgHTML = element.outerHTML
      const blob = new Blob([svgHTML], { type: 'image/svg+xml' })
      const urlSvg = URL.createObjectURL(blob)
      this.emitObjectUrl(urlSvg)
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
    this.emitObjectUrl(urlBlob)
  }
}
