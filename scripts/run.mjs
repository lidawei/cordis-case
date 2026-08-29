import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const name = process.argv[2]
if (!name) {
  console.error('usage: node scripts/run.mjs <demo-dir>')
  process.exit(2)
}

const demoDir = join(root, 'demos', name)
if (!existsSync(join(demoDir, 'cordis.yml'))) {
  console.error(`missing ${join(demoDir, 'cordis.yml')}`)
  process.exit(2)
}

const child = spawn(process.execPath, ['--import', 'tsx', join(root, 'bin.js')], {
  cwd: demoDir,
  stdio: 'inherit',
  env: process.env,
})
child.on('exit', (code, signal) => {
  process.exit(signal === null ? code ?? 1 : 1)
})
