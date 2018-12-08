import { NgModule } from '@angular/core';
import { QRCodeComponent } from './components';

@NgModule({
  providers: [],
  declarations: [
    QRCodeComponent,
  ],
  exports: [
    QRCodeComponent,
  ]
})
export class QRCodeModule {
}
