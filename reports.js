import express from "express";

export default function reportsRouter(db) {
  const router = express.Router();

  // CREATE
  router.post("/", async (req, res) => {
    const { title, content } = req.body;
    if (!title) return res.status(400).json({ error: "Judul laporan wajib" });
    const newReport = { id: Date.now(), title, content };
    db.data.reports.push(newReport);
    await db.write();
    res.json({ success: true, report: newReport });
  });

  // READ ALL
  router.get("/", (req, res) => res.json(db.data.reports));

  // UPDATE
  router.put("/:id", async (req, res) => {
    const report = db.data.reports.find(r => r.id == req.params.id);
    if (!report) return res.status(404).json({ error: "Laporan tidak ditemukan" });
    Object.assign(report, req.body);
    await db.write();
    res.json({ success: true, report });
  });

  // DELETE
  router.delete("/:id", async (req, res) => {
    const index = db.data.reports.findIndex(r => r.id == req.params.id);
    if (index === -1) return res.status(404).json({ error: "Laporan tidak ditemukan" });
    db.data.reports.splice(index, 1);
    await db.write();
    res.json({ success: true });
  });

  return router;
}