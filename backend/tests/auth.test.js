const request = require('supertest');
const createApp = require('../src/app');
const { resetDb, pool } = require('./helpers/db');

const app = createApp();

const credentials = {
  name: 'Budi Santoso',
  email: 'budi@example.com',
  password: 'kataSandi9',
};

beforeEach(resetDb);
afterAll(() => pool.end());

describe('auth', () => {
  test('register mengembalikan user + access token dan set cookie refresh', async () => {
    const res = await request(app).post('/api/v1/auth/register').send(credentials);

    expect(res.status).toBe(201);
    expect(res.body.user).toMatchObject({ name: credentials.name, email: credentials.email });
    expect(res.body.user.password).toBeUndefined();
    expect(res.body.accessToken).toEqual(expect.any(String));
    expect(res.headers['set-cookie'].join()).toMatch(/refresh_token=/);
  });

  test('email yang sama tidak bisa dipakai dua kali', async () => {
    await request(app).post('/api/v1/auth/register').send(credentials);
    const res = await request(app).post('/api/v1/auth/register').send(credentials);
    expect(res.status).toBe(409);
    expect(res.body.code).toBe('EMAIL_TAKEN');
  });

  test('password lemah ditolak dengan 422', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ ...credentials, password: 'pendek' });
    expect(res.status).toBe(422);
    expect(res.body.errors.password).toBeDefined();
  });

  test('login salah password mengembalikan 401 generik', async () => {
    await request(app).post('/api/v1/auth/register').send(credentials);
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: credentials.email, password: 'salahBanget1' });
    expect(res.status).toBe(401);
    expect(res.body.code).toBe('INVALID_CREDENTIALS');
  });

  test('refresh merotasi token dan menolak token lama', async () => {
    const reg = await request(app).post('/api/v1/auth/register').send(credentials);
    const cookie = reg.headers['set-cookie'];

    const first = await request(app).post('/api/v1/auth/refresh').set('Cookie', cookie);
    expect(first.status).toBe(200);
    expect(first.body.accessToken).toEqual(expect.any(String));

    // pakai cookie lama lagi -> reuse terdeteksi
    const reused = await request(app).post('/api/v1/auth/refresh').set('Cookie', cookie);
    expect(reused.status).toBe(401);
    expect(reused.body.code).toBe('REFRESH_REUSED');
  });

  test('GET /me butuh access token valid', async () => {
    const reg = await request(app).post('/api/v1/auth/register').send(credentials);
    const noToken = await request(app).get('/api/v1/auth/me');
    expect(noToken.status).toBe(401);

    const ok = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${reg.body.accessToken}`);
    expect(ok.status).toBe(200);
    expect(ok.body.user.email).toBe(credentials.email);
  });
});
