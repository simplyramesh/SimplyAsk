import React, { useEffect, useState } from 'react';
import { STATIC_DYNAMIC_PARAM_TYPES } from '../../../../../constants/graph';
import { formattedWorkflowFileUpload } from '../../../../../utils/helperFunctions';
import RadioGroup from '../RadioInput/RadioGroup';
import RadioInput from '../RadioInput/RadioInput';
import WorkflowParamDropdown from '../WorkflowParamDropdown/WorkflowParamDropdown';
import FileUploadDropdown from './FileUploadDropdown/FileUploadDropdown';

const StaticDynamicFileUpload = (props) => {
  const { paramItem, value, isOutputParam = false, error, onChange } = props;

  const [persistedValue, setPersistedValue] = useState({
    [STATIC_DYNAMIC_PARAM_TYPES.STATIC]: '',
    [STATIC_DYNAMIC_PARAM_TYPES.DYNAMIC]: '',
  });

  const staticDynamicLocalParamType = paramItem?.isStatic
    ? STATIC_DYNAMIC_PARAM_TYPES.STATIC
    : STATIC_DYNAMIC_PARAM_TYPES.DYNAMIC;

  const isParamStatic = staticDynamicLocalParamType === STATIC_DYNAMIC_PARAM_TYPES.STATIC;
  const isParamDynamic = staticDynamicLocalParamType === STATIC_DYNAMIC_PARAM_TYPES.DYNAMIC;

  useEffect(() => {
    if (value) {
      const isValueStatic = paramItem?.isStatic;

      setPersistedValue((prev) => ({
        ...prev,
        ...(isValueStatic
          ? { [STATIC_DYNAMIC_PARAM_TYPES.STATIC]: value }
          : { [STATIC_DYNAMIC_PARAM_TYPES.DYNAMIC]: value }),
      }));
    }
  }, [value]);

  const getFormattedParsedFile = () => {
    if (!value) return;

    const formattedFile = formattedWorkflowFileUpload({
      id: value.value,
      name: value.label,
    });

    return JSON.stringify(formattedFile);
  };

  const handleStaticDynamicRadioChange = (isStatic) => {
    const staticDynamicOnChangeKey = isStatic ? STATIC_DYNAMIC_PARAM_TYPES.STATIC : STATIC_DYNAMIC_PARAM_TYPES.DYNAMIC;

    const staticDynamicPersistanceKey = isStatic
      ? STATIC_DYNAMIC_PARAM_TYPES.DYNAMIC
      : STATIC_DYNAMIC_PARAM_TYPES.STATIC;

    setPersistedValue((prev) => ({ ...prev, [staticDynamicPersistanceKey]: value }));

    onChange({
      value: persistedValue[staticDynamicOnChangeKey] || '',
      isStatic: isStatic,
    });
  };

  const handleStaticFileChange = (file) => {
    let parsedFile = JSON.parse(file || null);
    let payload = '';

    if (parsedFile) {
      payload = { label: parsedFile.name, value: parsedFile.id };
    }

    setPersistedValue((prev) => ({
      ...prev,
      [STATIC_DYNAMIC_PARAM_TYPES.STATIC]: payload,
    }));

    onChange({
      value: payload,
      isStatic: true,
    });
  };

  const handleDynamicWorkflowDropdownChange = (value) => {
    setPersistedValue((prev) => ({ ...prev, [STATIC_DYNAMIC_PARAM_TYPES.DYNAMIC]: value }));

    onChange({
      value: value || '',
      isStatic: isParamStatic,
    });
  };

  const WorkflowParamDropdownInput = () => (
    <WorkflowParamDropdown
      placeholder="Select existing process parameters..."
      value={value}
      error={error}
      isMulti={false}
      onChange={handleDynamicWorkflowDropdownChange}
    />
  );

  return (
    <>
      <RadioGroup orientation="row">
        <RadioInput
          label={isOutputParam ? 'New' : 'Static'}
          checked={isParamStatic}
          value={STATIC_DYNAMIC_PARAM_TYPES.STATIC}
          onChange={() => handleStaticDynamicRadioChange(true)}
        />

        <RadioInput
          label={isOutputParam ? 'Existing' : 'Dynamic'}
          checked={isParamDynamic}
          value={STATIC_DYNAMIC_PARAM_TYPES.DYNAMIC}
          onChange={() => handleStaticDynamicRadioChange(false)}
        />
      </RadioGroup>

      {isParamStatic ? (
        <FileUploadDropdown value={getFormattedParsedFile()} onChange={handleStaticFileChange} />
      ) : (
        <WorkflowParamDropdownInput onChange={onChange} />
      )}
    </>
  );
};

export default StaticDynamicFileUpload;
