const storage = require("../../../lib/api-storage");
const { verifyAdmin } = require("../../../lib/api-middleware/auth");

module.exports = async function handler(req, res) {
  const { id } = req.query;
  if (req.method === "GET") {
    const items = await storage.getNews();
    const item = items.find((i) => i.id === id);
    if (!item) return res.status(404).json({ error: "News item not found" });
    return res.json(item);
  }

  if (req.method === "PUT") {
    return verifyAdmin(req, res, async () => {
      const items = await storage.getNews();
      const idx = items.findIndex((i) => i.id === id);
      if (idx === -1)
        return res.status(404).json({ error: "News item not found" });
      const next = { ...items[idx], ...req.body, id };
      if ((req.body.title || next.title) && !next.slug) {
        const source = req.body.title || next.title;
        next.slug = source.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
      items[idx] = next;
      await storage.saveNews(items);
      return res.json(next);
    });
  }

  if (req.method === "DELETE") {
    return verifyAdmin(req, res, async () => {
      const items = await storage.getNews();
      const item = items.find((i) => i.id === id);
      if (!item)
        return res.status(404).json({ error: "News item not found" });

      // Delete images from S3
      try {
        const { deleteS3Image } = require("../../../lib/s3");
        if (item.image) {
          await deleteS3Image(item.image);
        }
        if (item.coverImage) {
          await deleteS3Image(item.coverImage);
        }
      } catch (s3Err) {
        console.error("Failed to delete news image from S3:", s3Err);
      }

      const filtered = items.filter((i) => i.id !== id);
      await storage.saveNews(filtered);
      return res.json({ ok: true });
    });
  }

  res.setHeader("Allow", "GET,PUT,DELETE");
  res.status(405).end("Method Not Allowed");
};
