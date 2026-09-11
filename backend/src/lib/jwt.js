const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config');

exports.signAccessToken = (user) =>
  jwt.sign({ sub: user.id, name: user.name, email: user.email }, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessTtl,
  });

exports.verifyAccessToken = (token) => jwt.verify(token, config.jwt.accessSecret);

// Refresh token: random string yang dikirim ke client, tapi di DB cuma disimpan
// hash-nya. Jadi kalau tabel bocor, token mentah tetap tidak ketahuan.
exports.generateRefreshToken = () => crypto.randomBytes(48).toString('hex');

exports.hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');
