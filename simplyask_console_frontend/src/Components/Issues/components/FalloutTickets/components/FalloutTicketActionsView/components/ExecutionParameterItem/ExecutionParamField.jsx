import { useTheme } from '@emotion/react';
import { endOfDay } from 'date-fns';
import React, { useRef } from 'react';
import { ISO_UTC_DATE_FORMAT, formatLocalTime } from '../../../../../../../../utils/timeUtil';
import FileUploadInput from '../../../../../../../Managers/AgentManager/AgentEditor/components/shared/FileUploadInput';
import JsonCodeEditorInput from '../../../../../../../Managers/AgentManager/AgentEditor/components/shared/JsonCodeEditorInput';
import {
  COMPONENT_TYPES,
  VALIDATION_TYPES,
  VALIDATION_TYPES_ERROR_MESSAGES,
  VALIDATION_TYPES_REGEX,
} from '../../../../../../../PublicFormPage/constants/validationTypes';
import { arrayToMultiSelectValue, multiSelectValueToArray } from '../../../../../../../PublicFormPage/utils/helpers';
import { StyledPhoneNumberInput } from '../../../../../../../Sell/Orders/govOfAlberta/StyledGoAProductOffers';
import LoadingMessage from '../../../../../../../Sell/shared/LoadingMessage';
import NoOptionsMessage from '../../../../../../../Sell/shared/NoOptionsMessage';
import CustomCalendarIndicator from '../../../../../../../Settings/AccessManagement/components/dropdowns/customComponents/calendarIndicator/CustomCalendarIndicator';
import CustomDropdownIndicator from '../../../../../../../WorkflowEditor/components/sideMenu/base/inputs/DropdownSelector/CustomDropdownIndicator';
import AddressAutocomplete from '../../../../../../../shared/REDISIGNED/controls/AddressAutocomplete/AddressAutocomplete';
import BaseTextInput from '../../../../../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';
import RadioGroupSet from '../../../../../../../shared/REDISIGNED/controls/Radio/RadioGroupSet';
import EditableSignature from '../../../../../../../shared/REDISIGNED/controls/Signature/EditableSignature';
import CustomSelect from '../../../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import SingleCalendarMenuList from '../../../../../../../shared/REDISIGNED/selectMenus/customComponents/menuLists/SingleCalendarMenuList';
import { DateSingleValue } from '../../../../../../../shared/REDISIGNED/selectMenus/customComponents/singleControls/DateSingleValue';
import { StyledFlex, StyledRadio } from '../../../../../../../shared/styles/styled';

const ExecutionParamField = ({
  id,
  value,
  options,
  componentType,
  childRef,
  displayName,
  onKeyDown,
  dataType,
  onUpdate,
  onError,
  isError,
}) => {
  const { colors } = useTheme();
  const ref = useRef(null);

  const isInvalidTextDisallowedInInput = () =>
    dataType === VALIDATION_TYPES.ALPHABET ||
    dataType === VALIDATION_TYPES.ALPHA_NUMERIC ||
    dataType === VALIDATION_TYPES.NUMBER;

  const isValueValid = (v) =>
    dataType === VALIDATION_TYPES.ANYTHING || VALIDATION_TYPES_REGEX[dataType].test(v) || v === '';

  const getInputErrorText = () => VALIDATION_TYPES_ERROR_MESSAGES(displayName)[dataType];

  const handleTextInputChange = (e) => {
    const v = e.target.value;
    const isValid = isValueValid(v);

    if (!isValid && isInvalidTextDisallowedInInput()) return;

    !isValid ? onError?.(getInputErrorText()) : onError?.(null);
    onUpdate(id, v);
  };

  const handleDateChange = (e) => {
    const localUTCTime = formatLocalTime(e, ISO_UTC_DATE_FORMAT);
    onUpdate(id, localUTCTime);
  };

  const handleJSONChange = (e) => {
    const v = e.target.value;

    try {
      JSON.parse(v);
      onError?.(null);
    } catch (error) {
      onError?.(getInputErrorText());
    }

    onUpdate?.(id, v);
  };

  const getFileValue = () => {
    try {
      return JSON.parse(value);
    } catch (error) {
      return null;
    }
  };

  switch (dataType) {
    case VALIDATION_TYPES.BOOLEAN:
      return (
        <RadioGroupSet name={displayName} row value={String(value)} onChange={(e) => onUpdate(id, e.target.value)}>
          <StyledRadio value label="True" size={16} />
          <StyledRadio value={false} label="False" size={16} />
        </RadioGroupSet>
      );
    case VALIDATION_TYPES.ADDRESS:
      return (
        <StyledFlex width="100%">
          <AddressAutocomplete
            value={value}
            onChange={({ address }) => onUpdate(id, address)}
            country="CA"
            invalid={false}
            inputRef={childRef}
            minWidth="100%"
          />
        </StyledFlex>
      );
    case VALIDATION_TYPES.DATE_OF_BIRTH:
      return (
        <CustomSelect
          onChange={handleDateChange}
          value={value && typeof value === 'string' ? new Date(value) : value}
          closeMenuOnSelect
          components={{
            DropdownIndicator: CustomCalendarIndicator,
            SingleValue: DateSingleValue,
            Menu: SingleCalendarMenuList,
          }}
          menuPortalTarget={document.body}
          isSearchable={false}
          openMenuOnClick
          form
          calendar
          isMenuOpen
          maxDate={endOfDay(new Date())}
        />
      );
    case VALIDATION_TYPES.JSON:
      return <JsonCodeEditorInput value={value} onChange={handleJSONChange} error={isError} />;
    case VALIDATION_TYPES.FILE:
      return <FileUploadInput value={getFileValue()} onChange={(e) => onUpdate(id, JSON.stringify(e))} />;
    case VALIDATION_TYPES.PHONE_NUMBER:
      return (
        <StyledPhoneNumberInput
          international
          defaultCountry="CA"
          value={value}
          onChange={(v) => onUpdate(id, v)}
          placeholder="+1 123 456 7890"
          invalid={isError}
          borderColor={colors.tableEditableCellFocusBorder}
        />
      );
    case VALIDATION_TYPES.SIGNATURE:
      return (
        <StyledFlex height="123px" my="-23px" justifyContent="center">
          <EditableSignature value={value} onChange={(v) => onUpdate(id, v)} invalid={isError} ref={ref} />
        </StyledFlex>
      );
    case VALIDATION_TYPES.ANYTHING:
    case VALIDATION_TYPES.NUMBER:
    case VALIDATION_TYPES.POSTAL_CODE:
    case VALIDATION_TYPES.ALPHABET:
    case VALIDATION_TYPES.ALPHA_NUMERIC:
    case VALIDATION_TYPES.EMAIL:
    default: {
      if (
        componentType === COMPONENT_TYPES.SINGLE_SELECT_DROPDOWN ||
        componentType === COMPONENT_TYPES.MULTI_SELECT_DROPDOWN
      ) {
        const isMultiSelect = componentType === COMPONENT_TYPES.MULTI_SELECT_DROPDOWN;
        const valueToArray = isMultiSelect ? multiSelectValueToArray(value) : { value };

        return (
          <CustomSelect
            options={options}
            value={valueToArray}
            form
            closeMenuOnSelect
            closeMenuOnScroll
            getOptionLabel={(option) => option.value}
            getOptionValue={(option) => option.value}
            onChange={(v) => {
              const valStr = isMultiSelect ? arrayToMultiSelectValue(v) : v.value || null;
              onUpdate(id, valStr);
            }}
            components={{
              DropdownIndicator: CustomDropdownIndicator,
              NoOptionsMessage,
              LoadingMessage,
            }}
            isMulti={componentType === COMPONENT_TYPES.MULTI_SELECT_DROPDOWN}
            invalid={isError}
          />
        );
      }

      return (
        <BaseTextInput
          value={value}
          textAlign="right"
          borderColor={colors.tableEditableCellFocusBorder}
          onChange={handleTextInputChange}
          onKeyDown={onKeyDown}
          autoFocus
          inputRef={childRef}
        />
      );
    }
  }
};

export default ExecutionParamField;
