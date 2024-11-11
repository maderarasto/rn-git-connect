import { SQLiteDatabase } from "expo-sqlite";

export const DB_VERSION = 1;
export const DB_NAME = 'git_connect.db';

export async function migrateDB(db: SQLiteDatabase) {
  let { 
    user_version: currentDbVersion
  } = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version') ?? {};

  if (currentDbVersion === undefined) {
    throw new Error('Current DB version not found!');
  }

  if (currentDbVersion >= DB_VERSION) {
    return;
  }

  // First migration
  if (currentDbVersion === 0) {
    await db.execAsync(`
      CREATE TABLE connections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        account_id TEXT NOT NULL UNIQUE,
        service TEXT CHECK(service IN ('Github', 'Gitlab')) NOT NULL,
        username TEXT NOT NULL,
        fullname TEXT NOT NULL,
        expired INTEGER CHECK(expired IN (0, 1)) DEFAULT 0
      );
    `);
  }

  await db.execAsync(`PRAGMA user_version = ${DB_VERSION}`);
}