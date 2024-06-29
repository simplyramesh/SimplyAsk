import { Popover } from '@mui/material';
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';

import CustomTableIcons from '../../../../../shared/REDISIGNED/icons/CustomTableIcons';
import css from './UsersActions.module.css';
import { useGetCurrentUser } from '../../../../../../hooks/useGetCurrentUser';

const UsersActions = ({
  row, cell, table,
}) => {
  const { currentUser } = useGetCurrentUser();

  const [open, setOpen] = useState(false);

  const anchorRef = useRef(null);

  const { id } = row.original;
  const isCurrentUser = row.original.id === currentUser.id;
  const { onChangeUserStatus } = table.options.meta;

  const statusIcon = !cell.getValue() ? 'DEACTIVATED' : 'ACTIVATED';
  const status = !cell.getValue() ? 'Deactivate' : 'Activate';

  const handleChangeUserStatus = () => {
    const parsedUserStatus = JSON.parse(JSON.stringify({ isLocked: !cell.getValue() }));

    onChangeUserStatus(id, parsedUserStatus);
    setOpen(false);
  };

  return (
    <>
      {!isCurrentUser ? (
        <div className={css.actions} onClick={() => setOpen(true)} ref={anchorRef}>
          <CustomTableIcons icon="MORE_TABLE" width={24} />
        </div>
      ) : null}
      <Popover
        open={open}
        onClose={() => setOpen(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        anchorEl={anchorRef.current}
      >
        <div className={css.actions_dropdown} onClick={handleChangeUserStatus}>
          <CustomTableIcons icon={statusIcon} width={20} />
          <p className={css.action_dropdownText}>{`${status} Account`}</p>
        </div>
      </Popover>
    </>
  );
};

export default UsersActions;

UsersActions.propTypes = {
  row: PropTypes.object,
  cell: PropTypes.object,
  table: PropTypes.object,
};
