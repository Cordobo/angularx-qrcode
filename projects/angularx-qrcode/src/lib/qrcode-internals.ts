/** Narrow contracts for the pinned qrcode@1.5.4 adapter. */
declare module 'qrcode/lib/core/mask-pattern.js' {
  import { QRCode } from 'qrcode'
  export function getPenaltyN1(matrix: QRCode['modules']): number
  export function getPenaltyN2(matrix: QRCode['modules']): number
  export function getPenaltyN3(matrix: QRCode['modules']): number
  export function getPenaltyN4(matrix: QRCode['modules']): number
  export function applyMask(pattern: number, matrix: QRCode['modules']): void
}
declare module 'qrcode/lib/core/error-correction-code.js' {
  import { QRCode } from 'qrcode'
  export function getTotalCodewordsCount(
    version: number,
    level: QRCode['errorCorrectionLevel']
  ): number
  export function getBlocksCount(version: number, level: QRCode['errorCorrectionLevel']): number
}
declare module 'qrcode/lib/core/utils.js' {
  export function getSymbolTotalCodewords(version: number): number
}
declare module 'qrcode/lib/renderer/utils.js' {
  import { QRCodeRenderersOptions } from 'qrcode'
  interface Options {
    margin: number
    scale: number
    width?: number
  }
  export function getOptions(options: QRCodeRenderersOptions): Options
  export function getScale(size: number, options: Options): number
  export function getImageWidth(size: number, options: Options): number
}
declare module 'qrcode/lib/core/reed-solomon-encoder.js' {
  export default class ReedSolomonEncoder {
    constructor(degree: number)
    encode(data: Uint8Array): Uint8Array
  }
}

declare module 'qrcode/lib/core/qrcode.js' {
  export { create } from 'qrcode'
}
