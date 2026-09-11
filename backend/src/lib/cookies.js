const config = require('../config');

const REFRESH_COOKIE = 'refresh_token';

// frontend & backend beda origin di production (mis. Render static site vs Render
// web service), jadi cookie butuh SameSite=None. Itu cuma boleh dipasang bareng
// Secure, dan Secure cuma nyala kalau memang jalan di https (COOKIE_SECURE=true).
const baseOptions = {
  httpOnly: true,
  secure: config.cookieSecure,
  sameSite: config.cookieSecure ? 'none' : 'lax',
  path: '/api/v1/auth',
};

exports.REFRESH_COOKIE = REFRESH_COOKIE;

exports.setRefreshCookie = (res, token) => {
  res.cookie(REFRESH_COOKIE, token, {
    ...baseOptions,
    maxAge: config.jwt.refreshTtlDays * 24 * 60 * 60 * 1000,
  });
};

exports.clearRefreshCookie = (res) => {
  res.clearCookie(REFRESH_COOKIE, baseOptions);
};
