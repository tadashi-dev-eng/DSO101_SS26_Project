if (typeof (globalThis as any).requestIdleCallback === "undefined") {
  ;(globalThis as any).requestIdleCallback = (callback: FrameRequestCallback) => setTimeout(callback, 1)
}

if (typeof (globalThis as any).cancelIdleCallback === "undefined") {
  ;(globalThis as any).cancelIdleCallback = (id: number) => clearTimeout(id)
}
