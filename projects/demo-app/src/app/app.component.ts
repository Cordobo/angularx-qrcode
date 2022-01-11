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
    colorDark: "#000000ff",
    colorLight: "#ffffffff",
    cssClass: "center",
    elementType: "canvas" as QRCodeElementType,
    errorCorrectionLevel: "M" as QRCodeErrorCorrectionLevel,
    margin: 4,
    qrdata: "https://github.com/Cordobo/angularx-qrcode",
    scale: 1,
    version: undefined,
    width: 300,
  }

  public data_model = {
    ...this.initial_state,
  }

  public allowEmptyString: boolean
  public colorDark: string
  public colorLight: string
  public cssClass: string
  public qrdata: string
  public elementType: QRCodeElementType
  public errorCorrectionLevel: QRCodeErrorCorrectionLevel
  public margin: number
  public scale: number
  public width: number

  public marginList: ListType
  public scaleList: ListType
  public widthList: ListType

  constructor() {
    this.allowEmptyString = this.data_model.allowEmptyString
    this.colorDark = this.data_model.colorDark
    this.colorLight = this.data_model.colorLight
    this.cssClass = this.data_model.cssClass
    this.elementType = this.data_model.elementType
    this.errorCorrectionLevel = this.data_model.errorCorrectionLevel
    this.margin = this.data_model.margin
    this.qrdata = this.data_model.qrdata
    this.scale = this.data_model.scale
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
    this.colorDark = this.data_model.colorDark
    this.colorLight = this.data_model.colorLight
    this.cssClass = this.data_model.cssClass
    this.elementType = this.data_model.elementType
    this.errorCorrectionLevel = this.data_model.errorCorrectionLevel
    this.margin = this.data_model.margin
    this.qrdata = this.data_model.qrdata
    this.scale = this.data_model.scale
    this.width = this.data_model.width
  }

  get renderSampleCode() {
    return `<qrcode
  [qrdata]="'${this.qrdata}'"
  ${
    this.allowEmptyString ? `[allowEmptyString]="${this.allowEmptyString}"` : ""
  }
  ${this.cssClass ? `[cssClass]="'${this.cssClass}'"` : ""}
  ${this.colorDark ? `[colorDark]="'${this.colorDark}'"` : ""}
  ${this.colorLight ? `[colorLight]="'${this.colorLight}'"` : ""}
  [elementType]="'${this.elementType}'"
  [errorCorrectionLevel]="'${this.errorCorrectionLevel}'"
  [margin]="${this.margin}"
  [scale]="${this.scale}"
  [width]="${this.width}"
></qrcode>`
  }
}
