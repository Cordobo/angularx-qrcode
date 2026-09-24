import { provideRouter, Router } from '@angular/router'
import { TestBed } from '@angular/core/testing'
import { QRCodeComponent } from '../../../angularx-qrcode/src/public-api'
import { By } from '@angular/platform-browser'
import { Generator } from './generator'
import { App } from './app'
import { routes } from './app.routes'

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents()
  })

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App)
    expect(fixture.componentInstance).toBeTruthy()
  })

  it('includes SVG accessibility in the generated example', async () => {
    const fixture = TestBed.createComponent(App)
    fixture.detectChanges()
    await TestBed.inject(Router).navigateByUrl('/?elementType=svg&showImage=false')
    await fixture.whenStable()
    const generator = fixture.debugElement.query(By.directive(Generator)).injector.get(Generator)
    expect(generator.strBuilder()).toContain('[ariaLabel]')
    expect(generator.strBuilder()).toContain('[title]')
    expect(generator.strBuilder()).not.toContain('[alt]')
  })

  it('reports an unavailable render when download is requested too early', async () => {
    const fixture = TestBed.createComponent(App)
    fixture.detectChanges()
    await TestBed.inject(Router).navigateByUrl('/?elementType=svg&showImage=false')
    await fixture.whenStable()
    const generator = fixture.debugElement.query(By.directive(Generator)).injector.get(Generator)
    const qr = fixture.debugElement
      .query(By.directive(QRCodeComponent))
      .injector.get(QRCodeComponent)
    generator.elementType = 'canvas'
    expect(() => generator.saveAsImage(qr)).toThrow('has not rendered yet')
    generator.elementType = 'img'
    expect(() => generator.saveAsImage(qr)).toThrow('has not rendered yet')
  })

  it.each(['left', 'center', 'right', 'demoBorder', 'demoBorderRadius'])(
    'preserves the render while applying wrapper class %s and accessibility edits',
    async (cssClass) => {
      const fixture = TestBed.createComponent(App)
      const router = TestBed.inject(Router)
      fixture.detectChanges()
      await router.navigateByUrl(
        '/?elementType=svg&showImage=true&imageSrc=custom.png&imageWidth=33&imageHeight=44'
      )
      await fixture.whenStable()
      const generator = fixture.debugElement.query(By.directive(Generator)).injector.get(Generator)
      const element: SVGSVGElement = fixture.nativeElement.querySelector('qrcode svg')
      expect(element).not.toBeNull()
      const url = generator.qrCodeSrc
      await router.navigate([], {
        queryParams: { ariaLabel: 'Updated label', cssClass },
        queryParamsHandling: 'merge',
      })
      await fixture.whenStable()
      expect(generator.elementType).toBe('svg')
      expect(generator.imageSrc).toBe('custom.png')
      expect(generator.imageWidth).toBe(33)
      expect(generator.imageHeight).toBe(44)
      expect(fixture.nativeElement.querySelector('qrcode svg')).toBe(element)
      expect(element.getAttribute('aria-label')).toBe('Updated label')
      expect(element.parentElement?.classList.contains(cssClass)).toBe(true)
      const qr = fixture.debugElement
        .query(By.directive(QRCodeComponent))
        .injector.get(QRCodeComponent)
      expect(qr.cssClass).toBe(cssClass)
      expect(generator.strBuilder()).toContain(`[cssClass]="'${cssClass}'"`)
      expect(generator.renderSampleCssCode).toContain('global styles.css')
      expect(generator.renderSampleCssCode).toContain(`.qrcodeImage > qrcode > .${cssClass}`)
      expect(generator.qrCodeSrc).toBe(url)
    }
  )

  it('should load the generator at the existing URL and preserve shared parameters', async () => {
    const fixture = TestBed.createComponent(App)
    const router = TestBed.inject(Router)
    fixture.detectChanges()
    await router.navigateByUrl('/?qrdata=shared-code&showImage=false')
    await fixture.whenStable()
    fixture.detectChanges()
    const compiled = fixture.nativeElement as HTMLElement
    expect(compiled.querySelector('h1')?.textContent).toContain('Angular QR Code Generator')
    expect(compiled.querySelector<HTMLInputElement>('input[name="qrdata"]')?.value).toBe(
      'shared-code'
    )
    expect(router.url).toBe('/?qrdata=shared-code&showImage=false')
  })
})
