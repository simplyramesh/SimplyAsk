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
    maxWidth: state.selectProps.maxWidth != null ? `${state.selectProps.maxWidth}px` : '100%',
    marginBottom: state.selectProps.mb != null ? `${state.selectProps.mb}px` : '22px',
  }),
  // control styles are for the filter select
  control: (styles, state) => ({
    ...styles,
    boxShadow: 'none',

    // extraPaddingY is used because calendar icon is bigger than dropdown icon
    padding: state.selectProps.extraPaddingY ? '5px 10px' : '0px 10px',

    border: '1px solid #2D3A47',
    borderRadius: '20px',
    outline: 'none',

    cursor: 'pointer',

    '&:hover': {
      border: '1px solid #2D3A47',
      outline: 'none',
    },
    '&:focus-within': {
      border: '1px solid #2D3A47',
      outline: 'none',
    },
  }),
  dropdownIndicator: (styles) => ({
    ...styles,
  }),
  group: (styles) => ({
    ...styles,
  }),
  groupHeading: (styles) => ({
    ...styles,
  }),
  indicatorsContainer: (styles) => ({
    ...styles,
  }),
  indicatorSeparator: (styles) => ({
    ...styles,
    display: 'none',
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
  menu: (styles) => ({
    ...styles,
    zIndex: 99999,
    minWidth: '100%',
    padding: '16px 24px 20px 16px',
    boxShadow: '1px 1px 10px 2px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    background: '#ffffff',
    right: 0,
  }),
  menuList: (styles) => ({
    ...styles,
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  multiValue: (styles) => ({
    ...styles,
    backgroundColor: 'transparent',

    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '18px',
    color: '#2D3A47',

    margin: '0',
  }),
  multiValueLabel: (styles) => ({
    ...styles,
  }),
  multiValueRemove: (styles) => ({
    ...styles,
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
    color: '#2D3A47',
    width: '100%',
    cursor: 'pointer',
    fontWeight: state.isSelected ? '600' : '400',
    pointerEvents: state.isSelected ? 'none' : 'auto',

    '&:hover': {
      backgroundColor: state.selectProps.customTheme.colors.passwordStrengthUndefined,
      borderRadius: '5px',
    },
    '&:active': {
      backgroundColor: 'transparent',
      borderRadius: '5px',
    },
  }),
  placeholder: (styles) => ({
    ...styles,
    fontSize: '16px',
    fontFamily: 'Montserrat',
    fontWeight: '400',
    fontStyle: 'normal',
    color: '#2d3a47',
  }),
  singleValue: (styles) => ({
    ...styles,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '16px',
    color: '#2D3A47',
  }),
  valueContainer: (styles) => ({
    ...styles,
  }),
};

export const filterStyles = {
  control: (styles, state) => ({
    ...customStyles.control(styles, state),
    minHeight: state.selectProps.maxHeight != null ? `${state.selectProps.maxHeight}px` : '41px',
  }),
  dropdownIndicator: (styles, state) => ({
    ...styles,
    padding: state.selectProps.maxHeight != null ? 0 : styles.padding,
  }),
  groupHeading: () => ({ display: 'none' }),
};

export const formStyles = {
  container: (styles) => ({
    ...styles,
    width: '100%',
  }),
  control: (styles, state) => ({
    ...styles,
    boxShadow: 'none',

    backgroundColor: '#FFFFFF',
    border: state.selectProps.borderColor
      ? `1px solid ${state.selectProps.borderColor}`
      : `1px solid ${state.selectProps.customTheme.colors.inputBorder}`,
    borderRadius: '10px',
    outline: 'none',

    padding: '4px 8px 4px 2px',

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
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};
