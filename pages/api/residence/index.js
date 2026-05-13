const storage = require("../../../lib/api-storage/index.js");
const { slugify, normalizeResidence, processImages } = require("../../../lib/api-utils/helpers");
const { verifyAdmin } = require("../../../lib/api-middleware/auth");

export default async function handler(req, res) {
  if (req.method === "GET") {
    const items = await storage.getResidences();
    return res.json(items);
  }

  if (req.method === "POST") {
    return verifyAdmin(req, res, async () => {
      const items = await storage.getResidences();
      const body = await processImages(req.body);
      const name = body?.name || "";
      if (!name.trim())
        return res.status(400).json({ error: "Residence name is required" });

      let id = slugify(body?.id || name);
      if (!id) id = Date.now().toString(36);
      if (items.some((s) => s.id === id))
        id = `${id}-${Date.now().toString(36)}`;

      const created = normalizeResidence({ ...body, id });
      items.unshift(created);
      await storage.saveResidences(items);
      return res.json(created);
    });
  }

  res.setHeader("Allow", "GET,POST");
  res.status(405).end("Method Not Allowed");
}
