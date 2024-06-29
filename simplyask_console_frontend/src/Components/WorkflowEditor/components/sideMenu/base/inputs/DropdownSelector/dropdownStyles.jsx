import { ERROR_TYPES } from '../../../../../utils/validation';

export const dropdownStyles = {
  control: (provided, state) => ({
    display: 'flex',
    flex: '1 1 auto',
    alignItems: 'center',
    width: '100%',
    // eslint-disable-next-line no-nested-ternary
    border: state.isFocused ? '1px solid #2d3a47'
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
    maxHeight: '42px',
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
    borderRadius: '10px',
    background: '#ffffff',
    boxShadow: '0px 6px 10px 1px rgba(0, 0, 0, 0.05)',
    padding: '12px 0 12px 12px',
  }),
  menuList: (provided) => ({
    ...provided,
    paddingRight: '16px',
    '::-webkit-scrollbar': {
      width: '16px',
    },
    ':hover::-webkit-scrollbar-thumb': {
      border: '4px solid #F4F4F4',
      borderRadius: '10px',
      background: 'rgba(198, 198, 198, 0.5)',
    },
    ':hover::-webkit-scrollbar-track': {
      background: '#F4F4F4',
      borderRadius: '2px',
    },
    ':hover::-webkit-scrollbar-track-piece:': {
      margin: '4px 0',
      background: '#F4F4F4',
    },
  }),
  group: (provided, state) => ({
    backgroundColor: !state.data.includeDivider && state.options.length === 1 && state.options[0].isSelected ? '#EDEDED' : 'transparent',
    ':hover': {
      backgroundColor: !state.data.includeDivider && state.options.length === 1 && '#EDEDED',
    },
    marginBottom: '10px',
    borderRadius: '5px',
    padding: '8px',
    cursor: !state.data.includeDivider && state.options.length === 1 ? 'pointer' : 'auto',
    pointerEvents: state.data.includeDivider || state.options[0].isSelected ? 'none' : 'auto',
  }),
  groupHeading: (provided, state) => ({
    cursor: state.data.options.length === 1 ? 'pointer' : 'auto',
    marginBottom: state.data.options.length === 1 ? '0px' : '18px',
    fontWeight: state.data.options.length === 1 ? '700' : '600',
  }),
  option: (provided, state) => ({
    backgroundColor: state.isSelected ? '#EDEDED' : 'transparent',
    ':hover': {
      backgroundColor: '#EDEDED',
    },
    borderRadius: '5px',
    color: '#2d3a47',
    cursor: state.isSelected ? 'default' : 'pointer',
    pointerEvents: state.isSelected ? 'none' : 'auto',
    fontSize: '16px',
    fontFamily: 'Montserrat',
    margin: state.options[0].includeDivider ? '0px 0px 8px 8px' : '0px',
    padding: state.options[0].includeDivider ? '8px' : 'inherit',
  }),
};
