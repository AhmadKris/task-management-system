const { Router } = require('express');
const validate = require('../../middleware/validate');
const auth = require('../../middleware/auth');
const { authLimiter } = require('../../middleware/rateLimit');
const schema = require('./auth.schema');
const ctrl = require('./auth.controller');

const router = Router();

router.post('/register', authLimiter, validate(schema.register), ctrl.register);
router.post('/login', authLimiter, validate(schema.login), ctrl.login);
router.post('/refresh', ctrl.refresh);
router.post('/logout', ctrl.logout);
router.get('/me', auth, ctrl.me);

module.exports = router;
