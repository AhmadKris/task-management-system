const config = require('./config');
const logger = require('./config/logger');
const { pool } = require('./db/pool');
const createApp = require('./app');

const server = createApp().listen(config.port, () => {
  logger.info(`API jalan di http://localhost:${config.port} (${config.env})`);
});

async function shutdown(signal) {
  logger.info(`${signal} diterima, menutup server...`);
  server.close(async () => {
    await pool.end();
    logger.info('server & koneksi database ditutup');
    process.exit(0);
  });
  // paksa keluar kalau ada koneksi yang ngambek
  setTimeout(() => process.exit(1), 10000).unref();
}

['SIGINT', 'SIGTERM'].forEach((sig) => process.on(sig, () => shutdown(sig)));
