import { expectTypeOf, it, expect } from 'vitest'
import { toString } from 'qrcode'
import { RGBAColor, QRCodeConfigType } from './types'
import { QRCodeComponent } from './angularx-qrcode.component'
import { InputSignal } from '@angular/core'

it('accepts string or numeric width inputs while keeping the exported config numeric', () => {
  expectTypeOf<QRCodeComponent['width']>().toEqualTypeOf<InputSignal<number | string>>()
  expectTypeOf<QRCodeConfigType['width']>().toEqualTypeOf<number>()
})

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
