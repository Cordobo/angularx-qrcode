import { ElementRef, OnChanges, Renderer2 } from '@angular/core';
import { QRCodeErrorCorrectionLevel, QRCodeVersion, QRCodeElementType } from './types';
import * as i0 from "@angular/core";
export declare class QRCodeComponent implements OnChanges {
    private renderer;
    allowEmptyString: boolean;
    colorDark: string;
    colorLight: string;
    cssClass: string;
    elementType: keyof typeof QRCodeElementType;
    errorCorrectionLevel: keyof typeof QRCodeErrorCorrectionLevel;
    margin: number;
    qrdata: string;
    scale: number;
    version: QRCodeVersion | undefined;
    width: number;
    qrcElement: ElementRef;
    constructor(renderer: Renderer2);
    ngOnChanges(): void;
    protected isValidQrCodeText(data: string | null): boolean;
    private toDataURL;
    private toCanvas;
    private toSVG;
    private renderElement;
    private createQRCode;
    static ɵfac: i0.ɵɵFactoryDeclaration<QRCodeComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<QRCodeComponent, "qrcode", never, { "allowEmptyString": "allowEmptyString"; "colorDark": "colorDark"; "colorLight": "colorLight"; "cssClass": "cssClass"; "elementType": "elementType"; "errorCorrectionLevel": "errorCorrectionLevel"; "margin": "margin"; "qrdata": "qrdata"; "scale": "scale"; "version": "version"; "width": "width"; }, {}, never, never>;
}
