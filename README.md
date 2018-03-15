# angularx-qrcode
`angularx-qrcode` is a Ionic 3 and Angular4+ QR Code component/module library to generate QR Codes (Quick Response) in your Ionic and Angular 4+ app with support for AOT. It is a drop-in replacement for the no-longer-maintained angular2 component `ng2-qrcode` and based on qrcodejs.

## AOT - Ahead Of Time Compilation
`angularx-qrcode` supports AOT Compilation (Ahead-of-Time Compilation) which results in significant faster rendering. For further information see https://angular.io/guide/aot-compiler

## Installation

### NPM (Angular, Ionic)

    npm install angularx-qrcode --save

### Yarn

    yarn add angularx-qrcode


## Basic Usage

### Import the module and add it to your imports section in your main AppModule (file: app.module.ts)

```
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

## Examples

### Generate a QR Code from a string (directive only)

Now that Angular/Ionic knows about our QR Code module,
we can invoke it from our template with a directive.
If we use a simple text-string, we need no additional
code in our controller.

```
<qrcode [qrdata]="'Your QR code data string'" [size]="256" [level]="'M'"></qrcode>
```

### Create a QR Code from a variable in your controller

In addition to our `<qrcode>`-directive in `example.html`,
we add two lines of code to our controller `example.ts`.

```
// example.ts:
export class QRCodeComponent {
    public angularxQrCode: string = '';
    // assign a value anywhere in/below your constructor
    this.myAngularxQrCode = 'Your QR code data string';
}

// example.html:
<qrcode [qrdata]="myAngularxQrCode" [size]="256" [level]="'M'"></qrcode>
```

## Parameters

| Attribute        | Type           | Default | Description  |
| ------------- |-------------| -----|------------|
| allowEmptyString      | Boolean | false     | Allow empty string |
| colorlight      | String | '#ffffff'     | Dark color |
| colordark      | String | '#000000'     | Light Color |
| level | String | 'M'    | QR Correction level ('L', 'M', 'Q', 'H') |
| qrdata      | String | '' | String to encode |
| size      | Number | 256     | Height / Width (any value) |
| usesvg      | Boolean | false     | SVG Output |

## Note
Depending on the size (amoutn of data) of the *qrdata* to encode, a minimum *size* might be required.

## License
MIT License

## Credits
Based on no-longer-maintained angular2 component https://github.com/PragmaticClub/ng2-qrcode
