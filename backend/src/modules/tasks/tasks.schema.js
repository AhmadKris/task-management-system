const { z } = require('zod');

const STATUSES = ['pending', 'in-progress', 'done'];

const emptyToNull = (v) => (v === '' || v === undefined ? null : v);

// terima 'YYYY-MM-DD', simpan apa adanya. null berarti tanpa deadline.
const deadline = z
  .preprocess(
    emptyToNull,
    z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD')
      .nullable()
  )
  .optional();

const create = {
  body: z.object({
    title: z.string().trim().min(1, 'Judul wajib diisi').max(255),
    description: z.preprocess(emptyToNull, z.string().max(5000).nullable()).optional(),
    status: z.enum(STATUSES).default('pending'),
    deadline,
  }),
};

const update = {
  body: z
    .object({
      title: z.string().trim().min(1, 'Judul tidak boleh kosong').max(255),
      description: z.preprocess(emptyToNull, z.string().max(5000).nullable()),
      status: z.enum(STATUSES),
      deadline,
    })
    .partial()
    .refine((v) => Object.keys(v).length > 0, { message: 'Tidak ada perubahan' }),
};

const idParam = {
  params: z.object({ id: z.string().uuid('Id tidak valid') }),
};

const list = {
  query: z.object({
    status: z.enum(STATUSES).optional(),
    search: z.string().trim().max(120).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
    sort: z.enum(['createdAt', 'deadline', 'title']).default('createdAt'),
    order: z.enum(['asc', 'desc']).default('desc'),
  }),
};

module.exports = { STATUSES, create, update, idParam, list };
