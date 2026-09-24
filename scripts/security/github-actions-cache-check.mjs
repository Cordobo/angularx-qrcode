import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { parseDocument } from 'yaml'

const object = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)
const list = (value) => (value === undefined ? [] : Array.isArray(value) ? value : [value])
const writes = (permissions) =>
  permissions === 'write-all' ||
  (object(permissions) &&
    Object.values(permissions).some((value) => value === 'write' || String(value).includes('${{')))

// This is a conservative static guard for repository workflows, not a full Actions evaluator.
export function checkWorkflow(source) {
  const document = parseDocument(source, { uniqueKeys: true })
  if (document.errors.length)
    return document.errors.map((error) => `Invalid YAML: ${error.message}`)
  const workflow = document.toJS({ maxAliasCount: 100 })
  if (!object(workflow) || !object(workflow.jobs)) return ['Workflow must define jobs']
  const findings = []
  const jobs = Object.entries(workflow.jobs)
  const triggers = object(workflow.on) ? Object.keys(workflow.on) : list(workflow.on)
  const target = triggers.includes('pull_request_target')
  const release = triggers.includes('release')
  const sensitive = new Set()
  const cached = new Set()
  for (const [id, job] of jobs) {
    const warn = (message) => findings.push(`${id}: ${message}`)
    if (!object(job)) {
      warn('Job must be a mapping')
      continue
    }
    const permissions = job.permissions ?? workflow.permissions
    if (permissions === undefined)
      warn('Declare explicit token permissions; repository defaults may grant write access')
    if (permissions === 'write-all') warn('Replace write-all with minimum named permissions')
    const serialized = JSON.stringify({ ...job, workflowEnv: workflow.env })
    const privileged = writes(permissions)
    const hasSecrets = /secrets\s*(?:\.|\[)|"secrets":"inherit"/.test(serialized)
    const publishing = /npm\s+publish|actions\/deploy-pages@/.test(serialized)
    if (privileged || hasSecrets || publishing || release || job.environment) sensitive.add(id)
    if (triggers.includes('pull_request') && (privileged || hasSecrets)) {
      warn('Untrusted PR jobs must not receive write permissions, OIDC, or secrets')
    }
    if (target && /pull_request(?:\.|\\?"|\[).*head/.test(serialized)) {
      warn('pull_request_target references untrusted PR head code')
    }
    for (const step of job.steps ?? []) {
      const action = String(step.uses ?? '')
        .toLowerCase()
        .split('@')[0]
      const inputs = step.with ?? {}
      if (action === 'actions/setup-node') {
        const explicit = inputs.cache !== undefined && inputs.cache !== '' && inputs.cache !== false
        // Require an explicit opt-out: packageManager metadata may enable caching later.
        const implicit =
          inputs['package-manager-cache'] !== false && inputs['package-manager-cache'] !== 'false'
        if (explicit || implicit) cached.add(id)
        if (implicit && !explicit)
          warn('setup-node must explicitly configure caching or set package-manager-cache: false')
      }
      if (action === 'actions/cache' || action.startsWith('actions/cache/')) {
        cached.add(id)
        if (inputs['restore-keys']) warn('Broad cache restore-keys are prohibited')
        const key = String(inputs.key ?? '')
        if (!/runner\.os/.test(key) || !/hashFiles\([^)]*(?:lock|shrinkwrap)/.test(key)) {
          warn('Cache key must include runner.os and a dependency lockfile hash')
        }
        const paths = String(inputs.path ?? '')
        if (
          !paths ||
          /(?:node_modules|\bdist\b|\bbuild\b|\.angular|\.nx|\.turbo|\.next)/.test(paths)
        ) {
          warn('Cache paths must exclude executable dependencies and build output')
        }
      }
    }
  }
  // Build ancestors can poison artifacts consumed by a privileged deployment job.
  let changed = true
  while (changed) {
    changed = false
    for (const [id, job] of jobs) {
      if (!sensitive.has(id)) continue
      for (const dependency of list(job.needs)) {
        if (!sensitive.has(dependency)) {
          sensitive.add(dependency)
          changed = true
        }
      }
    }
  }
  for (const id of cached) {
    if (sensitive.has(id) || target)
      findings.push(`${id}: Cache is used in a privileged/release job or its build dependency`)
  }
  return findings
}

export function checkDirectory(directory) {
  if (!existsSync(directory)) return []
  return readdirSync(directory)
    .filter((file) => /\.ya?ml$/.test(file))
    .sort()
    .flatMap((file) => {
      try {
        return checkWorkflow(readFileSync(resolve(directory, file), 'utf8')).map(
          (finding) => `${file}: ${finding}`
        )
      } catch (error) {
        return [`${file}: Unable to inspect workflow: ${error.message}`]
      }
    })
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const findings = checkDirectory(process.argv[2] ?? '.github/workflows')
  for (const finding of findings) console.error(`WARN ${finding}`)
  if (!findings.length) console.log('No obvious GitHub Actions cache poisoning risks found.')
  process.exitCode = findings.length ? 1 : 0
}
