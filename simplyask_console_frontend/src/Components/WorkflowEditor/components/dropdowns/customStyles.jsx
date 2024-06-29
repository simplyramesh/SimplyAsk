export const customStyles = {
  control: (style) => ({
    ...style,
    width: 90,
    margin: '0 10px',
    border: 'none !important',
    boxShadow: 'none !important',
    background: 'transparent',
    cursor: 'pointer',
  }),

  option: (style, state) => ({
    ...style,
    margin: '0 auto',
    textAlign: 'center',
    color: '#2D3A47',
    borderRadius: '5px',
    cursor: 'pointer',
    // eslint-disable-next-line no-nested-ternary
    background: state.isFocused || state.isSelected ? '#EDEDED !important' : 'transparent !important',
  }),

  menu: (style) => ({
    ...style,
    padding: '8px',
    width: '134px',
    maxHeight: '400px',
    textAlign: 'center',
  }),

  menuList: (style) => ({
    ...style,
    maxHeight: '400px',
  }),

  valueContainer: (style) => ({
    ...style,
    padding: 0,
    justifyContent: 'flex-end',
  }),

  dropdownIndicator: (style) => ({
    ...style,
    color: '#2D3A47 !important',
  }),

  indicatorSeparator: () => ({
    display: 'none',
  }),
};
