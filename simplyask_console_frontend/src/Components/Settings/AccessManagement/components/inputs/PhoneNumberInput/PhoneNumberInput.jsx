import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { memo, useState } from 'react';

import InputLabel from '../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import { StyledPhoneNumberInput, StyledPlusOne } from './StyledPhoneNumberInput';

const PhoneNumberInput = ({
  label,
  isOptional,
  width,
  margin,
  errors,
  borderColor,
  inputProps,
  children,
  plusOneBorderRadius,
  labelProps,
}) => {
  const { colors } = useTheme();

  const [phoneInput, setPhoneInput] = useState('');

  const onlyNumbers = (e) => {
    const phoneRegEx = /^[0-9\b]+$/;

    if (e.target.value !== '' && !phoneRegEx.test(e.target.value)) return;

    setPhoneInput(e.target.value);

    inputProps?.onChange(e);
  };

  return (
    <StyledFlex direction="column" flex="auto" width={width} m={margin}>
      <InputLabel label={label} isOptional={isOptional} {...labelProps} />
      <StyledFlex position="relative" direction="row" flex="auto" width="100%">
        <StyledPlusOne borderColor={borderColor} plusOneBorderRadius={plusOneBorderRadius}>
          <StyledText as="span" size={16} weight={400} color={colors.black}>
            +1
          </StyledText>
        </StyledPlusOne>
        <StyledPhoneNumberInput
          value={phoneInput}
          onChange={onlyNumbers}
          {...inputProps}
          borderColor={borderColor}
          type="tel"
          placeholder="123 456 7890"
        />
      </StyledFlex>
      {errors?.error && children}
    </StyledFlex>
  );
};

export default memo(PhoneNumberInput);

PhoneNumberInput.propTypes = {
  label: PropTypes.string,
  width: PropTypes.string,
  margin: PropTypes.string,
  isOptional: PropTypes.bool,
  errors: PropTypes.object,
  borderColor: PropTypes.string,
  inputProps: PropTypes.object,
};
