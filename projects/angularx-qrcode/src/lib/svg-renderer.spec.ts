import { TestBed } from '@angular/core/testing'
import { QRCodeComponent } from './angularx-qrcode.component'
import { vi, it, expect, describe, beforeEach, afterEach } from 'vitest'

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

describe('width with the real QR renderers', () => {
  const exports: Blob[] = []
  const drawImage = vi.fn()
  const images: HTMLImageElement[] = []

  beforeEach(async () => {
    exports.length = 0
    images.length = 0
    drawImage.mockClear()
    vi.spyOn(URL, 'createObjectURL').mockImplementation((blob) => {
      if (!(blob instanceof Blob)) throw new Error('Expected a QR export Blob')
      exports.push(blob)
      return `blob:width-${exports.length}`
    })
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined)
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      createImageData: (width: number, height: number) => ({
        data: new Uint8ClampedArray(width * height * 4),
      }),
      clearRect: vi.fn(),
      putImageData: vi.fn(),
      drawImage,
    } as unknown as CanvasRenderingContext2D)
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('data:image/png;base64,cXI=')
    vi.stubGlobal(
      'Image',
      class {
        constructor(width: number, height: number) {
          const image = document.createElement('img')
          image.width = width
          image.height = height
          images.push(image)
          return image
        }
      }
    )
    await TestBed.configureTestingModule({ imports: [QRCodeComponent] }).compileComponents()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it.each([
    ['100%', '100%'],
    ['256px', '256px'],
    ['12em', '12em'],
    ['256', '256'],
    ['0x100', '256'],
  ])('preserves SVG geometry and exports display width %s', async (width, dimension) => {
    const fixture = TestBed.createComponent(QRCodeComponent)
    const component = fixture.componentInstance
    component.qrdata = 'hello'
    component.elementType = 'svg'
    fixture.componentRef.setInput('width', 256)
    fixture.detectChanges()
    await fixture.whenStable()
    const original = component.qrcElement.nativeElement.querySelector('svg')!
    const geometry = original.innerHTML
    const viewBox = original.getAttribute('viewBox')
    const rendered = vi.fn()
    component.rendered.subscribe(rendered)

    fixture.componentRef.setInput('width', width)
    fixture.detectChanges()
    await fixture.whenStable()
    const svg = component.qrcElement.nativeElement.querySelector('svg')!
    expect(svg.getAttribute('width')).toBe(dimension)
    expect(svg.getAttribute('height')).toBe(dimension)
    expect(svg.getAttribute('viewBox')).toBe(viewBox)
    expect(svg.innerHTML).toBe(geometry)
    expect(component.width()).toBe(width)
    expect(rendered).toHaveBeenCalledOnce()
    expect(exports[1].type).toBe('image/svg+xml')
    expect(await exports[1].text()).toBe(svg.outerHTML)
    expect(URL.revokeObjectURL).toHaveBeenCalledExactlyOnceWith('blob:width-1')
    fixture.destroy()
    expect(URL.revokeObjectURL).toHaveBeenLastCalledWith('blob:width-2')
  })

  const rasterWidths: [number | string, number][] = [
    [256, 256],
    ['256', 256],
    ['100%', 75],
    ['256px', 75],
    [10, 75],
    ['10', 75],
    [21, 100],
    ['21', 100],
  ]

  it.each(rasterWidths)('uses upstream canvas sizing for width %s', async (width, size) => {
    const fixture = TestBed.createComponent(QRCodeComponent)
    fixture.componentInstance.qrdata = 'hello'
    fixture.componentInstance.margin = 2
    fixture.componentInstance.scale = 3
    fixture.componentRef.setInput('width', width)
    fixture.detectChanges()
    await fixture.whenStable()
    const canvas = fixture.componentInstance.qrcElement.nativeElement.querySelector('canvas')!
    expect(canvas.width).toBe(size)
    expect(canvas.height).toBe(size)
    expect(fixture.componentInstance.width()).toBe(width)
  })

  it.each(['img', 'url'] as const)(
    'exports a real PNG with numeric string width for %s',
    async (elementType) => {
      const fixture = TestBed.createComponent(QRCodeComponent)
      fixture.componentInstance.qrdata = 'hello'
      fixture.componentInstance.elementType = elementType
      fixture.componentRef.setInput('width', '256')
      // jsdom has no image decoder; QR generation and PNG encoding remain real.
      const decode = vi.fn().mockResolvedValue(undefined)
      const createElement = document.createElement.bind(document)
      vi.spyOn(document, 'createElement').mockImplementation((tag, options) => {
        const element = createElement(tag, options)
        if (element instanceof HTMLImageElement) element.decode = decode
        return element
      })
      const complete = vi.fn()
      fixture.componentInstance.rendered.subscribe(complete)
      fixture.detectChanges()
      // Node PNG encoding uses a stream, which Angular's stability check does not track.
      await vi.waitFor(() => expect(complete).toHaveBeenCalledOnce())
      const image = fixture.componentInstance.qrcElement.nativeElement.querySelector('img')!
      const bytes = Uint8Array.from(atob(image.src.split(';base64,')[1]), (value) =>
        value.charCodeAt(0)
      )
      const header = new DataView(bytes.buffer)
      expect(header.getUint32(16)).toBe(256)
      expect(header.getUint32(20)).toBe(256)
      expect(decode).toHaveBeenCalledOnce()
      expect(exports[0].type).toBe('image/png')
    }
  )

  it.each([256, '256'])('keeps numeric logo geometry for canvas width %s', async (width) => {
    const fixture = TestBed.createComponent(QRCodeComponent)
    fixture.componentInstance.qrdata = 'hello'
    fixture.componentInstance.imageSrc = '/logo.png'
    fixture.componentRef.setInput('width', width)
    fixture.detectChanges()
    await vi.waitFor(() => expect(images).toHaveLength(1))
    expect(exports).toHaveLength(0)
    images[0].dispatchEvent(new Event('load'))
    await fixture.whenStable()
    const canvas = fixture.componentInstance.qrcElement.nativeElement.querySelector('canvas')!
    expect(canvas.width).toBe(256)
    expect(drawImage).toHaveBeenCalledExactlyOnceWith(images[0], 108, 108, 40, 40)
    expect(exports).toHaveLength(1)
  })
})
