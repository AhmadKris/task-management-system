import { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/utils';
import { FilterBar } from './FilterBar';

const baseFilters = { search: '', status: '', sort: 'createdAt', order: 'desc' };

function StatefulFilterBar({ onChange }) {
  const [filters, setFilters] = useState(baseFilters);
  return (
    <FilterBar
      filters={filters}
      onChange={(patch) => {
        setFilters((f) => ({ ...f, ...patch }));
        onChange(patch);
      }}
    />
  );
}

describe('FilterBar', () => {
  it('mengirim perubahan search ke onChange', async () => {
    const onChange = vi.fn();
    renderWithProviders(<StatefulFilterBar onChange={onChange} />);

    await userEvent.type(screen.getByPlaceholderText(/cari judul/i), 'lap');
    expect(onChange).toHaveBeenLastCalledWith({ search: 'lap' });
  });

  it('menampilkan label status yang sedang aktif', () => {
    renderWithProviders(
      <FilterBar filters={{ ...baseFilters, status: 'done' }} onChange={vi.fn()} />
    );
    expect(screen.getByText('Selesai')).toBeInTheDocument();
  });
});
