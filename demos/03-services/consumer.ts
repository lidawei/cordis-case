import type { Context } from '@deepseek-ai/cordis'
import type {} from './greeter.ts'

export const name = 'consumer'
export const inject = ['hello1']

export function apply(ctx: Context) {
  console.log(ctx.hello1.greet('world'))
}
