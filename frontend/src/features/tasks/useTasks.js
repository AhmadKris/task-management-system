import { useEffect, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchTasks } from './tasksApi';

const DEFAULT_FILTERS = {
  status: '',
  search: '',
  sort: 'createdAt',
  order: 'desc',
  page: 1,
  limit: 10,
};

// debounce kecil buat input search biar nggak nembak API tiap ketik
function useDebounced(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export function useTasks() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const debouncedSearch = useDebounced(filters.search);

  const queryParams = { ...filters, search: debouncedSearch };

  const query = useQuery({
    queryKey: ['tasks', queryParams],
    queryFn: () => fetchTasks(queryParams),
    placeholderData: keepPreviousData,
  });

  function patchFilters(patch) {
    setFilters((prev) => {
      const next = { ...prev, ...patch };
      // perubahan selain page selalu balik ke halaman 1
      if (!('page' in patch)) next.page = 1;
      return next;
    });
  }

  return {
    filters,
    setFilter: patchFilters,
    resetFilters: () => setFilters(DEFAULT_FILTERS),
    tasks: query.data?.data ?? [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    refetch: query.refetch,
    queryKey: ['tasks', queryParams],
  };
}
