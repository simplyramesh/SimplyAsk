import PropTypes from 'prop-types';

import { ERROR_TYPES } from '../../../../utils/validation';
import { RpaAttributeExpectedTypeDropdown } from '../../base';
import StaticDynamicParamField from '../../base/inputs/StaticDynamicParamField/StaticDynamicParamField';
import { LabeledField } from '../../wrappers';
import ParametersForm from '../ParametersForm';

// unsure of API key for "Process Parameter Name"

const validation = (values) => {
  const errors = {};

  if (!values.value.actionValue) errors.actionValue = { type: ERROR_TYPES.ERROR, message: 'Field is Required' };
  if (!values.value.attributeValue) errors.attributeValue = { type: ERROR_TYPES.ERROR, message: 'Field is Required' };
  if (!values.value.attributeType) errors.attributeType = { type: ERROR_TYPES.ERROR, message: 'Field is Required' };

  return errors;
};

const RpaExtractionForm = ({ onClose, onConfirm, param = {} }) => {
  const value = param.currentValue;
  const indexToEdit = param.indexToEdit;
  const title = param.stepSettingTemplate.displayName;
  const description = param.stepSettingTemplate.helpTooltip;

  const initialValues = value?.[indexToEdit] || {
    label: '',
    value: {
      actionValue: '',
      attributeValue: '',
      attributeType: '',
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
          <LabeledField label="Field Value" marginBottom={10} noPad>
            <StaticDynamicParamField
              placeholder="Field Value"
              value={values.value.actionValue}
              onChange={(value) => {
                const label = value.label ?? value;

                handleChange('label', label);
                handleChange('value.actionValue', value);
              }}
              error={errors.actionValue}
              isList={false}
            />
          </LabeledField>
          <LabeledField label="Locator Type" marginBottom={10} noPad>
            <RpaAttributeExpectedTypeDropdown
              value={values.value.attributeType}
              onChange={(value) => handleChange('value.attributeType', value)}
              error={errors.attributeType}
            />
          </LabeledField>
          <LabeledField label="Locator value" marginBottom={10} noPad>
            <StaticDynamicParamField
              placeholder="Locator Value"
              value={values.value.attributeValue}
              onChange={(value) => handleChange('value.attributeValue', value)}
              error={errors.attributeValue}
              isList={false}
            />
          </LabeledField>
        </>
      )}
    </ParametersForm>
  );
};

export default RpaExtractionForm;

RpaExtractionForm.propTypes = {
  param: PropTypes.object,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
};
