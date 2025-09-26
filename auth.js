import express from "express";

export default function authRouter(db) {
  const router = express.Router();

  // REGISTER
  router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Data tidak lengkap" });
    }
    const exists = db.data.users.find(u => u.username === username);
    if (exists) return res.status(400).json({ error: "User sudah ada" });

    const newUser = { id: Date.now(), username, password };
    db.data.users.push(newUser);
    await db.write();
    res.json({ success: true, user: newUser });
  });

  // LOGIN
  router.post("/login", (req, res) => {
    const { username, password } = req.body;
    const user = db.data.users.find(u => u.username === username && u.password === password);
    if (!user) return res.status(401).json({ error: "Login gagal" });
    res.json({ success: true, user });
  });

  // LIST USERS
  router.get("/", (req, res) => res.json(db.data.users));

  return router;
}