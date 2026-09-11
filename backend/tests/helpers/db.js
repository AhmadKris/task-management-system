const { pool } = require('../../src/db/pool');

async function resetDb() {
  await pool.query('SET FOREIGN_KEY_CHECKS = 0');
  await pool.query('TRUNCATE TABLE refresh_tokens');
  await pool.query('TRUNCATE TABLE tasks');
  await pool.query('TRUNCATE TABLE users');
  await pool.query('SET FOREIGN_KEY_CHECKS = 1');
}

module.exports = { resetDb, pool };
