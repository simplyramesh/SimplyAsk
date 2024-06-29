import React from 'react';
import { StyledTab, StyledTabs } from '../../styles/styled';

const Tabs = ({
  tabs = [],
  onChange,
  value,
  margin = '0px',
  activeBarHeight = '3px',
  activeBarColor,
  className,
  ...otherProps
}) => {
  const renderIcon = (Icon) => Icon && typeof Icon === 'function' ? <Icon /> : Icon;

  return (
    <StyledTabs
      value={value}
      className={className}
      onChange={onChange}
      activeBarHeight={activeBarHeight}
      activeBarColor={activeBarColor}
      {...otherProps}
    >
      {tabs.map(({ title, unread, Icon }) => (
        <StyledTab
          label={title}
          key={title}
          icon={renderIcon(Icon)}
          iconPosition="start"
          unread-count={unread === 0 ? null : unread}
        />
      ))}
    </StyledTabs>
  );
};

export default Tabs;
