// Data contoh buat development / demo. Aman dijalankan berkali-kali (idempoten by email).
const crypto = require('crypto');
const { pool, query } = require('../src/db/pool');
const password = require('../src/lib/password');
const logger = require('../src/config/logger');

const DEMO_EMAIL = 'demo@taskmanager.test';
const DEMO_PASSWORD = 'demo1234';

const sampleTasks = [
  { title: 'Setup environment lokal', status: 'done', deadline: null },
  { title: 'Bikin wireframe halaman tugas', status: 'in-progress', deadline: '2026-09-20' },
  { title: 'Integrasi endpoint tasks ke frontend', status: 'pending', deadline: '2026-09-25' },
  { title: 'Tulis README + dokumentasi API', status: 'pending', deadline: null },
  { title: 'Rekam video demo', status: 'pending', deadline: '2026-09-28' },
];

async function run() {
  const existing = await query('SELECT id FROM users WHERE email = ?', [DEMO_EMAIL]);
  let userId = existing[0]?.id;

  if (!userId) {
    userId = crypto.randomUUID();
    await query('INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)', [
      userId,
      'Demo User',
      DEMO_EMAIL,
      await password.hash(DEMO_PASSWORD),
    ]);
    logger.info(`user demo dibuat: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
  } else {
    logger.info('user demo sudah ada, lewati');
  }

  const taskCount = await query('SELECT COUNT(*) AS n FROM tasks WHERE user_id = ?', [userId]);
  if (taskCount[0].n > 0) {
    logger.info('tugas demo sudah ada, lewati');
  } else {
    for (const t of sampleTasks) {
      await query(
        'INSERT INTO tasks (id, user_id, title, status, deadline) VALUES (?, ?, ?, ?, ?)',
        [crypto.randomUUID(), userId, t.title, t.status, t.deadline]
      );
    }
    logger.info(`${sampleTasks.length} tugas demo dibuat`);
  }

  await pool.end();
}

run().catch((err) => {
  logger.error(err, 'seed gagal');
  process.exit(1);
});
