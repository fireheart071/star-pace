const storage = require("../../../lib/api-storage");
const { verifyAdmin } = require("../../../lib/api-middleware/auth");

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "DELETE") {
    return verifyAdmin(req, res, async () => {
      try {
        const reviews = await storage.getReviews();
        const exists = reviews.some((r) => String(r.id) === String(id));
        if (!exists) {
          return res.status(404).json({ error: "Review not found" });
        }
        await storage.deleteReview(id);
        return res.json({ ok: true });
      } catch (err) {
        return res.status(500).json({ error: "Failed to delete review: " + err.message });
      }
    });
  }

  res.setHeader("Allow", "DELETE");
  res.status(405).end("Method Not Allowed");
}
