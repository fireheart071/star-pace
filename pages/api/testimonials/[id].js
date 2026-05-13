const storage = require("../../../lib/api-storage");
const { verifyAdmin } = require("../../../lib/api-middleware/auth");

module.exports = async function handler(req, res) {
  const { id } = req.query;
  if (req.method === "GET") {
    const items = await storage.getTestimonials();
    const item = items.find((i) => i.id === id);
    if (!item) return res.status(404).json({ error: "Testimonial not found" });
    return res.json(item);
  }

  if (req.method === "PUT") {
    return verifyAdmin(req, res, async () => {
      const items = await storage.getTestimonials();
      const idx = items.findIndex((i) => i.id === id);
      if (idx === -1)
        return res.status(404).json({ error: "Testimonial not found" });
      const next = { ...items[idx], ...req.body, id };
      items[idx] = next;
      await storage.saveTestimonials(items);
      return res.json(next);
    });
  }

  if (req.method === "DELETE") {
    return verifyAdmin(req, res, async () => {
      const items = await storage.getTestimonials();
      const filtered = items.filter((i) => i.id !== id);
      if (filtered.length === items.length)
        return res.status(404).json({ error: "Testimonial not found" });
      await storage.saveTestimonials(filtered);
      return res.json({ ok: true });
    });
  }

  res.setHeader("Allow", "GET,PUT,DELETE");
  res.status(405).end("Method Not Allowed");
};
