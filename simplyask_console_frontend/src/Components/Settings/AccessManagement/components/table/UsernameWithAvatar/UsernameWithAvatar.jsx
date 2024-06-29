import PropTypes from 'prop-types';

import UserAvatar from '../../../../../UserAvatar';
import css from './UsernameWithAvatar.module.css';

const UsernameWithAvatar = ({ cell, table }) => {
  const { getValue, row } = cell;
  const { original } = row;

  const { meta } = table.options;

  return (
    <div className={css.row_cell} onClick={() => meta?.onUserClick(original.id)}>
      <div className={css.avatar}>
        <UserAvatar
          imgSrc={original.pfp}
          customUser={{ firstName: original.firstName, lastName: original.lastName }}
          size="34"
          color="#F57B20"
        />
      </div>
      <p className={css.cell_value}>{getValue()}</p>
    </div>
  );
};

export default UsernameWithAvatar;

UsernameWithAvatar.propTypes = {
  cell: PropTypes.shape({
    getValue: PropTypes.func,
    row: PropTypes.shape({
      original: PropTypes.shape({
        id: PropTypes.string,
        pfp: PropTypes.string,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
      }),
    }),
  }),
  table: PropTypes.shape({
    options: PropTypes.shape({
      meta: PropTypes.shape({
        onUserClick: PropTypes.func,
      }),
    }),
  }),
};
