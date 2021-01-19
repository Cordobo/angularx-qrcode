import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  ViewChild,
} from '@angular/core';
import * as QRCode from 'qrcode';
import {
  QRCodeErrorCorrectionLevel,
  QRCodeVersion,
  QRCodeElementType,
} from './types';

@Component({
  selector: 'qrcode',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div #qrcElement [class]="cssClass"></div>`,
})
export class QRCodeComponent implements OnChanges {
  // Deprecated
  @Input() public colordark = '';
  @Input() public colorlight = '';
  @Input() public level = '';
  @Input() public hidetitle = false;
  @Input() public size = 0;
  @Input() public usesvg = false;

  // Valid for 1.x and 2.x
  @Input() public allowEmptyString = false;
  @Input() public qrdata = '';

  // New fields introduced in 2.0.0
  @Input() public colorDark = '#000000ff';
  @Input() public colorLight = '#ffffffff';
  @Input() public cssClass = 'qrcode';
  @Input() public elementType: keyof typeof QRCodeElementType = 'canvas';
  @Input()
  public errorCorrectionLevel: keyof typeof QRCodeErrorCorrectionLevel = 'M';
  @Input() public margin = 4;
  @Input() public scale = 4;
  @Input() public version: QRCodeVersion | undefined;
  @Input() public width = 10;

  @ViewChild('qrcElement', { static: true }) public qrcElement: ElementRef;

  constructor(private renderer: Renderer2) {
    // Deprecation warnings
    if (this.colordark !== '') {
      console.warn('[angularx-qrcode] colordark is deprecated, use colorDark.');
    }
    if (this.colorlight !== '') {
      console.warn(
        '[angularx-qrcode] colorlight is deprecated, use colorLight.'
      );
    }
    if (this.level !== '') {
      console.warn(
        '[angularx-qrcode] level is deprecated, use errorCorrectionLevel.'
      );
    }
    if (this.hidetitle !== false) {
      console.warn('[angularx-qrcode] hidetitle is deprecated.');
    }
    if (this.size !== 0) {
      console.warn(
        '[angularx-qrcode] size is deprecated, use `width`. Defaults to 10.'
      );
    }
    if (this.usesvg !== false) {
      console.warn(
        `[angularx-qrcode] usesvg is deprecated, use [elementType]="'svg'".`
      );
    }
  }

  public ngOnChanges(): void {
    this.createQRCode();
  }

  protected isValidQrCodeText(data: string | null): boolean {
    if (this.allowEmptyString === false) {
      return !(
        typeof data === 'undefined' ||
        data === '' ||
        data === 'null' ||
        data === null
      );
    }
    return !(typeof data === 'undefined');
  }

  private toDataURL(): Promise<any> {
    return new Promise(
      (resolve: (arg: any) => any, reject: (arg: any) => any) => {
        QRCode.toDataURL(
          this.qrdata,
          {
            color: {
              dark: this.colorDark,
              light: this.colorLight,
            },
            errorCorrectionLevel: this.errorCorrectionLevel,
            margin: this.margin,
            scale: this.scale,
            version: this.version,
            width: this.width,
          },
          (err, url) => {
            if (err) {
              reject(err);
            } else {
              resolve(url);
            }
          }
        );
      }
    );
  }

  private toCanvas(canvas: Element): Promise<any> {
    return new Promise(
      (resolve: (arg: any) => any, reject: (arg: any) => any) => {
        QRCode.toCanvas(
          canvas,
          this.qrdata,
          {
            color: {
              dark: this.colorDark,
              light: this.colorLight,
            },
            errorCorrectionLevel: this.errorCorrectionLevel,
            margin: this.margin,
            scale: this.scale,
            version: this.version,
            width: this.width,
          },
          (error) => {
            if (error) {
              reject(error);
            } else {
              resolve('success');
            }
          }
        );
      }
    );
  }

  private toSVG(): Promise<any> {
    return new Promise(
      (resolve: (arg: any) => any, reject: (arg: any) => any) => {
        QRCode.toString(
          this.qrdata,
          {
            color: {
              dark: this.colorDark,
              light: this.colorLight,
            },
            errorCorrectionLevel: this.errorCorrectionLevel,
            margin: this.margin,
            scale: this.scale,
            type: 'svg',
            version: this.version,
            width: this.width,
          },
          (err, url) => {
            if (err) {
              reject(err);
            } else {
              resolve(url);
            }
          }
        );
      }
    );
  }

  private renderElement(element: Element): void {
    for (const node of this.qrcElement.nativeElement.childNodes) {
      this.renderer.removeChild(this.qrcElement.nativeElement, node);
    }
    this.renderer.appendChild(this.qrcElement.nativeElement, element);
  }

  private createQRCode(): void {
    // Set sensitive defaults
    if (this.version && this.version > 40) {
      console.warn('[angularx-qrcode] max value for `version` is 40');
      this.version = 40;
    } else if (this.version && this.version < 1) {
      console.warn('[angularx-qrcode]`min value for `version` is 1');
      this.version = 1;
    } else if (this.version !== undefined && isNaN(this.version)) {
      console.warn(
        '[angularx-qrcode] version should be a number, defaulting to auto.'
      );
      this.version = undefined;
    }

    try {
      if (!this.isValidQrCodeText(this.qrdata)) {
        throw new Error(
          '[angularx-qrcode] Field `qrdata` is empty, set`allowEmptyString="true"` to overwrite this behaviour.'
        );
      }

      let element: Element;

      switch (this.elementType) {
        case 'canvas':
          element = this.renderer.createElement('canvas');
          this.toCanvas(element)
            .then(() => {
              this.renderElement(element);
            })
            .catch((e) => {
              console.error('[angularx-qrcode] canvas error: ', e);
            });
          break;
        case 'svg':
          element = this.renderer.createElement('div');
          this.toSVG()
            .then((svgString: string) => {
              this.renderer.setProperty(element, 'innerHTML', svgString);
              const innerElement = element.firstChild as Element;
              this.renderer.setAttribute(
                innerElement,
                'height',
                `${this.width}`
              );
              this.renderer.setAttribute(
                innerElement,
                'width',
                `${this.width}`
              );

              this.renderElement(innerElement);
            })
            .catch((e) => {
              console.error('[angularx-qrcode] svg error: ', e);
            });
          break;
        case 'url':
        case 'img':
        default:
          element = this.renderer.createElement('img');
          this.toDataURL()
            .then((dataUrl: string) => {
              element.setAttribute('src', dataUrl);
              this.renderElement(element);
            })
            .catch((e) => {
              console.error('[angularx-qrcode] img/url error: ', e);
            });
      }
    } catch (e) {
      console.error('[angularx-qrcode] Error generating QR Code: ', e.message);
    }
  }
}
