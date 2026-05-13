const storage = require("../../../lib/api-storage");
const { verifyAdmin } = require("../../../lib/api-middleware/auth");

export default async function handler(req, res) {
  if (req.method === "GET") {
    const items = await storage.getTestimonials();
    return res.json(items);
  }
  if (req.method === "POST") {
    return verifyAdmin(req, res, async () => {
      const items = await storage.getTestimonials();
      const name = req.body?.name || "";
      const quote = req.body?.quote || "";
      if (!name.trim() || !quote.trim())
        return res.status(400).json({ error: "Name and quote are required" });
      const id = req.body?.id || `t-${Date.now().toString(36)}`;
      const item = {
        id,
        name,
        role: req.body?.role || "",
        quote,
        avatar: req.body?.avatar || "",
        status: req.body?.status || "active"
      };
      items.unshift(item);
      await storage.saveTestimonials(items);
      return res.json(item);
    });
  }
  res.setHeader("Allow", "GET,POST");
  res.status(405).end("Method Not Allowed");
}
