import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { Button } from 'simplexiar_react_components';

import alertRedIcon from '../../../../../../Assets/icons/alertRedIcon.svg';
import DeleteAccountBilling from '../../../../../../Assets/icons/DeleteAccountBilling.svg';
import { MANAGER_API_KEYS } from '../../../../../../config/managerKeys';
import Spinner from '../../../../Spinner/Spinner';
import classes from './DeleteDisableElementModal.module.css';

const ACTIVATE_PROCESS_MANAGER_VALIDATION = 13;

const DeleteDisableElementModal = ({
  clickedProcess,
  runDeleteElementApi,
  isDeleteElement = true,
  isTestManagerView = false,
  isProcessManagerView = false,
  isAgentManagerView = false,
  closeDeleteElementModal,
  isLoading = false,
  validationText = 'delete process',
  activateValidationWordLength = ACTIVATE_PROCESS_MANAGER_VALIDATION,
  closeIconClick,
}) => {
  const [textInput, setTextInput] = useState('');
  const [triggerValidation, setTriggerValidation] = useState(false);

  useEffect(() => {
    if (isDeleteElement && textInput.length > activateValidationWordLength) setTriggerValidation(true);
  }, [textInput, isDeleteElement]);

  useEffect(() => {
    closeIconClick.current = handleCancel;
  }, []);

  const getElementName = () => {
    return clickedProcess?.[MANAGER_API_KEYS.DISPLAY_NAME];
  };

  const getTitle = () => {
    if (isTestManagerView) return 'Delete Test Suite';
    if (isProcessManagerView) {
      return 'Delete Process';
    }
    if (isAgentManagerView) {
      return 'Delete Agent';
    }
  };

  const getDesc = () => {
    if (isTestManagerView) return 'Test Suite';
    if (isProcessManagerView) {
      return 'Process';
    }
    if (isAgentManagerView) {
      return 'Agent';
    }
  };

  const handleDeleteElement = () => {
    setTextInput('');
    setTriggerValidation(false);
    runDeleteElementApi(clickedProcess);
  };

  const handleCancel = () => {
    setTextInput('');
    setTriggerValidation(false);

    return isDeleteElement ? closeDeleteElementModal() : closeDisableAccountModal();
  };

  if (!clickedProcess) return <Spinner fadeBgParentFixedPosition roundedBg />;

  return (
    <div className={classes.root}>
      {isLoading && <Spinner fadeBgParentFixedPosition roundedBg />}

      <Scrollbars className={classes.scrollbar}>
        <div className={classes.scrollbarRoot}>
          <div className={classes.centerImg}>
            <img src={DeleteAccountBilling} alt="" />
          </div>
          <div className={classes.title}>{getTitle()}</div>

          <div className={classes.body}>
            <div className={classes.bodyText}>
              You are about to delete <strong>{getElementName()}</strong>. Completing this action will result in the{' '}
              {getDesc()} being <strong>permanently deleted</strong> and <strong> not recoverable</strong>
            </div>
          </div>

          <div className={classes.validationText}>Type “{validationText}” in the box below to confirm</div>

          <input
            type="text"
            className={`${classes.inputText}
        ${isDeleteElement && triggerValidation && textInput !== validationText && classes.invalidInput}`}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onBlur={() => setTriggerValidation(true)}
          />

          {isDeleteElement && triggerValidation && textInput !== validationText && (
            <div className={`${classes.only_flex_row}`}>
              <div className="">
                <img src={alertRedIcon} className={classes.alertIcon} />
              </div>

              <div className={classes.invalidText}>Incorrect words detected. Type: {validationText}</div>
            </div>
          )}

          <div className={`${classes.flex_row_buttons} ${!isDeleteElement && classes.flex_row_buttons_disable}`}>
            <Button className={classes.cancelBtn} onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              className={`${classes.continueBtn} 
        ${isDeleteElement && textInput !== validationText && classes.disableContinueBtn}`}
              onClick={handleDeleteElement}
            >
              Continue
            </Button>
          </div>
        </div>
      </Scrollbars>
    </div>
  );
};

export default DeleteDisableElementModal;

DeleteDisableElementModal.propTypes = {
  isDeleteElement: PropTypes.bool,
  isLoading: PropTypes.bool,
  isTestManagerView: PropTypes.bool,
  isProcessManagerView: PropTypes.bool,
  isAgentManagerView: PropTypes.bool,
  validationText: PropTypes.string,
  closeDeleteElementModal: PropTypes.func,
  runDeleteElementApi: PropTypes.func,
  activateValidationWordLength: PropTypes.number,
  clickedProcess: PropTypes.object,
  closeIconClick: PropTypes.any,
};
