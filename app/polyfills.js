// Polyfill for node global object in Cloudflare Workers/Pages environment
if (typeof globalThis !== 'undefined' && !globalThis.global) {
  globalThis.global = globalThis
}

// Polyfill for MessageChannel required by React 19 in Cloudflare Workers
if (typeof MessageChannel === 'undefined') {
  const MessageChannelPolyfill = class MessageChannel {
    constructor() {
      this.port1 = {
        postMessage: (message) => {
          if (this.port2.onmessage) {
            // Use queueMicrotask to make it async like the real MessageChannel
            queueMicrotask(() => {
              this.port2.onmessage({ data: message })
            })
          }
        },
        onmessage: null
      }
      this.port2 = {
        postMessage: (message) => {
          if (this.port1.onmessage) {
            queueMicrotask(() => {
              this.port1.onmessage({ data: message })
            })
          }
        },
        onmessage: null
      }
    }
  }

  // Set on both globalThis and global for compatibility
  globalThis.MessageChannel = MessageChannelPolyfill
  if (typeof global !== 'undefined') {
    global.MessageChannel = MessageChannelPolyfill
  }
}
