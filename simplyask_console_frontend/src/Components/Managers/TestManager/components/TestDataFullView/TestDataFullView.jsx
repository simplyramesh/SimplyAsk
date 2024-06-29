import AddIcon from '@mui/icons-material/Add';
import InventoryIcon from '@mui/icons-material/Inventory';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import StarRounded from '@mui/icons-material/StarRounded';
import { useTheme } from '@mui/material';
import FileDownload from 'js-file-download';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSetRecoilState } from 'recoil';
import CopyIcon from '../../../../../Assets/icons/copy.svg?component';
import { duplicateTestCase, getTestGenericType } from '../../../../../Services/axios/test';
import routes from '../../../../../config/routes';
import useCopyToClipboard from '../../../../../hooks/useCopyToClipboard';
import { useGetCurrentUser } from '../../../../../hooks/useGetCurrentUser';
import { usePopoverToggle } from '../../../../../hooks/usePopoverToggle';
import { modifiedCurrentPageDetails } from '../../../../../store';
import {
  BASE_DATE_TIME_FORMAT,
  ISO_UTC_DATE_AND_TIME_FORMAT,
  formatLocalTime,
  getInFormattedUserTimezone,
} from '../../../../../utils/timeUtil';
import EditValueTrigger from '../../../../Issues/components/shared/EditValueTrigger/EditValueTrigger';
import EditableRichDescription from '../../../../Issues/components/shared/EditableRichDescription/EditableRichDescription';
import { StyledQuestionsMarkHover } from '../../../../ProcessTrigger/Components/ProcessTrigger/ProcessTriggerProcess/StyledProcessTriggerExecuteProcess';
import LoadingMessage from '../../../../Sell/shared/LoadingMessage';
import NoOptionsMessage from '../../../../Sell/shared/NoOptionsMessage';
import BaseTextInput from '../../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';
import { StyledButton, StyledExpandButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import TagsInput from '../../../../shared/REDISIGNED/controls/TagsInput/TagsInput';
import { RichTextEditor } from '../../../../shared/REDISIGNED/controls/lexical/RichTextEditor';
import ContentLayout from '../../../../shared/REDISIGNED/layouts/ContentLayout/ContentLayout';
import InfoListGroup from '../../../../shared/REDISIGNED/layouts/InfoList/InfoListGroup';
import {
  StyledInfoListItem,
  StyledInfoListItemKey,
  StyledInfoListItemValue,
} from '../../../../shared/REDISIGNED/layouts/InfoList/StyledInfoList';
import PageLayout from '../../../../shared/REDISIGNED/layouts/PageLayout/PageLayout';
import { useModalToggle } from '../../../../shared/REDISIGNED/modals/CenterModalFixed/hooks/useModalToggle';
import CustomSelect from '../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import CustomIndicatorArrow from '../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import EmptyTable from '../../../../shared/REDISIGNED/table-v2/EmptyTable/EmptyTable';
import { StyledTooltip } from '../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import Spinner from '../../../../shared/Spinner/Spinner';
import {
  StyledDivider,
  StyledEmptyValue,
  StyledFlex,
  StyledIconButton,
  StyledResizeHandle,
  StyledStatus,
  StyledText,
} from '../../../../shared/styles/styled';
import { MANAGERS_IMPORT_JSON_FORMAT } from '../../../shared/constants/common';
import {
  EXECUTION_FRAMEWORK_OPTIONS,
  TEST_DATA_FULL_VIEW_CONSTANTS,
  TEST_ENTITY_TYPE,
  TEST_MANAGER_LABELS,
  TEST_MANAGER_MODAL_TYPE,
} from '../../constants/constants';
import useDuplicateTest from '../../hooks/useDuplicateTest';
import useExportTest from '../../hooks/useExportTest';
import { useGetFilteredTestData } from '../../hooks/useGetFilteredTestData';
import useGetSuiteLinkages from '../../hooks/useGetSuiteLinkages';
import { GET_TEST_CASE_QUERY_KEY, useGetTestCase } from '../../hooks/useGetTestCase';
import { GET_TEST_CASE_EXECUTIONS_QUERY_KEY } from '../../hooks/useGetTestCaseExecutions';
import useGetTestCaseLinkages from '../../hooks/useGetTestCaseLinkages';
import { GET_TEST_GROUP_QUERY_KEY, useGetTestGroup } from '../../hooks/useGetTestGroup';
import { GET_TEST_GROUP_EXECUTIONS_QUERY_KEY } from '../../hooks/useGetTestGroupExecutions';
import useGetTestGroupLinkages from '../../hooks/useGetTestGroupLinkages';
import { GET_TEST_SUITE_QUERY_KEY, useGetTestSuite } from '../../hooks/useGetTestSuite';
import { GET_TEST_SUITE_EXECUTIONS_QUERY_KEY } from '../../hooks/useGetTestSuiteExecutions';
import { usePerformTestAction } from '../../hooks/usePerformTestAction';
import { useUpdateTestCase } from '../../hooks/useUpdateTestCase';
import { useUpdateTestGroup } from '../../hooks/useUpdateTestGroup';
import { useUpdateTestSuite } from '../../hooks/useUpdateTestSuite';
import TestDeleteModal from '../../modals/TestDeleteModal';
import TestExecuteModal from '../../modals/TestExecuteModal';
import ButtonGroupCancelAndAssign from '../../modals/TestManagerCreateModal/ButtonGroupCancelAndAssign';
import { CreateTestModal } from '../../modals/TestManagerCreateModal/TestManagerCreateModal';
import TestTypeOption from '../../modals/TestManagerCreateModal/TestTypeOption';
import { getPayloadPropKeyByTestType } from '../../utils/helpers';
import LinkedTestEntities from '../LinkedTestEntities/LinkedTestEntities';
import RecentExecutions from '../RecentExecutions/RecentExecutions';
import TestIcon from '../TestIcon/TestIcon';
import TestDataFullViewMoreActionsButton from './TestDataFullViewMoreActionsButton';

const TestDataFullView = () => {
  const { currentUser } = useGetCurrentUser();
  const setCurrentPageDetailsState = useSetRecoilState(modifiedCurrentPageDetails);

  const location = useLocation();
  const navigate = useNavigate();

  const DEBOUNCE_TIMEOUT = 300;

  const { copyToClipboard } = useCopyToClipboard();
  const { colors, boxShadows } = useTheme();

  const getTestDataTypeFromUrl = (pathname) => {
    const path = pathname.split('/');

    if (path.includes('case')) {
      return TEST_ENTITY_TYPE.CASE;
    }
    if (path.includes('suite')) {
      return TEST_ENTITY_TYPE.SUITE;
    }
    if (path.includes('group')) {
      return TEST_ENTITY_TYPE.GROUP;
    }

    return null;
  };

  const testEntityType = getTestDataTypeFromUrl(location.pathname);
  const dataId = location.pathname.split('/').pop();

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  const [openModal, setOpenModal] = useState(null);
  const [addChildSearchEnabled, setAddChildSearchEnabled] = useState(false);
  const [addParentSearchEnabled, setAddParentSearchEnabled] = useState(false);
  const [copyMessage, setCopyMessage] = useState(`Copy URL of ${TEST_MANAGER_LABELS[testEntityType]}`);
  const [displayNameInputText, setDisplayNameInputText] = useState('');
  const [isEditTags, setIsEditTags] = useState(false);
  const [testEntityTags, setTestEntityTags] = useState([]);

  const [addChildEntity, setAddChildEntity] = useState(null);
  const [addParentEntity, setAddParentEntity] = useState(null);

  const convertTimeStampToIso = (timestamp) => formatLocalTime(timestamp, ISO_UTC_DATE_AND_TIME_FORMAT);

  const getExecutionQueryKey = (type) => {
    if (type === TEST_ENTITY_TYPE.CASE) {
      return GET_TEST_CASE_EXECUTIONS_QUERY_KEY;
    }
    if (type === TEST_ENTITY_TYPE.SUITE) {
      return GET_TEST_SUITE_EXECUTIONS_QUERY_KEY;
    }
    if (type === TEST_ENTITY_TYPE.GROUP) {
      return GET_TEST_GROUP_EXECUTIONS_QUERY_KEY;
    }
  };

  const getTestDataQueryKey = (type) => {
    if (type === TEST_ENTITY_TYPE.CASE) {
      return GET_TEST_CASE_QUERY_KEY;
    }
    if (type === TEST_ENTITY_TYPE.SUITE) {
      return GET_TEST_SUITE_QUERY_KEY;
    }
    if (type === TEST_ENTITY_TYPE.GROUP) {
      return GET_TEST_GROUP_QUERY_KEY;
    }
  };

  const {
    anchorEl: moreActionsBtnAnchorEl,
    handleClick: onMoreActionsBtnOpen,
    handleClose: onMoreActionsBtnClose,
  } = usePopoverToggle('more-actions-popover', false);

  const { testCase, isFetching: isTestCaseFetching } = useGetTestCase({
    payload: { id: dataId },
    enabled: testEntityType === TEST_ENTITY_TYPE.CASE,
  });

  const { testSuite, isFetching: isTestSuiteFetching } = useGetTestSuite({
    payload: { id: dataId },
    options: {
      enabled: testEntityType === TEST_ENTITY_TYPE.SUITE,
      select: (res) => res?.content?.[0] || null,
    },
  });

  const { testGroup, isFetching: isTestGroupFetching } = useGetTestGroup({
    payload: { id: dataId },
    options: {
      enabled: testEntityType === TEST_ENTITY_TYPE.GROUP,
    },
  });

  const { open: isCreateTestCaseModalOpen, setOpen: setIsCreateTestCaseModalOpen } = useModalToggle();

  const { duplicateTestEntity } = useDuplicateTest({
    mutationFn: (values) => duplicateTestCase(values),
    onSuccess: () => {
      toast.success('Duplicated test case');
    },
    onError: () => {
      toast.error('Failed to duplicate test case');
    },
  });

  const { filteredTestData: allTestCasesOptions, isFilteredTestDataLoading: allTestCasesOptionsLoading } =
    useGetFilteredTestData({
      params: {
        types: TEST_ENTITY_TYPE.CASE,
        pageSize: 10000,
      },
      select: (res) => res.content,
      gcTime: Infinity,
      staleTime: Infinity,
      enabled: !!isCreateTestCaseModalOpen && testEntityType === TEST_ENTITY_TYPE.CASE,
    });

  const { exportTest, isExportTestLoading } = useExportTest({
    onSuccess: (data) => {
      const jsonString = JSON.stringify({
        ...data,
        processType: testCase.processType,
      });
      const blob = new Blob([jsonString], { type: MANAGERS_IMPORT_JSON_FORMAT.FILE_TYPE });

      FileDownload(blob, `${data.attributes.displayName}-test-exported.json`);

      toast.info('Downloading file. This may take a while, please wait…');
    },
    onError: () => {
      toast.error('Something went wrong!');
    },
  });

  const handleDuplicate = () => {
    setIsCreateTestCaseModalOpen(true);
    onMoreActionsBtnClose();
  };

  const handleExport = () => {
    onMoreActionsBtnClose();

    exportTest({ id: dataId });
  };

  const [duplicateTestData, setDuplicateTestData] = useState(null);

  useEffect(() => {
    if (!isTestCaseFetching && testCase) {
      setDuplicateTestData({ ...testCase, tags: testCase.tags.map((tag) => tag.name) });
    }
  }, [testCase, isTestCaseFetching]);

  const handleDuplicateSubmitFn = async (callbackFunc, values) => {
    await callbackFunc(values);
    setIsCreateTestCaseModalOpen(false);
  };

  const {
    unassignTestSuites: unassignTestSuitesFromCase,
    unassignTestGroups: unassignTestGroupsFromCase,
    assignTestGroups: assignTestGroupsToCase,
    assignTestSuites: assignTestSuitesToCase,
    updateDescription: updateCaseDescription,
    updateDisplayName: updateCaseDisplayName,
    updateTags: updateCaseTags,
  } = useUpdateTestCase({
    onSuccess: () => {
      setAddParentEntity(null);
    },
  });

  const {
    unassignTestCases: unassignTestCasesFromSuite,
    unassignTestGroups: unassignTestGroupFromSuite,
    assignTestGroups: assignTestGroupsToSuite,
    assignTestCases: addTestCasesToSuite,
    updateDescription: updateSuiteDescription,
    updateDisplayName: updateSuiteDisplayName,
    updateTags: updateSuiteTags,
  } = useUpdateTestSuite({
    onSuccess: () => {
      setAddChildEntity(null);
      setAddParentEntity(null);
    },
  });

  const {
    unassignTestSuites: unassignTestSuitesFromGroup,
    unassignTestCases: unassignTestCasesFromGroup,
    assignTestSuites: assignTestSuitesToGroup,
    assignTestCases: assignTestCasesToGroup,
    updateDescription: updateGroupDescription,
    updateDisplayName: updateGroupDisplayName,
    updateTags: updateGroupTags,
  } = useUpdateTestGroup({
    onSuccess: () => {
      setAddChildEntity(null);
    },
  });

  const {
    performExecute,
    performArchive,
    performUnarchive,
    performFavourite,
    performDelete,
    performUnfavourite,
    isActionPeforming,
  } = usePerformTestAction({
    invalidateQueries: [getExecutionQueryKey(testEntityType), getTestDataQueryKey(testEntityType)],
    onSuccess: () => (openModal === TEST_MANAGER_MODAL_TYPE.DELETE ? navigate(routes.TEST_MANAGER) : null),
  });

  const { testSuitesLinkages } = useGetSuiteLinkages({
    options: { enabled: testEntityType !== TEST_ENTITY_TYPE.SUITE },
  });

  const { testCaseLinkages } = useGetTestCaseLinkages({
    options: { enabled: testEntityType !== TEST_ENTITY_TYPE.CASE },
  });

  const { testGroupLinkages } = useGetTestGroupLinkages({
    options: { enabled: testEntityType !== TEST_ENTITY_TYPE.GROUP },
  });

  const getTestEntityUrlPath = (caseData, suiteData, groupData) => {
    if (caseData) return { path: routes.TEST_CASE_DETAILS, id: caseData.testCaseId, name: caseData.displayName };

    return suiteData
      ? { path: routes.TEST_SUITE_DETAILS, id: suiteData.testSuiteId, name: suiteData.displayName }
      : { path: routes.TEST_GROUP_DETAILS, id: groupData.testGroupId, name: groupData.displayName };
  };

  useEffect(() => {
    if (testCase || testSuite || testGroup) {
      const currentTestTypePageDetails = getTestEntityUrlPath(testCase, testSuite, testGroup);

      setCurrentPageDetailsState({
        pageUrlPath: currentTestTypePageDetails.path,
        breadCrumbLabel: currentTestTypePageDetails.id,
        pageName: currentTestTypePageDetails.name,
      });

      const tags = testCase?.tags || testSuite?.tags || testGroup?.tags || [];

      setTestEntityTags(tags.map((tag) => ({ value: tag.name, label: tag.name })));
    }
  }, [testCase, testSuite, testGroup]);

  const suitesAndGroupsLinkages = [...(testSuitesLinkages || []), ...(testGroupLinkages || [])];
  const casesAndSuitesLinkages = [...(testCaseLinkages || []), ...(testSuitesLinkages || [])];

  const testEntity = testCase || testSuite || testGroup;

  const testEntityId = testCase?.testCaseId || testSuite?.testSuiteId || testGroup?.testGroupId;
  const testEntityName = testEntity?.displayName;
  const testEntityDescription = testEntity?.description;
  const testEntityCreatedAt = testEntity?.createdAt;
  const testEntityUpdatedAt = testCase?.lastEditedAt || testEntity?.updatedAt;
  const testEntityIsFavourite = testCase?.isFavourited || testEntity?.isFavourite;
  const testEntityIsArchived = testEntity?.isArchived;

  const favouriteTooltipText = testEntityIsFavourite ? 'Unfavourite' : 'Favourite';
  const archiveTooltipText = testEntityIsArchived ? 'Unarchive' : 'Archive';

  const favouriteFn = testEntityIsFavourite ? performUnfavourite : performFavourite;
  const archiveFn = testEntityIsArchived ? performUnarchive : performArchive;
  const unassignTestCasesFn =
    testEntityType === TEST_ENTITY_TYPE.SUITE ? unassignTestCasesFromSuite : unassignTestCasesFromGroup;
  const unassignTestGroupsFn =
    testEntityType === TEST_ENTITY_TYPE.SUITE ? unassignTestGroupFromSuite : unassignTestGroupsFromCase;

  useEffect(() => {
    if (testEntityName !== undefined) {
      setDisplayNameInputText(testEntityName);
    }
  }, [testEntityName]);

  const getAssignCaseOrSuiteFn = () => {
    if (testEntityType === TEST_ENTITY_TYPE.SUITE) {
      return addTestCasesToSuite;
    }
    return addChildEntity.genericTestType === TEST_ENTITY_TYPE.CASE ? assignTestCasesToGroup : assignTestSuitesToGroup;
  };

  const getAssignSuiteOrGroupFn = () => {
    if (testEntityType === TEST_ENTITY_TYPE.SUITE) {
      return assignTestGroupsToSuite;
    }
    return addParentEntity.genericTestType === TEST_ENTITY_TYPE.SUITE ? assignTestSuitesToCase : assignTestGroupsToCase;
  };

  const getUpdateDescriptionFn = (type = TEST_DATA_FULL_VIEW_CONSTANTS.NAME) => {
    if (testEntityType === TEST_ENTITY_TYPE.CASE) {
      return type === TEST_DATA_FULL_VIEW_CONSTANTS.NAME ? updateCaseDisplayName : updateCaseDescription;
    }
    if (testEntityType === TEST_ENTITY_TYPE.SUITE) {
      return type === TEST_DATA_FULL_VIEW_CONSTANTS.NAME ? updateSuiteDisplayName : updateSuiteDescription;
    }
    if (testEntityType === TEST_ENTITY_TYPE.GROUP) {
      return type === TEST_DATA_FULL_VIEW_CONSTANTS.NAME ? updateGroupDisplayName : updateGroupDescription;
    }
  };

  const getUpdateTagsFn = () => {
    if (testEntityType === TEST_ENTITY_TYPE.CASE) {
      return updateCaseTags;
    }
    if (testEntityType === TEST_ENTITY_TYPE.SUITE) {
      return updateSuiteTags;
    }
    if (testEntityType === TEST_ENTITY_TYPE.GROUP) {
      return updateGroupTags;
    }
  };

  const isFetching =
    isTestCaseFetching || isTestSuiteFetching || isTestGroupFetching || isActionPeforming || isExportTestLoading;

  const getActionPayload = () => ({ [getPayloadPropKeyByTestType(testEntityType)]: [testEntityId] });

  const getTestCaseUrl = () => {
    if (!testCase) return;

    return `${routes.TEST_EDITOR}/${testCase.testCaseId}`;
  };

  const isContainsRelationShown = (type = TEST_DATA_FULL_VIEW_CONSTANTS.IS_NOT_BTN) => {
    if (testEntityType === TEST_ENTITY_TYPE.SUITE) {
      return testSuite?.testCases?.length > 0;
    }
    if (testEntityType === TEST_ENTITY_TYPE.GROUP) {
      return testGroup?.testSuites?.length > 0 || testGroup?.testCases?.length > 0;
    }
    return type === TEST_DATA_FULL_VIEW_CONSTANTS.IS_BTN;
  };

  const isAssignedRelationShown = () => {
    if (testEntityType === TEST_ENTITY_TYPE.CASE) {
      return testCase?.testSuites?.length > 0 || testCase?.testGroups?.length > 0;
    }
    if (testEntityType === TEST_ENTITY_TYPE.SUITE) {
      return testSuite?.testGroups?.length > 0;
    }
    return false;
  };

  const onFavourite = () => {
    const payload = getActionPayload();

    favouriteFn(payload);
  };

  const onArchive = () => {
    const payload = getActionPayload();

    archiveFn(payload);
  };

  const onExecute = (queryParams) => {
    const payload = getActionPayload();

    performExecute(payload, queryParams);
  };

  const onDelete = () => {
    const payload = getActionPayload();

    performDelete(payload);
  };

  const testCaseOnLoad = debounce((inputValue, setOptions) => {
    getTestGenericType(TEST_ENTITY_TYPE.CASE, inputValue).then(setOptions);
  }, DEBOUNCE_TIMEOUT);

  const testGroupsOnLoad = debounce((inputValue, setOptions) => {
    getTestGenericType(TEST_ENTITY_TYPE.GROUP, inputValue).then(setOptions);
  }, DEBOUNCE_TIMEOUT);

  const testSuitesAndGroupsOnLoad = debounce((inputValue, setOptions) => {
    Promise.all([
      getTestGenericType(TEST_ENTITY_TYPE.SUITE, inputValue),
      getTestGenericType(TEST_ENTITY_TYPE.GROUP, inputValue),
    ]).then(([suites, groups]) => setOptions([...suites, ...groups]));
  }, DEBOUNCE_TIMEOUT);

  const testCasesAndSuitesOnLoad = debounce((inputValue, setOptions) => {
    Promise.all([
      getTestGenericType(TEST_ENTITY_TYPE.CASE, inputValue),
      getTestGenericType(TEST_ENTITY_TYPE.SUITE, inputValue),
    ]).then(([cases, suites]) => setOptions([...cases, ...suites]));
  }, DEBOUNCE_TIMEOUT);

  const testType = EXECUTION_FRAMEWORK_OPTIONS.find((type) => type.value === testCase?.processType)?.label;

  const CopyButton = () => (
    <StyledTooltip title={copyMessage} arrow placement="bottom" p="10px 15px" maxWidth="auto">
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
        onMouseLeave={() => setCopyMessage(`Copy URL of ${TEST_MANAGER_LABELS[testEntityType]}`)}
      >
        <CopyIcon />
      </StyledFlex>
    </StyledTooltip>
  );

  const getExecuteButtonTooltipText = () => {
    if (!isContainsRelationShown(TEST_DATA_FULL_VIEW_CONSTANTS.IS_BTN))
      return 'Cannot Execute a Test Suite with No Test Cases in It';

    if (testEntityIsArchived) return 'Cannot Execute an Archived Case';

    return '';
  };

  const ExecuteButton = () => (
    <StyledTooltip title={getExecuteButtonTooltipText()} arrow placement="top" p="10px 15px" maxWidth="auto">
      <StyledFlex>
        <StyledButton
          variant="contained"
          tertiary
          onClick={() => setOpenModal(TEST_MANAGER_MODAL_TYPE.EXECUTE)}
          disabled={testEntityIsArchived || !isContainsRelationShown(TEST_DATA_FULL_VIEW_CONSTANTS.IS_BTN)}
          startIcon={<PlayCircleOutlinedIcon width={18} />}
          endIcon={
            isContainsRelationShown(TEST_DATA_FULL_VIEW_CONSTANTS.IS_BTN) ? null : (
              <StyledQuestionsMarkHover width={18} />
            )
          }
        >
          Execute
        </StyledButton>
      </StyledFlex>
    </StyledTooltip>
  );

  const TestEntitySearchSelect = (props) => (
    <CustomSelect
      isAsync
      placeholder="Search Items..."
      closeMenuOnSelect
      closeMenuOnScroll
      components={{
        DropdownIndicator: CustomIndicatorArrow,
        Option: TestTypeOption,
        LoadingMessage,
        NoOptionsMessage,
      }}
      getOptionLabel={(option) => option?.displayName}
      getOptionValue={(option) => option?.testGenericId}
      isSearchable
      maxHeight={30}
      menuPadding={0}
      form
      menuPlacement="auto"
      withSeparator
      menuPortalTarget={document.body}
      {...props}
    />
  );

  return (
    <PageLayout>
      <ContentLayout fullHeight noPadding>
        {isFetching && <Spinner inline parent fadeBgParent />}
        <PanelGroup autoSaveId="test-data-view" direction="horizontal">
          <Panel defaultSize={75}>
            <StyledFlex backgroundColor={colors.white} height="100%" boxShadow={boxShadows.box}>
              <Scrollbars id="test-data-view-main">
                <StyledFlex p="30px" gap="16px">
                  <StyledFlex direction="row" justifyContent="space-between">
                    <StyledFlex direction="row" alignItems="center" gap={1.5}>
                      <TestIcon entityType={testEntityType} />
                      <StyledText>#{testEntityId}</StyledText>
                    </StyledFlex>

                    <StyledFlex direction="row" gap="16px">
                      <StyledTooltip title={favouriteTooltipText} placement="top" arrow>
                        <StyledIconButton
                          iconColor={testEntityIsFavourite ? colors.starYellow : colors.primary}
                          bgColor="transparent"
                          hoverBgColor={colors.tableEditableCellBg}
                          iconSize="28px"
                          onClick={onFavourite}
                        >
                          {testEntityIsFavourite ? <StarRounded /> : <StarBorderRoundedIcon />}
                        </StyledIconButton>
                      </StyledTooltip>

                      <StyledTooltip title={archiveTooltipText} placement="top" arrow>
                        <StyledIconButton
                          iconColor={testEntityIsArchived ? colors.archiveGray : colors.primary}
                          bgColor="transparent"
                          hoverBgColor="transparent"
                          iconSize="24px"
                          onClick={onArchive}
                        >
                          {testEntityIsArchived ? <InventoryIcon /> : <Inventory2OutlinedIcon />}
                        </StyledIconButton>
                      </StyledTooltip>
                    </StyledFlex>
                  </StyledFlex>
                  <EditValueTrigger
                    minHeight={0}
                    bgTopBotOffset={14}
                    justifyContent="flex-start"
                    editableComponent={(setEditing, key) => (
                      <>
                        <BaseTextInput
                          key={key}
                          placeholder="Type your message here..."
                          value={displayNameInputText}
                          onChange={(event) => setDisplayNameInputText(event.target.value)}
                        />
                        <StyledFlex direction="row" justifyContent="flex-end" marginLeft="10px" gap={1.5}>
                          <StyledButton variant="contained" tertiary disableRipple onClick={() => setEditing(false)}>
                            Cancel
                          </StyledButton>
                          <StyledButton
                            variant="contained"
                            secondary
                            disableRipple
                            onClick={async () => {
                              setEditing(false);
                              getUpdateDescriptionFn(TEST_DATA_FULL_VIEW_CONSTANTS.NAME)(
                                testEntityId,
                                displayNameInputText
                              );
                            }}
                          >
                            Save
                          </StyledButton>
                        </StyledFlex>
                      </>
                    )}
                  >
                    {displayNameInputText ? (
                      <StyledText weight="600" size="24" lh="29">
                        {displayNameInputText}
                      </StyledText>
                    ) : null}
                  </EditValueTrigger>
                </StyledFlex>

                <StyledDivider orientation="horizontal" height="2px" />

                <StyledFlex p="30px 30px 0" mb="-30px">
                  <StyledFlex mb={7}>
                    <StyledText mb={16} weight="600">
                      Description
                    </StyledText>
                    <StyledText>
                      <EditValueTrigger
                        minHeight={0}
                        bgTopBotOffset={14}
                        justifyContent="flex-start"
                        editableComponent={(setEditing, key) => (
                          <EditableRichDescription
                            placeholder="Add description..."
                            description={testEntityDescription}
                            key={`${key}-${testEntityUpdatedAt}`}
                            onCancel={() => setEditing(false)}
                            onSave={async (description) => {
                              setEditing(false);
                              getUpdateDescriptionFn(TEST_DATA_FULL_VIEW_CONSTANTS.DESC)(testEntityId, description);
                            }}
                          />
                        )}
                      >
                        {testEntityDescription ? (
                          <RichTextEditor
                            key={testEntityUpdatedAt}
                            readOnly
                            minHeight={0}
                            editorState={testEntityDescription}
                          />
                        ) : (
                          'No description'
                        )}
                      </EditValueTrigger>
                    </StyledText>
                  </StyledFlex>
                </StyledFlex>

                {testEntityType !== TEST_ENTITY_TYPE.CASE && (
                  <StyledFlex gap="16px" p="30px" mb={2}>
                    <StyledFlex direction="row" alignItems="center" justifyContent="space-between">
                      <StyledText weight={600} size={16} lh={21}>
                        Contains:
                      </StyledText>
                      <StyledButton
                        variant="text"
                        onClick={() => setAddChildSearchEnabled(true)}
                        startIcon={<AddIcon />}
                      >
                        Add
                      </StyledButton>
                    </StyledFlex>
                    {addChildSearchEnabled && (
                      <StyledFlex>
                        <TestEntitySearchSelect
                          loadOptions={
                            testEntityType === TEST_ENTITY_TYPE.GROUP ? testCasesAndSuitesOnLoad : testCaseOnLoad
                          }
                          defaultOptions={
                            testEntityType === TEST_ENTITY_TYPE.GROUP ? casesAndSuitesLinkages : testCaseLinkages
                          }
                          value={addChildEntity}
                          onChange={setAddChildEntity}
                        />

                        <ButtonGroupCancelAndAssign
                          cancelTestType={() => {
                            setAddChildSearchEnabled(false);
                            setAddChildEntity(null);
                          }}
                          disableAssignButton={!addChildEntity}
                          assignTestType={() => getAssignCaseOrSuiteFn()(testEntityId, [addChildEntity.testGenericId])}
                        />
                      </StyledFlex>
                    )}
                    {isContainsRelationShown() ? (
                      <StyledFlex gap="16px">
                        <LinkedTestEntities
                          entities={testGroup?.testSuites}
                          type={TEST_ENTITY_TYPE.SUITE}
                          onUnlink={unassignTestSuitesFromGroup}
                          testEntityId={testEntityId}
                        />

                        <LinkedTestEntities
                          entities={testSuite?.testCases || testGroup?.testCases}
                          type={TEST_ENTITY_TYPE.CASE}
                          onUnlink={unassignTestCasesFn}
                          testEntityId={testEntityId}
                        />
                      </StyledFlex>
                    ) : (
                      <EmptyTable
                        hideTitle
                        message={
                          testEntityType === TEST_ENTITY_TYPE.SUITE
                            ? 'There Are No Test Cases in This Test Suite'
                            : 'There Are No Test Suites or Test Cases in This Test Group'
                        }
                      />
                    )}
                  </StyledFlex>
                )}

                <StyledFlex p="30px">
                  <StyledFlex justifyContent="space-between" direction="row" mb={2}>
                    <StyledText weight="600" size="16" lh="19.5">
                      Recent Executions
                    </StyledText>
                    <StyledButton
                      variant="contained"
                      tertiary
                      onClick={() => navigate(routes.TEST_HISTORY, { state: { testEntityId } })}
                    >
                      View In Test History
                    </StyledButton>
                  </StyledFlex>
                  {testEntityId && <RecentExecutions id={testEntityId} type={testEntityType} />}
                </StyledFlex>
              </Scrollbars>
            </StyledFlex>
          </Panel>
          <StyledResizeHandle>
            <StyledExpandButton onClick={() => setIsSidePanelOpen((prev) => !prev)}>
              {isSidePanelOpen ? <KeyboardArrowRightRoundedIcon /> : <KeyboardArrowLeftRoundedIcon />}
            </StyledExpandButton>
          </StyledResizeHandle>
          {isSidePanelOpen && (
            <Panel defaultSize={25} minSize={25} maxSize={40}>
              <StyledFlex boxShadow={boxShadows.box} height="100%" position="relative" backgroundColor={colors.white}>
                <Scrollbars id="test-data-view-panel">
                  <StyledFlex p="36px 24px">
                    {testEntityType === TEST_ENTITY_TYPE.CASE ? (
                      <>
                        <StyledFlex direction="row" justifyContent="flex-end" gap="8px" mb={2}>
                          <CopyButton />
                          <StyledTooltip title="Actions" arrow placement="bottom" p="10px 15px" maxWidth="auto">
                            <StyledFlex
                              as="span"
                              width="38px"
                              height="38px"
                              padding="1px 1px 1px 2px"
                              cursor="pointer"
                              borderRadius="7px"
                              backgroundColor={colors.graySilver}
                              onClick={onMoreActionsBtnOpen}
                            >
                              <MoreHorizIcon fontSize="large" />
                            </StyledFlex>
                          </StyledTooltip>
                        </StyledFlex>

                        <StyledFlex direction="row" justifyContent="flex-end" gap="8px" mb="24px">
                          <StyledButton variant="contained" tertiary onClick={() => navigate(getTestCaseUrl())}>
                            Open in Test Editor
                          </StyledButton>

                          <ExecuteButton />
                        </StyledFlex>
                      </>
                    ) : (
                      <StyledFlex direction="row" justifyContent="flex-end" alignItems="flex-start" gap="8px" mb="24px">
                        <ExecuteButton />

                        <StyledFlex direction="row" justifyContent="flex-end" gap="8px" mb={2}>
                          <CopyButton />
                          <StyledTooltip title="Actions" arrow placement="bottom" p="10px 15px" maxWidth="auto">
                            <StyledFlex
                              as="span"
                              width="38px"
                              height="38px"
                              padding="1px 1px 1px 2px"
                              cursor="pointer"
                              borderRadius="7px"
                              backgroundColor={colors.graySilver}
                              onClick={onMoreActionsBtnOpen}
                            >
                              <MoreHorizIcon fontSize="large" />
                            </StyledFlex>
                          </StyledTooltip>
                        </StyledFlex>
                      </StyledFlex>
                    )}

                    <InfoListGroup title="Details">
                      {testEntityType !== TEST_ENTITY_TYPE.GROUP && (
                        <StyledFlex gap="16px" p="0 14px" mb={2}>
                          <StyledFlex direction="row" alignItems="center" justifyContent="space-between">
                            <StyledText weight={600} size={16} lh={21}>
                              Assigned To:
                            </StyledText>
                            <StyledButton
                              variant="text"
                              onClick={() => setAddParentSearchEnabled(true)}
                              startIcon={<AddIcon />}
                            >
                              Assign to {testEntityType === TEST_ENTITY_TYPE.SUITE ? 'Groups' : 'Groups / Suites'}
                            </StyledButton>
                          </StyledFlex>

                          {addParentSearchEnabled && (
                            <StyledFlex>
                              <TestEntitySearchSelect
                                loadOptions={
                                  testEntityType === TEST_ENTITY_TYPE.SUITE
                                    ? testGroupsOnLoad
                                    : testSuitesAndGroupsOnLoad
                                }
                                defaultOptions={
                                  testEntityType === TEST_ENTITY_TYPE.SUITE
                                    ? testGroupLinkages
                                    : suitesAndGroupsLinkages
                                }
                                value={addParentEntity}
                                onChange={setAddParentEntity}
                              />

                              <ButtonGroupCancelAndAssign
                                cancelTestType={() => {
                                  setAddParentSearchEnabled(false);
                                  setAddParentEntity(null);
                                }}
                                disableAssignButton={!addParentEntity}
                                assignTestType={() =>
                                  getAssignSuiteOrGroupFn()(testEntityId, [addParentEntity.testGenericId])
                                }
                              />
                            </StyledFlex>
                          )}

                          {isAssignedRelationShown() ? (
                            <StyledFlex gap="16px">
                              <LinkedTestEntities
                                entities={testCase?.testSuites}
                                type={TEST_ENTITY_TYPE.SUITE}
                                onUnlink={unassignTestSuitesFromCase}
                                testEntityId={testEntityId}
                              />

                              <LinkedTestEntities
                                entities={testCase?.testGroups || testSuite?.testGroups}
                                type={TEST_ENTITY_TYPE.GROUP}
                                onUnlink={unassignTestGroupsFn}
                                testEntityId={testEntityId}
                              />
                            </StyledFlex>
                          ) : (
                            <EmptyTable
                              hideTitle
                              compact
                              message={
                                testEntityType === TEST_ENTITY_TYPE.SUITE
                                  ? 'The Test Suite Is Not Assign to Any Groups'
                                  : 'The Test Case Is Not Assign to Any Suites or Groups'
                              }
                            />
                          )}
                        </StyledFlex>
                      )}

                      {testEntityType === TEST_ENTITY_TYPE.CASE && (
                        <StyledInfoListItem>
                          <StyledInfoListItemKey>Type</StyledInfoListItemKey>
                          <StyledInfoListItemValue>{testType || <StyledEmptyValue />}</StyledInfoListItemValue>
                        </StyledInfoListItem>
                      )}
                      <StyledInfoListItem>
                        <StyledInfoListItemKey>Last Edited</StyledInfoListItemKey>
                        <StyledInfoListItemValue>
                          {getInFormattedUserTimezone(
                            convertTimeStampToIso(testEntityUpdatedAt),
                            currentUser?.timezone,
                            BASE_DATE_TIME_FORMAT
                          ) || <StyledEmptyValue />}
                        </StyledInfoListItemValue>
                      </StyledInfoListItem>

                      <StyledInfoListItem>
                        <StyledInfoListItemKey>Created On</StyledInfoListItemKey>
                        <StyledInfoListItemValue>
                          {getInFormattedUserTimezone(
                            convertTimeStampToIso(testEntityCreatedAt),
                            currentUser?.timezone,
                            BASE_DATE_TIME_FORMAT
                          ) || <StyledEmptyValue />}
                        </StyledInfoListItemValue>
                      </StyledInfoListItem>
                    </InfoListGroup>

                    <StyledDivider orientation="horizontal" height="2px" m="0 -24px" />

                    <StyledFlex p="36px 0">
                      <StyledFlex direction="row" justifyContent="space-between" mb={2}>
                        <StyledText size={16} lh={24} weight={600}>
                          Tags
                        </StyledText>
                        {isEditTags ? (
                          <StyledButton
                            variant="text"
                            onClick={() => {
                              setIsEditTags(false);
                              getUpdateTagsFn()(
                                testEntityId,
                                testEntityTags.map((tag) => ({ name: tag.value }))
                              );
                            }}
                          >
                            Done
                          </StyledButton>
                        ) : (
                          <StyledButton variant="text" onClick={() => setIsEditTags(true)}>
                            Manage Tags
                          </StyledButton>
                        )}
                      </StyledFlex>
                      {isEditTags ? (
                        <TagsInput
                          value={testEntityTags}
                          onCreateOption={(tag) => setTestEntityTags((prev) => [...prev, { value: tag, label: tag }])}
                          onChange={(e) => setTestEntityTags(e)}
                          placeholder="Create Tags..."
                        />
                      ) : (
                        <>
                          {!testEntityTags.length && <EmptyTable compact customTitle="There Are No Tags" />}
                          <StyledFlex direction="row" gap={1.5} flexWrap="wrap">
                            {testEntityTags.map((tag) => (
                              <StyledStatus key={tag.value} bgColor={colors.athensGray} height="36px" minWidth="0">
                                <StyledText ellipsis size={13} weight={400} lh={18}>
                                  {tag.label}
                                </StyledText>
                              </StyledStatus>
                            ))}
                          </StyledFlex>
                        </>
                      )}
                    </StyledFlex>
                  </StyledFlex>
                </Scrollbars>
              </StyledFlex>
            </Panel>
          )}
        </PanelGroup>
      </ContentLayout>

      {openModal === TEST_MANAGER_MODAL_TYPE.EXECUTE && (
        <TestExecuteModal
          open={openModal === TEST_MANAGER_MODAL_TYPE.EXECUTE}
          onClose={() => setOpenModal(null)}
          onExecute={(envName) => {
            onExecute({ envName });
            setOpenModal(null);
          }}
          rows={[{ ...testEntity, type: testEntityType }]}
        />
      )}
      {openModal === TEST_MANAGER_MODAL_TYPE.DELETE && (
        <TestDeleteModal
          open={openModal === TEST_MANAGER_MODAL_TYPE.DELETE}
          onClose={() => setOpenModal(null)}
          onDelete={() => {
            onDelete();
            setOpenModal(null);
          }}
          rows={[{ ...testEntity, type: testEntityType }]}
        />
      )}

      <TestDataFullViewMoreActionsButton
        open={moreActionsBtnAnchorEl}
        onClose={onMoreActionsBtnClose}
        anchorEl={moreActionsBtnAnchorEl}
        onDelete={() => {
          setOpenModal(TEST_MANAGER_MODAL_TYPE.DELETE);
          onMoreActionsBtnClose();
        }}
        onDuplicate={handleDuplicate}
        canDuplicate={testEntityType === TEST_ENTITY_TYPE.CASE}
        {...(testEntityType === TEST_ENTITY_TYPE.CASE && { onExport: handleExport })}
      />

      {isCreateTestCaseModalOpen && (
        <CreateTestModal
          openTestModal={isCreateTestCaseModalOpen}
          onSubmitCreateNewTest={(values) => {
            handleDuplicateSubmitFn(duplicateTestEntity, values);
          }}
          onCloseTestModal={() => {
            setIsCreateTestCaseModalOpen(false);
          }}
          testTypeText={TEST_MANAGER_LABELS.CASE}
          assignToTest="Assign To Test Groups / Test Suites"
          selectPlaceHolder="Search for Test Groups / Test Suites to add this Test Case to..."
          isTestCaseModal
          duplicateTestData={duplicateTestData}
          testType={TEST_ENTITY_TYPE.CASE}
          title={`Duplicate ${TEST_MANAGER_LABELS.CASE}`}
          allTestCasesOptions={allTestCasesOptions}
          isLoading={allTestCasesOptionsLoading}
        />
      )}
    </PageLayout>
  );
};

export default TestDataFullView;
