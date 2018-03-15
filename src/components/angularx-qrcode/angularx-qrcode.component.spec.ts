import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QRCodeComponent } from './angularx-qrcode.component';

describe('QRCodeComponent', () => {
    let component: QRCodeComponent;
    let fixture: ComponentFixture<QRCodeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [QRCodeComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(QRCodeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
