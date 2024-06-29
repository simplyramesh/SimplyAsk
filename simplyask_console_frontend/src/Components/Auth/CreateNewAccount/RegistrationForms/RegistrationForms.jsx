import { useState } from 'react';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';

import StepOnePersonalDetails from '../DataCollectionSteps/StepOnePersonalDetails/StepOnePersonalDetails';
import StepTwoOrganizationDetails from '../DataCollectionSteps/StepTwoOrganizationDetails/StepTwoOrganizationDetails';
import StepThreeBillingDetails from '../DataCollectionSteps/StepThreeBillingDetails/StepThreeBillingDetails';
import StepFourPaymentDetails from '../DataCollectionSteps/StepFourPaymentDetails/StepFourPaymentDetails';
import { ALL_STEPS } from '../../utils/constants';
import {
  STEP_1_PERSONAL_DETAILS_FORM_SCHEMA,
  STEP_2_ORGANIZATION_DETAILS_FORM_SCHEMA,
  STEP_3_BILLING_DETAILS_FORM_SCHEMA,
} from '../../constants/core';
import useCreateCustomerAccount from '../../hooks/useCreateCustomerAccount';
import StepFiveReviewData from '../DataCollectionSteps/StepFiveReviewData/StepFiveReviewData';
import classes from '../CreateNewAccount.module.css';
import { Modal } from 'simplexiar_react_components';
import { StyledFlex } from '../../../shared/styles/styled';
import Spinner from '../../../shared/Spinner/Spinner';

const RegistrationForms = ({
  setShowRecommendedPlan,
  isTelusEnvActivated,
  userAppliedPromoCode,
  onHidePromoCode,
  currentView,
  setCurrentView,
  setWorkEmail,
}) => {
  const [personalInfoStep1Collector, setPersonalInfoStep1Collector] = useState(STEP_1_PERSONAL_DETAILS_FORM_SCHEMA);
  const [organizationInfoStep2Collector, setOrganizationInfoStep2Collector] = useState(
    STEP_2_ORGANIZATION_DETAILS_FORM_SCHEMA
  );
  const [billingInfoStep3Collector, setBillingInfoStep3Collector] = useState(STEP_3_BILLING_DETAILS_FORM_SCHEMA);

  const [showEditPersonalDetailModal, setShowEditPersonalDetailModal] = useState(false);
  const [showEditOrganizationalDetailModal, setShowEditOrganizationalDetailModal] = useState(false);
  const [showEditBillingDetailModal, setShowEditBillingDetailModal] = useState(false);
  const [showEditPaymentDetailModal, setShowEditPaymentDetailModal] = useState(false);

  const [billingInfoStep3PersonalNameSelected, setBillingInfoStep3PersonalNameSelected] = useState(true);

  const [getPaymentIntent, setGetPaymentIntent] = useState();

  const [isPromotionApplied, setIsPromotionApplied] = useState(true);

  const [customerRegistrationUniqueId, setCustomerRegistrationUniqueId] = useState();

  const { createCustomerAccount, isCustomerAccountCreationLoading } = useCreateCustomerAccount({
    onSuccess: () => {
      onHidePromoCode();

      setCurrentView(ALL_STEPS.STEP_6);
      toast.success('Congratulations, your organization has been created successfully');
    },
    onError: () => {
      toast.error('Something went wrong...');
    },
  });

  const handleRemovePromotion = () => setIsPromotionApplied(false);

  const sharedFormsModalProps = {
    setCurrentView,
    customerRegistrationUniqueId,
    setCustomerRegistrationUniqueId,
  };

  const renderPersonalDetailsForm = (isModalView = false) => {
    return (
      <StepOnePersonalDetails
        personalInfoStep1Collector={personalInfoStep1Collector}
        setPersonalInfoStep1Collector={setPersonalInfoStep1Collector}
        isModalView={isModalView}
        closeEditPersonalInfoModal={() => setShowEditPersonalDetailModal(false)}
        setWorkEmail={setWorkEmail}
        {...sharedFormsModalProps}
      />
    );
  };

  const renderOrganizationDetailsForm = (isModalView = false) => {
    return (
      <StepTwoOrganizationDetails
        organizationInfoStep2Collector={organizationInfoStep2Collector}
        setOrganizationInfoStep2Collector={setOrganizationInfoStep2Collector}
        setShowRecommendedPlan={setShowRecommendedPlan}
        isModalView={isModalView}
        closeEditOrganizationalInfoModal={() => setShowEditOrganizationalDetailModal(false)}
        isTelusEnvActivated={isTelusEnvActivated}
        {...sharedFormsModalProps}
      />
    );
  };

  const renderBillingDetailsForm = (isModalView = false) => {
    return (
      <StepThreeBillingDetails
        billingInfoStep3Collector={billingInfoStep3Collector}
        setBillingInfoStep3Collector={setBillingInfoStep3Collector}
        organizationInfoStep2Collector={organizationInfoStep2Collector}
        setBillingInfoStep3PersonalNameSelected={setBillingInfoStep3PersonalNameSelected}
        isModalView={isModalView}
        closeEditBillingInfoModal={() => setShowEditBillingDetailModal(false)}
        isTelusEnvActivated={isTelusEnvActivated}
        {...sharedFormsModalProps}
      />
    );
  };

  const renderPaymentDetailsForm = () => {
    return (
      <StepFourPaymentDetails
        billingInfoStep3Collector={billingInfoStep3Collector}
        billingInfoStep3PersonalNameSelected={billingInfoStep3PersonalNameSelected}
        onPreviousButtonClick={() => setCurrentView(ALL_STEPS.STEP_3)}
        onSubmit={() => setCurrentView(ALL_STEPS.STEP_5)}
        setGetPaymentIntent={setGetPaymentIntent}
        closeEditPaymentInfoModal={() => setShowEditPaymentDetailModal(false)}
        showEditPaymentDetailModal={showEditPaymentDetailModal}
      />
    );
  };

  const renderFormsModal = () => {
    const isFormsModalOpen =
      showEditPersonalDetailModal ||
      showEditOrganizationalDetailModal ||
      showEditBillingDetailModal ||
      showEditPaymentDetailModal;

    const handleModalClose = () => {
      setShowEditPersonalDetailModal(false);
      setShowEditOrganizationalDetailModal(false);
      setShowEditBillingDetailModal(false);
      setShowEditPaymentDetailModal(false);
    };

    const isModalView = true;

    return (
      <Modal show={isFormsModalOpen} modalClosed={handleModalClose} className={classes.modal}>
        <StyledFlex className={classes.closeIcon_root} onClick={handleModalClose}>
          <CloseIcon className={classes.closeIcon} />
        </StyledFlex>
        {showEditPersonalDetailModal && renderPersonalDetailsForm(isModalView)}
        {showEditOrganizationalDetailModal && renderOrganizationDetailsForm(isModalView)}
        {showEditBillingDetailModal && renderBillingDetailsForm(isModalView)}
        {showEditPaymentDetailModal && renderPaymentDetailsForm()}
      </Modal>
    );
  };

  const renderReviewDataPage = () => {
    return (
      <>
        <StepFiveReviewData
          onPreviousButtonClick={() =>
            isTelusEnvActivated ? setCurrentView(ALL_STEPS.STEP_2) : setCurrentView(ALL_STEPS.STEP_4)
          }
          personalInfoStep1Collector={personalInfoStep1Collector}
          organizationInfoStep2Collector={organizationInfoStep2Collector}
          billingInfoStep3Collector={billingInfoStep3Collector}
          onSubmit={() =>
            createCustomerAccount({
              paymentIntent: getPaymentIntent,
              registrationId: customerRegistrationUniqueId,
              userAppliedPromoCodeId: isPromotionApplied ? userAppliedPromoCode?.id : undefined,
            })
          }
          openEditPersonalInfoModal={() => setShowEditPersonalDetailModal(true)}
          openEditOrganizationalInfoModal={() => setShowEditOrganizationalDetailModal(true)}
          openEditBillingInfoModal={() => setShowEditBillingDetailModal(true)}
          openEditPaymentInfoModal={() => setShowEditPaymentDetailModal(true)}
          userAppliedPromoCode={userAppliedPromoCode}
          onRemovePromotion={handleRemovePromotion}
        />
        {renderFormsModal()}
      </>
    );
  };

  if (isCustomerAccountCreationLoading) return <Spinner inline />;

  switch (currentView) {
    case ALL_STEPS.STEP_1:
      return renderPersonalDetailsForm();
    case ALL_STEPS.STEP_2:
      return renderOrganizationDetailsForm();
    case ALL_STEPS.STEP_3:
      return renderBillingDetailsForm();
    case ALL_STEPS.STEP_4:
      return renderPaymentDetailsForm();
    case ALL_STEPS.STEP_5:
      return renderReviewDataPage();
    default:
      return renderPersonalDetailsForm();
  }
};

export default RegistrationForms;
