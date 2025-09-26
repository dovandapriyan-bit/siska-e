import express from "express";

export default function regionRouter(db) {
  const router = express.Router();

  // CREATE
  router.post("/", async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Nama region wajib" });
    const newRegion = { id: Date.now(), name };
    db.data.regions.push(newRegion);
    await db.write();
    res.json({ success: true, region: newRegion });
  });

  // READ ALL
  router.get("/", (req, res) => res.json(db.data.regions));

  // UPDATE
  router.put("/:id", async (req, res) => {
    const region = db.data.regions.find(r => r.id == req.params.id);
    if (!region) return res.status(404).json({ error: "Region tidak ditemukan" });
    Object.assign(region, req.body);
    await db.write();
    res.json({ success: true, region });
  });

  // DELETE
  router.delete("/:id", async (req, res) => {
    const index = db.data.regions.findIndex(r => r.id == req.params.id);
    if (index === -1) return res.status(404).json({ error: "Region tidak ditemukan" });
    db.data.regions.splice(index, 1);
    await db.write();
    res.json({ success: true });
  });

  return router;
}