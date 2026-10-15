import { io, Socket } from 'socket.io-client'

export interface NftUpdatedEvent {
  nftId: string
  newPrice?: number
  availableEditions?: number
  updatedAt: string
}

export interface OrderUpdatedEvent {
  orderId: string
  status: 'pending' | 'confirmed' | 'failed'
  transactionHash: string
  updatedAt: string
}

const SOCKET_URL =
  typeof window !== 'undefined'
    ? window.location.origin
    : 'http://localhost:3000'

// Initialize Socket client
export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ['websocket', 'polling'],
})

// Simulated event emitter for environments without an active backend WebSocket server
class SocketSimulator {
  private listeners: Record<string, Array<(data: any) => void>> = {}

  on(event: string, callback: (data: any) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)

    // Bind real socket as well
    socket.on(event, callback)

    return () => this.off(event, callback)
  }

  off(event: string, callback: (data: any) => void) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback)
    }
    socket.off(event, callback)
  }

  emit(event: string, data: any) {
    // Dispatch to local subscribers
    if (this.listeners[event]) {
      this.listeners[event].forEach((cb) => cb(data))
    }
    // Also try emit to real socket if connected
    if (socket.connected) {
      socket.emit(event, data)
    }
  }

  // Trigger test real-time updates
  simulatePriceDrop(nftId: string, newPrice: number) {
    this.emit('nft.updated', {
      nftId,
      newPrice,
      updatedAt: new Date().toISOString(),
    } satisfies NftUpdatedEvent)
  }

  simulateOrderStatus(orderId: string, status: 'confirmed' | 'failed') {
    this.emit('order.updated', {
      orderId,
      status,
      transactionHash: '0x' + Math.random().toString(16).substring(2, 42),
      updatedAt: new Date().toISOString(),
    } satisfies OrderUpdatedEvent)
  }
}

export const socketSimulator = new SocketSimulator()

// Subscription helpers
export function onNftUpdated(callback: (event: NftUpdatedEvent) => void) {
  return socketSimulator.on('nft.updated', callback)
}

export function onOrderUpdated(callback: (event: OrderUpdatedEvent) => void) {
  return socketSimulator.on('order.updated', callback)
}

export default socket
