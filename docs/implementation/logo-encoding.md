# Center-logo encoding investigation

Inspected qrcode 1.5.4 `core/qrcode.js`, `reed-solomon-encoder.js`,
`bit-matrix.js`, `mask-pattern.js`, and canvas renderer geometry before implementation.

`createData` writes segment mode/count/data, a zero terminator and alignment bits,
then alternating EC/11 pad bytes. `createCodewords` divides this fixed stream into
RS blocks, derives parity, and interleaves data then parity. `setupData` places
bits in a reserved-aware zigzag; masking occurs afterward and format information
records the selected mask. Neither parity nor standard padding is free input.
With fixed segments the free RS basis has dimension zero. Gaussian elimination
cannot manufacture freedom. Alternative segmentations are discrete possible
encodings, not independently free RS bits; this implementation retains upstream
segmentation and version selection.

[Russ Cox's QArt](https://research.swtch.com/qart) obtains controllable bits from
additional numeric payload after a URL fragment. That changes the decoded string
and is not authorized by `qrdata`. Full QArt would need a separately designed,
explicit API accepting mutable payload positions/allowed values and exposing the
actual resulting decoded payload. It cannot promise arbitrary unchanged strings.

Implementation decision: use public `create` with each of the eight masks, score
with upstream N1–N4, and prefer more light target modules **only among minimum
penalty candidates**. This conservative fallback preserves normal mask-quality
selection (including its limitations), never worsens target satisfaction relative
to upstream's first minimum, and often leaves the normal matrix unchanged. It is
not full QArt. No increased version, changed ECC, changed segments, arbitrary pad
bytes, or post-encoding edits are used. A larger target does not create freedom.

The interception point is the public encoder's mask option, before rendering.
An isolated adapter owns version-specific internal penalty/geometry/RS-table
access. The mapping is read-only and centralized in the encoder layer; it mirrors
upstream placement because upstream does not expose that mapping. Canvas renders
with the original options plus selected mask through the unchanged upstream renderer, then loads
and draws the logo before URL emission. Upstream's whole-canvas initialization is
not a logo knockout. No logo-region clearing is added.

Target bounds round outward to module boundaries using actual upstream scale,
margin and floored canvas size. Bounds are clipped to the symbol (quiet zone is
never targeted); reserved and remainder modules are excluded from eligible bits.
Statistics distinguish requested, reserved, remainder, eligible, satisfied and
remaining dark modules. Padding affects preference only, not image dimensions.
