const asyncHandler = require('../../lib/asyncHandler');
const service = require('./tasks.service');

const list = asyncHandler(async (req, res) => {
  res.json(await service.list(req.user.id, req.query));
});

const get = asyncHandler(async (req, res) => {
  res.json({ task: await service.get(req.user.id, req.params.id) });
});

const create = asyncHandler(async (req, res) => {
  res.status(201).json({ task: await service.create(req.user.id, req.body) });
});

const update = asyncHandler(async (req, res) => {
  res.json({ task: await service.update(req.user.id, req.params.id, req.body) });
});

const remove = asyncHandler(async (req, res) => {
  await service.remove(req.user.id, req.params.id);
  res.status(204).end();
});

module.exports = { list, get, create, update, remove };
