import PropTypes from 'prop-types';

import CustomSelect from '../../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import AssociatedTicketSelectMenu from './AssociatedTicketSelectMenu';
import AssociatedTicketSelectMenuList from './AssociatedTicketSelectMenuList';
import AssociatedTicketSelectOption from './AssociatedTicketSelectOption';
import { customStyles } from './customStyles';

const components = {
  DropdownIndicator: null,
  ClearIndicator: null,
  IndicatorSeparator: null,
  Menu: AssociatedTicketSelectMenu,
  MenuList: AssociatedTicketSelectMenuList,
  Option: AssociatedTicketSelectOption,
};

const AssociatedTicketSelect = ({ options = [], defaultValue, ...props }) => {
  return (
    <CustomSelect
      defaultValue={defaultValue}
      options={options}
      styles={customStyles}
      components={components}
      menuPortalTarget={document.body}
      maxMenuHeight={251}
      minMenuHeight={251}
      menuWidth="461px"
      alignMenu="right"
      {...props}
    />
  );
};

export default AssociatedTicketSelect;

AssociatedTicketSelect.propTypes = {
  ticketName: PropTypes.string,
};
