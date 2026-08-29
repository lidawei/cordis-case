import type { Context } from '@deepseek-ai/cordis'

export const name = 'lifecycle-demo'

function heartbeat(ctx: Context) {
  console.log('heartbeat plugin loading')
  ctx.effect(() => {
    const timer = setInterval(() => console.log('tick'), 200)
    return () => {
      clearInterval(timer)
      console.log('heartbeat cleaned up')
    }
  })
}

function gate(ctx: Context) {
  console.log('gate plugin loading')
  ctx.effect(() => {
    const timer = setInterval(() => console.log('gate check'), 500)
    return () => {
      clearInterval(timer)
      console.log('gate cleaned up')
    }
  })
}

export function apply(ctx: Context) {
  console.log("main plugin loading")

  const fiber = ctx.plugin(heartbeat)
  const fiberGate = ctx.plugin(gate)

  ctx.effect(() => {
    const timer = setTimeout(async () => {
      await fiber.dispose()
      await fiberGate.dispose() 

      console.log('main plugin cleaned up')
      process.exit(0)
    }, 700)
    return () => {
      clearTimeout(timer)
    }
  })
}
