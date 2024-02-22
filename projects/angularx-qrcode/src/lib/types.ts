export type QRCodeErrorCorrectionLevel =
  | "L"
  | "M"
  | "Q"
  | "H"
  | "low"
  | "medium"
  | "quartile"
  | "high"

export interface QRCodeConfigType {
  color: {
    dark: string
    light: string
  }
  errorCorrectionLevel: QRCodeErrorCorrectionLevel
  margin: number
  scale: number
  version?: QRCodeVersion
  width: number
}

export type QRCodeElementType = "url" | "img" | "canvas" | "svg"

export type QRCodeVersion =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31
  | 32
  | 33
  | 34
  | 35
  | 36
  | 37
  | 38
  | 39
  | 40

// TODO A little-bit-of-a-better solution
// https://stackoverflow.com/a/67511209
export type RGBAColor = `#${string}`

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export type FixMeLater = any
