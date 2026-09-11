const AppError = require('../lib/AppError');

module.exports = (req, res, next) => {
  next(AppError.notFound(`Route ${req.method} ${req.originalUrl} tidak ada`, 'ROUTE_NOT_FOUND'));
};
