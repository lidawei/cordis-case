import type { Context } from '@deepseek-ai/cordis'
import type {} from './stats.ts'

export const name = 'reporter'
export const inject = ['stats']

export function apply(ctx: Context) {
  ctx.on('stats/report', (name, count) => {
    console.log(`[stats] ${name} --> ${count}`)
  })
  ctx.stats.emit('tool_call')
  ctx.stats.emit('tool_call')
  ctx.stats.emit('prompt')
}
