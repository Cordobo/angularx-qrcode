# angularx-qrcode
An Angular4+ QRCode generator Component library for Generating QR Codes (Quick Response) based on qrcodejs 


## Install

    npm install angularx-qrcode

## Basic Usage

### Include the module and declare it (mostly your app.module.ts file)

```
// all your imports
import { QRCodeModule } from 'angularx-qrcode'

@NgModule({
declarations: [
    AppComponent
],
imports: [
    QRCodeModule
],
providers: [],
bootstrap: [AppComponent]
})
export class AppModule { }
```