import { type LLOneBot } from './preload'

declare global {
  interface Window {
    llonebot: LLOneBot
    LiteLoader: Record<string, any>
  }
}
