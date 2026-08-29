import type { Context } from '@deepseek-ai/cordis'
import type {} from './stats.ts'

export const name = 'reporter'
export const inject = ['stats']

export function apply(ctx: Context) {

  ctx.stats.on((name, count) => {
    console.log(`[stats] ${name} --> ${count}`)
  })

  ctx.stats.emit('tool_call')
  ctx.stats.emit('tool_call')
  ctx.stats.emit('prompt')
}
