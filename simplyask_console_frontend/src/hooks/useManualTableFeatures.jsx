import { useCallback, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { IS_LOCKED_VALUES, SORT_ORDER_VALUES } from '../Components/shared/REDISIGNED/table/constants/tableConstants';

import { DEFAULT_PAGINATION } from '../Components/shared/constants/core';

const constructAllFiltersUrlSearchString = ({ columnFilters, globalFilter, sorting, pagination }) => {
  const urlSearchParams = new URLSearchParams();

  if (globalFilter && globalFilter !== '') {
    urlSearchParams.append('searchText', globalFilter);
  }

  if (sorting) {
    sorting.forEach((sort) => {
      urlSearchParams.append('sortOrder', sort.id);
      urlSearchParams.append('isAscending', !sort.desc);
    });
  }

  if (pagination && pagination.pageIndex) {
    urlSearchParams.append('pageSize', pagination.pageSize);
    urlSearchParams.append('pageNumber', pagination.pageIndex);
  }

  if (columnFilters) {
    Object.keys(columnFilters).forEach((key) => {
      if (key === 'sortOrder' || key === 'isAscending') return;

      if (columnFilters[key] && columnFilters[key] !== '') {
        urlSearchParams.append(key, columnFilters[key]);
      }
    });
  }

  return urlSearchParams.toString();
};

const DEFAULT_INIT_STATE = {
  editedAfter: '',
  editedBefore: '',
  createdAfter: '',
  createdBefore: '',
  timezone: '',
  roles: [], // List<string> UUID's of UserGroups
  isLocked: IS_LOCKED_VALUES.EMPTY,
  sortOrder: SORT_ORDER_VALUES.MODIFIED_DATE,
  pageSize: DEFAULT_PAGINATION?.PAGE_SIZE,
  pageNumber: DEFAULT_PAGINATION?.PAGE_NUMBER,
};

const useManualTableFeatures = (queryKey, queryFunction, initialState, queryParams = [], enabled = true) => {
  const [columnFilters, setColumnFilters] = useState(initialState || DEFAULT_INIT_STATE);
  const [globalFilter, setGlobalFilter] = useState(''); // searchText
  const [sorting, setSorting] = useState([
    {
      id: initialState?.sortOrder || DEFAULT_INIT_STATE.sortOrder,
      desc: !initialState?.isAscending,
    },
  ]);
  const [pagination, setPagination] = useState({
    pageIndex: initialState?.pageNumber || DEFAULT_INIT_STATE.pageNumber,
    pageSize: initialState?.pageSize || DEFAULT_INIT_STATE.pageSize,
  });

  const { data, isError, isFetching, isLoading, refetch } = useQuery({
    queryKey: [
      queryKey || 'default',
      columnFilters,
      globalFilter, // searchText
      pagination.pageIndex, // pageNumber
      pagination.pageSize,
      sorting,
      ...queryParams,
    ],
    queryFn: () =>
      queryFunction(
        constructAllFiltersUrlSearchString({
          columnFilters,
          globalFilter,
          sorting,
          pagination,
        }),
        queryParams
      ),
    enabled: enabled && !!queryFunction && !!queryKey,
    placeholderData: keepPreviousData,
  });

  const onSearch = useCallback((searchText) => {
    setGlobalFilter(searchText);
    setPagination({
      pageIndex: DEFAULT_INIT_STATE.pageNumber,
      pageSize: DEFAULT_INIT_STATE.pageSize,
    });
  }, []);

  return {
    data,
    isError,
    isFetching,
    isLoading,
    columnFilters,
    setColumnFilters,
    globalFilter,
    setGlobalFilter,
    sorting,
    setSorting,
    pagination,
    setPagination,
    onSearch,
    refetch,
  };
};

export default useManualTableFeatures;
