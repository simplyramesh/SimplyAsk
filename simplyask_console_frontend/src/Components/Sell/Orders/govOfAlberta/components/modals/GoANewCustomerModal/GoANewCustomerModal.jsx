import { useTheme } from '@emotion/react';
import { useFormik } from 'formik';
import Scrollbars from 'react-custom-scrollbars-2';

import { useGetProvinces } from '../../../../../../../hooks/useGetCountriesAndProvinces';
import SidebarIcons from '../../../../../../AppLayout/SidebarIcons/SidebarIcons';
import FormErrorMessage from '../../../../../../Settings/AccessManagement/components/FormErrorMessage/FormErrorMessage';
import NewPassword from '../../../../../../Settings/AccessManagement/components/NewPassword/NewPassword';
import AddressAutocomplete from '../../../../../../shared/REDISIGNED/controls/AddressAutocomplete/AddressAutocomplete';
import BaseTextInput from '../../../../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';
import { StyledButton } from '../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import InputLabel from '../../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import CenterModalFixed from '../../../../../../shared/REDISIGNED/modals/CenterModalFixed/CenterModalFixed';
import CustomSelect from '../../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { StyledDivider, StyledFlex, StyledText } from '../../../../../../shared/styles/styled';
import { PRODUCT_FILTERS, PRODUCT_GOA_NEW_CUSTOMER_INITIAL_VALUES } from '../../../../../constants/productInitialValues';
import { GOA_NEW_CUSTOMER_MODAL_ROLE_OPTIONS } from '../../../../../constants/productOptions';
import useGetProductOrganization from '../../../../../hooks/useGetProductOrganization';
import { getCustomerAddress } from '../../../../../utils/helpers';
import { goACustomerAddressSchema } from '../../../../ProductOfferings/ProductOfferingsCheckout/ProductOfferingsCheckoutCustomer/OrderCheckoutCustomerEditModal/validationSchemas';
import { StyledPhoneNumberInput } from '../../../StyledGoAProductOffers';

import GoAEscalationContact from './GoAEscalationContact/GoAEscalationContact';

const GoANewCustomerModal = ({
  onClose,
  onSubmit,
  customer,
  open,
}) => {
  const { colors } = useTheme();

  const {
    values, errors, setFieldValue, handleSubmit, setValues, touched, submitCount, ...rest
  } = useFormik({
    initialTouched: false,
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnChange: false,
    initialValues: {
      ...(customer ? { ...customer } : PRODUCT_GOA_NEW_CUSTOMER_INITIAL_VALUES),
      [PRODUCT_FILTERS.SHIPPING_ADDRESS_ROLE]: getCustomerAddress(customer?.[PRODUCT_FILTERS.SHIPPING_ADDRESS_ROLE], PRODUCT_FILTERS.SHIPPING_ADDRESS_ROLE, true),
      confirmPassword: '',
    },
    validationSchema: goACustomerAddressSchema,
    onSubmit: (value, meta) => {
      const submitValues = Object.entries(value).reduce(
        (acc, [key, val]) => {
          if (key === 'confirmPassword') return acc;

          return {
            ...acc,
            [key]: val,
          };
        },
        {},
      );

      onSubmit?.(submitValues);
      meta.resetForm();
    },
  });

  const { provinces } = useGetProvinces({
    countryCode: 'CA',
    options: {
      select: (data) => data.map((province) => ({ label: province.provinceName, value: province.provinceName })),
    },
  });

  const { organizations } = useGetProductOrganization({ options: {} });

  const renderPhoneNumberInput = ({ field, invalid, value }) => (
    <StyledPhoneNumberInput
      name={field}
      international
      defaultCountry="CA"
      value={value}
      onChange={(v) => setFieldValue(field, v)}
      placeholder="+1 123 456 7890"
      invalid={invalid}
    />
  );

  const renderTextInput = ({
    field, placeholder, isDisabled, invalid, value,
  }) => (
    <BaseTextInput
      name={field}
      placeholder={placeholder}
      type="text"
      value={value}
      onChange={(e) => setFieldValue(field, e.target.value, submitCount > 0)}
      invalid={invalid}
      autoComplete={field === PRODUCT_FILTERS.USERNAME ? 'one-time-code' : 'off'}
      disabled={isDisabled}
    />
  );

  const renderSelect = ({
    options, field, placeholder, isDisabled, isSearchable = false, invalid, value,
  }) => (
    <CustomSelect
      name={field}
      placeholder={placeholder}
      options={options || []}
      value={value}
      onChange={(v) => setFieldValue(field, v, submitCount > 0)}
      closeMenuOnSelect
      isClearable={false}
      isSearchable={isSearchable}
      invalid={invalid}
      mb={0}
      form
      isDisabled={isDisabled}
      menuPortalTarget={document.body}
    />
  );

  const renderAddressAutocomplete = ({
    field, placeholder, value, invalid,
  }) => {
    const fieldParent = field.split('.')[0];
    return (
      <AddressAutocomplete
        placeholder={placeholder}
        value={value}
        onChange={(v) => {
          setValues({
            ...values,
            [fieldParent]: {
              ...values[fieldParent],
              [PRODUCT_FILTERS.STREET_NAME]: v.street,
              [PRODUCT_FILTERS.CITY]: v.city,
              [PRODUCT_FILTERS.PROVINCE]: { label: v.province, value: v.province },
              [PRODUCT_FILTERS.POSTAL_CODE]: v.postalCode,
              [PRODUCT_FILTERS.COUNTRY]: { label: v.country, value: v.country },
            },
          }, submitCount > 0);
        }}
        invalid={invalid}
        country="CA"
        menuPortalTarget={document.body}
      />
    );
  };

  const inputSelector = (type) => {
    switch (type) {
    case 'phone':
      return renderPhoneNumberInput;
    case 'select':
      return renderSelect;
    case 'address':
      return renderAddressAutocomplete;
    default:
      return renderTextInput;
    }
  };

  const renderInputWithLabel = ({
    type, field, label, options, isOptional = false, isDisabled = false, isSearchable,
  }) => {
    const selectedInput = inputSelector(type);
    const nestedFieldsArr = field.split('.');
    const value = nestedFieldsArr.length > 1 ? values?.[nestedFieldsArr[0]]?.[nestedFieldsArr[1]] : values?.[field];
    const error = nestedFieldsArr.length > 1
      ? errors?.[nestedFieldsArr[0]]?.[nestedFieldsArr[1]]
      : errors?.[field];

    return (
      <StyledFlex direction="column" width="100%">
        <InputLabel label={label} isOptional={isOptional} />
        {selectedInput({
          field,
          options,
          placeholder: `Enter ${label}...`,
          isDisabled,
          isSearchable,
          invalid: !!error,
          value,
        })}
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </StyledFlex>
    );
  };

  const renderAddressTitle = ({ title, subtitle }) => (
    <StyledFlex gap="7px 0">
      <StyledText as="h3" weight={600} lh={24}>{title}</StyledText>
      <StyledText weight={400} size={14} lh={21}>{subtitle}</StyledText>
    </StyledFlex>
  );

  return (
    <CenterModalFixed
      open={open}
      onClose={onClose}
      maxWidth="775px"
      enableScrollbar={false}
      footerShadow={false}
      actions={(
        <StyledFlex direction="row" justifyContent="flex-end" width="100%">
          <StyledButton
            primary
            variant="contained"
            onClick={handleSubmit}
          >
            Create
          </StyledButton>
        </StyledFlex>
      )}
    >
      <StyledFlex flex="1 1 auto" p="20px 10px 30px 30px">
        <StyledFlex gap="30px 0">
          <StyledFlex gap="10px" alignItems="center" direction="row" justifyContent="flex-start">
            <StyledFlex justifyContent="center">
              <StyledFlex direction="row" gap="0 10px">
                <StyledFlex as="span" cursor="pointer" onClick={() => onClose?.(false)}>
                  <SidebarIcons icon="BACK" width="22px" />
                </StyledFlex>
                <StyledText as="p" weight={600} lh={24}>
                  Go Back to Search Results
                </StyledText>
              </StyledFlex>
            </StyledFlex>
          </StyledFlex>
          <StyledFlex>
            <StyledText size={16} weight={500} lh={24}>
              Register yourself, or someone else, to use for this order.
              Once created, this information will be saved and stored on the Customer page, and can be used in future orders.
            </StyledText>
          </StyledFlex>
        </StyledFlex>

        {open && (
          <StyledFlex mt="26px" mr="-10px" flex="1 1 auto">
            <Scrollbars autoHeight autoHeightMin={500} autoHide>
              <StyledFlex flex="1 1 auto" pr="20px" gap="30px 0">
                <StyledFlex gap="30px 0">
                  <StyledText as="h3" weight={600} lh={24}>Customer Details</StyledText>
                  <StyledFlex direction="row" gap="0 30px">
                    {renderInputWithLabel({ type: 'text', field: PRODUCT_FILTERS.FIRST_NAME, label: 'First Name' })}
                    {renderInputWithLabel({ type: 'text', field: PRODUCT_FILTERS.LAST_NAME, label: 'Last Name' })}
                  </StyledFlex>
                  {renderInputWithLabel({ type: 'text', field: PRODUCT_FILTERS.EMAIL, label: 'Email' })}
                  {renderInputWithLabel({ type: 'phone', field: PRODUCT_FILTERS.PHONE_NUMBER, label: 'Phone Number' })}
                  <StyledDivider color={colors.cardGridItemBorder} />
                  <StyledText as="h3" weight={600} lh={24}>Organization Details</StyledText>
                  <StyledFlex direction="row" gap="0 30px" alignItems="center" flex="auto">
                    <StyledFlex direction="column" width="100%">
                      <InputLabel label="Organization" />
                      <CustomSelect
                        name={PRODUCT_FILTERS.ORGANIZATION}
                        placeholder="Select Organization..."
                        options={organizations || []}
                        value={organizations?.find((org) => org?.name === values[PRODUCT_FILTERS.ORGANIZATION])}
                        onChange={(v) => {
                          setFieldValue(PRODUCT_FILTERS.EXTERNAL_ORG_ID, v.externalId, submitCount > 0);
                          setFieldValue(PRODUCT_FILTERS.ORGANIZATION, v.name, submitCount > 0);
                        }}
                        getOptionLabel={(option) => option?.name}
                        getOptionValue={(option) => option?.id}
                        closeMenuOnSelect
                        isClearable={false}
                        invalid={!!errors[PRODUCT_FILTERS.ORGANIZATION]}
                        mb={0}
                        form
                        menuPortalTarget={document.body}
                      />
                      {errors[PRODUCT_FILTERS.ORGANIZATION] && <FormErrorMessage>{errors[PRODUCT_FILTERS.ORGANIZATION]}</FormErrorMessage>}
                    </StyledFlex>
                  </StyledFlex>
                  <StyledFlex direction="column" width="100%">
                    <InputLabel label="Department" />
                    <CustomSelect
                      name={PRODUCT_FILTERS.DEPARTMENT}
                      placeholder="Select Department..."
                      options={organizations?.find((org) => org?.name === values[PRODUCT_FILTERS.ORGANIZATION])?.departments || []}
                      value={organizations?.departments?.find((dept) => dept?.name === values[PRODUCT_FILTERS.DEPARTMENT])}
                      onChange={(v) => {
                        setFieldValue(PRODUCT_FILTERS.COST_CENTER_ID, v.costCenterCode, submitCount > 0);
                        setFieldValue(PRODUCT_FILTERS.EXTERNAL_DEPARTMENT_ID, v.externalId);
                        setFieldValue(PRODUCT_FILTERS.DEPARTMENT, v.name, submitCount > 0);
                      }}
                      getOptionLabel={(option) => option?.name}
                      getOptionValue={(option) => option?.id}
                      closeMenuOnSelect
                      isClearable={false}
                      invalid={!!errors[PRODUCT_FILTERS.DEPARTMENT]}
                      mb={0}
                      form
                      isDisabled={!values[PRODUCT_FILTERS.ORGANIZATION]}
                      menuPortalTarget={document.body}
                    />
                    {errors[PRODUCT_FILTERS.DEPARTMENT] && <FormErrorMessage>{errors[PRODUCT_FILTERS.DEPARTMENT]}</FormErrorMessage>}
                  </StyledFlex>
                  {renderInputWithLabel({
                    type: 'text', field: PRODUCT_FILTERS.COST_CENTER_ID, label: 'Cost Center Code',
                  })}
                  {renderInputWithLabel({ field: PRODUCT_FILTERS.TITLE, label: 'Job Title', isOptional: true })}
                  <StyledFlex direction="column" width="100%">
                    <InputLabel label="Role" isOptional />
                    <CustomSelect
                      name={PRODUCT_FILTERS.ROLE}
                      placeholder="Select Role..."
                      options={GOA_NEW_CUSTOMER_MODAL_ROLE_OPTIONS}
                      value={GOA_NEW_CUSTOMER_MODAL_ROLE_OPTIONS?.find((role) => role?.value === values[PRODUCT_FILTERS.ROLE])}
                      onChange={(v) => {
                        setFieldValue(PRODUCT_FILTERS.ROLE, v?.value || '');
                      }}
                      getOptionLabel={(option) => option?.label}
                      getOptionValue={(option) => option?.value}
                      closeMenuOnSelect
                      isClearable
                      mb={0}
                      form
                      menuPortalTarget={document.body}
                    />
                  </StyledFlex>
                  {renderInputWithLabel({ field: PRODUCT_FILTERS.BADGE_NUMBER, label: 'Badge Number', isOptional: true })}
                  <GoAEscalationContact
                    label="Escalation Contact 1"
                    name={PRODUCT_FILTERS.ESCALATION_CONTACT_1}
                    error={errors[PRODUCT_FILTERS.ESCALATION_CONTACT_1]}
                    value={values[PRODUCT_FILTERS.ESCALATION_CONTACT_1]}
                    options={[]}
                    onChange={(v) => setFieldValue(PRODUCT_FILTERS.ESCALATION_CONTACT_1, v)}
                    isOptional
                  />
                  <GoAEscalationContact
                    label="Escalation Contact 2"
                    name={PRODUCT_FILTERS.ESCALATION_CONTACT_2}
                    error={errors[PRODUCT_FILTERS.ESCALATION_CONTACT_2]}
                    value={values[PRODUCT_FILTERS.ESCALATION_CONTACT_2]}
                    options={[]}
                    onChange={(v) => setFieldValue(PRODUCT_FILTERS.ESCALATION_CONTACT_2, v)}
                    isOptional
                  />
                  <GoAEscalationContact
                    label="Escalation Contact 3"
                    name={PRODUCT_FILTERS.ESCALATION_CONTACT_3}
                    error={errors[PRODUCT_FILTERS.ESCALATION_CONTACT_3]}
                    value={values[PRODUCT_FILTERS.ESCALATION_CONTACT_3]}
                    options={[]}
                    onChange={(v) => setFieldValue(PRODUCT_FILTERS.ESCALATION_CONTACT_3, v)}
                    isOptional
                  />
                  <GoAEscalationContact
                    label="Escalation Contact 4"
                    name={PRODUCT_FILTERS.ESCALATION_CONTACT_4}
                    error={errors[PRODUCT_FILTERS.ESCALATION_CONTACT_4]}
                    value={values[PRODUCT_FILTERS.ESCALATION_CONTACT_4]}
                    options={[]}
                    onChange={(v) => setFieldValue(PRODUCT_FILTERS.ESCALATION_CONTACT_4, v)}
                    isOptional
                  />
                  <GoAEscalationContact
                    label="Escalation Contact 5"
                    name={PRODUCT_FILTERS.ESCALATION_CONTACT_5}
                    error={errors[PRODUCT_FILTERS.ESCALATION_CONTACT_5]}
                    value={values[PRODUCT_FILTERS.ESCALATION_CONTACT_5]}
                    options={[]}
                    onChange={(v) => setFieldValue(PRODUCT_FILTERS.ESCALATION_CONTACT_5, v)}
                    isOptional
                  />
                  {renderInputWithLabel({ field: PRODUCT_FILTERS.USERNAME, label: 'User Name' })}
                  <StyledFlex>
                    <NewPassword
                      formik={{
                        values,
                        errors,
                        setFieldValue,
                        setValues,
                        ...rest,
                      }}
                    />
                  </StyledFlex>

                  <StyledDivider color={colors.cardGridItemBorder} />

                  {renderAddressTitle({ title: 'Address', subtitle: "This is the customer's address, and the same address will be used for shipping." })}
                  <StyledFlex direction="column" width="100%">
                    <InputLabel label="Country" />
                    <CustomSelect
                      options={[{ label: 'Canada', value: 'Canada', code: 'CA' }]}
                      value={{ value: 'Canada', label: 'Canada', code: 'CA' }}
                      closeMenuOnSelect
                      isClearable={false}
                      isSearchable={false}
                      mb={0}
                      form
                      menuPortalTarget={document.body}
                    />
                  </StyledFlex>
                  {renderInputWithLabel({
                    type: 'address',
                    field: `${PRODUCT_FILTERS.SHIPPING_ADDRESS_ROLE}.${PRODUCT_FILTERS.STREET_NAME}`,
                    label: 'Street Address',
                  })}
                  <StyledFlex direction="row" gap="0 15px">
                    {renderInputWithLabel({
                      type: 'text',
                      field: `${PRODUCT_FILTERS.SHIPPING_ADDRESS_ROLE}.${PRODUCT_FILTERS.CITY}`,
                      label: 'City',
                    })}
                    {renderInputWithLabel({
                      type: 'select',
                      field: `${PRODUCT_FILTERS.SHIPPING_ADDRESS_ROLE}.${PRODUCT_FILTERS.PROVINCE}`,
                      options: provinces,
                      label: 'Province',
                    })}
                    {renderInputWithLabel({
                      type: 'text',
                      field: `${PRODUCT_FILTERS.SHIPPING_ADDRESS_ROLE}.${PRODUCT_FILTERS.POSTAL_CODE}`,
                      label: 'Postal/Zip Code',
                    })}
                  </StyledFlex>
                </StyledFlex>
              </StyledFlex>
            </Scrollbars>
          </StyledFlex>
        )}
      </StyledFlex>
    </CenterModalFixed>
  );
};

export default GoANewCustomerModal;
