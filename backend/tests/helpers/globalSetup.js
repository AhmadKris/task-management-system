const { execFileSync } = require('child_process');
const path = require('path');

// Jalankan migrasi ke DB test sekali sebelum semua test.
module.exports = () => {
  process.env.NODE_ENV = 'test';
  execFileSync('node', [path.resolve(__dirname, '../../scripts/migrate.js')], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'test' },
  });
};
