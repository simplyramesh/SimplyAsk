import PropTypes from 'prop-types';

import { EXPRESSION_BUILDER_DEFAULT_VALUE } from '../../../../../shared/REDISIGNED/controls/lexical/ExpressionBuilder';
import { ERROR_TYPES } from '../../../../utils/validation';
import { ExpectedTypeDropdown, InputField, StaticDynamicParamField } from '../../base';
import { LabeledField } from '../../wrappers';
import ParametersForm from '../ParametersForm';

const validation = (values) => {
  const errors = {};

  if (!values.label) errors.label = { type: ERROR_TYPES.ERROR, message: 'Field is Required' };

  if (!values.value.paramValue || values.value.paramValue === EXPRESSION_BUILDER_DEFAULT_VALUE) errors.paramValue = { type: ERROR_TYPES.ERROR, message: 'Field is Required' };

  if (!values.value.paramType) errors.paramType = { type: ERROR_TYPES.ERROR, message: 'Field is Required' };

  return errors;
};

const OutputParameterNewValuesForm = ({
  param, onClose, onConfirm,
}) => {
  const value = param.currentValue;
  const indexToEdit = param.indexToEdit;
  const title = param.stepSettingTemplate.displayName;
  const description = param.stepSettingTemplate.helpTooltip;

  const initialValues = value?.[indexToEdit] || {
    label: '',
    value: {
      paramName: '',
      paramType: '',
      paramValue: '',
    },
  };

  return (
    <ParametersForm
      title={title}
      description={description}
      initialValues={initialValues}
      validation={validation}
      onClose={onClose}
      onConfirm={(value) => onConfirm(value, indexToEdit)}
    >
      {({ values, errors, handleChange }) => (
        <>
          <LabeledField label="Output Parameter: Target Parameter" marginBottom={10} noPad>
            <StaticDynamicParamField
              placeholder="New Process Parameter Name"
              value={values.value.paramName}
              isOutputParam
              onChange={(value) => {
                const label = value.label ?? value;

                handleChange('label', label);
                handleChange('value.paramName', value);
              }}
              error={errors.label}
              isList={false}
            />
          </LabeledField>
          <LabeledField label="New Parameter Value" marginBottom={10} noPad>
            <InputField
              placeholder="Enter New Value For Parameter"
              value={values.value.paramValue}
              onChange={(value) => handleChange('value.paramValue', value)}
              error={errors.paramValue}
              paramAutocomplete
              width="100%"
              minHeight="250px"
              expandable
            />
          </LabeledField>
          <LabeledField label="Expected Data Type" marginBottom={10} noPad>
            <ExpectedTypeDropdown
              value={values.value.paramType}
              onChange={(value) => handleChange('value.paramType', value)}
              error={errors.paramType}
            />
          </LabeledField>
        </>
      )}
    </ParametersForm>
  );
};

export default OutputParameterNewValuesForm;

OutputParameterNewValuesForm.propTypes = {
  param: PropTypes.object,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
};
