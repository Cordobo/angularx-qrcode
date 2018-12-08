# angularx-qrcode
`angularx-qrcode` is an Ionic 3 and Angular4-7.1 QR Code component/module library to generate QR Codes (Quick Response) in your Ionic and Angular 4/5/6/7+ app with support for AOT. It is a drop-in replacement for the no-longer-maintained angular2 component `ng2-qrcode` and based on qrcodejs.

## Demo App

An Angular app with a working implementation of angularx-qrcode is available on 
[github.com/Cordobo/angularx-qrcode-sample-app](https://github.com/Cordobo/angularx-qrcode-sample-app).

## Installation 1.5.0
    # Angular 5/6/6.1/7/7.1 and Ionic
    npm install angularx-qrcode --save
    # Or use yarn
    yarn add angularx-qrcode

## Older Versions

    # Angular 7.1
    npm install angularx-qrcode@1.4.0 --save

    # Angular 7
    npm install angularx-qrcode@1.3.0 --save

    # Angular 6/6.1
    npm install angularx-qrcode@1.2.4 --save

    # Angular 5
    npm install angularx-qrcode@1.1.7 --save

    # Angular 4
    npm install angularx-qrcode@1.0.3 --save

## Basic Usage

### Import the module and add it to your imports section in your main AppModule:

```
// File: app.module.ts
// all your imports
import { QRCodeModule } from 'angularx-qrcode';

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

## Examples: How to implement angularx-qrcode

### Generate a QR Code from a string (directive only)

Now that Angular/Ionic knows about the new QR Code module,
let's invoke it from our template with a directive.
If we use a simple text-string, we need no additional
code in our controller.

```
<qrcode [qrdata]="'Your QR code data string'" [size]="256" [level]="'M'"></qrcode>
```

### Create a QR Code from a variable in your controller

In addition to our `<qrcode>`-directive in `example.html`,
lets add two lines of code to our controller `example.ts`.

```
// File: example.ts
export class QRCodeComponent {
  public myAngularxQrCode: string = null;
  constructor () {
    // assign a value
    this.myAngularxQrCode = 'Your QR code data string';
  }
}

// File: example.html
<qrcode [qrdata]="myAngularxQrCode" [size]="256" [level]="'M'"></qrcode>
```

## Parameters

| Attribute        | Type           | Default | Description  |
| ------------- |-------------| -----|------------|
| allowEmptyString      | Boolean | false     | Allow empty string |
| colorlight      | String | '#ffffff'     | Light color |
| colordark      | String | '#000000'     | Dark Color |
| level | String | 'M'    | QR Correction level ('L', 'M', 'Q', 'H') |
| qrdata      | String | '' | String to encode |
| size      | Number | 256     | Height/Width (any value) |
| usesvg      | Boolean | false     | SVG Output |

## AOT - Ahead Of Time Compilation
`angularx-qrcode` supports AOT Compilation (Ahead-of-Time Compilation) which results in significant faster rendering. An AOT-enabled module is included. Further reading: https://angular.io/guide/aot-compiler


## SSR - Server Side Rendering

See: [HowTo use Angular QRCode with SSR](https://github.com/Cordobo/angularx-qrcode/issues/5)


## Available commands

    # Build
    npm run build

    # Watch
    npm run watch

## Note
Depending on the size (amount of data) of the *qrdata* to encode, a minimum *size* is required.

## Credits
Based on no-longer-maintained angular2 component https://github.com/PragmaticClub/ng2-qrcode

## License
MIT License

Copyright (c) 2018 - present [Andreas Jacob (Cordobo.com)](http://cordobo.com/)