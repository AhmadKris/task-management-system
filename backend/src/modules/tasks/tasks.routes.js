const { Router } = require('express');
const validate = require('../../middleware/validate');
const auth = require('../../middleware/auth');
const schema = require('./tasks.schema');
const ctrl = require('./tasks.controller');

const router = Router();

// semua endpoint tugas butuh login
router.use(auth);

router.get('/', validate(schema.list), ctrl.list);
router.post('/', validate(schema.create), ctrl.create);
router.get('/:id', validate(schema.idParam), ctrl.get);
router.put('/:id', validate({ ...schema.idParam, ...schema.update }), ctrl.update);
router.delete('/:id', validate(schema.idParam), ctrl.remove);

module.exports = router;
