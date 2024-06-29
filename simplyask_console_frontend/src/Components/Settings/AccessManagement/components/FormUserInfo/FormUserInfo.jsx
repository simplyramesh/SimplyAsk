import moment from 'moment';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';

import {
  getBillingCountryOptions as getCountries,
  getBillingProvinceOptions as getProvinces,
} from '../../../../../Services/axios/billing';
import { StyledDivider, StyledFlex, StyledText } from '../../../../shared/styles/styled';
import { ADD_USER } from '../../constants/apiConstants';
import FormErrorMessage from '../FormErrorMessage/FormErrorMessage';
import PhoneNumberInput from '../inputs/PhoneNumberInput/PhoneNumberInput';
import ValidationInput from '../inputs/ValidationInput/ValidationInput';

const createOptions = (data, key) => {
  const options = data?.map((item) => ({ [key]: item }));

  return options;
};

const timezoneOptions = createOptions(moment.tz.names(), 'timezone');

const changeValue = (formik, fieldName, value) => {
    formik.setFieldValue(fieldName, value);
}

const FormUserInfo = ({ formik, contactInfoTitle }) => {
  const { data: countries } = useQuery({
    queryKey: ['getCountries'],
    queryFn: getCountries,
  });

  const { data: provinces } = useQuery({
    queryKey: ['getProvinces', formik.values?.[ADD_USER.COUNTRY]],
    queryFn: () => getProvinces(formik.values?.[ADD_USER.COUNTRY]?.[ADD_USER.COUNTRY_CODE]),
    enabled: !!formik.values?.[ADD_USER.COUNTRY]?.[ADD_USER.COUNTRY_CODE],
  });

  return (
    <>
      <StyledFlex p="0 10px 0 6px">
        <StyledText as="h3" size={20} weight={600} mb={24}>
          About
        </StyledText>
        <StyledFlex direction="row" gap="18px" width="100%" m="0 0 24px 0">
          <ValidationInput
            label="First Name"
            inputProps={{
              ...formik.getFieldProps(ADD_USER.FIRST_NAME),
                onChange: (e) => changeValue(formik, ADD_USER.FIRST_NAME, e.target.value)
            }}
            errors={formik.getFieldMeta(ADD_USER.FIRST_NAME)}
          >
            <FormErrorMessage>{formik.errors[ADD_USER.FIRST_NAME]}</FormErrorMessage>
          </ValidationInput>
          <ValidationInput
            label="Last Name"
            inputProps={{
                ...formik.getFieldProps(ADD_USER.LAST_NAME),
                onChange: (e) => changeValue(formik, ADD_USER.LAST_NAME, e.target.value)
            }}
            errors={formik.getFieldMeta(ADD_USER.LAST_NAME)}
          >
            <FormErrorMessage>{formik.errors[ADD_USER.LAST_NAME]}</FormErrorMessage>
          </ValidationInput>
        </StyledFlex>
        <ValidationInput
          label="Country"
          isOptional
          isSelect
          width="100%"
          margin="0 0 24px 0"
          inputProps={{
            ...formik.getFieldProps(ADD_USER.COUNTRY),
            placeholder: 'Select Country',
            options: countries,
            getOptionLabel: (option) => option.name,
            getOptionValue: (option) => option.code,
            onChange: (option) => formik.setFieldValue(ADD_USER.COUNTRY, option),
          }}
        />
        <ValidationInput
          label="Province/State"
          isOptional
          isSelect
          width="100%"
          margin="0 0 24px 0"
          inputProps={{
            ...formik.getFieldProps(ADD_USER.PROVINCE),
            placeholder: 'Select Province',
            options: provinces,
            getOptionLabel: (option) => `${option[ADD_USER.PROVINCE_NAME]}`,
            getOptionValue: (option) => `${option[ADD_USER.PROVINCE_NAME]}`,
            isDisabled: !provinces,
            onChange: (option) => formik.setFieldValue(ADD_USER.PROVINCE, option),
          }}
        />
        <ValidationInput
          label="City"
          isOptional
          width="100%"
          margin="0 0 24px 0"
          inputProps={formik.getFieldProps(ADD_USER.CITY)}
        />
        <ValidationInput
          label="Time Zone"
          isSelect
          width="100%"
          margin="0 0 24px 0"
          inputProps={{
            ...formik.getFieldProps(ADD_USER.TIMEZONE),
            placeholder: 'Select Time Zone',
            options: timezoneOptions,
            getOptionLabel: (option) => `${option[ADD_USER.TIMEZONE]}`,
            getOptionValue: (option) => `${option[ADD_USER.TIMEZONE]}`,
            value: formik.values[ADD_USER.TIMEZONE] !== '' && {
              [ADD_USER.TIMEZONE]: formik.values[ADD_USER.TIMEZONE],
            },
            onChange: (option) => formik.setFieldValue(ADD_USER.TIMEZONE, option[ADD_USER.TIMEZONE]),
          }}
          errors={formik.getFieldMeta(ADD_USER.TIMEZONE)}
        >
          <FormErrorMessage>{formik.errors[ADD_USER.TIMEZONE]}</FormErrorMessage>
        </ValidationInput>
      </StyledFlex>
      <StyledDivider orientation="horizontal" flexItem />
      <StyledFlex p="0 10px 0 6px">
        <StyledText as="h3" size={20} weight={600} mt={42} mb={24}>
          {`${contactInfoTitle ? `${contactInfoTitle} ` : ''}Contact Information`}
        </StyledText>
        <ValidationInput
          label="Email"
          width="100%"
          margin="0 0 24px 0"
          inputProps={{ ...formik.getFieldProps(ADD_USER.EMAIL),
              onChange: (e) => changeValue(formik, ADD_USER.EMAIL, e.target.value),
              autoComplete: 'off' }}
          errors={formik.getFieldMeta(ADD_USER.EMAIL)}
        >
          <FormErrorMessage>{formik.errors[ADD_USER.EMAIL]}</FormErrorMessage>
        </ValidationInput>
        <PhoneNumberInput
          label="Phone Number"
          isOptional
          width="100%"
          margin="0 0 50px 0"
          inputProps={formik.getFieldProps(ADD_USER.PHONE)}
        />
      </StyledFlex>
    </>
  );
};

export default FormUserInfo;

FormUserInfo.propTypes = {
  formik: PropTypes.object,
  contactInfoTitle: PropTypes.string,
};
