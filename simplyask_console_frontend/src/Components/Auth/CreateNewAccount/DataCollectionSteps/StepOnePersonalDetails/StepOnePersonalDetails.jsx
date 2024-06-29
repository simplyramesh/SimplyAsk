import { useFormik } from 'formik';
import { useTheme } from '@emotion/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import Spinner from '../../../../shared/Spinner/Spinner';
import { STEP_1_PERSONAL_DETAILS_SCHEMA_KEYS } from '../../../constants/core';
import { StyledFlex, StyledText, StyledTextField } from '../../../../shared/styles/styled';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import PhoneNumberInput from '../../../../Settings/AccessManagement/components/inputs/PhoneNumberInput/PhoneNumberInput';
import InputLabel from '../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import FormErrorMessage from '../../../../Settings/AccessManagement/components/FormErrorMessage/FormErrorMessage';
import { personalDetailsSchema } from '../../../utils/validationSchema';
import CustomScrollbar from '../../../../shared/REDISIGNED/layouts/CustomScrollbar/CustomScrollbar';
import { StyledRegistrationFormsContainer, StyledRegistrationHeaderFooter } from '../../StyledCreateNewAccount';
import { ALL_STEPS } from '../../../utils/constants';
import useRegisterCustomer from '../../../hooks/useRegisterCustomer';

const StepOnePersonalDetails = ({
  personalInfoStep1Collector,
  setPersonalInfoStep1Collector,
  isModalView = false,
  closeEditPersonalInfoModal = () => {},
  setCustomerRegistrationUniqueId,
  setCurrentView,
  customerRegistrationUniqueId,
  setWorkEmail,
}) => {
  const { colors } = useTheme();

  const [savedFormData, setSavedFormData] = useState();

  useEffect(() => {
    setSavedFormData(personalInfoStep1Collector);
  }, []);

  const handleFormSubmission = (values) => {
    setPersonalInfoStep1Collector(values);

    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      title: values.jobTitle,
      workEmail: values.workEmail,
      phoneNumber: values.personalPhoneNumber,
    };

    registerCustomer({ payload, registrationId: customerRegistrationUniqueId });
  };

  const { values, setFieldValue, errors, touched, submitForm } = useFormik({
    enableReinitialize: true,
    initialValues: savedFormData,
    validationSchema: personalDetailsSchema,
    onSubmit: handleFormSubmission,
  });

  const { registerCustomer, isCustomerRegistrationLoading } = useRegisterCustomer({
    onSuccess: (data) => {
      setCustomerRegistrationUniqueId(data);

      if (isModalView) {
        setPersonalInfoStep1Collector(values);
        toast.success('Your information has been updated');
        closeEditPersonalInfoModal();
        return;
      }

      setCurrentView(ALL_STEPS.STEP_2);
    },
    onError: () => {
      toast.error('Something went wrong...');
    },
  });

  if (!savedFormData || isCustomerRegistrationLoading) return <Spinner inline/>;

  return (
    <>
      <CustomScrollbar>
        <StyledRegistrationFormsContainer isModalView={isModalView}>
          <StyledFlex gap="20px">
            <StyledText size={26} weight={700} lh={39}>
              Personal Details
            </StyledText>
            <StyledText size={20} lh={30}>
              Tell us a little about your yourself
            </StyledText>
          </StyledFlex>
          <StyledFlex>
            <InputLabel label="First Name" size={16} />
            <StyledTextField
              variant="standard"
              name={STEP_1_PERSONAL_DETAILS_SCHEMA_KEYS.firstName}
              type="text"
              value={values?.firstName}
              onChange={(e) => setFieldValue(STEP_1_PERSONAL_DETAILS_SCHEMA_KEYS.firstName, e.target.value)}
              invalid={touched?.firstName && errors?.firstName}
              borderRadius="5px"
            />
            {touched?.firstName && errors?.firstName && <FormErrorMessage>{errors?.firstName}</FormErrorMessage>}
          </StyledFlex>
          <StyledFlex>
            <InputLabel label="Last Name" size={16} />

            <StyledTextField
              variant="standard"
              name={STEP_1_PERSONAL_DETAILS_SCHEMA_KEYS.lastName}
              type="text"
              value={values?.lastName}
              onChange={(e) => setFieldValue(STEP_1_PERSONAL_DETAILS_SCHEMA_KEYS.lastName, e.target.value)}
              invalid={touched?.lastName && errors?.lastName}
              borderRadius="5px"
            />
            {touched?.lastName && errors?.lastName && <FormErrorMessage>{errors?.lastName}</FormErrorMessage>}
          </StyledFlex>

          <StyledFlex>
            <InputLabel label="Job Title" size={16} />

            <StyledTextField
              variant="standard"
              name={STEP_1_PERSONAL_DETAILS_SCHEMA_KEYS.jobTitle}
              type="text"
              value={values?.jobTitle}
              onChange={(e) => setFieldValue(STEP_1_PERSONAL_DETAILS_SCHEMA_KEYS.jobTitle, e.target.value)}
              invalid={touched?.jobTitle && errors?.jobTitle}
              borderRadius="5px"
            />
            {touched?.jobTitle && errors?.jobTitle && <FormErrorMessage>{errors?.jobTitle}</FormErrorMessage>}
          </StyledFlex>

          <StyledFlex>
            <StyledFlex direction="row">
              <InputLabel label="Work Email" size={16} /> &nbsp;
              <InputLabel label="- This will be the email you will use to login" weight={400} size={16} />
            </StyledFlex>

            <StyledTextField
              variant="standard"
              name={STEP_1_PERSONAL_DETAILS_SCHEMA_KEYS.workEmail}
              type="text"
              value={values?.workEmail}
              onChange={(e) => {
                setFieldValue(STEP_1_PERSONAL_DETAILS_SCHEMA_KEYS.workEmail, e.target.value);
                setWorkEmail(e.target.value);
              }}
              invalid={touched?.workEmail && errors?.workEmail}
              borderRadius="5px"
            />
            {touched?.workEmail && errors?.workEmail && <FormErrorMessage>{errors?.workEmail}</FormErrorMessage>}
          </StyledFlex>

          <StyledFlex>
            <PhoneNumberInput
              label="Phone Number"
              labelProps={{ size: 16, mb: 8 }}
              variant="standard"
              placeholder="+1 123 456 7890"
              borderColor={touched?.personalPhoneNumber && errors?.personalPhoneNumber && colors.validationError}
              errors={{ error: errors?.personalPhoneNumber }}
              inputProps={{
                borderRadius: '5px',
                value: values?.personalPhoneNumber,
                onChange: (e) => setFieldValue(STEP_1_PERSONAL_DETAILS_SCHEMA_KEYS.personalPhoneNumber, e.target.value),
              }}
              plusOneBorderRadius="5px 0 0 5px"
            >
              {touched?.personalPhoneNumber && errors?.personalPhoneNumber && (
                <FormErrorMessage>{errors?.personalPhoneNumber}</FormErrorMessage>
              )}
            </PhoneNumberInput>
          </StyledFlex>
        </StyledRegistrationFormsContainer>
      </CustomScrollbar>

      <StyledRegistrationHeaderFooter justifyContent="flex-end">
        {isModalView ? (
          <StyledFlex direction="row" gap="15px">
            <StyledButton variant="outlined" primary onClick={closeEditPersonalInfoModal}>
              Cancel
            </StyledButton>
            <StyledButton variant="contained" primary onClick={submitForm}>
              Save
            </StyledButton>
          </StyledFlex>
        ) : (
          <StyledButton variant="contained" onClick={submitForm}>
            Next
          </StyledButton>
        )}
      </StyledRegistrationHeaderFooter>
    </>
  );
};

export default StepOnePersonalDetails;
