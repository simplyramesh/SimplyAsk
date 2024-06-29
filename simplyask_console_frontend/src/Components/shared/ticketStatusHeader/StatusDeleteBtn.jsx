import MoreVertIcon from '@mui/icons-material/MoreVert';
import PropTypes from 'prop-types';
import { useRef } from 'react';

import useOutsideClick from '../../../hooks/useOutsideClick';
import DeleteIcon from '../REDISIGNED/icons/CustomTableIcons';
import classes from './StatusDeleteBtn.module.css';

const StatusDeleteBtn = ({
  children,
  showDeleteBtn,
  incidentId,
  toggleShowDeleteBtn,
  handleOpenDeleteTicketModal,
  iconSize = 'medium',
  fullview,
}) => {
  const btnRef = useRef(null);
  const handleOutsideClick = () => (showDeleteBtn ? toggleShowDeleteBtn() : null);
  useOutsideClick(btnRef, handleOutsideClick);

  return (
    <>
      <div className={`${!fullview && classes.menuHeaderRight_fixed} ${classes.menuHeaderRight}`}>
        {children}
        <button onClick={toggleShowDeleteBtn} className={classes.toggleMenuButton} ref={btnRef}>
          <MoreVertIcon fontSize={iconSize} />
        </button>
      </div>

      {showDeleteBtn && (
        <button onClick={() => handleOpenDeleteTicketModal(incidentId)} className={`${!fullview ? classes.toggleDeleteButton_fixed : classes.toggleDeleteButton_absolute} ${classes.toggleDeleteButton}`}>
          <DeleteIcon icon="BIN" width={24} />
          Delete Ticket
        </button>
      )}
    </>
  );
};

export default StatusDeleteBtn;

StatusDeleteBtn.defaultProps = {
  fullview: false,
};

StatusDeleteBtn.propTypes = {
  children: PropTypes.node,
  showDeleteBtn: PropTypes.bool,
  toggleShowDeleteBtn: PropTypes.func,
  handleOpenDeleteTicketModal: PropTypes.func,
  incidentId: PropTypes.string,
  fullview: PropTypes.bool,
};
