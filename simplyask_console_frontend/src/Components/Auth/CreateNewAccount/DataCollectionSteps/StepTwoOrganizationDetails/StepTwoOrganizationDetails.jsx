import { useQuery } from '@tanstack/react-query';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTheme } from '@emotion/react';
import { toast } from 'react-toastify';

import {
  getBillingCountryOptions,
  getBillingProvinceOptions,
  getNumEmployeesOptions,
} from '../../../../../Services/axios/billing';
import CustomIndicatorArrow from '../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomSelect from '../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import Spinner from '../../../../shared/Spinner/Spinner';
import { StyledFlex, StyledText, StyledTextField } from '../../../../shared/styles/styled';
import { STEP_2_ORGANIZATION_DETAILS_SCHEMA_KEYS } from '../../../constants/core';

import FormErrorMessage from '../../../../Settings/AccessManagement/components/FormErrorMessage/FormErrorMessage';
import InputLabel from '../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import PhoneNumberInput from '../../../../Settings/AccessManagement/components/inputs/PhoneNumberInput/PhoneNumberInput';
import { organizationDetailsSchema } from '../../../utils/validationSchema';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomScrollbar from '../../../../shared/REDISIGNED/layouts/CustomScrollbar/CustomScrollbar';
import { StyledRegistrationFormsContainer, StyledRegistrationHeaderFooter } from '../../StyledCreateNewAccount';
import useRegisterOrganization from '../../../hooks/useRegisterOrganization';
import { ALL_STEPS } from '../../../utils/constants';

const ARRAY_OF_NUM_EMPLOYEES_FOR_RECOMMENDED_PLAN = ['101-500', '501-1000', '1001-5000', '5001+'];

const StepTwoOrganizationDetails = ({
  organizationInfoStep2Collector,
  setOrganizationInfoStep2Collector,
  isModalView = false,
  setShowRecommendedPlan,
  closeEditOrganizationalInfoModal,
  isTelusEnvActivated,
  setCustomerRegistrationUniqueId,
  setCurrentView,
  customerRegistrationUniqueId,
}) => {
  const { colors } = useTheme();

  const [savedFormData, setSavedFormData] = useState();

  const [orgError, setOrgError] = useState(null);

  const handleFormSubmission = (values) => {
    setOrganizationInfoStep2Collector(values);

    const payload = {
      orgName: values.companyName,
      streetAddressLine1: values.streetAddressLine1,
      streetAddressLine2: values.streetAddressLine2,
      country: values.countryData.label,
      city: values.city,
      province: values.provinceData.value,
      postalCode: values.postalCode,
      phoneNumber: values.organizationPhoneNumbersData,
      numEmployees: values.numberOfEmployees.value,
    };

    setOrgError(null);
    registerOrganization({ payload, registrationId: customerRegistrationUniqueId });
  };

  const onPreviousButtonClick = () => {
    setCurrentView(ALL_STEPS.STEP_1);
    setOrgError(null);
  };

  const { values, setFieldValue, errors, touched, handleChange, submitForm } = useFormik({
    enableReinitialize: true,
    initialValues: savedFormData,
    validationSchema: organizationDetailsSchema,
    onSubmit: handleFormSubmission,
  });

  const { registerOrganization, isorganizationRegistrationLoading } = useRegisterOrganization({
    onSuccess: (data) => {
      setCustomerRegistrationUniqueId(data);

      if (isModalView) {
        setOrganizationInfoStep2Collector(values);
        toast.success('Your information has been updated');
        closeEditOrganizationalInfoModal();
        return;
      }

      if (isTelusEnvActivated) {
        setCurrentView(ALL_STEPS.STEP_5);
      } else {
        setCurrentView(ALL_STEPS.STEP_3);
      }
    },
    onError: (err) => {
      if (err?.response?.status === 409) {
        setOrgError(err?.response?.data);
      } else {
        toast.error('Something went wrong...');
      }
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

  const { data: employeesNumDataOptions } = useQuery({
    queryKey: ['numEmployeesData'],
    queryFn: getNumEmployeesOptions,
  });

  useEffect(() => {
    setSavedFormData(organizationInfoStep2Collector);
  }, []);

  const getEmployeesOptions = () => employeesNumDataOptions?.map((item) => ({ label: item, value: item }));

  const getCountryOptions = () => countryDataOptions?.map((item) => ({ label: item?.name, value: item?.code }));

  const getProvinceOptions = () => {
    if (provinceDataOptions)
      return provinceDataOptions?.map(({ provinceName }) => ({ label: provinceName, value: provinceName }));
    return [];
  };

  const handleNumberOfEmployeesChange = (val) => {
    setFieldValue(STEP_2_ORGANIZATION_DETAILS_SCHEMA_KEYS.numberOfEmployees, val);
    if (ARRAY_OF_NUM_EMPLOYEES_FOR_RECOMMENDED_PLAN?.includes(val.label)) {
      setShowRecommendedPlan(true);
    } else setShowRecommendedPlan(false);
  };

  if (!savedFormData || isorganizationRegistrationLoading) return <Spinner inline />;

  return (
    <>
      <CustomScrollbar>
        <StyledRegistrationFormsContainer isModalView={isModalView}>
          <StyledFlex gap="20px">
            <StyledText size={26} weight={700} lh={39}>
              Organization Details
            </StyledText>
            <StyledText size={20} lh={30}>
              Tell us a little about your company
            </StyledText>
          </StyledFlex>
          <StyledFlex>
            <InputLabel label="Company Name" size={16} mb={12} />
            <StyledTextField
              name={STEP_2_ORGANIZATION_DETAILS_SCHEMA_KEYS.companyName}
              type="text"
              value={values?.companyName}
              onChange={handleChange}
              invalid={!!orgError || (touched?.companyName && errors?.companyName)}
              variant="standard"
              borderRadius="5px"
            />
            {(!!orgError || (errors?.companyName && touched?.companyName)) && (
              <FormErrorMessage>{orgError || errors?.companyName}</FormErrorMessage>
            )}
          </StyledFlex>

          <StyledFlex>
            <InputLabel label="Country" size={16} mb={12} />
            <CustomSelect
              options={getCountryOptions()}
              onChange={(val) => setFieldValue(STEP_2_ORGANIZATION_DETAILS_SCHEMA_KEYS.countryData, val)}
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
              name={STEP_2_ORGANIZATION_DETAILS_SCHEMA_KEYS.streetAddressLine1}
              value={values?.streetAddressLine1}
              onChange={(e) =>
                setFieldValue(STEP_2_ORGANIZATION_DETAILS_SCHEMA_KEYS.streetAddressLine1, e.target.value)
              }
              type="text"
              placeholder="Line 1"
              variant="standard"
              borderRadius="5px"
              invalid={touched?.streetAddressLine1 && errors?.streetAddressLine1}
            />
            <StyledTextField
              name={STEP_2_ORGANIZATION_DETAILS_SCHEMA_KEYS.streetAddressLine2}
              value={values?.streetAddressLine2}
              onChange={(e) =>
                setFieldValue(STEP_2_ORGANIZATION_DETAILS_SCHEMA_KEYS.streetAddressLine2, e.target.value)
              }
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
                name={STEP_2_ORGANIZATION_DETAILS_SCHEMA_KEYS.city}
                value={values?.city}
                onChange={(e) => setFieldValue(STEP_2_ORGANIZATION_DETAILS_SCHEMA_KEYS.city, e.target.value)}
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
                onChange={(val) => setFieldValue(STEP_2_ORGANIZATION_DETAILS_SCHEMA_KEYS.provinceData, val)}
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
            <StyledFlex width="33%">
              <InputLabel label="Postal/Zip Code" mb={12} size={16} />
              <StyledTextField
                name={STEP_2_ORGANIZATION_DETAILS_SCHEMA_KEYS.postalCode}
                value={values?.postalCode}
                onChange={(e) => setFieldValue(STEP_2_ORGANIZATION_DETAILS_SCHEMA_KEYS.postalCode, e.target.value)}
                type="text"
                variant="standard"
                borderRadius="5px"
                invalid={touched?.postalCode && errors?.postalCode}
              />
              {touched?.postalCode && errors?.postalCode && <FormErrorMessage>{errors?.postalCode}</FormErrorMessage>}
            </StyledFlex>

            <StyledFlex width="33%">
              <PhoneNumberInput
                label="Phone Number"
                labelProps={{ size: 16, mb: 12 }}
                variant="standard"
                placeholder="+1 123 456 7890"
                borderColor={
                  touched?.organizationPhoneNumbersData &&
                  errors?.organizationPhoneNumbersData &&
                  colors.validationError
                }
                errors={{ error: errors?.organizationPhoneNumbersData }}
                inputProps={{
                  borderRadius: '5px',
                  value: values?.organizationPhoneNumbersData,
                  onChange: (e) =>
                    setFieldValue(STEP_2_ORGANIZATION_DETAILS_SCHEMA_KEYS.organizationPhoneNumbersData, e.target.value),
                }}
                plusOneBorderRadius="5px 0 0 5px"
                margin="0 0 20px 0"
              >
                {touched?.organizationPhoneNumbersData && errors?.organizationPhoneNumbersData && (
                  <FormErrorMessage>{errors?.organizationPhoneNumbersData}</FormErrorMessage>
                )}
              </PhoneNumberInput>{' '}
            </StyledFlex>

            <StyledFlex width="33%">
              <InputLabel label="Number of Employees" size={16} mb={12} />
              <CustomSelect
                options={getEmployeesOptions()}
                onChange={handleNumberOfEmployeesChange}
                value={values?.numberOfEmployees}
                placeholder="Select Number"
                components={{
                  DropdownIndicator: CustomIndicatorArrow,
                }}
                controlTextHidden
                menuPlacement="auto"
                menuPortalTarget={document.body}
                isSearchable={false}
                isClearable={false}
                closeMenuOnSelect
                form
                invalid={touched?.numberOfEmployees && errors?.numberOfEmployees}
              />
              {touched?.numberOfEmployees && errors?.numberOfEmployees && (
                <FormErrorMessage>{errors?.numberOfEmployees}</FormErrorMessage>
              )}
            </StyledFlex>
          </StyledFlex>
        </StyledRegistrationFormsContainer>
      </CustomScrollbar>

      <StyledRegistrationHeaderFooter justifyContent="space-between">
        {isModalView ? (
          <StyledFlex direction="row" gap="15px" justifyContent="flex-end" width="100%">
            <StyledButton variant="outlined" primary onClick={closeEditOrganizationalInfoModal}>
              Cancel
            </StyledButton>
            <StyledButton variant="contained" primary onClick={submitForm}>
              Save
            </StyledButton>
          </StyledFlex>
        ) : (
          <>
            <StyledButton variant="contained" primary onClick={onPreviousButtonClick}>
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

export default StepTwoOrganizationDetails;
