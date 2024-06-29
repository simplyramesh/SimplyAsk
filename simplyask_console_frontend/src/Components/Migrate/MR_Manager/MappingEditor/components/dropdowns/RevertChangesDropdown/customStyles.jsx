export const customStyles = {
  control: (style) => ({
    ...style,
    cursor: 'pointer',
    border: '1px solid #2D3A47',
    borderColor: '#2D3A47',
    boxShadow: 'none',
    outline: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: ' 600',
    width: '186px',
    transition: 'background 200ms ease-in-out',
    '&:hover': {
      background: 'rgba(45, 58, 71, 0.2)',
    },
  }),
  valueContainer: (style) => ({
    ...style,
    padding: '12px 0 12px 16px',
  }),
  indicatorsContainer: (style) => ({
    ...style,
    paddingRight: '8px',
  }),
  dropdownIndicator: (style, state) => ({
    ...style,
    transform: state.selectProps.menuIsOpen ? 'rotate(-180deg)' : 'rotate(0deg)',
    transition: 'transform 200ms ease',
    color: '#2D3A47',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  menu: (style) => ({
    ...style,
    left: '-50%',
    display: 'flex',
    width: 'fit-content',
    background: '#FFFFFF',
    boxShadow: '1px 1px 10px 2px rgba(0, 0, 0, 0.1)',
    borderRadius: '5px',
    padding: '6px',
  }),
  option: () => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    cursor: 'pointer',
    flexWrap: 'nowrap',
    whiteSpace: 'nowrap',
    borderRadius: '5px',
    padding: '6px',
    '&:hover': {
      background: '#EDEDED',
    },
  }),
};
