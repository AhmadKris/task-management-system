// Migration runner sederhana: baca file .sql berurutan di src/db/migrations,
// jalankan yang belum tercatat di tabel _migrations.
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const config = require('../src/config');
const logger = require('../src/config/logger');

const MIGRATIONS_DIR = path.resolve(__dirname, '../src/db/migrations');

async function ensureDatabase() {
  const conn = await mysql.createConnection({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
  });
  await conn.query(
    `CREATE DATABASE IF NOT EXISTS \`${config.db.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await conn.end();
}

async function run() {
  await ensureDatabase();

  const conn = await mysql.createConnection({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    multipleStatements: true,
  });

  await conn.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      name VARCHAR(255) NOT NULL PRIMARY KEY,
      applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB
  `);

  const [applied] = await conn.query('SELECT name FROM _migrations');
  const done = new Set(applied.map((r) => r.name));

  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  let count = 0;
  for (const file of files) {
    if (done.has(file)) continue;
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
    logger.info(`menjalankan migrasi ${file}`);
    await conn.beginTransaction();
    try {
      await conn.query(sql);
      await conn.query('INSERT INTO _migrations (name) VALUES (?)', [file]);
      await conn.commit();
      count += 1;
    } catch (err) {
      await conn.rollback();
      await conn.end();
      throw err;
    }
  }

  await conn.end();
  logger.info(count ? `${count} migrasi selesai` : 'tidak ada migrasi baru');
}

run().catch((err) => {
  logger.error(err, 'migrasi gagal');
  process.exit(1);
});
