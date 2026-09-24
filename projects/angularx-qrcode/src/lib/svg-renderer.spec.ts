import { TestBed } from '@angular/core/testing'
import { QRCodeComponent } from './angularx-qrcode.component'
import { vi, it, expect } from 'vitest'

it('renders an actual SVG with the real Node qrcode entry point', async () => {
  await TestBed.configureTestingModule({ imports: [QRCodeComponent] }).compileComponents()
  const createUrl = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:svg')
  const revokeUrl = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined)
  try {
    const fixture = TestBed.createComponent(QRCodeComponent)
    fixture.componentInstance.qrdata = 'Real SVG renderer'
    fixture.componentInstance.elementType = 'svg'
    await fixture.componentInstance.ngOnChanges()
    const svg = fixture.nativeElement.querySelector('svg')
    expect(svg).toBeInstanceOf(SVGSVGElement)
    expect(svg.querySelector('path')).not.toBeNull()
    expect(svg.namespaceURI).toBe('http://www.w3.org/2000/svg')
    fixture.destroy()
  } finally {
    createUrl.mockRestore()
    revokeUrl.mockRestore()
  }
})
