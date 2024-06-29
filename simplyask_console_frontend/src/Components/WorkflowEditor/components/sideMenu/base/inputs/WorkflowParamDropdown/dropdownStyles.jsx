import { ERROR_TYPES } from '../../../../../utils/validation';

export const dropdownStyles = {
  control: (provided, state) => ({
    display: 'flex',
    flex: '1 1 auto',
    alignItems: 'center',
    width: '100%',
    // eslint-disable-next-line no-nested-ternary
    border: state.isFocused || state.isSelected ? '1px solid #2d3a47'
      // eslint-disable-next-line no-nested-ternary
      : state.selectProps.error === ERROR_TYPES.ERROR
        ? '1px solid #E03B24'
        : state.selectProps.error === ERROR_TYPES.WARNING
          ? '1px solid #E7BB09'
          : '1px solid #2d3a47',
    borderRadius: '10px',
    outline: 'none',
    background: '#ffffff',
    fontSize: '16px',
    lineHeight: '20px',
    fontFamily: 'Montserrat',
    fontWeight: '400',
    fontStyle: 'normal',
    cursor: 'pointer',
    padding: state.selectProps.isSelectDropdown ? '10px' : '8px',
    maxHeight: state.selectProps.isMulti ? '200px': '42px',
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    transform: state.selectProps.menuIsOpen ? 'rotate(-180deg)' : 'rotate(0deg)',
    transition: 'transform 250ms ease',
  }),
  indicatorSeparator: () => ({
    backgroundColor: '#2d3a47',
    alignSelf: 'stretch',
    width: '1px',
  }),
  menu: (provided, state) => ({
    ...provided,
    width: state.selectProps.plusIcon ? '286px' : '100%',
    borderRadius: '5px',
    background: '#ffffff',
    boxShadow: '1px 1px 10px 2px rgba(0, 0, 0, 0.1)',
    padding: 0,
    margin: '5px 0 0',
  }),
  menuList: (provided) => ({
    ...provided,
    padding: 0,
    '::-webkit-scrollbar': {
      width: '6px',
      background: 'transparent',
    },
    '::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '::-webkit-scrollbar-thumb': {
        background: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '10px',
        border: '3px solid translarent'
    },
  }),
  group: () => ({
    marginBottom: '10px',
    borderRadius: '5px',
    padding: '8px',
    pointerEvents: 'none',
    ':first-of-type': {
      paddingBottom: '0',
    },
  }),
  groupHeading: () => ({
    marginBottom: '18px',
    fontWeight: '600',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected || state.isFocused ? '#EDEDED' : 'transparent',
    ':hover': {
      backgroundColor: '#EDEDED',
    },
    color: '#2d3a47',
    cursor: state.isSelected ? 'default' : 'pointer',
    pointerEvents: state.isSelected ? 'none' : 'auto',
    fontSize: '16px',
    fontFamily: 'Montserrat',
    margin: '0',
    padding: '8px 15px',
  }),
};
