const { z } = require('zod');

const password = z
  .string()
  .min(8, 'Password minimal 8 karakter')
  .regex(/[a-zA-Z]/, 'Password harus mengandung huruf')
  .regex(/[0-9]/, 'Password harus mengandung angka');

const register = {
  body: z.object({
    name: z.string().trim().min(2, 'Nama minimal 2 karakter').max(120),
    email: z.string().trim().toLowerCase().email('Format email tidak valid'),
    password,
  }),
};

const login = {
  body: z.object({
    email: z.string().trim().toLowerCase().email('Format email tidak valid'),
    password: z.string().min(1, 'Password wajib diisi'),
  }),
};

module.exports = { register, login };
