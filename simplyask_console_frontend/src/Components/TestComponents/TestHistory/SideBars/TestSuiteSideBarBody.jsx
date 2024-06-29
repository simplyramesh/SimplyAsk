import CachedIcon from '@mui/icons-material/Cached';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import InfoIcon from '../../../../Assets/icons/infoIcon.svg?component';
import routes from '../../../../config/routes';
import { useUser } from '../../../../contexts/UserContext';
import { useFilter } from '../../../../hooks/useFilter';
import { useTableSortAndFilter } from '../../../../hooks/useTableSortAndFilter';
import { getTestCaseExecutions } from '../../../../Services/axios/test';
import { capitalizeFirstLetterOfRegion } from '../../../../utils/helperFunctions';
import { getInFormattedUserTimezone } from '../../../../utils/timeUtil';
import SidebarIcons from '../../../AppLayout/SidebarIcons/SidebarIcons';
import TestIcon from '../../../Managers/TestManager/components/TestIcon/TestIcon';
import {
  GET_TEST_SUITES_TABLE_QUERY_KEY,
  TEST_ENTITY_TYPE,
  TEST_SUITE_EXECUTION_STATUS,
} from '../../../Managers/TestManager/constants/constants';
import { executionStatusWithDescription } from '../../../Managers/TestManager/constants/formatters';
import { STATUSES_COLORS } from '../../../Settings/Components/FrontOffice/constants/iconConstants';
import { StyledButton } from '../../../shared/REDISIGNED/controls/Button/StyledButton';
import InfoList from '../../../shared/REDISIGNED/layouts/InfoList/InfoList';
import InfoListGroup from '../../../shared/REDISIGNED/layouts/InfoList/InfoListGroup';
import InfoListItem from '../../../shared/REDISIGNED/layouts/InfoList/InfoListItem';
import ProgressStatus from '../../../shared/REDISIGNED/layouts/ProgressStatus/ProgressStatus';
import CustomIndicatorArrow from '../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomCheckboxOption from '../../../shared/REDISIGNED/selectMenus/customComponents/options/CustomCheckboxOption';
import CustomSelect from '../../../shared/REDISIGNED/selectMenus/CustomSelect';
import TableV2 from '../../../shared/REDISIGNED/table-v2/Table-v2';
import { StyledTooltip } from '../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { StyledDivider, StyledEmptyValue, StyledFlex, StyledText } from '../../../shared/styles/styled';
import { calculateDuration } from '../constants/formatters';
import { RoundedGreyOnHoverEffect, TagsSideBarGreyBackgroundRounded } from '../StyledTestHistory';

import { renderCorrectExecutionNames, TEST_CASE_SIDEBAR_COLUMNS } from './sideBarFormatter';
import TestCaseSideBarBody from './TestCaseSideBarBody';

const TestSuiteSideBarBody = ({
  openTestCase,
  setOpenTestCase,
  testSuiteExecutionData,
  colors,
  setClickedTableRow,
  openTestSuiteSidebar,
  testHistoryClickedTableRow,
  testCaseExecutionData,
  testCaseWorkflowData,
  isLoading,
  fromTestGroup = false,
  testManagerDetailsView = false,
}) => {
  const { user } = useUser();
  const timezone = user?.timezone;
  const navigate = useNavigate();

  const renderCorrectId = () => {
    if (testManagerDetailsView) {
      return testHistoryClickedTableRow?.testSuiteExecutionId || '';
    }
    if (fromTestGroup) {
      return testHistoryClickedTableRow || '';
    }
    return testHistoryClickedTableRow?.id || '';
  };

  const { sourceFilterValue, setFilterFieldValue, submitFilterValue, initialFilterValues } = useFilter({
    formikProps: {
      initialValues: { testSuiteExecutionId: '', status: [] },
    },
    onSubmit: ({ filterValue }) => {
      setColumnFilters(filterValue);
    },
    formatter: (values) => ({
      status: values.status?.map((item) => item.value) || [],
      testSuiteExecutionId: renderCorrectId(),
    }),
    selectedFiltersMeta: {},
  });

  const {
    data,
    pagination,
    setPagination,
    sorting,
    setSorting,
    setSearchText,
    isFetching,
    setColumnFilters,
    columnFilters,
  } = useTableSortAndFilter({
    queryFn: (filter) => getTestCaseExecutions(filter),
    queryKey: GET_TEST_SUITES_TABLE_QUERY_KEY,
    initialFilters: initialFilterValues,
    initialSorting: [],
    options: {
      enabled: !!openTestSuiteSidebar,
    },
  });

  useEffect(() => {
    setColumnFilters({
      ...columnFilters,
      testSuiteExecutionId: renderCorrectId(),
    });
  }, [testHistoryClickedTableRow]);

  const getUniqueExecutionStatusOptions = (tableData) => {
    const content = tableData?.content || [];

    const uniqueStatuses = Array.from(new Set(content.map((item) => item.testCaseExecutionStatus)));

    const resultArray = uniqueStatuses.map((status) => ({
      label: renderCorrectExecutionNames(status).name,
      value: status,
      color: renderCorrectExecutionNames(status).color,
    }));

    return resultArray;
  };

  const renderShowTestCaseStatusActions = () => (
    <StyledFlex ml="10px" minWidth="209px" mb="0px" mt="20px">
      <CustomSelect
        placeholder="Select Status"
        options={getUniqueExecutionStatusOptions(data)}
        value={sourceFilterValue.status}
        closeMenuOnScroll={false}
        onChange={(val) => {
          setFilterFieldValue('status', val);
          submitFilterValue();
        }}
        components={{
          DropdownIndicator: CustomIndicatorArrow,
          Option: CustomCheckboxOption,
        }}
        openMenuOnClick
        hideSelectedOptions={false}
        isSearchable={false}
        isClearable
        isMulti
        maxHeight={32}
        menuPadding={0}
        form={false}
        menuPlacement="auto"
        minMenuWidth="120px"
      />
    </StyledFlex>
  );
  const renderExecutionStatus = () => {
    if (testSuiteExecutionData?.testSuiteExecutionStatus === TEST_SUITE_EXECUTION_STATUS.FAILED) {
      return (
        <>
          <InfoListItem name="Execution Status" alignItems="start">
            {executionStatusWithDescription('Failed', STATUSES_COLORS.RED, 'Failed To Execute')}
          </InfoListItem>
          <InfoListItem name="Execution Summary" alignItems="center">
            {testSuiteExecutionData?.executionSummary}
          </InfoListItem>
        </>
      );
    }
    if (testSuiteExecutionData?.testSuiteExecutionStatus === TEST_SUITE_EXECUTION_STATUS.STOPPED) {
      return (
        <InfoListItem name="Execution Status" alignItems="start">
          {executionStatusWithDescription('Stopped', STATUSES_COLORS.CHARCOAL, 'Canceled Before Finished Executing')}
        </InfoListItem>
      );
    }
    return (
      <>
        <StyledFlex p="15px 15px">
          <StyledText weight={600} size={16} mb={4}>
            Execution Status
          </StyledText>
          <ProgressStatus
            readings={[
              { name: 'Passed', value: testSuiteExecutionData?.testCasePass || 0 },
              { name: 'Failed', value: testSuiteExecutionData?.testCaseFail || 0 },
              { name: 'Canceled', value: testSuiteExecutionData?.testCaseStopped || 0 },
              { name: 'Executing', value: testSuiteExecutionData?.testCaseInProgress || 0 },
              { name: 'Preparing', value: testSuiteExecutionData?.testCaseActive || 0 },
            ]}
            status={capitalizeFirstLetterOfRegion(testSuiteExecutionData?.testSuiteExecutionStatus)}
            showLegend="column"
            executionType="Test Suites"
            showPercentExecuted={false}
          />
        </StyledFlex>
        <StyledDivider borderWidth={1} color={colors.dividerColor} />
      </>
    );
  };

  const handleTableRowClick = (row) => {
    const matchingExecutedTestCase = testSuiteExecutionData?.testCaseExecutions?.find(
      (executedTestCase) => executedTestCase.testCaseExecutionId === row.testCaseExecutionId
    );

    if (matchingExecutedTestCase) {
      setClickedTableRow({ ...row, testCaseId: matchingExecutedTestCase.testCaseId });
    }
  };

  return (
    <>
      {!openTestCase ? (
        <>
          <InfoList p="30px">
            <InfoListGroup
              title={fromTestGroup ? testSuiteExecutionData?.displayName : testHistoryClickedTableRow?.executionName}
              padding="0 -14px"
              noPaddings
            >
              <StyledFlex width="225px" mb={4}>
                <StyledTooltip
                  title="View the Test Suite in the Test Manager"
                  placement="bottom"
                  p="10px 10px"
                  maxWidth="auto"
                >
                  <StyledButton
                    variant="contained"
                    tertiary
                    onClick={() => {
                      const testSuiteId = testSuiteExecutionData?.testSuiteId;
                      navigate(routes.TEST_SUITE_DETAILS.replace(':suiteId', testSuiteId));
                    }}
                  >
                    View in Test Manager
                  </StyledButton>
                </StyledTooltip>
              </StyledFlex>

              <StyledText ml={10} weight={600} size={20} mb={10}>
                Details
              </StyledText>

              <InfoListItem name="Type" alignItems="center">
                <StyledFlex flexDirection="row" gap="5px">
                  <TestIcon entityType={TEST_ENTITY_TYPE.SUITE} />
                  <StyledText>Test Suite</StyledText>
                </StyledFlex>
              </InfoListItem>

              <InfoListItem name="Total Test Cases" alignItems="center">
                {testSuiteExecutionData?.testCaseExecutionsTotal}
              </InfoListItem>

              {renderExecutionStatus()}

              <InfoListItem name="Environment" alignItems="center">
                {testSuiteExecutionData?.environment}
              </InfoListItem>
              <InfoListItem name="Start Time" alignItems="center">
                {testSuiteExecutionData?.startTime ? (
                  getInFormattedUserTimezone(testSuiteExecutionData.startTime, timezone)
                ) : (
                  <StyledEmptyValue />
                )}
              </InfoListItem>
              <InfoListItem name="End Time" alignItems="center">
                {testSuiteExecutionData?.endTime
                  ? getInFormattedUserTimezone(testSuiteExecutionData.endTime, timezone)
                  : 'To Be Determined (Preparing)'}
              </InfoListItem>
              <InfoListItem name="Duration" alignItems="center">
                {testSuiteExecutionData?.startTime && testSuiteExecutionData?.endTime ? (
                  calculateDuration(testSuiteExecutionData.startTime, testSuiteExecutionData.endTime)
                ) : (
                  <StyledEmptyValue />
                )}
              </InfoListItem>
            </InfoListGroup>
            <StyledDivider borderWidth={1} color={colors.dividerColor} />
            <StyledFlex flexDirection="row" p="15px 15px" gap="10px">
              <StyledText weight={600} size={16}>
                Related Test Suite Tags
              </StyledText>
              <StyledTooltip
                title="Tags for this execution are exported from the Test Manager, and they cannot be edited or removed."
                arrow
                placement="bottom"
                p="10px 10px"
                maxWidth="auto"
              >
                <InfoIcon width={18} />
              </StyledTooltip>
            </StyledFlex>
            <StyledFlex flexDirection="row" flexWrap="wrap" p="10px 15px" gap="10px">
              {testSuiteExecutionData?.tags?.length > 0 ? (
                testSuiteExecutionData?.tags?.map((tag, idx) => (
                  <TagsSideBarGreyBackgroundRounded key={idx}>{tag.name}</TagsSideBarGreyBackgroundRounded>
                ))
              ) : (
                <StyledEmptyValue />
              )}
            </StyledFlex>

            <StyledFlex mt={4}>
              <StyledDivider borderWidth={2} color={colors.cardGridItemBorder} />
            </StyledFlex>
          </InfoList>

          <StyledFlex p="0 40px">
            <StyledText weight={600} size={20}>
              Test Cases
            </StyledText>
          </StyledFlex>

          <TableV2
            data={data}
            columns={TEST_CASE_SIDEBAR_COLUMNS}
            searchPlaceholder="Search Test Case Names..."
            pagination={pagination}
            setPagination={setPagination}
            sorting={sorting}
            setSorting={setSorting}
            onSearch={(e) => setSearchText(e.target.value)}
            selectBarActions={[
              {
                text: `${sourceFilterValue.status.length} Applied Filters`,
              },
              {
                icon: <CloseIcon width={20} />,
              },
              {
                icon: <CachedIcon width={20} />,
              },
            ]}
            entityName="Records"
            emptyTableDescription="There are currently no records. Create your first record by clicking on the 'Create' button in the top right"
            enablePageSizeChange={false}
            enableShowFiltersButton={false}
            headerActions={renderShowTestCaseStatusActions()}
            meta={{
              user,
              onTableRowClick: (row) => {
                handleTableRowClick(row);
                setOpenTestCase(true);
              },
            }}
            isLoading={isFetching}
          ></TableV2>
        </>
      ) : (
        <Slide direction="left" in={openTestCase} mountOnEnter unmountOnExit timeout={{ enter: 500, exit: 500 }}>
          <StyledFlex>
            <div
              style={{
                position: 'sticky',
                top: '0',
                zIndex: '100000',
                background: 'white',
              }}
            >
              <StyledFlex p="10px 20px">
                <RoundedGreyOnHoverEffect
                  flexDirection="row"
                  alignItems="center"
                  width="300px"
                  p="5px 10px"
                  onClick={() => {
                    setClickedTableRow(null);
                    setOpenTestCase(false);
                  }}
                >
                  <SidebarIcons icon="BACK" width="38px" />
                  <StyledText as="span" weight={600} size={16} pt="10px">
                    Go Back to Test Suite Details
                  </StyledText>
                </RoundedGreyOnHoverEffect>
              </StyledFlex>
              <StyledDivider borderWidth={2} color={colors.dividerColor} />
            </div>
            <TestCaseSideBarBody
              isLoading={isLoading}
              testCaseExecution={testCaseExecutionData}
              workflowExecution={testCaseWorkflowData}
              colors={colors}
              fromTestSuite
            />
          </StyledFlex>
        </Slide>
      )}
    </>
  );
};
export default TestSuiteSideBarBody;
