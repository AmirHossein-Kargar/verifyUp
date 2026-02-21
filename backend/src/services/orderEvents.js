/**
 * In-memory store for SSE clients. When admin updates an order,
 * we notify all connected clients that belong to that order's userId.
 * Key: userId (string), Value: Set of res objects (Express response)
 */
const clientsByUserId = new Map();

function subscribe(userId, res) {
  const id = userId.toString();
  if (!clientsByUserId.has(id)) {
    clientsByUserId.set(id, new Set());
  }
  clientsByUserId.get(id).add(res);

  res.on("close", () => {
    const set = clientsByUserId.get(id);
    if (set) {
      set.delete(res);
      if (set.size === 0) clientsByUserId.delete(id);
    }
  });
}

function broadcastOrderUpdate(userId, orderPayload) {
  const id = userId.toString();
  const set = clientsByUserId.get(id);
  if (!set || set.size === 0) return;

  const data = JSON.stringify(orderPayload);
  set.forEach((res) => {
    try {
      res.write(`data: ${data}\n\n`);
    } catch (e) {
      // Client may have disconnected
    }
  });
}

module.exports = { subscribe, broadcastOrderUpdate };
