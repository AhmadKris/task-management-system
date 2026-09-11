import { describe, it, expect } from 'vitest';
import { taskSchema, formToPayload, taskToForm } from './taskSchema';

describe('taskSchema', () => {
  it('menolak judul kosong', () => {
    const res = taskSchema.safeParse({ title: '   ', status: 'pending' });
    expect(res.success).toBe(false);
    expect(res.error.issues[0].path).toContain('title');
  });

  it('menerima deadline kosong', () => {
    const res = taskSchema.safeParse({ title: 'Halo', status: 'done', deadline: '' });
    expect(res.success).toBe(true);
  });

  it('menolak format tanggal ngawur', () => {
    const res = taskSchema.safeParse({ title: 'Halo', status: 'done', deadline: '01-01-2026' });
    expect(res.success).toBe(false);
  });
});

describe('formToPayload', () => {
  it('mengubah string kosong jadi null', () => {
    const payload = formToPayload({
      title: ' Beli susu ',
      description: '  ',
      status: 'pending',
      deadline: '',
    });
    expect(payload).toEqual({
      title: 'Beli susu',
      description: null,
      status: 'pending',
      deadline: null,
    });
  });
});

describe('taskToForm', () => {
  it('memberi nilai default saat task null', () => {
    expect(taskToForm(null)).toEqual({
      title: '',
      description: '',
      status: 'pending',
      deadline: '',
    });
  });
});
