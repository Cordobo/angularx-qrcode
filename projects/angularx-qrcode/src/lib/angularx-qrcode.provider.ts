import { EnvironmentProviders, makeEnvironmentProviders } from "@angular/core"
import {
  QRCodeAllowEmptyStringFeature,
  QRCodeColorDarkFeature,
  QRCodeColorLightFeature,
  QRCodeCssClassFeature,
  QRCodeElementTypeFeature,
  QRCodeErrorCorrectionLevelFeature,
  QRCodeFeatureKind,
  QRCodeFeatures,
  QRCodeImageFeature,
  QRCodeMarginFeature,
  QRCodeScaleFeature,
  QRCodeVersionFeature,
  QRCodeWidthFeature,
} from "./angularx-qrcode.feature"
import {
  QRCODE_ALLOW_EMPTY_STRING,
  QRCODE_COLOR_DARK,
  QRCODE_COLOR_LIGHT,
  QRCODE_CSS_CLASS,
  QRCODE_ELEMENT_TYPE,
  QRCODE_ERROR_CORRECTION_LEVEL,
  QRCODE_IMAGE_SRC,
  QRCODE_MARGIN,
  QRCODE_SCALE,
  QRCODE_VERSION,
  QRCODE_WIDTH,
} from "./angularx-qrcode.config"
import { QRCodeElementType } from "./types"
import { QRCodeErrorCorrectionLevel } from "qrcode"
import {
  QRCodeImageFeatureKind,
  QRCodeImageFeatures,
  QRCodeImageHeightFeature,
  QRCodeImageSrcFeature,
  QRCodeImageWidthFeature,
} from "./angularx-qrcode-image.feature"

export function provideQRCode(
  ...features: QRCodeFeatures[]
): EnvironmentProviders {
  return makeEnvironmentProviders([features.map((it) => it.providers)])
}

export function withAllowEmptyString(
  allowEmptyString: boolean
): QRCodeAllowEmptyStringFeature {
  return {
    kind: QRCodeFeatureKind.ALLOW_EMPTY_STRING,
    providers: [
      { provide: QRCODE_ALLOW_EMPTY_STRING, useValue: allowEmptyString },
    ],
  }
}

export function withColorDark(colorDark: string): QRCodeColorDarkFeature {
  return {
    kind: QRCodeFeatureKind.COLOR_DARK,
    providers: [{ provide: QRCODE_COLOR_DARK, useValue: colorDark }],
  }
}

export function withColorLight(colorLight: string): QRCodeColorLightFeature {
  return {
    kind: QRCodeFeatureKind.COLOR_LIGHT,
    providers: [{ provide: QRCODE_COLOR_LIGHT, useValue: colorLight }],
  }
}

export function withCssClass(cssClass: string): QRCodeCssClassFeature {
  return {
    kind: QRCodeFeatureKind.CSS_CLASS,
    providers: [{ provide: QRCODE_CSS_CLASS, useValue: cssClass }],
  }
}

export function withElementType(
  elementType: QRCodeElementType
): QRCodeElementTypeFeature {
  return {
    kind: QRCodeFeatureKind.ELEMENT_TYPE,
    providers: [{ provide: QRCODE_ELEMENT_TYPE, useValue: elementType }],
  }
}

export function withErrorCorrectionLevel(
  errorCorrectionLevel: QRCodeErrorCorrectionLevel
): QRCodeErrorCorrectionLevelFeature {
  return {
    kind: QRCodeFeatureKind.ERROR_CORRECTION_LEVEL,
    providers: [
      {
        provide: QRCODE_ERROR_CORRECTION_LEVEL,
        useValue: errorCorrectionLevel,
      },
    ],
  }
}

export function withMargin(margin: number): QRCodeMarginFeature {
  return {
    kind: QRCodeFeatureKind.MARGIN,
    providers: [{ provide: QRCODE_MARGIN, useValue: margin }],
  }
}

export function withScale(scale: number): QRCodeScaleFeature {
  return {
    kind: QRCodeFeatureKind.SCALE,
    providers: [{ provide: QRCODE_SCALE, useValue: scale }],
  }
}

export function withVersion(version: number): QRCodeVersionFeature {
  return {
    kind: QRCodeFeatureKind.VERSION,
    providers: [{ provide: QRCODE_VERSION, useValue: version }],
  }
}

export function withWidth(width: number): QRCodeWidthFeature {
  return {
    kind: QRCodeFeatureKind.WIDTH,
    providers: [{ provide: QRCODE_WIDTH, useValue: width }],
  }
}

export function withImage(
  ...features: QRCodeImageFeatures[]
): QRCodeImageFeature {
  return {
    kind: QRCodeFeatureKind.IMAGE,
    providers: features.map((it) => it.provider),
  }
}

export function withImageSrc(src: string): QRCodeImageSrcFeature {
  return {
    kind: QRCodeImageFeatureKind.SRC,
    provider: { provide: QRCODE_IMAGE_SRC, useValue: src },
  }
}

export function withImageWidth(width: string): QRCodeImageWidthFeature {
  return {
    kind: QRCodeImageFeatureKind.WIDTH,
    provider: { provide: QRCODE_IMAGE_SRC, useValue: width },
  }
}

export function withImageHeight(height: string): QRCodeImageHeightFeature {
  return {
    kind: QRCodeImageFeatureKind.HEIGHT,
    provider: { provide: QRCODE_IMAGE_SRC, useValue: height },
  }
}
