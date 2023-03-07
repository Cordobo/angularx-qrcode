import { Provider } from "@angular/core"

export enum QRCodeImageFeatureKind {
  SRC,
  WIDTH,
  HEIGHT,
}

declare interface QRCodeImageFeature<KindT extends QRCodeImageFeatureKind> {
  kind: KindT
  provider: Provider
}

export declare type QRCodeImageSrcFeature =
  QRCodeImageFeature<QRCodeImageFeatureKind.SRC>
export declare type QRCodeImageWidthFeature =
  QRCodeImageFeature<QRCodeImageFeatureKind.WIDTH>
export declare type QRCodeImageHeightFeature =
  QRCodeImageFeature<QRCodeImageFeatureKind.HEIGHT>

export declare type QRCodeImageFeatures =
  | QRCodeImageSrcFeature
  | QRCodeImageWidthFeature
  | QRCodeImageHeightFeature
