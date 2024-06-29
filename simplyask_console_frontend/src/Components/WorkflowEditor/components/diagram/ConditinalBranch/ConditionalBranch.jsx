import PropTypes from 'prop-types';
import React from 'react';

import diagramStyles from '../diagram.module.css';

const ConditionalBranch = ({ children }) => {
  return (
    <section className={diagramStyles.ConditionalBranch}>
      <>{children}</>
    </section>
  );
};

ConditionalBranch.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
};

export default ConditionalBranch;
