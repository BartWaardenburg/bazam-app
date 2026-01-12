export type SendFn = (data: string) => void;

export class ConnectionRegistry {
  private readonly connections = new Map<string, SendFn>();

  register(id: string, send: SendFn): void {
    this.connections.set(id, send);
  }

  unregister(id: string): void {
    this.connections.delete(id);
  }

  send(id: string, data: unknown): void {
    const send = this.connections.get(id);
    if (!send) return;
    try {
      send(JSON.stringify(data));
    } catch {
      this.connections.delete(id);
    }
  }

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
