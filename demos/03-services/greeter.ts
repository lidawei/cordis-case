import { Service, type Context } from '@deepseek-ai/cordis'

declare module '@deepseek-ai/cordis' {
  interface Context {
    hello1: Greeter
  }
}

export class Greeter extends Service {
  constructor(ctx: Context) {
    // The string here is the Context key. Class name Greeter does not matter.
    super(ctx, 'hello1')
  }

  greet(who: string) {
    return `Hello, ${who}!`
  }
}

export const name = 'greeter'

export function apply(ctx: Context) {
  ctx.plugin(Greeter)
}
