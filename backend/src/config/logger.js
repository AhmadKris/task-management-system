const pino = require('pino');
const config = require('./index');

const logger = pino({
  level: config.isTest ? 'silent' : config.logLevel,
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', '*.password', '*.password_hash'],
    remove: true,
  },
  transport: config.isProd
    ? undefined
    : { target: 'pino-pretty', options: { translateTime: 'HH:MM:ss', ignore: 'pid,hostname' } },
});

module.exports = logger;
