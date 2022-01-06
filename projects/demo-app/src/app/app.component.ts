import { Component } from "@angular/core"

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "angularx-qrcode-demo-app"

  public colorDark: string
  public colorLight: string
  public cssClass: string
  public qrdata: string
  public elementType: "img" | "url" | "canvas" | "svg"
  public errorCorrectionLevel: "L" | "M" | "Q" | "H"
  public margin: number
  public scale: number
  public width: number

  constructor() {
    this.colorDark = "#000000ff"
    this.colorLight = "#ffffffff"
    this.cssClass = "left"
    this.elementType = "img"
    this.errorCorrectionLevel = "M"
    this.margin = 4
    this.qrdata = "https://github.com/Cordobo/angularx-qrcode"
    this.scale = 1
    this.width = 256
  }

  setBorderRadiusWithZeroMargin() {
    this.changeCssClass("demoBorderRadius")
    this.margin = 0
  }

  setColorDark(newValue: string) {
    this.colorDark = newValue
  }

  setColorLight(newValue: string) {
    this.colorLight = newValue
  }

  changeCssClass(
    newValue: "left" | "center" | "right" | "demoBorder" | "demoBorderRadius"
  ): void {
    this.cssClass = newValue
  }

  changeElementType(newValue: "img" | "url" | "canvas" | "svg"): void {
    this.elementType = newValue
  }

  changeErrorCorrectionLevel(newValue: "L" | "M" | "Q" | "H"): void {
    this.errorCorrectionLevel = newValue
  }

  changeMargin(newValue: number): void {
    this.margin = newValue
  }

  changeQrdata(newValue: string): void {
    this.qrdata = newValue
  }

  changeScale(newValue: number): void {
    this.scale = newValue
  }

  changeWidth(newValue: number): void {
    this.width = newValue
  }
}
