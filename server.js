import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import path from "path";
import { fileURLToPath } from "url";

import posRouter from "./modules/pos.js";
import authRouter from "./modules/auth.js";
import dusunRouter from "./modules/dusun.js";
import regionRouter from "./modules/region.js";
import reportsRouter from "./modules/reports.js";

// ====== SETUP ======
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// database
const file = path.join(__dirname, "../db.json");
const adapter = new JSONFile(file);
const db = new Low(adapter, { users: [], pos: [], dusun: [], regions: [], reports: [] });
await db.read();
await db.write();

// ====== ROUTES ======
app.use("/auth", authRouter(db));
app.use("/pos", posRouter(db));
app.use("/dusun", dusunRouter(db));
app.use("/region", regionRouter(db));
app.use("/reports", reportsRouter(db));

// serve frontend (static)
app.use(express.static(path.join(process.cwd(), "assets")));

// run server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ SISKA-E running on http://localhost:${PORT}`)
);