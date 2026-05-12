# npm Supply-Chain Hardening

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
