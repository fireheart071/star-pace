const storage = require("../../../lib/api-storage");

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const items = await storage.getReviews();
      return res.json(items);
    } catch (err) {
      return res.status(500).json({ error: "Failed to load reviews" });
    }
  }

  if (req.method === "POST") {
    try {
      const { name, rating, comment, bookingId } = req.body || {};
      if (!name || !name.trim()) {
        return res.status(400).json({ error: "Name is required" });
      }
      const ratingNum = Number(rating);
      if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        return res.status(400).json({ error: "Rating must be a number between 1 and 5" });
      }
      if (!comment || !comment.trim()) {
        return res.status(400).json({ error: "Comment is required" });
      }

      const reviews = await storage.getReviews();
      const id = `rev-${Date.now().toString(36)}`;
      const newReview = {
        id,
        name: name.trim(),
        rating: ratingNum,
        comment: comment.trim(),
        bookingId: bookingId ? bookingId.trim() : null,
        createdAt: new Date().toISOString()
      };

      reviews.unshift(newReview);
      await storage.saveReviews(reviews);
      return res.status(201).json(newReview);
    } catch (err) {
      return res.status(500).json({ error: "Failed to submit review: " + err.message });
    }
  }

  res.setHeader("Allow", "GET,POST");
  res.status(405).end("Method Not Allowed");
}
