import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import { toast } from 'react-toastify';
import iconCanada from '../../../../../Assets/icons/countries/3x2/CA.svg';
import { replaceDynamicUrl } from '../../../../../utils/helperFunctions';
import { useNavigationBlock } from '../../../../shared/REDISIGNED/BlockNavigate/BlockNavigate';
import LeavePageBlockerModal from '../../../../shared/REDISIGNED/BlockNavigate/LeavePageBlockerModal/LeavePageBlockerModal';
import BaseTextInput from '../../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import InfoListItem from '../../../../shared/REDISIGNED/layouts/InfoList/InfoListItem';
import ConfirmationModal from '../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import CustomSelect from '../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import CustomIndicatorArrow from '../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import Spinner from '../../../../shared/Spinner/Spinner';
import { StyledFlex } from '../../../../shared/styles/styled';
import FormErrorMessage from '../../../AccessManagement/components/FormErrorMessage/FormErrorMessage';
import useGetBillingCountries from '../hooks/useGetBillingCountries';
import useGetBillingProvinces from '../hooks/useGetBillingProvinces';
import useGetNumberOfEmployees from '../hooks/useGetNumberOfEmployees';
import useUpdateOrgDetails from '../hooks/useUpdateOrgDetails';
import { ORGANIZATION_SETTINGS_API_KEYS, ORGANIZATION_SETTINGS_LABELS } from '../utils/constants';
import { editOrganizationDetailsValidationSchema } from '../utils/validationSchema';
import classes from './EditOrganization.module.css';

const EditOrganization = ({ onClose, data = {} }) => {
  const [selectCountry, setSelectCountry] = useState();
  const [isUnsavedChangesModalOpen, setIsUnsavedChangesModalOpen] = useState(false);

  const { countryDataOptions, isFetchingCountries } = useGetBillingCountries();

  const { provinceDataOptions } = useGetBillingProvinces({
    countryCode: selectCountry?.code,
    enabled: !!selectCountry?.code,
  });

  const { employeesNumDataOptions, isFetchingEmployees } = useGetNumberOfEmployees({
    select: (res) => res.map((numEmployees) => ({ label: numEmployees, value: numEmployees })),
  });

  const { updateOrganizationDetails, isUpdateOrganizationDetailsLoading } = useUpdateOrgDetails({
    onSuccess: () => {
      toast.success('Organization information has been updated successfully');
      onClose();
    },
    onError: (error) => {
      const errorMsg =
        error?.response?.data ||
        "Organization already exists. Contact your organization's administrator to gain access.";

      if (typeof errorMsg === 'string') {
        setFieldError(ORGANIZATION_SETTINGS_API_KEYS.ORG_NAME, errorMsg);
      }
    },
  });

  const getInitialValues = () => ({
    ...data,

    [ORGANIZATION_SETTINGS_API_KEYS.COUNTRY]:
      selectCountry ||
      countryDataOptions?.find((country) => country.name === data?.[ORGANIZATION_SETTINGS_API_KEYS.COUNTRY]) ||
      null,

    [ORGANIZATION_SETTINGS_API_KEYS.PROVINCE]:
      provinceDataOptions?.find(
        (province) => province.provinceName === data?.[ORGANIZATION_SETTINGS_API_KEYS.PROVINCE]
      ) || null,

    [ORGANIZATION_SETTINGS_API_KEYS.NUMBER_OF_EMPLOYEES]:
      employeesNumDataOptions?.find(
        (numEmployees) => numEmployees.value === data?.[ORGANIZATION_SETTINGS_API_KEYS.NUMBER_OF_EMPLOYEES]
      ) || null,
  });

  const { values, setFieldValue, submitForm, dirty, errors, touched, setFieldError } = useFormik({
    initialValues: getInitialValues(),
    enableReinitialize: true,
    validationSchema: editOrganizationDetailsValidationSchema,
    onSubmit: (val) => {
      handleFormSubmission(val);
    },
  });

  const { navBlocker } = useNavigationBlock(dirty);

  useEffect(() => {
    setSelectCountry(values?.[ORGANIZATION_SETTINGS_API_KEYS.COUNTRY]);
  }, [values?.[ORGANIZATION_SETTINGS_API_KEYS.COUNTRY]]);

  const handleFormSubmission = async (val) => {
    const payload = {
      ...val,
      [ORGANIZATION_SETTINGS_API_KEYS.COUNTRY]: val[ORGANIZATION_SETTINGS_API_KEYS.COUNTRY]?.name,
      [ORGANIZATION_SETTINGS_API_KEYS.PROVINCE]: val[ORGANIZATION_SETTINGS_API_KEYS.PROVINCE]?.provinceName,
      [ORGANIZATION_SETTINGS_API_KEYS.NUMBER_OF_EMPLOYEES]:
        val[ORGANIZATION_SETTINGS_API_KEYS.NUMBER_OF_EMPLOYEES]?.value,
    };

    updateOrganizationDetails(payload);
  };

  const handleTextChange = (e) => setFieldValue(e.target.name, e.target.value);

  const handleDropdownChange = (value, action) => setFieldValue(action.name, value);

  const handleCloseClick = () => {
    dirty ? setIsUnsavedChangesModalOpen(true) : onClose();
  };

  const handleDiscardUnSavedChanges = () => {
    setIsUnsavedChangesModalOpen(false);
    onClose();
  };

  const handleSaveChangesClick = () => {
    setIsUnsavedChangesModalOpen(false);
    submitForm();
  };

  const sharedInfoListProps = {
    alignItems: 'center',
    nameStyles: {
      weight: '600',
    },
  };

  const sharedStyledFlexProps = {
    width: '376px',
    justifyContent: 'center',
  };

  const isLoading = isFetchingCountries || isFetchingEmployees || isUpdateOrganizationDetailsLoading;

  const renderActionButtons = () => (
    <StyledFlex position="absolute" direction="row" gap="12px" top="-38px" right="14px">
      <StyledButton variant="outlined" primary onClick={handleCloseClick}>
        Cancel
      </StyledButton>
      <StyledButton variant="contained" primary onClick={submitForm} disabled={isLoading}>
        Save
      </StyledButton>
    </StyledFlex>
  );

  return (
    <StyledFlex position="relative">
      {isLoading && <Spinner fadeBgParent />}

      {renderActionButtons()}

      <StyledFlex marginTop="5px">
        <InfoListItem name={ORGANIZATION_SETTINGS_LABELS.COMPANY_NAME} {...sharedInfoListProps}>
          <StyledFlex {...sharedStyledFlexProps}>
            <BaseTextInput
              name={ORGANIZATION_SETTINGS_API_KEYS.ORG_NAME}
              placeholder="Please enter Organization Name..."
              value={values[ORGANIZATION_SETTINGS_API_KEYS.ORG_NAME]}
              onChange={handleTextChange}
              invalid={
                errors[ORGANIZATION_SETTINGS_API_KEYS.ORG_NAME] && touched[ORGANIZATION_SETTINGS_API_KEYS.ORG_NAME]
              }
            />
            {errors[ORGANIZATION_SETTINGS_API_KEYS.ORG_NAME] && touched[ORGANIZATION_SETTINGS_API_KEYS.ORG_NAME] && (
              <FormErrorMessage>{errors[ORGANIZATION_SETTINGS_API_KEYS.ORG_NAME]}</FormErrorMessage>
            )}
          </StyledFlex>
        </InfoListItem>

        <InfoListItem name={ORGANIZATION_SETTINGS_LABELS.COUNTRY} {...sharedInfoListProps}>
          <StyledFlex {...sharedStyledFlexProps}>
            <CustomSelect
              name={ORGANIZATION_SETTINGS_API_KEYS.COUNTRY}
              onChange={handleDropdownChange}
              options={countryDataOptions}
              value={values[ORGANIZATION_SETTINGS_API_KEYS.COUNTRY]}
              placeholder="Please select Country..."
              getOptionLabel={(opt) => opt.name}
              getOptionValue={(opt) => opt.code}
              components={{
                DropdownIndicator: CustomIndicatorArrow,
              }}
              menuPortalTarget={document.body}
              isSearchable={false}
              isClearable={false}
              closeMenuOnSelect
              withSeparator
              form
            />
            {errors[ORGANIZATION_SETTINGS_API_KEYS.COUNTRY] && touched[ORGANIZATION_SETTINGS_API_KEYS.COUNTRY] && (
              <FormErrorMessage>{errors[ORGANIZATION_SETTINGS_API_KEYS.COUNTRY]}</FormErrorMessage>
            )}
          </StyledFlex>
        </InfoListItem>

        <InfoListItem name={ORGANIZATION_SETTINGS_LABELS.STREET_ADDRESS_1} {...sharedInfoListProps}>
          <StyledFlex {...sharedStyledFlexProps}>
            <BaseTextInput
              name={ORGANIZATION_SETTINGS_API_KEYS.STREET_ADDRESS_1}
              placeholder="Please enter street address 1..."
              value={values[ORGANIZATION_SETTINGS_API_KEYS.STREET_ADDRESS_1]}
              onChange={handleTextChange}
              invalid={
                errors[ORGANIZATION_SETTINGS_API_KEYS.STREET_ADDRESS_1] &&
                touched[ORGANIZATION_SETTINGS_API_KEYS.STREET_ADDRESS_1]
              }
            />
            {errors[ORGANIZATION_SETTINGS_API_KEYS.STREET_ADDRESS_1] &&
              touched[ORGANIZATION_SETTINGS_API_KEYS.STREET_ADDRESS_1] && (
                <FormErrorMessage>{errors[ORGANIZATION_SETTINGS_API_KEYS.STREET_ADDRESS_1]}</FormErrorMessage>
              )}
          </StyledFlex>
        </InfoListItem>

        <InfoListItem name={ORGANIZATION_SETTINGS_LABELS.STREET_ADDRESS_2} {...sharedInfoListProps}>
          <StyledFlex {...sharedStyledFlexProps}>
            <BaseTextInput
              name={ORGANIZATION_SETTINGS_API_KEYS.STREET_ADDRESS_2}
              placeholder="Please enter street address 2..."
              value={values[ORGANIZATION_SETTINGS_API_KEYS.STREET_ADDRESS_2]}
              onChange={handleTextChange}
              invalid={
                errors[ORGANIZATION_SETTINGS_API_KEYS.STREET_ADDRESS_2] &&
                touched[ORGANIZATION_SETTINGS_API_KEYS.STREET_ADDRESS_2]
              }
            />
            {errors[ORGANIZATION_SETTINGS_API_KEYS.STREET_ADDRESS_2] &&
              touched[ORGANIZATION_SETTINGS_API_KEYS.STREET_ADDRESS_2] && (
                <FormErrorMessage>{errors[ORGANIZATION_SETTINGS_API_KEYS.STREET_ADDRESS_2]}</FormErrorMessage>
              )}
          </StyledFlex>
        </InfoListItem>

        <InfoListItem name={ORGANIZATION_SETTINGS_LABELS.CITY} {...sharedInfoListProps}>
          <StyledFlex {...sharedStyledFlexProps}>
            <BaseTextInput
              name={ORGANIZATION_SETTINGS_API_KEYS.CITY}
              placeholder="Please enter city..."
              value={values[ORGANIZATION_SETTINGS_API_KEYS.CITY]}
              onChange={handleTextChange}
              invalid={errors[ORGANIZATION_SETTINGS_API_KEYS.CITY] && touched[ORGANIZATION_SETTINGS_API_KEYS.CITY]}
            />
            {errors[ORGANIZATION_SETTINGS_API_KEYS.CITY] && touched[ORGANIZATION_SETTINGS_API_KEYS.CITY] && (
              <FormErrorMessage>{errors[ORGANIZATION_SETTINGS_API_KEYS.CITY]}</FormErrorMessage>
            )}
          </StyledFlex>
        </InfoListItem>

        <InfoListItem name={ORGANIZATION_SETTINGS_LABELS.PROVINCE} {...sharedInfoListProps}>
          <StyledFlex {...sharedStyledFlexProps}>
            <CustomSelect
              name={ORGANIZATION_SETTINGS_API_KEYS.PROVINCE}
              onChange={handleDropdownChange}
              options={provinceDataOptions}
              value={values[ORGANIZATION_SETTINGS_API_KEYS.PROVINCE]}
              getOptionLabel={(opt) => opt.provinceName}
              getOptionValue={(opt) => opt.provinceName}
              placeholder="Please select Province/State..."
              components={{
                DropdownIndicator: CustomIndicatorArrow,
              }}
              menuPortalTarget={document.body}
              isSearchable={false}
              isClearable={false}
              closeMenuOnSelect
              withSeparator
              form
            />
            {errors[ORGANIZATION_SETTINGS_API_KEYS.PROVINCE] && touched[ORGANIZATION_SETTINGS_API_KEYS.PROVINCE] && (
              <FormErrorMessage>{errors[ORGANIZATION_SETTINGS_API_KEYS.PROVINCE]}</FormErrorMessage>
            )}
          </StyledFlex>
        </InfoListItem>

        <InfoListItem name={ORGANIZATION_SETTINGS_LABELS.POSTAL_CODE} {...sharedInfoListProps}>
          <StyledFlex {...sharedStyledFlexProps}>
            <BaseTextInput
              name={ORGANIZATION_SETTINGS_API_KEYS.POSTAL_CODE}
              placeholder="Please enter postal code..."
              value={values[ORGANIZATION_SETTINGS_API_KEYS.POSTAL_CODE]}
              onChange={handleTextChange}
              invalid={
                errors[ORGANIZATION_SETTINGS_API_KEYS.POSTAL_CODE] &&
                touched[ORGANIZATION_SETTINGS_API_KEYS.POSTAL_CODE]
              }
            />
            {errors[ORGANIZATION_SETTINGS_API_KEYS.POSTAL_CODE] &&
              touched[ORGANIZATION_SETTINGS_API_KEYS.POSTAL_CODE] && (
                <FormErrorMessage>{errors[ORGANIZATION_SETTINGS_API_KEYS.POSTAL_CODE]}</FormErrorMessage>
              )}
          </StyledFlex>
        </InfoListItem>

        <InfoListItem name={ORGANIZATION_SETTINGS_LABELS.PHONE_NUMBER} {...sharedInfoListProps}>
          <StyledFlex {...sharedStyledFlexProps}>
            <PhoneInput
              international
              defaultCountry={values[ORGANIZATION_SETTINGS_API_KEYS.COUNTRY]?.code || 'CA'}
              value={values[ORGANIZATION_SETTINGS_API_KEYS.PHONE_NUMBER]}
              onChange={(val) => setFieldValue(ORGANIZATION_SETTINGS_API_KEYS.PHONE_NUMBER, val)}
              className={classes.phoneNumberInput}
              placeholder="+1 123 456 7890"
              flagUrl={replaceDynamicUrl(iconCanada)}
            />

            {errors[ORGANIZATION_SETTINGS_API_KEYS.PHONE_NUMBER] &&
              touched[ORGANIZATION_SETTINGS_API_KEYS.PHONE_NUMBER] && (
                <FormErrorMessage>{errors[ORGANIZATION_SETTINGS_API_KEYS.PHONE_NUMBER]}</FormErrorMessage>
              )}
          </StyledFlex>
        </InfoListItem>

        <InfoListItem name={ORGANIZATION_SETTINGS_LABELS.NUMBER_OF_EMPLOYEES} {...sharedInfoListProps}>
          <StyledFlex {...sharedStyledFlexProps}>
            <CustomSelect
              name={ORGANIZATION_SETTINGS_API_KEYS.NUMBER_OF_EMPLOYEES}
              onChange={handleDropdownChange}
              options={employeesNumDataOptions}
              value={values[ORGANIZATION_SETTINGS_API_KEYS.NUMBER_OF_EMPLOYEES]}
              placeholder="Please select number of employees..."
              components={{
                DropdownIndicator: CustomIndicatorArrow,
              }}
              menuPortalTarget={document.body}
              isSearchable={false}
              isClearable={false}
              closeMenuOnSelect
              withSeparator
              form
            />
            {errors[ORGANIZATION_SETTINGS_API_KEYS.NUMBER_OF_EMPLOYEES] &&
              touched[ORGANIZATION_SETTINGS_API_KEYS.NUMBER_OF_EMPLOYEES] && (
                <FormErrorMessage>{errors[ORGANIZATION_SETTINGS_API_KEYS.NUMBER_OF_EMPLOYEES]}</FormErrorMessage>
              )}
          </StyledFlex>
        </InfoListItem>
      </StyledFlex>

      <ConfirmationModal
        isOpen={isUnsavedChangesModalOpen}
        onCloseModal={() => setIsUnsavedChangesModalOpen(false)}
        onCancelClick={handleDiscardUnSavedChanges}
        cancelBtnText="Discard"
        onSuccessClick={handleSaveChangesClick}
        successBtnText="Save Changes"
        alertType="WARNING"
        title="You Have Unsaved Changes"
        text="Do you want to save the changes you have made?"
      />

      <LeavePageBlockerModal navBlocker={navBlocker} isBlocked={dirty} />
    </StyledFlex>
  );
};

export default EditOrganization;
