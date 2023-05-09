import { Component } from "@angular/core"
import { MatSnackBar } from "@angular/material/snack-bar"
import { SafeUrl } from "@angular/platform-browser"
import { QRCodeErrorCorrectionLevel } from "qrcode"
import { QRCodeElementType } from "dist/angularx-qrcode"
import { FixMeLater } from "projects/angularx-qrcode/src/public-api"

type ListType = { title: string; val: number }[]

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  public initial_state = {
    allowEmptyString: true,
    alt: "A custom alt attribute",
    ariaLabel: `QR Code image with the following content...`,
    colorDark: "#000000ff",
    colorLight: "#ffffffff",
    cssClass: "center",
    elementType: "canvas" as QRCodeElementType,
    errorCorrectionLevel: "M" as QRCodeErrorCorrectionLevel,
    imageSrc: "./assets/angular-logo.png",
    imageHeight: 75,
    imageWidth: 75,
    margin: 4,
    qrdata: "https://github.com/Cordobo/angularx-qrcode",
    scale: 1,
    version: undefined,
    title: "A custom title attribute",
    width: 300,
  }

  public data_model = {
    ...this.initial_state,
  }

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

  public selectedIndex: number

  public marginList: ListType
  public scaleList: ListType
  public widthList: ListType

  public showA11y: boolean
  public showColors: boolean
  public showCss: boolean
  public showImage: boolean

  constructor(private _snackBar: MatSnackBar) {
    this.selectedIndex = 0

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
      { title: "4 (Default)", val: 4 },
      { title: "0", val: 0 },
      { title: "10", val: 10 },
      { title: "25", val: 25 },
    ]

    this.scaleList = [
      { title: "128", val: 128 },
      { title: "64", val: 64 },
      { title: "32", val: 32 },
      { title: "8", val: 8 },
      { title: "4", val: 4 },
      { title: "1 (Default)", val: 1 },
    ]

    this.widthList = [
      { title: "400", val: 400 },
      { title: "300", val: 300 },
      { title: "200", val: 200 },
      { title: "100", val: 100 },
      { title: "50", val: 50 },
      { title: "10 (Default)", val: 10 },
    ]
  }

  // Change value programatically
  changeMargin(newValue: number): void {
    this.margin = newValue
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

    this._snackBar.open("All values resetted", "close")
  }

  setTabIndex(idx: number): boolean {
    this.selectedIndex = idx
    return false
  }

  setA11yVisibility(enable?: boolean): void {
    this.showA11y = enable ? enable : !this.showA11y
  }

  setColorsVisibility(enable?: boolean): void {
    this.showColors = enable ? enable : !this.showColors
  }

  setCssVisibility(enable?: boolean): void {
    this.showCss = enable ? enable : !this.showCss
  }

  setImageVisibility(enable?: boolean): void {
    this.showImage = enable !== undefined ? enable : !this.showImage
    this.imageSrc = this.showImage ? this.data_model.imageSrc : undefined

    if (this.showImage) {
      this.elementType = this.data_model.elementType
      this.imageHeight = this.data_model.imageHeight
      this.imageWidth = this.data_model.imageWidth
    }
  }

  // Re-enable, when a method to download images has been implemented
  onChangeURL(url: SafeUrl) {
    this.qrCodeSrc = url
  }

  saveAsImage(parent: FixMeLater) {
    let parentElement = null

    if (this.elementType === "canvas") {
      // fetches base 64 data from canvas
      parentElement = parent.qrcElement.nativeElement
        .querySelector("canvas")
        .toDataURL("image/png")
    } else if (this.elementType === "img" || this.elementType === "url") {
      // fetches base 64 data from image
      // parentElement contains the base64 encoded image src
      // you might use to store somewhere
      parentElement = parent.qrcElement.nativeElement.querySelector("img").src
    } else {
      alert("Set elementType to 'canvas', 'img' or 'url'.")
    }

    if (parentElement) {
      // converts base 64 encoded image to blobData
      let blobData = this.convertBase64ToBlob(parentElement)
      // saves as image
      const blob = new Blob([blobData], { type: "image/png" })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      // name of the file
      link.download = "angularx-qrcode"
      link.click()
    }
  }

  private convertBase64ToBlob(Base64Image: string) {
    // split into two parts
    const parts = Base64Image.split(";base64,")
    // hold the content type
    const imageType = parts[0].split(":")[1]
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
    // featureList
    const f: string[] = []

    if (this.qrdata) {
      f.push(`[qrdata]="'${this.qrdata}'"`)
    }
    if (this.allowEmptyString) {
      f.push(`[allowEmptyString]="${this.allowEmptyString}"`)
    }
    if (
      this.showA11y &&
      this.alt &&
      (this.elementType === "img" || this.elementType === "url")
    ) {
      f.push(`[alt]="'${this.alt}'"`)
    }
    if (
      this.showA11y &&
      this.ariaLabel &&
      (this.elementType === "canvas" ||
        this.elementType === "img" ||
        this.elementType === "url")
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

    return f.join("\n    ")
  }

  get renderSampleHtmlCode() {
    return `<div class="qrcodeImage">
  <qrcode
    ${this.strBuilder()}
  ></qrcode>
</div>`
  }

  cssCodeBuilder(): string {
    switch (this.cssClass) {
      case "center":
        return `.center {
  display: flex;
  flex: 1;
  justify-content: center;
}`
      case "right":
        return `.right {
  display: flex;
  flex: 1;
  justify-content: right;
}`
      case "demoBorder":
        return `.demoBorder {
  border: 10px solid red;
}`
      case "demoBorderRadius":
        return `.demoBorderRadius {
  border: dashed;
  border-width: 2px 4px;
  border-radius: 40px;
  overflow: hidden;
}`
      case "left":
      default:
        return `.left {
  display: flex;
  flex: 1;
  justify-content: left;
}`
    }
  }

  get renderSampleCssCode() {
    return `/* Put this code in your CSS file */

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
