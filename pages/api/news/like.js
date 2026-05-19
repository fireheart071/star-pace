const storage = require("../../../lib/api-storage");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  const { postId } = req.body;
  if (!postId) {
    return res.status(400).json({ error: "Post ID is required" });
  }

  try {
    const items = await storage.getNews();
    const index = items.findIndex(item => String(item.id) === String(postId));
    
    if (index === -1) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Initialize likes if it doesn't exist
    if (typeof items[index].likes === 'undefined' || items[index].likes === null) {
      items[index].likes = 0;
    }

    items[index].likes += 1;
    await storage.saveNews(items);

    return res.json({ likes: items[index].likes });
  } catch (error) {
    console.error("Like update failed:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
