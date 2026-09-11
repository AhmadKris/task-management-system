const AppError = require('../../lib/AppError');
const repo = require('./tasks.repository');

function serialize(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    deadline: row.deadline, // string 'YYYY-MM-DD' atau null
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function list(userId, opts) {
  const { rows, total } = await repo.list(userId, opts);
  return {
    data: rows.map(serialize),
    meta: {
      page: opts.page,
      limit: opts.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / opts.limit)),
    },
  };
}

async function get(userId, id) {
  const row = await repo.findById(userId, id);
  if (!row) throw AppError.notFound('Tugas tidak ditemukan');
  return serialize(row);
}

async function create(userId, data) {
  return serialize(await repo.create(userId, data));
}

async function update(userId, id, data) {
  const row = await repo.update(userId, id, data);
  if (!row) throw AppError.notFound('Tugas tidak ditemukan');
  return serialize(row);
}

async function remove(userId, id) {
  const ok = await repo.remove(userId, id);
  if (!ok) throw AppError.notFound('Tugas tidak ditemukan');
}

module.exports = { list, get, create, update, remove };
