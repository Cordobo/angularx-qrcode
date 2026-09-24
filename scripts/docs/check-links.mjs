import assert from 'node:assert/strict'
import { existsSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const read = (file) => readFileSync(file, 'utf8')
const slug = (heading) =>
  heading
    .toLowerCase()
    .replace(/[^\p{L}\p{N}_\-\s]/gu, '')
    .replace(/\s/g, '-')
function checkFragment(file, fragment) {
  if (!fragment || !file.endsWith('.md')) return
  const headings = [...read(file).matchAll(/^#{1,6}\s+(.+)$/gm)].map((match) => slug(match[1]))
  assert.ok(headings.includes(decodeURIComponent(fragment)), `${file}: missing #${fragment}`)
}
function checkDocument(file, published = false) {
  const content = read(file)
  const links = [...content.matchAll(/\[[^\]]*\]\(([^\s)]+)(?:\s+['"][^)]*)?\)/g)].map(
    (match) => match[1]
  )
  for (const link of links) {
    if (link.startsWith('mailto:')) continue
    if (link.startsWith('#')) {
      checkFragment(file, link.slice(1))
      continue
    }
    if (/^https?:\/\//.test(link)) {
      const url = new URL(link)
      // Validate repository URLs against the source tree being published, including new docs.
      // This does not claim these uncommitted files already exist on GitHub main.
      const match = url.pathname.match(
        /^\/Cordobo\/angularx-qrcode\/(?:blob|tree|raw)\/main\/(.+)$/
      )
      if (url.hostname === 'github.com' && match) {
        const target = path.join(root, decodeURIComponent(match[1]))
        assert.ok(existsSync(target), `Missing repository destination: ${link}`)
        checkFragment(target, url.hash.slice(1))
      }
      continue
    }
    assert.ok(!published, `Published README has repository-relative link: ${link}`)
    const [relative, fragment] = link.split('#')
    const target = path.resolve(path.dirname(file), relative)
    assert.ok(existsSync(target), `Missing destination: ${file} -> ${link}`)
    if (statSync(target).isFile()) checkFragment(target, fragment)
  }
  console.log(
    `PASS ${path.relative(root, file)}: ${links.length} links (local targets/anchors and repository URL destinations)`
  )
}

const source = path.join(root, 'README.md')
const copied = path.join(root, 'projects/angularx-qrcode/README.md')
const built = path.join(root, 'dist/angularx-qrcode/README.md')
assert.equal(read(copied), read(source), 'Source package README must match root README')
assert.equal(read(built), read(source), 'Build the library to refresh the published README')
checkDocument(source, true)
checkDocument(built, true)
for (const file of [
  'SECURITY.md',
  'docs/production-use.md',
  'docs/releases/README.md',
  'docs/security/npm-supply-chain-hardening.md',
  'docs/security/github-actions-cache-poisoning.md',
]) {
  checkDocument(path.join(root, file))
}
console.log(
  'Documentation links pass. External URL reachability is not checked by this offline command.'
)
