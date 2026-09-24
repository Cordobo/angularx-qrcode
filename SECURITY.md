# Security policy

## Versions and security fixes

Current maintenance and security-fix work focuses on `angularx-qrcode` 22.x for Angular 22. Use the latest available patch in that line. Historical Angular/package compatibility in the [README](README.md#compatibility-and-maintenance) does not mean that every older line receives security updates.

Older release lines receive attention on a best-effort basis. Security backports are considered case by case and are not guaranteed; upgrading to the current line may be necessary to receive a fix. There is no formal LTS commitment, guaranteed support period, or response SLA.

## Report a vulnerability privately

Email the maintainer, Andreas Jacob, at [andreas@cordobo.de](mailto:andreas@cordobo.de) with a subject such as `angularx-qrcode security report`. This is the maintainer contact listed in the package metadata. Do not open a public issue or pull request containing sensitive vulnerability details as the first reporting step.

Include, where available:

- Affected package version, Angular version, runtime, and relevant configuration.
- A description of the vulnerability, its impact, and the conditions required to exploit it.
- Minimal reproduction steps or a proof of concept, with secrets and personal data removed.
- Any suggested mitigation or fix, and your preferred contact and credit information.

The maintainer will review reports as availability allows. No acknowledgement or resolution deadline is guaranteed. Coordinate privately on verification, remediation, and public disclosure so users have an opportunity to update. If you have a disclosure timeline, include it in your report; do not assume a fixed embargo or agreed publication date without a response.

## Build and dependency hardening

For repository installation and workflow controls, see [npm supply-chain hardening](docs/security/npm-supply-chain-hardening.md) and [GitHub Actions cache-poisoning guidance](docs/security/github-actions-cache-poisoning.md). Those documents describe development and release practices; they do not replace this vulnerability-reporting policy or guarantee that dependencies are vulnerability-free.
