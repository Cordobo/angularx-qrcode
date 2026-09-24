# Curated release notes

Start each GitHub release draft from the [release template](../../.github/RELEASE_TEMPLATE.md). This applies to both major and patch releases. Generated GitHub commit lists can supplement the curated notes, but do not replace them. Do not rewrite historical releases as part of adopting this process.

1. Copy the template to a temporary Markdown file and replace every `{{PLACEHOLDER}}`. Keep all sections; use an explicit “None” or “Unchanged” with relevant context when a section does not apply.
2. Review the changes between the previous published tag and the intended release tag. Describe observable behavior and affected consumers, with links to the relevant changes. Do not infer runtime impact solely from a dependency name or commit title.
3. Complete the prompts below, validate the draft, and review it alongside the package manifests and release diff before pasting it into the GitHub release body. Publishing still follows the existing release workflow; this document does not change publication permissions or gates.

| Section                             | Required editorial review                                                                                                                                                                                                                                                                                                                     |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| User-visible changes                | What can consumers do differently? Describe affected API or behavior, including breaking changes.                                                                                                                                                                                                                                             |
| Angular/framework compatibility     | State the release's Angular peer range and any framework compatibility changes. Distinguish this release from historical package lines. For a patch, state that compatibility is unchanged only after checking the manifest diff.                                                                                                             |
| Migration requirements              | List required code/configuration changes, with before/after guidance or migration links. For an Angular major, include the framework upgrade prerequisite. State explicitly if none are required.                                                                                                                                             |
| Bug fixes                           | Describe corrected behavior, the triggering conditions, and consumer impact; link fixes where available.                                                                                                                                                                                                                                      |
| Consumer-impacting security changes | Describe verified security impact in the published package/runtime, affected versions, and upgrade action. Use public advisory links when available; do not disclose embargoed reports. Say “No consumer-impacting security changes identified in this release” when appropriate; this is not a claim that the package is vulnerability-free. |
| Repository/build/release hardening  | Describe CI, installation, signing/provenance, or publication-process changes. State their scope; consumers do not inherit repository installation settings. Do not present these changes as fixes for runtime vulnerabilities.                                                                                                               |
| Dependency/tooling-only changes     | Group changes without a primary consumer-facing effect here. A runtime dependency security fix belongs under consumer security, and a behavioral change belongs under user-visible changes or bug fixes, even if implemented through a dependency update.                                                                                     |
| Upgrade guidance                    | Give the intended target version, installation command, framework prerequisites, relevant migration links, and recommended application checks. Do not imply an SLA or LTS guarantee.                                                                                                                                                          |
| Full comparison / changelog         | Replace both tags with actual published/source release tags and verify that the comparison opens and contains the expected changes. Include generated commit notes below it if useful.                                                                                                                                                        |

## Validation

From the repository root, run:

```sh
node scripts/releases/validate-release-notes.mjs
node scripts/releases/validate-release-notes.mjs /path/to/release-draft.md
```

The first command checks the reusable template and renders two hypothetical cases **in memory only**: an Angular-major release and a patch-only release. Neither fixture is a real release, published announcement, or claim about planned work. It also verifies that incomplete sections, unresolved placeholders, missing comparison links, and merged security/hardening sections are rejected.

The optional draft argument checks the same required sections, nonempty content, placeholder removal, and repository comparison URL shape. These checks validate structure, not factual accuracy or remote tag existence. Maintainers must still review the actual release diff, package compatibility, advisory scope, upgrade command, and both comparison tags before publication.

For security policy and release controls, reuse the [security policy](../../SECURITY.md) and [supply-chain hardening guide](../security/npm-supply-chain-hardening.md), including its version-specific provenance verification instructions.
