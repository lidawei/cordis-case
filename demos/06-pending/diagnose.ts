import type { Context } from '@deepseek-ai/cordis'

// FiberState is a const enum in @deepseek-ai/cordis — erased from the
// published JS, so PENDING is the numeric 0 at runtime.
const PENDING = 0

export const name = 'diagnose'

export function apply(ctx: Context) {
  setTimeout(() => {
    for (const runtime of ctx.registry.values()) {
      for (const fiber of runtime.fibers) {
        if (fiber.state === PENDING) {
          console.log(`${fiber.name} is PENDING — a required service is missing`)
        }
      }
    }
    process.exit(0)
  }, 500)
}
