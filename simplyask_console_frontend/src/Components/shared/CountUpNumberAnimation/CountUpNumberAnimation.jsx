import PropTypes from 'prop-types';
import React from 'react';
import CountUp from 'react-countup';

const COUNT_UP_CONFIG = {
  START_NUMBER: 0,
  DURATION: 1.15,
};

const CountUpNumberAnimation = ({ number = 0, className }) => {
  return (
    <CountUp
      className={className}
      start={COUNT_UP_CONFIG.START_NUMBER}
      end={number}
      duration={COUNT_UP_CONFIG.DURATION}
    />
  );
};

export default CountUpNumberAnimation;

CountUpNumberAnimation.propTypes = {
  number: PropTypes.number,
  className: PropTypes.string,
};
