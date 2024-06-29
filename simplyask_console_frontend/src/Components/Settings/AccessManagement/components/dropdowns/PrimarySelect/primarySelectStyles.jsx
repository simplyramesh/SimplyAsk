import { customStyles } from '../customStyles';

export const primarySelectStyles = {
  container: (styles) => ({
    ...styles,
    width: '100%',
  }),
  control: (styles, state) => ({
    ...styles,
    boxShadow: 'none',
    padding: state.selectProps.withSeparator ? '4.5px 10px' : '5px 10px',
    width: state.selectProps.width ? `${state.selectProps.width}px` : '374px',
    border: `1px solid ${state.selectProps.customTheme.colors.primary}`,
    borderRadius: '10px',
    outline: 'none',
    cursor: 'pointer',

    '&:hover': {
      border: `1px solid ${state.selectProps.customTheme.colors.primary}`,
      outline: 'none',
    },
    '&:focus-within': {
      border: `1px solid ${state.selectProps.customTheme.colors.primary}`,
      outline: 'none',
    },
  }),
  groupHeading: () => ({ display: 'none' }),
  indicatorSeparator: (styles, state) => ({
    ...styles,
    display: state.selectProps.withSeparator ? 'flex' : 'none',
    backgroundColor: state.selectProps.customTheme.colors.primary,
    margin: '4px 6px 4px 0',
  }),
  input: (styles, state) => ({
    ...styles,
    padding: state.selectProps.withSeparator ? '0' : customStyles.input(styles).padding,
  }),
  menu: (styles, state) => ({
    ...styles,
    ...customStyles.menu(styles),
    padding: state.selectProps.withSeparator ? '16px 0px 20px 16px' : customStyles.menu(styles).padding,
  }),
  option: (styles, state) => {
    const withoutSeparator = {
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
    };

    const hover = state.selectProps.withSeparator ? '&:hover: {}' : withoutSeparator;

    return {
      ...styles,
      ...customStyles.option(styles, state),
      backgroundColor: 'transparent',
      color: state.selectProps.customTheme.colors.primary,
      fontWeight: state.isSelected ? '600' : '400',
      pointerEvents: state.isSelected ? 'none' : 'auto',
      transition: `font-weight ${state.selectProps.customTheme.transitions.default}, background-color ${state.selectProps.customTheme.transitions.default}`,
      cursor: 'pointer',
      padding: state.selectProps.withSeparator ? '0' : styles.padding,
      width: '100%',
      ...hover,
    };
  },
  multiValueRemove: (styles) => ({
    ...styles,
    display: 'none',
  }),
  placeholder: (styles, state) => ({
    ...styles,
    ...customStyles.placeholder(styles),
    color: state.selectProps.customTheme.colors.information,
  }),
  singleValue: (styles, state) => ({
    ...styles,
    ...customStyles.singleValue(styles),
    fontWeight: state.isSelected ? '600' : '400',
    pointerEvents: state.isSelected ? 'none' : 'auto',
  }),
};
