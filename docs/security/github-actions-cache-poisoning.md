# GitHub Actions Cache Poisoning

Restored cache contents are not automatically trustworthy. This repository uses fresh installs with lifecycle scripts disabled in CI, npm publishing, and the Pages build. All `setup-node` steps explicitly set `package-manager-cache: false`, which also prevents future `packageManager` metadata from silently enabling npm caching. No workflow restores a dependency or build cache.

Token permissions default to `contents: read`. Checkout does not persist credentials. npm publishing retains the `id-token: write` permission required for trusted publishing, without repository write permission. Pages grants `pages: write` and `id-token: write` only to the separate deployment job. Its build dependencies also run without caches.

## Guardrails

Run `npm run security:cache` and `npm run security:cache:test`. CI runs both after installing dependencies. The read-only checker parses YAML, checks effective permissions per job, and follows transitive `needs` dependencies of sensitive jobs. It rejects:

- Caches in privileged, secret-bearing, release, or environment jobs and their build dependencies.
- Implicit `setup-node` caching without an explicit configuration decision.
- Broad cache restore keys, keys missing OS/lockfile scoping, and dependency/build-output cache paths.
- Unspecified token permissions, `write-all`, privileged PR jobs, and PR-head references in `pull_request_target` jobs.

An unrelated read-only CI job can use an explicitly configured npm download cache. Necessary OIDC permissions without cache exposure are not cache-poisoning findings. This distinction preserves detection of risky combinations instead of reporting every permission or cache as independently unsafe.

This static checker does not evaluate Actions expressions, inspect remote/composite action implementations, prove artifact provenance, or replace review of reusable workflows and external actions. Keep actions pinned to reviewed full commit SHAs. Do not execute untrusted code in privileged workflows or install dependencies on production hosts with secrets.

## Primary references

- [setup-node caching controls and publishing guidance](https://github.com/actions/setup-node/blob/main/docs/advanced-usage.md)
- [npm trusted publishing permissions](https://docs.npmjs.com/trusted-publishers/)
- [GitHub dependency cache scope](https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching)
