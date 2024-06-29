import { useFormik } from 'formik';
import { Portal } from 'react-portal';
import { useQuery } from '@tanstack/react-query';

import { getAllAgents } from '../../../../../../../../Services/axios/conversationHistoryAxios';
import { StyledButton } from '../../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomIndicatorArrow from '../../../../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomCalendarMenu from '../../../../../../../shared/REDISIGNED/selectMenus/customComponents/menus/CustomCalendarMenu';
import CustomCheckboxOption from '../../../../../../../shared/REDISIGNED/selectMenus/customComponents/options/CustomCheckboxOption';
import CustomSelect from '../../../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import Spinner from '../../../../../../../shared/Spinner/Spinner';
import { StyledFlex, StyledText } from '../../../../../../../shared/styles/styled';
import CustomCalendarIndicator from '../../../../../../AccessManagement/components/dropdowns/customComponents/calendarIndicator/CustomCalendarIndicator';
import { WIDGETS_QUERY_KEYS } from '../../../../constants/common';

const sharedDropdownProps = {
  minMenuHeight: 150,
  maxMenuHeight: 550,
  closeMenuOnSelect: false,
  hideSelectedOptions: false,
  isClearable: false,
  openMenuOnClick: true,
};

const ChatWidgetFilters = ({ customActionsRef, initialValues = {}, onApplyFilters = () => {} }) => {
  const { values, setFieldValue, submitForm, setValues } = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: (val, meta) => {
      onApplyFilters(val);
      meta.resetForm(initialValues);
    },
  });

  const { data: getAllAgentsOption, isFetching } = useQuery({
    queryKey: [WIDGETS_QUERY_KEYS.GET_ALL_AGENTS_FOR_WIDGETS],
    queryFn: () => getAllAgents('pageSize=999'),
    select: (res) => {
      const content = res?.content || [];
      const format = content.map((item) => ({
        label: item.name,
        value: item.agentId,
      }));

      return format;
    },
  });

  const handleDropdownFilterChange = (val, action) => setFieldValue(action.name, val);

  if (isFetching) return <Spinner fadeBgParent medium />;

  return (
    <StyledFlex flex="1 1 auto" p="0 24px 24px 24px">
      <StyledFlex direction="row" alignItems="center" justifyContent="space-between" mb="18px" w="100%">
        <StyledText size={18} weight={500}>
          Filter By
        </StyledText>
        <StyledButton variant="text" onClick={() => setValues({ createdDate: '', updatedDate: '', agents: [] })}>
          Clear All Filters
        </StyledButton>
      </StyledFlex>
      <StyledFlex>
        <CustomSelect
          name="updatedDate"
          value={values.updatedDate}
          onChange={handleDropdownFilterChange}
          placeholder="Last Updated"
          components={{
            DropdownIndicator: CustomCalendarIndicator,
            Menu: CustomCalendarMenu,
          }}
          isSearchable={false}
          {...sharedDropdownProps}
          // custom props
          radioLabels={[
            {
              label: 'Last Updated',
              value: ['updatedBefore', 'updatedAfter'],
              default: true,
            },
          ]}
          showDateFilterType={false}
        />
        <CustomSelect
          name="createdDate"
          value={values.createdDate}
          onChange={handleDropdownFilterChange}
          placeholder="Created On"
          components={{
            DropdownIndicator: CustomCalendarIndicator,
            Menu: CustomCalendarMenu,
          }}
          isSearchable={false}
          {...sharedDropdownProps}
          // custom props
          radioLabels={[
            {
              label: 'Created On',
              value: ['createdBefore', 'createdAfter'],
              default: true,
            },
          ]}
          showDateFilterType={false}
        />
        <CustomSelect
          name="agents"
          options={getAllAgentsOption ?? []}
          value={values.agents}
          onChange={handleDropdownFilterChange}
          placeholder="Select Assigned Agents"
          components={{
            DropdownIndicator: CustomIndicatorArrow,
            Option: CustomCheckboxOption,
          }}
          isSearchable
          isMulti
          {...sharedDropdownProps}
        />
      </StyledFlex>
      <Portal node={customActionsRef?.current}>
        <StyledButton width="125px" onClick={submitForm} variant="contained" primary>
          Confirm
        </StyledButton>
      </Portal>
    </StyledFlex>
  );
};

export default ChatWidgetFilters;
