import classnames from 'classnames';
import PropTypes from 'prop-types';

import CustomTableIcons from '../../../icons/CustomTableIcons';
import css from './HeaderCell.module.css';

const HeaderCell = ({ column, customHeader }) => {
  const { toggleSorting, getIsSorted, getCanSort } = column;

  const isSorted = getCanSort() && getIsSorted();

  const isAsc = isSorted === 'asc';
  const isDesc = isSorted === 'desc';
  const isNoSort = isSorted === false;

  const handleSort = () => {
    if (isAsc) toggleSorting('desc');
    if (isDesc) toggleSorting(false);
    if (isNoSort) toggleSorting('asc');
  };

  return (
    <>
      <p
        className={classnames({
          [css.headerCell]: true,
        })}
        onClick={isSorted ? handleSort : () => {}}
      >
        {customHeader || column.columnDef.header}
        {isNoSort && getCanSort() && <CustomTableIcons icon="SORT" width={16} color="#B5BABF" />}
        {isAsc && <CustomTableIcons icon="SORT_ASC" width={12} color="#F57B20" />}
        {isDesc && <CustomTableIcons icon="SORT_DESC" width={12} color="#F57B20" />}
      </p>
    </>
  );
};

export default HeaderCell;

HeaderCell.propTypes = {
  column: PropTypes.object,
};
