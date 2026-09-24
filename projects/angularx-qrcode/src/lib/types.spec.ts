import { expectTypeOf, it, expect } from 'vitest'
import { toString } from 'qrcode'
import { RGBAColor } from './types'

it('accepts dynamic string colors without requiring a hash prefix', () => {
  expectTypeOf<string>().toExtend<RGBAColor>()
  expectTypeOf<RGBAColor>().toEqualTypeOf<string>()
})

it.each(['abc', 'abcd', 'abcdef', 'abcdef80', '#abc', '#abcd', '#abcdef', '#abcdef80'])(
  'renders supported hex color %s with the real renderer',
  async (color: RGBAColor) => {
    const svg = await toString('color contract', { type: 'svg', color: { dark: color } })
    expect(svg).toContain('<svg')
    expect(svg).toContain('stroke="#')
  }
)
