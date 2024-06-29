import PropTypes from 'prop-types';
import { useState } from 'react';

import EditAltIcon from '../../../../../../Assets/Icons/editAlt.svg?component';
import MoreIcon from '../../../../../../Assets/Icons/moreHorizontal.svg?component';
import TrashIcon from '../../../../../../Assets/Icons/trashIcon.svg?component';
import { Typography } from '../../../../base';
import { Heading } from '../../../../sub';
import { DropdownMenu } from '../../../../wrappers';
import css from './ParamSetHeading.module.css';

const ParamSetHeading = ({ paramGroupName, onEdit, onDelete, disableActions = false }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleEvent = (e) => {
    e.stopPropagation();

    if (onDelete && e.target.id === 'deleteBtn') onDelete(e);
    if (onEdit && e.target.id === 'editBtn') onEdit(e);

    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <>
      <div className={css.paramSet_heading}>
        <Heading as="h4" size={paramGroupName?.length > 16 ? 'small' : 'default'} withIcon>
          {paramGroupName}
        </Heading>
        {!disableActions && (
          <div className={css.iconMenu}>
            <span className={css.moreIcon} onClick={handleEvent}>
              <MoreIcon />
            </span>

            <div className={css.dropdown}>
              <DropdownMenu isDropdownOpen={isDropdownOpen} fitContent testEditor>
                <div className={css.menu_items}>
                  <button type="button" id="editBtn" name="editBtn" className={css.btn_text} onClick={handleEvent}>
                    <span className={css.editIcon}>
                      <EditAltIcon />
                    </span>
                    <Typography as="span" weight="medium" variant="small">
                      Edit Parameter Set
                    </Typography>
                  </button>
                  <button type="button" id="deleteBtn" name="deleteBtn" className={css.btn_text} onClick={handleEvent}>
                    <span className={css.trashIcon}>
                      <TrashIcon />
                    </span>
                    <Typography as="span" weight="medium" variant="small">
                      Delete Parameter Set
                    </Typography>
                  </button>
                </div>
              </DropdownMenu>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ParamSetHeading;

ParamSetHeading.propTypes = {
  paramGroupName: PropTypes.string,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};
