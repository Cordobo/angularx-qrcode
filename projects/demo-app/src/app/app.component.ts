import { Component } from "@angular/core"
import {
  QRCodeElementType,
  QRCodeErrorCorrectionLevel,
} from "dist/angularx-qrcode"

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
  public qrdata: string
  public elementType: QRCodeElementType
  public errorCorrectionLevel: QRCodeErrorCorrectionLevel
  public margin: number
  public scale: number
  public title: string
  public width: number

  public selectedIndex: number

  public marginList: ListType
  public scaleList: ListType
  public widthList: ListType

  constructor() {
    this.allowEmptyString = this.data_model.allowEmptyString
    this.alt = this.data_model.alt
    this.ariaLabel = this.data_model.ariaLabel
    this.colorDark = this.data_model.colorDark
    this.colorLight = this.data_model.colorLight
    this.cssClass = this.data_model.cssClass
    this.elementType = this.data_model.elementType
    this.errorCorrectionLevel = this.data_model.errorCorrectionLevel
    this.margin = this.data_model.margin
    this.qrdata = this.data_model.qrdata
    this.scale = this.data_model.scale
    this.title = this.data_model.title
    this.width = this.data_model.width

    this.selectedIndex = 0

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
    this.margin = this.data_model.margin
    this.qrdata = this.data_model.qrdata
    this.scale = this.data_model.scale
    this.title = this.data_model.title
    this.width = this.data_model.width
  }

  setTabIndex(idx: number): boolean {
    this.selectedIndex = idx
    return false
  }

  strBuilder(): string {
    // featureList
    const f: string[] = []

    if (this.qrdata) {
      f.push(`[qrdata]="'${this.qrdata}'"`)
    }
    if (this.allowEmptyString) {
      f.push(`[allowEmptyString]="'${this.allowEmptyString}'"`)
    }
    if (this.alt) {
      if (this.elementType === "img" || this.elementType === "url") {
        f.push(`[alt]="'${this.alt}'"`)
      } else {
        f.push(
          `/* alt attribute is only available for elementTypes "img" and "url" */`
        )
      }
    }
    if (this.ariaLabel) {
      if (
        this.elementType === "canvas" ||
        this.elementType === "img" ||
        this.elementType === "url"
      ) {
        f.push(`[ariaLabel]="'${this.ariaLabel}'"`)
      } else {
        f.push(
          `/* aria-label attribute is only available for elementTypes "canvas", "img" and "url" */`
        )
      }
    }

    if (this.cssClass) {
      f.push(`[cssClass]="'${this.cssClass}'"`)
    }
    if (this.colorDark) {
      f.push(`[colorDark]="'${this.colorDark}'"`)
    }
    if (this.colorLight) {
      f.push(`[colorLight]="'${this.colorLight}'"`)
    }
    f.push(`[elementType]="'${this.elementType}'"`)
    f.push(`[errorCorrectionLevel]="'${this.errorCorrectionLevel}'"`)
    if (this.margin) {
      f.push(`[margin]="'${this.margin}'"`)
    }
    if (this.scale) {
      f.push(`[scale]="'${this.scale}'"`)
    }
    if (this.title) {
      f.push(`[title]="'${this.title}'"`)
    }
    f.push(`[width]="'${this.width}'"`)

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
