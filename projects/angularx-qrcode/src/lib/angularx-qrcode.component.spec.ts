import { TestBed } from '@angular/core/testing'
import { QRCodeComponent } from './angularx-qrcode.component'
import { vi } from 'vitest'

vi.mock('qrcode', () => {
  return {
    toCanvas: (
      canvas: HTMLCanvasElement,
      text: string,
      _options: unknown,
      cb: (error?: Error | null) => void
    ) => {
      canvas.setAttribute('data-qr', text)
      const delay = text === 'first' ? 20 : 0
      setTimeout(() => cb(null), delay)
    },
    toDataURL: (
      text: string,
      _options: unknown,
      cb: (error: Error | null | undefined, url: string) => void
    ) => cb(null, `data:image/png;base64,${btoa(text)}`),
    toString: (
      text: string,
      _options: unknown,
      cb: (error: Error | null | undefined, svg: string) => void
    ) => cb(null, `<svg data-qr="${text}"></svg>`),
  }
})

describe('QRCodeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QRCodeComponent],
    }).compileComponents()
  })

  it('does not mutate qrdata when allowEmptyString is true', async () => {
    const fixture = TestBed.createComponent(QRCodeComponent)
    fixture.componentRef.setInput('allowEmptyString', true)
    fixture.componentRef.setInput('qrdata', '')
    fixture.detectChanges()
    await fixture.whenStable()
    expect(fixture.componentInstance.qrdata).toBe('')
  })

  it('keeps latest render result when async calls resolve out of order', async () => {
    const fixture = TestBed.createComponent(QRCodeComponent)
    fixture.componentRef.setInput('elementType', 'canvas')
    fixture.componentRef.setInput('qrdata', 'first')
    fixture.detectChanges()

    fixture.componentRef.setInput('qrdata', 'second')
    fixture.detectChanges()

    await new Promise((resolve) => setTimeout(resolve, 40))
    fixture.detectChanges()

    const canvas = fixture.nativeElement.querySelector('canvas') as HTMLCanvasElement | null
    expect(canvas?.getAttribute('data-qr')).toBe('second')
  })
})
