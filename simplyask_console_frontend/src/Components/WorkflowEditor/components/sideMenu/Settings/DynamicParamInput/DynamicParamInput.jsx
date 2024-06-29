import { endOfDay } from 'date-fns';
import React from 'react';
import { formatLocalTime, ISO_UTC_DATE_FORMAT } from '../../../../../../utils/timeUtil';
import JsonCodeEditorInput from '../../../../../Managers/AgentManager/AgentEditor/components/shared/JsonCodeEditorInput';
import {
  VALIDATION_TYPES,
  VALIDATION_TYPES_ERROR_MESSAGES,
  VALIDATION_TYPES_REGEX,
} from '../../../../../PublicFormPage/constants/validationTypes';
import CustomCalendarIndicator from '../../../../../Settings/AccessManagement/components/dropdowns/customComponents/calendarIndicator/CustomCalendarIndicator';
import BaseTextInput from '../../../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';
import RadioGroupSet from '../../../../../shared/REDISIGNED/controls/Radio/RadioGroupSet';
import SingleCalendarMenuList from '../../../../../shared/REDISIGNED/selectMenus/customComponents/menuLists/SingleCalendarMenuList';
import { DateSingleValue } from '../../../../../shared/REDISIGNED/selectMenus/customComponents/singleControls/DateSingleValue';
import CustomSelect from '../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { StyledRadio } from '../../../../../shared/styles/styled';
import FileUploadDropdown from '../../base/inputs/StaticDynamicFileUpload/FileUploadDropdown/FileUploadDropdown';

const DynamicParamInput = ({ placeholder, type, name, isError, value, onChange, onError }) => {
  const isInvalidTextDisallowedInInput = () =>
    type === VALIDATION_TYPES.ALPHABET || type === VALIDATION_TYPES.ALPHA_NUMERIC || type === VALIDATION_TYPES.NUMBER;

  const isValueVaid = (value) =>
    type === VALIDATION_TYPES.ANYTHING || VALIDATION_TYPES_REGEX[type].test(value) || value === '';

  const getInputErrorText = () => VALIDATION_TYPES_ERROR_MESSAGES(placeholder)[type];

  const onTextInputChange = (e) => {
    const value = e.target.value;

    if (!isValueVaid(value)) {
      if (isInvalidTextDisallowedInInput()) {
        return;
      } else {
        onError?.(getInputErrorText());
      }
    } else {
      onError?.(null);
    }

    onChange?.(value);
  };

  const onDateChange = (e) => {
    const localUTCTime = formatLocalTime(e, ISO_UTC_DATE_FORMAT);
    onChange(localUTCTime);
  };

  const onJSONChange = (e) => {
    const value = e.target.value;

    try {
      JSON.parse(value);
      onError?.(null);
    } catch (error) {
      onError?.(getInputErrorText());
    }

    onChange?.(value);
  };

  const getFileValue = () => {
    try {
      return JSON.parse(value);
    } catch (error) {
      return null;
    }
  };


  if (type === VALIDATION_TYPES.BOOLEAN) {
    return (
      <RadioGroupSet row value={String(value)} onChange={(e) => onChange(e.target.value === 'true')}>
        <StyledRadio value="true" label="True" size={16} />
        <StyledRadio value="false" label="False" size={16} />
      </RadioGroupSet>
    );
  }

  if (type === VALIDATION_TYPES.JSON) {
    return <JsonCodeEditorInput value={value} onChange={onJSONChange} error={isError} />;
  }

  if (type === VALIDATION_TYPES.DATE_OF_BIRTH) {
    return (
      <CustomSelect
        placeholder={placeholder}
        onChange={onDateChange}
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
  }

  if (type === VALIDATION_TYPES.FILE) {
    return <FileUploadDropdown value={getFileValue()} onChange={(e) => onChange(JSON.stringify(e))} />;
  }

  return (
    <BaseTextInput placeholder={placeholder} name={name} value={value} invalid={isError} onChange={onTextInputChange} />
  );
};

export default DynamicParamInput;
