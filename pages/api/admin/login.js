const { generateToken } = require("../../../lib/api-middleware/auth");

async function handler(req, res) {
  if (req.method !== "POST")
    return (
      res.setHeader("Allow", "POST") &&
      res.status(405).end("Method Not Allowed")
    );
  const body = req.body || {};
  const user = body.user || "";
  const pass = body.pass || "";

  const ADMIN_USER = process.env.ADMIN_USER || "admin";
  const ADMIN_PASS = process.env.ADMIN_PASS || "";

  if (!user || !pass)
    return res.status(400).json({ error: "Missing credentials" });
  if (user !== ADMIN_USER || pass !== ADMIN_PASS)
    return res.status(401).json({ error: "Invalid credentials" });

  const token = generateToken({ user: ADMIN_USER });
  return res.json({ ok: true, token });
}

export default handler;
