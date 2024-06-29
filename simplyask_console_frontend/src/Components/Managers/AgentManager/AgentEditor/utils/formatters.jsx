import React, { useState, useEffect } from 'react';
import { isValid, parseISO } from 'date-fns';

import ArrowRTL from '../../../../../Assets/icons/agent/sidebar/arrowBigLTR.svg?component';
import { StyledActionsIconWrapper } from '../../../../Settings/AccessManagement/components/table/StyledActions';
import { ERROR_TYPES } from '../../../../WorkflowEditor/utils/validation';
import { EXPRESSION_BUILDER_DEFAULT_VALUE } from '../../../../shared/REDISIGNED/controls/lexical/ExpressionBuilder';
import CustomTableIcons from '../../../../shared/REDISIGNED/icons/CustomTableIcons';
import HeaderCell from '../../../../shared/REDISIGNED/table-v2/TableCells/HeaderCell/HeaderCell';
import { StyledFlex, StyledText, StyledTextField } from '../../../../shared/styles/styled';
import { VALIDATION_TYPES, VALIDATION_TYPE_PLACEHOLDERS } from '../../../../PublicFormPage/constants/validationTypes';
import CustomSelect from '../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { endOfDay } from 'date-fns';
import SingleCalendarMenuList from '../../../../shared/REDISIGNED/selectMenus/customComponents/menuLists/SingleCalendarMenuList';
import { StyledPhoneNumberInput } from '../../../../Sell/Orders/govOfAlberta/StyledGoAProductOffers';
import FileUploadInput from '../components/shared/FileUploadInput';
import JsonCodeEditorInput from '../components/shared/JsonCodeEditorInput';
import RadioButtonBooleanInput from '../components/shared/RadioButtonBooleanInput';
import AddressAutocomplete from '../../../../shared/REDISIGNED/controls/AddressAutocomplete/AddressAutocomplete';
import InputVisibilityToggle from '../../../../shared/REDISIGNED/controls/InputVisibiltyToggle/InputVisibilityToggle';
import CustomVisibilityToggleCalendarIndicator from '../../../../Settings/AccessManagement/components/dropdowns/customComponents/calendarIndicator/CustomVisibilityToggleCalendarIndicator';
import DateVisibilityToggleSingleValue from '../../../../shared/REDISIGNED/selectMenus/customComponents/singleControls/DateVisibilityToggleSingleValue';
import FormErrorMessage from '../../../../Settings/AccessManagement/components/FormErrorMessage/FormErrorMessage';
import SignatureForm from '../../../../shared/REDISIGNED/controls/Signature/SignatureForm';
import { InputField } from '../../../../WorkflowEditor/components/sideMenu/base';

export const ValidationTypeInput = ({
  fieldValidationType,
  fieldCriteria,
  fieldName,
  id,
  value,
  onChange,
  error,
  dobProps = {},
  inputFieldProps = {},
  addressAutocompleteProps = {},
  jsonCodeEditorProps = {},
  phoneNumberInputProps = {},
  onBlur,
  isAutocompleteDefault = false,
  isProtected = false,
  autoFocus = false,
  inputRef,
  inputBorderColor,
}) => {
  const [isTextHidden, setIsTextHidden] = useState(isProtected);

  useEffect(() => {
    setIsTextHidden(isProtected);
  }, [isProtected]);

  const sharedDataTypeProps = {
    isTextHidden,
    onTextHidden: setIsTextHidden,
  };

  const renderDateInput = () => {
    let dateValue;

    try {
      if (value && isValid(parseISO(value))) {
        dateValue = parseISO(value);
      }
    } catch (error) {
      dateValue = '';
    }

    const handleDateValueChange = (newDateValue) => onChange(newDateValue.toISOString());

    return (
      <CustomSelect
        placeholder="DD / MM / YYYY"
        onChange={handleDateValueChange}
        value={dateValue}
        getOption
        closeMenuOnSelect
        openMenuOnClick
        components={{
          DropdownIndicator: CustomVisibilityToggleCalendarIndicator,
          SingleValue: DateVisibilityToggleSingleValue,
          Menu: SingleCalendarMenuList,
        }}
        valueFormat="dd/MM/yyyy"
        menuPortalTarget={document.body}
        isSearchable={false}
        form
        calendar
        invalid={error}
        maxDate={endOfDay(new Date())}
        onBlur={onBlur}
        isProtected={isProtected}
        selectRef={inputRef}
        menuPlacement="auto"
        borderColor={inputBorderColor}
        {...(autoFocus ? { autoFocus, menuIsOpen: true } : {})}
        {...sharedDataTypeProps}
        {...dobProps}
      />
    );
  };

  const renderBooleanInput = () => (
    <RadioButtonBooleanInput
      value={value}
      onChange={onChange}
      error={error}
      isRequired={fieldCriteria === 'M'}
      inputRef={inputRef}
      isProtected={isProtected}
      {...sharedDataTypeProps}
    />
  );

  const renderPhoneNumberInput = () => {
    return (
      <StyledFlex position="relative">
        <StyledPhoneNumberInput
          name={fieldName}
          defaultCountry="CA"
          value={value}
          onChange={onChange}
          placeholder="+1 123 456 7890"
          invalid={error}
          onBlur={onBlur}
          borderColor={inputBorderColor}
          ref={inputRef}
          autoFocus={autoFocus}
          type={isTextHidden ? 'password' : 'text'}
          {...phoneNumberInputProps}
        />
        {isProtected && (
          <StyledFlex position="absolute" bottom="21px" right="11px">
            <InputVisibilityToggle isTextHidden={isTextHidden} onTextHidden={setIsTextHidden} />
          </StyledFlex>
        )}
      </StyledFlex>
    );
  };

  const renderAddressAutocomplete = () => {
    const handleAddressValueChange = (val) => onChange(val);

    return (
      <AddressAutocomplete
        value={value}
        onChange={handleAddressValueChange}
        placeholder="Enter address"
        invalid={error}
        onBlur={onBlur}
        isProtected={isProtected}
        selectRef={inputRef}
        borderColor={inputBorderColor}
        {...(autoFocus ? { autoFocus, menuIsOpen: true } : {})}
        {...sharedDataTypeProps}
        {...addressAutocompleteProps}
      />
    );
  };

  const renderJsonCodeEditor = () => (
    <JsonCodeEditorInput
      name={fieldName}
      value={value}
      onChange={onChange}
      error={error}
      onBlur={onBlur}
      inputRef={inputRef}
      borderColor={inputBorderColor}
      autoFocus={autoFocus}
      isProtected={isProtected}
      {...sharedDataTypeProps}
      {...jsonCodeEditorProps}
    />
  );

  const renderSignature = () => {
    return <SignatureForm value={value} onChange={onChange} invalid={!!error} ref={inputRef} />;
  };

  const renderParamAutocompleteInput = () => (
    <InputField
      id={id}
      placeholder="Enter New Value For Parameter"
      value={value}
      onChange={onChange}
      error={error}
      paramAutocomplete
    />
  );

  const renderTextInput = () => {
    const { placeholder, ...rest } = inputFieldProps;
    return (
      <StyledTextField
        autoFocus={autoFocus}
        id={id}
        name={fieldName}
        placeholder="Enter New Value For Parameter"
        value={value}
        onChange={onChange}
        invalid={!!error}
        type={isTextHidden ? 'password' : 'text'}
        onBlur={onBlur}
        variant="standard"
        inputRef={inputRef}
        borderColor={inputBorderColor}
        InputProps={
          isProtected
            ? {
                endAdornment: <InputVisibilityToggle isTextHidden={isTextHidden} onTextHidden={setIsTextHidden} />,
              }
            : {}
        }
        {...rest}
      />
    );
  };

  const renderFileUploadInput = () => <FileUploadInput value={value} onChange={onChange} error={error} />;

  switch (fieldValidationType) {
    case VALIDATION_TYPES.DATE_OF_BIRTH:
      return renderDateInput();
    case VALIDATION_TYPES.BOOLEAN:
      return renderBooleanInput();
    case VALIDATION_TYPES.PHONE_NUMBER:
      return renderPhoneNumberInput();
    case VALIDATION_TYPES.FILE:
      return renderFileUploadInput();
    case VALIDATION_TYPES.JSON:
      return renderJsonCodeEditor();
    case VALIDATION_TYPES.ADDRESS:
      return renderAddressAutocomplete();
    case VALIDATION_TYPES.SIGNATURE:
      return renderSignature();
    default: {
      if (!isAutocompleteDefault) {
        return renderTextInput();
      }

      const isAutocompleteCompatibleType = [VALIDATION_TYPES.ANYTHING, VALIDATION_TYPES.GENERIC, VALIDATION_TYPES.TEXT];

      if (isAutocompleteCompatibleType.includes(fieldValidationType)) {
        return renderParamAutocompleteInput();
      } else {
        return renderTextInput();
      }
    }
  }
};

export const getDataTypeInputValue = (e, validationType) => {
  let newValue;
  if (validationType === VALIDATION_TYPES.ADDRESS) {
    newValue = e.address;
  } else {
    newValue = e?.target ? e.target.value : e;
  }
  return newValue;
};

const EditInputFieldValue = ({ cell, table, row }) => {
  const value = cell.getValue();
  const { fieldCriteria, fieldValidationType, fieldName } = row.original;
  const { isAutocompleteDefault } = table.options.meta;

  const error = fieldCriteria === 'M' &&
    (value === EXPRESSION_BUILDER_DEFAULT_VALUE || !value) && {
      type: ERROR_TYPES.ERROR,
      message: null,
    };

  const handleDataTypeValueChange = (e) => {
    const newValue = getDataTypeInputValue(e, fieldValidationType);
    table.options.meta.onChange(newValue, row.index);
  };

  return (
    <ValidationTypeInput
      id={row.id}
      value={cell.getValue()}
      onChange={handleDataTypeValueChange}
      error={error}
      fieldValidationType={fieldValidationType}
      fieldName={fieldName}
      fieldCriteria={fieldCriteria}
      addressAutocompleteProps={{
        menuPortalTarget: document.body,
        menuPlacement: 'top',
      }}
      inputFieldProps={{
        placeholder: cell.getValue() || VALIDATION_TYPE_PLACEHOLDERS?.[fieldValidationType] || 'Enter Value...',
      }}
      dobProps={{ menuPlacement: 'top' }}
      isAutocompleteDefault={isAutocompleteDefault}
    />
  );
};

export const INPUT_FIELDS_COLUMNS = [
  {
    id: 'fieldName',
    header: 'Field Name',
    enableColumnFilter: false,
    accessorKey: 'fieldName',
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell }) => cell.getValue(),
    size: 250,
  },
  {
    id: 'fieldCriteria',
    header: 'Required',
    enableColumnFilter: false,
    accessorKey: 'fieldCriteria',
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell }) => {
      const value = cell.getValue();
      const isMandatory = value === 'M';

      return <StyledText themeColor={isMandatory && 'validationError'}>{isMandatory ? 'Yes' : 'No'}</StyledText>;
    },
    size: 140,
  },
  {
    id: 'fieldValidationType',
    header: 'Data Type',
    enableColumnFilter: false,
    accessorKey: 'fieldValidationType',
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell }) => cell.getValue(),
    size: 180,
  },
  {
    id: 'value',
    header: 'Value',
    enableColumnFilter: false,
    accessorKey: 'value',
    overflowDisabled: true,
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell, table, row }) => {
      const { fieldsError } = table.options.meta;
      const { fieldName, fieldValidationType } = row.original;

      return (
        <>
          <EditInputFieldValue cell={cell} table={table} row={row} />
          {fieldsError[fieldName] && (
            <FormErrorMessage>{`A valid ${fieldValidationType.toLowerCase()} is required`}</FormErrorMessage>
          )}
        </>
      );
    },
    size: 300,
  },
];

export const OUTPUT_FIELDS_COLUMNS = [
  {
    id: 'processParamName',
    header: 'Process Parameter Name',
    enableColumnFilter: false,
    accessorKey: 'processParamName',
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell, table, row }) => (
      <StyledFlex direction="row" alignItems="center" gap="32px">
        <StyledTextField
          placeholder=""
          value={cell.getValue()}
          onChange={(e) => table.options.meta.onChange(e, row.index, 'processParamName')}
          variant="standard"
          height="41px"
          p="4px 10px"
        />
        <ArrowRTL />
      </StyledFlex>
    ),
    size: 50,
  },
  {
    id: 'agentParamName',
    header: 'Agent Parameter Name',
    enableColumnFilter: false,
    accessorKey: 'agentParamName',
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell, table, row }) => (
      <StyledFlex direction="row" alignItems="center" gap="32px">
        <StyledTextField
          placeholder=""
          value={cell.getValue()}
          onChange={(e) => table.options.meta.onChange(e, row.index, 'agentParamName')}
          variant="standard"
          height="41px"
          p="4px 10px"
        />
        <StyledActionsIconWrapper
          onClick={() => table.options.meta.onDelete(row.index)}
          disabled={table.options.data.length <= 1}
        >
          <CustomTableIcons icon="REMOVE" width={24} />
        </StyledActionsIconWrapper>
      </StyledFlex>
    ),
    size: 50,
  },
];
