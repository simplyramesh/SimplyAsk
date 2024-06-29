import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import PropTypes from 'prop-types';

import classes from './Trend.module.css';

export const Trend = ({ data }) => {
  return (
    <div>
      {data && data.trend && data.value
        ? (
          <div>
            {data.trend === 'UP'
              ? (
                <div className={classes.row}>
                  <ArrowDropUp className={classes.trendUp} />
                  <div className={classes.trendUp}>
                    {data.value}
                    %
                  </div>
                </div>
              )
              : null}
            {data.trend === 'DOWN'
              ? (
                <div className={classes.row}>
                  <ArrowDropDown className={classes.trendDown} />
                  <div className={classes.trendDown}>
                    {data.value}
                    %
                  </div>
                </div>
              )
              : null}
          </div>
        )
        : null}
    </div>
  );
};

Trend.propTypes = {
  data: PropTypes.shape({
    trend: PropTypes.string,
    value: PropTypes.number,
  }),
};
