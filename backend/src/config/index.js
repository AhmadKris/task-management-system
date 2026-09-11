const path = require('path');
const { z } = require('zod');

// Saat test, .env.test dibaca lebih dulu (kalau ada) supaya bisa nunjuk DB terpisah.
// .env tetap dibaca sebagai fallback - dotenv tidak menimpa var yang sudah terisi.
const root = path.resolve(__dirname, '../..');
if (process.env.NODE_ENV === 'test') {
  require('dotenv').config({ path: path.join(root, '.env.test') });
}
require('dotenv').config({ path: path.join(root, '.env') });

// Semua env divalidasi sekali di sini. Kalau ada yang kurang / salah format,
// app langsung berhenti daripada meledak di tengah request.
const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  CLIENT_ORIGIN: z.string().url().default('http://localhost:5173'),
  LOG_LEVEL: z.string().default('info'),

  DB_HOST: z.string().default('127.0.0.1'),
  DB_PORT: z.coerce.number().default(3306),
  DB_USER: z.string().default('root'),
  DB_PASSWORD: z.string().default(''),
  DB_NAME: z.string().min(1),

  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  ACCESS_TOKEN_TTL: z.string().default('15m'),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().default(7),
  COOKIE_SECURE: z
    .enum(['true', 'false'])
    .default('false')
    .transform((v) => v === 'true'),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n');
  // eslint-disable-next-line no-console
  console.error(`Konfigurasi environment tidak valid:\n${issues}`);
  process.exit(1);
}

const env = parsed.data;

module.exports = {
  env: env.NODE_ENV,
  isProd: env.NODE_ENV === 'production',
  isTest: env.NODE_ENV === 'test',
  port: env.PORT,
  clientOrigin: env.CLIENT_ORIGIN,
  logLevel: env.LOG_LEVEL,
  db: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
  },
  jwt: {
    accessSecret: env.JWT_ACCESS_SECRET,
    refreshSecret: env.JWT_REFRESH_SECRET,
    accessTtl: env.ACCESS_TOKEN_TTL,
    refreshTtlDays: env.REFRESH_TOKEN_TTL_DAYS,
  },
  cookieSecure: env.COOKIE_SECURE,
};
