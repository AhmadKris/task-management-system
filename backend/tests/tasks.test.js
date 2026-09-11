const request = require('supertest');
const createApp = require('../src/app');
const { resetDb, pool } = require('./helpers/db');

const app = createApp();

async function registerUser(email) {
  const res = await request(app)
    .post('/api/v1/auth/register')
    .send({ name: 'User Tes', email, password: 'kataSandi9' });
  return res.body.accessToken;
}

const authed = (token) => ({ Authorization: `Bearer ${token}` });

beforeEach(resetDb);
afterAll(() => pool.end());

describe('tasks', () => {
  test('CRUD dasar berjalan', async () => {
    const token = await registerUser('a@example.com');

    const created = await request(app)
      .post('/api/v1/tasks')
      .set(authed(token))
      .send({ title: 'Beli kopi', description: 'buat begadang', deadline: '2026-10-01' });
    expect(created.status).toBe(201);
    const id = created.body.task.id;

    const updated = await request(app)
      .put(`/api/v1/tasks/${id}`)
      .set(authed(token))
      .send({ status: 'done' });
    expect(updated.status).toBe(200);
    expect(updated.body.task.status).toBe('done');

    const removed = await request(app).delete(`/api/v1/tasks/${id}`).set(authed(token));
    expect(removed.status).toBe(204);

    const after = await request(app).get(`/api/v1/tasks/${id}`).set(authed(token));
    expect(after.status).toBe(404);
  });

  test('title kosong ditolak 422', async () => {
    const token = await registerUser('b@example.com');
    const res = await request(app).post('/api/v1/tasks').set(authed(token)).send({ title: '  ' });
    expect(res.status).toBe(422);
    expect(res.body.errors.title).toBeDefined();
  });

  test('user tidak bisa mengakses tugas milik user lain', async () => {
    const tokenA = await registerUser('owner@example.com');
    const tokenB = await registerUser('intruder@example.com');

    const created = await request(app)
      .post('/api/v1/tasks')
      .set(authed(tokenA))
      .send({ title: 'Rahasia A' });
    const id = created.body.task.id;

    expect((await request(app).get(`/api/v1/tasks/${id}`).set(authed(tokenB))).status).toBe(404);
    expect(
      (await request(app).put(`/api/v1/tasks/${id}`).set(authed(tokenB)).send({ status: 'done' }))
        .status
    ).toBe(404);
    expect((await request(app).delete(`/api/v1/tasks/${id}`).set(authed(tokenB))).status).toBe(404);
  });

  test('filter status, search, dan pagination', async () => {
    const token = await registerUser('c@example.com');
    const titles = [
      ['Laporan mingguan', 'done'],
      ['Laporan bulanan', 'pending'],
      ['Meeting tim', 'pending'],
      ['Review PR', 'in-progress'],
    ];
    for (const [title, status] of titles) {
      await request(app).post('/api/v1/tasks').set(authed(token)).send({ title, status });
    }

    const byStatus = await request(app).get('/api/v1/tasks?status=pending').set(authed(token));
    expect(byStatus.body.data).toHaveLength(2);

    const bySearch = await request(app).get('/api/v1/tasks?search=laporan').set(authed(token));
    expect(bySearch.body.data).toHaveLength(2);

    const paged = await request(app).get('/api/v1/tasks?limit=2&page=1').set(authed(token));
    expect(paged.body.data).toHaveLength(2);
    expect(paged.body.meta).toMatchObject({ total: 4, totalPages: 2, page: 1, limit: 2 });
  });

  test('endpoint tugas menolak tanpa token', async () => {
    expect((await request(app).get('/api/v1/tasks')).status).toBe(401);
  });
});
