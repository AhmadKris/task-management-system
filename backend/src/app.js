const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const pinoHttp = require('pino-http');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const config = require('./config');
const logger = require('./config/logger');
const { pool } = require('./db/pool');
const { apiLimiter } = require('./middleware/rateLimit');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/error');
const authRoutes = require('./modules/auth/auth.routes');
const taskRoutes = require('./modules/tasks/tasks.routes');

function createApp() {
  const app = express();

  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(
    cors({
      origin: config.clientOrigin,
      credentials: true,
    })
  );
  app.use(express.json({ limit: '100kb' }));
  app.use(cookieParser());
  app.use(hpp());
  if (!config.isTest) {
    app.use(pinoHttp({ logger }));
  }

  app.get('/health', async (req, res) => {
    try {
      await pool.query('SELECT 1');
      res.json({ status: 'ok', db: 'up' });
    } catch (err) {
      res.status(503).json({ status: 'degraded', db: 'down' });
    }
  });

  const openapiPath = path.resolve(__dirname, '../../docs/openapi.yaml');
  try {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(YAML.load(openapiPath)));
  } catch {
    logger.warn('openapi.yaml belum ada, /docs dinonaktifkan');
  }

  app.use('/api/v1', apiLimiter);
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/tasks', taskRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
