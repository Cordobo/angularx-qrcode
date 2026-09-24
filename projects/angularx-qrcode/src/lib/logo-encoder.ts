/*!
 * Placement/interleaving mapping adapted from node-qrcode 1.5.4.
 * The MIT License (MIT)
 *
 * Copyright (c) 2012 Ryan Day
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 *
 */
import './qrcode-internals'
import { create, QRCode, QRCodeMaskPattern, QRCodeRenderersOptions } from 'qrcode'
import * as Mask from 'qrcode/lib/core/mask-pattern.js'
import * as EC from 'qrcode/lib/core/error-correction-code.js'
import { getSymbolTotalCodewords } from 'qrcode/lib/core/utils.js'
import * as Geometry from 'qrcode/lib/renderer/utils.js'

/** All pinned node-qrcode internals stay in this encoder adapter. */
export interface LogoGeometry {
  width: number
  height: number
  padding: number
}

export interface ModuleBit {
  bitIndex: number
  codeword: number
  block: number
  blockCodeword: number
  kind: 'data' | 'parity'
}

/** Read-only counterpart of qrcode@1.5.4 createCodewords/setupData. */
export function mapModules(qr: QRCode): (ModuleBit | undefined)[] {
  const total = getSymbolTotalCodewords(qr.version)
  const parity = EC.getTotalCodewordsCount(qr.version, qr.errorCorrectionLevel)
  const blocks = EC.getBlocksCount(qr.version, qr.errorCorrectionLevel)
  const shortBlocks = blocks - (total % blocks)
  const dataSize = Math.floor((total - parity) / blocks)
  const words: Omit<ModuleBit, 'bitIndex' | 'codeword'>[] = []
  for (let i = 0; i <= dataSize; i++) {
    for (let block = 0; block < blocks; block++) {
      if (i < dataSize + (block >= shortBlocks ? 1 : 0)) {
        words.push({ block, blockCodeword: i, kind: 'data' })
      }
    }
  }
  for (let i = 0; i < parity / blocks; i++) {
    for (let block = 0; block < blocks; block++) {
      words.push({ block, blockCodeword: i, kind: 'parity' })
    }
  }
  const { size } = qr.modules
  const mapping = new Array<ModuleBit | undefined>(size * size).fill(undefined)
  let row = size - 1
  let direction = -1
  let bitIndex = 0
  for (let col = size - 1; col > 0; col -= 2) {
    if (col === 6) col--
    while (true) {
      for (let offset = 0; offset < 2; offset++) {
        if (qr.modules.isReserved(row, col - offset)) continue
        const codeword = Math.floor(bitIndex / 8)
        if (codeword < total) {
          mapping[row * size + col - offset] = { ...words[codeword], bitIndex, codeword }
        }
        bitIndex++
      }
      row += direction
      if (row < 0 || row >= size) {
        row -= direction
        direction = -direction
        break
      }
    }
  }
  return mapping
}

export function logoTarget(qr: QRCode, options: QRCodeRenderersOptions, logo: LogoGeometry) {
  if (
    ![logo.width, logo.height, logo.padding].every(Number.isFinite) ||
    logo.width <= 0 ||
    logo.height <= 0 ||
    logo.padding < 0
  ) {
    throw new Error('Logo dimensions must be positive and padding must be non-negative.')
  }
  const size = qr.modules.size
  const normalized = Geometry.getOptions({ ...options, color: { ...options.color } })
  const scale = Geometry.getScale(size, normalized)
  const canvasSize = Geometry.getImageWidth(size, normalized)
  if (!Number.isFinite(scale) || scale <= 0 || !Number.isFinite(canvasSize)) {
    throw new Error('Invalid logo canvas geometry.')
  }
  const bound = (pixel: number, upper: boolean) =>
    Math.max(
      0,
      Math.min(size, (upper ? Math.ceil : Math.floor)((pixel - normalized.margin * scale) / scale))
    )
  return {
    left: bound((canvasSize - logo.width) / 2 - logo.padding, false),
    right: bound((canvasSize + logo.width) / 2 + logo.padding, true),
    top: bound((canvasSize - logo.height) / 2 - logo.padding, false),
    bottom: bound((canvasSize + logo.height) / 2 + logo.padding, true),
  }
}

/** Zero free RS bits: choose a legal mask without modifying any codeword. */
export function encodeLogo(data: string, options: QRCodeRenderersOptions, logo: LogoGeometry) {
  const masks: QRCodeMaskPattern[] = [0, 1, 2, 3, 4, 5, 6, 7]
  const symbols = masks.map((maskPattern) => create(data, { ...options, maskPattern }))
  const first = symbols[0]
  const target = logoTarget(first, options, logo)
  const mapping = mapModules(first)
  const eligible: number[] = []
  let requestedTargetModules = 0
  let excludedStructuralModules = 0
  let excludedRemainderModules = 0
  for (let row = target.top; row < target.bottom; row++) {
    for (let col = target.left; col < target.right; col++) {
      requestedTargetModules++
      const index = row * first.modules.size + col
      if (first.modules.isReserved(row, col)) excludedStructuralModules++
      else if (!mapping[index]) excludedRemainderModules++
      else eligible.push(index)
    }
  }
  const candidates = symbols.map((qr, index) => ({
    maskPattern: masks[index],
    penalty:
      Mask.getPenaltyN1(qr.modules) +
      Mask.getPenaltyN2(qr.modules) +
      Mask.getPenaltyN3(qr.modules) +
      Mask.getPenaltyN4(qr.modules),
    satisfiedTargetModules: eligible.filter((index) => qr.modules.data[index] === 0).length,
  }))
  const selected = candidates.reduce((best, candidate) =>
    candidate.penalty < best.penalty ||
    (candidate.penalty === best.penalty &&
      candidate.satisfiedTargetModules > best.satisfiedTargetModules)
      ? candidate
      : best
  )
  return {
    qr: symbols[selected.maskPattern],
    maskPattern: selected.maskPattern,
    target,
    requestedTargetModules,
    excludedStructuralModules,
    excludedRemainderModules,
    eligibleTargetModules: eligible.length,
    satisfiedTargetModules: selected.satisfiedTargetModules,
    remainingDarkModules: eligible.length - selected.satisfiedTargetModules,
    candidates,
  }
}
