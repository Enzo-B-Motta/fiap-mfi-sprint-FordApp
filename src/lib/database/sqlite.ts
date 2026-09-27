import * as SQLite from 'expo-sqlite';
import { TaskService } from '../types';

const DB_NAME = 'tasks.db';
let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync(DB_NAME).then(async (db) => {
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS tasks (
          id TEXT PRIMARY KEY NOT NULL,
          title TEXT NOT NULL,
          done INTEGER NOT NULL DEFAULT 0,
          created_at TEXT NOT NULL
        );
      `);
      return db;
    });
  }
  return dbPromise;
}

function generateId() {
  return `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

type TaskRow = { id: string; title: string; done: number; created_at: string };

export const sqliteTaskService: TaskService = {
  async list() {
    const db = await getDb();
    const rows = await db.getAllAsync<TaskRow>(
      'SELECT * FROM tasks ORDER BY created_at DESC'
    );
    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      done: row.done === 1,
      createdAt: row.created_at,
    }));
  },

  async add(title) {
    const db = await getDb();
    await db.runAsync(
      'INSERT INTO tasks (id, title, done, created_at) VALUES (?, ?, ?, ?)',
      generateId(),
      title,
      0,
      new Date().toISOString()
    );
  },

  async toggle(id, done) {
    const db = await getDb();
    await db.runAsync('UPDATE tasks SET done = ? WHERE id = ?', done ? 1 : 0, id);
  },

  async remove(id) {
    const db = await getDb();
    await db.runAsync('DELETE FROM tasks WHERE id = ?', id);
  },
};