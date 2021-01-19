import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'angularx-qrcode-demo-app';

  public qrdata: string = null;
  public elementType: 'img' | 'url' | 'canvas' | 'svg' = null;
  public level: 'L' | 'M' | 'Q' | 'H';
  public scale: number;
  public width: number;

  constructor() {
    this.elementType = 'img';
    this.level = 'M';
    this.qrdata = 'Initial QR code data string';
    this.scale = 1;
    this.width = 256;
  }

  changeElementType(newValue: 'img' | 'url' | 'canvas' | 'svg'): void {
    this.elementType = newValue;
  }

  changeLevel(newValue: 'L' | 'M' | 'Q' | 'H'): void {
    this.level = newValue;
  }

  changeQrdata(newValue: string): void {
    this.qrdata = newValue;
  }

  changeScale(newValue: number): void {
    this.scale = newValue;
  }

  changeWidth(newValue: number): void {
    this.width = newValue;
  }
}
