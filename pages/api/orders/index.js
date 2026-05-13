const storage = require("../../../lib/api-storage");
const {
  sendAdminOrderSms,
  sendAdminOrderEmail,
  sendCustomerOrderSms,
  sendCustomerOrderEmail,
} = require("../../../lib/api-utils/notifications");
const { verifyAdmin } = require("../../../lib/api-middleware/auth");

async function handler(req, res) {
  if (req.method === "GET") {
    return verifyAdmin(req, res, async () => {
      try {
        const orders = await storage.getOrders();
        return res.json(Array.isArray(orders) ? orders : []);
      } catch (e) {
        return res.status(500).json({ error: "Failed to load orders" });
      }
    });
  }

  if (req.method === "POST") {
    try {
      const orders = await storage.getOrders();
      const id = Date.now().toString(36);
      const order = Object.assign(
        { id, createdAt: new Date().toISOString() },
        req.body,
      );
      orders.unshift(order);
      await storage.saveOrders(orders);

      // notify admin (sms + email) + notify customer but do not block response
      (async () => {
        try {
          await Promise.allSettled([
            sendAdminOrderSms(order),
            sendAdminOrderEmail(order),
            sendCustomerOrderSms(order),
            sendCustomerOrderEmail(order),
          ]);
        } catch (e) {
          console.error("Notification error", e);
        }
      })();

      return res.json(order);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: "Failed to save order" });
    }
  }

  res.setHeader("Allow", "GET,POST");
  res.status(405).end("Method Not Allowed");
}

export default handler;
