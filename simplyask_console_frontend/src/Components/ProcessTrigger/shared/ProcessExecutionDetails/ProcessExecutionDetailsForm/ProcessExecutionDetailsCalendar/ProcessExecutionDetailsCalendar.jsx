import { useState } from 'react';

import CustomCalendarIndicator from '../../../../../Settings/AccessManagement/components/dropdowns/customComponents/calendarIndicator/CustomCalendarIndicator';
import SingleCalendarMenuList from '../../../../../shared/REDISIGNED/selectMenus/customComponents/menuLists/SingleCalendarMenuList';
import { DateSingleValue } from '../../../../../shared/REDISIGNED/selectMenus/customComponents/singleControls/DateSingleValue';
import CustomSelect from '../../../../../shared/REDISIGNED/selectMenus/CustomSelect';

const ProcessExecutionDetailsCalendar = (props) => {
  const [isCalendarMenuFocused, setIsCalendarMenuFocused] = useState(false);

  return (
    <CustomSelect
      closeMenuOnSelect
      components={{
        DropdownIndicator: CustomCalendarIndicator,
        SingleValue: DateSingleValue,
        Menu: SingleCalendarMenuList,
      }}
      menuPlacement="auto"
      form
      calendar
      timePicker
      onMenuInputFocus={() => setIsCalendarMenuFocused(true)}
      onBlur={() => setIsCalendarMenuFocused(false)}
      {...{
        menuIsOpen: isCalendarMenuFocused || undefined,
        isFocused: isCalendarMenuFocused || undefined,
      }}
      {...props}
      onChange={(e) => {
        props.onChange?.(e);
        setIsCalendarMenuFocused(false);
      }}
      menuRootZIndex={9999}
      menuPosition="right"

    />
  );
};

export default ProcessExecutionDetailsCalendar;
