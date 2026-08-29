import type { Context } from '@deepseek-ai/cordis'

declare module '@deepseek-ai/cordis' {
  interface Events {
    'demo/transform'(input: string, next: () => Promise<string>): Promise<string>
  }
}

export const name = 'waterfall-demo'

export async function apply(ctx: Context) {
  ctx.on('demo/transform', async (_input, next) => {
    console.log('listen 1 begin')
    const downstream = await next()

    console.log('listen 1 end, ', downstream)
    return downstream.toUpperCase()
  })

  ctx.on('demo/transform', async (input, next) => {
    console.log('listen 2 begin')
    
    if (input.includes('blocked')) {
      console.log('listen 2 blocked')
      return '** blocked **'
    }

    const downstream = await next()

    console.log('listen 2 end, ', downstream)
    return downstream
  })

  console.log(await ctx.waterfall('demo/transform', 'hello', async () => {
    console.log('trigger hello')
    return 'hello result'
  }))

  console.log('--------------------------------')

  console.log(await ctx.waterfall('demo/transform', 'blocked words', async () => {
    console.log('trigger blocked words')
    return 'blocked words result'
  }))

}
