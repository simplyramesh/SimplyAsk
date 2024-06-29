import React from 'react';
import InputFieldsControl from '../../../../../../Managers/shared/components/InputFieldsControl/InputFieldsControl';
import { useProcessFields } from '../../../../../../../hooks/process/useProcessFields';

const WorkflowInputFields = ({ value: params, stepSettings, param, onChange }) => {
  const inputParams = params || [];

  const dependentSettingsTemplateId =
    param?.stepSettingOptions?.dependentSettingsTemplateId || 'aa17a25f-4656-4c77-b764-2b7084633efc';

  const processValue = stepSettings?.filter(
    ({ stepSettingTemplate }) => stepSettingTemplate?.stepSettingTemplateId === dependentSettingsTemplateId
  )?.[0]?.currentValue;

  const processId = processValue.value;

  useProcessFields({
    processId,
    onSuccess: (data) => {
      const mappedParams = data?.map((param) => ({
        ...param,
        value: '',
      }));

      onChange(mappedParams);
    },
    enabled: !!processId,
  });

  return <InputFieldsControl value={inputParams} onSave={onChange} />;
};

export default WorkflowInputFields;
