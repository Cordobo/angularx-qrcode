# angularx-qrcode - Angular QR Code Generator

`angularx-qrcode` - a fast and easy-to-use Ivy compatible Ionic and Angular QR Code Generator library

- [Features](#features)
- [Installation](#installation)
- [Demo App](#demo-app)
- [Usage & Example Implementations](#usage-and-example-implementations)
- [Available Parameters](#available-parameters)
- [Contribute](#contribute)
- [Sponsoring](#sponsoring)
- [License](#license)

## Features

- Compatible with **Angular** and **Ionic**
- Ivy compiler support, AOT, SSR (Server Side Rendering)
- Under active development
- Accessibility (a11y) attributes supported (alt, aria-label, title)
- Support for images
- Trusted and used by thousands of developers like you
- Easy to use, [sample web app](#demo-app) included

`angularx-qrcode` is compatible with Ionic 3/4/5/6/7/8 and Angular 4/5/6/7/8/9/10/11/12/13/14/15/16/17/18+ with support for the Ivy compiler. It is a drop-in replacement for the no-longer-maintained angular component ng2-qrcode and based on node-qrcode.

## Installation

**Angular 18 and Ionic with angularx-qrcode 18**

```
npm install angularx-qrcode --save
# Or with yarn
yarn add angularx-qrcode
```

**Angular 17 and Ionic with angularx-qrcode 17**

```
npm install angularx-qrcode@17.0.1 --save
# Or with yarn
yarn add angularx-qrcode@17.0.1
```

**Angular 16 and Ionic with angularx-qrcode 16**

```
npm install angularx-qrcode@16.0.2 --save
# Or with yarn
yarn add angularx-qrcode@16.0.2
```

**All supported angular versions**

| Angular Version | angularx-qrcode Version |
| --------------- | ----------------------- |
| ^18             | ^18.0.2                 |
| ^17             | ^17.0.1                 |
| ^16             | ^16.0.2                 |
| ^15             | ^15.0.1                 |
| ^14             | ^14.0.0                 |
| ^13             | ^13.0.15                |
| ^12             | ^12.0.3                 |
| ^11             | ^11.0.0                 |
| ^10             | ^10.0.12                |
| ^9              | ^2.3.7                  |
| ^8              | ^2.1.4                  |
| ^5 / ^6 / ^7    | ^1.6.4                  |
| ^4              | ^1.0.3                  |

# Demo App

**[Working online demo of Angular QR Code Generator](https://cordobo.github.io/angularx-qrcode/)**

The source for the working angular app is available in [`projects/demo-app`](projects/demo-app).

Run the command:

```
npm start
```

and open the url `http://localhost:4200/` in your browser

# Usage and Example Implementations

The source for **[a live angularx-qrcode demo app](https://cordobo.github.io/angularx-qrcode/)** and more examples how to implement angularx-qrcode is in the folder [`projects/demo-app`](projects/demo-app/src/app) in this repository.

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

## AOT - Ahead Of Time Compilation

`angularx-qrcode` supports AOT Compilation (Ahead-of-Time Compilation) which results in significant faster rendering. An AOT-enabled module is included. Further reading: https://angular.io/guide/aot-compiler

## SSR - Server Side Rendering

As of version 1.6.0, SSR support is fully implemented, the following workaround is no longer needed. [HowTo use Angular QRCode with SSR](https://github.com/Cordobo/angularx-qrcode/issues/5)

## Contribute

- Please open your PR against the development branch.
- Make sure your editor uses **prettier** to minimize commited code changes.
- You cannot contribute but want to support development? Consider a [sponsorship](https://github.com/sponsors/Cordobo).

## Sponsoring

Support the development of angularx-qrcode (or even see your logo here?), consider [sponsoring angularx-qrcode](https://github.com/sponsors/Cordobo). Your support is much appreciated!

## License

MIT License

Copyright (c) 2018 - present [Andreas Jacob (Cordobo.com)](http://cordobo.com/)
