import PropTypes from 'prop-types';

import classes from './CalendarComponent.module.css';

const DateCriteriaButton = ({ label, conditional, ...restProps }) => {
  return (
    <div>
      <button
        className={`${classes.montserrat_family} ${
          conditional ? classes.button_onclick_font_styling : classes.button_border_none
        }`}
        {...restProps}
      >
        {label}
      </button>
    </div>

  );
};

DateCriteriaButton.propTypes = {
  label: PropTypes.string,
  conditional: PropTypes.bool,
};

export default DateCriteriaButton;
