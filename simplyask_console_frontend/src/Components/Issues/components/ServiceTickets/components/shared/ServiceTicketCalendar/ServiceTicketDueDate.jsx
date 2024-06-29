import { useTheme } from '@emotion/react';
import { useState } from 'react';

import CustomCalendarIndicator from '../../../../../../Settings/AccessManagement/components/dropdowns/customComponents/calendarIndicator/CustomCalendarIndicator';
import SingleCalendarMenuList from '../../../../../../shared/REDISIGNED/selectMenus/customComponents/menuLists/SingleCalendarMenuList';
import { DateSingleValue } from '../../../../../../shared/REDISIGNED/selectMenus/customComponents/singleControls/DateSingleValue';
import CustomSelect from '../../../../../../shared/REDISIGNED/selectMenus/CustomSelect';

const ServiceTicketDueDate = ({
  onChange, onBlur, onInputFocus, isMenuOpen, isMenuPortal, ...props
}) => {
  const theme = useTheme();

  const [isCalendarMenuFocused, setIsCalendarMenuFocused] = useState(isMenuOpen || false);

  return (
    <CustomSelect
      {...props}
      components={{
        DropdownIndicator: CustomCalendarIndicator,
        SingleValue: DateSingleValue,
        Menu: SingleCalendarMenuList,
      }}
      menuPlacement="auto"
      autoFocus
      isSearchable={false}
      calendar
      cell
      timePicker
      onMenuInputFocus={(v) => {
        onInputFocus?.(v);
        setIsCalendarMenuFocused(v);
      }}
      onBlur={() => {
        onBlur?.();
        setIsCalendarMenuFocused(false);
      }}
      menuIsOpen={isCalendarMenuFocused || undefined}
      isFocused={isCalendarMenuFocused || undefined}
      onChange={(e) => {
        onChange?.(e);
        setIsCalendarMenuFocused(false);
      }}
      customTheme={theme}
      {...(isMenuPortal
        ? {
          menuPortalTarget: document.body,
        }
        : {
          menuRootZIndex: 9999,
          menuPosition: 'left',
        })}
    />
  );
};

export default ServiceTicketDueDate;
