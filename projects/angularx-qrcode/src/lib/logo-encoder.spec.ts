import jsQR from 'jsqr'
import { applyMask } from 'qrcode/lib/core/mask-pattern.js'
import ReedSolomonEncoder from 'qrcode/lib/core/reed-solomon-encoder.js'
import { create } from 'qrcode'
import { encodeLogo, mapModules, logoTarget } from './logo-encoder'

describe('logo-aware encoder', () => {
  it('maps zigzag bits deterministically and excludes reserved modules', () => {
    const qr = create('hello', { version: 1 })
    const mapping = mapModules(qr)
    expect(mapping[20 * 21 + 20]?.bitIndex).toBe(0)
    expect(mapping[20 * 21 + 19]?.bitIndex).toBe(1)
    expect(mapping[19 * 21 + 20]?.bitIndex).toBe(2)
    expect(mapping.filter(Boolean)).toHaveLength(26 * 8)
    expect(mapping).toEqual(mapModules(qr))
    for (let r = 0; r < 21; r++)
      for (let c = 0; c < 21; c++) {
        if (qr.modules.isReserved(r, c)) expect(mapping[r * 21 + c]).toBeUndefined()
      }
  })

  it('centers non-square targets, rounds outward and expands padding', () => {
    const qr = create('hello', { version: 1 })
    expect(logoTarget(qr, { scale: 4 }, { width: 20, height: 12, padding: 0 })).toEqual({
      left: 8,
      right: 13,
      top: 9,
      bottom: 12,
    })
    expect(logoTarget(qr, { scale: 4 }, { width: 20, height: 12, padding: 4 })).toEqual({
      left: 7,
      right: 14,
      top: 8,
      bottom: 13,
    })
  })

  it.each(['L', 'M', 'Q', 'H'] as const)('keeps valid upstream matrices at level %s', (level) => {
    for (const version of [1, 5, 7, 10]) {
      const options = { version, errorCorrectionLevel: level, width: 240 }
      const result = encodeLogo('hello', options, { width: 60, height: 32, padding: 2 })
      const baseline = create('hello', options)
      const minimum = Math.min(...result.candidates.map((c) => c.penalty))
      expect(result.candidates).toHaveLength(8)
      expect(result.candidates[result.maskPattern].penalty).toBe(minimum)
      expect(result.satisfiedTargetModules).toBeGreaterThanOrEqual(
        result.candidates[baseline.maskPattern!].satisfiedTargetModules
      )
      expect(result.qr.modules.data).toEqual(
        create('hello', {
          ...options,
          maskPattern: result.maskPattern,
        }).modules.data
      )
      expect(result).toEqual(encodeLogo('hello', options, { width: 60, height: 32, padding: 2 }))
      expect(result.eligibleTargetModules).toBe(
        result.satisfiedTargetModules + result.remainingDarkModules
      )
    }
  })

  it('reports impossible targets instead of forcing light modules', () => {
    const result = encodeLogo('hello', { version: 7 }, { width: 1000, height: 1000, padding: 0 })
    expect(result.excludedStructuralModules).toBeGreaterThan(0)
    expect(result.remainingDarkModules).toBeGreaterThan(0)
    expect(result.requestedTargetModules).toBe(45 * 45)
  })
})

describe('mask and RS invariants', () => {
  it('improves a minimum-penalty tie without changing payload codewords', () => {
    const result = encodeLogo(
      'logo 11',
      { version: 2, scale: 4 },
      { width: 36, height: 36, padding: 0 }
    )
    expect(result.candidates[1]).toEqual({
      maskPattern: 1,
      penalty: 462,
      satisfiedTargetModules: 37,
    })
    expect(result.maskPattern).toBe(2)
    expect(result.satisfiedTargetModules).toBe(41)
  })

  it.each(['L', 'M', 'Q', 'H'] as const)(
    'preserves all codewords and valid RS blocks: %s',
    (level) => {
      for (const version of [1, 2, 5, 7, 10, 40]) {
        let baseline: number[] | undefined
        for (const maskPattern of [0, 1, 2, 3, 4, 5, 6, 7] as const) {
          const qr = create('hello', { version, errorCorrectionLevel: level, maskPattern })
          const mapping = mapModules(qr)
          applyMask(maskPattern, qr.modules)
          const words: number[] = []
          const blocks: { data: number[]; parity: number[] }[] = []
          mapping.forEach((bit, index) => {
            if (!bit) return
            const value = qr.modules.data[index] << (7 - (bit.bitIndex % 8))
            words[bit.codeword] = (words[bit.codeword] ?? 0) | value
            const block = (blocks[bit.block] ??= { data: [], parity: [] })
            block[bit.kind][bit.blockCodeword] = (block[bit.kind][bit.blockCodeword] ?? 0) | value
          })
          if (baseline) expect(words).toEqual(baseline)
          baseline = words
          for (const block of blocks) {
            expect(
              Array.from(
                new ReedSolomonEncoder(block.parity.length).encode(Uint8Array.from(block.data))
              )
            ).toEqual(block.parity)
          }
        }
      }
    }
  )

  it('independently decodes every mask, multiple payloads, versions, levels and target sizes', () => {
    for (const [version, data] of [
      [1, 'hello'],
      [5, 'https://example.com/path?q=123'],
      [7, 'Grüße 🌍 '.repeat(4)],
    ] as const) {
      for (const errorCorrectionLevel of ['L', 'M', 'Q', 'H'] as const) {
        for (const width of [12, 48]) {
          const result = encodeLogo(
            data,
            { version, errorCorrectionLevel },
            { width, height: width / 2, padding: 2 }
          )
          for (const candidate of result.candidates) {
            const qr = create(data, {
              version,
              errorCorrectionLevel,
              maskPattern: candidate.maskPattern,
            })
            const scale = 4
            const size = (qr.modules.size + 8) * scale
            const pixels = new Uint8ClampedArray(size * size * 4).fill(255)
            for (let y = 0; y < qr.modules.size * scale; y++) {
              for (let x = 0; x < qr.modules.size * scale; x++) {
                if (!qr.modules.get(Math.floor(y / scale), Math.floor(x / scale))) continue
                const index = ((y + 4 * scale) * size + x + 4 * scale) * 4
                pixels[index] = pixels[index + 1] = pixels[index + 2] = 0
              }
            }
            const decoded = jsQR(pixels, size, size)
            expect(decoded?.data).toBe(data)
            // Successful independent decoding also checks the encoded format/mask information.
          }
        }
      }
    }
  }, 20000)
})

it('keeps format bits consistent with the selected mask and other structural bits unchanged', () => {
  const symbols = ([0, 1, 2, 3, 4, 5, 6, 7] as const).map((maskPattern) =>
    create('structure', { version: 7, errorCorrectionLevel: 'H', maskPattern })
  )
  const size = symbols[0].modules.size
  for (const [mask, qr] of symbols.entries()) {
    // BCH(15,5), generator 0x537; H's two format level bits are 10.
    const data = (2 << 3) | mask
    let remainder = data << 10
    for (let bit = 14; bit >= 10; bit--) {
      if (remainder & (1 << bit)) remainder ^= 0x537 << (bit - 10)
    }
    const encoded = ((data << 10) | remainder) ^ 0x5412
    const formatPositions = new Set<number>()
    for (let bit = 0; bit < 15; bit++) {
      const row = bit < 6 ? bit : bit < 8 ? bit + 1 : size - 15 + bit
      const col = bit < 8 ? size - bit - 1 : bit === 8 ? 7 : 14 - bit
      formatPositions.add(row * size + 8)
      formatPositions.add(8 * size + col)
      expect(qr.modules.get(row, 8)).toBe((encoded >> bit) & 1)
      expect(qr.modules.get(8, col)).toBe((encoded >> bit) & 1)
    }
    for (let row = 0; row < size; row++)
      for (let col = 0; col < size; col++) {
        if (qr.modules.isReserved(row, col) && !formatPositions.has(row * size + col)) {
          expect(qr.modules.get(row, col)).toBe(symbols[0].modules.get(row, col))
        }
      }
  }
})

it('uses upstream fallback sizing and fractional scales without mutating options', () => {
  const qr = create('hello', { version: 1 })
  const logo = { width: 20, height: 12, padding: 0 }
  expect(logoTarget(qr, { width: 10, scale: 4 }, logo)).toEqual(logoTarget(qr, { scale: 4 }, logo))
  // width >= 21 but too small for symbol + quiet zone: upstream defaults to scale 4.
  expect(logoTarget(qr, { width: 21, scale: 8 }, logo)).toEqual(logoTarget(qr, { scale: 4 }, logo))
  const options = Object.freeze({ width: 101, margin: 4, color: Object.freeze({ light: '#fff' }) })
  expect(logoTarget(qr, options, logo)).toEqual({ left: 7, right: 14, top: 8, bottom: 13 })
  for (const padding of [-1, Infinity, NaN]) {
    expect(() => logoTarget(qr, options, { ...logo, padding })).toThrow()
  }
})
