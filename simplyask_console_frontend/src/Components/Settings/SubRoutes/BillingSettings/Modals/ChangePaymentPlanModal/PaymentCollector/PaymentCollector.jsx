import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { updatePaymentBillingInfo } from '../../../../../../../Services/axios/billing';
import ChargeBeePaymentCollector, { CHARGE_BEE_BILLING_DETAILS_KEYS } from '../../../../../../shared/ChargeBeePaymentCollector/ChargeBeePaymentCollector';
import { BILLING_DATA_SCHEMA, REACT_SELECT_KEYS } from '../ChangePaymentPlanModal';
import classes from './PaymentCollector.module.css';

const PaymentCollector = ({
  setStep1, setStep3,
  billingInfoCollector,
  reactSelectStates,
}) => {
  const [showEditPaymentDetailModal, setShowEditPaymentDetailModal] = useState(false);
  const [getPaymentIntent, setGetPaymentIntent] = useState();
  const [chargeBeeBillingDetails, setChargeBeeBillingDetails] = useState();
  const [initiateUpdatePaymentApi, setInitiateUpdatePaymentApi] = useState(false);
  const [disableChargeBeeLoadingAndUseParentLoader, setDisableChargeBeeLoadingAndUseParentLoader] = useState({ value: true, stopLoading: false });

  const initiateApiFunction = () => {
    setInitiateUpdatePaymentApi(true);
  };

  useEffect(() => {
    if (getPaymentIntent && initiateUpdatePaymentApi) {
      updateBillingDetailsWithBackend();
    }
  }, [getPaymentIntent, initiateUpdatePaymentApi]);

  useEffect(() => {
    if (billingInfoCollector) {
      const billingObject = {
        [CHARGE_BEE_BILLING_DETAILS_KEYS.firstName]: billingInfoCollector?.[BILLING_DATA_SCHEMA.firstName],
        [CHARGE_BEE_BILLING_DETAILS_KEYS.lastName]: billingInfoCollector?.[BILLING_DATA_SCHEMA.lastName],
        [CHARGE_BEE_BILLING_DETAILS_KEYS.addressLine1]: billingInfoCollector?.[BILLING_DATA_SCHEMA.streetAddressLine1],
        [CHARGE_BEE_BILLING_DETAILS_KEYS.addressLine2]: billingInfoCollector?.[BILLING_DATA_SCHEMA.streetAddressLine2],
        [CHARGE_BEE_BILLING_DETAILS_KEYS.city]: billingInfoCollector?.[BILLING_DATA_SCHEMA.city],
        [CHARGE_BEE_BILLING_DETAILS_KEYS.state]: reactSelectStates?.[REACT_SELECT_KEYS.provinceData]?.label,
        [CHARGE_BEE_BILLING_DETAILS_KEYS.zip]: billingInfoCollector?.[BILLING_DATA_SCHEMA.postalCode],
        [CHARGE_BEE_BILLING_DETAILS_KEYS.countryCode]: reactSelectStates?.[REACT_SELECT_KEYS.countryData]?.value,
      };

      setChargeBeeBillingDetails(billingObject);
    }
  }, [billingInfoCollector]);

  const updateBillingDetailsWithBackend = async () => {
    const customerBillingInformation = {
      cardholderFirstName: billingInfoCollector?.[BILLING_DATA_SCHEMA.firstName],
      cardholderLastName: billingInfoCollector?.[BILLING_DATA_SCHEMA.lastName],
      billingAddressLine1: billingInfoCollector?.[BILLING_DATA_SCHEMA.streetAddressLine1],
      billingAddressLine2: billingInfoCollector?.[BILLING_DATA_SCHEMA.streetAddressLine2],
      billingAddressCity: billingInfoCollector?.[BILLING_DATA_SCHEMA.city],
      billingAddressState: reactSelectStates?.[REACT_SELECT_KEYS.provinceData]?.label,
      billingAddressPostalCode: billingInfoCollector?.[BILLING_DATA_SCHEMA.postalCode],
      billingAddressCountry: reactSelectStates?.[REACT_SELECT_KEYS.countryData]?.label,
      billingAddressPhone: reactSelectStates?.[REACT_SELECT_KEYS.phoneNumberData],
      billingAddressCompanyName: billingInfoCollector?.[BILLING_DATA_SCHEMA.companyName],
      taxRegistrationNumber: billingInfoCollector?.[BILLING_DATA_SCHEMA.taxRegistrationNumber],
    };

    const customerBillingRequest = {
      customerBillingInformation,
      authorizedPaymentIntentId: getPaymentIntent,
    };

    try {
      const res = await updatePaymentBillingInfo(customerBillingRequest);

      if (res) {
        toast.success('You Payment information has been updated successfully');
        setStep3();
      }
    } catch (error) {
      toast.error('Something went wrong...');
    } finally {
      setInitiateUpdatePaymentApi(false);
      setDisableChargeBeeLoadingAndUseParentLoader((prev) => ({ ...prev, stopLoading: true }));
    }
  };

  const closeEditPaymentInfoModal = () => {
    setShowEditPaymentDetailModal(false);
  };

  return (
    <div className={classes.root}>
      <ChargeBeePaymentCollector
        previousStep={setStep1}
        NextStep={initiateApiFunction}
        isModalView
        showEditPaymentDetailModal={showEditPaymentDetailModal}
        chargeBeeBillingDetails={chargeBeeBillingDetails}
        closeEditPaymentInfoModal={closeEditPaymentInfoModal}
        setGetPaymentIntent={setGetPaymentIntent}
        disableChargeBeeLoadingAndUseParentLoader={disableChargeBeeLoadingAndUseParentLoader}
      />
    </div>
  );
};

export default PaymentCollector;

PaymentCollector.propTypes = {
  setStep1: PropTypes.func,
  setStep3: PropTypes.func,
  billingInfoCollector: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    companyName: PropTypes.string,
    taxRegistrationNumber: PropTypes.string,
    streetAddressLine1: PropTypes.string,
    streetAddressLine2: PropTypes.string,
    city: PropTypes.string,
    postalCode: PropTypes.string,
  }),
  reactSelectStates: PropTypes.shape({
    countryData: PropTypes.shape({ label: PropTypes.string, value: PropTypes.string }),
    provinceData: PropTypes.shape({ label: PropTypes.string, value: PropTypes.string }),
    phoneNumberData: PropTypes.string,
  }),
};
