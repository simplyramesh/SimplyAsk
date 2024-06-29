import { Portal } from 'react-portal';
import { StyledButton } from '../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomSelect from '../../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import CustomIndicatorArrow from '../../../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomCalendarMenu from '../../../../../../shared/REDISIGNED/selectMenus/customComponents/menus/CustomCalendarMenu';
import CustomSidebar from '../../../../../../shared/REDISIGNED/sidebars/CustomSidebar/CustomSidebar';
import { StyledFlex, StyledText } from '../../../../../../shared/styles/styled';
import CustomCalendarIndicator from '../../../../../AccessManagement/components/dropdowns/customComponents/calendarIndicator/CustomCalendarIndicator';

const PhoneNumberManagementFiltersSideBar = ({
  isPhoneNumberFilterOpen,
  onFilterSideBarClose,
  phoneNumberFilterValues,
  phoneNumberSetValues,
  phoneNumberSetFieldFilterValues,
  countryDataOptions,
  provinceDataOptions,
  regionDataOptions,
  phoneNumberSubmitForm, }) => {

  const sharedDropdownProps = {
    minMenuHeight: 150,
    maxMenuHeight: 550,
    closeMenuOnSelect: true,
    hideSelectedOptions: false,
    isClearable: false,
    openMenuOnClick: true,
  };

  return (
    <CustomSidebar
      open={isPhoneNumberFilterOpen}
      onClose={onFilterSideBarClose}
      headStyleType="filter"
      width={550}
    >
      {({ customActionsRef }) => (
        <StyledFlex>
          {isPhoneNumberFilterOpen && (
            <StyledFlex flex="1 1 auto" p="0 24px 24px 24px">
              <StyledFlex direction="row" alignItems="center" justifyContent="space-between" mb="18px" w="100%">
                <StyledText size={18} weight={500}>Filter By</StyledText>
                <StyledButton
                  variant="text"
                  onClick={() => phoneNumberSetValues({ createdDate: '', country: '', province: '', region: '' })}
                >
                  Clear All Filters
                </StyledButton>
              </StyledFlex>
              <StyledFlex>
                <CustomSelect
                  name="createdDate"
                  value={phoneNumberFilterValues.createdDate}
                  onChange={(val, action) => phoneNumberSetFieldFilterValues(action.name, val)}
                  placeholder="Date Created"
                  components={{
                    DropdownIndicator: CustomCalendarIndicator,
                    Menu: CustomCalendarMenu,
                  }}
                  isSearchable={false}
                  {...sharedDropdownProps}
                  radioLabels={[
                    {
                      label: 'Date Created',
                      value: ['createdBefore', 'createdAfter'],
                      default: true,
                    },
                  ]}
                  showDateFilterType={false}
                />
                <CustomSelect
                  name="country"
                  options={countryDataOptions ?? []}
                  value={phoneNumberFilterValues.country}
                  onChange={(val, action) => phoneNumberSetFieldFilterValues(action.name, val)}
                  placeholder="Search Country"
                  components={{
                    DropdownIndicator: CustomIndicatorArrow,
                  }}
                  isSearchable
                  withSeparator
                  {...sharedDropdownProps}
                />
                <CustomSelect
                  name="province"
                  options={provinceDataOptions ?? []}
                  value={phoneNumberFilterValues.province}
                  onChange={(val, action) => phoneNumberSetFieldFilterValues(action.name, val)}
                  placeholder="Search Province/State"
                  components={{
                    DropdownIndicator: CustomIndicatorArrow,
                  }}
                  isSearchable
                  withSeparator
                  {...sharedDropdownProps}
                />
                <CustomSelect
                  name="region"
                  options={regionDataOptions ?? []}
                  value={phoneNumberFilterValues.region}
                  onChange={(val, action) => phoneNumberSetFieldFilterValues(action.name, val)}
                  placeholder="Search Region"
                  components={{
                    DropdownIndicator: CustomIndicatorArrow,
                  }}
                  isSearchable
                  withSeparator
                  {...sharedDropdownProps}
                />
              </StyledFlex>
              <Portal node={customActionsRef?.current}>
                <StyledButton
                  width="125px"
                  onClick={phoneNumberSubmitForm}
                  variant="contained"
                  primary
                >
                  Confirm
                </StyledButton>
              </Portal>
            </StyledFlex>
          )}
        </StyledFlex>
      )}
    </CustomSidebar>
  )
}

export default PhoneNumberManagementFiltersSideBar