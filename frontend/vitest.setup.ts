(globalThis as any).self = globalThis;
(globalThis as any).requestIdleCallback = globalThis.requestIdleCallback ?? ((callback: FrameRequestCallback) => setTimeout(callback, 1));
(globalThis as any).cancelIdleCallback = globalThis.cancelIdleCallback ?? ((id: number) => clearTimeout(id));
