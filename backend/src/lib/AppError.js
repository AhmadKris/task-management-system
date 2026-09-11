// Error yang memang kita lempar sendiri (bukan bug). Error handler pakai flag
// isOperational buat memutuskan apakah pesan aman ditampilkan ke client.
class AppError extends Error {
  constructor(statusCode, message, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code || 'ERROR';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(msg, code) {
    return new AppError(400, msg, code || 'BAD_REQUEST');
  }

  static unauthorized(msg = 'Autentikasi diperlukan', code) {
    return new AppError(401, msg, code || 'UNAUTHORIZED');
  }

  static forbidden(msg = 'Akses ditolak', code) {
    return new AppError(403, msg, code || 'FORBIDDEN');
  }

  static notFound(msg = 'Data tidak ditemukan', code) {
    return new AppError(404, msg, code || 'NOT_FOUND');
  }

  static conflict(msg, code) {
    return new AppError(409, msg, code || 'CONFLICT');
  }
}

module.exports = AppError;
