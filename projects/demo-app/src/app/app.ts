import { CommonModule } from '@angular/common'
import { Component, inject, OnInit, effect } from '@angular/core'
import { FormsModule, FormControl } from '@angular/forms'
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar'
import { SafeUrl } from '@angular/platform-browser'
import { ColorPickerDirective } from 'ngx-color-picker'
import { MatButtonModule } from '@angular/material/button'
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { MatCardModule } from '@angular/material/card'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatDividerModule } from '@angular/material/divider'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatRadioModule } from '@angular/material/radio'
import { MatSliderModule } from '@angular/material/slider'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatTabsModule } from '@angular/material/tabs'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatTooltipModule } from '@angular/material/tooltip'
import { Router, ActivatedRoute } from '@angular/router'

import {
  QRCodeErrorCorrectionLevel,
  QRCodeElementType,
  QRCodeComponent,
} from '../../../angularx-qrcode/src/public-api'

type ListType = { title: string; val: number }[]

@Component({
  selector: 'app-root',
  imports: [
    ColorPickerDirective,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSnackBarModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    QRCodeComponent,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App implements OnInit {
  private _snackBar = inject(MatSnackBar)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private isLoadingFromUrl = false

  public initial_state = {
    allowEmptyString: true,
    alt: 'A custom alt attribute',
    ariaLabel: `QR Code image with the following content...`,
    colorDark: '#000000ff',
    colorLight: '#ffffffff',
    cssClass: 'center',
    elementType: 'canvas' as QRCodeElementType,
    errorCorrectionLevel: 'M' as QRCodeErrorCorrectionLevel,
    imageSrc: './angular-logo.png',
    imageHeight: 75,
    imageWidth: 75,
    margin: 4,
    qrdata: 'https://github.com/Cordobo/angularx-qrcode',
    scale: 1,
    version: undefined,
    title: 'A custom title attribute',
    width: 300,
  }

  public data_model = { ...this.initial_state }

  public allowEmptyString: boolean
  public alt: string
  public ariaLabel: string
  public colorDark: string
  public colorLight: string
  public cssClass: string
  public elementType: QRCodeElementType
  public errorCorrectionLevel: QRCodeErrorCorrectionLevel
  public imageSrc?: string
  public imageHeight?: number
  public imageWidth?: number
  public margin: number
  public qrdata: string
  public scale: number
  public title: string
  public width: number

  public qrCodeSrc!: SafeUrl

  public selected = new FormControl(0)

  public marginList: ListType
  public scaleList: ListType
  public widthList: ListType

  public showA11y: boolean
  public showColors: boolean
  public showCss: boolean
  public showImage: boolean

  constructor() {
    this.showA11y = true
    this.showColors = true
    this.showCss = true
    this.showImage = true

    this.allowEmptyString = this.data_model.allowEmptyString
    this.alt = this.data_model.alt
    this.ariaLabel = this.data_model.ariaLabel
    this.colorDark = this.data_model.colorDark
    this.colorLight = this.data_model.colorLight
    this.cssClass = this.data_model.cssClass
    this.elementType = this.data_model.elementType
    this.errorCorrectionLevel = this.data_model.errorCorrectionLevel
    this.imageSrc = this.showImage ? this.data_model.imageSrc : undefined
    this.imageHeight = this.showImage ? this.data_model.imageHeight : undefined
    this.imageWidth = this.showImage ? this.data_model.imageWidth : undefined
    this.margin = this.data_model.margin
    this.qrdata = this.data_model.qrdata
    this.scale = this.data_model.scale
    this.title = this.data_model.title
    this.width = this.data_model.width

    this.marginList = [
      { title: '4 (Default)', val: 4 },
      { title: '0', val: 0 },
      { title: '10', val: 10 },
      { title: '25', val: 25 },
    ]

    this.scaleList = [
      { title: '128', val: 128 },
      { title: '64', val: 64 },
      { title: '32', val: 32 },
      { title: '8', val: 8 },
      { title: '4', val: 4 },
      { title: '1 (Default)', val: 1 },
    ]

    this.widthList = [
      { title: '400', val: 400 },
      { title: '300', val: 300 },
      { title: '200', val: 200 },
      { title: '100', val: 100 },
      { title: '50', val: 50 },
      { title: '10 (Default)', val: 10 },
    ]
  }

  ngOnInit(): void {
    this.loadFromUrlParams()
  }

  private loadFromUrlParams(): void {
    this.route.queryParams.subscribe((params) => {
      this.isLoadingFromUrl = true

      if (params['qrdata']) this.qrdata = params['qrdata']
      if (params['allowEmptyString']) this.allowEmptyString = params['allowEmptyString'] === 'true'
      if (params['alt']) this.alt = params['alt']
      if (params['ariaLabel']) this.ariaLabel = params['ariaLabel']
      if (params['colorDark']) this.colorDark = params['colorDark']
      if (params['colorLight']) this.colorLight = params['colorLight']
      if (params['cssClass']) this.cssClass = params['cssClass']
      if (params['elementType']) this.elementType = params['elementType'] as QRCodeElementType
      if (params['errorCorrectionLevel'])
        this.errorCorrectionLevel = params['errorCorrectionLevel'] as QRCodeErrorCorrectionLevel
      if (params['imageSrc']) this.imageSrc = params['imageSrc']
      if (params['imageHeight']) this.imageHeight = Number(params['imageHeight'])
      if (params['imageWidth']) this.imageWidth = Number(params['imageWidth'])
      if (params['margin']) this.margin = Number(params['margin'])
      if (params['scale']) this.scale = Number(params['scale'])
      if (params['title']) this.title = params['title']
      if (params['width']) this.width = Number(params['width'])

      // Handle visibility toggles
      if (params['showA11y'] !== undefined) this.showA11y = params['showA11y'] === 'true'
      if (params['showColors'] !== undefined) this.showColors = params['showColors'] === 'true'
      if (params['showCss'] !== undefined) this.showCss = params['showCss'] === 'true'
      if (params['showImage'] !== undefined) {
        this.showImage = params['showImage'] === 'true'
        this.setImageVisibility(this.showImage)
      }

      this.isLoadingFromUrl = false
    })
  }

  updateUrlParams(): void {
    if (this.isLoadingFromUrl) return

    const queryParams: { [key: string]: string | number | boolean } = {
      qrdata: this.qrdata,
      allowEmptyString: this.allowEmptyString,
      elementType: this.elementType,
      errorCorrectionLevel: this.errorCorrectionLevel,
      margin: this.margin,
      scale: this.scale,
      width: this.width,
    }

    if (this.showA11y) {
      queryParams['alt'] = this.alt
      queryParams['ariaLabel'] = this.ariaLabel
      queryParams['title'] = this.title
      queryParams['showA11y'] = this.showA11y
    }

    if (this.showColors) {
      queryParams['colorDark'] = this.colorDark
      queryParams['colorLight'] = this.colorLight
      queryParams['showColors'] = this.showColors
    }

    if (this.showCss) {
      queryParams['cssClass'] = this.cssClass
      queryParams['showCss'] = this.showCss
    }

    if (this.showImage) {
      if (this.imageSrc) queryParams['imageSrc'] = this.imageSrc
      if (this.imageHeight) queryParams['imageHeight'] = this.imageHeight
      if (this.imageWidth) queryParams['imageWidth'] = this.imageWidth
      queryParams['showImage'] = this.showImage
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    })
  }

  // Change value programatically
  changeMargin(newValue: number): void {
    this.margin = newValue
    this.updateUrlParams()
  }

  reset(): void {
    this.allowEmptyString = this.data_model.allowEmptyString
    this.alt = this.data_model.alt
    this.ariaLabel = this.data_model.ariaLabel
    this.colorDark = this.data_model.colorDark
    this.colorLight = this.data_model.colorLight
    this.cssClass = this.data_model.cssClass
    this.elementType = this.data_model.elementType
    this.errorCorrectionLevel = this.data_model.errorCorrectionLevel
    this.imageSrc = this.data_model.imageSrc
    this.imageHeight = this.data_model.imageHeight
    this.imageWidth = this.data_model.imageWidth
    this.margin = this.data_model.margin
    this.qrdata = this.data_model.qrdata
    this.scale = this.data_model.scale
    this.title = this.data_model.title
    this.width = this.data_model.width

    this.setA11yVisibility(true)
    this.setColorsVisibility(true)
    this.setCssVisibility(true)
    this.setImageVisibility(true)

    this._snackBar.open('All values resetted', 'close')
    this.updateUrlParams()
  }

  shareUrl(): void {
    const currentUrl = window.location.href
    navigator.clipboard.writeText(currentUrl).then(
      () => {
        this._snackBar.open('URL copied to clipboard!', 'close', { duration: 3000 })
      },
      () => {
        this._snackBar.open('Failed to copy URL', 'close', { duration: 3000 })
      }
    )
  }

  setTabIndex(idx: number): boolean {
    this.selected.setValue(idx)
    return false
  }

  setA11yVisibility(enable?: boolean): void {
    this.showA11y = enable ? enable : !this.showA11y
    this.updateUrlParams()
  }

  setColorsVisibility(enable?: boolean): void {
    this.showColors = enable ? enable : !this.showColors
    this.updateUrlParams()
  }

  setCssVisibility(enable?: boolean): void {
    this.showCss = enable ? enable : !this.showCss
    this.updateUrlParams()
  }

  setImageVisibility(enable?: boolean): void {
    this.showImage = enable !== undefined ? enable : !this.showImage
    this.imageSrc = this.showImage ? this.data_model.imageSrc : undefined

    if (this.showImage) {
      this.elementType = this.data_model.elementType
      this.imageHeight = this.data_model.imageHeight
      this.imageWidth = this.data_model.imageWidth
    }
    this.updateUrlParams()
  }

  // Re-enable, when a method to download images has been implemented
  onChangeURL(url: SafeUrl) {
    this.qrCodeSrc = url
  }

  saveAsImage(parent: QRCodeComponent) {
    let parentElement = null

    if (this.elementType === 'canvas') {
      // fetches base 64 data from canvas
      parentElement = parent.qrcElement().nativeElement.querySelector('canvas').toDataURL('image/png')
    } else if (this.elementType === 'img' || this.elementType === 'url') {
      // fetches base 64 data from image
      // parentElement contains the base64 encoded image src
      // you might use to store somewhere
      parentElement = parent.qrcElement().nativeElement.querySelector('img').src
    } else {
      alert("Set elementType to 'canvas', 'img' or 'url'.")
    }

    if (parentElement) {
      // converts base 64 encoded image to blobData
      let blobData = this.convertBase64ToBlob(parentElement)
      // saves as image
      const blob = new Blob([blobData], { type: 'image/png' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      // name of the file
      link.download = 'angularx-qrcode'
      link.click()
    }
  }

  private convertBase64ToBlob(Base64Image: string) {
    // split into two parts
    const parts = Base64Image.split(';base64,')
    // hold the content type
    const imageType = parts[0].split(':')[1]
    // decode base64 string
    const decodedData = window.atob(parts[1])
    // create unit8array of size same as row data length
    const uInt8Array = new Uint8Array(decodedData.length)
    // insert all character code into uint8array
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i)
    }
    // return blob image after conversion
    return new Blob([uInt8Array], { type: imageType })
  }

  strBuilder(): string {
    const f: string[] = []

    if (this.qrdata) {
      f.push(`[qrdata]="'${this.qrdata}'"`)
    }
    if (this.allowEmptyString) {
      f.push(`[allowEmptyString]="${this.allowEmptyString}"`)
    }
    if (this.showA11y && this.alt && (this.elementType === 'img' || this.elementType === 'url')) {
      f.push(`[alt]="'${this.alt}'"`)
    }
    if (
      this.showA11y &&
      this.ariaLabel &&
      (this.elementType === 'canvas' || this.elementType === 'img' || this.elementType === 'url')
    ) {
      f.push(`[ariaLabel]="'${this.ariaLabel}'"`)
    }

    if (this.showCss && this.cssClass) {
      f.push(`[cssClass]="'${this.cssClass}'"`)
    }
    if (this.showColors && this.colorDark) {
      f.push(`[colorDark]="'${this.colorDark}'"`)
    }
    if (this.showColors && this.colorLight) {
      f.push(`[colorLight]="'${this.colorLight}'"`)
    }
    f.push(`[elementType]="'${this.elementType}'"`)
    f.push(`[errorCorrectionLevel]="'${this.errorCorrectionLevel}'"`)
    if (this.showImage && this.imageSrc) {
      f.push(`[imageSrc]="'${this.imageSrc}'"`)
    }
    if (this.showImage && this.imageHeight) {
      f.push(`[imageHeight]="${this.imageHeight}"`)
    }
    if (this.showImage && this.imageWidth) {
      f.push(`[imageWidth]="${this.imageWidth}"`)
    }
    if (this.margin) {
      f.push(`[margin]="${this.margin}"`)
    }
    if (this.scale) {
      f.push(`[scale]="${this.scale}"`)
    }
    if (this.showA11y && this.title) {
      f.push(`[title]="'${this.title}'"`)
    }
    f.push(`[width]="${this.width}"`)

    return f.join('\n    ')
  }

  get renderSampleHtmlCode() {
    return `/* Put this code in your html file, e.g. app.component.html */ \n \n<div class="qrcodeImage">
  <qrcode
    ${this.strBuilder()}
  ></qrcode>
</div>`
  }

  cssCodeBuilder(): string {
    switch (this.cssClass) {
      case 'center':
        return `.center {
  display: flex;
  flex: 1;
  justify-content: center;
}`
      case 'right':
        return `.right {
  display: flex;
  flex: 1;
  justify-content: right;
}`
      case 'demoBorder':
        return `.demoBorder {
  border: 10px solid red;
}`
      case 'demoBorderRadius':
        return `.demoBorderRadius {
  border: dashed;
  border-width: 2px 4px;
  border-radius: 40px;
  overflow: hidden;
}`
      case 'left':
      default:
        return `.left {
  display: flex;
  flex: 1;
  justify-content: left;
}`
    }
  }

  get renderSampleCssCode() {
    return `/* Put this code in your CSS file, e.g. app.component.css */

/* The div container */
.qrcodeImage {
  display: flex;
  flex: 1;
}

/* Add custom styles here */
${this.cssCodeBuilder()}
`
  }
}
