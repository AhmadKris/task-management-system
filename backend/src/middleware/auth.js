const { verifyAccessToken } = require('../lib/jwt');
const AppError = require('../lib/AppError');

// Ambil access token dari header Authorization, verifikasi, taruh user ringkas di req.user.
module.exports = (req, res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(AppError.unauthorized('Token tidak ada'));
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, name: payload.name, email: payload.email };
    next();
  } catch (err) {
    const expired = err.name === 'TokenExpiredError';
    next(
      AppError.unauthorized(
        expired ? 'Sesi berakhir, silakan login lagi' : 'Token tidak valid',
        expired ? 'TOKEN_EXPIRED' : 'TOKEN_INVALID'
      )
    );
  }
};
