import PropTypes from 'prop-types';

import { ERROR_TYPES } from '../../../../utils/validation';
import { ExpectedTypeDropdown, InputField } from '../../base';
import StaticDynamicParamField from '../../base/inputs/StaticDynamicParamField/StaticDynamicParamField';
import { LabeledField } from '../../wrappers';
import ParametersForm from '../ParametersForm';
import React from 'react';

// unsure of API key for "Process Parameter Name"

const validation = (values) => {
  const errors = {};

  if (!values.value.paramName) errors.paramName = { type: ERROR_TYPES.ERROR, message: 'Field is Required' };
  if (!values.value.targetCell) errors.targetCell = { type: ERROR_TYPES.ERROR, message: 'Field is Required' };
  if (!values.value.dataType) errors.dataType = { type: ERROR_TYPES.ERROR, message: 'Field is Required' };

  return errors;
};

const ExcelExtractionForm = ({ onClose, onConfirm, param = {} }) => {
  const value = param.currentValue;
  const indexToEdit = param.indexToEdit;
  const title = param.stepSettingTemplate.displayName;
  const description = param.stepSettingTemplate.helpTooltip;

  const initialValues = value?.[indexToEdit] || {
    label: '',
    value: {
      paramName: '',
      targetCell: '',
      dataType: '',
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
          <LabeledField label="Output Parameter: Cell Value" marginBottom={10} noPad>
            <StaticDynamicParamField
              isOutputParam
              placeholder="New Process Parameter Name"
              value={values.value.paramName}
              onChange={(value) => {
                const label = value.label ?? value;

                handleChange('label', label);
                handleChange('value.paramName', value);
              }}
              error={errors.paramName}
              isList={false}
            />
          </LabeledField>
          <LabeledField label="Cell Number" marginBottom={10} noPad>
            <InputField
              placeholder="Excel Cell/Row Number (ex. “C12”/“1”)"
              value={values.value.targetCell}
              onChange={(value) => handleChange('value.targetCell', value)}
              error={errors.targetCell}
              paramAutocomplete
              width="100%"
            />
          </LabeledField>
          <LabeledField label="Expected Data Type" marginBottom={10} noPad>
            <ExpectedTypeDropdown
              value={values.value.dataType}
              onChange={(value) => handleChange('value.dataType', value)}
              error={errors.dataType}
            />
          </LabeledField>
        </>
      )}
    </ParametersForm>
  );
};

export default ExcelExtractionForm;

ExcelExtractionForm.propTypes = {
  param: PropTypes.object,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
};
