export type QRCodeErrorCorrectionLevel =
  | 'L'
  | 'M'
  | 'Q'
  | 'H'
  | 'low'
  | 'medium'
  | 'quartile'
  | 'high'

export interface QRCodeConfigType {
  color: {
    dark: RGBAColor
    light: RGBAColor
  }
  errorCorrectionLevel: QRCodeErrorCorrectionLevel
  margin: number
  scale: number
  version?: QRCodeVersion
  width: number
}

export type QRCodeElementType = 'url' | 'img' | 'canvas' | 'svg'

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

/**
 * Hex RGB/RGBA color, with 3, 4, 6 or 8 digits and an optional leading #.
 * Uses string to accept dynamic values (including color-picker results), matching
 * qrcode's public color contract. The renderer parses values at runtime;
 * enumerating every hex combination exceeds TypeScript union limits.
 */
export type RGBAColor = string

/** A failure from the current QR render; superseded and destroyed renders are silent. */
export interface QRCodeGenerationError {
  /** Input rejection or a renderer/export/logo failure. */
  readonly code: 'invalid-input' | 'render-failure'
  /** The renderer selected when the failed render started. */
  readonly elementType: QRCodeElementType
  /** The original Error, or an Error wrapping a non-Error rejection. */
  readonly error: Error
}
