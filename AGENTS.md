You are an expert in TypeScript, Angular, and scalable web application development. You write maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

## Output

- Generate code files only; do not paste code into chat responses.
- Keep chat responses brief and only include essential status updates.

## GENERAL

- Never use Zsh-History-Expansion
- Always fix underlying root causes. Do not bypass feature guardrails or silence warnings/errors by changing response semantics unless explicitly requested.
- Always resolve the root cause of issues. Do not repeat approaches that have already failed, and do not bypass feature guardrails or silence warnings/errors by changing response semantics unless explicitly requested.
- At the end of each task, all changes and fixes are reviewed by another AI agent (for example: Claude, Google Gemini, or OpenAI Codex).
- Change the AGENTS.md and README.md to reflect architectural changes.

## Architecture Notes

- QR rendering must be latest-input-wins: asynchronous QR generation results from older input versions must not overwrite newer renders.
- Never mutate incoming component inputs while rendering. Derive normalized local values instead.
- `qrCodeURL` blob/object URLs must be lifecycle-managed: revoke previous URLs before emitting a new one and on component destroy.
- Keep strict typing in render helpers and error handling; avoid fallback utility aliases such as `FixMeLater`.

- Canvas logo rendering completes before the canvas is displayed or exported. Logo load/draw failures retain the previous render and URL and report a canvas error; stale or destroyed renders cannot export.
- The demo bootstraps a router shell and lazy-loads the generator at the existing root URL. Preserve query parameters and the 500 kB initial bundle budget.
- Development previews use `sirv-cli` on localhost with SPA fallback. The obsolete lite-server/Axios chain and its Socket patches must not be restored.
- Dependency updates must retain script-disabled installation and the minimum release age; keep Angular framework and compiler versions aligned.

- `qrCodeError` exposes `QRCodeGenerationError` for current input/renderer/logo/export failures. Stale and destroyed renders must suppress public errors and error logging consistently across all renderers.
- SSR defers QR generation and validation on non-browser platforms, rendering only the host placeholder. `npm run test:ssr` must execute actual Angular server rendering for all renderers; hydration is not claimed. Keep the server framework dependency aligned and development-only.
- The CI library build synchronizes the root README into the package. Published README links must use absolute repository URLs or valid same-document anchors; verify with `npm run check:docs` after building.
- Curated releases use `.github/RELEASE_TEMPLATE.md` and `docs/releases/README.md`, keeping consumer security changes distinct from repository hardening.

- SVG rendering explicitly selects the SVG renderer. SVG accessibility uses native title text nodes and role="img"; an explicit ariaLabel takes precedence over the native title. Never interpolate accessibility inputs into SVG markup.

- Accessibility and wrapper-class changes update DOM without QR generation or URL churn. They do not invalidate pending renders; apply current accessibility inputs at visual commit, including after logo loading.

- `rendered` emits once after a current final visual is attached and URL export succeeds, including canvas logo drawing and img/url decoding. Suppress completion for failures, superseded/destroyed renders, SSR, and presentation-only updates. Recheck currency after public URL emission.

- The demo binds cssClass to the QR component input. QR wrapper styles live in global styles.css, scoped under .qrcodeImage > qrcode; generated CSS examples use the same selectors and host layout to cross Angular style encapsulation without disabling it.
