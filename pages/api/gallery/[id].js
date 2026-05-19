import storage from "../../../lib/api-storage";
import { verifyAdmin } from "../../../lib/api-middleware/auth";
import { deleteFile } from "../../../lib/s3";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "PUT") {
    return verifyAdmin(req, res, async () => {
      const items = (await storage.getGallery()) || [];
      const idx = items.findIndex((i) => i.id === id);
      if (idx === -1)
        return res.status(404).json({ error: "Gallery item not found" });
      
      const next = { ...items[idx], ...req.body, id };
      items[idx] = next;
      await storage.saveGallery(items);
      return res.json(next);
    });
  }

  if (req.method === "DELETE") {
    return verifyAdmin(req, res, async () => {
      // 1. Get the item first to find the image URL
      const items = (await storage.getGallery()) || [];
      const item = items.find(i => i.id === id);
      
      if (item && item.image && item.image.includes('/api/images/')) {
        // 2. Extract S3 key from URL
        const parts = item.image.split('/api/images/');
        const key = parts[parts.length - 1];
        if (key) {
          // 3. Delete from S3
          await deleteFile(key);
        }
      }

      // 4. Delete from storage/DB
      await storage.deleteGalleryItem(id);
      return res.json({ ok: true });
    });
  }

  res.setHeader("Allow", "PUT,DELETE");
  res.status(405).end("Method Not Allowed");
}
