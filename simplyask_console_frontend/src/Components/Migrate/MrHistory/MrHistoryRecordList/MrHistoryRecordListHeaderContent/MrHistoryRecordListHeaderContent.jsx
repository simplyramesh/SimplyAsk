import PropTypes from 'prop-types';

import CustomIndicatorArrow from '../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomCheckboxOption from '../../../../shared/REDISIGNED/selectMenus/customComponents/options/CustomCheckboxOption';
import CustomSelect from '../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import SearchBar from '../../../../shared/SearchBar/SearchBar';
import { StyledFlex, StyledText } from '../../../../shared/styles/styled';
import ViewFiltersButton from '../../../../shared/ViewFiltersButton/ViewFiltersButton';
import { MR_HISTORY_RECORD_LIST_FILTER_KEYS, MR_HISTORY_RECORD_STAGES } from '../../../utils/mappers';

const stages = Object.keys(MR_HISTORY_RECORD_STAGES).map((key) => ({
  value: key,
  label: MR_HISTORY_RECORD_STAGES[key].label,
  color: MR_HISTORY_RECORD_STAGES[key].color,
}));

const MrHistoryRecordListHeaderContent = (props) => {
  const {
    onSearch = () => {},
    onOpenFilters = () => {},
    onFilterChange = () => {},
    filterInputProps = {},
    onMenuClose = () => {},
  } = props;

  return (
    <>
      <StyledFlex direction="row" gap="16px" alignItems="center">
        <SearchBar
          placeholder="Search Record IDs"
          onChange={onSearch}
        />
        <ViewFiltersButton onClick={onOpenFilters} />
      </StyledFlex>
      <StyledFlex direction="row" gap="0 12px" width="314px">
        <StyledFlex m="auto 0">
          <StyledText weight={600}>Stage</StyledText>
        </StyledFlex>
        <StyledFlex flex="1 1 244px" mb="-22px">
          <CustomSelect
            name="stages"
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            isClearable={false}
            isSearchable={false}
            isMulti
            hideMultiValueRemove
            options={stages}
            {...filterInputProps(MR_HISTORY_RECORD_LIST_FILTER_KEYS.STAGE)}
            onChange={onFilterChange}
            placeholder="All Record Stages"
            components={{
              DropdownIndicator: CustomIndicatorArrow,
              Option: CustomCheckboxOption,
            }}
            onMenuClose={onMenuClose}
            maxHeight={30}
          />
        </StyledFlex>
      </StyledFlex>
    </>
  );
};

export default MrHistoryRecordListHeaderContent;

MrHistoryRecordListHeaderContent.propTypes = {
  onSearch: PropTypes.func,
  onOpenFilters: PropTypes.func,
  onFilterChange: PropTypes.func,
  filterInputProps: PropTypes.func,
  onMenuClose: PropTypes.func,
};
