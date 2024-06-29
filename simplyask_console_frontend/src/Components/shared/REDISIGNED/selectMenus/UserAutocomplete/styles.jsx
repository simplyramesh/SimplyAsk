export const autocompleteWithAvatarStyles = {
  control: (baseStyles, state) => {
    return {
      ...baseStyles,
      minHeight: '41px',
      cursor: 'pointer',
      borderRadius: state.selectProps?.borderRadius ? state.selectProps?.borderRadius : 0,
      border: 'none',
      borderColor: 'transparent',
      outline: state.isFocused ? '2px solid #2075f5' : 'none',
      padding: '0 7px',
      '&:hover': {
        background: state.isFocused ? '#FFFFFF' : '#EAECF1',
      },
      ...(state.selectProps.backgroundColor && { backgroundColor: state.selectProps.backgroundColor }),
    };
  },
  indicatorsContainer: (baseStyles, state) => {
    return ({
      ...baseStyles,
      display: state.selectProps.menuIsOpen ? 'flex' : 'none',
    });
  },
  option: (baseStyles, state) => ({
    ...baseStyles,
    // eslint-disable-next-line no-nested-ternary
    background: state.isSelected || state?.isFocused ? '#F0F0F0' : 'white',
    color: '#2d3a47 !important',
    cursor: 'pointer',
  }),
  menu: (style) => ({
    ...style,
    boxShadow: '1px 1px 10px 2px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    overflow: 'hidden',
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};

export const formAutocompleteSelect = {
  control: (styles, state) => ({
    ...styles,
    boxShadow: 'none',
    minHeight: '41px',
    backgroundColor: '#FFFFFF',
    border: state.selectProps.borderColor
      ? `1px solid ${state.selectProps.borderColor}`
      : `1px solid ${state.selectProps.customTheme.colors.inputBorder}`,
    borderRadius: '10px',
    outline: 'none',

    padding: '1px 8px 2px 10px',

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
  indicatorsContainer: (baseStyles) => ({
    ...baseStyles,
  }),
  indicatorContainer: (baseStyles) => ({
    ...baseStyles,
    padding: '5px 8px',
  }),
  indicatorSeparator: (styles, state) => ({
    ...styles,
    display: state.selectProps.withSeparator ? 'inherit' : 'none',
    backgroundColor: state.selectProps.customTheme.colors.primary,
    margin: state.selectProps.withSeparator ? '8px 6px 8px 0' : '0',
  }),
};
