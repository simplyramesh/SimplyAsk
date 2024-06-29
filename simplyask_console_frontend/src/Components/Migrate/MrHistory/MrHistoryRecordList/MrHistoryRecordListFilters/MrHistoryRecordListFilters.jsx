import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

import { getExecutionSummaryById } from '../../../../../Services/axios/migrate';
import CustomCalendarIndicator from '../../../../Settings/AccessManagement/components/dropdowns/customComponents/calendarIndicator/CustomCalendarIndicator';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomIndicatorArrow from '../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomCalendarMenu from '../../../../shared/REDISIGNED/selectMenus/customComponents/menus/CustomCalendarMenu';
import CustomCheckboxOption from '../../../../shared/REDISIGNED/selectMenus/customComponents/options/CustomCheckboxOption';
import CustomSelect from '../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { StyledFlex, StyledText } from '../../../../shared/styles/styled';
import {
  MR_HISTORY_RECORD_LIST_API_KEYS,
  MR_HISTORY_RECORD_LIST_FILTER_KEYS,
  STATUS_MAP,
} from '../../../utils/mappers';

const statuses = Object.keys(STATUS_MAP).map((s) => ({
  label: STATUS_MAP[s].label,
  color: STATUS_MAP[s].color,
  value: s,
}));

const removeNullAndDuplicates = (arr, key) =>
  arr?.reduce((acc, curr) => {
    if (curr[key] && !acc.find((a) => a[key] === curr[key])) {
      acc.push(curr);
    }

    return acc;
  }, []);

const MrHistoryRecordListFilters = (props) => {
  const { onFilterChange, onCalendarFilterChange, filterInputProps, onClearFilters, calendarKey } = props;

  const [searchParams] = useSearchParams();

  const executionId = searchParams.get('executionId');

  const theme = useTheme();

  const sharedDropdownProps = {
    closeMenuOnSelect: false,
    hideSelectedOptions: false,
    isClearable: false,
    openMenuOnClick: true,
    customTheme: theme,
  };

  const { data: dropdownsData } = useQuery({
    queryKey: ['getAllExecutions', executionId],
    queryFn: () => getExecutionSummaryById(executionId),
    select: (data) => data?.content,
  });

  return (
    <StyledFlex flex="1 1 auto" p="0 24px">
      <StyledFlex direction="row" alignItems="center" justifyContent="space-between" mb="18px" w="100%">
        <StyledText size={18} weight={500}>
          Filter By
        </StyledText>
        <StyledButton variant="text" onClick={onClearFilters}>
          Clear All Filters
        </StyledButton>
      </StyledFlex>
      <StyledFlex w="100%">
        <CustomSelect
          placeholder="Select Date & Time Range"
          components={{
            DropdownIndicator: CustomCalendarIndicator,
            Menu: CustomCalendarMenu,
          }}
          {...filterInputProps(calendarKey)}
          onChange={onCalendarFilterChange}
          isSearchable={false}
          minMenuHeight={600}
          maxMenuHeight={600}
          {...sharedDropdownProps}
          // custom props
          radioLabels={[
            {
              label: 'Started Date',
              value: [
                MR_HISTORY_RECORD_LIST_FILTER_KEYS.STARTED.BEFORE,
                MR_HISTORY_RECORD_LIST_FILTER_KEYS.STARTED.AFTER,
              ],
              default: true,
            },
            {
              label: 'Ended Date',
              value: [MR_HISTORY_RECORD_LIST_FILTER_KEYS.ENDED.BEFORE, MR_HISTORY_RECORD_LIST_FILTER_KEYS.ENDED.AFTER],
              default: false,
            },
          ]}
          showDateFilterType={false}
        />
        <CustomSelect
          name={MR_HISTORY_RECORD_LIST_FILTER_KEYS.TRANSFORM_BATCH_ID}
          options={removeNullAndDuplicates(dropdownsData, 'transformBatchId')}
          placeholder="Search Transform Batch ID"
          {...filterInputProps(MR_HISTORY_RECORD_LIST_FILTER_KEYS.TRANSFORM_BATCH_ID)}
          onChange={onFilterChange}
          getOptionLabel={(option) => option[MR_HISTORY_RECORD_LIST_API_KEYS.TRANSFORM_BATCH_ID]}
          getOptionValue={(option) => option[MR_HISTORY_RECORD_LIST_API_KEYS.TRANSFORM_BATCH_ID]}
          isMulti
          isSearchable
          components={{
            DropdownIndicator: CustomIndicatorArrow,
            Option: CustomCheckboxOption,
          }}
          maxMenuHeight={416}
          {...sharedDropdownProps}
          // custom props
          withSeparator
          withMultiSelect
          labelKey="value"
          valueKey="value"
        />
        <CustomSelect
          name={MR_HISTORY_RECORD_LIST_FILTER_KEYS.LOAD_BATCH_ID}
          options={removeNullAndDuplicates(dropdownsData, 'loadBatchId')}
          placeholder="Search Load Batch ID"
          {...filterInputProps(MR_HISTORY_RECORD_LIST_FILTER_KEYS.LOAD_BATCH_ID)}
          onChange={onFilterChange}
          getOptionLabel={(option) => option[MR_HISTORY_RECORD_LIST_API_KEYS.LOAD_BATCH_ID]}
          getOptionValue={(option) => option[MR_HISTORY_RECORD_LIST_API_KEYS.LOAD_BATCH_ID]}
          isSearchable
          isMulti
          maxMenuHeight={416}
          components={{
            DropdownIndicator: CustomIndicatorArrow,
            Option: CustomCheckboxOption,
          }}
          {...sharedDropdownProps}
          // custom props
          withSeparator
          withMultiSelect
        />
        <CustomSelect
          name={MR_HISTORY_RECORD_LIST_FILTER_KEYS.STATUS}
          placeholder="Select Status"
          options={statuses}
          {...filterInputProps(MR_HISTORY_RECORD_LIST_FILTER_KEYS.STATUS)}
          onChange={onFilterChange}
          isMulti
          isSearchable={false}
          components={{
            DropdownIndicator: CustomIndicatorArrow,
            Option: CustomCheckboxOption,
          }}
          {...sharedDropdownProps}
        />
      </StyledFlex>
    </StyledFlex>
  );
};

export default MrHistoryRecordListFilters;

MrHistoryRecordListFilters.propTypes = {
  onFilterChange: PropTypes.func,
  filterInputProps: PropTypes.func,
  onClearFilters: PropTypes.func,
  calendarKey: PropTypes.string,
};
