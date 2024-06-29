import CachedIcon from '@mui/icons-material/Cached';
import CloseIcon from '@mui/icons-material/Close';
import ReplayIcon from '@mui/icons-material/Replay';
import Slide from '@mui/material/Slide';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CopyIcon from '../../../../Assets/icons/copy.svg?component';
import InfoIcon from '../../../../Assets/icons/infoIcon.svg?component';
import routes from '../../../../config/routes';
import { useUser } from '../../../../contexts/UserContext';
import useGetTestCaseExecutionById from '../../../../hooks/testHistory/getTestCaseExecutionData';
import useGetTestGroupExecutionById from '../../../../hooks/testHistory/getTestGroupExecutionData';
import useGetTestSuiteExecutionById from '../../../../hooks/testHistory/getTestSuiteExecutionData';
import useCopyToClipboard from '../../../../hooks/useCopyToClipboard';
import { useFilter } from '../../../../hooks/useFilter';
import { useTableSortAndFilter } from '../../../../hooks/useTableSortAndFilter';
import { getTestCaseExecutions, getTestSuiteExecutions } from '../../../../Services/axios/test';
import { capitalizeFirstLetterOfRegion } from '../../../../utils/helperFunctions';
import { getInFormattedUserTimezone } from '../../../../utils/timeUtil';
import SidebarIcons from '../../../AppLayout/SidebarIcons/SidebarIcons';
import TestIcon from '../../../Managers/TestManager/components/TestIcon/TestIcon';
import {
  GET_TEST_CASES_TABLE_QUERY_KEY,
  GET_TEST_SUITES_TABLE_QUERY_KEY,
  TEST_ENTITY_TYPE,
  TEST_GROUP_EXECUTION_STATUS,
} from '../../../Managers/TestManager/constants/constants';
import { executionStatusWithDescription } from '../../../Managers/TestManager/constants/formatters';
import { STATUSES_COLORS } from '../../../Settings/Components/FrontOffice/constants/iconConstants';
import { StyledButton } from '../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomTableIcons from '../../../shared/REDISIGNED/icons/CustomTableIcons';
import InfoList from '../../../shared/REDISIGNED/layouts/InfoList/InfoList';
import InfoListGroup from '../../../shared/REDISIGNED/layouts/InfoList/InfoListGroup';
import InfoListItem from '../../../shared/REDISIGNED/layouts/InfoList/InfoListItem';
import ProgressStatus from '../../../shared/REDISIGNED/layouts/ProgressStatus/ProgressStatus';
import CustomIndicatorArrow from '../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomCheckboxOption from '../../../shared/REDISIGNED/selectMenus/customComponents/options/CustomCheckboxOption';
import CustomSelect from '../../../shared/REDISIGNED/selectMenus/CustomSelect';
import CustomSidebar from '../../../shared/REDISIGNED/sidebars/CustomSidebar/CustomSidebar';
import TableV2 from '../../../shared/REDISIGNED/table-v2/Table-v2';
import { StyledTooltip } from '../../../shared/REDISIGNED/tooltip/StyledTooltip';
import {
  CustomBlackAndWhiteStyledButtonSideBar,
  StyledDivider,
  StyledEmptyValue,
  StyledFlex,
  StyledText,
} from '../../../shared/styles/styled';
import { calculateDuration } from '../constants/formatters';
import {
  RoundedGreyOnHoverEffect,
  StyledTextHoverUnderline,
  TagsSideBarGreyBackgroundRounded,
} from '../StyledTestHistory';

import useGetProcessHistoryById from '../../../ProcessHistory/hooks/useGetProcessHistoryById';
import { renderCorrectExecutionNames, TEST_CASE_SIDEBAR_COLUMNS, TEST_SUITE_SIDEBAR_COLUMNS } from './sideBarFormatter';
import TestCaseSideBarBody from './TestCaseSideBarBody';
import TestSuiteSideBarBody from './TestSuiteSideBarBody';

const TestGroupSideBar = ({
  openTestGroupSideBar,
  closeTestGroupSideBar,
  testHistoryClickedTableRow,
  testManagerDetailsView = false,
  isActionPerforming,
  onCancelTestGroup,
  onReexecuteTestGroup,
}) => {
  const [copyMessage, setCopyMessage] = useState('');
  const { copyToClipboard } = useCopyToClipboard('Copy URL of Test Execution');
  const [openTestGroup, setOpenTestGroup] = useState(false);
  const [clickedTableRow, setClickedTableRow] = useState('');
  const [openSideBarTestCase, setOpenSideBarTestCase] = useState(null);
  const [testSuiteIdState, setTestSuiteIdState] = useState(null);
  const { user } = useUser();
  const { colors } = useTheme();
  const timezone = user?.timezone;
  const navigate = useNavigate();

  const testGroupExecutionIdOption = testManagerDetailsView
    ? testHistoryClickedTableRow?.testGroupExecutionId
    : testHistoryClickedTableRow?.id;

  const { testGroupExecutionData, isExecutedTestGroupLoading, refetchTestGroupExecutionData } =
    useGetTestGroupExecutionById({
      testId: testManagerDetailsView ? testHistoryClickedTableRow?.testGroupId : testHistoryClickedTableRow?.testId,
      options: {
        enabled: testManagerDetailsView
          ? testHistoryClickedTableRow?.testGroupId?.length > 0
          : testHistoryClickedTableRow?.testId?.length > 0,
        select: (data) =>
          data.content.find((item) => String(item.testGroupExecutionId) === String(testGroupExecutionIdOption)),
      },
    });

  const { testSuiteExecutionData, isTestSuiteExecutionDataLoading, refetchTestSuiteExecutionData } =
    useGetTestSuiteExecutionById({
      testSuiteExecutionId: clickedTableRow?.testSuiteExecutionId || testSuiteIdState?.testSuiteId,
      options: {
        enabled: clickedTableRow?.testSuiteExecutionId?.length > 0 || testSuiteIdState?.testSuiteId?.length > 0,
      },
    });

  const {
    testCaseExecutionData,
    isTestCaseExecutionDataLoading,
    isTestCaseExecutionDataRefetching,
    refetchExecutedTestCase,
  } = useGetTestCaseExecutionById({
    executionId: clickedTableRow?.testCaseExecutionId,
    options: {
      enabled: clickedTableRow?.testCaseExecutionId?.length > 0 || clickedTableRow?.testCaseId?.length > 0,
    },
  });

  const {
    singleProcessHistory: testCaseWorkflowData,
    isSingleProcessHistoryFetching: testCaseWorkflowDataLoading,
    refetchSingleProcessHistory: refetchTestCaseWorkflow,
  } = useGetProcessHistoryById({
    id: testCaseExecutionData?.processInstanceId,
    queryParams: {
      enabled: !!testCaseExecutionData?.processInstanceId,
    },
  });

  useEffect(() => {
    if (!isTestCaseExecutionDataRefetching && testCaseWorkflowData) {
      refetchTestCaseWorkflow();
    }
  }, [isTestCaseExecutionDataRefetching]);

  const isLoading =
    isActionPerforming ||
    testCaseWorkflowDataLoading ||
    isTestCaseExecutionDataLoading ||
    isExecutedTestGroupLoading ||
    isTestSuiteExecutionDataLoading;

  const {
    sourceFilterValue: testSuiteSourceFilterValue,
    setFilterFieldValue: testSuiteSetFilterFieldValue,
    submitFilterValue: testSuiteSubmitFilterValue,
    initialFilterValues: testSuiteInitialFilterValues,
  } = useFilter({
    formikProps: {
      initialValues: { testGroupExecutionId: '', status: [] },
    },
    onSubmit: ({ filterValue }) => {
      testSuitesSetColumnFilters(filterValue);
    },
    formatter: (values) => ({
      status: values.status?.map((item) => item.value) || [],
      testGroupExecutionId: values.testGroupExecutionId || testGroupExecutionIdOption,
    }),
    selectedFiltersMeta: {},
  });

  const {
    data: testSuitesTableData,
    pagination: testSuitesPagination,
    setPagination: testSuitesSetPagination,
    sorting: testSuitesSorting,
    setSorting: testSuitesSetSorting,
    setSearchText: testSuitesSearchText,
    isFetching: testSuitesIsFetching,
    setColumnFilters: testSuitesSetColumnFilters,
    columnFilters: testSuitesColumnFilters,
  } = useTableSortAndFilter({
    queryFn: (filter) => getTestSuiteExecutions(filter),
    queryKey: GET_TEST_SUITES_TABLE_QUERY_KEY,
    initialFilters: testSuiteInitialFilterValues,
    initialSorting: [],
    pageSize: 10,
    options: {
      enabled: !!openTestGroupSideBar,
    },
  });

  const {
    sourceFilterValue: testCaseSourceFilterValue,
    setFilterFieldValue: testCaseSetFilterFieldValue,
    submitFilterValue: testCaseSubmitFilterValue,
    initialFilterValues: testCaseInitialFilterValues,
  } = useFilter({
    formikProps: {
      initialValues: { testGroupExecutionId: '', status: [] },
    },
    onSubmit: ({ filterValue }) => {
      testCasesSetColumnFilters(filterValue);
    },
    formatter: (values) => ({
      status: values.status?.map((item) => item.value) || [],
      testGroupExecutionId: values.testGroupExecutionId || testGroupExecutionIdOption,
    }),
    selectedFiltersMeta: {},
  });

  const {
    data: testCasesTableData,
    pagination: testCasesPagination,
    setPagination: testCasesSetPagination,
    sorting: testCasesSorting,
    setSorting: testCasesSetSorting,
    setSearchText: testCasesSearchText,
    isFetching: testCasesIsFetching,
    setColumnFilters: testCasesSetColumnFilters,
    columnFilters: testCasesColumnFilters,
  } = useTableSortAndFilter({
    queryFn: (filter) => getTestCaseExecutions(filter),
    queryKey: GET_TEST_CASES_TABLE_QUERY_KEY,
    initialFilters: testCaseInitialFilterValues,
    initialSorting: [],
    pageSize: 10,
    options: {
      enabled: !!openTestGroupSideBar,
    },
  });

  useEffect(() => {
    if (testGroupExecutionIdOption) {
      testSuitesSetColumnFilters({ ...testSuitesColumnFilters, testGroupExecutionId: testGroupExecutionIdOption });
      testCasesSetColumnFilters({ ...testCasesColumnFilters, testGroupExecutionId: testGroupExecutionIdOption });
    }
  }, [testHistoryClickedTableRow]);

  const getUniqueExecutionStatusOptions = (tableData) => {
    const content = tableData?.content || [];

    const uniqueStatuses = Array.from(new Set(content.map((item) => item.status || item.testCaseExecutionStatus)));

    const resultArray = uniqueStatuses.map((status) => ({
      label: renderCorrectExecutionNames(status).name,
      value: status,
      color: renderCorrectExecutionNames(status).color,
    }));

    return resultArray;
  };

  const renderShowStatusActions = (tableData, filterValue, setFilterFieldValue, submitFilterValue) => (
    <StyledFlex ml="10px" minWidth="209px" mb="0px" mt="20px">
      <CustomSelect
        placeholder="Select Status"
        options={getUniqueExecutionStatusOptions(tableData)}
        value={filterValue.status}
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
    if (testGroupExecutionData?.status === TEST_GROUP_EXECUTION_STATUS.FAILED) {
      return (
        <>
          <InfoListItem name="Execution Status" alignItems="start">
            {executionStatusWithDescription('Failed', STATUSES_COLORS.RED, 'Failed To Execute')}
          </InfoListItem>
          <InfoListItem name="Execution Summary" alignItems="center">
            {testGroupExecutionData?.executionSummary}
          </InfoListItem>
        </>
      );
    }
    if (testGroupExecutionData?.status === TEST_GROUP_EXECUTION_STATUS.STOPPED) {
      return (
        <InfoListItem name="Execution Status" alignItems="start">
          {executionStatusWithDescription('Stopped', STATUSES_COLORS.CHARCOAL, 'Canceled Before Finished Executing')}
        </InfoListItem>
      );
    }
    const filterReadingsByValueGreaterThanZero = (executionMap) => {
      const readings = [
        { name: 'Passed', value: executionMap?.DONE || 0 },
        { name: 'Failed', value: executionMap?.FAILED || 0 },
        { name: 'Canceled', value: executionMap?.STOPPED || 0 },
        { name: 'Executing', value: executionMap?.EXECUTING || 0 },
        { name: 'Preparing', value: executionMap?.PREPARING || 0 },
      ];

      const filteredReadings = readings.filter((reading) => reading.value > 0);

      return filteredReadings;
    };

    return (
      <>
        <StyledFlex p="15px 15px">
          <StyledText weight={600} size={16} mb={4}>
            Execution Status
          </StyledText>
          <ProgressStatus
            readings={filterReadingsByValueGreaterThanZero(testGroupExecutionData?.executionMap)}
            status={capitalizeFirstLetterOfRegion(testGroupExecutionData?.status)}
            showLegend="column"
            executionType="Test Suites"
            showPercentExecuted={false}
          />
        </StyledFlex>
        <StyledDivider borderWidth={1} color={colors.dividerColor} />
      </>
    );
  };

  const renderSideBarHeaderName = () => {
    if (clickedTableRow?.testCaseExecutionId && !testSuiteIdState?.testSuiteId) {
      return (
        <StyledFlex direction="row" alignItems="center" gap="10px">
          <StyledTextHoverUnderline
            wordBreak="break-all"
            cursor="pointer"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            maxLines={1}
            maxWidth="225px"
            onClick={() => {
              setClickedTableRow(null);
              setTestSuiteIdState(null);
              setOpenTestGroup(false);
            }}
          >
            {testGroupExecutionData?.displayName}
          </StyledTextHoverUnderline>{' '}
          /{' '}
          <StyledText flex="1" maxLines={1}>
            {clickedTableRow?.displayName}
          </StyledText>
        </StyledFlex>
      );
    }
    if (clickedTableRow?.testCaseExecutionId && testSuiteIdState?.testSuiteId) {
      return (
        <StyledFlex direction="row" alignItems="center" gap="10px">
          <StyledTextHoverUnderline
            wordBreak="break-all"
            cursor="pointer"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            maxLines={1}
            maxWidth="150px"
            onClick={() => {
              setClickedTableRow(null);
              setTestSuiteIdState(null);
              setOpenTestGroup(false);
            }}
          >
            {testGroupExecutionData?.displayName}
          </StyledTextHoverUnderline>{' '}
          /{' '}
          <StyledTextHoverUnderline
            wordBreak="break-all"
            cursor="pointer"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            maxLines={1}
            maxWidth="200px"
            onClick={() => {
              setClickedTableRow(null);
              setOpenSideBarTestCase(false);
              refetchTestSuiteExecutionData();
            }}
          >
            {testSuiteIdState?.displayName}
          </StyledTextHoverUnderline>{' '}
          /{' '}
          <StyledText flex="1" maxLines={1}>
            {clickedTableRow?.displayName || testSuiteIdState?.displayName}
          </StyledText>
        </StyledFlex>
      );
    }
    if (clickedTableRow?.testSuiteExecutionId || testSuiteIdState?.testSuiteId) {
      return (
        <StyledFlex direction="row" alignItems="center" gap="10px">
          <StyledTextHoverUnderline
            wordBreak="break-all"
            cursor="pointer"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            maxLines={1}
            maxWidth="225px"
            onClick={() => {
              setClickedTableRow(null);
              setTestSuiteIdState(null);
              setOpenTestGroup(false);
            }}
          >
            {testGroupExecutionData?.displayName}
          </StyledTextHoverUnderline>{' '}
          /{' '}
          <StyledText flex="1" maxLines={1}>
            {clickedTableRow?.displayName || testSuiteIdState?.displayName}
          </StyledText>
        </StyledFlex>
      );
    }
    return <StyledText maxLines={1}>{testGroupExecutionData?.displayName}</StyledText>;
  };

  const renderCorrectBackButton = () => {
    if (clickedTableRow?.testCaseExecutionId && !testSuiteIdState?.testSuiteId) {
      return (
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
              width="320px"
              p="5px 10px"
              onClick={() => {
                setClickedTableRow(null);
                setTestSuiteIdState(null);
                setOpenTestGroup(false);
              }}
            >
              <SidebarIcons icon="BACK" width="38px" />
              <StyledText as="span" weight={600} size={16} pt="10px">
                Go Back to Test Group Details
              </StyledText>
            </RoundedGreyOnHoverEffect>
          </StyledFlex>
          <StyledDivider borderWidth={2} color={colors.dividerColor} />
        </div>
      );
    }
    if (!clickedTableRow?.testCaseId?.length > 0) {
      return (
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
              width="320px"
              p="5px 10px"
              onClick={() => {
                setClickedTableRow(null);
                setTestSuiteIdState(null);
                setOpenTestGroup(false);
              }}
            >
              <SidebarIcons icon="BACK" width="38px" />
              <StyledText as="span" weight={600} size={16} pt="10px">
                Go Back to Test Group Details
              </StyledText>
            </RoundedGreyOnHoverEffect>
          </StyledFlex>
          <StyledDivider borderWidth={2} color={colors.dividerColor} />
        </div>
      );
    }
    return (
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
            width="320px"
            p="5px 10px"
            onClick={() => {
              setClickedTableRow(null);
              setOpenSideBarTestCase(false);
              refetchTestSuiteExecutionData();
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
    );
  };

  const handleRefresh = () => {
    if (clickedTableRow?.testCaseExecutionId) {
      refetchExecutedTestCase();
    } else if (clickedTableRow?.testSuiteExecutionId || testSuiteIdState?.testSuiteId) {
      refetchTestSuiteExecutionData();
    } else {
      refetchTestGroupExecutionData();
    }
  };

  return (
    <CustomSidebar
      open={!!openTestGroupSideBar}
      isLoading={isLoading}
      onClose={() => {
        closeTestGroupSideBar();
      }}
      headBackgroundColor={colors.stormyGrey}
      headerTemplate={
        <StyledFlex gap="10px">
          <StyledFlex direction="row" alignItems="center" gap="10px">
            <StyledText>#{testGroupExecutionData?.testGroupExecutionId}</StyledText>
            <StyledDivider orientation="vertical" borderWidth={2} color={colors.cardGridItemBorder} height="14px" />
            {renderSideBarHeaderName()}
          </StyledFlex>
        </StyledFlex>
      }
      customHeaderActionTemplate={
        <StyledFlex direction="row" alignItems="center" gap="15px">
          {testGroupExecutionData?.status === 'PREPARING' ||
          testGroupExecutionData?.status === 'EXECUTING' ||
          testGroupExecutionData?.status === 'FINALIZING' ? (
            <>
              <CustomBlackAndWhiteStyledButtonSideBar
                startIcon={<ReplayIcon sx={{ transform: 'scaleX(-1)' }} />}
                onClick={handleRefresh}
              >
                Refresh
              </CustomBlackAndWhiteStyledButtonSideBar>

              <StyledButton
                danger
                variant="contained"
                disabled={isExecutedTestGroupLoading}
                startIcon={<CloseIcon width={34} />}
                onClick={onCancelTestGroup}
              >
                Cancel Test Group
              </StyledButton>
            </>
          ) : (
            <>
              <CustomBlackAndWhiteStyledButtonSideBar
                startIcon={<CustomTableIcons icon="BIN" width={24} />}
                disabled={isExecutedTestGroupLoading}
              >
                Delete
              </CustomBlackAndWhiteStyledButtonSideBar>

              <StyledButton
                primary
                variant="contained"
                onClick={onReexecuteTestGroup}
                startIcon={<CachedIcon width={34} />}
              >
                Re-Execute Test Group
              </StyledButton>
            </>
          )}
          <StyledTooltip title={copyMessage} arrow placement="top" p="10px 15px" maxWidth="auto">
            <StyledFlex
              as="span"
              width="38px"
              height="38px"
              padding="8px 8px 8px 10px"
              cursor="pointer"
              borderRadius="7px"
              backgroundColor={colors.graySilver}
              onClick={() => {
                copyToClipboard(`${window.location.href}`);
                setCopyMessage('Copied!');
              }}
              onMouseLeave={() => setCopyMessage('Copy URL of Test Execution')}
            >
              <CopyIcon />
            </StyledFlex>
          </StyledTooltip>
        </StyledFlex>
      }
    >
      {!openTestGroup
        ? () => (
            <>
              <InfoList p="30px">
                <InfoListGroup title={testGroupExecutionData?.displayName} noPaddings>
                  <StyledFlex width="225px" mb={4}>
                    <StyledTooltip
                      title="View the Test Group in the Test Manager"
                      placement="bottom"
                      p="10px 10px"
                      maxWidth="auto"
                    >
                      <StyledButton
                        variant="contained"
                        tertiary
                        onClick={() => {
                          const testGroupId = testGroupExecutionData?.testGroupId;
                          navigate(routes.TEST_GROUP_DETAILS.replace(':groupId', testGroupId));
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
                      <TestIcon entityType={TEST_ENTITY_TYPE.GROUP} />
                      <StyledText>Test Group</StyledText>
                    </StyledFlex>
                  </InfoListItem>

                  <InfoListItem name="Total Test Cases" alignItems="center">
                    {testGroupExecutionData?.testCaseExecutionsTotal}
                  </InfoListItem>

                  {renderExecutionStatus()}

                  <InfoListItem name="Environment" alignItems="center">
                    {testGroupExecutionData?.environment}
                  </InfoListItem>
                  <InfoListItem name="Start Time" alignItems="center">
                    {testGroupExecutionData?.startTime ? (
                      getInFormattedUserTimezone(testGroupExecutionData.startTime, timezone)
                    ) : (
                      <StyledEmptyValue />
                    )}
                  </InfoListItem>
                  <InfoListItem name="End Time" alignItems="center">
                    {testGroupExecutionData?.endTime
                      ? getInFormattedUserTimezone(testGroupExecutionData.endTime, timezone)
                      : 'To Be Determined (Preparing)'}
                  </InfoListItem>
                  <InfoListItem name="Duration" alignItems="center">
                    {testGroupExecutionData?.startTime && testGroupExecutionData?.endTime ? (
                      calculateDuration(testGroupExecutionData.startTime, testGroupExecutionData.endTime)
                    ) : (
                      <StyledEmptyValue />
                    )}
                  </InfoListItem>
                </InfoListGroup>
                <StyledDivider borderWidth={1} color={colors.dividerColor} />
                <StyledFlex flexDirection="row" p="15px 15px" gap="10px">
                  <StyledText weight={600} size={16}>
                    Related Test Group Tags
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
                  {testGroupExecutionData?.tags?.length > 0 ? (
                    testGroupExecutionData?.tags?.map((tag, idx) => (
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
                  Test Suites
                </StyledText>
              </StyledFlex>
              <StyledFlex maxHeight="1500px">


                <TableV2
                  data={testSuitesTableData}
                  columns={TEST_SUITE_SIDEBAR_COLUMNS}
                  searchPlaceholder="Search Test Case Names..."
                  pagination={testSuitesPagination}
                  setPagination={testSuitesSetPagination}
                  sorting={testSuitesSorting}
                  setSorting={testSuitesSetSorting}
                  onSearch={(e) => testSuitesSearchText(e.target.value)}
                  selectBarActions={[
                    {
                      text: `${testSuiteSourceFilterValue.status.length} Applied Filters`,
                    },
                    {
                      icon: <CloseIcon width={20} />,
                    },
                    {
                      icon: <CachedIcon width={20} />,
                    },
                  ]}
                  entityName="Records"
                  emptyTableDescription="There are currently no test suites linked to this test group."
                  enablePageSizeChange={false}
                  enableShowFiltersButton={false}
                  headerActions={renderShowStatusActions(
                    testSuitesTableData,
                    testSuiteSourceFilterValue,
                    testSuiteSetFilterFieldValue,
                    testSuiteSubmitFilterValue
                  )}
                  meta={{
                    user,
                    onTableRowClick: (row) => {
                      setClickedTableRow(row);
                      setTestSuiteIdState(row);
                      setOpenTestGroup(true);
                    },
                  }}
                  isLoading={testSuitesIsFetching}
                ></TableV2>
              </StyledFlex>

              <StyledFlex mt={4} mb={4}>
                <StyledDivider borderWidth={2} color={colors.cardGridItemBorder} />
              </StyledFlex>

              <StyledFlex p="0 40px">
                <StyledText weight={600} size={20}>
                  Test Cases
                </StyledText>
              </StyledFlex>

              <StyledFlex maxHeight="1500px">
                <TableV2
                  data={testCasesTableData}
                  columns={TEST_CASE_SIDEBAR_COLUMNS}
                  searchPlaceholder="Search Test Case Names..."
                  pagination={testCasesPagination}
                  setPagination={testCasesSetPagination}
                  sorting={testCasesSorting}
                  setSorting={testCasesSetSorting}
                  onSearch={(e) => testCasesSearchText(e.target.value)}
                  selectBarActions={[
                    {
                      text: `${testCaseSourceFilterValue.status.length} Applied Filters`,
                    },
                    {
                      icon: <CloseIcon width={20} />,
                    },
                    {
                      icon: <CachedIcon width={20} />,
                    },
                  ]}
                  entityName="Records"
                  emptyTableDescription="There are currently no test cases linked to this test group"
                  enablePageSizeChange={false}
                  enableShowFiltersButton={false}
                  headerActions={renderShowStatusActions(
                    testCasesTableData,
                    testCaseSourceFilterValue,
                    testCaseSetFilterFieldValue,
                    testCaseSubmitFilterValue
                  )}
                  tableProps={{
                    muiTableContainerProps: {
                      sx: () => ({
                        maxHeight: '1500px',
                      }),
                    },
                  }}
                  meta={{
                    user,
                    onTableRowClick: (row) => {
                      setClickedTableRow(row);
                      setOpenTestGroup(true);
                    },
                  }}
                  isLoading={testCasesIsFetching}
                ></TableV2>
              </StyledFlex>
            </>
          )
        : () => (
            <Slide direction="left" in={openTestGroup} mountOnEnter unmountOnExit timeout={{ enter: 500, exit: 500 }}>
              <StyledFlex>
                {renderCorrectBackButton()}
                {clickedTableRow?.testCaseId?.length > 0 ? (
                  <TestCaseSideBarBody
                    testCaseExecution={testCaseExecutionData}
                    workflowExecution={testCaseWorkflowData}
                    colors={colors}
                    isLoading={isLoading}
                    fromTestSuite
                  />
                ) : (
                  <TestSuiteSideBarBody
                    openTestCase={openSideBarTestCase}
                    setOpenTestCase={setOpenSideBarTestCase}
                    testSuiteExecutionData={testSuiteExecutionData}
                    testCaseExecutionData={testCaseExecutionData}
                    testCaseWorkflowData={testCaseWorkflowData}
                    colors={colors}
                    isLoading={isLoading}
                    setClickedTableRow={setClickedTableRow}
                    openTestSuiteSidebar={testSuiteIdState?.testSuiteId?.length > 0}
                    testHistoryClickedTableRow={testSuiteIdState?.testSuiteExecutionId}
                    fromTestGroup
                  />
                )}
              </StyledFlex>
            </Slide>
          )}
    </CustomSidebar>
  );
};

export default TestGroupSideBar;
