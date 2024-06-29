import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { Button } from 'simplexiar_react_components';

import alertRedIcon from '../../../../../../Assets/icons/alertRedIcon.svg?component';
import DeleteAccountBilling from '../../../../../../Assets/icons/DeleteAccountBilling.svg';
import DisableAccountBilling from '../../../../../../Assets/icons/DisableAccountBilling.svg';
import classes from './DeleteDisableAccountModal.module.css';

const DeleteDisableAccountModal = ({ isDeleteAccount = false, closeDisableAccountModal, closeDeleteAccountModal }) => {
  const [textInput, setTextInput] = useState('');
  const [triggerValidation, setTriggerValidation] = useState(false);

  useEffect(() => {
    if (isDeleteAccount && textInput.length > 13) setTriggerValidation(true);
    if (!isDeleteAccount && textInput.length > 14) setTriggerValidation(true);
  }, [textInput, isDeleteAccount]);

  const handleClose = () => {
    setTextInput('');
    setTriggerValidation(false);

    return isDeleteAccount ? closeDeleteAccountModal() : closeDisableAccountModal();
  };

  return (
    <div className={classes.root}>
      <Scrollbars className={classes.scrollbar}>
        <div className={classes.scrollbarRoot}>
          <div className={classes.centerImg}>
            <img src={isDeleteAccount ? DeleteAccountBilling : DisableAccountBilling} alt="" />
          </div>
          <div className={classes.title}>{isDeleteAccount ? 'Delete Account?' : 'Disable Account?'}</div>

          <div className={classes.body}>
            {isDeleteAccount ? (
              <div className={classes.bodyText}>
                All of their data, including payment info, files, workflows, and IVAs will be lost and not recoverable.
                Are you sure?
              </div>
            ) : (
              <div className={classes.bodyText}>
                You will not be able to use your account anymore until it is reactivated by customer service. If you do
                not reactivate in <strong>90 days</strong>, all of your data will be <strong>deleted</strong>. Are you
                sure?
              </div>
            )}
          </div>

          <div className={classes.validationText}>
            {isDeleteAccount
              ? 'Type “delete account” in the box below to confirm'
              : 'Type “disable account” in the box below to confirm'}
          </div>

          <input
            type="text"
            className={`${classes.inputText}
        ${!isDeleteAccount && triggerValidation && textInput !== 'disable account' && classes.invalidInput}
        ${isDeleteAccount && triggerValidation && textInput !== 'delete account' && classes.invalidInput}`}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />

          {!isDeleteAccount && triggerValidation && textInput !== 'disable account' && (
            <div className={`${classes.only_flex_row}`}>
              <div className="">
                <img src={alertRedIcon} className={classes.alertIcon} />
              </div>

              <div className={classes.invalidText}>Incorrect words detected. Type: disable account</div>
            </div>
          )}

          {isDeleteAccount && triggerValidation && textInput !== 'delete account' && (
            <div className={`${classes.only_flex_row}`}>
              <div className="">
                <img src={alertRedIcon} className={classes.alertIcon} />
              </div>

              <div className={classes.invalidText}>Incorrect words detected. Type: delete account</div>
            </div>
          )}

          <div className={`${classes.flex_row_buttons} ${!isDeleteAccount && classes.flex_row_buttons_disable}`}>
            <Button className={classes.cancelBtn} onClick={handleClose}>
              Cancel
            </Button>
            <Button
              className={`${classes.continueBtn} 
        ${isDeleteAccount && textInput !== 'delete account' && classes.disableContinueBtn}
        ${!isDeleteAccount && textInput !== 'disable account' && classes.disableContinueBtn}`}
            >
              Continue
            </Button>
          </div>
        </div>
      </Scrollbars>
    </div>
  );
};

export default DeleteDisableAccountModal;

DeleteDisableAccountModal.propTypes = {
  isDeleteAccount: PropTypes.bool,
  closeDisableAccountModal: PropTypes.func,
  closeDeleteAccountModal: PropTypes.func,
};
