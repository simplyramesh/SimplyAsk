import PropTypes from 'prop-types';
import { memo } from 'react';

import classes from './DoughnutTooltip.module.css';

const DoughnutTooltip = ({
  data, position, isVisible, unBoldTooltipText,
}) => {
  return (
    <p
      className={`${classes.tooltip} ${!isVisible && classes.tooltip_invisible}`}
      style={{ ...position }}
    >
      <span className={`${classes.tooltip_chart} 
      ${unBoldTooltipText && classes.unBoldTooltipText}`}
      >
        {data[0]}

      </span>
      <span className={classes.tooltip_processes}>{data[1]}</span>
      <span className={classes.tooltip_action}>{data[2]}</span>
    </p>
  );
};

export default memo(DoughnutTooltip);

DoughnutTooltip.defaultProps = {
  data: ['', '', ''],
  isVisible: false,
};

DoughnutTooltip.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string),
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  isVisible: PropTypes.bool,
  unBoldTooltipText: PropTypes.bool,
};
