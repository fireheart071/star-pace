const storage = require("../../../lib/api-storage/index.js");
const { verifyAdmin } = require("../../../lib/api-middleware/auth");
const { normalizeResidence, processImages } = require("../../../lib/api-utils/helpers");

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    const items = await storage.getResidences();
    const item = items.find((i) => String(i.id) === String(id));
    if (!item) return res.status(404).json({ error: "Residence not found" });
    return res.json(item);
  }

  if (req.method === "PUT") {
    return verifyAdmin(req, res, async () => {
      const items = await storage.getResidences();
      const idx = items.findIndex((i) => String(i.id) === String(id));
      if (idx === -1) return res.status(404).json({ error: "Residence not found" });

      const body = await processImages(req.body);
      const updated = normalizeResidence({ ...body, id });
      items[idx] = updated;
      await storage.saveResidences(items);
      return res.json(updated);
    });
  }

  if (req.method === "DELETE") {
    return verifyAdmin(req, res, async () => {
      const items = await storage.getResidences();
      const item = items.find((i) => String(i.id) === String(id));

      if (item) {
        try {
          const { deleteS3Image, deleteS3Images } = require("../../../lib/s3");
          if (item.image) {
            await deleteS3Image(item.image);
          }
          if (item.gallery && item.gallery.length > 0) {
            await deleteS3Images(item.gallery);
          }
        } catch (s3Err) {
          console.error("Failed to delete residence images from S3:", s3Err);
        }
      }

      await storage.deleteResidence(id);
      return res.json({ success: true });
    });
  }

  res.setHeader("Allow", "GET,PUT,DELETE");
  res.status(405).end("Method Not Allowed");
}
