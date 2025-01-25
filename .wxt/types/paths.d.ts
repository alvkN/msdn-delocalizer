// Generated by wxt
import "wxt/browser";

declare module "wxt/browser" {
  export type PublicPath =
    | "/"
    | "/LICENSE.md"
    | "/background.js"
    | "/icons/128.png"
    | "/icons/16.png"
    | "/icons/32.png"
    | "/icons/48.png"
  type HtmlPublicPath = Extract<PublicPath, `${string}.html`>
  export interface WxtRuntime {
    getURL(path: PublicPath): string;
    getURL(path: `${HtmlPublicPath}${string}`): string;
  }
}