import { useState } from 'react';
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { TAB_PARAM_KEY } from './useTableFilterSearchParams';

const useTabs = (initialValue = 0) => {
  const [tabValue, setTabValue] = useState(initialValue);

  const onTabChange = (event, newValue) => {
    if (newValue === tabValue) return;

    setTabValue(newValue);
  };

  return { tabValue, onTabChange, setTabValue };
};

export const useNavTabsSearchParams = (initialTabValue = 0, navTabLabels = [], enableSaveTabFilters = false) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const tabSearchParam = searchParams.get(TAB_PARAM_KEY);
  const tabValueIndex = navTabLabels.findIndex(({ value }) => value === tabSearchParam);
  const initialTabValueParam = tabSearchParam && tabValueIndex >= 0 ? tabValueIndex : initialTabValue;

  // Some component structures require the params to be saved even though filters are applied but not in url when going back to the tab
  const [savedTabSearchParam, setSavedTabSearchParam] = useState(
    navTabLabels.map((label, i) => (i === initialTabValueParam ? searchParams.toString() : null))
  );
  const { tabValue, onTabChange } = useTabs(initialTabValueParam);

  const handleTabSearchParamChange = (event, newValue) => {
    const tabLabelValue = navTabLabels[newValue]?.value;
    const newTabParam = newValue > 0 && tabLabelValue ? { [TAB_PARAM_KEY]: tabLabelValue } : {};

    const newTabSearchParam =
      enableSaveTabFilters && savedTabSearchParam[newValue]
        ? savedTabSearchParam[newValue]
        : createSearchParams(newTabParam).toString();

    navigate({ pathname: location.pathname, search: newTabSearchParam });
    if (enableSaveTabFilters) {
      setSavedTabSearchParam((prev) =>
        prev.map((item, index) => (index === tabValue ? searchParams.toString() : item))
      );
      onTabChange(event, newValue);
    }
  };

  return {
    tabValue,
    onTabChange: handleTabSearchParamChange,
    navTabLabels: navTabLabels.map(({ title, Icon }) => ({ title, ...(Icon && { Icon }) })),
  };
};

export default useTabs;
