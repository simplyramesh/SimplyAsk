import { useTheme } from '@mui/material/styles';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import AsyncCreatable from 'react-select/async-creatable';
import CreatableSelect from 'react-select/creatable';

import { customStyles } from './customStyles';

export const filterStyles = {
  control: (styles, state) => ({
    ...customStyles.control(styles, state),
    minHeight: state.selectProps.maxHeight != null ? `${state.selectProps.maxHeight}px` : '41px',
    opacity: state.isDisabled ? 0.5 : 1
  }),
  dropdownIndicator: (styles, state) => ({
    ...styles,

    padding: state.selectProps.maxHeight != null ? 0 : styles.padding,
  }),
  groupHeading: () => ({ display: 'none' }),
  multiValueRemove: (styles, state) => ({
    ...styles,
    display: state.selectProps?.withCommas ? 'none' : styles.display,
  }),
  menu: (styles, state) => ({
    ...customStyles.menu(styles, state),
    ...(state.selectProps?.menuRightPosition && {
      right: `${state.selectProps?.menuRightPosition}px`,
    }),
    minWidth: state.selectProps?.minMenuWidth ? `${state.selectProps?.minMenuWidth}px` : '190px',
    zIndex: 9999,
  }),
};

const getBorderColor = (state) => {
  if (state.selectProps.invalid) return `1px solid ${state.selectProps.customTheme.colors.statusOverdue} !important`;

  return state.selectProps.borderColor
    ? `1px solid ${state.selectProps.borderColor}`
    : `1px solid ${state.selectProps.customTheme.colors.inputBorder}`;
};

const getBackgroundColor = (styles, state) => {
  return state.selectProps.bgColor ? state.selectProps.bgColor : '#FFFFFF';
};

const getTextColor = (styles, state) => {
  return state.selectProps.textColor ? state.selectProps.textColor : '#FFFFFF';
};

export const formStyles = {
  container: (styles, state) => ({
    ...styles,
    width: '100%',
    backgroundColor: getBackgroundColor(styles, state),
    ...(state.selectProps.isDisabled && {
      opacity: 0.5,
      pointerEvents: 'none',
    }),
  }),
  control: (styles, state) => {
    return {
      ...styles,
      boxShadow: 'none',
      minHeight: '41px',
      backgroundColor:
        state?.selectProps?.bgColorSelected && state.hasValue
          ? state.selectProps.bgColorSelected
          : getBackgroundColor(styles, state),
      color: getTextColor(styles, state),
      border:
        state.selectProps.bgColorSelected && state.hasValue
          ? `1px solid ${state.selectProps.bgColorSelected}`
          : getBorderColor(state),
      borderRadius: '10px',
      outline: 'none',
      padding: '4px 10px',
      cursor: 'pointer',
      '&:hover': {
        border: `1px solid ${state.selectProps.borderColor || state.selectProps.customTheme.colors.primary}`,
        outline: 'none',
      },
      '&:focus': {
        border: `1px solid ${state.selectProps.borderColor || state.selectProps.customTheme.colors.primary}`,
        outline: 'none',
      },
      '&:focus-within': {
        border: `1px solid ${state.selectProps.borderColor || state.selectProps.customTheme.colors.primary}`,
        outline: 'none',
      },
      opacity: state.isDisabled ? 0.5 : 1
    };
  },
  menu: (styles, state) => ({
    ...styles,
    minWidth: '190px',
    backgroundColor: getBackgroundColor(styles, state),
    zIndex: 9999,
    display: !state.selectProps.inputValue && state.options.length === 0 && !state.isLoading ? 'none' : 'block',
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  singleValue: (styles) => ({
    ...styles,
    width: '100%',
  }),
};

const calendarStyles = {
  menu: (styles, state) => ({
    ...customStyles.control(styles, state),
    padding: 0,
    boxShadow: 'none',
    width: 'auto',
    border: 'none !important',
    ...(state.selectProps.menuPosition === 'right' ? { left: '0px !important' } : { right: '0px !important' }),
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  indicatorsContainer: (styles) => ({
    ...styles,

    '& > div': {
      padding: 0,
    },
  }),
  valueContainer: (styles) => ({
    ...styles,
    paddingLeft: 0,
  }),
};
const cellStyles = {
  valueContainer: (styles) => ({
    ...styles,
    padding: 0,
    overflow: 'unset',
    justifyContent: 'flex-start',
  }),
  control: (styles, state) => ({
    ...styles,
    padding: '0 8px',
    minHeight: '41px',
    backgroundColor: 'transparent',
    outline: `2px solid ${state.selectProps.customTheme.colors.linkColor} !important`,
    outlineOffset: '-2px',
    boxShadow: 'none !important',
    border: 'none !important',
    borderRadius: '10px',
    cursor: 'pointer',
    opacity: state.isDisabled ? 0.5 : 1
  }),
  container: (styles) => ({
    ...styles,
    width: '100%',
    margin: 0,
  }),

  menu: (styles) => ({
    ...styles,
    width: '190px',
    minWidth: '190px',
    maxWidth: 'auto',
    border: 'none !important',
    borderRadius: '10px',
    boxShadow: '1px 1px 10px 2px rgba(0, 0, 0, 0.10);',
    outline: 'none',
    cursor: 'pointer',
  }),
};

const statusStyles = {
  menu: (styles, state) => ({
    ...customStyles.menu(styles, state),
    width: state.selectProps?.menuWidth ? `${state.selectProps?.menuWidth}px` : 'auto',
    padding: 0,
  }),
  valueContainer: (styles) => ({
    ...styles,
    padding: 0,
    margin: 0,
    overflow: 'unset',
  }),
  container: (styles) => ({
    ...styles,
    padding: 0,
    margin: 0,
  }),
  control: (styles) => ({
    ...styles,
    padding: '0',
    minHeight: '45px',
    backgroundColor: 'transparent',
    boxShadow: 'none !important',
    border: 'none !important',
    cursor: 'pointer',
  }),
  singleValue: (styles) => ({
    ...styles,
    margin: 0,
  }),
};

const CustomSelect = ({ selectRef, form, calendar, cell, isAsync, isCreatable, status, ...props }) => {
  const theme = useTheme();
  const SelectComponent = isAsync
    ? isCreatable
      ? AsyncCreatable
      : AsyncSelect
    : isCreatable
      ? CreatableSelect
      : Select;

  return (
    <SelectComponent
      ref={selectRef}
      styles={{
        ...customStyles,
        ...(form ? formStyles : filterStyles),
        ...(cell ? cellStyles : {}),
        ...(status ? statusStyles : {}),
        ...(calendar ? calendarStyles : {}),
      }}
      closeMenuOnSelect={false}
      default
      customTheme={theme}
      {...props}
    />
  );
};

export default CustomSelect;

CustomSelect.propTypes = Select.propTypes;
