import PropTypes from 'prop-types';
import React from 'react';

import ErrorIcon from '../../Assets/icons/alertRedIcon.svg?component';
import classes from './Warning.module.css';

const Warning = ({ title = 'Feature under development', description, style, className }) => {
  return (
    <div className={`${classes.root} ${className}`} style={style}>
      <div className={classes.text}>
        <div className={classes.title}>
          <ErrorIcon inline className={classes.icon} />
          {title}
        </div>
        <div>{description}</div>
      </div>
    </div>
  );
};

export default Warning;

Warning.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
};
