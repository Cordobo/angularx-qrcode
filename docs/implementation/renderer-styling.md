# Finder and module styling: issue #181

**Decision: unsupported by the installed upstream renderer (option B).**
Investigation of `qrcode@1.5.4` and `@types/qrcode@1.5.6` found no renderer
option for separate finder colors/shapes, module corner radius, or configurable
module merging. No wrapper inputs or runtime changes are added for these features.

## Evidence

The installed package version was verified from `node_modules/qrcode/package.json`;
the root and library manifests pin `qrcode` to `1.5.4`. The following versioned
upstream sources correspond to the installed implementation:

- [Renderer options and rasterization](https://github.com/soldair/node-qrcode/blob/v1.5.4/lib/renderer/utils.js):
  `getOptions` normalizes width, scale, margin, global dark/light colors, output type,
  and `rendererOpts`. `qrToImageData` maps each pixel to a binary module and chooses
  one of those two colors. It has no finder-specific branch, shape callback, or
  corner-radius calculation.
- [Canvas renderer](https://github.com/soldair/node-qrcode/blob/v1.5.4/lib/renderer/canvas.js):
  `render` uses `qrToImageData` and `putImageData`; `renderToDataURL` serializes that
  same canvas. Its only use of `rendererOpts` is image encoding quality, not geometry.
- [SVG renderer](https://github.com/soldair/node-qrcode/blob/v1.5.4/lib/renderer/svg-tag.js):
  `qrToPath` joins adjacent dark modules into horizontal runs in one foreground
  path with a single stroke color. Finder modules have no separate elements or
  selectors. This fixed path compaction is not configurable artistic merging.
- [Browser entry point](https://github.com/soldair/node-qrcode/blob/v1.5.4/lib/browser.js):
  `toCanvas` and `toDataURL` use the canvas renderer; `toString` uses SVG.
- [Encoder](https://github.com/soldair/node-qrcode/blob/v1.5.4/lib/core/qrcode.js):
  `create` produces the QR matrix and encoding metadata. Finder patterns are set
  in that matrix; encoding controls such as mask and error correction do not
  introduce styling parameters. Access to the matrix could support a newly
  implemented renderer, but is not a styling capability of the existing renderers.

The installed TypeScript declarations agree: `QRCodeRenderersOptions` exposes
margin, scale, width and global dark/light colors in addition to encoding options.
`QRCodeToDataURLOptions` adds image type/quality, not module styling. The conclusion
comes from the executable source as well as the declarations, not merely from a
missing wrapper input or documentation entry.

## Wrapper boundary

`projects/angularx-qrcode/src/lib/angularx-qrcode.component.ts` delegates `canvas`
to `toCanvas`, `svg` to `toString` with SVG selected, and both `img` and `url` to
`toDataURL`. Therefore this limitation applies to all four output types and exports.
The logo encoder chooses an upstream mask and the canvas overlay draws an image;
neither provides finder or module styling.

`colorDark`/`colorLight` set global colors. `cssClass` can style the wrapper but
cannot address individual modules in canvas pixels or an image, or distinguish
finders within the SVG foreground path. Adding CSS rounding to the outer element
does not round its modules. SVG postprocessing alone would also not provide
consistent raster output or constitute an upstream option.

Supporting the requested geometry requires implementing or adopting a renderer
with that capability. It is outside a wrapper-option change. No placeholder
options or dependency replacement are introduced by this resolution. A separate
[follow-up in TODO.md](../../TODO.md) tracks evaluating a custom or alternative
renderer; the finding for the installed renderer remains unchanged.

## Prepared issue resolution

For [#181](https://github.com/Cordobo/angularx-qrcode/issues/181), ready to post:

> Investigated the installed `qrcode@1.5.4` dependency: separate finder colors/shapes,
> rounded modules, and configurable module merging are unsupported by its renderers.
> The [raster renderer](https://github.com/soldair/node-qrcode/blob/v1.5.4/lib/renderer/utils.js)
> uses a single dark/light palette, while the
> [SVG renderer](https://github.com/soldair/node-qrcode/blob/v1.5.4/lib/renderer/svg-tag.js)
> combines all dark modules into one path. There are no styling options to forward
> from Angular for these features. This applies to canvas, SVG, img, and url outputs.
> Global colors remain supported; CSS on the wrapper cannot style individual modules.
> Resolving this request as unsupported by the current upstream renderer. Supporting
> it requires a custom or alternative renderer, rather than additional wrapper inputs.

This is a prepared response; the investigation does not post a comment or close
the GitHub issue.
