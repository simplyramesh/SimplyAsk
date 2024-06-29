export const customStyles = {
  container: (styles) => ({
    ...styles,
    cursor: 'default',
    marginTop: '-6px',
    marginRight: '-14px',
  }),
  control: (styles, state) => ({
    boxShadow: 'none',
    minWidth: '174px',
    backgroundColor: 'transparent',
    borderRadius: '10px',
    pointerEvents: state.isDisabled ? 'none' : 'all',

    border: 'none',
    outline: 'none',

    cursor: 'pointer',

    '&:hover': {
      backgroundColor: state.selectProps.customTheme.colors.athensGray,
      border: 'none',
      outline: 'none',
    },
    '&:focus': {
      border: 'none',
      outline: 'none',
    },
    '&:focus-within': {
      backgroundColor: 'transparent',
      outline: `2px solid ${state.selectProps.customTheme.colors.linkColor}`,
      border: 'none',
    },
  }),
  menu: (styles, state) => ({
    ...styles,
    padding: '16px 0',
    boxShadow: state.selectProps.customTheme.boxShadows.box,

    borderRadius: '10px',

    background: '#ffffff',
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
    color: '#2D3A47',
    width: '100%',
    marginRight: '-10px',
    height: '67px',
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
  placeholder: (styles) => ({
    ...styles,
    fontSize: '16px',
    fontFamily: 'Montserrat',
    fontWeight: '400',
    fontStyle: 'normal',
    color: '#2d3a47',
    textAlign: 'right',
  }),
  singleValue: () => ({
    position: 'relative',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '16px',
    lineHeight: '24px',
    color: '#2D3A47',
    textAlign: 'right',
  }),
  valueContainer: () => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '4px 8px',
    flex: '1',
  }),
};
