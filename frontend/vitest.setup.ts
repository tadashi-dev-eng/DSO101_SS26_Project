type IdleCallbackGlobals = typeof globalThis & {
  requestIdleCallback?: (callback: FrameRequestCallback) => number
  cancelIdleCallback?: (id: number) => void
}

const idleCallbackGlobals: IdleCallbackGlobals = globalThis

if (typeof idleCallbackGlobals.requestIdleCallback === "undefined") {
  idleCallbackGlobals.requestIdleCallback = (callback: FrameRequestCallback) => setTimeout(callback, 1)
}

if (typeof idleCallbackGlobals.cancelIdleCallback === "undefined") {
  idleCallbackGlobals.cancelIdleCallback = (id: number) => clearTimeout(id)
}

type ResizeObserverConstructor = new () => {
  observe(): void
  unobserve(): void
  disconnect(): void
}

type GlobalWithResize = typeof globalThis & {
  ResizeObserver?: ResizeObserverConstructor
}

const globalWithResize = globalThis as GlobalWithResize

if (typeof globalWithResize.ResizeObserver === "undefined") {
  const ResizeObserverPolyfill: ResizeObserverConstructor = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  globalWithResize.ResizeObserver = ResizeObserverPolyfill
}
