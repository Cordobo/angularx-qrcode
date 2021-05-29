import { ElementRef, OnChanges, Renderer2 } from '@angular/core';
import { QRCodeErrorCorrectionLevel, QRCodeVersion, QRCodeElementType } from './types';
import * as ɵngcc0 from '@angular/core';
export declare class QRCodeComponent implements OnChanges {
    private renderer;
    colordark: string;
    colorlight: string;
    level: string;
    hidetitle: boolean;
    size: number;
    usesvg: boolean;
    allowEmptyString: boolean;
    qrdata: string;
    colorDark: string;
    colorLight: string;
    cssClass: string;
    elementType: keyof typeof QRCodeElementType;
    errorCorrectionLevel: keyof typeof QRCodeErrorCorrectionLevel;
    margin: number;
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
    static ɵfac: ɵngcc0.ɵɵFactoryDeclaration<QRCodeComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDeclaration<QRCodeComponent, "qrcode", never, { "colordark": "colordark"; "colorlight": "colorlight"; "level": "level"; "hidetitle": "hidetitle"; "size": "size"; "usesvg": "usesvg"; "allowEmptyString": "allowEmptyString"; "qrdata": "qrdata"; "colorDark": "colorDark"; "colorLight": "colorLight"; "cssClass": "cssClass"; "elementType": "elementType"; "errorCorrectionLevel": "errorCorrectionLevel"; "margin": "margin"; "scale": "scale"; "width": "width"; "version": "version"; }, {}, never, never>;
}

//# sourceMappingURL=angularx-qrcode.component.d.ts.map