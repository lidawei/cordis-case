import type { Context } from '@deepseek-ai/cordis'
import type {} from './tools.ts'

export const name = 'greet-tool'
export const inject = ['tools']

export function apply(ctx: Context) {
  ctx.tools.register({
    name: 'greet',
    description: 'Greet the named person.',
    execute(args) {
      return `Hello, ${String(args.name)}!`
    },
  })

  return (async () => {
    const result = await ctx.tools.execute({
      callId: 'demo-1',
      name: 'greet',
      arguments: { name: 'Cordis' },
    })
    console.log('tool replied:', JSON.stringify(result.content))
  })()
}
