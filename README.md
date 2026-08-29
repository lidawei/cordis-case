# Cordis 在 DeepSeek Harness 使用方法

DeepSeek Harness 把整套 agent 都做成 **Cordis 插件**。工具、LLM、session、agent loop、Web UI 不是硬编码启动顺序，而是挂到同一个 `Context` 上，靠 `inject` 等依赖就绪，靠 `cordis.yml` / `cordis.patch.yml` 选装哪一组插件。

## 五条核心

1. **插件**是带 `apply(ctx)` 的模块（或 `Service` 子类）。
2. **Context** 是服务仓库。别人用 `ctx.tools` / `ctx.llm` 这种名字取能力，不 import 具体实现。
3. **`inject`** 声明硬依赖。服务没就绪时插件停在 `PENDING`，就绪才跑 `apply`。
4. **事件**有五种派发：`emit` / `parallel` / `serial` / `bail` / `waterfall`。Harness 用 waterfall 做拦截（例如 `approval/request`、`agent/request`）。
5. **注册都是可撤销的 effect**。插件卸载时，`ctx.on`、`ctx.plugin`、`ctx.tools.register` 自动拆掉。

## 和 Harness 源码的对应

| 本目录 demo | 对应 Harness |
|---|---|
| `bin.js` | `vendor/cordis/bin.js`：`new Context()` → 挂 Loader → 读 `./cordis.yml` |
| `01-first-plugin` | 任意 `export function apply(ctx)`，例如 `hello-plugin/index.js` |
| `02-lifecycle` | 卸载时拆 effect；HMR / 换 shell 实现都靠这个 |
| `03-services` | `ctx.tools`、`ctx.llm`、`ctx.shell` 都是 `Service` + `declare module` |
| `04-events` | `tools/result`、session 事件 |
| `04-waterfall` | `agent/request`、`approval/request` 的拦截链 |
| `05-config` | 每个插件的 `export const Config` + `cordis.yml` 的 `config:` |
| `06-pending` | `inject` 缺服务时静默 PENDING（HMR 缺 timer 就是这个坑） |
| `07-mini-harness` | 官方教程第 7 章：`ctx.tools.register` + `tools/result` 观察者 |

Harness 真正开机不是这个小 `bin.js`，而是 `apps/cli/src/profile-boot.ts`：在空的 `cordis.yml` 上叠多层 patch：

1. `packages/bundle/base/cordis.patch.yml`（timer、llm、agent、tools…）
2. 模式层，例如 `packages/bundle/headless/cordis.patch.yml` 或 `web-app`
3. 用户 `$DSH_HOME/cordis.patch.yml`
4. 命令行 `--patch`（`hello-plugin`、`scratch-plugin` 都走这条）

行顺序不决定加载顺序。`inject` 才决定谁先跑。

## 怎么跑

需要 Node 22+。

```powershell
npm install
npm run demo:all
```

单个：

```powershell
npm run demo:01    # 第一个插件
npm run demo:02    # effect / 卸载
npm run demo:03    # Service + inject：super(ctx, 'hello') → ctx.hello
npm run demo:04    # emit 广播
npm run demo:04w   # waterfall 包装 / 短路
npm run demo:05    # 合法 config，缺省 greeting
npm run demo:05bad # 非法 config，ValidationError
npm run demo:06    # PENDING 诊断
npm run demo:06ok  # 补上 timer 服务后加载
npm run demo:07    # 迷你 tools 注册表 + 观察者
```

`demo:05bad` 预期失败（非法配置），所以不在 `demo:all` 里。

在 Harness 仓库里跑官方教程（需要那边 `pnpm install` 完整）：

```powershell
cd D:\Code\deepseek-harness
mkdir tmp\cordis-tutorial
cd tmp\cordis-tutorial
# 按 docs/cordis-tutorial/ 各章写文件
node --import tsx ..\..\vendor\cordis\bin.js
```
