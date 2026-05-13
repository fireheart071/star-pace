const storage = require("../../../lib/api-storage");
const { normalizeStay, processImages } = require("../../../lib/api-utils/helpers");
const { verifyAdmin } = require("../../../lib/api-middleware/auth");

function sameId(a, b) {
  return String(a) === String(b);
}

export default async function handler(req, res) {
  const { id } = req.query;
  
  if (req.method === "GET") {
    const stays = await storage.getStays();
    const stay = stays.find((s) => sameId(s.id, id));
    if (!stay) return res.status(404).json({ error: "Stay not found" });
    return res.json(stay);
  }

  if (req.method === "PUT") {
    return verifyAdmin(req, res, async () => {
      const stays = await storage.getStays();
      const idx = stays.findIndex((s) => sameId(s.id, id));
      if (idx === -1) return res.status(404).json({ error: "Stay not found" });
      
      const body = await processImages(req.body);
      const next = normalizeStay({ ...stays[idx], ...body, id: stays[idx].id });
      stays[idx] = next;
      await storage.saveStays(stays);
      return res.json(next);
    });
  }

  if (req.method === "DELETE") {
    return verifyAdmin(req, res, async () => {
      const stays = await storage.getStays();
      const stay = stays.find((s) => sameId(s.id, id));
      if (!stay) return res.status(404).json({ error: "Stay not found" });

      if (typeof storage.deleteStay === "function") {
        await storage.deleteStay(stay.id);
      } else {
        const filtered = stays.filter((s) => !sameId(s.id, id));
        await storage.saveStays(filtered);
      }

      return res.json({ ok: true });
    });
  }

  res.setHeader("Allow", "GET,PUT,DELETE");
  res.status(405).end("Method Not Allowed");
}
