const crypto = require('crypto');
const { pool, query } = require('../../db/pool');

const PUBLIC_COLS = 'id, name, email, created_at';

async function findByEmail(email) {
  const rows = await query('SELECT id, name, email, password_hash FROM users WHERE email = ?', [
    email,
  ]);
  return rows[0] || null;
}

async function findById(id) {
  const rows = await query(`SELECT ${PUBLIC_COLS} FROM users WHERE id = ?`, [id]);
  return rows[0] || null;
}

async function createUser({ name, email, passwordHash }) {
  const id = crypto.randomUUID();
  await query('INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)', [
    id,
    name,
    email,
    passwordHash,
  ]);
  return { id, name, email };
}

async function saveRefreshToken({ userId, tokenHash, userAgent, expiresAt }, conn = pool) {
  const id = crypto.randomUUID();
  await conn.execute(
    'INSERT INTO refresh_tokens (id, user_id, token_hash, user_agent, expires_at) VALUES (?, ?, ?, ?, ?)',
    [id, userId, tokenHash, userAgent || null, expiresAt]
  );
  return id;
}

async function findRefreshByHash(tokenHash) {
  const rows = await query('SELECT * FROM refresh_tokens WHERE token_hash = ?', [tokenHash]);
  return rows[0] || null;
}

async function markRefreshRevoked(id, replacedBy, conn = pool) {
  await conn.execute('UPDATE refresh_tokens SET revoked_at = NOW(), replaced_by = ? WHERE id = ?', [
    replacedBy || null,
    id,
  ]);
}

async function revokeAllForUser(userId, conn = pool) {
  await conn.execute(
    'UPDATE refresh_tokens SET revoked_at = NOW() WHERE user_id = ? AND revoked_at IS NULL',
    [userId]
  );
}

module.exports = {
  findByEmail,
  findById,
  createUser,
  saveRefreshToken,
  findRefreshByHash,
  markRefreshRevoked,
  revokeAllForUser,
};
