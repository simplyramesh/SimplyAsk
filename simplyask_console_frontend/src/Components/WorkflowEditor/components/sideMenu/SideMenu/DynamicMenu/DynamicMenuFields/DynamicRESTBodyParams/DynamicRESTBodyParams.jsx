import { useEffect, useState } from 'react';
import CodeEditor from '../../../../../../../shared/CodeEditor/CodeEditor';
import { ApiParamList } from '../../../../base';
import ParamGroup from '../../../../sub/ParamGroup/ParamGroup';
import { REST_BODY_CODE_EDITOR_TYPES, REST_BODY_TYPES } from '../../../keyConstants';
import { StyledTextareaAutosize } from '../../../../../../../shared/styles/styled';
import { useTheme } from '@mui/material';

const DynamicRESTBodyParams = ({
  valueType,
  value,
  heading,
  onChange,
  onAddParam,
  error,
  onDeleteParam,
  onEditParam,
}) => {
  const { colors } = useTheme();
  const [type, setType] = useState(valueType);

  const changeValueOnTypeChange = () => {
    if (type !== valueType) {
      const oldType = type;
      const newType = valueType;
      let newValue = value;

      if (oldType === REST_BODY_TYPES.FORM_DATA && newType !== REST_BODY_TYPES.FORM_DATA) {
        newValue = '';
      }

      if (oldType !== REST_BODY_TYPES.FORM_DATA && newType === REST_BODY_TYPES.FORM_DATA) {
        newValue = [];
      }

      onChange(newValue);
    }
  };

  useEffect(() => {
    changeValueOnTypeChange();
    setType(valueType);
  }, [valueType]);

  if (type === REST_BODY_TYPES.FORM_DATA) {
    return (
      <ParamGroup heading={heading} params={value} onAddParamClick={onAddParam} error={error}>
        {({ param, paramIndex }) => (
          <ApiParamList
            key={paramIndex}
            param={param}
            onEditClick={() => onEditParam(paramIndex)}
            onDeleteClick={() => onDeleteParam(paramIndex)}
          />
        )}
      </ParamGroup>
    );
  }

  if (type === REST_BODY_TYPES.TEXT) {
    return (
      <StyledTextareaAutosize
        value={value}
        borderColor={colors.primary}
        invalid={error}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  return (
    <CodeEditor
      value={value}
      onChange={(e) => onChange(e.target.value)}
      isError={error}
      language={REST_BODY_CODE_EDITOR_TYPES[valueType]}
    />
  );
};

export default DynamicRESTBodyParams;
