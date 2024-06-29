import { InfoOutlined } from '@mui/icons-material';
import React, { useState } from 'react';
import InputLabel from '../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import { StyledTooltip } from '../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { StyledFlex } from '../../../../shared/styles/styled';
import FieldMapping from '../../../AgentManager/AgentEditor/components/sideForms/ActionsSidebar/FieldMapping/FieldMapping';
import FieldMappingAccordion from '../../../AgentManager/AgentEditor/components/sideForms/ActionsSidebar/FieldMapping/FieldMappingAccordion';
import InputFieldsModal from '../../../AgentManager/AgentEditor/components/sideForms/ActionsSidebar/InputFieldsModal/InputFieldsModal';
import { getOptionalAndRequiredParams } from '../../utils/params';

const INPUT_FIELDS_MODAL_TEXT_MAP = {
  PROCESS: {
    title: 'Edit Process Input Fields',
    description: 'Configure the values for process execution. All mandatory fields must have values.',
  },
  SERVICE_TICKET: {
    title: 'Edit Ticket Type Fields',
    description: 'Configure the values stored in the generated ticket. All mandatory fields must have values.',
  },
};

const InputFieldsControl = ({
  label,
  labelTooltip,
  value = [],
  onSave,
  modalTextEnum = 'PROCESS',
  type = 'WORKFLOW',
  isAutocompleteDefault = false,
}) => {
  const [fieldsModalOpened, setFieldsModalOpened] = useState(null);

  const modalText = INPUT_FIELDS_MODAL_TEXT_MAP[modalTextEnum];

  const {
    optionalFields,
    requiredFields,
    optionalFieldsCount,
    requiredFieldsCount,
    requiredFieldsFilled,
    optionalFieldsFilled,
    fieldParams,
  } = getOptionalAndRequiredParams(value, type);

  return (
    <StyledFlex>
      <StyledFlex direction="row" alignItems="center" gap="5px" marginBottom="10px">
        <InputLabel label={label} name="fieldsMappings" isOptional={false} size={15} weight={600} mb={0} lh={24} />
        {!!labelTooltip && (
          <StyledTooltip arrow placement="top" title={labelTooltip} p="10px 15px">
            <InfoOutlined fontSize="inherit" />
          </StyledTooltip>
        )}
      </StyledFlex>
      <FieldMapping
        value={value}
        onEditFields={() => setFieldsModalOpened(true)}
        disabled={!value.length}
        emptyValueDesc="Select a Process First in Order to Edit the Field Data"
        editButtonTitle="Edit Process Fields"
        errors={requiredFieldsFilled !== requiredFieldsCount}
      >
        <StyledFlex>
          {requiredFieldsCount > 0 && (
            <FieldMappingAccordion
              fields={requiredFields}
              label={`${requiredFieldsFilled} / ${requiredFieldsCount} Mandatory Fields Configured`}
            />
          )}
          {optionalFieldsCount > 0 && (
            <FieldMappingAccordion
              fields={optionalFields}
              label={`${optionalFieldsFilled} / ${optionalFieldsCount} Optional Fields Configured`}
            />
          )}
        </StyledFlex>
      </FieldMapping>

      <InputFieldsModal
        open={!!fieldsModalOpened}
        initialFields={fieldParams}
        onClose={() => setFieldsModalOpened(false)}
        onSave={(val) => {
          onSave(val);
          setFieldsModalOpened(false);
        }}
        modalTitle={modalText.title}
        modalDescription={modalText.description}
        isAutocompleteDefault={isAutocompleteDefault}
      />
    </StyledFlex>
  );
};

export default InputFieldsControl;
