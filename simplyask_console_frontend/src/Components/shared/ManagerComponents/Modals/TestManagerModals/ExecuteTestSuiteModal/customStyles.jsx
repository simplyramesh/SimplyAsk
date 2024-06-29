/* eslint-disable no-unused-vars */

export const customStyles = {
  container: (styles) => ({
    ...styles,
    marginBottom: '-4px',
  }),
  control: (styles, state) => ({
    ...styles,
    boxShadow: 'none',
    padding: '4px 10px',
    border: state.selectProps.borderColor
      ? `1px solid ${state.selectProps.borderColor}`
      : '1px solid #C4C4C4',
    borderRadius: '10px',
    outline: 'none',
    '&:hover': {
      border: state.selectProps.borderColor
        ? `1px solid ${state.selectProps.borderColor}`
        : '1px solid #2D3A47',
      outline: 'none',
    },
    '&:focus-within': {
      border: state.selectProps.borderColor
        ? `1px solid ${state.selectProps.borderColor}`
        : '1px solid #2D3A47',
      outline: 'none',
    },
  }),
  indicatorSeparator: (styles) => ({
    ...styles,
    backgroundColor: '#2D3A47',
    marginRight: '8px',
  }),
  menu: (styles) => ({
    ...styles,
    padding: '16px 24px 20px 16px',
    boxShadow: '1px 1px 10px 2px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    background: '#ffffff',
    position: 'relative',
  }),
  option: (styles, state) => ({
    ...styles,
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
    backgroundColor: 'transparent',
    color: '#2D3A47',
    cursor: 'pointer',
    width: '100%',
    fontSize: '16px',
    fontWeight: state.isSelected ? '600' : '400',
    margin: '4px 0',
    pointerEvents: state.isSelected ? 'none' : 'auto',
    '&:hover': {
      backgroundColor: '#DEEAFF',
      color: '#1B55C5',
      borderRadius: '5px',
    },
    '&:active': {
      backgroundColor: '#DEEAFF',
      color: '#1B55C5',
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
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};
