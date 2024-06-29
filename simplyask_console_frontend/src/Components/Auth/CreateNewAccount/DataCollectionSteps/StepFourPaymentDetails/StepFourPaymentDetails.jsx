import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import ChargeBeePaymentCollector, { CHARGE_BEE_BILLING_DETAILS_KEYS } from '../../../../shared/ChargeBeePaymentCollector/ChargeBeePaymentCollector';
import { STEP_3_BILLING_DETAILS_SCHEMA_KEYS } from '../../../constants/core';

const StepFourPaymentDetails = ({
  onPreviousButtonClick,
  onSubmit,
  showEditPaymentDetailModal,
  isMainViewContentScrollable,
  billingInfoStep3Collector,
  closeEditPaymentInfoModal = () => {},
  billingInfoStep3PersonalNameSelected,
  setGetPaymentIntent,
  setLoadingTransparentApi = () => {},
}) => {
  const [chargeBeeBillingDetails, setChargeBeeBillingDetails] = useState();

  const isTelusEnvActivated = import.meta.env.VITE_IS_TELUS_ENV_ACTIVATED;

  useEffect(() => {
    if (billingInfoStep3Collector) {
      const billingObject = {
        [CHARGE_BEE_BILLING_DETAILS_KEYS.firstName]: billingInfoStep3PersonalNameSelected ? billingInfoStep3Collector[STEP_3_BILLING_DETAILS_SCHEMA_KEYS.firstName]
          : billingInfoStep3Collector[STEP_3_BILLING_DETAILS_SCHEMA_KEYS.companyName],
        [CHARGE_BEE_BILLING_DETAILS_KEYS.lastName]: billingInfoStep3PersonalNameSelected ? billingInfoStep3Collector[STEP_3_BILLING_DETAILS_SCHEMA_KEYS.lastName]
          : billingInfoStep3Collector[STEP_3_BILLING_DETAILS_SCHEMA_KEYS.companyName],
        [CHARGE_BEE_BILLING_DETAILS_KEYS.addressLine1]: billingInfoStep3Collector[STEP_3_BILLING_DETAILS_SCHEMA_KEYS.streetAddressLine1],
        [CHARGE_BEE_BILLING_DETAILS_KEYS.addressLine2]: billingInfoStep3Collector[STEP_3_BILLING_DETAILS_SCHEMA_KEYS.streetAddressLine2],
        [CHARGE_BEE_BILLING_DETAILS_KEYS.city]: billingInfoStep3Collector[STEP_3_BILLING_DETAILS_SCHEMA_KEYS.city],
        [CHARGE_BEE_BILLING_DETAILS_KEYS.state]: billingInfoStep3Collector[STEP_3_BILLING_DETAILS_SCHEMA_KEYS.provinceData]?.value,
        [CHARGE_BEE_BILLING_DETAILS_KEYS.zip]: billingInfoStep3Collector[STEP_3_BILLING_DETAILS_SCHEMA_KEYS.postalCode],
        [CHARGE_BEE_BILLING_DETAILS_KEYS.countryCode]: billingInfoStep3Collector[STEP_3_BILLING_DETAILS_SCHEMA_KEYS.countryData]?.value,
      };

      setChargeBeeBillingDetails(billingObject);
    }
  }, [billingInfoStep3Collector]);

  return (
    <>
      {!isTelusEnvActivated
      && (
        <ChargeBeePaymentCollector
          previousStep={onPreviousButtonClick}
          NextStep={onSubmit}
          isEditModalView={showEditPaymentDetailModal}
          showEditPaymentDetailModal={showEditPaymentDetailModal}
          isMainViewContentScrollable={isMainViewContentScrollable}
          chargeBeeBillingDetails={chargeBeeBillingDetails}
          closeEditPaymentInfoModal={closeEditPaymentInfoModal}
          setGetPaymentIntent={setGetPaymentIntent}
          setLoadingTransparentApi={setLoadingTransparentApi}
        />
      )}
    </>
  );
};

export default StepFourPaymentDetails;

StepFourPaymentDetails.propTypes = {
  setStep3: PropTypes.func,
  setStep5: PropTypes.func,
  closeEditPaymentInfoModal: PropTypes.func,
  setLoadingTransparentApi: PropTypes.func,
  setGetPaymentIntent: PropTypes.func,
  showEditPaymentDetailModal: PropTypes.bool,
  isMainViewContentScrollable: PropTypes.bool,
  billingInfoStep3PersonalNameSelected: PropTypes.bool,

  billingInfoStep3Collector: PropTypes.shape({
    [STEP_3_BILLING_DETAILS_SCHEMA_KEYS?.firstName]: PropTypes.string,
    [STEP_3_BILLING_DETAILS_SCHEMA_KEYS?.lastName]: PropTypes.string,
    [STEP_3_BILLING_DETAILS_SCHEMA_KEYS?.countryData]: PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
    [STEP_3_BILLING_DETAILS_SCHEMA_KEYS?.streetAddressLine1]: PropTypes.string,
    [STEP_3_BILLING_DETAILS_SCHEMA_KEYS?.streetAddressLine2]: PropTypes.string,
    [STEP_3_BILLING_DETAILS_SCHEMA_KEYS?.city]: PropTypes.string,
    [STEP_3_BILLING_DETAILS_SCHEMA_KEYS?.provinceData]: PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
    [STEP_3_BILLING_DETAILS_SCHEMA_KEYS?.postalCode]: PropTypes.string,
    [STEP_3_BILLING_DETAILS_SCHEMA_KEYS?.billingPhoneNumbersData]: PropTypes.string,
  }),
};
