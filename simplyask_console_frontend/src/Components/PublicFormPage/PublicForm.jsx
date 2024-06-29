import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { useTheme } from '@mui/system';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { endOfDay, format } from 'date-fns';
import { useFormik } from 'formik';
import { cloneDeep, debounce } from 'lodash';
import React, { useMemo, useRef, useState } from 'react';
import usePlacesService from 'react-google-autocomplete/lib/usePlacesAutocompleteService';
import ReCAPTCHA from 'react-google-recaptcha';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { DATA_TYPES } from '../../Services/axios/filesAxios';
import classes from '../Auth/CreateNewAccount/DataCollectionSteps/StepThreeBillingDetails/StepThreeBillingDetails.module.css';
import { useDeleteFileById } from '../ProcessTrigger/hooks/useDeleteFileById';
import { useFileUploadForProcesses } from '../ProcessTrigger/hooks/useFileUploadForProcesses';
import { PROCESS_TRIGGER_DATA_VALUE_SEPARATOR } from '../ProcessTrigger/utils/constants';
import { processFileInputFormatter } from '../ProcessTrigger/utils/formatters';
import LoadingMessage from '../Sell/shared/LoadingMessage';
import NoOptionsMessage from '../Sell/shared/NoOptionsMessage';
import CustomCalendarIndicator from '../Settings/AccessManagement/components/dropdowns/customComponents/calendarIndicator/CustomCalendarIndicator';
import FormErrorMessage from '../Settings/AccessManagement/components/FormErrorMessage/FormErrorMessage';
import DragAndDrop from '../shared/REDISIGNED/controls/DragAndDrop/DragAndDrop';
import InputLabel from '../shared/REDISIGNED/controls/InputLabel/InputLabel';
import SingleCalendarMenuList from '../shared/REDISIGNED/selectMenus/customComponents/menuLists/SingleCalendarMenuList';
import { DateSingleValue } from '../shared/REDISIGNED/selectMenus/customComponents/singleControls/DateSingleValue';
import { SelectVisibilityValue } from '../shared/REDISIGNED/selectMenus/customComponents/singleControls/SelectVisibilityValue';
import CustomSelect from '../shared/REDISIGNED/selectMenus/CustomSelect';
import Spinner from '../shared/Spinner/Spinner';
import { StyledFlex, StyledText, StyledTextField } from '../shared/styles/styled';
import CustomDropdownIndicator from '../WorkflowEditor/components/sideMenu/base/inputs/DropdownSelector/CustomDropdownIndicator';

import SignatureForm from '../shared/REDISIGNED/controls/Signature/SignatureForm';
import { COMPONENT_TYPES, VALIDATION_TYPES } from './constants/validationTypes';
import { PoweredByLogo, StyledFormButton, StyledFormLogo, StyledPublicForm } from './StyledPublicFormPage';
import { convertToDateObject } from './utils/helpers';
import { getYupValidationByType } from './utils/schemas';

const PublicForm = ({
  workflowName,
  fields,
  psfSettings,
  logo,
  font,
  accentColourHex,
  buttonColourHex,
  buttonTextColourHex,
  isDarkTheme,
  onSubmit,
  isDisabled,
  isSubmitPublicExecutionLoading,
}) => {
  const isTelusEnvActivated = import.meta.env.VITE_IS_TELUS_ENV_ACTIVATED;

  const { placePredictions, getPlacePredictions } = usePlacesService({
    apiKey: `${import.meta.env.VITE_PLACES_API_KEY}`,
  });

  const { processId, organizationId } = useParams();
  const [searchParams] = useSearchParams();

  const { colors } = useTheme();

  const [passwordVisibility, setPasswordVisibility] = useState({});

  const [captchaPassed, setCaptchaPassed] = useState(false);

  const signatureRef = useRef(null);

  const { deleteFileById } = useDeleteFileById({
    onError: () => {
      toast.error('Something went wrong...');
    },
  });

  const multiSelectValueToArray = (val) =>
    val?.split(PROCESS_TRIGGER_DATA_VALUE_SEPARATOR)?.map((item) => ({ value: item })) || [];
  const arrayToMultiSelectValue = (val) =>
    val?.map((item) => item.value)?.join(PROCESS_TRIGGER_DATA_VALUE_SEPARATOR) || null;

  const setMultiSelectFieldValue = (field, val, submitCount) =>
    setFieldValue(field.fieldName, arrayToMultiSelectValue(val), submitCount > 0);

  const getAnythingInputParamValue = (field, defaultValue) => {
    switch (field.componentType) {
      case COMPONENT_TYPES.SINGLE_SELECT_DROPDOWN: {
        const findValueInOptions = field?.options?.find((opt) => opt.value === defaultValue);
        return findValueInOptions ? defaultValue : null;
      }
      case COMPONENT_TYPES.MULTI_SELECT_DROPDOWN: {
        const multiArray = multiSelectValueToArray(defaultValue);
        const allOptions = field?.options?.map((opt) => opt.value) || [];

        const filteredOptions = multiArray?.filter((val) => allOptions?.includes(val.value));

        return arrayToMultiSelectValue(filteredOptions);
      }
      default:
        return defaultValue;
    }
  };

  const getInitialParamValue = (field) => {
    const defaultValue = searchParams.get(field.fieldName) || '';

    switch (field.fieldValidationType) {
      case VALIDATION_TYPES.BOOLEAN: {
        return defaultValue?.toLowerCase() === 'true' ? 'true' : 'false';
      }
      case VALIDATION_TYPES.ANYTHING: {
        return getAnythingInputParamValue(field, defaultValue);
      }
      case VALIDATION_TYPES.JSON:
      case VALIDATION_TYPES.FILE: {
        return '';
      }
      default:
        return defaultValue;
    }
  };

  const initialValues = useMemo(
    () =>
      fields?.reduce((acc, field) => {
        acc[field.fieldName] = getInitialParamValue(field);
        return acc;
      }, {}) || [],
    [fields, searchParams]
  );

  const validationSchema = useMemo(
    () =>
      fields?.reduce((acc, field) => {
        const isFieldMandatory = field.fieldCriteria === 'M';

        acc[field.fieldName] = getYupValidationByType(field.fieldValidationType, field.fieldName, isFieldMandatory);
        return acc;
      }, {}) || [],
    [fields]
  );

  const addressItemsLoadFn = debounce((inputValue, setOptions) => {
    getPlacePredictions({ input: inputValue });
    setOptions(placePredictions);
  }, 300);

  const { values, errors, touched, setFieldValue, getFieldProps, submitCount, validateForm, submitForm } = useFormik({
    validateOnBlur: false,
    validateOnChange: false,
    enableReinitialize: true,
    initialValues,
    validationSchema: Yup.object().shape(validationSchema),
    onSubmit: (submitValues, { resetForm }) => {
      // Ignore captcha when we have a staging environment
      if (isTelusEnvActivated !== 'true' && !captchaPassed) {
        return;
      }

      const submitValuesCopy = cloneDeep(submitValues);

      Object.entries(submitValuesCopy)?.forEach(([key, value]) => {
        if (value.type === DATA_TYPES.FILE) {
          submitValuesCopy[key] = value.id;
        }
      });

      const payload = {
        processId,
        processName: workflowName,
        params: submitValuesCopy,
      };

      onSubmit?.({
        orgId: organizationId,
        payload,
      });
      resetForm();
      setCaptchaPassed(false);
      if (signatureRef) signatureRef?.current?.clearSignature();
    },
  });

  const { uploadFile, isUploadFileLoading } = useFileUploadForProcesses({
    onSuccess: (data, variables) => {
      setFieldValue(
        variables.field.fieldName,
        {
          type: DATA_TYPES.FILE,
          id: data[0].id,
          name: variables.fileName,
          fieldName: variables.field.fieldName,
        },
        submitCount > 0
      );
    },
    onError: () => {
      toast.error('Something went wrong...');
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    validateForm().then((validationErrors) => {
      if (Object.keys(validationErrors).length > 0)
        toast.error('Form could not be submitted due to missing and/or incorrect form fields.');

      submitForm();
    });
  };

  const handleFileChange = (field, files = []) => {
    const currentFile = files[0];
    const data = processFileInputFormatter(field, files);

    data && uploadFile({ payload: data, field, fileName: currentFile?.name });
  };

  const onBrowseFileClick = (e, field) => {
    const files = e.target?.files;
    if (!files || files?.length < 1) {
      return;
    }

    handleFileChange(field, files);
  };

  const handleClickShowPassword = (field) => {
    const fieldName = `${field}_showPassword`;
    const visibility = { ...passwordVisibility };
    visibility[fieldName] = !visibility[fieldName];
    setPasswordVisibility(visibility);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onRemoveFile = (field) => {
    deleteFileById(values[field.fieldName]?.id);
    setFieldValue(field.fieldName, null);
  };

  const renderInputField = (field, visibilityKey, placeholder) => (
    <StyledTextField
      variant="standard"
      id={field.fieldName}
      ff={font}
      type={field.isProtected && !passwordVisibility[visibilityKey] ? 'password' : 'text'}
      placeholder={placeholder}
      {...getFieldProps(field.fieldName)}
      onChange={(e) => setFieldValue(field.fieldName, e.target.value, submitCount > 0)}
      invalid={errors[field.fieldName] && touched[field.fieldName]}
      disabled={isDisabled}
      InputProps={
        field.isProtected
          ? {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => handleClickShowPassword(field.fieldName)}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {passwordVisibility[visibilityKey] ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }
          : {}
      }
      textColor={isDarkTheme ? colors.white : colors.primary}
      borderColor={isDarkTheme ? colors.inputBorder : colors.primary}
      bgColor={isDarkTheme ? colors.darkerGray : ''}
    />
  );

  const renderInputDefaultOptions = (field, visibilityKey, placeholder) => {
    switch (field.componentType) {
      case COMPONENT_TYPES.SINGLE_SELECT_DROPDOWN: {
        return (
          <CustomSelect
            options={field.options}
            placeholder={placeholder}
            value={values[field.fieldName] ? { value: values[field.fieldName] } : null}
            form
            closeMenuOnSelect
            closeMenuOnScroll
            getOptionLabel={(option) => option.value}
            getOptionValue={(option) => option.value}
            onChange={(val) => setFieldValue(field.fieldName, val.value, submitCount > 0)}
            components={{
              DropdownIndicator: CustomDropdownIndicator,
              NoOptionsMessage,
              LoadingMessage,
            }}
            isProtected={field.isProtected}
            isDisabled={isDisabled}
            textColor={isDarkTheme ? colors.white : colors.primary}
            bgColor={isDarkTheme ? colors.darkerGray : ''}
            borderColor={isDarkTheme ? colors.inputBorder : ''}
          />
        );
      }
      case COMPONENT_TYPES.MULTI_SELECT_DROPDOWN: {
        return (
          <CustomSelect
            options={field.options}
            placeholder={placeholder}
            value={multiSelectValueToArray(values[field.fieldName])}
            form
            closeMenuOnScroll
            isMulti
            getOptionLabel={(option) => option.value}
            getOptionValue={(option) => option.value}
            onChange={(val) => setMultiSelectFieldValue(field, val, submitCount)}
            components={{
              DropdownIndicator: CustomDropdownIndicator,
              NoOptionsMessage,
              LoadingMessage,
            }}
            isProtected={field.isProtected}
            isDisabled={isDisabled}
            textColor={isDarkTheme ? colors.white : colors.primary}
            bgColor={isDarkTheme ? colors.darkerGray : ''}
            borderColor={isDarkTheme ? colors.inputBorder : ''}
          />
        );
      }
      default:
        return renderInputField(field, visibilityKey, placeholder);
    }
  };

  const renderJsonStyles = {
    fontSize: 15,
    backgroundColor: 'white',
    fontFamily: 'Montserrat',
    border: '1px solid #2D3A47',
    borderRadius: '20px',
    color: '#000',
  };

  const renderJson = (field) => (
    <CodeEditor
      value={values[field.fieldName]}
      language="json"
      onChange={(e) => setFieldValue(field.fieldName, e.target.value, submitCount > 0)}
      padding={15}
      style={renderJsonStyles}
    />
  );

  const renderFile = (field) => (
    <StyledFlex direction="column" flex="auto" width="100%">
      <DragAndDrop
        handleDragAndDrop={(files) => handleFileChange(field, files)}
        onBrowseFileClick={(e) => onBrowseFileClick(e, field)}
        rootHeight="65px"
        attachFileText="to attach a file or"
        fileValue={values?.[field.fieldName]}
        onRemoveFile={() => onRemoveFile(field)}
        isError={errors[field.fieldName] && touched[field.fieldName]}
        darkTheme={isDarkTheme}
      />
    </StyledFlex>
  );

  const renderInput = (field) => {
    const visibilityKey = `${field.fieldName}_showPassword`;
    const placeholder = field.placeholder ? field.placeholder : `Please enter ${field.fieldName}`;

    switch (field.fieldValidationType) {
      case VALIDATION_TYPES.DATE_OF_BIRTH: {
        const value = values[field.fieldName] ? values[field.fieldName].split('/') : '';
        const dateOfBirth = value ? `${value[2]}-${value[1]}-${value[0]}` : '';

        return (
          <CustomSelect
            {...getFieldProps(field.fieldName)}
            placeholder={placeholder}
            onChange={(v) => setFieldValue(field.fieldName, format(v, 'dd/MM/yyyy'), submitCount > 0)}
            value={convertToDateObject(dateOfBirth)}
            getOption
            closeMenuOnSelect
            components={{
              DropdownIndicator: CustomCalendarIndicator,
              SingleValue: DateSingleValue,
              Menu: SingleCalendarMenuList,
            }}
            menuPortalTarget={document.body}
            form
            isSearchable={false}
            openMenuOnClick
            calendar
            isMenuOpen
            maxDate={endOfDay(new Date())}
            invalid={errors[field.fieldName] && touched[field.fieldName]}
            isProtected={field.isProtected}
            isDisabled={isDisabled}
            textColor={isDarkTheme ? colors.white : colors.primary}
            bgColor={isDarkTheme ? colors.darkerGray : ''}
            borderColor={isDarkTheme ? colors.inputBorder : ''}
          />
        );
      }
      case VALIDATION_TYPES.BOOLEAN: {
        return (
          <RadioGroup
            row
            name="controlled-radio-buttons-group"
            value={values[field.fieldName]}
            onChange={(e) => setFieldValue(field.fieldName, e.target.value, submitCount > 0)}
          >
            <FormControlLabel
              value="true"
              control={<Radio className={`${values[field.fieldName] === 'true' && classes.colorRadio}`} />}
              label="True"
            />
            <FormControlLabel
              value="false"
              control={<Radio className={`${values[field.fieldName] === 'false' && classes.colorRadio}`} />}
              label="False"
            />
          </RadioGroup>
        );
      }
      case VALIDATION_TYPES.ADDRESS: {
        return (
          <CustomSelect
            defaultOptions={placePredictions}
            isAsync
            loadOptions={addressItemsLoadFn}
            placeholder={placeholder}
            value={{ description: values[field.fieldName] }}
            form
            closeMenuOnSelect
            closeMenuOnScroll
            getOptionLabel={(option) => option.description}
            getOptionValue={(option) => option.description}
            onChange={(val) => setFieldValue(field.fieldName, val.description, submitCount > 0)}
            components={{
              DropdownIndicator: () => null,
              SingleValue: SelectVisibilityValue,
              NoOptionsMessage,
              LoadingMessage,
            }}
            isProtected={field.isProtected}
            isDisabled={isDisabled}
            textColor={isDarkTheme ? colors.white : colors.primary}
            bgColor={isDarkTheme ? colors.darkerGray : ''}
            borderColor={isDarkTheme ? colors.inputBorder : ''}
          />
        );
      }
      case VALIDATION_TYPES.ANYTHING: {
        return renderInputDefaultOptions(field, visibilityKey, placeholder);
      }
      case VALIDATION_TYPES.JSON: {
        return renderJson(field);
      }
      case VALIDATION_TYPES.FILE: {
        return renderFile(field);
      }
      case VALIDATION_TYPES.SIGNATURE: {
        return (
          <SignatureForm
            value={values[field.fieldName]}
            onChange={(a) => setFieldValue(field.fieldName, a, submitCount > 0)}
            error={errors[field.fieldName]}
            ref={signatureRef}
          />
        );
      }
      default:
        return renderInputField(field, visibilityKey, placeholder);
    }
  };

  const renderLogo = () => (logo ? <StyledFormLogo src={logo} alt="Logo" /> : null);

  const isRecaptchaError = submitCount > 0 && !captchaPassed && isTelusEnvActivated !== 'true';

  const isLoading = isUploadFileLoading || isSubmitPublicExecutionLoading;

  return (
    <StyledPublicForm accentColourHex={accentColourHex} isDarkTheme={isDarkTheme}>
      <StyledFlex gap="30px">
        {isLoading && <Spinner fadeBgParent />}

        {renderLogo()}
        <StyledFlex>
          <StyledText ff={font} as="h2" color="inherit" size={26} weight={600} mb={10} lh={39}>
            {psfSettings?.title}
          </StyledText>
          <StyledText ff={font} as="p" color="inherit">
            {psfSettings?.description}
          </StyledText>
        </StyledFlex>
        <StyledFlex>
          <StyledText ff={font} lh={24} color="inherit">
            All field are mandatory, unless otherwise specified as “optional.”
          </StyledText>
        </StyledFlex>
        {fields?.map((field, index) => (
          <StyledFlex key={index} direction="column" flex="auto" width="100%" height="auto">
            <InputLabel
              label={field.displayName || field.fieldName}
              isOptional={field.fieldCriteria === 'O'}
              color="inherit"
            />
            {field.description && (
              <StyledText size={12} color="inherit">
                {field.description}
              </StyledText>
            )}
            {renderInput(field)}
            {errors[field.fieldName] ? <FormErrorMessage>{errors[field.fieldName]}</FormErrorMessage> : null}
          </StyledFlex>
        ))}
        {!isSubmitPublicExecutionLoading && isTelusEnvActivated !== 'true' && (
          <StyledFlex>
            <ReCAPTCHA
              key="recaptcha"
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              stoken={import.meta.env.VITE_RECAPTCHA_STOKEN}
              onChange={(val) => setCaptchaPassed(val)}
            />
            {isRecaptchaError && <FormErrorMessage>Recaptcha is required</FormErrorMessage>}
          </StyledFlex>
        )}

        <StyledFormButton
          variant="contained"
          secondary
          buttonColourHex={buttonColourHex}
          buttonTextColourHex={buttonTextColourHex}
          onClick={handleSubmit}
          disabled={isDisabled}
        >
          Submit Form
        </StyledFormButton>
        <StyledFlex direction="row" alignItems="center" gap="10px" height="20px">
          <StyledText ff={font} size={14} weight={700} color={isDarkTheme ? colors.charcoal : 'inherit'}>
            POWERED BY
          </StyledText>
          <Link to="https://symphona.ai/">
            <PoweredByLogo />
          </Link>
        </StyledFlex>
      </StyledFlex>
    </StyledPublicForm>
  );
};

export default PublicForm;
