# angularx-qrcode - Angular QR Code Generator

`angularx-qrcode` - a fast and easy-to-use Ivy compatible Ionic and Angular QR Code Generator library

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Example Implementations](#examples)
- [Available Parameters](#available-parameters)
- [Demo](#demo)
- [Contribute](#contribute)
- [License](#license)

## Features

- Compatible with **Angular** and Ionic
- Ivy compiler support, AOT, SSR (Server Side Rendering)
- Under active development
- Accessibility (a11y) attributes supported (alt, aria-label, title)
- Support for images
- Trusted and used by thousands of developers like you

`angularx-qrcode` is compatible with Ionic 3/4/5 and Angular 4/5/6/7/8/9/10/11/12/13/14/15/16+ with support for the Ivy compiler. It is a drop-in replacement for the no-longer-maintained angular component ng2-qrcode and based on node-qrcode.

## Installation

**Angular 16 and Ionic with angularx-qrcode 16**

```
npm install angularx-qrcode --save
# Or with yarn
yarn add angularx-qrcode
```

**Angular 15 and Ionic with angularx-qrcode 15**

```
npm install angularx-qrcode@15.0.1 --save
# Or with yarn
yarn add angularx-qrcode
```

**Angular 14 and Ionic with angularx-qrcode 14**

```
npm install angularx-qrcode@14.0.0 --save
# Or with yarn
yarn add angularx-qrcode@14.0.0
```

**Angular 13 and Ionic with angularx-qrcode 13**

```
npm install angularx-qrcode@13.0.15 --save
# Or with yarn
yarn add angularx-qrcode@13.0.15
```

**Angular 12 and Ionic**

```
npm install angularx-qrcode@12.0.3 --save
# Or with yarn
yarn add angularx-qrcode@12.0.3
```

**Angular 11 and Ionic**

```
npm install angularx-qrcode@11.0.0 --save
# Or with yarn
yarn add angularx-qrcode@11.0.0
```

**Older supported angular versions**

```
# angular 10 and Ionic
npm install angularx-qrcode@10.0.12 --save
# angular 9 and Ionic
npm install angularx-qrcode@~2.3.7 --save
# angular 8 and Ionic
npm install angularx-qrcode@~2.1.4 --save
# angular 5/6/7
npm install angularx-qrcode@1.6.4 --save
# Angular 4
npm install angularx-qrcode@1.0.3 --save
```

# Usage

### Import the module and add it to your imports section in your main AppModule:

```
// File: app.module.ts
// all your other imports...
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

```
// File: app.component.html
// all your HTML...

<qrcode [qrdata]="'Your data string'" [width]="256" [errorCorrectionLevel]="'M'"></qrcode>
```

## Examples

The source for **[a live angularx-qrcode demo app](https://cordobo.github.io/angularx-qrcode/)** and more examples how to implement angularx-qrcode is in the folder [`projects/demo-app`](projects/demo-app/src/app) in this repository.

### Generate a QR Code from a string (directive only)

Now that angular/Ionic know about the new QR Code module,
let's invoke it from our template with a directive.
If we use a simple text-string, we need no additional
code in our controller.

```
<qrcode [qrdata]="'Your data string'" [width]="256" [errorCorrectionLevel]="'M'"></qrcode>
```

### Create a QR Code from a variable in your controller

In addition to our `<qrcode>`-directive in `app.component.html`,
lets add two lines of code to our controller `app.component.ts`.

```
// File: app.component.ts
export class QRCodeComponent {
  public myAngularxQrCode: string = null;
  constructor () {
    // assign a value
    this.myAngularxQrCode = 'Your QR code data string';
  }
}

// File: app.component.html
<qrcode [qrdata]="myAngularxQrCode" [width]="256" [errorCorrectionLevel]="'M'"></qrcode>
```

### Download a QR Code

The [online demo](https://cordobo.github.io/angularx-qrcode/) contains a [`working sample`](projects/demo-app) how to download the QR Code with a button.

### Getting the QR Code URL

To download the QR Code, we have to use the `qrCodeURL` attribute
of the `<qrcode>` which returns a sanitized URL representing the
location of the QR Code.

```
// File: example.ts
export class QRCodeComponent {
  public myAngularxQrCode: string = "";
  public qrCodeDownloadLink: SafeUrl = "";

  constructor () {
    this.myAngularxQrCode = 'Your QR code data string';
  }

  onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
  }
}

// File: example.html
<qrcode (qrCodeURL)="onChangeURL($event)" [qrdata]="myAngularxQrCode" [width]="256" [errorCorrectionLevel]="'M'"></qrcode>
<a [href]="qrCodeDownloadLink" download="qrcode">Download</a>
```

The file format obtained by `qrCodeURL` depends directly on the
elementType of `<qrcode>`. If it's either canvas, url or image,
it returns an image as `.png`, if it's svg, returns a `.svg` file.

## Available Parameters

| Attribute            | Type                    | Default     | Description                                                    |
| -------------------- | ----------------------- | ----------- | -------------------------------------------------------------- |
| allowEmptyString     | Boolean                 | false       | Allow qrdata to be an empty string                             |
| alt                  | String                  | null        | HTML alt attribute (supported by img, url)                     |
| ariaLabel            | String                  | null        | HTML aria-label attribute (supported by canvas, img, url)      |
| colorDark            | String                  | '#000000ff' | RGBA color, color of dark module (foreground)                  |
| colorLight           | String                  | '#ffffffff' | RGBA color, color of light module (background)                 |
| cssClass             | String                  | 'qrcode'    | CSS Class                                                      |
| elementType          | String                  | 'canvas'    | 'canvas', 'svg', 'img', 'url' (alias for 'img')                |
| errorCorrectionLevel | String                  | 'M'         | QR Correction level ('L', 'M', 'Q', 'H')                       |
| imageSrc             | String                  | null        | Link to your image                                             |
| imageHeight          | Number                  | null        | height of your image                                           |
| imageWidth           | Number                  | null        | width of your image                                            |
| margin               | Number                  | 4           | Define how much wide the quiet zone should be.                 |
| qrCodeURL            | EventEmitter\<SafeUrl\> |             | Returns the QR Code URL                                        |
| qrdata               | String                  | ''          | String to encode                                               |
| scale                | Number                  | 4           | Scale factor. A value of 1 means 1px per modules (black dots). |
| title                | String                  | null        | HTML title attribute (supported by canvas, img, url)           |
| version              | Number                  | (auto)      | 1-40                                                           |
| width                | Number                  | 10          | Height/Width (any value)                                       |

## QR Code capacity

Depending on the amount of data of the **qrdata** to encode, a minimum **width** is required.

# Demo

**[Working online demo of Angular QR Code Generator](https://cordobo.github.io/angularx-qrcode/)**

The source for the angular app is available in [`projects/demo-app`](projects/demo-app). Run the command

```
ng serve demo-app --open
```

and open the url `http://localhost:4200/` in your browser

## AOT - Ahead Of Time Compilation

`angularx-qrcode` supports AOT Compilation (Ahead-of-Time Compilation) which results in significant faster rendering. An AOT-enabled module is included. Further reading: https://angular.io/guide/aot-compiler

## SSR - Server Side Rendering

As of version 1.6.0, SSR support is fully implemented, the following workaround is no longer needed. [HowTo use Angular QRCode with SSR](https://github.com/Cordobo/angularx-qrcode/issues/5)

## Contribute

- Please open your PR against the development branch.
- Make sure your editor uses **prettier** to minimize commited code changes.

## License

MIT License

Copyright (c) 2018 - present [Andreas Jacob (Cordobo.com)](http://cordobo.com/)
