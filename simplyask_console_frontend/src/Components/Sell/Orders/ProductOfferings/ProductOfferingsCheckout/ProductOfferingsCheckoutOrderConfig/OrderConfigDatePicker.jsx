import { BASE_DATE_FORMAT, getInFormattedUserTimezone } from '../../../../../../utils/timeUtil';
import CustomCalendarIndicator from '../../../../../Settings/AccessManagement/components/dropdowns/customComponents/calendarIndicator/CustomCalendarIndicator';
import SingleCalendarMenuList from '../../../../../shared/REDISIGNED/selectMenus/customComponents/menuLists/SingleCalendarMenuList';
import { DateSingleValue } from '../../../../../shared/REDISIGNED/selectMenus/customComponents/singleControls/DateSingleValue';
import CustomSelect from '../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';

const OrderConfigDatePicker = ({
  selectedDate, onDateChange, isEditable, currentUser, minDate,
}) => (
  <StyledFlex position="relative" flex="auto">
    {isEditable ? (
      <CustomSelect
        placeholder="Select Date"
        onChange={onDateChange}
        value={selectedDate}
        closeMenuOnSelect
        components={{
          DropdownIndicator: CustomCalendarIndicator,
          SingleValue: DateSingleValue,
          Menu: SingleCalendarMenuList,
        }}
        menuPortalTarget={document.body}
        form
        calendar
        isMenuOpen
        minDate={minDate}
      />
    ) : (
      <StyledText size={16} weight={400} lh={24}>
        {getInFormattedUserTimezone(selectedDate, currentUser?.timezone, BASE_DATE_FORMAT)}
      </StyledText>
    )}
  </StyledFlex>
);

export default OrderConfigDatePicker;
