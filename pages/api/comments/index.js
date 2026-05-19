const storage = require("../../../lib/api-storage")

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { postId } = req.query
    const allComments = await storage.getComments()
    
    if (postId) {
      const filtered = allComments.filter(c => c.postId === postId && c.status === 'approved')
      return res.json(filtered)
    }
    
    return res.json(allComments)
  }

  if (req.method === "POST") {
    const { postId, author, email, content } = req.body
    
    if (!postId || !author || !content) {
      return res.status(400).json({ error: "Required fields missing" })
    }

    const allComments = await storage.getComments()
    const newComment = {
      id: `c-${Date.now().toString(36)}`,
      postId,
      author,
      email,
      content,
      date: new Date().toISOString(),
      status: 'approved' // Auto-approve for demo, usually 'pending'
    }

    allComments.unshift(newComment)
    await storage.saveComments(allComments)

    // Optional: Update comment count in News?
    // For now keep it simple

    return res.status(201).json(newComment)
  }

  res.setHeader("Allow", "GET,POST")
  res.status(405).end("Method Not Allowed")
}
