import { spawn } from 'node:child_process'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const demos = [
  '01-first-plugin',
  '02-lifecycle',
  '03-services',
  '04-events',
  '04-waterfall',
  '05-config',
  '06-pending',
  '06-pending-ok',
  '07-mini-harness',
]

for (const name of demos) {
  console.log(`\n======== ${name} ========`)
  const code = await new Promise((resolve) => {
    const child = spawn(process.execPath, ['scripts/run.mjs', name], {
      cwd: root,
      stdio: 'inherit',
      env: process.env,
    })
    child.on('exit', (c, signal) => resolve(signal === null ? c ?? 1 : 1))
  })
  if (code !== 0) {
    console.error(`[fail] ${name} exited ${code}`)
    process.exit(code)
  }
}

console.log('\n======== all demos passed ========')
