import { useFormik } from 'formik';
import { useState } from 'react';

import { sharedCalendarDropdownProps } from '../../../../Managers/TestManager/SideModals/TestManagerFilters/TestManagerFilters';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomIndicatorArrow from '../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomCheckboxOption from '../../../../shared/REDISIGNED/selectMenus/customComponents/options/CustomCheckboxOption';
import CustomSelect from '../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import CustomSidebar from '../../../../shared/REDISIGNED/sidebars/CustomSidebar/CustomSidebar';
import { StyledFlex, StyledText } from '../../../../shared/styles/styled';
import { PARAMETER_SETS_SIDE_FILTER_INITIAL_VALUES } from '../utils/constants';

const ParametersFiltersSideBar = ({
  isOpen, onClose, initialValues = {}, onApplyFilters, data,
}) => {
  const [isCalendarMenuFocused, setIsCalendarMenuFocused] = useState({
    startTime: false,
    endTime: false,
  });

  const {
    values, setFieldValue, submitForm, setValues,
  } = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: (val, meta) => {
      onApplyFilters(val);
      meta.resetForm(PARAMETER_SETS_SIDE_FILTER_INITIAL_VALUES);
    },
  });

  const handleDropdownFilterChange = (val, action) => setFieldValue(action.name, val);

  const customSelectOptionsData = (type) => {
    if (type === 'usedBy') {
      const workflows = data?.content
        ?.map((item) => item.associatedWorkflows)
        .filter((itemWorkflows) => Array.isArray(itemWorkflows))
        .flat();

      const workflowsArray = Array.from(new Set(workflows)).map((workflow) => ({
        label: workflow,
        value: workflow,
      }));

      return workflowsArray;
    }
    const envs = data?.content
      ?.map((item) => item.associatedEnvironments)
      .filter((itemEnvs) => Array.isArray(itemEnvs))
      .flat();

    const envArray = Array.from(new Set(envs)).map((env) => ({
      label: env,
      value: env,
    }));

    return envArray;
  };

  return (
    <CustomSidebar
      open={isOpen}
      onClose={onClose}
      headStyleType="filter"
      customHeaderActionTemplate={(
        <StyledButton
          width="125px"
          onClick={submitForm}
          variant="contained"
          primary
        >
          Confirm
        </StyledButton>
      )}
    >
      {() => (
        <StyledFlex flex="1 1 auto" p="24px">
          <StyledFlex direction="row" alignItems="center" justifyContent="space-between" mb="18px" w="100%">
            <StyledText size={18} weight={500}>Filter By</StyledText>
            <StyledButton
              variant="text"
              onClick={() => setValues({ usedBy: '', associatedEnvironments: '', lastUpdated: '' })}
            >
              Clear All Filters
            </StyledButton>
          </StyledFlex>
          <StyledFlex gap={2}>
            <CustomSelect
              name="usedBy"
              options={customSelectOptionsData('usedBy') || []}
              placeholder="Search Used By"
              value={values.usedBy}
              onChange={handleDropdownFilterChange}
              components={{
                DropdownIndicator: CustomIndicatorArrow,
                Option: CustomCheckboxOption,
              }}
              minHeight={40}
              menuPadding={0}
              isMulti
              isSearchable={false}
              mb={0}
            />
            <CustomSelect
              name="associatedEnvironment"
              options={customSelectOptionsData('env') || []}
              value={values.associatedEnvironments}
              onChange={handleDropdownFilterChange}
              placeholder="Search Associated Environment"
              components={{
                DropdownIndicator: CustomIndicatorArrow,
                Option: CustomCheckboxOption,
              }}
              minHeight={40}
              menuPadding={0}
              isMulti
              isSearchable={false}
              mb={0}
            />
            <CustomSelect
              name="lastUpdated"
              placeholder="Select Last Updated"
              onChange={handleDropdownFilterChange}
              value={values.lastUpdated}
              radioLabels={[
                {
                  label: 'End Time',
                  value: ['startDateBefore', 'startDateAfter'],
                  default: true,
                },
              ]}
              onMenuInputFocus={(v) => setIsCalendarMenuFocused({ startTime: false, endTime: v })}
              onBlur={() => setIsCalendarMenuFocused({ startTime: false, endTime: false })}
              {...{
                menuIsOpen: isCalendarMenuFocused.endTime || undefined,
                isFocused: isCalendarMenuFocused.endTime || undefined,
              }}
              {...sharedCalendarDropdownProps}
            />
          </StyledFlex>
        </StyledFlex>
      )}
    </CustomSidebar>
  );
};

export default ParametersFiltersSideBar;
