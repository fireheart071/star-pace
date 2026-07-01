const storage = require("../../../lib/api-storage");
const {
  sendAdminOrderSms,
  sendAdminOrderEmail,
  sendCustomerOrderSms,
  sendCustomerOrderEmail,
  scheduleCustomerFeedbackSms,
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

      // Validate date overlap
      const s1 = new Date(req.body.start)
      const e1 = new Date(req.body.end)
      if (isNaN(s1.getTime()) || isNaN(e1.getTime())) {
        return res.status(400).json({ error: 'Invalid start or end date.' })
      }
      const hasConflict = (Array.isArray(orders) ? orders : [])
        .filter(o => String(o.productId) === String(req.body.productId) && o.status !== 'Cancelled')
        .some(o => {
          const s2 = new Date(o.start)
          const e2 = new Date(o.end)
          return (s1 <= e2 && e1 >= s2)
        })

      if (hasConflict) {
        return res.status(400).json({ error: 'The selected dates are already booked by another reservation.' })
      }

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
            scheduleCustomerFeedbackSms(order),
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
