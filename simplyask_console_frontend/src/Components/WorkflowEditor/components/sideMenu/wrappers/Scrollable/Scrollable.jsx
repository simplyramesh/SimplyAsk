import PropTypes from 'prop-types';

import css from './Scrollable.module.css';

const Scrollable = ({ children }) => {
  return (
    <div className={css.scrollable}>{children}</div>
  );
};

export default Scrollable;

Scrollable.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]),
};
