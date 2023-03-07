import { QRCodeElementType, QRCodeVersion } from "./types"
import { QRCodeErrorCorrectionLevel } from "qrcode"
import { InjectionToken } from "@angular/core"

export const QRCODE_ALLOW_EMPTY_STRING = new InjectionToken<boolean>(
  "QRCODE_ALLOW_EMPTY_STRING",
  {
    factory: () => false,
  }
)

export const QRCODE_COLOR_DARK = new InjectionToken<string>(
  "QRCODE_COLOR_DARK",
  {
    factory: () => "#000000ff",
  }
)

export const QRCODE_COLOR_LIGHT = new InjectionToken<string>(
  "QRCODE_COLOR_LIGHT",
  {
    factory: () => "#ffffffff",
  }
)

export const QRCODE_CSS_CLASS = new InjectionToken<string>("QRCODE_CSS_CLASS", {
  factory: () => "qrcode",
})

export const QRCODE_ELEMENT_TYPE = new InjectionToken<QRCodeElementType>(
  "QRCODE_ELEMENT_TYPE",
  {
    factory: () => "canvas",
  }
)

export const QRCODE_ERROR_CORRECTION_LEVEL =
  new InjectionToken<QRCodeErrorCorrectionLevel>(
    "QRCODE_ERROR_CORRECTION_LEVEL",
    {
      factory: () => "M",
    }
  )

export const QRCODE_IMAGE_SRC = new InjectionToken<string | undefined>(
  "QRCODE_IMAGE_SRC",
  {
    factory: () => undefined,
  }
)

export const QRCODE_IMAGE_HEIGHT = new InjectionToken<number>(
  "QRCODE_IMAGE_HEIGHT",
  {
    factory: () => 40,
  }
)

export const QRCODE_IMAGE_WIDTH = new InjectionToken<number>(
  "QRCODE_IMAGE_WIDTH",
  {
    factory: () => 40,
  }
)

export const QRCODE_MARGIN = new InjectionToken<number>("QRCODE_MARGIN", {
  factory: () => 4,
})

export const QRCODE_SCALE = new InjectionToken<number>("QRCODE_SCALE", {
  factory: () => 4,
})

export const QRCODE_VERSION = new InjectionToken<QRCodeVersion | undefined>(
  "QRCODE_VERSION",
  {
    factory: () => undefined,
  }
)

export const QRCODE_WIDTH = new InjectionToken<number>("QRCODE_WIDTH", {
  factory: () => 10,
})
