import test from 'node:test'
import assert from 'node:assert/strict'
import { checkWorkflow, checkDirectory } from './github-actions-cache-check.mjs'

const workflow = (jobs, options = '') =>
  `on: push\npermissions: { contents: read }\n${options}\njobs:\n${jobs}`
const cached = `    steps:
      - uses: actions/setup-node@sha
        with: { cache: npm, package-manager-cache: false }`
const clean = `    steps:
      - uses: actions/setup-node@sha
        with: { package-manager-cache: false }`

test('repository workflows pass', () => assert.deepEqual(checkDirectory('.github/workflows'), []))
test('necessary OIDC permissions without caches pass', () => {
  assert.deepEqual(
    checkWorkflow(
      workflow(`  publish:
    permissions: { contents: read, id-token: write }
${clean}`)
    ),
    []
  )
})
test('read-only CI caching does not inherit unrelated deploy permissions', () => {
  assert.deepEqual(
    checkWorkflow(
      workflow(`  ci:
${cached}
  deploy:
    permissions: { pages: write, id-token: write }
${clean}`)
    ),
    []
  )
})
test('job permissions replace workflow permissions', () => {
  assert.deepEqual(
    checkWorkflow(`on: push
permissions: { contents: write }
jobs:
  ci:
    permissions: { contents: read }
${cached}`),
    []
  )
})
test('inherited write permissions make a cached job unsafe', () => {
  assert.match(
    checkWorkflow(`on: push
permissions: { contents: write }
jobs:
  ci:
${cached}`).join(),
    /Cache is used/
  )
})
test('cached transitive build dependencies of deploy are rejected', () => {
  assert.match(
    checkWorkflow(
      workflow(`  build:
${cached}
  package:
    needs: build
${clean}
  deploy:
    needs: [package]
    permissions: { pages: write, id-token: write }
${clean}`)
    ).join(),
    /build: Cache is used/
  )
})
test('implicit setup-node caching requires an explicit decision', () => {
  assert.match(
    checkWorkflow(
      workflow(`  build:
    steps:
      - uses: actions/setup-node@sha`)
    ).join(),
    /explicitly configure/
  )
})
test('explicit caching is still detected when automatic caching is disabled', () => {
  assert.match(
    checkWorkflow(
      workflow(`  publish:
    permissions: { id-token: write }
${cached}`)
    ).join(),
    /Cache is used/
  )
})
test('quoted mapping keys and multiline cache paths are inspected', () => {
  const results = checkWorkflow(
    workflow(`  build:
    steps:
      - uses: actions/cache/restore@sha
        with:
          'key': npm-global
          'restore-keys': npm-
          path: |
            ~/.npm
            node_modules`)
  ).join()
  assert.match(results, /restore-keys/)
  assert.match(results, /lockfile hash/)
  assert.match(results, /executable dependencies/)
})
test('lockfile-scoped npm download caches in CI pass', () => {
  assert.deepEqual(
    checkWorkflow(
      workflow(`  build:
    steps:
      - uses: actions/cache@sha
        with:
          key: \${{ runner.os }}-npm-\${{ hashFiles('package-lock.json') }}
          path: ~/.npm`)
    ),
    []
  )
})
test('comments and command text do not create fake cache or permissions fields', () => {
  assert.deepEqual(
    checkWorkflow(
      workflow(`  build:
    steps:
      # cache: npm
      - run: |
          echo 'id-token: write cache: npm'`)
    ),
    []
  )
})
test('missing explicit permissions, write-all and invalid YAML fail', () => {
  assert.match(
    checkWorkflow('on: push\njobs: { build: { steps: [] } }').join(),
    /explicit token permissions/
  )
  assert.match(
    checkWorkflow('on: push\npermissions: write-all\njobs: { build: { steps: [] } }').join(),
    /minimum named permissions/
  )
  assert.match(checkWorkflow('jobs: [').join(), /Invalid YAML/)
})
test('pull_request_target cannot check out PR head even without a cache', () => {
  assert.match(
    checkWorkflow(`on: [pull_request_target]
permissions: { contents: read }
jobs:
  test:
    steps:
      - uses: actions/checkout@sha
        with:
          ref: \${{ github.event.pull_request.head.sha }}`).join(),
    /untrusted PR head/
  )
})
test('release and secret-bearing jobs cannot restore a cache', () => {
  assert.match(
    checkWorkflow(`on: { release: { types: [created] } }
permissions: { contents: read }
jobs:
  build:
${cached}`).join(),
    /Cache is used/
  )
  assert.match(
    checkWorkflow(
      workflow(`  build:
    env: { TOKEN: '\${{ secrets.TOKEN }}' }
${cached}`)
    ).join(),
    /Cache is used/
  )
})
test('workflow-level secret environment also marks cached jobs sensitive', () => {
  assert.match(
    checkWorkflow(
      workflow(
        `  build:
${cached}`,
        "env: { TOKEN: '${{ secrets.TOKEN }}' }"
      )
    ).join(),
    /Cache is used/
  )
})
test('PR workflows cannot grant OIDC to untrusted code', () => {
  assert.match(
    checkWorkflow(`on: pull_request
permissions: { id-token: write }
jobs:
  build:
${clean}`).join(),
    /Untrusted PR jobs/
  )
})
