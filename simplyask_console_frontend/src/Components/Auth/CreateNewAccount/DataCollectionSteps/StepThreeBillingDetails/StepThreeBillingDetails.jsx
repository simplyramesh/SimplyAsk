import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { useTheme } from '@emotion/react';

import { getBillingCountryOptions, getBillingProvinceOptions } from '../../../../../Services/axios/billing';
import Spinner from '../../../../shared/Spinner/Spinner';
import { STEP_2_ORGANIZATION_DETAILS_SCHEMA_KEYS, STEP_3_BILLING_DETAILS_SCHEMA_KEYS } from '../../../constants/core';

import classes from './StepThreeBillingDetails.module.css';
import CustomIndicatorArrow from '../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomSelect from '../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { StyledFlex, StyledText, StyledTextField } from '../../../../shared/styles/styled';

import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import FormErrorMessage from '../../../../Settings/AccessManagement/components/FormErrorMessage/FormErrorMessage';
import InputLabel from '../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import PhoneNumberInput from '../../../../Settings/AccessManagement/components/inputs/PhoneNumberInput/PhoneNumberInput';
import CustomScrollbar from '../../../../shared/REDISIGNED/layouts/CustomScrollbar/CustomScrollbar';
import Checkbox from '../../../../shared/REDISIGNED/controls/Checkbox/Checkbox';
import { billingDetailsSchema } from '../../../utils/validationSchema';
import { StyledRegistrationFormsContainer, StyledRegistrationHeaderFooter } from '../../StyledCreateNewAccount';
import useRegisterBilling from '../../../hooks/useRegisterBilling';
import { ALL_STEPS } from '../../../utils/constants';

const RADIO_GROUP_KEYS = {
  selectPersonalName: 'selectPersonalName',
  selectCompanyName: 'selectCompanyName',
};

const radioOptions = [
  { value: RADIO_GROUP_KEYS.selectPersonalName, label: 'Personal Name' },
  { value: RADIO_GROUP_KEYS.selectCompanyName, label: 'Company Name' },
];

const StepThreeBillingDetails = ({
  billingInfoStep3Collector,
  setBillingInfoStep3Collector,
  organizationInfoStep2Collector,
  isModalView = false,
  closeEditBillingInfoModal = () => {},
  setBillingInfoStep3PersonalNameSelected = () => {},
  setCustomerRegistrationUniqueId,
  setCurrentView,
  customerRegistrationUniqueId,
  isTelusEnvActivated
}) => {
  const { colors } = useTheme();

  const [savedFormData, setSavedFormData] = useState();
  const [selectRadioGroupString, setSelectRadioGroupString] = useState(RADIO_GROUP_KEYS.selectPersonalName);

  const [dataSameAsCompanyAddress, setDataSameAsCompanyAddress] = useState(false);

  const handleFormSubmission = (values) => {
    setBillingInfoStep3Collector(values);

    const isPersonalNameSelected = selectRadioGroupString === RADIO_GROUP_KEYS.selectPersonalName;

    const payload = {
      cardholderFirstName: isPersonalNameSelected ? values.firstName : '',
      cardholderLastName: isPersonalNameSelected ? values.lastName : '',
      billingAddressLine1: values.streetAddressLine1,
      billingAddressLine2: values.streetAddressLine2,
      billingAddressCity: values.city,
      billingAddressState: values.provinceData.value,
      billingAddressPostalCode: values.postalCode,
      billingAddressCountry: values.countryData.label,
      billingAddressPhone: values.billingPhoneNumbersData,
      billingAddressCompanyName: !isPersonalNameSelected ? values.companyName : '',
    };

    if (isTelusEnvActivated) {
      setCurrentView(ALL_STEPS.STEP_2);
      return;
    }
    registerBilling({ payload, registrationId: customerRegistrationUniqueId });
  };

  const { values, setFieldValue, errors, touched, submitForm, handleChange } = useFormik({
    enableReinitialize: true,
    initialValues: savedFormData,
    validationSchema: () => billingDetailsSchema(selectRadioGroupString, radioOptions),
    onSubmit: handleFormSubmission,
  });

  const { registerBilling, isBillingRegistrationLoading } = useRegisterBilling({
    onSuccess: (data) => {
      setCustomerRegistrationUniqueId(data);
      if (isModalView) {
        setBillingInfoStep3Collector(values);
        toast.success('Your information has been updated');
        closeEditBillingInfoModal();
        return;
      }
      setCurrentView(ALL_STEPS.STEP_4);
    },
    onError: () => {
      toast.error('Something went wrong...');
    },
  });

  const { data: countryDataOptions } = useQuery({
    queryKey: ['billingCountryData'],
    queryFn: getBillingCountryOptions,
  });

  const { data: provinceDataOptions } = useQuery({
    queryKey: ['billingProvinceData', values?.countryData?.value],
    queryFn: () => getBillingProvinceOptions(values?.countryData?.value),
  });

  useEffect(() => {
    setSavedFormData(billingInfoStep3Collector);
  }, []);

  useEffect(() => {
    if (!dataSameAsCompanyAddress) {
      setSavedFormData(billingInfoStep3Collector);
    } else {
      const getCompanyPageData = {};
      getCompanyPageData[STEP_3_BILLING_DETAILS_SCHEMA_KEYS.firstName] = savedFormData?.firstName;
      getCompanyPageData[STEP_3_BILLING_DETAILS_SCHEMA_KEYS.lastName] = savedFormData?.lastName;
      getCompanyPageData[STEP_3_BILLING_DETAILS_SCHEMA_KEYS.streetAddressLine1] =
        organizationInfoStep2Collector?.[STEP_2_ORGANIZATION_DETAILS_SCHEMA_KEYS.streetAddressLine1];
      getCompanyPageData[STEP_3_BILLING_DETAILS_SCHEMA_KEYS.streetAddressLine2] =
        organizationInfoStep2Collector?.[STEP_2_ORGANIZATION_DETAILS_SCHEMA_KEYS.streetAddressLine2];
      getCompanyPageData[STEP_3_BILLING_DETAILS_SCHEMA_KEYS.countryData] =
        organizationInfoStep2Collector?.[STEP_2_ORGANIZATION_DETAILS_SCHEMA_KEYS.countryData];
      getCompanyPageData[STEP_3_BILLING_DETAILS_SCHEMA_KEYS.provinceData] =
        organizationInfoStep2Collector?.[STEP_2_ORGANIZATION_DETAILS_SCHEMA_KEYS.provinceData];
      getCompanyPageData[STEP_3_BILLING_DETAILS_SCHEMA_KEYS.city] =
        organizationInfoStep2Collector?.[STEP_2_ORGANIZATION_DETAILS_SCHEMA_KEYS.city];
      getCompanyPageData[STEP_3_BILLING_DETAILS_SCHEMA_KEYS.postalCode] =
        organizationInfoStep2Collector?.[STEP_2_ORGANIZATION_DETAILS_SCHEMA_KEYS.postalCode];
      getCompanyPageData[STEP_3_BILLING_DETAILS_SCHEMA_KEYS.billingPhoneNumbersData] =
        organizationInfoStep2Collector?.[STEP_2_ORGANIZATION_DETAILS_SCHEMA_KEYS.organizationPhoneNumbersData];
      getCompanyPageData[STEP_3_BILLING_DETAILS_SCHEMA_KEYS.companyName] =
        organizationInfoStep2Collector?.[STEP_2_ORGANIZATION_DETAILS_SCHEMA_KEYS.companyName];

      setSavedFormData(getCompanyPageData);
    }
  }, [dataSameAsCompanyAddress]);

  const handleRadioChange = (e) => {
    setSelectRadioGroupString(e.target.value);
    if (e.target.value === radioOptions[0].value) setBillingInfoStep3PersonalNameSelected(true);
    else setBillingInfoStep3PersonalNameSelected(false);
  };

  const getCountryOptions = () => countryDataOptions?.map((item) => ({ label: item?.name, value: item?.code }));

  const getProvinceOptions = () => {
    if (provinceDataOptions)
      return provinceDataOptions?.map(({ provinceName }) => ({ label: provinceName, value: provinceName }));
    return [];
  };

  if (!savedFormData || isBillingRegistrationLoading) return <Spinner inline/>;

  return (
    <>
      <CustomScrollbar>
        <StyledRegistrationFormsContainer isModalView={isModalView}>
          <StyledFlex gap="20px">
            <StyledText size={26} weight={700} lh={39}>
              Billing Details
            </StyledText>
            <StyledText size={20} lh={30}>
              Billing Details Provide the billing information attached to your credit card.
            </StyledText>
          </StyledFlex>

          <StyledFlex direction="row" gap="10px" alignItems="center">
            <Checkbox
              sx={{ padding: '0px' }}
              checked={dataSameAsCompanyAddress}
              onChange={() => setDataSameAsCompanyAddress(!dataSameAsCompanyAddress)}
            />
            <StyledText>Same as company address</StyledText>
          </StyledFlex>

          <StyledFlex>
            <InputLabel label="Billing Name" size={16} mb={12} />
            <FormControl component="fieldset" className={classes.billingMuiRadioButtons}>
              <RadioGroup
                aria-label="name"
                name="controlled-radio-buttons-group"
                value={selectRadioGroupString}
                onChange={handleRadioChange}
              >
                <FormControlLabel
                  value={radioOptions[0].value}
                  control={
                    <Radio className={`${selectRadioGroupString === radioOptions[0].value && classes.colorRadio}`} />
                  }
                  label={radioOptions[0].label}
                />
                <FormControlLabel
                  value={radioOptions[1].value}
                  control={
                    <Radio className={`${selectRadioGroupString === radioOptions[1].value && classes.colorRadio}`} />
                  }
                  label={radioOptions[1].label}
                />
              </RadioGroup>
            </FormControl>
          </StyledFlex>

          {selectRadioGroupString === radioOptions[0].value ? (
            <StyledFlex direction="row" gap="20px">
              <StyledFlex width="50%">
                <InputLabel label="First Name" size={16} mb={12} />
                <StyledTextField
                  name={STEP_3_BILLING_DETAILS_SCHEMA_KEYS.firstName}
                  value={values?.firstName}
                  onChange={(e) => setFieldValue(STEP_3_BILLING_DETAILS_SCHEMA_KEYS.firstName, e.target.value)}
                  type="text"
                  variant="standard"
                  borderRadius="5px"
                  invalid={touched?.firstName && errors?.firstName}
                />
                {touched?.firstName && errors?.firstName && <FormErrorMessage>{errors?.firstName}</FormErrorMessage>}
              </StyledFlex>

              <StyledFlex width="50%">
                <InputLabel label="Last Name" size={16} mb={12} />
                <StyledTextField
                  name={STEP_3_BILLING_DETAILS_SCHEMA_KEYS.lastName}
                  value={values?.lastName}
                  onChange={(e) => setFieldValue(STEP_3_BILLING_DETAILS_SCHEMA_KEYS.lastName, e.target.value)}
                  type="text"
                  variant="standard"
                  borderRadius="5px"
                  invalid={touched?.lastName && errors?.lastName}
                />
                {touched?.lastName && errors?.lastName && <FormErrorMessage>{errors?.lastName}</FormErrorMessage>}
              </StyledFlex>
            </StyledFlex>
          ) : (
            <StyledFlex>
              <InputLabel label="Company Name" size={16} mb={12} />
              <StyledTextField
                name={STEP_3_BILLING_DETAILS_SCHEMA_KEYS.companyName}
                type="text"
                value={values?.companyName}
                onChange={handleChange}
                invalid={touched?.companyName && errors?.companyName}
                variant="standard"
                borderRadius="5px"
              />
              {errors?.companyName && touched?.companyName && (
                <FormErrorMessage>{errors?.companyName}</FormErrorMessage>
              )}
            </StyledFlex>
          )}

          <StyledFlex>
            <InputLabel label="Country" size={16} mb={12} />
            <CustomSelect
              options={getCountryOptions()}
              onChange={(val) => setFieldValue(STEP_3_BILLING_DETAILS_SCHEMA_KEYS.countryData, val)}
              value={values?.countryData}
              placeholder="Select Country"
              components={{
                DropdownIndicator: CustomIndicatorArrow,
              }}
              menuPlacement="auto"
              controlTextHidden
              menuPortalTarget={document.body}
              isSearchable={false}
              isClearable={false}
              closeMenuOnSelect
              invalid={touched?.countryData && errors?.countryData}
              form
            />
            {touched?.countryData && errors?.countryData && <FormErrorMessage>{errors?.countryData}</FormErrorMessage>}
          </StyledFlex>

          <StyledFlex gap="12px">
            <InputLabel label="Street Address" size={16} />
            <StyledTextField
              name={STEP_3_BILLING_DETAILS_SCHEMA_KEYS.streetAddressLine1}
              value={values?.streetAddressLine1}
              onChange={(e) => setFieldValue(STEP_3_BILLING_DETAILS_SCHEMA_KEYS.streetAddressLine1, e.target.value)}
              type="text"
              placeholder="Line 1"
              variant="standard"
              borderRadius="5px"
              invalid={touched?.streetAddressLine1 && errors?.streetAddressLine1}
            />
            <StyledTextField
              name={STEP_3_BILLING_DETAILS_SCHEMA_KEYS.streetAddressLine2}
              value={values?.streetAddressLine2}
              onChange={(e) => setFieldValue(STEP_3_BILLING_DETAILS_SCHEMA_KEYS.streetAddressLine2, e.target.value)}
              type="text"
              placeholder="Line 2 (Optional)"
              variant="standard"
              borderRadius="5px"
            />

            {touched?.streetAddressLine1 && errors?.streetAddressLine1 && (
              <StyledFlex mt="-12px">
                <FormErrorMessage>{errors?.streetAddressLine1}</FormErrorMessage>
              </StyledFlex>
            )}
          </StyledFlex>

          <StyledFlex direction="row" gap="20px">
            <StyledFlex width="50%">
              <InputLabel label="City" size={16} mb={12} />
              <StyledTextField
                name={STEP_3_BILLING_DETAILS_SCHEMA_KEYS.city}
                value={values?.city}
                onChange={(e) => setFieldValue(STEP_3_BILLING_DETAILS_SCHEMA_KEYS.city, e.target.value)}
                type="text"
                variant="standard"
                borderRadius="5px"
                invalid={touched?.city && errors?.city}
              />
              {touched?.city && errors?.city && <FormErrorMessage>{errors?.city}</FormErrorMessage>}
            </StyledFlex>

            <StyledFlex width="50%">
              <InputLabel label="Province/State" size={16} mb={12} />
              <CustomSelect
                options={getProvinceOptions()}
                onChange={(val) => setFieldValue(STEP_3_BILLING_DETAILS_SCHEMA_KEYS.provinceData, val)}
                value={values?.provinceData}
                menuPlacement="auto"
                placeholder="Province/State"
                components={{
                  DropdownIndicator: CustomIndicatorArrow,
                }}
                controlTextHidden
                menuPortalTarget={document.body}
                isSearchable={false}
                isClearable={false}
                closeMenuOnSelect
                form
                invalid={touched?.provinceData && errors?.provinceData}
              />

              {touched?.provinceData && errors?.provinceData && (
                <FormErrorMessage>{errors?.provinceData}</FormErrorMessage>
              )}
            </StyledFlex>
          </StyledFlex>

          <StyledFlex direction="row" gap="20px">
            <StyledFlex width="50%">
              <InputLabel label="Postal/Zip Code" mb={12} size={16} />
              <StyledTextField
                name={STEP_3_BILLING_DETAILS_SCHEMA_KEYS.postalCode}
                value={values?.postalCode}
                onChange={(e) => setFieldValue(STEP_3_BILLING_DETAILS_SCHEMA_KEYS.postalCode, e.target.value)}
                type="text"
                variant="standard"
                borderRadius="5px"
                invalid={touched?.postalCode && errors?.postalCode}
              />
              {touched?.postalCode && errors?.postalCode && <FormErrorMessage>{errors?.postalCode}</FormErrorMessage>}
            </StyledFlex>

            <StyledFlex width="50%">
              <PhoneNumberInput
                label="Phone Number"
                labelProps={{ size: 16, mb: 12 }}
                variant="standard"
                placeholder="+1 123 456 7890"
                borderColor={
                  touched?.billingPhoneNumbersData && errors?.billingPhoneNumbersData && colors.validationError
                }
                errors={{ error: errors?.billingPhoneNumbersData }}
                inputProps={{
                  borderRadius: '5px',
                  value: values?.billingPhoneNumbersData,
                  onChange: (e) =>
                    setFieldValue(STEP_3_BILLING_DETAILS_SCHEMA_KEYS.billingPhoneNumbersData, e.target.value),
                }}
                plusOneBorderRadius="5px 0 0 5px"
              >
                {touched?.billingPhoneNumbersData && errors?.billingPhoneNumbersData && (
                  <FormErrorMessage>{errors?.billingPhoneNumbersData}</FormErrorMessage>
                )}
              </PhoneNumberInput>
            </StyledFlex>
          </StyledFlex>
        </StyledRegistrationFormsContainer>
      </CustomScrollbar>

      <StyledRegistrationHeaderFooter justifyContent="space-between">
        {isModalView ? (
          <StyledFlex direction="row" gap="15px" justifyContent="flex-end" width="100%">
            <StyledButton variant="outlined" primary onClick={closeEditBillingInfoModal}>
              Cancel
            </StyledButton>
            <StyledButton variant="contained" primary onClick={submitForm}>
              Save
            </StyledButton>
          </StyledFlex>
        ) : (
          <>
            <StyledButton variant="contained" primary onClick={() => setCurrentView(ALL_STEPS.STEP_2)}>
              Previous
            </StyledButton>
            <StyledButton variant="contained" onClick={submitForm}>
              Next
            </StyledButton>
          </>
        )}
      </StyledRegistrationHeaderFooter>
    </>
  );
};

export default StepThreeBillingDetails;
