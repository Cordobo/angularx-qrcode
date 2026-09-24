# npm Supply-Chain Hardening

These controls apply to this repository’s development, build, and release process. Consumers do not inherit this repository’s `.npmrc` by installing the library.

This repository uses npm settings that reduce exposure to install-time payloads and very new package versions:

- `ignore-scripts=true` disables dependency lifecycle scripts during installs.
- `save-exact=true` records exact dependency versions when saving packages.
- `min-release-age=7` asks npm to avoid package versions published less than seven days ago. This requires an npm version that supports `min-release-age`; npm `11.12.1` recognizes the setting.

Dependency installation in CI and Docker build contexts should use:

```sh
npm ci --ignore-scripts
```

Operational guidance:

- Do not run `npm install` on production servers that have access to secrets.
- Builds should not receive production secrets in their environment.
- GitHub Actions must not use `pull_request_target` together with checkout and execution of untrusted pull request code.
- Release workflows should be manually protected or guarded by Environment Approval.
- Pin third-party GitHub Actions to commit SHAs where possible.

Run the read-only IOC check with:

```sh
npm run security:ioc
```

## Reviewed toolchain and release gates

CI, npm publication, and the demo build install npm **11.12.1** explicitly with scripts disabled; Node comes from `.nvmrc`. Workflows print both versions. The npm version is updated through a reviewed workflow change, not `npm@latest`.

[npm 11.12.1’s configuration source](https://github.com/npm/cli/blob/v11.12.1/workspaces/config/lib/definitions/definitions.js) defines `min-release-age` in days. This is a dependency-resolution safeguard, not a malware scanner or a guarantee that every locked dependency is safe. `save-exact` affects newly saved dependencies; it does not rewrite existing version ranges.

Pull requests and pushes to `main` run `npm test -- --watch=false` before the production library build. The publish job runs the same tests and build before publishing; a failure stops subsequent steps. Workflow actions are pinned to full commit SHAs.

npm 11.12.1 also meets [npm’s trusted-publishing requirement](https://docs.npmjs.com/trusted-publishers/) of npm 11.5.1 or later. The publication job requests OIDC permission and names the `prod` environment. Required environment approvals and npm trusted-publisher settings are external configuration, not guarantees made by these files. Trusted publishing can generate provenance automatically; verify provenance for the specific published version on npm. This guide does not assert that all historical releases have attestations.

## Dependency remediation and patch policy

The unmaintained `lite-server` development server has been replaced with `sirv-cli`. This removes its BrowserSync/localtunnel dependency chain, including the legacy Axios version previously covered by a vendored Socket patch. The obsolete Axios patch files, applicator, and workflow steps have been removed together. There are currently no Socket patches to apply.

Dependency updates must preserve `ignore-scripts` and the release-age safeguard. Keep Angular framework packages and the compiler on matching releases, and verify a clean `npm ci --ignore-scripts`, `npm audit`, tests, and production builds after updating the lockfile. Do not use forced incompatible overrides or disable npm's protections to make an audit pass.

If a future dependency needs a temporary patch, explicitly review its scope, integrity checks, application step, and removal condition. Do not restore lifecycle hooks that script-disabled installs cannot guarantee will execute.
