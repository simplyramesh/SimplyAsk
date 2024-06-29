import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import BackIcon from '../../../../../../../Assets/icons/leftArrow.svg?component';
import classes from './MultiplePermissionsSwitcher.module.css';

const MultiplePermissionsSwitcher = ({ quantity, setActiveIndex }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(currentIndex);
  }, [currentIndex]);

  const changeIndex = {
    next: () => currentIndex + 1 <= quantity - 1 && setCurrentIndex(currentIndex + 1),
    prev: () => currentIndex && setCurrentIndex(currentIndex - 1),
  };

  return (
    <div className={classes.sliderHeaderHolder}>
      <div className={classes.sliderHeader}>
        <span
          className={`${classes.sliderButton} ${currentIndex <= 0 && classes.sliderButtonInvisible}`}
          onClick={changeIndex.prev}
        >
          <BackIcon width="24px" />
          Back
        </span>

        <span className={classes.sliderInfo}>
          {currentIndex + 1}
          &nbsp; out of &nbsp;
          {quantity}
          &nbsp; Permissions
        </span>

        <span
          className={`${classes.sliderButton} ${currentIndex >= quantity - 1 && classes.sliderButtonInvisible}`}
          onClick={changeIndex.next}
        >
          Next
          <BackIcon width="24px" transform="scale(-1)" />
        </span>
      </div>
    </div>
  );
};

export default MultiplePermissionsSwitcher;

MultiplePermissionsSwitcher.propTypes = {
  quantity: PropTypes.number,
  setActiveIndex: PropTypes.func,
};
