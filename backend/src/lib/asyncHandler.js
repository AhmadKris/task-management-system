// Bungkus handler async biar error-nya nyangkut ke error middleware
// tanpa perlu try/catch di tiap controller.
module.exports = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
