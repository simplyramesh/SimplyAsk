import PropTypes from 'prop-types';

import { ERROR_TYPES } from '../../../../utils/validation';
import { ExpectedTypeDropdown, InputField, StaticDynamicParamField } from '../../base';
import { LabeledField } from '../../wrappers';
import ParametersForm from '../ParametersForm';

// unsure of API key for "Process Parameter Name"

const validation = (values) => {
  const errors = {};

  if (!values.label) errors.label = { type: ERROR_TYPES.ERROR, message: 'Field is Required' };

  if (!values.value.paramName) errors.paramName = { type: ERROR_TYPES.ERROR, message: 'Field is Required' };

  if (!values.value.validationType) errors.validationType = { type: ERROR_TYPES.ERROR, message: 'Field is Required' };

  return errors;
};

const OutputParameterAndMapperForm = ({
  param, onClose, onConfirm,
}) => {
  const value = param.currentValue;
  const title = param.stepSettingTemplate.displayName;
  const description = param.stepSettingTemplate.helpTooltip;
  const indexToEdit = param.indexToEdit;

  const initialValues = value?.[indexToEdit] || {
    label: '',
    value: {
      paramName: '',
      validationType: '',
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
          <LabeledField label="API Field Name" marginBottom={10} noPad>
            <InputField
              placeholder="API Parameter Name"
              value={values.label}
              onChange={(e) => handleChange('label', e.target.value)}
              error={errors.label}
            />
          </LabeledField>
          <LabeledField label="Output Parameter: Field Value" marginBottom={10} noPad>
            <StaticDynamicParamField
              placeholder="New Process Parameter Name"
              value={values.value.paramName}
              isOutputParam
              onChange={(value) => handleChange('value.paramName', value)}
              error={errors.paramName}
              isList={false}
            />
          </LabeledField>
          <LabeledField label="Expected Data Type" marginBottom={10} noPad>
            <ExpectedTypeDropdown
              value={values.value.validationType}
              onChange={(value) => handleChange('value.validationType', value)}
              error={errors.validationType}
            />
          </LabeledField>
        </>
      )}
    </ParametersForm>
  );
};

export default OutputParameterAndMapperForm;

OutputParameterAndMapperForm.propTypes = {
  param: PropTypes.object,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
};
