import { ConnectionRegistry } from './connection-registry';
import type { SendFn } from './connection-registry';

describe('ConnectionRegistry', () => {
  let registry: ConnectionRegistry;

  beforeEach(() => {
    registry = new ConnectionRegistry();
  });

  describe('register + send', () => {
    it('sends JSON-stringified data to a registered connection', () => {
      const sendFn = vi.fn<SendFn>();
      registry.register('conn-1', sendFn);

      registry.send('conn-1', { type: 'hello', payload: 42 });

      expect(sendFn).toHaveBeenCalledOnce();
      expect(sendFn).toHaveBeenCalledWith(JSON.stringify({ type: 'hello', payload: 42 }));
    });

    it('sends complex nested data correctly', () => {
      const sendFn = vi.fn<SendFn>();
      registry.register('conn-1', sendFn);

      const data = { players: [{ id: '1', score: 100 }], phase: 'lobby' };
      registry.send('conn-1', data);

      expect(sendFn).toHaveBeenCalledWith(JSON.stringify(data));
    });
  });

  describe('send to unknown id', () => {
    it('does not throw when sending to an unregistered id', () => {
      expect(() => registry.send('unknown', { message: 'test' })).not.toThrow();
    });

    it('does not call any send function', () => {
      const sendFn = vi.fn<SendFn>();
      registry.register('conn-1', sendFn);

      registry.send('conn-2', { message: 'test' });

      expect(sendFn).not.toHaveBeenCalled();
    });
  });

  describe('unregister', () => {
    it('makes subsequent sends a no-op', () => {
      const sendFn = vi.fn<SendFn>();
      registry.register('conn-1', sendFn);
      registry.unregister('conn-1');

      registry.send('conn-1', { message: 'test' });

      expect(sendFn).not.toHaveBeenCalled();
    });

    it('does not throw when unregistering an unknown id', () => {
      expect(() => registry.unregister('unknown')).not.toThrow();
    });

    it('does not affect other connections', () => {
      const sendFn1 = vi.fn<SendFn>();
      const sendFn2 = vi.fn<SendFn>();
      registry.register('conn-1', sendFn1);
      registry.register('conn-2', sendFn2);

      registry.unregister('conn-1');
      registry.send('conn-2', { message: 'test' });

      expect(sendFn1).not.toHaveBeenCalled();
      expect(sendFn2).toHaveBeenCalledOnce();
    });
  });

  describe('send error handling', () => {
    it('removes the connection when sendFn throws', () => {
      const throwingFn = vi.fn<SendFn>().mockImplementation(() => {
        throw new Error('WebSocket closed');
      });
      registry.register('conn-1', throwingFn);

      // First send triggers the error and removes the connection
      registry.send('conn-1', { message: 'test' });
      expect(throwingFn).toHaveBeenCalledOnce();

      // Second send should be a no-op since the connection was removed
      registry.send('conn-1', { message: 'test2' });
      expect(throwingFn).toHaveBeenCalledOnce(); // still 1, not 2
    });
  });

  describe('register overwrite', () => {
    it('overwrites the previous sendFn for the same id', () => {
      const oldFn = vi.fn<SendFn>();
      const newFn = vi.fn<SendFn>();

      registry.register('conn-1', oldFn);
      registry.register('conn-1', newFn);

      registry.send('conn-1', { message: 'test' });

      expect(oldFn).not.toHaveBeenCalled();
      expect(newFn).toHaveBeenCalledOnce();
    });
  });

  describe('broadcast', () => {
    it('sends data to all specified connections', () => {
      const sendFn1 = vi.fn<SendFn>();
      const sendFn2 = vi.fn<SendFn>();
      const sendFn3 = vi.fn<SendFn>();

      registry.register('conn-1', sendFn1);
      registry.register('conn-2', sendFn2);
      registry.register('conn-3', sendFn3);

      const data = { type: 'update' };
      registry.broadcast(['conn-1', 'conn-2', 'conn-3'], data);

      const expected = JSON.stringify(data);
      expect(sendFn1).toHaveBeenCalledWith(expected);
      expect(sendFn2).toHaveBeenCalledWith(expected);
      expect(sendFn3).toHaveBeenCalledWith(expected);
    });

    it('skips the excluded id', () => {
      const sendFn1 = vi.fn<SendFn>();
      const sendFn2 = vi.fn<SendFn>();
      const sendFn3 = vi.fn<SendFn>();

      registry.register('conn-1', sendFn1);
      registry.register('conn-2', sendFn2);
      registry.register('conn-3', sendFn3);

      registry.broadcast(['conn-1', 'conn-2', 'conn-3'], { type: 'update' }, 'conn-2');

      expect(sendFn1).toHaveBeenCalledOnce();
      expect(sendFn2).not.toHaveBeenCalled();
      expect(sendFn3).toHaveBeenCalledOnce();
    });

    it('skips unknown ids gracefully', () => {
      const sendFn1 = vi.fn<SendFn>();
      registry.register('conn-1', sendFn1);

      registry.broadcast(['conn-1', 'unknown-1', 'unknown-2'], { type: 'update' });

      expect(sendFn1).toHaveBeenCalledOnce();
    });

    it('handles an empty ids array', () => {
      const sendFn = vi.fn<SendFn>();
      registry.register('conn-1', sendFn);

      registry.broadcast([], { type: 'update' });

      expect(sendFn).not.toHaveBeenCalled();
    });

    it('removes a connection that throws and continues to others', () => {
      const throwingFn = vi.fn<SendFn>().mockImplementation(() => {
        throw new Error('WebSocket closed');
      });
      const healthyFn = vi.fn<SendFn>();

      registry.register('conn-1', throwingFn);
      registry.register('conn-2', healthyFn);

      const data = { type: 'update' };
      registry.broadcast(['conn-1', 'conn-2'], data);

      // The throwing connection was called
      expect(throwingFn).toHaveBeenCalledOnce();
      // The healthy connection still received the message
      expect(healthyFn).toHaveBeenCalledOnce();
      expect(healthyFn).toHaveBeenCalledWith(JSON.stringify(data));

      // The throwing connection should be removed — verify via a second broadcast
      throwingFn.mockClear();
      healthyFn.mockClear();
      registry.broadcast(['conn-1', 'conn-2'], { type: 'update2' });

      expect(throwingFn).not.toHaveBeenCalled();
      expect(healthyFn).toHaveBeenCalledOnce();
    });

    it('serializes data only once for all recipients', () => {
      const sendFn1 = vi.fn<SendFn>();
      const sendFn2 = vi.fn<SendFn>();

      registry.register('conn-1', sendFn1);
      registry.register('conn-2', sendFn2);

      registry.broadcast(['conn-1', 'conn-2'], { type: 'update' });

      // Both should receive the exact same string reference (optimization check)
      const arg1 = sendFn1.mock.calls[0][0];
      const arg2 = sendFn2.mock.calls[0][0];
      expect(arg1).toBe(arg2);
    });

    it('only sends to ids in the provided list, not all registered connections', () => {
      const sendFn1 = vi.fn<SendFn>();
      const sendFn2 = vi.fn<SendFn>();
      const sendFn3 = vi.fn<SendFn>();

      registry.register('conn-1', sendFn1);
      registry.register('conn-2', sendFn2);
      registry.register('conn-3', sendFn3);

      registry.broadcast(['conn-1', 'conn-3'], { type: 'update' });

      expect(sendFn1).toHaveBeenCalledOnce();
      expect(sendFn2).not.toHaveBeenCalled();
      expect(sendFn3).toHaveBeenCalledOnce();
    });
  });
});
