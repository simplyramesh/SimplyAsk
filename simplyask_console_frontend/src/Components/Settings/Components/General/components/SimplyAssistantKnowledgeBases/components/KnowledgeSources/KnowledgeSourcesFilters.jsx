import React from 'react'
import { StyledFlex, StyledText } from '../../../../../../../shared/styles/styled'
import { Portal } from 'react-portal'
import { StyledButton } from '../../../../../../../shared/REDISIGNED/controls/Button/StyledButton'
import CustomSelect from '../../../../../../../shared/REDISIGNED/selectMenus/CustomSelect'
import CustomCalendarIndicator from '../../../../../../AccessManagement/components/dropdowns/customComponents/calendarIndicator/CustomCalendarIndicator'
import CustomCalendarMenu from '../../../../../../../shared/REDISIGNED/selectMenus/customComponents/menus/CustomCalendarMenu'
import CustomDropdownIndicator from '../../../../../../../shared/ManagerComponents/Modals/TestManagerModals/ExecuteTestSuiteModal/CustomDropdownIndicator'

const KnowledgeSourcesFilters = ({
  customActionsRef,
  setTypeAndLastUpdated,
  typeAndLastUpdatedValues,
  onApplyFilter,
  setIsFilterApplied
}) => {
  const sharedDropdownProps = {
    minMenuHeight: 150,
    maxMenuHeight: 550,
    hideSelectedOptions: false,
    isClearable: false,
    openMenuOnClick: true,
  };

  const typeOptions = [
    { label: "API", value: "API" },
    { label: "File", value: "FILE" },
    { label: "Text", value: "TEXT" },
    { label: "Website", value: "WEBSITE" },
  ]

  return (
    <StyledFlex p="0 24px 24px 24px">
      <StyledFlex direction="row" alignItems="center" justifyContent="space-between" mb="18px" w="100%">
        <StyledText size={18} weight={500}>Filter By</StyledText>
        <StyledButton
          variant="text"
          onClick={() => {
            setTypeAndLastUpdated((prev) => ({
              ...prev,
              type: null,
              lastUpdated: null
            }))
            setIsFilterApplied(false);
          }}
        >
          Clear All Filters
        </StyledButton>
      </StyledFlex>
      <StyledFlex>
        <CustomSelect
          name="type"
          value={typeAndLastUpdatedValues.type}
          options={typeOptions}
          onChange={(val) => setTypeAndLastUpdated((prev) => ({
            ...prev,
            type: val
          }))}
          placeholder="Select Type"
          components={{
            DropdownIndicator: CustomDropdownIndicator,
          }}
          isSearchable={false}
          menuPortalTarget={document.body}
          closeMenuOnSelect
          {...sharedDropdownProps}
        />
        <CustomSelect
          name="createdDate"
          value={typeAndLastUpdatedValues.lastUpdated}
          onChange={(val) => setTypeAndLastUpdated((prev) => ({
            ...prev,
            lastUpdated: val
          }))}
          placeholder="Select last updated"
          components={{
            DropdownIndicator: CustomCalendarIndicator,
            Menu: CustomCalendarMenu,
          }}
          isSearchable={false}
          menuPortalTarget={document.body}
          closeMenuOnSelect={false}
          {...sharedDropdownProps}
        />
      </StyledFlex>
      <Portal node={customActionsRef?.current}>
        <StyledButton
          width="125px"
          onClick={onApplyFilter}
          variant="contained"
          primary
          disabled={!typeAndLastUpdatedValues.type &&
            !typeAndLastUpdatedValues.lastUpdated}
        >
          Confirm
        </StyledButton>
      </Portal>
    </StyledFlex>
  )
}

export default KnowledgeSourcesFilters