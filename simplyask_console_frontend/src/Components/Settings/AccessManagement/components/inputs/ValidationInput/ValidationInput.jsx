import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

import BaseTextArea from '../../../../../shared/REDISIGNED/controls/BaseTextArea/BaseTextArea';
import BaseTextInput from '../../../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';
import InputLabel from '../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import { StyledFlex } from '../../../../../shared/styles/styled';
import FormDropdown from '../../dropdowns/FormDropdown/FormDropdown';

const ValidationInput = ({
  label, width, height, margin, isOptional, isSelect, children, inputProps, errors, isTextArea, inputHeight,
}) => {
  const { colors } = useTheme();

  return (
    <StyledFlex direction="column" flex="auto" width={width} height={height} m={margin}>
      <InputLabel label={label} isOptional={isOptional} />
      {!isSelect && (
        isTextArea
          ? (
            <BaseTextArea
              {...inputProps}
              borderColor={errors?.error && colors.validationError}
            />
          ) : (
            <BaseTextInput
              {...inputProps}
              inputHeight={inputHeight}
              borderColor={errors?.error && colors.validationError}
            />
          )
      )}
      {isSelect && (
        <FormDropdown
          {...inputProps}
          borderColor={errors?.error && colors.validationError}
        />
      )}
      {errors?.error && children}
    </StyledFlex>
  );
};

export default ValidationInput;

ValidationInput.propTypes = {
  label: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  inputHeight: PropTypes.string,
  margin: PropTypes.string,
  isOptional: PropTypes.bool,
  children: PropTypes.node,
  isSelect: PropTypes.bool,
  isTextArea: PropTypes.bool,
  inputProps: PropTypes.object,
  errors: PropTypes.object,
};
