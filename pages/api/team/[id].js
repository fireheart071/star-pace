const storage = require("../../../lib/api-storage");
const { verifyAdmin } = require("../../../lib/api-middleware/auth");

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "PUT") {
    return verifyAdmin(req, res, async () => {
      let items = await storage.getTeam();
      if (!Array.isArray(items)) items = [];
      const idx = items.findIndex((i) => i.id === id);
      if (idx === -1) return res.status(404).json({ error: "Not found" });

      const updated = { ...items[idx], ...req.body, id };
      items[idx] = updated;
      await storage.saveTeam(items);
      return res.json(updated);
    });
  }

  if (req.method === "DELETE") {
    return verifyAdmin(req, res, async () => {
      let items = await storage.getTeam();
      if (!Array.isArray(items)) items = [];
      const next = items.filter((i) => i.id !== id);
      await storage.saveTeam(next);
      return res.json({ success: true });
    });
  }

  res.setHeader("Allow", "PUT,DELETE");
  res.status(405).end("Method Not Allowed");
}
