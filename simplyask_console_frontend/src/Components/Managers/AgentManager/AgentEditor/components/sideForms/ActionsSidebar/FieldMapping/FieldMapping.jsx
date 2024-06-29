import { InfoOutlined } from '@mui/icons-material';
import React from 'react';

import FormValidationMessage from '../../../../../../../shared/forms/FormValidationMessage/FormValidationMessage';
import { StyledButton } from '../../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import { StyledTooltip } from '../../../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { StyledDivider, StyledFlex, StyledText } from '../../../../../../../shared/styles/styled';

import { StyledFieldMapping } from './StyledFieldMapping';

const FieldMapping = ({
  children,
  value,
  onEditFields,
  errors,
  disabled,
  emptyValueDesc,
  editButtonTitle,
  tooltipTitle,
  removeTopMargin = false,
}) => (
  <StyledFieldMapping error={errors} removeTopMargin={removeTopMargin}>
    <StyledFlex direction="row" gap="9px">
      <StyledText size={14} weight={600} lh={14}>
        Field Data Mappings
      </StyledText>
      {tooltipTitle && (
        <StyledTooltip arrow placement="top" title={tooltipTitle} p="10px 15px" maxWidth="325px">
          <InfoOutlined fontSize="inherit" />
        </StyledTooltip>
      )}
    </StyledFlex>
    <StyledDivider m="0" />
    {value?.length > 0 ? (
      children
    ) : (
      <StyledFlex alignItems="center">
        <StyledText size={14} textAlign="center" width="298px">
          <StyledFlex alignItems="center">{emptyValueDesc}</StyledFlex>
        </StyledText>
      </StyledFlex>
    )}

    <StyledButton
      primary
      variant="outlined"
      onClick={onEditFields}
      fullWidth
      transparent
      disabled={disabled}
      disabledbgcolor="transparent"
    >
      {editButtonTitle}
    </StyledButton>
    {errors ? <FormValidationMessage text={errors?.message ? errors.message : 'Incomplete Mandatory Fields'} /> : null}
  </StyledFieldMapping>
);

export default FieldMapping;
