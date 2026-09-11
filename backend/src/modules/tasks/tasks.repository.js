const crypto = require('crypto');
const { query } = require('../../db/pool');

const COLS = 'id, title, description, status, deadline, created_at, updated_at';

const SORT_COLUMNS = {
  createdAt: 'created_at',
  deadline: 'deadline',
  title: 'title',
};

function buildFilter(userId, { status, search }) {
  const where = ['user_id = ?'];
  const params = [userId];
  if (status) {
    where.push('status = ?');
    params.push(status);
  }
  if (search) {
    where.push('title LIKE ?');
    params.push(`%${search}%`);
  }
  return { clause: where.join(' AND '), params };
}

async function list(userId, opts) {
  const { clause, params } = buildFilter(userId, opts);
  const sortCol = SORT_COLUMNS[opts.sort] || 'created_at';
  const order = opts.order === 'asc' ? 'ASC' : 'DESC';
  // limit & offset sudah divalidasi jadi integer (zod), aman di-inline.
  // mysql2 prepared statement rewel kalau LIMIT/OFFSET dikirim sebagai placeholder.
  const limit = Number(opts.limit);
  const offset = (Number(opts.page) - 1) * limit;

  const rows = await query(
    `SELECT ${COLS} FROM tasks WHERE ${clause}
     ORDER BY ${sortCol} ${order}, id DESC
     LIMIT ${limit} OFFSET ${offset}`,
    params
  );
  const countRows = await query(`SELECT COUNT(*) AS total FROM tasks WHERE ${clause}`, params);

  return { rows, total: countRows[0].total };
}

async function findById(userId, id) {
  const rows = await query(`SELECT ${COLS} FROM tasks WHERE id = ? AND user_id = ?`, [id, userId]);
  return rows[0] || null;
}

async function create(userId, data) {
  const id = crypto.randomUUID();
  await query(
    `INSERT INTO tasks (id, user_id, title, description, status, deadline)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      id,
      userId,
      data.title,
      data.description ?? null,
      data.status || 'pending',
      data.deadline ?? null,
    ]
  );
  return findById(userId, id);
}

async function update(userId, id, data) {
  const fields = [];
  const params = [];
  for (const key of ['title', 'description', 'status', 'deadline']) {
    if (key in data) {
      fields.push(`${key} = ?`);
      params.push(data[key]);
    }
  }
  if (!fields.length) return findById(userId, id);

  const result = await query(`UPDATE tasks SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`, [
    ...params,
    id,
    userId,
  ]);
  if (result.affectedRows === 0) return null;
  return findById(userId, id);
}

async function remove(userId, id) {
  const result = await query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);
  return result.affectedRows > 0;
}

module.exports = { list, findById, create, update, remove };
