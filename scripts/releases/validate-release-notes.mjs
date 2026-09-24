import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const sections = [
  'User-visible changes',
  'Angular/framework compatibility',
  'Migration requirements',
  'Bug fixes',
  'Consumer-impacting security changes',
  'Repository/build/release hardening',
  'Dependency/tooling-only changes',
  'Upgrade guidance',
  'Full comparison / changelog',
]

function validateDraft(markdown) {
  assert.doesNotMatch(markdown, /\{\{[^}]+\}\}/, 'Replace all template placeholders')
  const headings = [...markdown.matchAll(/^## (.+)$/gm)]
  for (const section of sections) {
    const matching = headings.filter((heading) => heading[1] === section)
    assert.equal(matching.length, 1, `Expected exactly one section: ${section}`)
    const heading = matching[0]
    const next = headings.find((candidate) => candidate.index > heading.index)
    const body = markdown.slice(heading.index + heading[0].length, next?.index).trim()
    assert.ok(body.replace(/<!--[\s\S]*?-->/g, '').trim(), `Empty section: ${section}`)
  }
  const comparison = markdown.slice(markdown.indexOf('## Full comparison / changelog'))
  assert.match(
    comparison,
    /\[Full comparison\]\(https:\/\/github\.com\/Cordobo\/angularx-qrcode\/compare\/[^\s/()]+\.\.\.[^\s/()]+\)/,
    'Expected a repository comparison link with two tags'
  )
}

const template = readFileSync(new URL('../../.github/RELEASE_TEMPLATE.md', import.meta.url), 'utf8')
const common = {
  CONSUMER_SECURITY: 'No consumer-impacting security changes identified in this hypothetical case.',
  HARDENING: 'Repository publication checks changed; no runtime vulnerability fix is implied.',
  TOOLING: 'Development-only tooling updated; application runtime behavior is unchanged by it.',
}
const scenarios = [
  {
    name: 'Hypothetical Angular-major release',
    values: {
      ...common,
      VERSION: '99.0.0',
      USER_CHANGES: 'This hypothetical major requires the matching Angular major.',
      COMPATIBILITY: 'Hypothetical peer range: Angular >=99.0.0 <100.0.0.',
      MIGRATION: 'Upgrade the consuming Angular application to Angular 99 before installing.',
      BUG_FIXES: 'None in this hypothetical case.',
      UPGRADE: 'After the framework upgrade, install angularx-qrcode@99.0.0 and test QR flows.',
      PREVIOUS_TAG: 'v98.0.1',
      RELEASE_TAG: 'v99.0.0',
    },
  },
  {
    name: 'Hypothetical patch-only release',
    values: {
      ...common,
      VERSION: '98.0.2',
      USER_CHANGES: 'Corrects a rendering defect without an API change in this hypothetical case.',
      COMPATIBILITY: 'Unchanged hypothetical peer range: Angular >=98.0.0 <99.0.0.',
      MIGRATION: 'None; no consuming code or configuration changes are required.',
      BUG_FIXES: 'A hypothetical asynchronous rendering failure preserves the previous output.',
      UPGRADE: 'Install angularx-qrcode@98.0.2 in the Angular 98 application and retest QR flows.',
      PREVIOUS_TAG: 'v98.0.1',
      RELEASE_TAG: 'v98.0.2',
    },
  },
]

for (const scenario of scenarios) {
  const draft = template.replace(/\{\{([A-Z_]+)\}\}/g, (_, key) => {
    assert.ok(Object.hasOwn(scenario.values, key), `Unknown template placeholder: ${key}`)
    return scenario.values[key]
  })
  validateDraft(draft)
  for (const section of sections) {
    assert.throws(() => validateDraft(draft.replace(`## ${section}`, `## Missing ${section}`)))
  }
  assert.throws(() => validateDraft(draft.replace(scenario.values.MIGRATION, '')))
  assert.throws(() => validateDraft(`${draft}\n{{UNRESOLVED}}`))
  assert.throws(() => validateDraft(draft.replace('[Full comparison]', '[Missing comparison]')))
  console.log(`PASS: ${scenario.name} and invalid-structure checks (in memory only)`)
}

if (process.argv[2]) {
  validateDraft(readFileSync(process.argv[2], 'utf8'))
  console.log(`PASS: release draft ${process.argv[2]}`)
}
