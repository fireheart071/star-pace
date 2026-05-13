const storage = require("../../../lib/api-storage");
const { verifyAdmin } = require("../../../lib/api-middleware/auth");

export default async function handler(req, res) {
  if (req.method === "GET") {
    const items = await storage.getNews();
    const comments = await storage.getComments();
    
    const enriched = items.map(post => {
      const count = (comments || []).filter(c => String(c.postId) === String(post.id)).length;
      return { ...post, comments_count: count };
    });
    
    return res.json(enriched);
  }
  if (req.method === "POST") {
    return verifyAdmin(req, res, async () => {
      const items = await storage.getNews();
      const title = req.body?.title || "";
      if (!title.trim())
        return res.status(400).json({ error: "News title is required" });
      
      const id = req.body?.id || `n-${Date.now().toString(36)}`;
      const slug = (req.body?.slug || title)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const item = {
        id,
        slug,
        title,
        date: req.body?.date || new Date().toISOString().slice(0, 10),
        excerpt: req.body?.excerpt || "",
        content: req.body?.content || "",
        image: req.body?.image || "",
        status: req.body?.status || "active",
      };
      items.unshift(item);
      await storage.saveNews(items);
      return res.json(item);
    });
  }
  res.setHeader("Allow", "GET,POST");
  res.status(405).end("Method Not Allowed");
}
