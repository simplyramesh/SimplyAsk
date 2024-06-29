import React from 'react';
import { StyledButton } from '../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import InputLabel from '../../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import CustomSelect from '../../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import Spinner from '../../../../../../shared/Spinner/Spinner';
import { BlueLinkNoUnderLine, StyledFlex, StyledText } from '../../../../../../shared/styles/styled';
import FormErrorMessage from '../../../../../AccessManagement/components/FormErrorMessage/FormErrorMessage';

const PhoneNumberManagementGenerateNewPhoneNumber = ({
  values,
  isPhoneNumberGenerating,
  countryDataOptions,
  provinceDataOptions,
  countryInputOnBlur,
  errors,
  touched,
  isProvinceDataOptionsFetching,
  isRegionDataOptionsFetching,
  regionDataOptions,
  generateNumberOnClick,
  countryCustomSelectOnChange,
  provinceOrStateCustomSelectOnChange,
  regionCustomSelectOnChange,
}) => {
  if (isPhoneNumberGenerating) return <Spinner parent medium />;
  return (
    <StyledFlex>
      <StyledFlex p="20px 30px">
        <StyledFlex mb={2}>
          <InputLabel label="Select a Country" isOptional={false} />
          <CustomSelect
            options={countryDataOptions}
            placeholder="Select a Country"
            onChange={countryCustomSelectOnChange}
            onBlur={countryInputOnBlur}
            value={values.country}
            closeMenuOnSelect
            isClearable={false}
            isSearchable={false}
            components
            maxHeight={30}
            menuPadding={0}
            form
            withSeparator
          />
          {errors.country && touched.country && <FormErrorMessage>{errors.country}</FormErrorMessage>}
        </StyledFlex>
        <StyledFlex mb={2} opacity={values.countryCode.length === 0 || isProvinceDataOptionsFetching ? 0.4 : 1}>
          <InputLabel label="Select a Province/State" isOptional={false} />
          <CustomSelect
            options={provinceDataOptions}
            placeholder="Select a Province/State"
            onChange={provinceOrStateCustomSelectOnChange}
            value={values.countryStateCode}
            closeMenuOnSelect
            isDisabled={values.countryCode.length === 0 || isProvinceDataOptionsFetching}
            isClearable={false}
            isSearchable={false}
            components
            maxHeight={30}
            menuPadding={0}
            form
            withSeparator
          />
        </StyledFlex>
        <StyledFlex opacity={values.countryStateCode.length === 0 || isRegionDataOptionsFetching ? 0.4 : 1}>
          <InputLabel label="Select an Area Code" isOptional={false} />
          <CustomSelect
            options={regionDataOptions}
            placeholder="Select an Area Code"
            onChange={regionCustomSelectOnChange}
            value={values.region}
            isDisabled={values.countryStateCode.length === 0 || isRegionDataOptionsFetching}
            closeMenuOnSelect
            isClearable={false}
            isSearchable={false}
            components
            maxHeight={30}
            menuPadding={0}
            form
            withSeparator
          />
        </StyledFlex>
        <StyledText weight={400} size={16} mt={10} mb={10}>
          Your account will be billed monthly for each generated phone number.
          <BlueLinkNoUnderLine href="https://simplyask.ai/terms-of-service" target="_blank" rel="noopener noreferrer">
            {' '}
            Learn more here.
          </BlueLinkNoUnderLine>
        </StyledText>
        <StyledFlex width="229px">
          <StyledButton onClick={generateNumberOnClick} variant="contained" primary>
            Generate Number
          </StyledButton>
        </StyledFlex>
      </StyledFlex>
    </StyledFlex>
  );
};

export default PhoneNumberManagementGenerateNewPhoneNumber;
