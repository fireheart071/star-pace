const storage = require("../../../lib/api-storage");
const { slugify, normalizeStay, processImages } = require("../../../lib/api-utils/helpers");
const { verifyAdmin } = require("../../../lib/api-middleware/auth");

export default async function handler(req, res) {
  if (req.method === "GET") {
    const stays = await storage.getStays();
    return res.json(stays);
  }

  if (req.method === "POST") {
    return verifyAdmin(req, res, async () => {
      const stays = await storage.getStays();
      const body = await processImages(req.body);
      const name = body?.name || "";
      if (!name.trim())
        return res.status(400).json({ error: "Stay name is required" });

      let id = slugify(body?.id || name);
      if (!id) id = Date.now().toString(36);
      if (stays.some((s) => s.id === id))
        id = `${id}-${Date.now().toString(36)}`;

      const created = normalizeStay({ ...body, id });
      stays.unshift(created);
      await storage.saveStays(stays);
      return res.json(created);
    });
  }

  res.setHeader("Allow", "GET,POST");
  res.status(405).end("Method Not Allowed");
}
