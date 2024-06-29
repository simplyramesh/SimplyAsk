import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@emotion/react';

import EditPencilOnlyIcon from '../../../../../Assets/icons/editPencilOnlyIcon.svg?component';

import {
  STEP_1_PERSONAL_DETAILS_SCHEMA_KEYS,
  STEP_2_ORGANIZATION_DETAILS_SCHEMA_KEYS,
  STEP_3_BILLING_DETAILS_SCHEMA_KEYS,
} from '../../../constants/core';

import { StyledDivider, StyledEmptyValue, StyledFlex, StyledText } from '../../../../shared/styles/styled';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomScrollbar from '../../../../shared/REDISIGNED/layouts/CustomScrollbar/CustomScrollbar';
import { HelpOutlineOutlined } from '@mui/icons-material';
import { StyledTooltip } from '../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import Checkbox from '../../../../shared/REDISIGNED/controls/Checkbox/Checkbox';
import { StyledTextHyperLink } from '../../../../Settings/Components/FrontOffice/components/ChatWidget/ChatWidgetCreateOrEdit/ChatWidgetPreview/ChatWidgetView/components/shared/styles/styled';
import { StyledRegistrationEditModalCard, StyledUserPromoCard } from './StyledStepFiveReviewData';
import { StyledRegistrationFormsContainer, StyledRegistrationHeaderFooter } from '../../StyledCreateNewAccount';
import { SIMPLYASK_PRIVACY_POLICY_LINK, SIMPLYASK_TERMS_AND_CONDITIONS_LINK } from '../../../utils/constants';

const StepFiveReviewData = ({
  onPreviousButtonClick,
  onSubmit,
  personalInfoStep1Collector,
  organizationInfoStep2Collector,
  billingInfoStep3Collector,
  openEditPersonalInfoModal,
  openEditOrganizationalInfoModal,
  openEditBillingInfoModal,
  openEditPaymentInfoModal,
  userAppliedPromoCode,
  onRemovePromotion
}) => {
  const { statusColors, colors } = useTheme();
  const scrollToBottomRef = useRef();
  const [personalInfoReviewData, setPersonalInfoReviewData] = useState([]);
  const [organizationalInfoReviewData, setOrganizationalInfoReviewData] = useState([]);
  const [billingInfoReviewData, setBillingInfoReviewData] = useState([]);
  const [isTermsAndConditionsAccepted, setIsTermsAndConditionsAccepted] = useState(false);

  const [isPromoCodeHidden, setIsPromoCodeHidden] = useState(!userAppliedPromoCode?.active);

  const isTelusEnvActivated = import.meta.env.VITE_IS_TELUS_ENV_ACTIVATED;

  useEffect(() => {
    const filterData = Object.entries(personalInfoStep1Collector)?.filter(
      (item) =>
        item[0] !== STEP_1_PERSONAL_DETAILS_SCHEMA_KEYS.firstName &&
        item[0] !== STEP_1_PERSONAL_DETAILS_SCHEMA_KEYS.lastName
    );

    if (filterData?.length > 0) setPersonalInfoReviewData(filterData);
  }, [personalInfoStep1Collector]);

  useEffect(() => {
    const filterData = Object.entries(organizationInfoStep2Collector)?.map((item) => item);

    if (filterData?.length > 0) setOrganizationalInfoReviewData(filterData);
  }, [organizationInfoStep2Collector]);

  useEffect(() => {
    const filterData = Object.entries(billingInfoStep3Collector)?.map((item) => item);

    if (filterData?.length > 0) setBillingInfoReviewData(filterData);
  }, [billingInfoStep3Collector]);

  const NoteDiv = () => (
    <StyledFlex bgcolor={statusColors.mutedBlue.bg} direction="row" p="20px" gap="15px" borderRadius="10px">
      <StyledFlex as="span">
        <InfoOutlinedIcon
          sx={{
            height: '30px',
            width: '30px',
            color: colors.statusUnassigned,
          }}
        />
      </StyledFlex>
      <StyledFlex>
        <StyledText themeColor="statusUnassigned">
          For security reasons, we cannot show here, or allow you to edit, the credit card details you entered. You can
          still change credit cards however by clicking on the edit button above.
        </StyledText>
      </StyledFlex>
    </StyledFlex>
  );

  const AcceptTermsAndConditions = () => (
    <StyledFlex direction="row" gap="15px" alignItems="center">
      <StyledFlex>
        <Checkbox
          checkValue={isTermsAndConditionsAccepted}
          onChange={() => setIsTermsAndConditionsAccepted(!isTermsAndConditionsAccepted)}
        />
      </StyledFlex>
      <StyledFlex>
        <StyledText>
          I agree to SimplyAsk’s{' '}
          <StyledTextHyperLink
            href={SIMPLYASK_TERMS_AND_CONDITIONS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            size="16px"
          >
            Terms of Service
          </StyledTextHyperLink>{' '}
          and{' '}
          <StyledTextHyperLink
            href={SIMPLYASK_PRIVACY_POLICY_LINK}
            target="_blank"
            rel="noopener noreferrer"
            size="16px"
          >
            Privacy Policy .
          </StyledTextHyperLink>
        </StyledText>
      </StyledFlex>
    </StyledFlex>
  );

  const renderPromoCard = () => (
    <StyledUserPromoCard mt="10px">
      <StyledFlex>
        <StyledText themeColor="grassGreen" size={16} weight={600}>
          WELCOME OFFER {new Date().getFullYear()}
        </StyledText>
        <StyledText size={14} weight={500}>
          ${userAppliedPromoCode?.onetimeCreditDollarValue} Free Credits
        </StyledText>
      </StyledFlex>
      <StyledButton variant="text" onClick={() => {
        setIsPromoCodeHidden(true);
        onRemovePromotion();
      }}>
        Remove
      </StyledButton>
    </StyledUserPromoCard>
  );

  const isConfirmButtonDisabled = !isTermsAndConditionsAccepted;

  return (
    <>
      <CustomScrollbar>
        <StyledRegistrationFormsContainer gap="30px">
          <StyledFlex gap="20px">
            <StyledText size={26} weight={700} lh={39}>
              Registration Summary
            </StyledText>
            <StyledText size={20} lh={30}>
              Review your details below before confirming.{' '}
              <StyledText
                display="inline"
                size={20}
                hh
                themeColor="linkColor"
                onClick={() => scrollToBottomRef.current.scrollIntoView({ behavior: 'smooth' })}
                cursor="pointer"
              >
                Scroll to the bottom
              </StyledText>{' '}
              to confirm.
            </StyledText>
          </StyledFlex>

          <StyledRegistrationEditModalCard>
            <StyledFlex display="flex" justifyContent="space-between" direction="row" width="100%" alignItems="center">
              <StyledText weight={600} size={19}>
                Personal Details
              </StyledText>
              <StyledButton variant="contained" tertiary onClick={openEditPersonalInfoModal}>
                <EditPencilOnlyIcon style={{ marginRight: '12px' }} /> Edit
              </StyledButton>
            </StyledFlex>
            <StyledDivider m="0px -30px 0px -30px" />
            <StyledFlex gap="10px">
              <StyledText>
                {`${personalInfoStep1Collector?.[STEP_1_PERSONAL_DETAILS_SCHEMA_KEYS.firstName]} 
        ${personalInfoStep1Collector?.[STEP_1_PERSONAL_DETAILS_SCHEMA_KEYS.lastName]}`}
              </StyledText>

              {personalInfoReviewData?.map((item, index) => (
                <StyledText key={index}>{item?.at(1) ?? <StyledEmptyValue />}</StyledText>
              ))}
            </StyledFlex>
          </StyledRegistrationEditModalCard>

          <StyledRegistrationEditModalCard>
            <StyledFlex display="flex" justifyContent="space-between" direction="row" width="100%" alignItems="center">
              <StyledText weight={600} size={19}>
                Organization Details
              </StyledText>
              <StyledButton variant="contained" tertiary onClick={openEditOrganizationalInfoModal}>
                <EditPencilOnlyIcon style={{ marginRight: '12px' }} /> Edit
              </StyledButton>
            </StyledFlex>
            <StyledDivider m="0px -30px 0px -30px" />
            <StyledFlex gap="10px">
              {organizationalInfoReviewData?.map((item, index) => {
                if (
                  item[0] === STEP_2_ORGANIZATION_DETAILS_SCHEMA_KEYS.countryData ||
                  item[0] === STEP_2_ORGANIZATION_DETAILS_SCHEMA_KEYS.provinceData ||
                  item[0] === STEP_2_ORGANIZATION_DETAILS_SCHEMA_KEYS.numberOfEmployees
                ) {
                  return <StyledText key={index}>{item?.at(1)?.label}</StyledText>;
                }

                if (item?.at(1)) {
                  return <StyledText key={index}>{item?.at(1)}</StyledText>;
                }
              })}
            </StyledFlex>
          </StyledRegistrationEditModalCard>

          {!isTelusEnvActivated && (
            <>
              <StyledRegistrationEditModalCard>
                <StyledFlex
                  display="flex"
                  justifyContent="space-between"
                  direction="row"
                  width="100%"
                  alignItems="center"
                >
                  <StyledText weight={600} size={19}>
                    Billing Details
                  </StyledText>
                  <StyledButton variant="contained" tertiary onClick={openEditBillingInfoModal}>
                    <EditPencilOnlyIcon style={{ marginRight: '12px' }} /> Edit
                  </StyledButton>
                </StyledFlex>
                <StyledDivider m="0px -30px 0px -30px" />
                <StyledFlex gap="10px">
                  {billingInfoReviewData?.map((item, index) => {
                    if (
                      item[0] === STEP_3_BILLING_DETAILS_SCHEMA_KEYS.countryData ||
                      item[0] === STEP_3_BILLING_DETAILS_SCHEMA_KEYS.provinceData
                    ) {
                      return <StyledText key={index}>{item?.at(1)?.label}</StyledText>;
                    }

                    if (item?.at(1)) {
                      return <StyledText key={index}>{item?.at(1)}</StyledText>;
                    }
                  })}
                </StyledFlex>
              </StyledRegistrationEditModalCard>

              <StyledRegistrationEditModalCard>
                <StyledFlex
                  display="flex"
                  justifyContent="space-between"
                  direction="row"
                  width="100%"
                  alignItems="center"
                >
                  <StyledText weight={600} size={19}>
                    Credit Card Details
                  </StyledText>
                  <StyledButton variant="contained" tertiary onClick={openEditPaymentInfoModal}>
                    <EditPencilOnlyIcon style={{ marginRight: '12px' }} /> Edit
                  </StyledButton>
                </StyledFlex>
                <StyledDivider m="0px -30px 0px -30px" />
                <StyledFlex gap="10px">
                  <NoteDiv />
                </StyledFlex>
              </StyledRegistrationEditModalCard>
            </>
          )}

          {!isPromoCodeHidden && renderPromoCard()}

          <StyledFlex ref={scrollToBottomRef}>
            <AcceptTermsAndConditions />
          </StyledFlex>
        </StyledRegistrationFormsContainer>
      </CustomScrollbar>

      <StyledRegistrationHeaderFooter justifyContent="space-between">
        <StyledButton variant="contained" primary onClick={onPreviousButtonClick}>
          Previous
        </StyledButton>

        <StyledTooltip
          title={isConfirmButtonDisabled && 'Please accept the Terms and Conditions before confirming'}
          arrow
          placement="top-start"
          p="10px 15px"
          maxWidth="auto"
        >
          <StyledFlex as="span">
            <StyledButton disabled={isConfirmButtonDisabled} type="submit" variant="contained" onClick={onSubmit}>
              Confirm &nbsp; {isConfirmButtonDisabled && <HelpOutlineOutlined />}
            </StyledButton>
          </StyledFlex>
        </StyledTooltip>
      </StyledRegistrationHeaderFooter>
    </>
  );
};

export default StepFiveReviewData;
