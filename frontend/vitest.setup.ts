declare global {
  interface Window {
    requestIdleCallback?: typeof requestIdleCallback
    cancelIdleCallback?: typeof cancelIdleCallback
  }
}

const win = globalThis as unknown as Window

win.self = win
win.requestIdleCallback = win.requestIdleCallback ?? ((callback: FrameRequestCallback) => setTimeout(callback, 1))
win.cancelIdleCallback = win.cancelIdleCallback ?? ((id: number) => clearTimeout(id))
