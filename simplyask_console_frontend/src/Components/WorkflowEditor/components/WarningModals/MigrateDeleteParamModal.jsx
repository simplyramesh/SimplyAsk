import { useEffect, useState } from 'react';

import ConfirmationModal from '../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import { StyledFlex, StyledText } from '../../../shared/styles/styled';
import { ERROR_TYPES } from '../../utils/validation';
import { RadioInput } from '../sideMenu/base';
import WorkflowParamDropdown from '../sideMenu/base/inputs/WorkflowParamDropdown/WorkflowParamDropdown';

export const MIGRATE_TYPE = {
  TO_EXISTING: 'TO_EXISTING',
  REMOVE: 'REMOVE',
};

const MigrateDeleteParamModal = ({ open = false, onSubmit, onCancel, paramName }) => {
  const [migrateType, setMigrateType] = useState(MIGRATE_TYPE.TO_EXISTING);
  const [paramValue, setParamValue] = useState(null);
  const [error, setError] = useState(null);

  const handleOnSubmit = () => {
    if (migrateType === MIGRATE_TYPE.TO_EXISTING && !paramValue) {
      setError({
        type: ERROR_TYPES.ERROR,
      });

      return;
    }

    onSubmit(migrateType, paramValue);
  };

  useEffect(() => {
    if (paramValue) {
      setError(null);
    }
  }, [paramValue]);

  return (
    <ConfirmationModal
      isOpen={open}
      onCloseModal={onCancel}
      onSuccessClick={() => handleOnSubmit(migrateType, paramValue)}
      alertType="DANGER"
      title="Warning!"
      textDirection="left"
    >
      <StyledFlex>
        <StyledText as="p" size={14} lh={20} textAlign="center">
          This parameter appears in later steps of the workflow. To avoid conflicts caused by this parameter being
          deleted, you must:
        </StyledText>

        <StyledFlex mt={4} mb={4} gap={2}>
          <RadioInput
            label="Migrate all later usages of this parameter to an existing parameter (default option)"
            id="migrate-to-existing"
            variant="small"
            checked={migrateType === MIGRATE_TYPE.TO_EXISTING}
            onChange={() => setMigrateType(MIGRATE_TYPE.TO_EXISTING)}
            withButton
          />

          <StyledFlex ml={4}>
            <WorkflowParamDropdown
              name="validationType"
              onChange={(event) => setParamValue(event)}
              placeholder="Select Workflow Parameter"
              menuPosition="fixed"
              isMulti={false}
              error={error}
              disabledOption={paramName}
              isDisabled={migrateType !== MIGRATE_TYPE.TO_EXISTING}
            />
          </StyledFlex>

          <RadioInput
            withButton
            label="Remove all later usages of this parameter"
            id="remove-usages"
            variant="small"
            checked={migrateType === MIGRATE_TYPE.REMOVE}
            onChange={() => setMigrateType(MIGRATE_TYPE.REMOVE)}
          />
        </StyledFlex>
      </StyledFlex>
    </ConfirmationModal>
  );
};

export default MigrateDeleteParamModal;
