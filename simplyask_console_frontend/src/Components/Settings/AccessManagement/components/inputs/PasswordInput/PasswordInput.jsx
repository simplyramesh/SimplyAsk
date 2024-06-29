import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

import BaseTextInput from '../../../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';
import InputLabel from '../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import CustomTableIcons from '../../../../../shared/REDISIGNED/icons/CustomTableIcons';
import { StyledTooltip } from '../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { StyledDivider, StyledFlex } from '../../../../../shared/styles/styled';

import { AbsoluteContainer, Container, DividerWrapper } from './StyledPasswordInput';

const PasswordInput = ({
  label, width, margin, isOptional, inputProps, errors, children, isMasked = true, onGeneratePassword, onShowPassword, withGenerate,
}) => {
  const { colors } = useTheme();

  return (
    <StyledFlex flex="auto" width={width} m={margin}>
      <InputLabel id={inputProps?.id} name={inputProps?.name} label={label} isOptional={isOptional} />
      <Container>
        <BaseTextInput
          {...inputProps}
          borderColor={errors?.error ? colors.validationError : colors.borderNoError}
          autoComplete="one-time-code"
        />
        <AbsoluteContainer>
          {withGenerate
          && (
            <StyledTooltip
              title="Generate Unique Password"
              arrow
              placement="top"
              p="8px 13px"
              size="14px"
              lh="24px"
              radius="10px"
              maxWidth="380px"
            >
              <CustomTableIcons
                width={24}
                icon="GENERATE_PASSWORD"
                onClick={onGeneratePassword}
              />
            </StyledTooltip>
          )}
          <DividerWrapper>
            <StyledDivider orientation="vertical" />
          </DividerWrapper>
          <CustomTableIcons
            width={24}
            icon={isMasked ? 'SEE_PASSWORD' : 'MASK_PASSWORD'}
            onClick={onShowPassword}
          />
        </AbsoluteContainer>
      </Container>
      {errors?.error && children}
    </StyledFlex>
  );
};

export default PasswordInput;

PasswordInput.propTypes = {
  label: PropTypes.string,
  width: PropTypes.string,
  margin: PropTypes.string,
  isOptional: PropTypes.bool,
  children: PropTypes.node,
  inputProps: PropTypes.object,
  errors: PropTypes.object,
  isMasked: PropTypes.bool,
  onGeneratePassword: PropTypes.func,
  onShowPassword: PropTypes.func,
  withGenerate: PropTypes.bool,
};
