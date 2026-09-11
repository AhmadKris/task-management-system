const asyncHandler = require('../../lib/asyncHandler');
const { setRefreshCookie, clearRefreshCookie, REFRESH_COOKIE } = require('../../lib/cookies');
const service = require('./auth.service');

const ua = (req) => req.headers['user-agent'];

const register = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await service.register(req.body, ua(req));
  setRefreshCookie(res, refreshToken);
  res.status(201).json({ user, accessToken });
});

const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await service.login(req.body, ua(req));
  setRefreshCookie(res, refreshToken);
  res.json({ user, accessToken });
});

const refresh = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await service.refresh(
    req.cookies[REFRESH_COOKIE],
    ua(req)
  );
  setRefreshCookie(res, refreshToken);
  res.json({ user, accessToken });
});

const logout = asyncHandler(async (req, res) => {
  await service.logout(req.cookies[REFRESH_COOKIE]);
  clearRefreshCookie(res);
  res.status(204).end();
});

const me = asyncHandler(async (req, res) => {
  res.json({ user: await service.me(req.user.id) });
});

module.exports = { register, login, refresh, logout, me };
