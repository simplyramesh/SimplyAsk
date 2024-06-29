// import PropTypes from 'prop-types';

import css from './ApplyFiltersButton.module.css';

const ApplyFiltersButton = (props) => {
  return (
    <button
      {...props}
      type="button"
      className={css.applyFiltersButton}
    >
      Apply Filters
    </button>
  );
};

export default ApplyFiltersButton;

// ApplyFiltersButton.propTypes = {

// };
