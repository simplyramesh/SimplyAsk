import React, { useEffect } from 'react';
import { StyledValidationTypeInputWrapper } from '../sideForms/ActionsSidebar/StyledActionSidebar';
import { StyledFlex, StyledRadio } from '../../../../../shared/styles/styled';
import RadioGroupSet from '../../../../../shared/REDISIGNED/controls/Radio/RadioGroupSet';
import { StyledButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import InputVisibilityToggle from '../../../../../shared/REDISIGNED/controls/InputVisibiltyToggle/InputVisibilityToggle';
import HiddenValue from '../../../../../Settings/Components/FrontOffice/components/shared/HiddenValue';

export const VALIDATION_TYPE_RADIO_CLEAR_BUTTON_ID = 'radioClearButtonId';
export const RADIO_BUTTON_VALUE_NAME = 'radioButtonValueName';

const RadioButtonBooleanInput = ({ value, onChange, error, isRequired, inputRef, ...rest }) => {
  const { isProtected, isTextHidden, onTextHidden } = rest;

  useEffect(() => {
    if (inputRef?.current) inputRef.current.focus();
  }, [inputRef?.current]);

  const renderBooleanInput = () => {
    if (!value || !isTextHidden)
      return (
        <RadioGroupSet row value={value} onChange={onChange}>
          <StyledRadio
            value="true"
            label="True"
            size={18}
            name={RADIO_BUTTON_VALUE_NAME}
            {...(value ? {} : { inputRef })}
          />
          <StyledRadio
            value="false"
            name={RADIO_BUTTON_VALUE_NAME}
            label="False"
            size={18}
            {...(value ? { inputRef } : {})}
          />
        </RadioGroupSet>
      );

    return (
      <StyledFlex ref={inputRef} tabIndex={0} mt="3px">
        <HiddenValue showIcon={false} showToolTip={false} />
      </StyledFlex>
    );
  };

  return (
    <StyledValidationTypeInputWrapper error={error}>
      <StyledFlex p="0 4px" gap="8px">
        <StyledFlex direction="row" gap="8px" alignItems="center">
          {renderBooleanInput()}
          {isProtected && <InputVisibilityToggle isTextHidden={isTextHidden} onTextHidden={onTextHidden} />}
        </StyledFlex>

        {!isRequired ? (
          <StyledFlex width="114px">
            <StyledButton
              variant="text"
              id={VALIDATION_TYPE_RADIO_CLEAR_BUTTON_ID}
              onClick={() => {
                onChange('');
              }}
              justifycontent="start"
              fontWeight={600}
              fontSize={16}
            >
              Clear Option
            </StyledButton>
          </StyledFlex>
        ) : null}
      </StyledFlex>
    </StyledValidationTypeInputWrapper>
  );
};

export default RadioButtonBooleanInput;
