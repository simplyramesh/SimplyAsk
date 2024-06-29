/* eslint-disable no-unused-vars */

// included are all the customisable styles for the react-select component
// save time by not having to find and copy the documentation each time
export const customStyles = {
  clearIndicator: (styles) => ({
    ...styles,
  }),
  container: (styles, state) => ({
    ...styles,
    width: '100%',
    marginBottom: state.selectProps.mb != null ? `${state.selectProps.mb}px` : '22px',
  }),
  // control styles are for the filter select
  control: (styles, state) => ({
    ...styles,
    boxShadow: 'none',
    minHeight: '41px',

    // extraPaddingY is used because calendar icon is bigger than dropdown icon
    padding: state.selectProps.padding
      ? state.selectProps.padding
      : (state.selectProps.extraPaddingY && '5px 10px') || '0px 10px',
    pointerEvents: state.isDisabled ? 'none' : 'all',

    border: state.selectProps.borderColor
      ? `1px solid ${state.selectProps.borderColor}`
      : (state.selectProps.invalid && '1px solid #E03B24') || '1px solid #2D3A47',
    borderRadius: state.selectProps?.borderRadius ? state.selectProps.borderRadius : '20px',
    outline: 'none',

    cursor: 'pointer',

    '&:hover': {
      border: state.selectProps.borderColor
        ? `1px solid ${state.selectProps.borderColor}`
        : (state.selectProps.invalid && '1px solid #E03B24') || '1px solid #2D3A47',
      outline: 'none',
    },
    '&:focus': {
      border: state.selectProps.borderColor
        ? `1px solid ${state.selectProps.borderColor}`
        : (state.selectProps.invalid && '1px solid #E03B24') || '1px solid #2D3A47',
      outline: 'none',
    },
    '&:focus-within': {
      border: state.selectProps.borderColor
        ? `1px solid ${state.selectProps.borderColor}`
        : (state.selectProps.invalid && '1px solid #E03B24') || '1px solid #2D3A47',
      outline: 'none',
    },

    ...(state.selectProps.menuRootZIndex && { zIndex: state.selectProps.menuRootZIndex }),
    ...(state.selectProps.menuInputWidth && { width: state.selectProps.menuInputWidth }),
    opacity: state.isDisabled ? 0.5 : 1
  }),
  dropdownIndicator: (styles) => ({
    ...styles,
  }),
  group: (styles) => ({
    ...styles,
    padding: '12px 12px 4px 24px',
  }),
  groupHeading: (styles) => ({
    ...styles,
    marginLeft: '-12px',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#2D3A47',
  }),
  indicatorsContainer: (styles) => ({
    ...styles,
  }),
  indicatorSeparator: (styles, state) => ({
    ...styles,
    display: state.selectProps.withSeparator ? 'inherit' : 'none',
    backgroundColor: state.selectProps.customTheme.colors.primary,
    margin: state.selectProps.withSeparator ? '8px 6px 8px 0' : '0',
  }),
  input: (styles) => ({
    ...styles,
  }),
  loadingIndicator: (styles) => ({
    ...styles,
  }),
  loadingMessage: (styles) => ({
    ...styles,
  }),
  menu: (styles, state) => ({
    ...styles,
    padding: state.selectProps?.menuPadding ?? '16px 24px 20px 16px',
    border: 'none !important',
    borderRadius: '10px',
    boxShadow: '1px 1px 10px 2px rgba(0, 0, 0, 0.10);',
    outline: 'none',
    cursor: 'pointer',

    background: '#ffffff',
    width: state.selectProps?.menuWidth ? state.selectProps?.menuWidth : styles.width,
    ...(state.selectProps?.alignMenu === 'right' && {
      right: 0,
    }),
  }),
  menuList: (styles, state) => ({
    ...styles,

    padding: state.selectProps?.menuPadding ?? '4px 0',

    '::-webkit-scrollbar': {
      width: '16px',
    },
    '::-webkit-scrollbar-thumb': {
      border: '4px solid #F4F4F4',
      borderRadius: '10px',
      background: 'rgba(198, 198, 198, 0.5)',
    },
    '::-webkit-scrollbar-track': {
      background: '#F4F4F4',
      borderRadius: '2px',
    },
    '::-webkit-scrollbar-track-piece:': {
      margin: '4px 0',
      background: '#F4F4F4',
    },
  }),
  menuPortal: (styles) => ({
    ...styles,
    zIndex: 9999,
  }),
  multiValue: (styles) => ({
    ...styles,
    backgroundColor: '#EAECF1',

    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '18px',
    borderRadius: '10px',
    color: '#2D3A47',

    margin: '0',
  }),
  multiValueLabel: (styles) => ({
    ...styles,
    fontSize: '15px',
    lineHeight: '24px',
    fontWeight: '500',
  }),
  multiValueRemove: (styles, state) => ({
    ...styles,
    display: state.selectProps?.hideMultiValueRemove ? 'none' : 'flex',
    fontSize: '16px',
    color: '#2D3A47',

    '& svg': {
      width: '16px',
    },

    '&:hover': {
      backgroundColor: '#DEEAFF',
      borderRadius: '5px',
      color: '#2D3A47',
    },
  }),
  noOptionsMessage: (styles) => ({
    ...styles,
  }),
  option: (styles, state) => ({
    ...styles,
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
    backgroundColor: 'transparent',
    color: state.selectProps.textColor ? state.selectProps.textColor : '#2D3A47',
    width: '100%',

    '&:hover': {
      backgroundColor: state.selectProps.customTheme.colors.passwordStrengthUndefined,
      borderRadius: '5px',
    },
    '&:active': {
      backgroundColor: 'transparent',
      borderRadius: '5px',
    },
  }),
  placeholder: (styles, state) => ({
    ...styles,
    fontSize: state.selectProps.placeholderFontSize ? `${state.selectProps.placeholderFontSize}px` : '16px',
    fontFamily: 'Montserrat',
    fontWeight: '400',
    fontStyle: 'normal',
    color: state.selectProps.textColor ? state.selectProps.textColor : '#2D3A47',
    textAlign: 'start',
  }),
  singleValue: (styles, state) => ({
    ...styles,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: state.selectProps.singleValueFontSize ? `${state.selectProps.singleValueFontSize}px` : '16px',
    color: state.selectProps.textColor ? state.selectProps.textColor : '#2D3A47',
  }),
  valueContainer: (styles) => ({
    ...styles,
    gap: '8px 16px',
  }),
};
