import React, { useState } from 'react';
import { StyledFlex } from '../../../../shared/styles/styled';
import InputLabel from '../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import { StyledTooltip } from '../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { InfoOutlined } from '@mui/icons-material';
import FieldMapping from '../../../AgentManager/AgentEditor/components/sideForms/ActionsSidebar/FieldMapping/FieldMapping';
import FieldMappingAccordion from '../../../AgentManager/AgentEditor/components/sideForms/ActionsSidebar/FieldMapping/FieldMappingAccordion';
import OutputFieldsModal from '../../../AgentManager/AgentEditor/components/sideForms/ActionsSidebar/OutputFieldsModal/OutputFieldsModal';

const OutputFieldsControl = ({ label = 'Process Output Fields', value, disabled, onChange }) => {
  const [fieldsModalOpened, setFieldsModalOpened] = useState(false);

  const fields =
    (value || []).map(({ processParamName, agentParamName }) => ({
      fieldName: processParamName,
      value: agentParamName,
    })) || [];

  const completedFieldsCount = fields?.filter(({ fieldName, value }) => fieldName && value).length;

  return (
    <StyledFlex>
      {label && (
        <StyledFlex direction="row" alignItems="center" gap="5px" marginBottom="10px">
          <InputLabel label={label} name="processOutput" isOptional={false} size={15} weight={600} mb={0} lh={24} />
          <StyledTooltip arrow placement="top" title="Process Output Fields" p="10px 15px">
            <InfoOutlined fontSize="inherit" />
          </StyledTooltip>
        </StyledFlex>
      )}
      <FieldMapping
        value={value}
        onEditFields={() => setFieldsModalOpened(true)}
        disabled={disabled}
        emptyValueDesc="Select a Process First in Order to Edit the Field Data"
        editButtonTitle="Edit Process Fields"
      >
        <FieldMappingAccordion fields={fields} label={`${completedFieldsCount} Fields Configured`} />
      </FieldMapping>

      <OutputFieldsModal
        open={fieldsModalOpened}
        initialFields={value}
        onClose={() => setFieldsModalOpened(false)}
        onSave={(val) => {
          onChange(val);
          setFieldsModalOpened(null);
        }}
      />
    </StyledFlex>
  );
};

export default OutputFieldsControl;
