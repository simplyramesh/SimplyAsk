import CustomSelect from '../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { StyledFlex } from '../../../../../shared/styles/styled';

const customStyles = {
  container: (styles) => ({
    ...styles,
    cursor: 'default',
    marginRight: '-14px',
  }),
  control: (_, state) => ({
    display: 'inline-flex',
    boxShadow: 'none',
    minWidth: state.selectProps?.isActions ? '146px' : '174px',
    minHeight: '41px',
    backgroundColor: 'transparent',
    borderRadius: '10px',
    pointerEvents: state.isDisabled ? 'none' : 'all',

    border: state.selectProps?.isActions ? `1px solid ${state.selectProps.customTheme.colors.primary}` : 'none',
    outline: 'none',

    cursor: 'pointer',

    '&:hover': {
      backgroundColor: state.selectProps?.isActions ? 'transparent' : state.selectProps.customTheme.colors.athensGray,
      border: state.selectProps?.isActions ? `1px solid ${state.selectProps.customTheme.colors.primary}` : 'none',
      outline: 'none',
    },
    '&:focus': {
      border: state.selectProps?.isActions ? `1px solid ${state.selectProps.customTheme.colors.primary}` : 'none',
      outline: 'none',
    },
    '&:focus-within': {
      backgroundColor: 'transparent',
      outline: state.selectProps?.isActions
        ? 'none'
        : `2px solid ${state.selectProps.customTheme.colors.linkColor}`,
      border: state.selectProps?.isActions
        ? `1px solid ${state.selectProps.customTheme.colors.primary}`
        : 'none',
    },
  }),
  dropdownIndicator: (styles, state) => ({
    ...styles,
    display: state.selectProps?.isActions || state.isFocused ? 'flex' : 'none',
    visibility: state.selectProps?.isActions || state.isFocused ? 'visible' : 'hidden',
    padding: '0px 8px 0px 0',

  }),
  menu: (styles, state) => ({
    ...styles,
    boxShadow: state.selectProps.customTheme.boxShadows.box,

    borderRadius: '10px',

    background: state.selectProps.customTheme.colors.white,
    width: state.selectProps?.menuWidth ? state.selectProps?.menuWidth : styles.width,
    ...(state.selectProps?.alignMenu === 'right' && {
      right: 0,
    }),
  }),
  menuPortal: (styles) => ({
    ...styles,
    zIndex: 9999,
  }),
  option: (styles, state) => ({
    ...styles,
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
    backgroundColor: 'transparent',
    color: state.selectProps.customTheme.colors.primary,
    width: '100%',
    marginRight: '-10px',
    cursor: 'pointer',

    '&:hover': {
      backgroundColor: state.selectProps.customTheme.colors.hoverPopoverItem,
      borderRadius: '5px',
    },
    '&:active': {
      backgroundColor: 'transparent',
      borderRadius: '5px',
    },
  }),
  placeholder: (styles, state) => ({
    ...styles,
    fontSize: state.selectProps?.isActions ? '14px' : '16px',
    fontFamily: 'Montserrat',
    fontWeight: '400',
    fontStyle: 'normal',
    color: state.selectProps.customTheme.colors.primary,
    textAlign: 'right',
  }),
  singleValue: (_, state) => ({
    position: 'relative',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '16px',
    lineHeight: '24px',
    color: state.selectProps.customTheme.colors.primary,
    textAlign: 'right',
  }),
  valueContainer: (_, state) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: state.isFocused ? '4px 0 4px 8px' : '4px 8px',
    flex: '1',
  }),
};

const components = {
  ClearIndicator: null,
  IndicatorSeparator: null,
};

const TaskTypeDropdown = ({ ...props }) => {
  return (
    <StyledFlex
      alignItems="flex-end"
      cursor="default"
    >
      <CustomSelect
        styles={customStyles}
        components={components}
        closeMenuOnSelect
        blurInputOnSelect
        {...props}
      />
    </StyledFlex>
  );
};

export default TaskTypeDropdown;
