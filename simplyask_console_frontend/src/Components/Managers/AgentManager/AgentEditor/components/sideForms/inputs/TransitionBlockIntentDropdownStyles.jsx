import { formStyles } from "../../../../../../shared/REDISIGNED/selectMenus/CustomSelect";
import { theme } from '../../../../../../../config/theme';
import { customStyles } from "../../../../../../shared/REDISIGNED/selectMenus/customStyles";

export const dropdownStyles = {
  ...formStyles,
  dropdownIndicator: (provided, state) => ({
    ...provided,
    transform: state.selectProps.menuIsOpen ? 'rotate(-180deg)' : 'rotate(0deg)',
    transition: 'transform 250ms ease',
  }),
  indicatorSeparator: () => ({
    backgroundColor: theme.colors.primary,
    alignSelf: 'center',
    width: '1px',
    height: '24px',
  }),
  menu: (provided, state) => ({
    ...provided,
    width: state.selectProps.plusIcon ? '286px' : '100%',
    borderRadius: '10px',
    background: theme.colors.white,
    boxShadow: theme.boxShadows.table,
    padding: '15px 0px',
    zIndex: 9999
  }),
  group: (provided, state) => ({
    backgroundColor: !state.data.includeDivider && state.options.length === 1 && state.options[0].isSelected ? theme.colors.galleryGray : 'transparent',
    ':hover': {
      backgroundColor: !state.data.includeDivider && state.options.length === 1 && theme.colors.galleryGray,
    },
    cursor: !state.data.includeDivider && state.options.length === 1 ? 'pointer' : 'auto',
    pointerEvents: state.data.includeDivider || state.options[0].isSelected ? 'none' : 'auto',
  }),
  groupHeading: (provided, state) => ({
    cursor: state.data.options.length === 1 ? 'pointer' : 'auto',
    marginBottom: '20px',
    fontWeight: '600',
    padding: '0px 15px',
  }),
  option: (provided, state) => ({
    backgroundColor: state.isSelected ? theme.colors.galleryGray : 'transparent',
    ':hover': {
      backgroundColor: theme.colors.galleryGray,
    },
    borderRadius: '5px',
    color: theme.colors.primary,
    cursor: state.isSelected ? 'default' : 'pointer',
    pointerEvents: state.isSelected ? 'none' : 'auto',
    fontSize: '16px',
    fontFamily: 'Montserrat',
    marginBottom: '20px',
    padding: state.data.value === 'Divider' ? '0px' : '0px 15px'
  }),
};

export const selectIntentTypeDropDownStyles = {
  control: (styles, state) => ({
    ...styles,
    ...customStyles.control(styles, state),
    borderRadius: '20px',
    width: '156px',
    height: '30px',
    padding: '0 15px 0 4px',
    minHeight: '30px',
    fontSize: '15px'
  }),
  option: (provided, state) => ({
    ...provided,
    ...customStyles.option(provided, state),
    padding: '11px',
    fontSize: '16px',
    fontWeight: state.isSelected ? '700' : '400',
    gap: '20px',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
}