const config = require('../../config');
const { transaction } = require('../../db/pool');
const AppError = require('../../lib/AppError');
const password = require('../../lib/password');
const logger = require('../../config/logger');
const { signAccessToken, generateRefreshToken, hashToken } = require('../../lib/jwt');
const repo = require('./auth.repository');

const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email });

function refreshExpiry() {
  const d = new Date();
  d.setDate(d.getDate() + config.jwt.refreshTtlDays);
  return d;
}

async function issueTokens(user, userAgent, conn) {
  const rawRefresh = generateRefreshToken();
  await repo.saveRefreshToken(
    {
      userId: user.id,
      tokenHash: hashToken(rawRefresh),
      userAgent,
      expiresAt: refreshExpiry(),
    },
    conn
  );
  return { accessToken: signAccessToken(user), refreshToken: rawRefresh };
}

async function register({ name, email, password: plain }, userAgent) {
  const existing = await repo.findByEmail(email);
  if (existing) throw AppError.conflict('Email sudah terdaftar', 'EMAIL_TAKEN');

  const passwordHash = await password.hash(plain);
  const user = await repo.createUser({ name, email, passwordHash });
  const tokens = await issueTokens(user, userAgent);
  return { user, ...tokens };
}

async function login({ email, password: plain }, userAgent) {
  const record = await repo.findByEmail(email);
  // pesan sengaja disamakan biar tidak bocor email mana yang terdaftar
  const invalid = () => AppError.unauthorized('Email atau password salah', 'INVALID_CREDENTIALS');
  if (!record) {
    await password.verify(plain, '$2b$12$invalidinvalidinvalidinvalidinvalidinvalidin');
    throw invalid();
  }
  const ok = await password.verify(plain, record.password_hash);
  if (!ok) throw invalid();

  const user = { id: record.id, name: record.name, email: record.email };
  const tokens = await issueTokens(user, userAgent);
  return { user, ...tokens };
}

async function refresh(rawRefresh, userAgent) {
  if (!rawRefresh) throw AppError.unauthorized('Refresh token tidak ada', 'NO_REFRESH_TOKEN');

  const record = await repo.findRefreshByHash(hashToken(rawRefresh));
  if (!record) throw AppError.unauthorized('Refresh token tidak dikenal', 'REFRESH_INVALID');

  // token sudah pernah dipakai / dicabut -> kemungkinan dicuri. Cabut semua sesi user.
  if (record.revoked_at) {
    logger.warn({ userId: record.user_id }, 'refresh token reuse terdeteksi');
    await repo.revokeAllForUser(record.user_id);
    throw AppError.unauthorized('Sesi tidak valid, silakan login lagi', 'REFRESH_REUSED');
  }

  if (new Date(record.expires_at) < new Date()) {
    throw AppError.unauthorized('Sesi berakhir, silakan login lagi', 'REFRESH_EXPIRED');
  }

  const user = await repo.findById(record.user_id);
  if (!user) throw AppError.unauthorized('User tidak ditemukan', 'USER_GONE');

  // rotasi: token lama ditutup, token baru diterbitkan dalam satu transaksi
  return transaction(async (conn) => {
    const tokens = await issueTokens(user, userAgent, conn);
    await repo.markRefreshRevoked(record.id, null, conn);
    return { user: publicUser(user), ...tokens };
  });
}

async function logout(rawRefresh) {
  if (!rawRefresh) return;
  const record = await repo.findRefreshByHash(hashToken(rawRefresh));
  if (record && !record.revoked_at) {
    await repo.markRefreshRevoked(record.id, null);
  }
}

async function me(userId) {
  const user = await repo.findById(userId);
  if (!user) throw AppError.notFound('User tidak ditemukan');
  return publicUser(user);
}

module.exports = { register, login, refresh, logout, me };
