import PropTypes from 'prop-types';

import css from './NumberOfPages.module.css';

const NumberOfPages = ({
  tableDataName, start, end, total,
}) => {
  return (
    <>
      <p className={css.numberOfPages}>
        <span>Showing</span>
        <span>{start}</span>
        <span>to</span>
        <span>{end}</span>
        <span>of</span>
        <span>{total}</span>
        <span>{tableDataName}</span>
      </p>
    </>
  );
};

export default NumberOfPages;

NumberOfPages.propTypes = {
  start: PropTypes.number,
  end: PropTypes.number,
  total: PropTypes.number,
  tableDataName: PropTypes.string,
};
