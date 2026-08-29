import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const name = process.argv[2]
if (!name) {
  console.error('usage: node scripts/run.mjs <demo-dir> [cordis.yml]')
  process.exit(2)
}

const yml = process.argv[3] ?? './cordis.yml'
const demoDir = join(root, 'demos', name)
if (!existsSync(join(demoDir, yml))) {
  console.error(`missing ${join(demoDir, yml)}`)
  process.exit(2)
}

const child = spawn(process.execPath, ['--import', 'tsx', join(root, 'bin.js')], {
  cwd: demoDir,
  stdio: 'inherit',
  env: { ...process.env, CORDIS_YML: yml },
})
child.on('exit', (code, signal) => {
  process.exit(signal === null ? code ?? 1 : 1)
})
