const storage = require("../../../lib/api-storage");
const { buildInvoiceBuffer } = require("../../../lib/api-utils/helpers");

module.exports = async function handler(req, res) {
  const { id } = req.query;
  if (req.method === "GET") {
    const orders = await storage.getOrders();
    const order = orders.find((o) => o.id === id);
    if (!order) return res.status(404).send("Order not found");
    try {
      const buf = await buildInvoiceBuffer(order);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=invoice-${order.id}.pdf`,
      );
      return res.send(buf);
    } catch (e) {
      console.error(e);
      return res.status(500).send("Failed to build invoice");
    }
  }
  res.setHeader("Allow", "GET");
  res.status(405).end("Method Not Allowed");
};
