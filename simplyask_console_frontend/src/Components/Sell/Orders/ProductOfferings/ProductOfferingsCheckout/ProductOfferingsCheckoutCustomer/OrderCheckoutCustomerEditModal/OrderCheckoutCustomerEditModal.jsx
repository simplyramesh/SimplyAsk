import { useFormik } from 'formik';
import { debounce } from 'lodash';
import Scrollbars from 'react-custom-scrollbars-2';
import usePlacesService from 'react-google-autocomplete/lib/usePlacesAutocompleteService';
import PhoneInput from 'react-phone-number-input';

import SidebarIcons from '../../../../../../AppLayout/SidebarIcons/SidebarIcons';
import classes from '../../../../../../Auth/CreateNewAccount/DataCollectionSteps/StepOnePersonalDetails/StepOnePersonalDetails.module.css';
import FormErrorMessage from '../../../../../../Settings/AccessManagement/components/FormErrorMessage/FormErrorMessage';
import BaseTextInput from '../../../../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';
import { StyledButton } from '../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import InputLabel from '../../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import CenterModalFixed from '../../../../../../shared/REDISIGNED/modals/CenterModalFixed/CenterModalFixed';
import CustomSelect from '../../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { StyledCheckbox, StyledFlex, StyledText } from '../../../../../../shared/styles/styled';
import { PRODUCT_CREATE_CUSTOMER_INITIAL_VALUES, PRODUCT_FILTERS } from '../../../../../constants/productInitialValues';
import LoadingMessage from '../../../../../shared/LoadingMessage';
import NoOptionsMessage from '../../../../../shared/NoOptionsMessage';
import { getCustomerAddress, updateAddressValues } from '../../../../../utils/helpers';

import { customerCreationSchema } from './validationSchemas';
import { replaceDynamicUrl } from '../../../../../../../utils/helperFunctions';
import iconCanada from '../../../../../../../Assets/icons/countries/3x2/CA.svg';

const OrderCheckoutCustomerEditModal = ({
  closeFunction,
  submit,
  customer,
  editAddressType,
  open,
  isEditPersonalInformation,
  isEditAddress,
}) => {
  const { placesService, placePredictions, getPlacePredictions } = usePlacesService({
    apiKey: `${import.meta.env.VITE_PLACES_API_KEY}`,
  });

  const headerText = (isEditPersonalInformation, isEditAddress) => {
    if (isEditPersonalInformation && isEditAddress) {
      return 'Customer Create';
    }
    if (isEditPersonalInformation) {
      return 'Edit Personal Details';
    }
    return 'Edit Addresses';
  };

  const { values, errors, setFieldValue, handleSubmit, setValues } = useFormik({
    initialTouched: false,
    enableReinitialize: true,
    initialValues: {
      ...(customer ? { ...customer } : PRODUCT_CREATE_CUSTOMER_INITIAL_VALUES),
      [PRODUCT_FILTERS.SHIPPING_ADDRESS_ROLE]: getCustomerAddress(
        customer?.[PRODUCT_FILTERS.SHIPPING_ADDRESS_ROLE],
        PRODUCT_FILTERS.SHIPPING_ADDRESS_ROLE,
        true
      ),
      [PRODUCT_FILTERS.SERVICE_ADDRESS_ROLE]: getCustomerAddress(
        customer?.[PRODUCT_FILTERS.SERVICE_ADDRESS_ROLE],
        PRODUCT_FILTERS.SERVICE_ADDRESS_ROLE,
        true
      ),
      [PRODUCT_FILTERS.BILLING_ADDRESS_ROLE]: getCustomerAddress(
        customer?.[PRODUCT_FILTERS.BILLING_ADDRESS_ROLE],
        PRODUCT_FILTERS.BILLING_ADDRESS_ROLE,
        true
      ),
      [`${PRODUCT_FILTERS.SERVICE_ADDRESS_ROLE}UseShippingAddress`]: false,
      [`${PRODUCT_FILTERS.BILLING_ADDRESS_ROLE}UseShippingAddress`]: false,
      [`${PRODUCT_FILTERS.BILLING_ADDRESS_ROLE}UseServiceAddress`]: false,
    },
    validationSchema: customerCreationSchema,
    onSubmit: (value, meta) => {
      updateAddressValues(value, PRODUCT_FILTERS.SERVICE_ADDRESS_ROLE, 'Shipping');
      updateAddressValues(value, PRODUCT_FILTERS.BILLING_ADDRESS_ROLE, 'Shipping');
      updateAddressValues(value, PRODUCT_FILTERS.BILLING_ADDRESS_ROLE, 'Service');

      submit(value);
      meta.resetForm();
    },
  });

  const parseAndSetCustomerAddress = (address, type) => {
    if (address) {
      placesService?.getDetails({ placeId: address.place_id }, (placeDetails) => {
        const addressComponents = placeDetails.address_components;
        const country = addressComponents.find((addrComp) => addrComp.types.indexOf('country') !== -1)?.long_name ?? '';
        const province =
          addressComponents.find((addrComp) => addrComp.types.indexOf('administrative_area_level_1') !== -1)
            ?.short_name ?? '';
        const city = addressComponents.find((addrComp) => addrComp.types.indexOf('locality') !== -1)?.long_name ?? '';
        const addressNumber =
          addressComponents.find(
            (addrComp) => addrComp.types.indexOf('street_number') !== -1 || addrComp.types.indexOf('subpremise') !== -1
          )?.long_name ?? '';
        const street = addressComponents.find((addrComp) => addrComp.types.indexOf('route') !== -1)?.long_name ?? '';
        const postalCode =
          addressComponents.find((addrComp) => addrComp.types.indexOf('postal_code') !== -1)?.long_name ?? '';
        const streetAddress = (addressNumber ? `${addressNumber} ` : '') + street;

        const newValues = {
          ...values,
          [type]: {
            [PRODUCT_FILTERS.COUNTRY]: { label: country, value: country },
            [PRODUCT_FILTERS.PROVINCE]: { label: province, value: province },
            [PRODUCT_FILTERS.CITY]: city,
            [PRODUCT_FILTERS.POSTAL_CODE]: postalCode,
            [PRODUCT_FILTERS.STREET_NAME]: streetAddress,
          },
        };

        setValues(newValues);
      });
    }
  };

  const addressItemsLoadFn = debounce((inputValue, setOptions) => {
    getPlacePredictions({ input: inputValue });
    setOptions(placePredictions);
  }, 300);

  const renderCheckboxOption = ({ type, optionType, onChange, label }) => (
    <StyledFlex direction="row" alignItems="center">
      <StyledCheckbox onChange={(e) => onChange(e, values, type)} checked={values[`${type}${optionType}`]} />
      <StyledText size={15} lh={18}>
        {label}
      </StyledText>
    </StyledFlex>
  );

  const renderAddressDetailInput = ({ type, field, options, label }) => {
    const value = type ? values[type][field] : values[field];
    const fieldName = type ? `${type}.${field}` : field;

    return (
      <StyledFlex direction="column" flex="auto">
        <InputLabel label={label} />
        {options ? (
          <CustomSelect
            name={field.toLowerCase()}
            options={options}
            value={value}
            mb={0}
            closeMenuOnSelect
            form
            onChange={(v) => setFieldValue(fieldName, v)}
            isClearable={false}
            isSearchable={false}
          />
        ) : (
          <BaseTextInput
            name={field.toLowerCase()}
            type="text"
            value={value}
            onChange={(e) => {
              setFieldValue(fieldName, e.target.value);
            }}
            invalid={!!errors[field]}
          />
        )}
        {errors[field] && <FormErrorMessage>{errors[field]}</FormErrorMessage>}
      </StyledFlex>
    );
  };

  const addressDetails = (label, description, addressValues, type, showUseService, showUseBilling) => {
    const isUsingBillingAddress =
      showUseBilling &&
      (addressValues.billingAddressUseShippingAddress || addressValues.billingAddressUseServiceAddress);
    const isUsingServiceAddress = !showUseBilling && showUseService && addressValues.serviceAddressUseShippingAddress;

    return (
      <StyledFlex flex="1 1 auto" gap="30px 0">
        <StyledFlex>
          <StyledText lh={24} weight={600}>
            {label}
          </StyledText>
          <StyledText lh={21} size={14}>
            {description}
          </StyledText>
        </StyledFlex>

        {showUseService &&
          renderCheckboxOption({
            type,
            optionType: 'UseShippingAddress',
            onChange: (e) => {
              const isChecked = e.target.checked;
              const value = isChecked ? values[PRODUCT_FILTERS.SHIPPING_ADDRESS_ROLE] : {};

              setFieldValue(type, value);
              setFieldValue(`${type}UseShippingAddress`, isChecked);
              setFieldValue(`${type}UseServiceAddress`, showUseBilling && isChecked ? !isChecked : false);
            },
            label: 'Use Shipping Address',
          })}
        {showUseBilling &&
          renderCheckboxOption({
            type,
            optionType: 'UseServiceAddress',
            onChange: (e) => {
              const isChecked = e.target.checked;
              const value = isChecked ? values[PRODUCT_FILTERS.SERVICE_ADDRESS_ROLE] : {};

              setFieldValue(type, value);
              setFieldValue(`${type}UseServiceAddress`, isChecked);
              setFieldValue(`${type}UseShippingAddress`, isChecked ? !isChecked : false);
            },
            label: 'Use Service Address',
          })}

        {!isUsingBillingAddress && !isUsingServiceAddress && (
          <>
            <StyledFlex>
              <InputLabel label="Address Search" />
              <CustomSelect
                defaultOptions={placePredictions}
                isAsync
                loadOptions={addressItemsLoadFn}
                placeholder="Address Search"
                form
                closeMenuOnSelect
                closeMenuOnScroll
                getOptionLabel={(option) => option.description}
                getOptionValue={(option) => option[PRODUCT_FILTERS.ID]}
                onChange={(val) => parseAndSetCustomerAddress(val, type)}
                components={{
                  DropdownIndicator: () => null,
                  NoOptionsMessage,
                  LoadingMessage,
                }}
              />
            </StyledFlex>
            {renderAddressDetailInput({
              type,
              field: PRODUCT_FILTERS.COUNTRY,
              options: [
                { label: 'Canada', value: 'Canada' },
                { label: 'USA', value: 'USA' },
              ],
              label: 'Country',
            })}
            {renderAddressDetailInput({ type, field: PRODUCT_FILTERS.STREET_NAME, label: 'Street Address' })}
            <StyledFlex mb={2} gap="15px" direction="row" flex="1 1 auto">
              {renderAddressDetailInput({ type, field: PRODUCT_FILTERS.CITY, label: 'City' })}
              {renderAddressDetailInput({
                type,
                field: PRODUCT_FILTERS.PROVINCE,
                options: [
                  { label: 'BC', value: 'BC' },
                  { label: 'ON', value: 'ON' },
                ],
                label: 'Province',
              })}
              {renderAddressDetailInput({ type, field: PRODUCT_FILTERS.POSTAL_CODE, label: 'Postal/Zip Code' })}
            </StyledFlex>
          </>
        )}
      </StyledFlex>
    );
  };

  return (
    <CenterModalFixed
      open={open}
      onClose={closeFunction}
      maxWidth="775px"
      enableScrollbar={false}
      title={headerText(isEditPersonalInformation, isEditAddress)}
      actions={
        <StyledFlex direction="row" justifyContent="flex-end" width="100%">
          <StyledButton primary variant="contained" onClick={handleSubmit}>
            {isEditPersonalInformation && isEditAddress ? 'Create' : 'Save Changes'}
          </StyledButton>
        </StyledFlex>
      }
    >
      <StyledFlex flex="1 1 auto" p="20px 0px 20px 30px">
        {isEditPersonalInformation && isEditAddress && (
          <>
            <StyledFlex gap="10px" alignItems="center" direction="row" justifyContent="flex-start">
              <StyledFlex as="span" cursor="pointer" onClick={() => closeFunction?.(false)}>
                <SidebarIcons icon="BACK" width="20px" />
              </StyledFlex>
              <StyledFlex>
                <StyledText weight={200}>Go Back to Search Result</StyledText>
              </StyledFlex>
            </StyledFlex>
            <StyledFlex>
              <StyledText mt={8} size={13} lh={14}>
                Register yourself, or someone else, to use for this order. Once created, this information will be saved
                and stored on the Customer page, and can be used in future orders.{' '}
              </StyledText>
            </StyledFlex>
          </>
        )}
        {open && (
          <StyledFlex mt="26px" mr="-10px" flex="1 1 auto">
            <Scrollbars autoHeight autoHeightMin={500} autoHide>
              <StyledFlex flex="1 1 auto" pr="20px" gap="30px 0">
                {isEditPersonalInformation && (
                  <StyledFlex gap="30px 0">
                    <StyledText mb="2px" weight={200}>
                      Personal Details
                    </StyledText>
                    <StyledFlex direction="row" gap="0 30px">
                      {renderAddressDetailInput({
                        field: PRODUCT_FILTERS.FIRST_NAME,
                        label: 'First Name',
                      })}
                      {renderAddressDetailInput({
                        field: PRODUCT_FILTERS.LAST_NAME,
                        label: 'Last Name',
                      })}
                    </StyledFlex>
                    {renderAddressDetailInput({
                      field: PRODUCT_FILTERS.EMAIL,
                      label: 'Email',
                    })}
                    <StyledFlex>
                      <StyledText weight={500}>Phone</StyledText>
                      <PhoneInput
                        name={PRODUCT_FILTERS.PHONE_NUMBER}
                        international
                        defaultCountry="CA"
                        value={values[PRODUCT_FILTERS.PHONE_NUMBER]}
                        onChange={(value) => setFieldValue(PRODUCT_FILTERS.PHONE_NUMBER, value)}
                        className={classes.phoneNumberInput}
                        placeholder="+1 123 456 7890"
                        flagUrl={replaceDynamicUrl(iconCanada)}
                      />
                      {errors[PRODUCT_FILTERS.PHONE_NUMBER] && (
                        <FormErrorMessage>{errors[PRODUCT_FILTERS.PHONE_NUMBER]}</FormErrorMessage>
                      )}
                    </StyledFlex>
                  </StyledFlex>
                )}
                {isEditAddress &&
                  (!editAddressType || editAddressType === PRODUCT_FILTERS.SHIPPING_ADDRESS_ROLE) &&
                  addressDetails(
                    'Shipping address',
                    'This will be the address all physical products are delivered to.',
                    values,
                    PRODUCT_FILTERS.SHIPPING_ADDRESS_ROLE,
                    false,
                    false
                  )}
                {isEditAddress &&
                  (!editAddressType || editAddressType === PRODUCT_FILTERS.SERVICE_ADDRESS_ROLE) &&
                  addressDetails(
                    'Service address',
                    'This will be the address all products will be registered to and used on. This is mainly used for non-physical products that need to be connected to a residence, such as Internet and TV plans.',
                    values,
                    PRODUCT_FILTERS.SERVICE_ADDRESS_ROLE,
                    true,
                    false
                  )}
                {isEditAddress &&
                  (!editAddressType || editAddressType === PRODUCT_FILTERS.BILLING_ADDRESS_ROLE) &&
                  addressDetails(
                    'Billing address',
                    'This will be the address all orders are billed to.  This address must match the address associated with the payment information.',
                    values,
                    PRODUCT_FILTERS.BILLING_ADDRESS_ROLE,
                    true,
                    true
                  )}
              </StyledFlex>
            </Scrollbars>
          </StyledFlex>
        )}
      </StyledFlex>
    </CenterModalFixed>
  );
};

export default OrderCheckoutCustomerEditModal;
