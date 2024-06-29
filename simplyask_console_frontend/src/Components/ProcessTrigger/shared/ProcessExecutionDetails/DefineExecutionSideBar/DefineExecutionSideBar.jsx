import { useTheme } from '@emotion/react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { endOfDay, format } from 'date-fns';
import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';

import { DATA_TYPES } from '../../../../../Services/axios/filesAxios';
import { singleExecutionModalKeys } from '../../../../../config/ProcessDesignerKeys';
import classes from '../../../../Auth/CreateNewAccount/DataCollectionSteps/StepThreeBillingDetails/StepThreeBillingDetails.module.css';
import { COMPONENT_TYPES, VALIDATION_TYPES } from '../../../../PublicFormPage/constants/validationTypes';
import {
  arrayToMultiSelectValue,
  convertToDateObject,
  multiSelectValueToArray,
} from '../../../../PublicFormPage/utils/helpers';
import LoadingMessage from '../../../../Sell/shared/LoadingMessage';
import NoOptionsMessage from '../../../../Sell/shared/NoOptionsMessage';
import FormErrorMessage from '../../../../Settings/AccessManagement/components/FormErrorMessage/FormErrorMessage';
import CustomCalendarIndicator from '../../../../Settings/AccessManagement/components/dropdowns/customComponents/calendarIndicator/CustomCalendarIndicator';
import CustomDropdownIndicator from '../../../../WorkflowEditor/components/sideMenu/base/inputs/DropdownSelector/CustomDropdownIndicator';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import DragAndDrop from '../../../../shared/REDISIGNED/controls/DragAndDrop/DragAndDrop';
import SignatureForm from '../../../../shared/REDISIGNED/controls/Signature/SignatureForm';
import CustomSelect from '../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import SingleCalendarMenuList from '../../../../shared/REDISIGNED/selectMenus/customComponents/menuLists/SingleCalendarMenuList';
import { DateSingleValue } from '../../../../shared/REDISIGNED/selectMenus/customComponents/singleControls/DateSingleValue';
import CustomSidebar from '../../../../shared/REDISIGNED/sidebars/CustomSidebar/CustomSidebar';
import SearchBar from '../../../../shared/SearchBar/SearchBar';
import Spinner from '../../../../shared/Spinner/Spinner';
import { StyledDivider, StyledFlex, StyledText, StyledTextField } from '../../../../shared/styles/styled';
import { useDeleteFileById } from '../../../hooks/useDeleteFileById';
import { useFileUploadForProcesses } from '../../../hooks/useFileUploadForProcesses';
import { CRITERIA_FIELDS } from '../../../utils/constants';
import { processFileInputFormatter } from '../../../utils/formatters';
import InputVisibilityToggle from '../../../../shared/REDISIGNED/controls/InputVisibiltyToggle/InputVisibilityToggle';

const DefineExecutionSideBar = ({
  openDefineExecution,
  onCloseDefineExecution,
  values,
  errors,
  handleBlur,
  touched,
  clickedUpdateTableRowId,
  submitDefineExecutionUploadProcess,
  submitDefineExecutionSaveProgress,
  searchBarHandler,
  searchableColumns,
  dataHeaderColumns,
  defineExecutionSideBarValues,
  defineExecutionSideBarSetFieldValues,
  editModeData,
  isProcessDataVisualizerView = false,
  renderStaticFields,
  isLoading = false,
  isLoadingFields = false,
}) => {
  const { colors, boxShadows } = useTheme();

  const [passwordVisibility, setPasswordVisibility] = useState({});

  const signatureRef = useRef(null);

  const { uploadFile, isUploadFileLoading } = useFileUploadForProcesses({
    onSuccess: (data, variables) => {
      defineExecutionSideBarSetFieldValues(variables.field.fieldName, {
        type: DATA_TYPES.FILE,
        id: data[0].id,
        name: variables.fileName,
        fieldName: variables.field.fieldName,
      });
    },
    onError: () => {
      toast.error('Something went wrong...');
    },
  });

  const { deleteFileById } = useDeleteFileById({
    onError: () => {
      toast.error('Something went wrong...');
    },
  });

  const hasErrors = () => Object.keys(errors).length > 0;
  const hasNoTouchedFields = () => Object.keys(touched).length <= 0;
  const isEmptyFieldValues = () => Object.values(defineExecutionSideBarValues).length === 0;

  const disableSubmitButton = () => {
    if (isLoading || isLoadingFields) return true;
    if (isProcessDataVisualizerView) return false;

    const mandatoryFieldsCount = dataHeaderColumns?.filter(
      (item) => item.fieldCriteria === CRITERIA_FIELDS.MANDATORY
    ).length;

    if (!mandatoryFieldsCount) return hasErrors();

    if (mandatoryFieldsCount === 1) return isEmptyFieldValues() || hasErrors();

    return hasErrors() || hasNoTouchedFields();
  };

  const singleExecutionModalKeysMap = new Map(Object.entries(singleExecutionModalKeys));

  const renderPlaceHolderInputValues = (field) => {
    const fieldValidationTypeVar = field.fieldValidationType;
    if (singleExecutionModalKeysMap.has(fieldValidationTypeVar)) {
      const keyInfo = singleExecutionModalKeysMap.get(fieldValidationTypeVar);
      return keyInfo.placeholderText;
    }
    return '';
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

  const onRemoveFile = (field) => {
    if (isProcessDataVisualizerView || !clickedUpdateTableRowId) {
      deleteFileById(defineExecutionSideBarValues[field.fieldName]?.id);
    }

    if (!isProcessDataVisualizerView) {
      defineExecutionSideBarSetFieldValues(field.fieldName, null);
    }
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

  const renderInput = (field) => {
    const placeholderText = field.placeholder ? field.placeholder : renderPlaceHolderInputValues(field);
    const visibilityKey = `${field.fieldName}_showPassword`;

    switch (field.fieldValidationType) {
      case VALIDATION_TYPES.DATE_OF_BIRTH || VALIDATION_TYPES.DATE: {
        const dobValue = defineExecutionSideBarValues[field.fieldName]
          ? defineExecutionSideBarValues[field.fieldName].split('/')
          : '';
        const dateOfBirth = dobValue ? `${dobValue[2]}-${dobValue[1]}-${dobValue[0]}` : '';

        return (
          <CustomSelect
            placeholder={placeholderText}
            onChange={(v) => defineExecutionSideBarSetFieldValues(field.fieldName, format(v, 'dd/MM/yyyy'))}
            onBlur={handleBlur}
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
            isProtected={field.isProtected}
            openMenuOnClick
            calendar
            isMenuOpen
            invalid={errors[field.fieldName] && touched[field.fieldName]}
            {...(VALIDATION_TYPES.DATE_OF_BIRTH && { maxDate: endOfDay(new Date()) })}
          />
        );
      }
      case VALIDATION_TYPES.BOOLEAN: {
        return (
          <RadioGroup
            row
            name="controlled-radio-buttons-group"
            value={defineExecutionSideBarValues[field.fieldName]}
            onChange={(e) => defineExecutionSideBarSetFieldValues(field.fieldName, e.target.value)}
          >
            <FormControlLabel
              value="0"
              control={
                <Radio className={`${defineExecutionSideBarValues[field.fieldName] === '0' && classes.colorRadio}`} />
              }
              label="True"
            />
            <FormControlLabel
              value="1"
              control={
                <Radio className={`${defineExecutionSideBarValues[field.fieldName] === '1' && classes.colorRadio}`} />
              }
              label="False"
            />
          </RadioGroup>
        );
      }
      case VALIDATION_TYPES.ANYTHING: {
        return renderInputDefaultOptions(field, visibilityKey, placeholderText);
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
            value={defineExecutionSideBarValues[field.fieldName]}
            onChange={(base64Img) => defineExecutionSideBarSetFieldValues(field.fieldName, base64Img, true, true)}
            error={errors[field.fieldName] && touched[field.fieldName]}
            ref={signatureRef}
          />
        );
      }
      default:
        return renderInputField(field, visibilityKey, placeholderText);
    }
  };

  const renderInputDefaultOptions = (field, visibilityKey, placeholder) => {
    switch (field.componentType) {
      case COMPONENT_TYPES.SINGLE_SELECT_DROPDOWN: {
        return (
          <CustomSelect
            options={field.options}
            placeholder={placeholder}
            value={{ value: defineExecutionSideBarValues[field.fieldName] }}
            form
            closeMenuOnSelect
            closeMenuOnScroll
            getOptionLabel={(option) => option.value}
            getOptionValue={(option) => option.value}
            onChange={(val) => defineExecutionSideBarSetFieldValues(field.fieldName, val.value)}
            components={{
              DropdownIndicator: CustomDropdownIndicator,
              NoOptionsMessage,
              LoadingMessage,
            }}
            isProtected={field.isProtected}
          />
        );
      }
      case COMPONENT_TYPES.MULTI_SELECT_DROPDOWN: {
        return (
          <CustomSelect
            options={field.options}
            placeholder={placeholder}
            value={multiSelectValueToArray(defineExecutionSideBarValues[field.fieldName])}
            form
            closeMenuOnScroll
            isMulti
            getOptionLabel={(option) => option.value}
            getOptionValue={(option) => option.value}
            onChange={(val) => defineExecutionSideBarSetFieldValues(field.fieldName, arrayToMultiSelectValue(val))}
            components={{
              DropdownIndicator: CustomDropdownIndicator,
              NoOptionsMessage,
              LoadingMessage,
            }}
            isProtected={field.isProtected}
            isDisabled={false}
          />
        );
      }
      default:
        return renderInputField(field, visibilityKey, placeholder);
    }
  };

  const renderFile = (field) => (
    <StyledFlex direction="column" flex="auto" width="100%">
      <DragAndDrop
        handleDragAndDrop={(files) => handleFileChange(field, files)}
        onBrowseFileClick={(e) => onBrowseFileClick(e, field)}
        rootHeight="65px"
        attachFileText="to attach a file or"
        fileValue={defineExecutionSideBarValues?.[field.fieldName]}
        onRemoveFile={() => onRemoveFile(field)}
        isError={errors[field.fieldName] && touched[field.fieldName]}
      />
    </StyledFlex>
  );

  const renderJson = (field) => (
    <CodeEditor
      value={defineExecutionSideBarValues[field.fieldName]}
      language="json"
      onChange={(e) => defineExecutionSideBarSetFieldValues(field.fieldName, e.target.value)}
      padding={15}
      style={{
        fontSize: 15,
        backgroundColor: 'white',
        fontFamily: 'Montserrat',
        border: '1px solid #2D3A47',
        borderRadius: '20px',
        color: '#000',
      }}
    />
  );

  const renderInputField = (field, visibilityKey, placeholder) => (
    <StyledTextField
      variant="standard"
      id={field.fieldName}
      name={field.fieldName}
      type={field.isProtected && !passwordVisibility[visibilityKey] ? 'password' : 'text'}
      placeholder={placeholder}
      value={defineExecutionSideBarValues[field.fieldName]}
      onChange={(e) => defineExecutionSideBarSetFieldValues(field.fieldName, e.target.value)}
      invalid={errors[field.fieldName] && touched[field.fieldName]}
      onBlur={handleBlur}
      autocomplete="off"
      InputProps={
        field.isProtected
          ? {
              endAdornment: (
                <InputVisibilityToggle
                  isTextHidden={passwordVisibility[visibilityKey]}
                  onTextHidden={() => handleClickShowPassword(field.fieldName)}
                />
              ),
            }
          : {}
      }
    />
  );

  const renderFields = (criteria) =>
    searchableColumns
      ?.filter((field) => field.fieldCriteria === criteria)
      .map((field) => (
        <StyledFlex key={field.id} mt={2} mb={2}>
          <StyledText size={14} weight={600} mb={2}>
            {field.displayName || field.fieldName}
          </StyledText>
          {field.description && (
            <StyledText size={12} color="inherit">
              {field.description}
            </StyledText>
          )}
          <StyledFlex>
            {renderInput(field)}
            {errors[field.fieldName] && touched[field.fieldName] && (
              <FormErrorMessage>{errors[field.fieldName]}</FormErrorMessage>
            )}
          </StyledFlex>
        </StyledFlex>
      ));

  const getSubmitButtonTitle = () => {
    if (isProcessDataVisualizerView) return 'Generate Visualization';

    return clickedUpdateTableRowId?.length > 0 ? 'Save Process' : 'Upload Process';
  };

  const isLoadingModal = isLoading || isUploadFileLoading;

  return (
    <CustomSidebar
      open={openDefineExecution}
      onClose={onCloseDefineExecution}
      headerTemplate={
        <StyledFlex gap="10px">
          <StyledFlex direction="row" alignItems="center" gap="17px">
            <StyledText weight={600} size={24}>
              {isProcessDataVisualizerView ? 'Create New Visualization' : values?.process?.label}
            </StyledText>
          </StyledFlex>
        </StyledFlex>
      }
      footer={
        <StyledFlex
          mt={4}
          textAlign="center"
          justifyContent="center"
          alignItems="center"
          height="100px"
          boxShadow={boxShadows.box}
        >
          <StyledButton
            variant="contained"
            primary
            onClick={
              clickedUpdateTableRowId?.length > 0
                ? submitDefineExecutionSaveProgress
                : submitDefineExecutionUploadProcess
            }
            disabled={!isProcessDataVisualizerView && disableSubmitButton()}
          >
            {getSubmitButtonTitle()}
          </StyledButton>
        </StyledFlex>
      }
      sx={{ zIndex: editModeData ? 1301 : 1200 }}
    >
      {() => (
        <StyledFlex p="30px 30px">
          {isLoadingModal && <Spinner fadeBgParent />}

          {!isProcessDataVisualizerView && (
            <SearchBar placeholder="Search Field Names..." onChange={searchBarHandler} width="100%" />
          )}
          {renderStaticFields?.()}

          <StyledFlex position="relative" height="100%">
            {isLoadingFields && <Spinner fadeBgParent />}

            {!!searchableColumns?.length && (
              <>
                <StyledText size={16} weight={600} mt={28}>
                  Mandatory Fields
                </StyledText>
                {renderFields(CRITERIA_FIELDS.MANDATORY)}

                {renderFields(CRITERIA_FIELDS.OPTIONAL)?.length > 0 && (
                  <>
                    <StyledFlex mt={2} mb={2}>
                      <StyledDivider borderWidth={1.5} color={colors.inputBorder} />
                    </StyledFlex>

                    <StyledText size={16} weight={600} mt={8} mb={4}>
                      Optional Fields
                    </StyledText>
                    {renderFields(CRITERIA_FIELDS.OPTIONAL)}
                  </>
                )}
              </>
            )}
          </StyledFlex>
        </StyledFlex>
      )}
    </CustomSidebar>
  );
};

export default DefineExecutionSideBar;
