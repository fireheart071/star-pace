const storage = require("../../../lib/api-storage");
const { verifyAdmin } = require("../../../lib/api-middleware/auth");

export default async function handler(req, res) {
  if (req.method === "GET") {
    const items = await storage.getGallery();
    return res.json(items || []);
  }
  
  if (req.method === "POST") {
    return verifyAdmin(req, res, async () => {
      const items = (await storage.getGallery()) || [];
      const image = req.body?.image || "";
      if (!image.trim())
        return res.status(400).json({ error: "Image URL is required" });
      
      const item = {
        id: `g-${Date.now().toString(36)}`,
        image,
        caption: req.body?.caption || "",
        category: req.body?.category || "General",
        createdAt: new Date().toISOString(),
      };
      
      items.unshift(item);
      await storage.saveGallery(items);
      return res.json(item);
    });
  }
  
  res.setHeader("Allow", "GET,POST");
  res.status(405).end("Method Not Allowed");
}
