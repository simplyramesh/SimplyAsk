import FormErrorMessage from '../../../../../Settings/AccessManagement/components/FormErrorMessage/FormErrorMessage';
import { stepTypesForRender } from '../../../../constants/graph';
import { ERROR_TYPES } from '../../../../utils/validation';
import { InputField } from '../../base';
import { LabeledField } from '../../wrappers';
import ParametersForm from '../ParametersForm';

const DESCRIPTION = {
  header:
    'API Request Header Parameters are key-value pairs in the HTTP request header that provide information like authentication tokens, content type, and custom metadata. They can use static or dynamic values from process parameters.',
  body: 'API Request Body Parameters are used to pass data to the API. You can either use static values or dynamic values from the process parameters.',
};

const validation = (values) => {
  const errors = {};

  if (!values.label) errors.label = { type: ERROR_TYPES.ERROR, message: 'Label is Required' };

  if (!values.value) errors.value = { type: ERROR_TYPES.ERROR, message: 'Value is Required' };

  return errors;
};
const APIRequestParametersForm = ({ step, param, onClose, onConfirm }) => {
  const value = param.currentValue;
  const title = param.stepSettingTemplate.displayName;
  const description = param.stepSettingTemplate.helpTooltip || DESCRIPTION;
  const { indexToEdit } = param;

  const initialValues = value?.[indexToEdit] || {
    label: '',
    value: '',
  };

  const getNameLabelAndPlaceholder = () => {
    if (step?.stepDelegateType === stepTypesForRender.SSH_EXECUTION) {
      return { label: 'Argument Name', placeholder: 'Argument Name' };
    }
    return { label: 'Parameter Name', placeholder: 'API Parameter Name' };
  };

  const getValueLabelAndPlaceholder = () => {
    if (step?.stepDelegateType === stepTypesForRender.SSH_EXECUTION) {
      return { label: 'Argument Value', placeholder: 'Argument Value' };
    }
    return { label: 'Parameter Value', placeholder: 'API Parameter Value' };
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
          <LabeledField label={getNameLabelAndPlaceholder().label} marginBottom={10} noPad>
            <InputField
              placeholder={getNameLabelAndPlaceholder().placeholder}
              value={values.label}
              onChange={(e) => handleChange('label', e.target.value)}
              error={errors.label}
            />
            {errors.label && <FormErrorMessage>{errors.label.message}</FormErrorMessage>}
          </LabeledField>

          <LabeledField label={getValueLabelAndPlaceholder().label} marginBottom={10} noPad>
            <InputField
              placeholder={getValueLabelAndPlaceholder().placeholder}
              value={values.value}
              onChange={(e) => handleChange('value', e)}
              error={errors.value}
              paramAutocomplete
            />
            {errors.value && <FormErrorMessage>{errors.value.message}</FormErrorMessage>}
          </LabeledField>
        </>
      )}
    </ParametersForm>
  );
};

export default APIRequestParametersForm;
