import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

export const SELECTED_ITEM_KEY = 'selectedItem';
export const TAB_PARAM_KEY = 'tab';
export const FILTERS_META_KEY = 'filtersMeta';

const BASE_TABLE_PARAMS = ['isAscending', 'sortOrder', 'pageNumber', 'pageSize', 'searchText'];
const EXCLUDED_COLUMN_FILTER_KEYS = [TAB_PARAM_KEY, SELECTED_ITEM_KEY, 'search'];
const EXCLUDED_SEARCH_PARAM_KEYS = ['timezone', 'search'];

const URL_PARAM_ORDER = [...BASE_TABLE_PARAMS, TAB_PARAM_KEY, SELECTED_ITEM_KEY, FILTERS_META_KEY];

const removeFiltersBasedOnExclusionArray = (filters, excludedSearchParams = []) => {
  return filters
    ? Object.fromEntries(
        Object.entries(filters).filter(
          ([key, value]) => !excludedSearchParams.includes(key) && value && [].concat(value).length !== 0
        )
      )
    : {};
};

const getOrderedParams = (filterValues, exclusionList) => {
  const columnFilterKeys = Object.keys(filterValues);

  const numOfIndexesOfBaseTableParams = BASE_TABLE_PARAMS.length - 1;

  return [
    ...URL_PARAM_ORDER.slice(0, numOfIndexesOfBaseTableParams),
    ...columnFilterKeys,
    ...URL_PARAM_ORDER.slice(numOfIndexesOfBaseTableParams),
  ]
    .filter((key) => !exclusionList.includes(key))
    .sort((a, b) => a - b);
};

const getParseSelectedItem = (selectedItem) => {
  try {
    return JSON.parse(selectedItem);
  } catch {
    return null;
  }
};

const getStringifiedSelectedItem = (selectedItem) => {
  try {
    return JSON.stringify(selectedItem);
  } catch {
    return null;
  }
};

const getNormalizedFilters = (newFilters, searchParams, isQueryFn = false) => {
  const selectedItemParam = newFilters[SELECTED_ITEM_KEY] || searchParams.get(SELECTED_ITEM_KEY);
  const tabParam = searchParams.get(TAB_PARAM_KEY);
  const filtersMeta = newFilters[FILTERS_META_KEY] || searchParams.get(FILTERS_META_KEY);
  const normalizedFilters = isQueryFn ? Object.fromEntries(new URLSearchParams(newFilters).entries()) : newFilters;

  return {
    ...normalizedFilters,
    ...(tabParam && isQueryFn ? { [TAB_PARAM_KEY]: tabParam } : {}),
    ...(selectedItemParam && isQueryFn ? { [SELECTED_ITEM_KEY]: selectedItemParam } : {}),
    ...(filtersMeta && isQueryFn ? { [FILTERS_META_KEY]: filtersMeta } : {}),
  };
};

export const useInitialTableFilterSearchParams = ({
  enableURLSearchParams,
  initialFilterValues,
  initialPagination,
  initialSorting,
  excludedSearchParams,
  onModalAction,
}) => {
  const filteredInitialSearchParams = enableURLSearchParams
    ? removeFiltersBasedOnExclusionArray(initialFilterValues, [
        TAB_PARAM_KEY,
        ...EXCLUDED_SEARCH_PARAM_KEYS,
        ...excludedSearchParams,
      ])
    : {};

  const [searchParams] = useSearchParams(filteredInitialSearchParams);

  useEffect(() => {
    const selectedItem = searchParams.get(SELECTED_ITEM_KEY);
    if (enableURLSearchParams && selectedItem) {
      const parsedSelectedItem = getParseSelectedItem(selectedItem);
      onModalAction?.(parsedSelectedItem);
    }
  }, []);

  const urlParamFilters = Object.fromEntries(searchParams.entries());
  const urlColumnFilters = removeFiltersBasedOnExclusionArray(urlParamFilters, EXCLUDED_COLUMN_FILTER_KEYS);
  const { searchText, pageSize, pageNumber, isAscending, sortOrder, filtersMeta, ...columnFilters } = urlColumnFilters;
  const updatedPageSize = pageSize || initialPagination.pageSize;

  const urlSearchParamFilters = {
    searchText: searchText || '',
    pagination: pageSize || pageNumber ? { pageSize: +updatedPageSize, pageIndex: +pageNumber } : initialPagination,
    sorting: isAscending && sortOrder ? [{ desc: isAscending, id: sortOrder }] : initialSorting,
    [FILTERS_META_KEY]: filtersMeta ? getParseSelectedItem(filtersMeta) : {},
    columnFilters: columnFilters ? { ...initialFilterValues, ...columnFilters } : initialFilterValues,
  };

  return enableURLSearchParams
    ? urlSearchParamFilters
    : {
        searchText: '',
        pagination: initialPagination,
        sorting: initialSorting,
        [FILTERS_META_KEY]: {},
        columnFilters: initialFilterValues,
      };
};

export const useUpdateTableFilterSearchParams = ({ excludedSearchParams = [], enableURLSearchParams = false }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamsRef = useRef(searchParams);

  const exclusionList = [...EXCLUDED_SEARCH_PARAM_KEYS, ...excludedSearchParams];

  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  const updateUrlWithFilters = (newFilters, isQueryFn = false) => {
    if (!enableURLSearchParams) return;

    const normalizedFilters = getNormalizedFilters(newFilters, searchParamsRef.current, isQueryFn);
    const orderedParams = getOrderedParams(normalizedFilters, exclusionList);

    const newSearchParams = [...new Set(orderedParams)].reduce((acc, key) => {
      normalizedFilters[key] ? acc.set(key, normalizedFilters[key]) : acc.delete(key);
      return acc;
    }, new URLSearchParams());

    setSearchParams(newSearchParams, { replace: isQueryFn });
  };

  const updateUrlWithSelectedItem = (selectedItem) => {
    const currentSearchParamObj = Object.fromEntries(searchParamsRef.current.entries());
    const newUrlFilters = { ...currentSearchParamObj, [SELECTED_ITEM_KEY]: selectedItem };

    updateUrlWithFilters(newUrlFilters);
  };

  const handleUrlFiltersMeta = (newFilters, filterMeta) => {
    const newFiltersMeta = getStringifiedSelectedItem(filterMeta || {});
    const tabParamValue = searchParams.get(TAB_PARAM_KEY);
    const newFiltersMetaUrl = {
      ...newFilters,
      [FILTERS_META_KEY]: newFiltersMeta,
      ...(tabParamValue && { [TAB_PARAM_KEY]: tabParamValue }),
    };

    updateUrlWithFilters(newFiltersMetaUrl);
  };

  return {
    updateSearchParams: (newFilters) => updateUrlWithFilters(newFilters, true),
    // NOTE: if the selectedItem contains a lot of data,remove it; for example, in Ticket Tasks,
    // the activities and relatedEntities may be large, so they are set to empty arrays and the side bar still opens with all information
    handleModalOpenUrl: (selectedItem) =>
      updateUrlWithSelectedItem(selectedItem ? getStringifiedSelectedItem(selectedItem) : null),
    handleUrlFiltersMeta,
    searchParams,
    setSearchParams,
  };
};
