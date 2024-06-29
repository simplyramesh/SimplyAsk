import PropTypes from 'prop-types';
import React from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { Button } from 'simplexiar_react_components';

import classes from './CurrentPaymentInfoModal.module.css';

const CurrentPaymentInfoModal = ({ openChangePaymentInformationModal, closePaymentInformationModal }) => {
  return (
    <div className={classes.root}>
      <div className={classes.rootHeader}>Current Payment Information</div>
      <Scrollbars className={classes.ScrollbarInfo}>
        <div className={classes.infoRoot}>
          <div className={classes.infoMain}>
            <div className={classes.left_grid}>
              <div className={classes.paymentTitle}>Billing Information</div>
              <div className={classes.billingInfoRoot}>
                <div className="">
                  Billy Bob
                </div>
                <div className="">Awesome Company</div>
                <div className="">123456789</div>
                <div className="">+1 222-333-4444</div>
                <div className="">1111 Street St.</div>
                <div className="">Vancouver, BC, V0V 0V0</div>
                <div className="">Canada</div>
              </div>
            </div>

            <div className={classes.right_grid}>
              <div className={classes.paymentTitle}>Credit Card Information</div>
              <div className={classes.cardInfoRoot}>
                <img src="" alt="" className={classes.paymentImg} />
                <div className="">
                  Billy Bob
                </div>
                <div className=""> xxxx-xxx-xxxx-1234</div>
                <div className="">123456789</div>
                <div className="">02/22</div>
                <div className="">123</div>
              </div>

            </div>

          </div>
        </div>
      </Scrollbars>
      <div className={classes.flex_row_buttons}>
        <Button className={classes.cancelBtn} onClick={closePaymentInformationModal}>
          Cancel
        </Button>
        <Button className={classes.continueBtn} type="submit" onClick={openChangePaymentInformationModal}>
          Change Information
        </Button>
      </div>
    </div>
  );
};

export default CurrentPaymentInfoModal;

CurrentPaymentInfoModal.propTypes = {
  openChangePaymentInformationModal: PropTypes.func,
  closePaymentInformationModal: PropTypes.func,
};
