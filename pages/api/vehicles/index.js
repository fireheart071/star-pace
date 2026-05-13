const storage = require("../../../lib/api-storage");
const { slugify, normalizeModel } = require("../../../lib/api-utils/helpers");
const { verifyAdmin } = require("../../../lib/api-middleware/auth");

export default async function handler(req, res) {
  if (req.method === "GET") {
    const models = await storage.getModels();
    return res.json(models);
  }

  if (req.method === "POST") {
    return verifyAdmin(req, res, async () => {
      const models = await storage.getModels();
      const name = req.body?.name || "";
      if (!name.trim())
        return res.status(400).json({ error: "Model name is required" });

      let id = slugify(req.body?.id || name);
      if (!id) id = Date.now().toString(36);
      if (models.some((m) => m.id === id))
        id = `${id}-${Date.now().toString(36)}`;

      const created = normalizeModel({ ...req.body, id });
      models.unshift(created);
      await storage.saveModels(models);
      return res.json(created);
    });
  }

  res.setHeader("Allow", "GET,POST");
  res.status(405).end("Method Not Allowed");
}
