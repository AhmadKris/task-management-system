const rateLimit = require('express-rate-limit');
const config = require('../config');

const message = { message: 'Terlalu banyak permintaan, coba lagi nanti', code: 'RATE_LIMITED' };

// login/register gampang jadi target brute force, jadi dibatasi lebih ketat
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.isTest ? 1000 : 20,
  standardHeaders: true,
  legacyHeaders: false,
  message,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.isTest ? 10000 : 300,
  standardHeaders: true,
  legacyHeaders: false,
  message,
});

module.exports = { authLimiter, apiLimiter };
