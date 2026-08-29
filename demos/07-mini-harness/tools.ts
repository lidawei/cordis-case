import { Service, type Context } from '@deepseek-ai/cordis'

export interface Tool {
  name: string
  description: string
  execute: (args: Record<string, unknown>) => Promise<string> | string
}

export interface ToolExec {
  callId: string
  name: string
  arguments: Record<string, unknown>
}

export interface ToolResult {
  content: Array<{ type: 'text'; text: string }>
}

declare module '@deepseek-ai/cordis' {
  interface Context {
    tools: ToolsService
  }
  interface Events {
    'tools/result'(exec: ToolExec, result: ToolResult): void
  }
}

export class ToolsService extends Service {
  private tools = new Map<string, Tool>()

  constructor(ctx: Context) {
    super(ctx, 'tools')
  }

  register(tool: Tool) {
    this.tools.set(tool.name, tool)
    return this.ctx.effect(() => () => {
      this.tools.delete(tool.name)
    })
  }

  async execute(exec: ToolExec): Promise<ToolResult> {
    const tool = this.tools.get(exec.name)
    if (!tool) throw new Error(`unknown tool: ${exec.name}`)
    const text = await tool.execute(exec.arguments)
    const result: ToolResult = { content: [{ type: 'text', text }] }
    this.ctx.emit('tools/result', exec, result)
    return result
  }
}

export const name = 'tools'

export function apply(ctx: Context) {
  ctx.plugin(ToolsService)
}
