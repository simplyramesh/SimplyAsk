import classNames from 'classnames';
import PropTypes from 'prop-types';
import { memo } from 'react';

import AddIcon from '../../../../../Assets/Icons/addIcon.svg?component';
import TrashIcon from '../../../../../Assets/Icons/trashIcon.svg?component';
import css from './AddDeleteButton.module.css';

const AddDeleteButton = (props) => {
  const { onIconClick, plusIcon, deleteIcon, isIconDisabled } = props;

  return (
    <div className={css.inputIcon_container}>
      <button
        className={classNames({
          [css.iconButton]: true,
          [css.iconButton_disabled]: isIconDisabled,
        })}
        type="button"
        onClick={onIconClick}
        tabIndex="-1"
      >
        <span>
          {plusIcon && !deleteIcon && <AddIcon className={css.inputIcon} />}
          {deleteIcon && !plusIcon && <TrashIcon className={css.inputIcon} />}
        </span>
      </button>
    </div>
  );
};

export default memo(AddDeleteButton);

AddDeleteButton.propTypes = {
  onIconClick: PropTypes.func,
  plusIcon: PropTypes.bool,
  deleteIcon: PropTypes.bool,
  isIconDisabled: PropTypes.bool,
};
