# GitHub Actions Cache Poisoning

GitHub Actions caches are useful for faster CI runs, but restored cache contents are not automatically trustworthy.

Guidelines:

- Untrusted PR workflows must not receive secrets, publish permissions, or OIDC rights.
- Do not use `pull_request_target` to checkout and execute untrusted PR code.
- Release, publish, and deploy workflows should not restore caches.
- If caches are used, keep them in unprivileged CI jobs.
- Avoid broad `restore-keys`.
- Do not cache `node_modules`, `dist`, `build`, `.angular/cache`, `.nx/cache`, or other executable/build-relevant artifacts in sensitive workflows.
- Pin third-party GitHub Actions to full commit SHAs where possible.
- Set `GITHUB_TOKEN` permissions minimally per workflow or job.
- Prefer npm installs with `npm ci --ignore-scripts`.
- Do not run `npm install` on production servers with access to secrets.

Current repository note: existing workflow cache usage is intentionally not removed automatically. Review any cache used in release, publish, or deploy workflows before relying on it for sensitive jobs.

Run the read-only workflow cache check with:

```sh
npm run security:cache
```
