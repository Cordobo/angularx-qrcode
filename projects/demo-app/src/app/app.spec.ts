import { provideRouter, Router } from '@angular/router'
import { TestBed } from '@angular/core/testing'
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
