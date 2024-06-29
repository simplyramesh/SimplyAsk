import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getTestSuiteExecutionFilter } from '../../../../../../Services/axios/test';
import CustomDropdownIndicator from '../../../../../Settings/AccessManagement/components/dropdowns/customComponents/dropdownIndicator/CustomDropdownIndicator';
import { StyledButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import InputLabel from '../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import CenterModalFixed from '../../../../../shared/REDISIGNED/modals/CenterModalFixed/CenterModalFixed';
import CustomSelect from '../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { StyledDivider, StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import { createNewTestRunDropdownColumns } from '../../utils/formatters';
import { getUniqueSuitesAndEnv } from '../../utils/helpers';
import CustomTableMenuComponent from '../CustomTableMenuComponent/CustomTableMenuComponent';

const initialSuiteExecutions = {
  original: [],
  selected: [],
  ids: [],
  data: [],
};

const TestRunNextCreateModal = ({ selectedSuiteIds, isOpen, onOpenChange, testRunName, onBack, onCreate, onReset }) => {
  const { colors } = useTheme();

  const [suiteExecutions, setSuiteExecutions] = useState(initialSuiteExecutions);

  const envExecutionModalRef = useRef(null);

  const toggleOpen = (cb, open) => {
    if (open) return cb(open);

    return cb((prev) => !prev);
  };

  const suiteIds = {
    ...selectedSuiteIds,
    isAscending: 'false',
    pageSize: 200,
  };

  const { data: testSuiteExecutions, isSuccess: isGetFilteredTestSuitesSuccess } = useQuery({
    queryKey: ['getTestSuiteExecutionFilter', suiteIds],
    queryFn: () => getTestSuiteExecutionFilter(suiteIds),
    enabled: isOpen,
    select: (data) => {
      const convertedData = getUniqueSuitesAndEnv(data.content);

      return {
        ids: [],
        original: data.content,
        data: convertedData?.nextCreate,
        selected: convertedData?.defaultSelected,
      };
    },
    onSuccess: (data) => {
      setSuiteExecutions((prev) => ({
        ...prev,
        ids: [...prev.ids, ...data.ids],
        original: [...prev.original, ...data.original],
        data: [...prev.data, ...data.data],
        selected: [...prev.selected, ...data.selected],
      }));
    },
  });

  const handleCustomSelectChange = (selected) => {
    setSuiteExecutions((prev) => {
      const alreadySelected = prev.selected.find(
        (item) => item.testSuiteId === selected.testSuiteId && item.environment === selected.environment
      );

      const updatedSelected = alreadySelected
        ? prev.selected.map((item) =>
            item.testSuiteId === selected.testSuiteId && item.environment === selected.environment ? selected : item
          )
        : [...prev.selected, selected];

      const updatedIds = [...new Set([...prev.ids, selected.testSuiteExecutionId])].filter(
        (item) => item !== `None-${selected.environment}` && !selected.removeIds.includes(item)
      );

      return { ...prev, selected: updatedSelected, ids: updatedIds };
    });
  };

  return (
    <CenterModalFixed
      title="Select Environment Executions"
      open={isOpen}
      onClose={() => {
        onReset();
        toggleOpen(onOpenChange, false);
      }}
      maxWidth="622px"
      actions={
        <StyledFlex direction="row" justifyContent="flex-end" gap="24px" p="14px">
          <StyledButton
            primary
            variant="contained"
            type="submit"
            id="back"
            onClick={() => {
              toggleOpen(onBack);
              toggleOpen(onOpenChange);
              setSuiteExecutions(initialSuiteExecutions);
            }}
          >
            Back
          </StyledButton>
          <StyledButton
            primary
            variant="contained"
            type="submit"
            id="create"
            onClick={() => {
              // onCreate({ name: testRunName, execIds: [] });
              onCreate({ name: testRunName, execIds: suiteExecutions.ids });
              setSuiteExecutions(initialSuiteExecutions);
            }}
          >
            Create
          </StyledButton>
        </StyledFlex>
      }
      // height={604}
      modalRef={envExecutionModalRef} // prevents an occasional error - when two modals are very briefly open at the same time
    >
      <StyledFlex flex="auto" p="25px" justifyContent="space-between" height="100%">
        <StyledFlex gap="36px 0">
          {isGetFilteredTestSuitesSuccess &&
            testSuiteExecutions?.data?.map((execution) => (
              <StyledFlex key={execution.displayName}>
                <StyledText weight={600}>{execution.displayName}</StyledText>
                <StyledFlex direction="row">
                  <StyledFlex direction="row" mr="38px" ml="4px">
                    <StyledDivider orientation="vertical" color={colors.inputBorder} flexItem />
                  </StyledFlex>

                  <StyledFlex flex="auto" width="100%" gap="18px 0" mt="12px">
                    {execution?.environments?.map((env) => (
                      <StyledFlex key={`${env.environment}-${execution.displayName}`} flex="auto" width="100%">
                        <InputLabel label={env.environment} display="flex" isOptional />
                        <CustomSelect
                          name="execution"
                          placeholder="Select Execution"
                          options={env.options}
                          getOptionLabel={(option) => option.testSuiteExecutionId}
                          getOptionValue={(option) => option.testSuiteExecutionId}
                          onChange={handleCustomSelectChange}
                          value={
                            env.options.find((option) => {
                              const findSuiteExecution = suiteExecutions?.ids?.find(
                                (item) => item === option.testSuiteExecutionId
                              );

                              return option.testSuiteExecutionId === findSuiteExecution;
                            }) || ''
                          }
                          components={{
                            DropdownIndicator: CustomDropdownIndicator,
                            Menu: CustomTableMenuComponent,
                          }}
                          withSeparator
                          borderRadius="10px"
                          mb="0px"
                          padding="0px 8px 0px 2px"
                          openMenuOnClick
                          maxMenuHeight={180}
                          closeMenuOnSelect={false}
                          isClearable={false}
                          isSearchable={false}
                          hideSelectedOptions={false}
                          columns={createNewTestRunDropdownColumns}
                          labelKey="testSuiteExecutionIds"
                          valueKey="testSuiteExecutionId"
                          menuPortalTarget={document.body}
                          menuPlacement="auto"
                        />
                      </StyledFlex>
                    ))}
                  </StyledFlex>
                </StyledFlex>
              </StyledFlex>
            ))}
        </StyledFlex>
      </StyledFlex>
    </CenterModalFixed>
  );
};

export default TestRunNextCreateModal;

TestRunNextCreateModal.propTypes = {
  selectedSuiteIds: PropTypes.shape({
    testSuiteIds: PropTypes.arrayOf(PropTypes.string),
    testSuiteExecutionIds: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  }),
  isOpen: PropTypes.bool,
  onOpenChange: PropTypes.func,
  testRunName: PropTypes.string,
  onBack: PropTypes.func,
  onCreate: PropTypes.func,
  onReset: PropTypes.func,
};
