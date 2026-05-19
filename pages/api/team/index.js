const storage = require("../../../lib/api-storage");
const { verifyAdmin } = require("../../../lib/api-middleware/auth");

export default async function handler(req, res) {
  if (req.method === "GET") {
    const items = await storage.getTeam();
    return res.json(items);
  }
  if (req.method === "POST") {
    return verifyAdmin(req, res, async () => {
      let items = await storage.getTeam();
      if (!Array.isArray(items)) items = [];
      
      const name = req.body?.name || "";
      const role = req.body?.role || "";
      if (!name.trim() || !role.trim())
        return res.status(400).json({ error: "Name and role are required" });
        
      const id = req.body?.id || `m-${Date.now().toString(36)}`;
      const item = {
        id,
        name,
        role,
        bio: req.body?.bio || "",
        image: req.body?.image || "",
        order: req.body?.order || items.length,
        status: req.body?.status || "active"
      };
      
      items.push(item);
      await storage.saveTeam(items);
      return res.json(item);
    });
  }
  res.setHeader("Allow", "GET,POST");
  res.status(405).end("Method Not Allowed");
}
