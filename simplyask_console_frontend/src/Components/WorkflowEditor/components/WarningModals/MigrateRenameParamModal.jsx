import React, { useCallback, useState } from 'react';

import ConfirmationModal from '../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import { StyledFlex, StyledText } from '../../../shared/styles/styled';
import { RadioGroup, RadioInput } from '../sideMenu/base';

const MigrateRenameParamModal = ({ open = false, onSubmit, onCancel }) => {
  const [shouldMigrate, setShouldMigrate] = useState(true);

  const onChange = useCallback((event) => {
    setShouldMigrate(event.target.value === 'true');
  }, [shouldMigrate]);

  return (
    <ConfirmationModal
      isOpen={open}
      onCloseModal={onCancel}
      onSuccessClick={() => onSubmit(shouldMigrate)}
      alertType="WARNING"
      title="Warning!"
      textDirection="left"
    >
      <StyledFlex>
        <StyledText as="p" size={14} lh={20} textAlign="center">
          This parameter appears in later steps of the workflow. To avoid conflicts caused by the name change, you must either:
        </StyledText>

        <StyledFlex mt={3} mb={4}>
          <RadioGroup orientation="column" name="migrate">
            <RadioInput
              label="Migrate the later usages of the parameter to the new name (default option)"
              id="migrate"
              variant="small"
              checked={shouldMigrate}
              value
              onChange={onChange}
            />

            <RadioInput
              label="Remove all existing usages of this parameter"
              id="no-migrate"
              variant="small"
              checked={!shouldMigrate}
              value={false}
              onChange={onChange}
            />
          </RadioGroup>
        </StyledFlex>
      </StyledFlex>
    </ConfirmationModal>
  );
};

export default MigrateRenameParamModal;
