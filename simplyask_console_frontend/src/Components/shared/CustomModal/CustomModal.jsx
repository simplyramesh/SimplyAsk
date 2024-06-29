import Close from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, Modal } from 'simplexiar_react_components';

import Spinner from '../Spinner/Spinner';
import shared from '../styles/buttons.module.css';
import classes from './customModal.module.css';

// TODO: isLoading is included in ReportingTab component but not in this component.
const CustomModal = ({
  title,
  showModal,
  onDecline,
  onAccept,
  description,
  acceptBtnContent = 'Yes',
  declineBtnContent = 'Cancel',
  Icon = ErrorOutlineIcon,
  iconColorName,
  customControls,
  isLoading,
}) => {
  return (
    <Modal show={showModal} modalClosed={() => onDecline(false)} className={classes.modal}>
      <Close className={classes.closeIcon} onClick={onDecline} />
      <Icon className={classes.icon} color={iconColorName || 'warning'} />

      <div className={classes.title}>{title}</div>
      <div className={classes.description}>
        <div>{description}</div>
      </div>

      <div className={classes.modalButtons}>
        {customControls || (
          <>
            <Button className={`${shared.button} ${shared.black}`} onClick={onDecline}>{declineBtnContent}</Button>
            <Button className={`${shared.button} ${shared.blackFilled}`} onClick={onAccept}>{acceptBtnContent}</Button>
          </>
        )}
      </div>

      {isLoading && <Spinner parent />}
    </Modal>
  );
};

export default CustomModal;

CustomModal.propTypes = {
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  isLoading: PropTypes.bool,
  onAccept: PropTypes.func,
  onDecline: PropTypes.func,
  showModal: PropTypes.bool,
  title: PropTypes.string,
  acceptBtnContent: PropTypes.string,
  declineBtnContent: PropTypes.string,
  Icon: PropTypes.elementType,
  iconColorName: PropTypes.string,
  customControls: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType]),
  // TODO: Uncomment when isLoading is included in this component, currently included in parent component.
  // isLoading: PropTypes.bool,
};
