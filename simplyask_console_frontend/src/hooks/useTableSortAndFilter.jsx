import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { FILTERS_META_KEY, useInitialTableFilterSearchParams } from './useTableFilterSearchParams';

const searchQueryBuilder = ({
  pagination: { pageSize, pageIndex: pageNumber },
  columnFilters,
  searchText,
  sorting,
}) => {
  const sort = sorting[0];
  const sortOrder = sort ? sort.id : '';
  const isAscending = sort ? !sort.desc : '';

  const urlSearchParams = new URLSearchParams({
    searchText,
    pageSize,
    pageNumber,
    isAscending,
    ...(sortOrder ? { sortOrder } : {}),
    ...columnFilters,
  });

  return urlSearchParams.toString();
};

export const useTableSortAndFilter = ({
  queryFn,
  queryKey = 'table-data',
  options = {},
  pageIndex = 0,
  pageSize = 25,
  initialFilters = {},
  initialSorting = [
    {
      id: '',
      desc: false,
    },
  ],
  debounceTime = 300,
  keyRef = { current: {} },
  enableURLSearchParams = false,
  excludedSearchParams = [],
  onModalAction,
  updateSearchParams,
}) => {
  const [initialLoad, setInitialLoad] = useState(false);

  const urlSearchParamFilters = useInitialTableFilterSearchParams({
    enableURLSearchParams,
    initialFilterValues: initialFilters,
    initialPagination: { pageIndex, pageSize },
    initialSorting,
    excludedSearchParams,
    onModalAction,
  });

  const [selectedFiltersBar, setSelectedFiltersBar] = useState(urlSearchParamFilters[FILTERS_META_KEY]);
  const [columnFilters, setColumnFilters] = useState(urlSearchParamFilters.columnFilters);
  const [searchText, setSearchText] = useState(urlSearchParamFilters.searchText);
  const [sorting, setSorting] = useState(urlSearchParamFilters.sorting);
  const [pagination, setPagination] = useState(urlSearchParamFilters.pagination);

  const [debouncedSearchText] = useDebounce(searchText, debounceTime);
  const [debouncedColumnFilter] = useDebounce(columnFilters, debounceTime);

  useEffect(() => {
    if (!initialLoad && enableURLSearchParams) {
      const {
        pagination: { pageSize: searchParamPageSize, pageIndex: pageNumber },
      } = urlSearchParamFilters;
      const updatedPageSize = searchParamPageSize || pageSize;
      setPagination({
        pageIndex: pageNumber,
        pageSize: updatedPageSize,
      });

      setInitialLoad(true);
    }
  }, [urlSearchParamFilters]);

  keyRef.current = [
    queryKey,
    debouncedColumnFilter,
    debouncedSearchText,
    pagination.pageIndex,
    pagination.pageSize,
    JSON.stringify(sorting),
  ];

  const { data, isError, isFetching, isLoading, refetch, ...rest } = useQuery({
    queryKey: [
      ...(Array.isArray(queryKey) ? queryKey : [queryKey]),
      debouncedColumnFilter,
      debouncedSearchText,
      pagination.pageIndex,
      pagination.pageSize,
      JSON.stringify(sorting),
    ],
    queryFn: ({ signal }) => {
      const searchParams = searchQueryBuilder({
        columnFilters: debouncedColumnFilter,
        searchText: debouncedSearchText,
        sorting,
        pagination,
      });

      updateSearchParams?.(searchParams);

      return queryFn(searchParams, signal);
    },
    placeholderData: keepPreviousData,
    ...options,
    enabled: options?.enabled && (!enableURLSearchParams || initialLoad),
  });

  useEffect(() => {
    if (enableURLSearchParams && !initialLoad) refetch();
  }, [enableURLSearchParams]);

  return {
    columnFilters,
    setColumnFilters,
    selectedFiltersBar,
    setSelectedFiltersBar,
    searchText,
    setSearchText,
    sorting,
    setSorting,
    pagination,
    setPagination,
    data,
    isError,
    isFetching,
    isLoading,
    refetch,
    ...rest,
  };
};
