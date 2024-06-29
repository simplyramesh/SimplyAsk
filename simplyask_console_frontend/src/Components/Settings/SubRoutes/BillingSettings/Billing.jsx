import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, Modal } from 'simplexiar_react_components';

import { getBillingInfo } from '../../../../Services/axios/billing';
import { getDescriptiveDateFromDateString } from '../../../../utils/helperFunctions';
import Spinner from '../../../shared/Spinner/Spinner';
import classes from './Billing.module.css';
import CurrentInvoiceChart from './CurrentInvoiceSection/CurrentInvoiceChart/CurrentInvoiceChart';
import CurrentInvoiceSection from './CurrentInvoiceSection/CurrentInvoiceSection';
import CurrentPlanSection from './CurrentPlanSection/CurrentPlanSection';
import InvoicesSection from './CurrentPlanSection/InvoicesSection/InvoicesSection';
import ChangePaymentPlanModal from './Modals/ChangePaymentPlanModal/ChangePaymentPlanModal';
// Comment following import for now but it may be required in future
// import ChangePlanModal from './Modals/ChangePlanModal/ChangePlanModal';
import CurrentPaymentInfoModal from './Modals/CurrentPaymentInfoModal/CurrentPaymentInfoModal';
import DeleteDisableAccountModal from './Modals/DeleteDisableAccountModal/DeleteDisableAccountModal';
import UpgradeToEnterpriseModal from './Modals/UpgradeToEnterpriseModal/UpgradeToEnterpriseModal';

const NO_USAGE = 0;
const Billing = () => {
  const { data, isFetching, error } = useQuery({
    queryKey: ['billingData'],
    queryFn: getBillingInfo,
  });

  const [showChangePlanModal, setShowChangePlanModal] = useState(false);
  const [showChangePaymentModal, setShowChangePaymentModal] = useState(false);
  const [showDisableAccountModal, setShowDisableAccountModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showCurrentPaymentModal, setShowCurrentPaymentModal] = useState(false);

  useEffect(() => {
    if (data) {
      const getFilteredAdditionalCostArray = data.additionalCostBreakdown.filter(
        (item) => item.numberOfUnits !== NO_USAGE
      );

      const getFilteredTransactionalCostArray = data.transactionCostBreakdown.filter(
        (item) => item.numberOfUnits !== NO_USAGE
      );

      data.additionalCostBreakdown = getFilteredAdditionalCostArray;
      data.transactionCostBreakdown = getFilteredTransactionalCostArray;
    }
  }, [data]);

  const showChangeModal = () => {
    setShowChangePlanModal(true);
  };

  const closeChangeModal = () => {
    setShowChangePlanModal(false);
  };

  const closeChangePaymentModal = () => {
    setShowChangePaymentModal(false);
  };

  const closeDisableAccountModal = () => {
    setShowDisableAccountModal(false);
  };

  const closeDeleteAccountModal = () => {
    setShowDeleteAccountModal(false);
  };

  const closePaymentInformationModal = () => {
    setShowCurrentPaymentModal(false);
  };

  const openChangePaymentInformationModal = () => {
    closePaymentInformationModal();
    setShowChangePaymentModal(true);
  };

  const CurrentInvoice = () => {
    return (
      <Card className={classes.cardRoot}>
        <div className={classes.primaryColorHeader}>Current Invoice</div>

        <div className={classes.topBillingInfo}>
          <div>
            <div className={classes.largeBoldText}>
              Billing Period:{' '}
              <span className={classes.largeLightText}>
                {getDescriptiveDateFromDateString(data?.billingPeriodStart?.split('[')?.[0])} -{' '}
                {getDescriptiveDateFromDateString(data?.billingPeriodEnd?.split('[')?.[0])}
              </span>
            </div>
          </div>

          <div>
            <div className={classes.largeBoldText}>
              Payment Date:{' '}
              <span className={classes.largeLightText}>
                {getDescriptiveDateFromDateString(data?.billingDate?.split('[')?.[0])}
              </span>
            </div>
          </div>
        </div>

        <CurrentInvoiceChart data={data} />
        <CurrentInvoiceSection data={data} />
      </Card>
    );
  };

  const CurrentPlan = () => {
    return (
      <Card className={classes.cardRoot}>
        <div className={classes.adjustMargin}>
          <div className={classes.cardHeader}>Current Plan</div>
          <div className={classes.orangeBoldText}>Standard</div>

          <div className={classes.margin_top_20px}>
            <div className={classes.smallLightText}>
              Plan is billed monthly. The next payment will be charged on
              <span className={classes.smallBoldText}> {getDescriptiveDateFromDateString(data?.billingDate)}</span>
            </div>
          </div>

          <div className={classes.margin_top_20px}>
            <Button className={classes.changePlanBtn} onClick={showChangeModal}>
              Upgrade to Enterprise
            </Button>
          </div>

          <div className={classes.margin_top_20px_after}>
            <div className={classes.flex_row_space_between}>
              <Button className={classes.deleteAccountBtn} onClick={() => setShowDisableAccountModal(true)}>
                Disable Your Account
              </Button>

              <div className={classes.roundedDot}>
                <div />
              </div>

              <Button className={classes.deleteAccountBtn} onClick={() => setShowDeleteAccountModal(true)}>
                Delete Your Account
              </Button>
            </div>
          </div>

          <div className={classes.margin_top_15px}>
            <div className={classes.largeBoldText}>Payment Information</div>
          </div>

          <CurrentPlanSection
            setShowChangePaymentModal={setShowChangePaymentModal}
            setShowCurrentPaymentModal={setShowCurrentPaymentModal}
          />
          <InvoicesSection />
        </div>
      </Card>
    );
  };

  if (isFetching) return <Spinner global />;

  if (error) return <p>Something went wrong...</p>;

  return (
    <div className={classes.root}>
      <CurrentInvoice />
      <CurrentPlan />

      <Modal show={showChangePlanModal} modalClosed={closeChangeModal} className={classes.modal}>
        <div className={classes.closeIconParent} onClick={closeChangeModal}>
          <CloseIcon className={classes.closeIcon} />
        </div>
        <UpgradeToEnterpriseModal />
      </Modal>

      <Modal
        show={showChangePaymentModal}
        modalClosed={closeChangePaymentModal}
        className={classes.modalPaymentUpdater}
      >
        <div className={classes.closeIcon_paymentModal} onClick={closeChangePaymentModal}>
          <CloseIcon className={classes.closeIcon} />
        </div>
        <ChangePaymentPlanModal
          showChangePaymentModal={showChangePaymentModal}
          closeChangePaymentModal={closeChangePaymentModal}
        />
      </Modal>

      <Modal
        show={showCurrentPaymentModal}
        modalClosed={closePaymentInformationModal}
        className={classes.modalViewCurrentPaymentInfo}
      >
        <div className={classes.closeIcon_paymentModal} onClick={closePaymentInformationModal}>
          <CloseIcon className={classes.closeIcon} />
        </div>
        <CurrentPaymentInfoModal
          openChangePaymentInformationModal={openChangePaymentInformationModal}
          closePaymentInformationModal={closePaymentInformationModal}
        />
      </Modal>

      <Modal
        show={showDisableAccountModal}
        modalClosed={closeDisableAccountModal}
        className={classes.modalDisableDeleteAccount}
      >
        <div className={classes.closeIcon_paymentModal} onClick={closeDisableAccountModal}>
          <CloseIcon className={classes.closeIcon} />
        </div>
        <DeleteDisableAccountModal isDeleteAccount={false} closeDisableAccountModal={closeDisableAccountModal} />
      </Modal>

      <Modal
        show={showDeleteAccountModal}
        modalClosed={closeDeleteAccountModal}
        className={classes.modalDisableDeleteAccount}
      >
        <div className={classes.closeIcon_paymentModal} onClick={closeDeleteAccountModal}>
          <CloseIcon className={classes.closeIcon} />
        </div>
        <DeleteDisableAccountModal isDeleteAccount closeDeleteAccountModal={closeDeleteAccountModal} />
      </Modal>
    </div>
  );
};

export default Billing;
