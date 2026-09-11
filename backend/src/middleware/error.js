const { ZodError } = require('zod');
const AppError = require('../lib/AppError');
const logger = require('../config/logger');
const config = require('../config');

function zodToFields(err) {
  const fields = {};
  for (const issue of err.issues) {
    const key = issue.path.join('.') || '_';
    if (!fields[key]) fields[key] = [];
    fields[key].push(issue.message);
  }
  return fields;
}

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  if (err instanceof ZodError) {
    return res.status(422).json({
      message: 'Validasi gagal',
      code: 'VALIDATION_ERROR',
      errors: zodToFields(err),
    });
  }

  // duplikat unique key dari MySQL -> 409
  if (err && err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ message: 'Data sudah ada', code: 'DUPLICATE' });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message, code: err.code });
  }

  logger.error(err, 'unhandled error');
  return res.status(500).json({
    message: 'Terjadi kesalahan pada server',
    code: 'INTERNAL_ERROR',
    ...(config.isProd ? {} : { detail: err.message }),
  });
};
