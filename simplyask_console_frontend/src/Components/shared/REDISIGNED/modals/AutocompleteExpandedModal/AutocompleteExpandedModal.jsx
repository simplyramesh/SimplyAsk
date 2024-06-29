import { useEffect, useState } from 'react';

import { InputField } from '../../../../WorkflowEditor/components/sideMenu/base';
import { StyledFlex } from '../../../styles/styled';
import { StyledButton } from '../../controls/Button/StyledButton';
import CenterModalFixed from '../CenterModalFixed/CenterModalFixed';

const AutocompleteExpandedModal = ({
  placeholder, onClose, onConfirm, value, open, children
}) => {
  const [localValue, setLocalValue] = useState('');

  useEffect(() => {
    setLocalValue(value);
  }, [open])

  return (
    <CenterModalFixed
      open={open}
      onClose={onClose}
      maxWidth="908px"
      width="100%"
      title="Expanded Editor"
      actions={(
        <StyledFlex mt="12px" direction="row" justifyContent="flex-end" width="100%">
          <StyledButton
            primary
            variant="contained"
            onClick={() => onConfirm(localValue)}
          >
            Confirm
          </StyledButton>
        </StyledFlex>
      )}
    >
      <StyledFlex p="24px">
        <StyledFlex position="relative" zIndex={1}>
          {children ? children(localValue, setLocalValue) : (
            <InputField
              id={`expanded-editor-${placeholder}-${open}`}
              placeholder={placeholder}
              value={localValue}
              onChange={(value) => setLocalValue(value)}
              paramAutocomplete
              width="100%"
              minHeight="420px"
            />
          )}
        </StyledFlex>
      </StyledFlex>
    </CenterModalFixed>
  );
};

export default AutocompleteExpandedModal;
