import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { StyledFlex } from '../styles/styled';

import { StyledNavTabs } from './StyledNavTabs';
import Tabs from './Tabs/Tabs';

const NavTabs = ({ value, labels, onChange, size = 'large', className, action }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    const tabParam = searchParams.get('tab');

    if (!tabParam) {
      return;
    }

    const selectedTabIndex = labels.findIndex(({ value }) => value === tabParam);

    if (selectedTabIndex >= 0) {
      onChange(null, selectedTabIndex);
    }
  }, []);

  return (
    <StyledNavTabs size={size} className={className}>
      <Tabs
        className="tabs"
        tabs={labels}
        activeBarHeight="4px"
        value={value}
        onChange={(event, newValue) => {
          const tabValue = labels[newValue]?.value;

          if (tabValue) {
            setSearchParams({ tab: tabValue });
          }

          onChange(event, newValue);
        }}
      />
      {action && <StyledFlex ml="auto">{action}</StyledFlex>}
    </StyledNavTabs>
  );
};

NavTabs.propTypes = {
  ...Tabs.propTypes,
  labels: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func,
  size: PropTypes.string,
  className: PropTypes.string,
};

export default NavTabs;
