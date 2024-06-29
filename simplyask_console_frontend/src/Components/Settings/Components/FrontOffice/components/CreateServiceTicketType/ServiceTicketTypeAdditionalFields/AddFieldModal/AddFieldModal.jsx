import { useFormik } from 'formik';
import { useState } from 'react';

import { useGetCurrentUser } from '../../../../../../../../hooks/useGetCurrentUser';
import { getInFormattedUserTimezone } from '../../../../../../../../utils/timeUtil';
import {
  getDataTypeInputValue,
  ValidationTypeInput,
} from '../../../../../../../Managers/AgentManager/AgentEditor/utils/formatters';
import {
  VALIDATION_TYPES,
  VALIDATION_TYPE_INITIAL_VALUES,
  VALIDATION_TYPE_PLACEHOLDERS,
} from '../../../../../../../PublicFormPage/constants/validationTypes';
import BaseTextInput from '../../../../../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';
import { StyledButton } from '../../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import InputLabel from '../../../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import RadioGroupSet from '../../../../../../../shared/REDISIGNED/controls/Radio/RadioGroupSet';
import CenterModalFixed from '../../../../../../../shared/REDISIGNED/modals/CenterModalFixed/CenterModalFixed';
import CustomIndicatorArrow from '../../../../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import TreeOptions from '../../../../../../../shared/REDISIGNED/selectMenus/customComponents/options/TreeOptions';
import CustomSelect from '../../../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { StyledFlex, StyledRadio, StyledText, StyledTextField } from '../../../../../../../shared/styles/styled';
import Switch from '../../../../../../../SwitchWithText/Switch';
import { dropdownStyles } from '../../../../../../../WorkflowEditor/components/sideMenu/Settings/dropdownStyles';
import { INPUT_API_KEYS as EXPECTED_INPUT_API_KEYS } from '../../../../../../../WorkflowEditor/components/sideMenu/Settings/ExpectedInputParams/EditInputParam/EditInputParam';
import { FILE_TYPES } from '../../../../../../../WorkflowEditor/components/sideMenu/SideMenu/fileTypes';
import {
  getFilteredGroupValidationTypesOptions,
  VALIDATION_TYPES_OPTIONS,
} from '../../../../../../../WorkflowEditor/components/sideMenu/SideMenu/validationTypes';
import { ERROR_TYPES } from '../../../../../../../WorkflowEditor/utils/validation';
import FormErrorMessage from '../../../../../../AccessManagement/components/FormErrorMessage/FormErrorMessage';
import { StyledKnowledgeBaseSlider } from '../../../../../General/components/SimplyAssistantKnowledgeBases/StyledSimplyAssistantKnowledgeBases';
import { ADD_FIELDS_FILE_TYPES, ADD_FIELDS_INIT_VALUES } from '../../../../constants/initialValues';
import { additionalFieldsSchema } from '../../../../utils/validationSchemas';

const INPUT_API_KEYS = {
  ...EXPECTED_INPUT_API_KEYS,
  TYPE: 'type',
  DEFAULT_VALUE: 'defaultValue',
};

const AddFieldModal = ({ onCreate, isOpen, onClose }) => {
  const { currentUser: user } = useGetCurrentUser();

  const { values, errors, touched, handleBlur, setFieldValue, resetForm, submitForm } = useFormik({
    initialValues: ADD_FIELDS_INIT_VALUES,
    validationSchema: additionalFieldsSchema,
    onSubmit: (newAdditionalField) => {
      const updatedDate = {
        ...newAdditionalField,
        ...(values.type === 'DATE' && {
          defaultValue: getInFormattedUserTimezone(newAdditionalField.defaultValue, user?.timezone, 'LLL d, yyyy'),
        }),
      };
      setDataTypeInputs(VALIDATION_TYPE_INITIAL_VALUES);
      return onCreate(updatedDate, resetForm);
    },
    validateOnMount: true,
  });

  const isValidationTypeFile = values[INPUT_API_KEYS.TYPE] === VALIDATION_TYPES.FILE;

  const [dataTypeInputs, setDataTypeInputs] = useState(VALIDATION_TYPE_INITIAL_VALUES);

  const validateFileSizeSliderChange = (value) => {
    const max = 1000;
    const min = 1;

    if (Number.isNaN(value)) return min;

    if (value < min) return min;
    if (value > max) return max;
    return value;
  };

  const renderFileConfig = () => {
    return (
      <>
        <StyledFlex gap="12px">
          <StyledFlex>
            <InputLabel label="File Types Allowed" mb={0} />
            <RadioGroupSet
              value={values.fileType}
              onChange={(e) => setFieldValue('fileType', e.target.value)}
              sx={{ marginBottom: '-12px' }}
            >
              <StyledRadio value={ADD_FIELDS_FILE_TYPES.ALL} label="All File Types" />
              <StyledRadio value={ADD_FIELDS_FILE_TYPES.CUSTOM} label="Custom" />
            </RadioGroupSet>
          </StyledFlex>

          <StyledFlex width="362px" marginLeft={3}>
            {values.fileType === ADD_FIELDS_FILE_TYPES.CUSTOM && (
              <CustomSelect
                options={FILE_TYPES}
                placeholder="Select File Types"
                name={INPUT_API_KEYS.VALIDATION_TYPE}
                value={values.customFileType}
                onChange={(v) => setFieldValue('customFileType', v)}
                components={{
                  DropdownIndicator: CustomIndicatorArrow,
                  Option: TreeOptions,
                }}
                styles={dropdownStyles}
                isOptionDisabled={(option) => option.disabled}
                isMulti
                closeMenuOnScroll
              />
            )}
          </StyledFlex>
        </StyledFlex>

        <StyledFlex gap="12px">
          <InputLabel label="File Size Limit (MB)" hint="The maximum file size must be from 1 to 1000 (MB)" mb={0} />
          <StyledFlex flexDirection="row" gap="25px">
            <StyledKnowledgeBaseSlider
              min={1}
              max={1000}
              style={{ margin: 'auto' }}
              step={0.5}
              value={Number(values.fileSize)}
              onChange={(e, v) => setFieldValue('fileSize', v)}
            />
            <StyledTextField
              name={INPUT_API_KEYS.FILE_SIZE}
              width="70px"
              fontSize="15px"
              variant="standard"
              value={values.fileSize}
              onChange={(e) => setFieldValue('fileSize', validateFileSizeSliderChange(e.target.value))}
            />
          </StyledFlex>
          {errors.fileSize && touched.fileSize && <FormErrorMessage>{errors.fileSize}</FormErrorMessage>}
        </StyledFlex>
      </>
    );
  };

  const handleDataTypeValueChange = (e) => {
    const value = getDataTypeInputValue(e, values.type);

    setDataTypeInputs((prev) => ({ ...prev, [values.type]: value }));
    setFieldValue(INPUT_API_KEYS.DEFAULT_VALUE, value);
  };

  const handleDataTypeChange = (e) => {
    const value = e.value;

    setFieldValue(INPUT_API_KEYS.TYPE, value);

    value === VALIDATION_TYPES.FILE && setFieldValue(INPUT_API_KEYS.IS_MASKED, false);
  };

  const dataTypesToFilter = [VALIDATION_TYPES.SIGNATURE, VALIDATION_TYPES.FILE];

  const DATA_TYPES_OPTIONS = getFilteredGroupValidationTypesOptions(dataTypesToFilter);

  return (
    <CenterModalFixed
      open={isOpen}
      onClose={() => {
        resetForm();
        onClose();
      }}
      title="Set Additional Field"
      actions={
        <StyledFlex mr="12px">
          <StyledButton primary variant="contained" onClick={() => submitForm()}>
            Set Field
          </StyledButton>
        </StyledFlex>
      }
      footerShadow={false}
      maxWidth="622px"
    >
      <StyledFlex flex="auto" p="30px" gap="30px 0" mt="7px">
        <StyledFlex direction="column" flex="auto">
          <InputLabel label="Name" isOptional={false} />
          <BaseTextInput
            name="name"
            placeholder="Enter the name of your field..."
            value={values.name}
            onChange={(e) => setFieldValue('name', e.target.value)}
            invalid={errors.name && touched.name}
            onBlur={handleBlur}
          />
          {errors.name && touched.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
        </StyledFlex>
        <StyledFlex direction="column" flex="auto">
          <InputLabel label="Data Type" isOptional={false} />
          <CustomSelect
            name={INPUT_API_KEYS.TYPE}
            options={DATA_TYPES_OPTIONS}
            placeholder="Select Field Type"
            value={VALIDATION_TYPES_OPTIONS.filter((v) => v.value === values.type)}
            getOptionValue={(option) => option.value}
            closeMenuOnSelect
            isClearable={false}
            isSearchable={false}
            onChange={handleDataTypeChange}
            components={{ DropdownIndicator: CustomIndicatorArrow }}
            maxHeight={30}
            menuPadding={0}
            form
            menuPortalTarget={document.body}
          />
          {errors.type && touched.type && <FormErrorMessage>{errors.type}</FormErrorMessage>}
        </StyledFlex>

        {values.type === VALIDATION_TYPES.FILE ? renderFileConfig() : null}

        <StyledFlex gap="15px">
          <InputLabel label="Required?" hint="The field is Required" mb={0} />

          <StyledFlex display="flex" alignItems="center" gap="12px" alignSelf="stretch" flexDirection="row">
            <Switch
              name={INPUT_API_KEYS.IS_REQUIRED}
              id={INPUT_API_KEYS.IS_REQUIRED}
              activeLabel=""
              inactiveLabel=""
              checked={values.isMandatory}
              onChange={(value) => setFieldValue('isMandatory', value)}
            />
            <StyledText textAlign="right" weight="500" lh="24px">
              Field is Required
            </StyledText>
          </StyledFlex>
        </StyledFlex>

        {!isValidationTypeFile && (
          <StyledFlex gap="15px">
            <InputLabel
              label="Hidden?"
              hint="Hidden fields will hide the value from the user by default, however, there will be an option to make the value visible"
              mb={0}
            />

            <StyledFlex display="flex" alignItems="center" gap="12px" alignSelf="stretch" flexDirection="row">
              <Switch
                name={INPUT_API_KEYS.IS_MASKED}
                id={INPUT_API_KEYS.IS_MASKED}
                activeLabel=""
                inactiveLabel=""
                checked={values.isMasked}
                onChange={(value) => {
                  setFieldValue(INPUT_API_KEYS.IS_MASKED, value);
                }}
              />
              <StyledText textAlign="right" weight="500" lh="24px">
                Field is Hidden
              </StyledText>
            </StyledFlex>
          </StyledFlex>
        )}

        <StyledFlex>
          <InputLabel label="Default Value" isOptional />
          <StyledFlex>
            <ValidationTypeInput
              fieldValidationType={values.type}
              fieldCriteria={values.isMandatory ? 'M' : 'O'}
              fieldName={INPUT_API_KEYS.DEFAULT_VALUE}
              value={dataTypeInputs[values.type]}
              onChange={handleDataTypeValueChange}
              dobProps={{ menuPlacement: 'top' }}
              inputFieldProps={{
                placeholder: VALIDATION_TYPE_PLACEHOLDERS?.[values.type] || 'Enter Value...',
                error: { type: errors?.defaultValue ? ERROR_TYPES.ERROR : null },
              }}
              isProtected={values.isMasked}
              addressAutocompleteProps={{
                menuPlacement: 'top',
                menuPortalTarget: document.body,
              }}
              error={!!errors?.defaultValue}
            />
            {errors?.defaultValue ? <FormErrorMessage>{errors?.defaultValue}</FormErrorMessage> : null}
          </StyledFlex>
        </StyledFlex>
      </StyledFlex>
    </CenterModalFixed>
  );
};

export default AddFieldModal;
