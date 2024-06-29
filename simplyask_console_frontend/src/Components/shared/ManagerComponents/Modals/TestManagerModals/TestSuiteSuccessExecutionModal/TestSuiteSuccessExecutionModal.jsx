import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'simplexiar_react_components';

import routes from '../../../../../../config/routes';
import classes from './TestSuiteSuccessExecutionModal.module.css';

const TestSuiteSuccessExecutionModal = ({ setShowTestExecutionSuccessModal }) => {
  const navigate = useNavigate();

  return (
    <div className={classes.root}>
      <div className={classes.closeIconRoot} onClick={() => setShowTestExecutionSuccessModal(false)}>
        <CloseIcon className={classes.closeIconSvg} />
      </div>

      <div className={classes.infoOutlinedIconRoot}>
        <CheckCircleOutlineRoundedIcon className={classes.successOutlinedIcon} />
      </div>

      <div className={classes.are_you_sure}>
        Your Test Suite is Currently Being Executed!
      </div>

      <div className={classes.content}>
        You can view the execution progress on the Test History page, or return to the Test Manager
      </div>

      <div className={`${classes.flex_row_buttons}`}>
        <Button
          className={classes.backButton}
          onClick={() => setShowTestExecutionSuccessModal(false)}
        >
          Return to Test Manager
        </Button>
        <Button
          className={classes.continueBtn}
          type="submit"
          onClick={() => {
            navigate(`${routes.TEST_HISTORY}`);
          }}
        >
          View in Test History
        </Button>
      </div>
    </div>
  );
};

export default TestSuiteSuccessExecutionModal;

TestSuiteSuccessExecutionModal.propTypes = {
  setShowTestExecutionSuccessModal: PropTypes.func,
};
