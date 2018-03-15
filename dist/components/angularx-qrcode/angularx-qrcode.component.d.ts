/// <reference path="../../../src/components/angularx-qrcode/qrcodejs2.d.ts" />
import { ElementRef, OnChanges, OnInit, SimpleChange } from '@angular/core';
export declare class QRCodeComponent implements OnChanges, OnInit {
    el: ElementRef;
    colordark: string;
    colorlight: string;
    level: string;
    hidetitle: boolean;
    qrdata: string;
    size: number;
    usesvg: boolean;
    qrcode: any;
    constructor(el: ElementRef);
    ngOnInit(): void;
    ngOnChanges: (changes: {
        [propertyName: string]: SimpleChange;
    }) => void;
    protected isValidQrCodeText: (data: string) => boolean;
}
