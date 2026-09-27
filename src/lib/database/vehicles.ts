import * as SQLite from "expo-sqlite";
import { Vehicle } from "../types";
import { RANGER_RAPTOR } from "../vehicles";

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;
async function database() {
  if (!dbPromise) dbPromise = SQLite.openDatabaseAsync("ford-vehicles.db").then(async (db) => {
    await db.execAsync("PRAGMA journal_mode = WAL; CREATE TABLE IF NOT EXISTS vehicles (id TEXT PRIMARY KEY NOT NULL, payload TEXT NOT NULL, saved_at TEXT NOT NULL);");
    await db.runAsync("INSERT OR IGNORE INTO vehicles (id, payload, saved_at) VALUES (?, ?, ?)",
      RANGER_RAPTOR.id, JSON.stringify(RANGER_RAPTOR), new Date().toISOString());
    return db;
  }).catch((error) => { dbPromise = null; throw error; });
  return dbPromise;
}

export async function listVehicles(): Promise<Vehicle[]> {
  const db = await database();
  const rows = await db.getAllAsync<{ payload: string }>("SELECT payload FROM vehicles ORDER BY saved_at DESC");
  return rows.map((r) => JSON.parse(r.payload) as Vehicle);
}
export async function saveVehicle(vehicle: Vehicle): Promise<void> {
  const db = await database();
  await db.runAsync("INSERT OR REPLACE INTO vehicles (id, payload, saved_at) VALUES (?, ?, ?)",
    vehicle.id, JSON.stringify(vehicle), new Date().toISOString());
}
export async function deleteVehicle(id: string): Promise<void> {
  if (id === RANGER_RAPTOR.id) return;
  const db = await database();
  await db.runAsync("DELETE FROM vehicles WHERE id = ?", id);
}
