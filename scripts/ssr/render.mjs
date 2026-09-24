import assert from 'node:assert/strict'
import '@angular/compiler'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { bootstrapApplication } from '@angular/platform-browser'
import { provideServerRendering, renderApplication } from '@angular/platform-server'
import { QRCodeComponent } from '../../dist/angularx-qrcode/fesm2022/angularx-qrcode.mjs'

// Real Angular server rendering in Node, without jsdom or browser-global shims.
for (const name of ['window', 'document', 'Image', 'HTMLCanvasElement', 'SVGSVGElement']) {
  assert.equal(typeof globalThis[name], 'undefined', `${name} must not be polyfilled`)
}

const errors = []
const originalError = console.error
console.error = (...args) => errors.push(args)
try {
  for (const elementType of ['canvas', 'svg', 'img', 'url']) {
    for (const qrdata of ['SSR payload — 世界', '']) {
      const events = []
      class ServerHost {
        elementType = elementType
        qrdata = qrdata
        record(event) {
          events.push(event)
        }
      }
      Component({
        selector: 'ssr-host',
        imports: [QRCodeComponent],
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: `<h1>Server application</h1><qrcode
          [elementType]="elementType" [qrdata]="qrdata" [width]="256"
          imageSrc="https://example.invalid/logo.png"
          (qrCodeURL)="record($event)" (qrCodeError)="record($event)" (rendered)="record($event)" />`,
      })(ServerHost)
      const html = await renderApplication(
        (context) =>
          bootstrapApplication(ServerHost, { providers: [provideServerRendering()] }, context),
        {
          document: '<!doctype html><html><body><ssr-host></ssr-host></body></html>',
          url: 'http://localhost/ssr',
          allowedHosts: ['localhost'],
        }
      )
      assert.match(html, /<h1>Server application<\/h1>/)
      assert.match(html, /<div[^>]*class="qrcode"[^>]*><\/div>/)
      assert.doesNotMatch(html, /<(?:canvas|svg|img)\b|blob:|data:image/)
      assert.equal(
        events.length,
        0,
        `${elementType}: server must defer outputs and validation; ${events.map((event) => event.error?.message).join('; ')}`
      )
      assert.deepEqual(errors, [], `${elementType}: server must not log render errors`)
      console.log(
        `PASS ${elementType}: ${qrdata ? 'Unicode payload' : 'empty payload'}; server placeholder, no outputs`
      )
    }
  }
} finally {
  console.error = originalError
}
console.log('SSR validation passed: 8 actual Angular server renders. Hydration is not tested.')
