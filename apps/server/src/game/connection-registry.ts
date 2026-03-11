/** Callback used to send a raw string to a connected client. */
export type SendFn = (data: string) => void;

/**
 * Registry that maps connection IDs to their send functions.
 * Decouples WebSocket implementation details from game logic.
 */
export class ConnectionRegistry {
  private readonly connections = new Map<string, SendFn>();

  /** Registers a connection with its send function. */
  register(id: string, send: SendFn): void {
    this.connections.set(id, send);
  }

  /** Removes a connection from the registry. */
  unregister(id: string): void {
    this.connections.delete(id);
  }

  /** Serializes data as JSON and sends it to a single connection. */
  send(id: string, data: unknown): void {
    const send = this.connections.get(id);
    if (!send) return;
    try {
      send(JSON.stringify(data));
    } catch {
      this.connections.delete(id);
    }
  }

  /** Broadcasts JSON-serialized data to multiple connections, optionally excluding one. */
  broadcast(ids: string[], data: unknown, excludeId?: string): void {
    const raw = JSON.stringify(data);
    for (const id of ids) {
      if (id === excludeId) continue;
      const send = this.connections.get(id);
      if (!send) continue;
      try {
        send(raw);
      } catch {
        this.connections.delete(id);
      }
    }
  }
}
