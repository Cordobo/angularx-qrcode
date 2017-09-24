/// <reference path="angularx-qrcode.component.d.ts" />

import {
  Component,
  Input,
  ElementRef,
  OnChanges,
  OnInit,
  SimpleChange,
  ChangeDetectionStrategy
} from '@angular/core';

import * as QRCode from 'qrcodejs2';

@Component({
  selector: 'qrcode',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ''
})
export class QRCodeComponent implements OnChanges, OnInit {

  @Input() public qrdata: string = '';
  @Input() public size: number = 256;
  @Input() public level: string = 'M';
  @Input() public colordark: string = '#000000';
  @Input() public colorlight: string = '#ffffff';
  @Input() public usesvg: boolean = false;

  private qrcode: any;

  constructor(
    private el: ElementRef
  ) { }

  public ngOnInit() {
    try {
      if ( !this.isValidQrCodeText(this.qrdata) ) {
        throw new Error('Empty QR Code data');
      }
      this.qrcode = new QRCode( this.el.nativeElement, {
        colorDark: this.colordark,
        colorLight: this.colorlight,
        correctLevel: QRCode.CorrectLevel[this.level.toString()],
        height: this.size,
        text: this.qrdata,
        useSVG: this.usesvg,
        width: this.size,
      });
    } catch ( e ) {
      console.error('Error generating QR Code: ' + e.message);
    }
  }

  public ngOnChanges( changes: {[propertyName: string]: SimpleChange} ) {
    if ( !this.qrcode ) {
      return;
    }
    const qrData = changes['qrdata'];
    if ( qrData && this.isValidQrCodeText(qrData.currentValue) ) {
      this.qrcode.clear();
      this.qrcode.makeCode(qrData.currentValue);
    }
  }

  protected isValidQrCodeText( data: string ) {
    return !( typeof data === 'undefined' || data === '' );
  }

}
