import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChange,
  AfterViewInit,
  Inject,
  PLATFORM_ID
} from '@angular/core';

declare var require: any;
let QRCode: any;

import { isPlatformServer } from '@angular/common';

@Component({
  selector: 'qrcode',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ''
})

export class QRCodeComponent implements OnChanges, AfterViewInit {

  /** @internal */
  @Input() public allowEmptyString: boolean = false;
  @Input() public colordark: string = '#000000';
  @Input() public colorlight: string = '#ffffff';
  @Input() public level: string = 'M';
  @Input() public hidetitle: boolean = false;
  @Input() public qrdata: string = '';
  @Input() public size: number = 256;
  @Input() public usesvg: boolean = false;

  public qrcode: any;

  constructor(
    public el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) { }

  public ngAfterViewInit() {
    if (isPlatformServer(this.platformId)) {
      return;
    } else {
      if (!QRCode) {
        QRCode = require('qrcodejs2');
      }
      try {
        if (!this.isValidQrCodeText(this.qrdata)) {
          throw new Error('Empty QR Code data');
        }

        this.qrcode = new QRCode(this.el.nativeElement, {
          colorDark: this.colordark,
          colorLight: this.colorlight,
          correctLevel: QRCode.CorrectLevel[this.level.toString()],
          height: this.size,
          text: this.qrdata || ' ',
          useSVG: this.usesvg,
          width: this.size,
        });
      } catch (e) {
        console.error('Error generating QR Code: ' + e.message);
      }
    }
  }

  public ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    if (!this.qrcode) {
      return;
    }

    const qrData = changes['qrdata'];

    if (qrData && this.isValidQrCodeText(qrData.currentValue)) {
      this.qrcode.clear();
      this.qrcode.makeCode(qrData.currentValue);
    }
  }

  protected isValidQrCodeText = (data: string): boolean => {
    if (this.allowEmptyString === false) {
      return !(typeof data === 'undefined' || data === '');
    }
    return !(typeof data === 'undefined');
  }

}
