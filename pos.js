import express from "express";

export default function posRouter(db) {
  const router = express.Router();

  // CREATE
  router.post("/", async (req, res) => {
    const { name, rt, rw, status, jenis, photo, coord } = req.body;
    if (!name || !rt || !rw) {
      return res.status(400).json({ error: "Data pos tidak lengkap" });
    }
    const newPos = { id: Date.now(), name, rt, rw, status, jenis, photo, coord };
    db.data.pos.push(newPos);
    await db.write();
    res.json({ success: true, pos: newPos });
  });

  // READ ALL
  router.get("/", (req, res) => res.json(db.data.pos));

  // READ ONE
  router.get("/:id", (req, res) => {
    const pos = db.data.pos.find(p => p.id == req.params.id);
    if (!pos) return res.status(404).json({ error: "Pos tidak ditemukan" });
    res.json(pos);
  });

  // UPDATE
  router.put("/:id", async (req, res) => {
    const pos = db.data.pos.find(p => p.id == req.params.id);
    if (!pos) return res.status(404).json({ error: "Pos tidak ditemukan" });
    Object.assign(pos, req.body);
    await db.write();
    res.json({ success: true, pos });
  });

  // DELETE
  router.delete("/:id", async (req, res) => {
    const index = db.data.pos.findIndex(p => p.id == req.params.id);
    if (index === -1) return res.status(404).json({ error: "Pos tidak ditemukan" });
    db.data.pos.splice(index, 1);
    await db.write();
    res.json({ success: true });
  });

  return router;
}