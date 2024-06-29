import PropTypes from 'prop-types';
import React from 'react';

const TabPanel = ({
  children, value, index, ...other
}) => {
  return (
    <div
      style={{ height: '100%' }}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
  index: PropTypes.number,
  value: PropTypes.number,
};

export default TabPanel;
