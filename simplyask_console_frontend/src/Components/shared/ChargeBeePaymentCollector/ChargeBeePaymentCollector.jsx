import { CardComponent, CardCVV, CardExpiry, CardNumber } from '@chargebee/chargebee-js-react-wrapper';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@emotion/react';
import { toast } from 'react-toastify';
import { Button, Modal } from 'simplexiar_react_components';


import { getBillingPaymentIntent } from '../../../Services/axios/billing';
import Spinner from '../Spinner/Spinner';
import classes from './ChargebeePaymentCollector.module.css';
import { StyledFlex, StyledText, StyledTextField } from '../styles/styled';
import InputLabel from '../REDISIGNED/controls/InputLabel/InputLabel';
import { StyledButton } from '../REDISIGNED/controls/Button/StyledButton';
import CustomScrollbar from '../REDISIGNED/layouts/CustomScrollbar/CustomScrollbar';
import FormErrorMessage from '../../Settings/AccessManagement/components/FormErrorMessage/FormErrorMessage';
import { StyledRegistrationFormsContainer, StyledRegistrationHeaderFooter } from '../../Auth/CreateNewAccount/StyledCreateNewAccount';

export const CHARGE_BEE_BILLING_DETAILS_KEYS = {
  firstName: 'firstName',
  lastName: 'lastName',
  addressLine1: 'addressLine1',
  addressLine2: 'addressLine2',
  addressLine3: 'addressLine3',
  city: 'city',
  state: 'state',
  stateCode: 'stateCode',
  countryCode: 'countryCode',
  zip: 'zip',
};

// Google Fonts and other whitelisted fonts
const FONTS = ['https://fonts.googleapis.com/css2?family=Montserrat&display=swap'];
// Style customizations
const STYLES = {
  base: {
    fontWeight: 600,
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '16px',
    fontSmoothing: 'antialiased',
    background: '#FFFFFF',

    ':focus': {
      color: '#2d3a47',
    },

    '::placeholder': {
      color: '#9BACC8',
    },

    ':focus::placeholder': {
      color: '#CFD7DF',
    },
  },
};

const ChargeBeePaymentCollector = ({
  previousStep,
  NextStep,
  isModalView = false,
  isEditModalView = false,
  showEditPaymentDetailModal,
  chargeBeeBillingDetails,
  setGetPaymentIntent = () => {},
  closeEditPaymentInfoModal = () => {},
  setLoadingTransparentApi = () => {},
  disableChargeBeeLoadingAndUseParentLoader = {},
}) => {
  const { statusColors, colors } = useTheme();
  const ref = useRef();
  const [isApiLoading, setIsApiLoading] = useState(false);

  const [nameOnCard, setNameOnCard] = useState('');
  const [showSuccessPaymentInfoChanged, setShowSuccessPaymentInfoChanged] = useState(false);

  const [triggerNameValidation, setTriggerNameValidation] = useState(false);
  const [cardNumberError, setCardNumberError] = useState(null);
  const [cardExpiryError, setCardExpiryError] = useState(null);
  const [cardCVVError, setCardCVVError] = useState(null);

  const [triggerCardNumberError, setTriggerCardNumberError] = useState(false);
  const [triggerCardExpiryError, setTriggerCardExpiryError] = useState(false);
  const [triggerCardCVVError, setTriggerCardCVVError] = useState(false);

  useEffect(() => {
    if (!showEditPaymentDetailModal) {
      setShowSuccessPaymentInfoChanged(false);
      setNameOnCard('');
    }
  }, [showEditPaymentDetailModal]);

  useEffect(() => {
    if (disableChargeBeeLoadingAndUseParentLoader.stopLoading) {
      setIsApiLoading(false);
    }
  }, [disableChargeBeeLoadingAndUseParentLoader]);

  const handleValidations = async (e) => {
    setTriggerNameValidation(true);

    if (!triggerCardNumberError || !triggerCardExpiryError || !triggerCardCVVError) {
      if (!triggerCardNumberError) setCardNumberError(true);
      if (!triggerCardExpiryError) setCardExpiryError(true);
      if (!triggerCardCVVError) setCardCVVError(true);

      setTriggerCardCVVError(true);
      setTriggerCardExpiryError(true);
      setTriggerCardNumberError(true);
      return toast.error('Please check input values');
    }

    if (cardNumberError || cardExpiryError || cardCVVError || nameOnCard.length < 1) {
      return toast.error('Please check input values');
    }

    if (e) e.preventDefault();

    if (ref) {
      try {
        setLoadingTransparentApi(true);
        setIsApiLoading(true);

        const getPaymentIntent = await getBillingPaymentIntent();

        if (getPaymentIntent && ref) {
          ref.current
            .authorizeWith3ds(getPaymentIntent, {
              billingAddress: chargeBeeBillingDetails,
            })
            .then((res) => {
              setGetPaymentIntent(() => res.id);

              isEditModalView ? setShowSuccessPaymentInfoChanged(true) : NextStep();
            })
            .catch(() => {
              return toast.error('Something went wrong...');
            })
            .finally(() => {
              if (!disableChargeBeeLoadingAndUseParentLoader.value) {
                setIsApiLoading(false);
              }
              setLoadingTransparentApi(false);
            });
        }
      } catch (error) {
        return toast.error('Something went wrong...');
      }
    }
  };

  const handleCardNumberError = (e) => {
    setTriggerCardNumberError(true);
    setCardNumberError(e.error);
  };

  const handleCardExpiryError = (e) => {
    setTriggerCardExpiryError(true);
    setCardExpiryError(e.error);
  };

  const handleCardCVVError = (e) => {
    setTriggerCardCVVError(true);
    setCardCVVError(e.error);
  };

  const goToPreviousStep = () => {
    previousStep();
  };

  const goToPreviousStepWithoutCallingApi = () => {
    previousStep({}, true);
  };

  const NoteDiv = () => {
    return (
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
        <StyledFlex gap="30px">
          <StyledText weight={500}>
            We will not charge for usage below Symphona Free Tier Limits. We may temporarily hold ~$1 USD as a pending
            transaction for 3-5 days to verify your identify.
          </StyledText>
          <StyledText weight={500}>
            You may be redirected to your bank's website to authorize the payment information change for identity
            verification.
          </StyledText>
        </StyledFlex>
      </StyledFlex>
    );
  };

  NoteDiv.propTypes = {
    fullPageView: PropTypes.bool,
    editModalCSS: PropTypes.bool,
  };

  if (isEditModalView && showSuccessPaymentInfoChanged) {
    return (
      <Modal show modalClosed={() => {}} className={classes.modal_payment_successfully_changed}>
        <div className={classes.flex_col_payment_modal}>
          <div className={classes.successText}>Success!</div>
          <div className={classes.successDescriptionText}>Your credit card details have successfully been changed.</div>
          <Button onClick={closeEditPaymentInfoModal} className={classes.success_confirm_btn}>
            Confirm
          </Button>
        </div>
      </Modal>
    );
  }
  return (
    <>
      {isApiLoading && <Spinner fadeBgParent roundedBg />}
      <CustomScrollbar>
        <StyledRegistrationFormsContainer isModalView={isEditModalView || isModalView}
        >
          <StyledFlex gap="20px">
            <StyledText size={26} weight={700} lh={39}>
              Credit Card Details
            </StyledText>
            <StyledText size={20} lh={30}>
              Enter your credit card information.
            </StyledText>
          </StyledFlex>

          <StyledFlex gap="30px">
            <StyledFlex>
              <InputLabel label="Name on Card" size={16} mb={12} />
              <StyledTextField
                name="firstName"
                type="text"
                value={nameOnCard}
                onChange={(e) => setNameOnCard(e.target.value)}
                invalid={triggerNameValidation && nameOnCard.length < 1}
                borderRadius="5px"
                variant="standard"
              />
              {triggerNameValidation && nameOnCard.length < 1 && (
                <FormErrorMessage>A valid name, as it appears on the credit card, is required</FormErrorMessage>
              )}
            </StyledFlex>

            <CardComponent ref={ref} className={`${classes.font_size} fieldset field`} fonts={FONTS} styles={STYLES}>
              <StyledFlex gap="30px">
                <StyledFlex>
                  <InputLabel label="Card Number" size={16} mb={12} />
                  <CardNumber
                    className={`ex1-input ${classes.input_fullView}`}
                    placeholder="1234 1234 1234 1234"
                    onChange={handleCardNumberError}
                  />
                  {cardNumberError && (
                    <FormErrorMessage>
                      A valid card number, in the 1234 1234 1234 1234, format is required
                    </FormErrorMessage>
                  )}
                </StyledFlex>

                <StyledFlex direction="row" gap="20px">
                  <StyledFlex width="50%">
                    <InputLabel label="Expiry Date" size={16} mb={12} />
                    <CardExpiry
                      className={`ex1-input ${classes.halfWidthInputFullView}`}
                      onChange={handleCardExpiryError}
                    />
                    {cardExpiryError && (
                      <FormErrorMessage>An expiry date, in MM / YY, format is required</FormErrorMessage>
                    )}
                  </StyledFlex>

                  <StyledFlex width="50%">
                    <InputLabel label="Security Code (CVV)" size={16} mb={12} />
                    <CardCVV className={`ex1-input ${classes.halfWidthInputFullView}`} onChange={handleCardCVVError} />
                    {cardCVVError && (
                      <FormErrorMessage>A security code, in the 123 format, is required</FormErrorMessage>
                    )}
                  </StyledFlex>
                </StyledFlex>
              </StyledFlex>
            </CardComponent>

            <NoteDiv fullPageView />
          </StyledFlex>
        </StyledRegistrationFormsContainer>
      </CustomScrollbar>
      <StyledRegistrationHeaderFooter justifyContent="space-between">
        {isEditModalView ? (
          <StyledFlex direction="row" gap="15px" justifyContent="flex-end" width="100%">
            <StyledButton variant="outlined" primary onClick={closeEditPaymentInfoModal}>
              Cancel
            </StyledButton>
            <StyledButton variant="contained" primary onClick={handleValidations}>
              Save
            </StyledButton>
          </StyledFlex>
        ) : (
          <>
            <StyledButton
              variant="contained"
              primary
              onClick={isModalView ? goToPreviousStep : goToPreviousStepWithoutCallingApi}
            >
              Previous
            </StyledButton>
            <StyledButton variant="contained" type="submit" onClick={handleValidations}>
              Review
            </StyledButton>
          </>
        )}
      </StyledRegistrationHeaderFooter>
    </>
  );
};

export default ChargeBeePaymentCollector;

ChargeBeePaymentCollector.propTypes = {
  setLoadingTransparentApi: PropTypes.func,
  previousStep: PropTypes.func,
  NextStep: PropTypes.func,
  isModalView: PropTypes.bool,
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

  disableChargeBeeLoadingAndUseParentLoader: PropTypes.shape({
    value: PropTypes.bool,
    stopLoading: PropTypes.bool,
  }),

  isMainViewContentScrollable: PropTypes.bool,
  reactSelectStates: PropTypes.shape({
    countryData: PropTypes.shape({ label: PropTypes.string, value: PropTypes.string }),
    provinceData: PropTypes.shape({ label: PropTypes.string, value: PropTypes.string }),
    phoneNumberData: PropTypes.string,
  }),

  chargeBeeBillingDetails: PropTypes.shape({
    [CHARGE_BEE_BILLING_DETAILS_KEYS.firstName]: PropTypes.string,
    [CHARGE_BEE_BILLING_DETAILS_KEYS.lastName]: PropTypes.string,
    [CHARGE_BEE_BILLING_DETAILS_KEYS.addressLine1]: PropTypes.string,
    [CHARGE_BEE_BILLING_DETAILS_KEYS.addressLine2]: PropTypes.string,
    [CHARGE_BEE_BILLING_DETAILS_KEYS.city]: PropTypes.string,
    [CHARGE_BEE_BILLING_DETAILS_KEYS.state]: PropTypes.string,
    [CHARGE_BEE_BILLING_DETAILS_KEYS.zip]: PropTypes.string,
    [CHARGE_BEE_BILLING_DETAILS_KEYS.countryCode]: PropTypes.string,
  }),

  setGetPaymentIntent: PropTypes.func,
  closeEditPaymentInfoModal: PropTypes.func,
  isEditModalView: PropTypes.bool,
  showEditPaymentDetailModal: PropTypes.bool,
};
