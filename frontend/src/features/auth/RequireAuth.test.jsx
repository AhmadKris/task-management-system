import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { RequireAuth } from './RequireAuth';
import { AuthContextStub } from './authTestUtils';

function setup(status) {
  return render(
    <AuthContextStub value={{ status }}>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path="/"
            element={
              <RequireAuth>
                <div>halaman rahasia</div>
              </RequireAuth>
            }
          />
          <Route path="/login" element={<div>halaman login</div>} />
        </Routes>
      </MemoryRouter>
    </AuthContextStub>
  );
}

describe('RequireAuth', () => {
  it('mengarahkan ke login saat belum terautentikasi', () => {
    setup('anonymous');
    expect(screen.getByText('halaman login')).toBeInTheDocument();
  });

  it('menampilkan konten saat sudah terautentikasi', () => {
    setup('authenticated');
    expect(screen.getByText('halaman rahasia')).toBeInTheDocument();
  });
});
