# TODO

- [ ] **Custom finder and module styling ([#181](https://github.com/Cordobo/angularx-qrcode/issues/181)):**
  Evaluate adopting or implementing a renderer that supports separate finder colors
  and shapes, rounded modules, and configurable module merging. The installed
  `qrcode@1.5.4` does not support these capabilities; see the
  [renderer investigation](docs/implementation/renderer-styling.md). Expose strongly
  typed inputs only when the renderer can honor them, support output types and
  exports consistently where technically possible, and add tests and consumer
  documentation for the supported behavior and any output-specific limitations.
