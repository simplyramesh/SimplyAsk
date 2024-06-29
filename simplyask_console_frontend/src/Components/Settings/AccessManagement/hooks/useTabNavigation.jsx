import { useEffect, useState } from 'react';
import {
  useLocation, useNavigate, useParams, useSearchParams,
} from 'react-router-dom';

import { toCamelCase } from '../utils/formatters';

const useTabNavigation = (NAV_TAB_LABELS) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const [value, setValue] = useState(0);

  const tabParam = searchParams.get('tab');
  const tabParamIndex = NAV_TAB_LABELS.findIndex((tab) => toCamelCase(tab.title) === tabParam);

  const handleChange = (event, newValue) => {
    const tab = toCamelCase(NAV_TAB_LABELS[newValue].title);

    setValue(newValue);

    navigate({
      pathname: `${location.pathname}`,
      search: newValue === 0 && !tabParam ? '' : `tab=${tab}`,
    });
  };

  useEffect(() => {
    if (tabParamIndex === -1 && value !== 0) handleChange(null, 0);

    if (tabParamIndex !== -1 && tabParamIndex !== value) setValue(tabParamIndex);
  }, [tabParam, tabParamIndex, value]);

  return {
    navigate,
    onTabChange: handleChange,
    tabIndex: value,
    tabParam,
    id,
  };
};

export default useTabNavigation;
