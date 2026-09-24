import { SimpleChange } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { QRCodeComponent } from './angularx-qrcode.component'
import { vi } from 'vitest'
import { toCanvas, toDataURL, toString } from 'qrcode'
import { QRCodeElementType } from './types'

vi.mock('qrcode', () => {
  return {
    toCanvas: vi.fn(
      (
        canvas: HTMLCanvasElement,
        text: string,
        _options: unknown,
        cb: (error?: Error | null) => void
      ) => {
        canvas.setAttribute('data-qr', text)
        const delay = text === 'first' ? 20 : 0
        setTimeout(() => cb(null), delay)
      }
    ),
    toDataURL: vi.fn(
      (
        text: string,
        _options: unknown,
        cb: (error: Error | null | undefined, url: string) => void
      ) => cb(null, `data:image/png;base64,${btoa(text)}`)
    ),
    toString: vi.fn(
      (
        text: string,
        _options: unknown,
        cb: (error: Error | null | undefined, svg: string) => void
      ) => cb(null, `<svg data-qr="${text}"></svg>`)
    ),
  }
})

describe('QRCodeComponent', () => {
  const drawImage = vi.fn()
  const images: HTMLImageElement[] = []

  function deferRenderer(elementType: QRCodeElementType): (error?: Error) => void {
    let finish: (error?: Error) => void = () => {
      throw new Error('Renderer has not started')
    }
    if (elementType === 'canvas') {
      vi.mocked(toCanvas).mockImplementationOnce((_canvas, _text, _options, callback) => {
        finish = (error) => callback?.(error)
        return Promise.resolve()
      })
    } else if (elementType === 'svg') {
      vi.mocked(toString).mockImplementationOnce((_text, _options, callback) => {
        finish = (error) => callback?.(error ?? null, '<svg></svg>')
        return Promise.resolve('')
      })
    } else {
      vi.mocked(toDataURL).mockImplementationOnce((_text, _options, callback) => {
        finish = (error) => callback?.(error ?? null, 'data:image/png;base64,cXI=')
        return Promise.resolve('')
      })
    }
    return (error) => finish(error)
  }

  const decode = vi.fn<() => Promise<void>>()
  const originalDecode = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'decode')
  beforeAll(() => {
    Object.defineProperty(HTMLImageElement.prototype, 'decode', {
      configurable: true,
      value: decode,
    })
  })
  afterAll(() => {
    if (originalDecode) Object.defineProperty(HTMLImageElement.prototype, 'decode', originalDecode)
    else Reflect.deleteProperty(HTMLImageElement.prototype, 'decode')
  })

  beforeEach(async () => {
    decode.mockReset().mockResolvedValue(undefined)
    images.length = 0
    drawImage.mockClear()
    vi.mocked(toCanvas).mockClear()
    vi.mocked(toDataURL).mockClear()
    vi.mocked(toString).mockClear()
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      drawImage,
    } as unknown as CanvasRenderingContext2D)
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('data:image/png;base64,cXI=')
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test-qr')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined)
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
    await TestBed.configureTestingModule({
      imports: [QRCodeComponent],
    }).compileComponents()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('selects SVG explicitly without changing the supplied configuration', async () => {
    const fixture = TestBed.createComponent(QRCodeComponent)
    const config = Object.freeze({ width: 120, color: Object.freeze({ dark: '#123' }) })
    const result = await fixture.componentInstance['toSVG']('svg test', config)
    expect(toString).toHaveBeenCalledWith(
      'svg test',
      { ...config, type: 'svg' },
      expect.any(Function)
    )
    expect(config).toEqual({ width: 120, color: { dark: '#123' } })
    expect(result).toContain('<svg')
  })

  it.each<QRCodeElementType>(['canvas', 'img', 'url', 'svg'])(
    'updates accessibility on the existing %s without generation or URL churn',
    async (elementType) => {
      const fixture = TestBed.createComponent(QRCodeComponent)
      const component = fixture.componentInstance
      component.qrdata = 'attributes'
      component.elementType = elementType
      await component.ngOnChanges()
      const element = component.qrcElement.nativeElement.firstElementChild
      vi.mocked(toCanvas).mockClear()
      vi.mocked(toDataURL).mockClear()
      vi.mocked(toString).mockClear()
      const urls = vi.spyOn(component.qrCodeURL, 'emit')
      component.title = 'Updated title'
      component.ariaLabel = 'Updated name'
      component.alt = ''
      await component.ngOnChanges({ title: new SimpleChange(undefined, component.title, false) })
      expect(component.qrcElement.nativeElement.firstElementChild).toBe(element)
      expect(element?.getAttribute('aria-label')).toBe('Updated name')
      expect(
        elementType === 'svg'
          ? element?.querySelector('title')?.textContent
          : element?.getAttribute('title')
      ).toBe('Updated title')
      if (elementType === 'img' || elementType === 'url')
        expect(element?.getAttribute('alt')).toBe('')
      component.title = undefined
      component.ariaLabel = undefined
      component.alt = undefined
      await component.ngOnChanges({ ariaLabel: new SimpleChange('Updated name', undefined, false) })
      expect(element?.hasAttribute('aria-label')).toBe(false)
      expect(element?.hasAttribute('title')).toBe(false)
      expect(element?.hasAttribute('alt')).toBe(false)
      expect(element?.querySelector('title')).toBeNull()
      expect(toCanvas).not.toHaveBeenCalled()
      expect(toDataURL).not.toHaveBeenCalled()
      expect(toString).not.toHaveBeenCalled()
      expect(urls).not.toHaveBeenCalled()
    }
  )

  describe('rendered completion output', () => {
    it.each<QRCodeElementType>(['canvas', 'svg', 'img', 'url'])(
      'emits once after the current %s is attached and exported',
      async (elementType) => {
        const fixture = TestBed.createComponent(QRCodeComponent)
        const component = fixture.componentInstance
        component.elementType = elementType
        component.qrdata = 'completion'
        const sequence: string[] = []
        component.qrCodeURL.subscribe(() => sequence.push('url'))
        const complete = vi.fn(() => {
          expect(component.qrcElement.nativeElement.firstElementChild?.localName).toBe(
            elementType === 'url' ? 'img' : elementType
          )
          sequence.push('rendered')
        })
        component.rendered.subscribe(complete)
        const finish = deferRenderer(elementType)
        const pending = component.ngOnChanges()
        expect(complete).not.toHaveBeenCalled()
        finish()
        await pending
        expect(complete).toHaveBeenCalledTimes(1)
        expect(sequence).toEqual(['url', 'rendered'])
        component.title = 'Only a label'
        await component.ngOnChanges({ title: new SimpleChange(undefined, component.title, false) })
        expect(complete).toHaveBeenCalledTimes(1)
      }
    )

    it.each<QRCodeElementType>(['canvas', 'svg', 'img', 'url'])(
      'suppresses stale, destroyed and failed %s completion',
      async (elementType) => {
        vi.spyOn(console, 'error').mockImplementation(() => undefined)
        const fixture = TestBed.createComponent(QRCodeComponent)
        const component = fixture.componentInstance
        component.elementType = elementType
        component.qrdata = 'old'
        const complete = vi.fn()
        component.rendered.subscribe(complete)
        const finishOld = deferRenderer(elementType)
        const old = component.ngOnChanges()
        component.qrdata = 'new'
        await component.ngOnChanges()
        expect(complete).toHaveBeenCalledTimes(1)
        finishOld()
        await old
        expect(complete).toHaveBeenCalledTimes(1)
        const finishError = deferRenderer(elementType)
        const failed = component.ngOnChanges()
        finishError(new Error('generation failed'))
        await failed
        expect(complete).toHaveBeenCalledTimes(1)
        const finishDestroyed = deferRenderer(elementType)
        const destroyed = component.ngOnChanges()
        fixture.destroy()
        finishDestroyed()
        await destroyed
        expect(complete).toHaveBeenCalledTimes(1)
      }
    )

    it('waits for the center image to be drawn', async () => {
      const fixture = TestBed.createComponent(QRCodeComponent)
      const component = fixture.componentInstance
      component.qrdata = 'logo completion'
      component.imageSrc = 'logo.png'
      const complete = vi.fn(() => expect(drawImage).toHaveBeenCalledTimes(1))
      component.rendered.subscribe(complete)
      const pending = component.ngOnChanges()
      await vi.waitFor(() => expect(images).toHaveLength(1))
      expect(complete).not.toHaveBeenCalled()
      images[0].dispatchEvent(new Event('load'))
      await pending
      expect(complete).toHaveBeenCalledTimes(1)
    })

    it.each(['load', 'draw', 'export'])(
      'does not emit completion after a canvas %s failure',
      async (failure) => {
        vi.spyOn(console, 'error').mockImplementation(() => undefined)
        const fixture = TestBed.createComponent(QRCodeComponent)
        const component = fixture.componentInstance
        component.qrdata = 'failure'
        component.imageSrc = 'logo.png'
        const complete = vi.fn()
        component.rendered.subscribe(complete)
        if (failure === 'draw')
          drawImage.mockImplementationOnce(() => {
            throw new Error('draw failed')
          })
        if (failure === 'export')
          vi.mocked(URL.createObjectURL).mockImplementationOnce(() => {
            throw new Error('export failed')
          })
        const pending = component.ngOnChanges()
        await vi.waitFor(() => expect(images).toHaveLength(1))
        images[0].dispatchEvent(new Event(failure === 'load' ? 'error' : 'load'))
        await pending
        expect(complete).not.toHaveBeenCalled()
      }
    )

    it.each<QRCodeElementType>(['img', 'url'])(
      'waits for %s decoding and suppresses superseded decode completion',
      async (elementType) => {
        const fixture = TestBed.createComponent(QRCodeComponent)
        const component = fixture.componentInstance
        component.qrdata = 'decode old'
        component.elementType = elementType
        let finishDecode: () => void = () => {
          throw new Error('Decode has not started')
        }
        decode.mockImplementationOnce(
          () =>
            new Promise<void>((resolve) => {
              finishDecode = resolve
            })
        )
        const complete = vi.fn()
        component.rendered.subscribe(complete)
        const pending = component.ngOnChanges()
        await vi.waitFor(() => expect(decode).toHaveBeenCalledTimes(1))
        expect(complete).not.toHaveBeenCalled()
        expect(component.qrcElement.nativeElement.firstElementChild).toBeNull()
        component.qrdata = 'decode new'
        await component.ngOnChanges()
        expect(complete).toHaveBeenCalledTimes(1)
        finishDecode()
        await pending
        expect(complete).toHaveBeenCalledTimes(1)
      }
    )

    it.each(['stale', 'destroyed'])('does not complete a %s canvas logo render', async (state) => {
      const fixture = TestBed.createComponent(QRCodeComponent)
      const component = fixture.componentInstance
      component.qrdata = 'old logo'
      component.imageSrc = 'logo.png'
      const complete = vi.fn()
      component.rendered.subscribe(complete)
      const pending = component.ngOnChanges()
      await vi.waitFor(() => expect(images).toHaveLength(1))
      if (state === 'destroyed') fixture.destroy()
      else {
        component.imageSrc = undefined
        component.qrdata = 'new visual'
        await component.ngOnChanges()
      }
      images[0].dispatchEvent(new Event('load'))
      await pending
      expect(complete).toHaveBeenCalledTimes(state === 'stale' ? 1 : 0)
      expect(drawImage).not.toHaveBeenCalled()
    })

    it('reports an image decode failure without successful completion', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => undefined)
      decode.mockRejectedValueOnce(new Error('decode failed'))
      const fixture = TestBed.createComponent(QRCodeComponent)
      const component = fixture.componentInstance
      component.qrdata = 'decode error'
      component.elementType = 'img'
      const complete = vi.fn()
      const errors = vi.fn()
      component.rendered.subscribe(complete)
      component.qrCodeError.subscribe(errors)
      await component.ngOnChanges()
      expect(complete).not.toHaveBeenCalled()
      expect(errors).toHaveBeenCalledTimes(1)
      expect(component.qrcElement.nativeElement.firstElementChild).toBeNull()
    })

    it('does not complete when the URL subscriber destroys the component', async () => {
      const fixture = TestBed.createComponent(QRCodeComponent)
      const component = fixture.componentInstance
      component.qrdata = 'reentrant destruction'
      component.elementType = 'svg'
      const complete = vi.fn()
      component.rendered.subscribe(complete)
      component.qrCodeURL.subscribe(() => fixture.destroy())
      await component.ngOnChanges()
      expect(complete).not.toHaveBeenCalled()
    })
  })

  it.each([
    'qrdata',
    'colorDark',
    'colorLight',
    'errorCorrectionLevel',
    'margin',
    'scale',
    'version',
    'width',
    'elementType',
    'imageSrc',
    'imageWidth',
    'imageHeight',
    'allowEmptyString',
  ])('regenerates for a %s change', async (key) => {
    const fixture = TestBed.createComponent(QRCodeComponent)
    const component = fixture.componentInstance
    component.qrdata = 'generation'
    await component.ngOnChanges({ [key]: new SimpleChange(undefined, 'changed', false) })
    expect(toCanvas).toHaveBeenCalledTimes(1)
  })

  it('updates the wrapper class through Angular without regenerating', async () => {
    const fixture = TestBed.createComponent(QRCodeComponent)
    fixture.componentRef.setInput('qrdata', 'class test')
    fixture.detectChanges()
    await fixture.whenStable()
    vi.mocked(toCanvas).mockClear()
    fixture.componentRef.setInput('cssClass', 'custom class')
    fixture.detectChanges()
    await fixture.whenStable()
    expect([...fixture.componentInstance.qrcElement.nativeElement.classList].sort()).toEqual([
      'class',
      'custom',
    ])
    expect(toCanvas).not.toHaveBeenCalled()
  })

  it.each<QRCodeElementType>(['canvas', 'img', 'url', 'svg'])(
    'preserves pending and superseded %s renders during accessibility updates',
    async (elementType) => {
      const fixture = TestBed.createComponent(QRCodeComponent)
      const component = fixture.componentInstance
      component.elementType = elementType
      component.qrdata = 'old'
      const finishOld = deferRenderer(elementType)
      const old = component.ngOnChanges()
      component.qrdata = 'winning'
      const finishNew = deferRenderer(elementType)
      const winning = component.ngOnChanges({ qrdata: new SimpleChange('old', 'winning', false) })
      component.ariaLabel = 'Current name'
      await component.ngOnChanges({ ariaLabel: new SimpleChange(undefined, 'Current name', false) })
      finishNew()
      await winning
      const element = component.qrcElement.nativeElement.firstElementChild
      expect(element?.getAttribute('aria-label')).toBe('Current name')
      finishOld()
      await old
      expect(component.qrcElement.nativeElement.firstElementChild).toBe(element)
      expect(
        vi.mocked(toCanvas).mock.calls.length +
          vi.mocked(toDataURL).mock.calls.length +
          vi.mocked(toString).mock.calls.length
      ).toBe(2)
    }
  )

  it('uses the latest accessibility while a canvas logo is loading', async () => {
    const fixture = TestBed.createComponent(QRCodeComponent)
    const component = fixture.componentInstance
    component.qrdata = 'pending logo'
    component.imageSrc = 'logo.png'
    const pending = component.ngOnChanges()
    await vi.waitFor(() => expect(images).toHaveLength(1))
    component.title = 'Latest title'
    await component.ngOnChanges({ title: new SimpleChange(undefined, 'Latest title', false) })
    images[0].dispatchEvent(new Event('load'))
    await pending
    expect(toCanvas).toHaveBeenCalledTimes(1)
    expect(component.qrcElement.nativeElement.firstElementChild?.getAttribute('title')).toBe(
      'Latest title'
    )
  })

  it.each([undefined, '', 'Scan for details', '<script>alert("title")</script>&"'])(
    'uses safe native SVG title text: %s',
    async (title) => {
      const fixture = TestBed.createComponent(QRCodeComponent)
      const component = fixture.componentInstance
      component.qrdata = 'accessible'
      component.elementType = 'svg'
      component.title = title
      component.alt = 'Image only'
      await component.ngOnChanges()
      const svg: SVGSVGElement = fixture.nativeElement.querySelector('svg')
      expect(svg.getAttribute('role')).toBe('img')
      expect(svg.hasAttribute('alt')).toBe(false)
      expect(svg.hasAttribute('aria-label')).toBe(false)
      expect(svg.querySelector('script')).toBeNull()
      expect(svg.querySelector('title')?.textContent).toBe(title || undefined)
      if (title) {
        expect(svg.firstElementChild?.namespaceURI).toBe('http://www.w3.org/2000/svg')
      }
      component.ariaLabel = 'Explicit accessible name'
      await component.ngOnChanges()
      const updated: SVGSVGElement = fixture.nativeElement.querySelector('svg')
      expect(updated.getAttribute('aria-label')).toBe('Explicit accessible name')
      expect(updated.querySelector('title')?.textContent).toBe(title || undefined)
    }
  )

  it.each([
    { input: 41, expected: 40, warning: '[angularx-qrcode] max value for `version` is 40' },
    { input: -1, expected: 1, warning: '[angularx-qrcode]`min value for `version` is 1' },
    { input: 0, expected: 1, warning: '[angularx-qrcode]`min value for `version` is 1' },
    {
      input: NaN,
      expected: undefined,
      warning: '[angularx-qrcode] version should be a number, defaulting to auto.',
    },
    {
      input: 'invalid',
      expected: undefined,
      warning: '[angularx-qrcode] version should be a number, defaulting to auto.',
    },
    ...[null, false, true, '', '   ', {}, [], Symbol('invalid')].map((input) => ({
      input,
      expected: undefined,
      warning: '[angularx-qrcode] version should be a number, defaulting to auto.',
    })),
    { input: '5', expected: '5', warning: undefined },
    { input: '41', expected: 40, warning: '[angularx-qrcode] max value for `version` is 40' },
    { input: '-1', expected: 1, warning: '[angularx-qrcode]`min value for `version` is 1' },
    { input: undefined, expected: undefined, warning: undefined },
    { input: 7, expected: 7, warning: undefined },
  ])('normalizes version $input without mutating it', async ({ input, expected, warning }) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const fixture = TestBed.createComponent(QRCodeComponent)
    fixture.componentRef.setInput('version', input)
    fixture.componentRef.setInput('qrdata', 'version')
    fixture.detectChanges()
    await fixture.componentInstance.ngOnChanges()

    expect(fixture.componentInstance.version).toBe(input)
    expect(vi.mocked(toCanvas).mock.calls.at(-1)?.[2]).toMatchObject({ version: expected })
    if (warning) {
      expect(warn).toHaveBeenCalledWith(warning)
    } else {
      expect(warn).not.toHaveBeenCalled()
    }
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

  it('exports a canvas without a logo immediately after QR generation', async () => {
    const fixture = TestBed.createComponent(QRCodeComponent)
    fixture.componentRef.setInput('qrdata', 'plain')
    const emit = vi.spyOn(fixture.componentInstance.qrCodeURL, 'emit')
    fixture.detectChanges()
    await vi.waitFor(() => expect(emit).toHaveBeenCalledOnce())
    expect(images).toHaveLength(0)
    expect(drawImage).not.toHaveBeenCalled()
  })

  it('draws the logo before displaying and exporting the canvas', async () => {
    const fixture = TestBed.createComponent(QRCodeComponent)
    fixture.componentRef.setInput('qrdata', 'logo')
    fixture.componentRef.setInput('imageSrc', '/logo.png')
    const emit = vi.spyOn(fixture.componentInstance.qrCodeURL, 'emit')
    fixture.detectChanges()
    await vi.waitFor(() => expect(images).toHaveLength(1))
    expect(emit).not.toHaveBeenCalled()
    expect(fixture.nativeElement.querySelector('canvas')).toBeNull()
    expect(images[0].crossOrigin).toBe('anonymous')

    images[0].dispatchEvent(new Event('load'))
    await vi.waitFor(() => expect(emit).toHaveBeenCalledOnce())
    expect(drawImage).toHaveBeenCalledWith(images[0], 130, 55, 40, 40)
    expect(drawImage.mock.invocationCallOrder[0]).toBeLessThan(
      vi.mocked(HTMLCanvasElement.prototype.toDataURL).mock.invocationCallOrder[0]
    )
    expect(fixture.nativeElement.querySelector('canvas')).not.toBeNull()
  })

  it('does not replace or export a newer canvas after a stale logo loads', async () => {
    const fixture = TestBed.createComponent(QRCodeComponent)
    fixture.componentRef.setInput('qrdata', 'old')
    fixture.componentRef.setInput('imageSrc', '/logo.png')
    const emit = vi.spyOn(fixture.componentInstance.qrCodeURL, 'emit')
    fixture.detectChanges()
    await vi.waitFor(() => expect(images).toHaveLength(1))
    fixture.componentRef.setInput('qrdata', 'new')
    fixture.componentRef.setInput('imageSrc', undefined)
    fixture.detectChanges()
    await vi.waitFor(() => expect(emit).toHaveBeenCalledOnce())
    images[0].dispatchEvent(new Event('load'))
    await Promise.resolve()
    await Promise.resolve()
    expect(emit).toHaveBeenCalledOnce()
    expect(drawImage).not.toHaveBeenCalled()
    expect(fixture.nativeElement.querySelector('canvas')?.getAttribute('data-qr')).toBe('new')
  })

  it('settles logo-load failures and preserves the previous render and URL', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const fixture = TestBed.createComponent(QRCodeComponent)
    fixture.componentRef.setInput('qrdata', 'previous')
    const emit = vi.spyOn(fixture.componentInstance.qrCodeURL, 'emit')
    fixture.detectChanges()
    await vi.waitFor(() => expect(emit).toHaveBeenCalledOnce())
    fixture.componentInstance.imageSrc = '/missing.png'
    fixture.componentInstance.qrdata = 'failed'
    const rendering = fixture.componentInstance.ngOnChanges()
    await vi.waitFor(() => expect(images).toHaveLength(1))
    images[0].dispatchEvent(new Event('error'))
    await rendering
    expect(error).toHaveBeenCalledWith('[angularx-qrcode] canvas error:', expect.any(Error))
    expect(emit).toHaveBeenCalledOnce()
    expect(URL.revokeObjectURL).not.toHaveBeenCalled()
    expect(fixture.nativeElement.querySelector('canvas')?.getAttribute('data-qr')).toBe('previous')
    expect(images[0].onload).toBeNull()
    expect(images[0].onerror).toBeNull()
  })

  it('settles draw failures without exporting an incomplete canvas', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    drawImage.mockImplementationOnce(() => {
      throw new Error('draw failed')
    })
    const fixture = TestBed.createComponent(QRCodeComponent)
    fixture.componentRef.setInput('qrdata', 'logo')
    fixture.componentRef.setInput('imageSrc', '/logo.png')
    const emit = vi.spyOn(fixture.componentInstance.qrCodeURL, 'emit')
    const errors = vi.fn()
    fixture.componentInstance.qrCodeError.subscribe(errors)
    fixture.detectChanges()
    await vi.waitFor(() => expect(images).toHaveLength(1))
    images[0].dispatchEvent(new Event('load'))
    await vi.waitFor(() => expect(error).toHaveBeenCalled())
    expect(errors).toHaveBeenCalledExactlyOnceWith({
      code: 'render-failure',
      elementType: 'canvas',
      error: expect.any(Error),
    })
    expect(emit).not.toHaveBeenCalled()
    expect(fixture.nativeElement.querySelector('canvas')).toBeNull()
  })

  it('does not export a logo canvas when its drawing context is unavailable', async () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const fixture = TestBed.createComponent(QRCodeComponent)
    fixture.componentRef.setInput('qrdata', 'logo')
    fixture.componentRef.setInput('imageSrc', '/logo.png')
    const emit = vi.spyOn(fixture.componentInstance.qrCodeURL, 'emit')
    const errors = vi.fn()
    fixture.componentInstance.qrCodeError.subscribe(errors)
    fixture.detectChanges()
    await vi.waitFor(() => expect(error).toHaveBeenCalled())
    expect(errors).toHaveBeenCalledExactlyOnceWith({
      code: 'render-failure',
      elementType: 'canvas',
      error: expect.any(Error),
    })
    expect(emit).not.toHaveBeenCalled()
    expect(fixture.nativeElement.querySelector('canvas')).toBeNull()
  })

  it('ignores a logo load after the component is destroyed', async () => {
    const fixture = TestBed.createComponent(QRCodeComponent)
    fixture.componentRef.setInput('qrdata', 'destroyed')
    fixture.componentRef.setInput('imageSrc', '/logo.png')
    const emit = vi.spyOn(fixture.componentInstance.qrCodeURL, 'emit')
    fixture.detectChanges()
    await vi.waitFor(() => expect(images).toHaveLength(1))
    fixture.destroy()
    images[0].dispatchEvent(new Event('load'))
    await Promise.resolve()
    expect(drawImage).not.toHaveBeenCalled()
    expect(emit).not.toHaveBeenCalled()
  })

  describe('public qrCodeError output', () => {
    const renderers: QRCodeElementType[] = ['canvas', 'svg', 'img', 'url']

    it.each(['', 'null', null, undefined, 42])('reports invalid input %s', async (input) => {
      vi.spyOn(console, 'error').mockImplementation(() => undefined)
      const fixture = TestBed.createComponent(QRCodeComponent)
      const errors = vi.fn()
      fixture.componentInstance.qrCodeError.subscribe(errors)
      fixture.componentRef.setInput('qrdata', input)
      fixture.detectChanges()
      await fixture.whenStable()
      expect(errors).toHaveBeenCalledExactlyOnceWith({
        code: 'invalid-input',
        elementType: 'canvas',
        error: expect.any(Error),
      })
      expect(toCanvas).not.toHaveBeenCalled()
    })

    it.each(renderers)('reports a current %s failure', async (elementType) => {
      const log = vi.spyOn(console, 'error').mockImplementation(() => undefined)
      const finish = deferRenderer(elementType)
      const fixture = TestBed.createComponent(QRCodeComponent)
      const errors = vi.fn()
      fixture.componentInstance.qrCodeError.subscribe(errors)
      fixture.componentRef.setInput('qrdata', 'failure')
      fixture.componentRef.setInput('elementType', elementType)
      fixture.detectChanges()
      const error = new Error('generation failed')
      finish(error)
      await vi.waitFor(() => expect(errors).toHaveBeenCalledOnce())
      expect(errors).toHaveBeenCalledExactlyOnceWith({ code: 'render-failure', elementType, error })
      expect(log).toHaveBeenCalledOnce()
      expect(fixture.nativeElement.querySelector('canvas, svg, img')).toBeNull()
    })

    it.each(renderers)('does not report successful %s rendering', async (elementType) => {
      const fixture = TestBed.createComponent(QRCodeComponent)
      const errors = vi.fn()
      const urls = vi.fn()
      fixture.componentInstance.qrCodeError.subscribe(errors)
      fixture.componentInstance.qrCodeURL.subscribe(urls)
      fixture.componentRef.setInput('qrdata', 'success')
      fixture.componentRef.setInput('elementType', elementType)
      fixture.detectChanges()
      await vi.waitFor(() => expect(urls).toHaveBeenCalledOnce())
      expect(errors).not.toHaveBeenCalled()
    })

    it.each(renderers)(
      'ignores stale %s failures and keeps the newer render and URL',
      async (elementType) => {
        const log = vi.spyOn(console, 'error').mockImplementation(() => undefined)
        const finish = deferRenderer(elementType)
        const fixture = TestBed.createComponent(QRCodeComponent)
        const errors = vi.fn()
        const urls = vi.fn()
        fixture.componentInstance.qrCodeError.subscribe(errors)
        fixture.componentInstance.qrCodeURL.subscribe(urls)
        fixture.componentRef.setInput('qrdata', 'old')
        fixture.componentRef.setInput('elementType', elementType)
        fixture.detectChanges()
        fixture.componentRef.setInput('qrdata', 'new')
        fixture.detectChanges()
        await vi.waitFor(() => expect(urls).toHaveBeenCalledOnce())
        const current = fixture.nativeElement.querySelector('canvas, svg, img')
        finish(new Error('stale failure'))
        await new Promise((resolve) => setTimeout(resolve, 0))
        expect(fixture.nativeElement.querySelector('canvas, svg, img')).toBe(current)
        expect(errors).not.toHaveBeenCalled()
        expect(log).not.toHaveBeenCalled()
        expect(urls).toHaveBeenCalledOnce()
        expect(URL.revokeObjectURL).not.toHaveBeenCalled()
      }
    )

    it.each(renderers)('ignores a %s failure after destruction', async (elementType) => {
      const log = vi.spyOn(console, 'error').mockImplementation(() => undefined)
      const finish = deferRenderer(elementType)
      const fixture = TestBed.createComponent(QRCodeComponent)
      const errors = vi.fn()
      fixture.componentInstance.qrCodeError.subscribe(errors)
      fixture.componentRef.setInput('qrdata', 'destroyed')
      fixture.componentRef.setInput('elementType', elementType)
      fixture.detectChanges()
      fixture.destroy()
      finish(new Error('destroyed failure'))
      await new Promise((resolve) => setTimeout(resolve, 0))
      expect(errors).not.toHaveBeenCalled()
      expect(log).not.toHaveBeenCalled()
    })

    it.each(['current', 'stale', 'destroyed'])('handles a %s logo failure', async (state) => {
      const log = vi.spyOn(console, 'error').mockImplementation(() => undefined)
      const fixture = TestBed.createComponent(QRCodeComponent)
      const errors = vi.fn()
      const urls = vi.fn()
      fixture.componentInstance.qrCodeError.subscribe(errors)
      fixture.componentInstance.qrCodeURL.subscribe(urls)
      fixture.componentRef.setInput('qrdata', 'previous')
      fixture.detectChanges()
      await vi.waitFor(() => expect(urls).toHaveBeenCalledOnce())
      const previous = fixture.nativeElement.querySelector('canvas')
      fixture.componentRef.setInput('qrdata', 'logo')
      fixture.componentRef.setInput('imageSrc', '/missing.png')
      fixture.detectChanges()
      await vi.waitFor(() => expect(images).toHaveLength(1))
      if (state === 'stale') {
        fixture.componentRef.setInput('qrdata', 'new')
        fixture.componentRef.setInput('imageSrc', undefined)
        fixture.detectChanges()
        await vi.waitFor(() => expect(urls).toHaveBeenCalledTimes(2))
      } else if (state === 'destroyed') {
        fixture.destroy()
      }
      images[0].dispatchEvent(new Event('error'))
      await new Promise((resolve) => setTimeout(resolve, 0))
      if (state === 'current') {
        expect(errors).toHaveBeenCalledExactlyOnceWith({
          code: 'render-failure',
          elementType: 'canvas',
          error: expect.any(Error),
        })
        expect(fixture.nativeElement.querySelector('canvas')).toBe(previous)
        expect(URL.revokeObjectURL).not.toHaveBeenCalled()
      } else {
        expect(errors).not.toHaveBeenCalled()
        expect(log).not.toHaveBeenCalled()
      }
      expect(urls).toHaveBeenCalledTimes(state === 'stale' ? 2 : 1)
    })
  })
})
