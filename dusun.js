import express from "express";

export default function dusunRouter(db) {
  const router = express.Router();

  // CREATE
  router.post("/", async (req, res) => {
    const { name, kepala } = req.body;
    if (!name) return res.status(400).json({ error: "Nama dusun wajib" });
    const newDusun = { id: Date.now(), name, kepala };
    db.data.dusun.push(newDusun);
    await db.write();
    res.json({ success: true, dusun: newDusun });
  });

  // READ ALL
  router.get("/", (req, res) => res.json(db.data.dusun));

  // UPDATE
  router.put("/:id", async (req, res) => {
    const dusun = db.data.dusun.find(d => d.id == req.params.id);
    if (!dusun) return res.status(404).json({ error: "Dusun tidak ditemukan" });
    Object.assign(dusun, req.body);
    await db.write();
    res.json({ success: true, dusun });
  });

  // DELETE
  router.delete("/:id", async (req, res) => {
    const index = db.data.dusun.findIndex(d => d.id == req.params.id);
    if (index === -1) return res.status(404).json({ error: "Dusun tidak ditemukan" });
    db.data.dusun.splice(index, 1);
    await db.write();
    res.json({ success: true });
  });

  return router;
}