const storage = require("../../../lib/api-storage");
const { verifyAdmin } = require("../../../lib/api-middleware/auth");
const { sendApprovalSms, sendApprovalEmail } = require("../../../lib/api-utils/notifications");

module.exports = async function handler(req, res) {
  const { id } = req.query;
  if (req.method === "GET") {
    const orders = await storage.getOrders();
    const order = orders.find((o) => o.id === id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    return res.json(order);
  }

  if (req.method === "PUT") {
    return verifyAdmin(req, res, async () => {
      const orders = await storage.getOrders();
      const idx = orders.findIndex((o) => o.id === id);
      if (idx === -1) return res.status(404).json({ error: "Order not found" });
      const current = orders[idx];
      const next = Object.assign({}, current, req.body, {
        id: current.id,
        createdAt: current.createdAt,
      });
      orders[idx] = next;
      await storage.saveOrders(orders);

      // Trigger approval notifications if status changed to Approved
      if (next.status === "Approved" && current.status !== "Approved") {
        console.log(`[Approval] Status changed to Approved for order ${id}. Triggering notifications...`);
        (async () => {
          try {
            const results = await Promise.allSettled([
              sendApprovalSms(next),
              sendApprovalEmail(next)
            ]);
            console.log(`[Approval] Notification results for ${id}:`, JSON.stringify(results, null, 2));
          } catch (e) {
            console.error(`[Approval] Notification error for ${id}:`, e);
          }
        })();
      }

      return res.json(next);
    });
  }

  if (req.method === "DELETE") {
    return verifyAdmin(req, res, async () => {
      try {
        await storage.deleteOrder(id);
        return res.json({ ok: true });
      } catch (e) {
        return res.status(500).json({ error: "Failed to delete order" });
      }
    });
  }

  res.setHeader("Allow", "GET,PUT,DELETE");
  res.status(405).end("Method Not Allowed");
};
