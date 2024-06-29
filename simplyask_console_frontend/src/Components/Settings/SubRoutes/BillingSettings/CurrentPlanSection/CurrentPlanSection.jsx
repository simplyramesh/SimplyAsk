import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'simplexiar_react_components';

import classes from './CurrentPlanSection.module.css';

function CurrentPlanSection({
  setShowChangePaymentModal,
  setShowCurrentPaymentModal,
}) {
  return (
    <div className={classes.root}>
      <div className={classes.paymentContainer}>
        <div className={classes.paymentCardContainer}>
          <div className="">
            <img src="" alt="" className={classes.cardImg} />
          </div>
          <div className={classes.paymentDetails}>
            <div className={classes.smallLightText}>James Bond </div>
            <div className={classes.smallBoldText}>xxxx-xxxx-xxxx-1234</div>
          </div>
        </div>

        <div className="">
          <div className={classes.flex_row_gap_10}>
            <Button className={classes.editPayment} onClick={() => setShowCurrentPaymentModal(true)}>View Information </Button>

            <div className={classes.roundedDot}>
              <div />
            </div>

            <Button className={classes.editPayment} onClick={() => setShowChangePaymentModal(true)}>
              Change Information
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CurrentPlanSection;

CurrentPlanSection.propTypes = {
  setShowChangePaymentModal: PropTypes.func,
  setShowCurrentPaymentModal: PropTypes.func,
};
