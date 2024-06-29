import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import { useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { debounce } from 'lodash';
import { memo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BulkDeleteIcon from '../../../Assets/icons/issues/bulkOperations/delete.svg?component';
import {
  createNewTestCase,
  createNewTestGroup,
  createNewTestSuite,
  duplicateTestCase,
  getTestData,
} from '../../../Services/axios/test';
import routes from '../../../config/routes';
import { useUser } from '../../../contexts/UserContext';
import { useFilter } from '../../../hooks/useFilter';
import { useTableSortAndFilter } from '../../../hooks/useTableSortAndFilter';
import { StyledDummyInput } from '../../Settings/Components/PublicSubmissionForm/components/StyledPublicSubmissionForm';
import NavTabs from '../../shared/NavTabs/NavTabs';
import ContentLayout from '../../shared/REDISIGNED/layouts/ContentLayout/ContentLayout';
import PageLayout from '../../shared/REDISIGNED/layouts/PageLayout/PageLayout';
import CustomSelect from '../../shared/REDISIGNED/selectMenus/CustomSelect';
import CustomIndicatorArrow from '../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomCheckboxOption from '../../shared/REDISIGNED/selectMenus/customComponents/options/CustomCheckboxOption';
import TableV2 from '../../shared/REDISIGNED/table-v2/Table-v2';
import { StyledTooltip } from '../../shared/REDISIGNED/tooltip/StyledTooltip';
import { StyledFlex } from '../../shared/styles/styled';

import { useUpdateTableFilterSearchParams } from '../../../hooks/useTableFilterSearchParams';
import { useNavTabsSearchParams } from '../../../hooks/useTabs';
import { MANAGERS_IMPORT_JSON_FORMAT } from '../shared/constants/common';
import { isFileInJsonFormat, validateYupSchemaAsync } from '../shared/utils/validation';
import TestManagerFilters from './SideModals/TestManagerFilters/TestManagerFilters';
import TestManagerHeaderCreateTestsActions from './TestManagerTable/TestManagerHeaderCreateTestsActions';
import {
  GET_ALL_TEST_QUERY_KEY,
  IMPORT_TEST_CASE_MODAL_TYPES,
  TEST_ENTITY_TYPE,
  TEST_MANAGER_LABELS,
  TEST_MANAGER_MODAL_TYPE,
  TEST_MANAGER_TABS_MODEL,
  TEST_TYPE_OPTIONS,
} from './constants/constants';
import {
  TEST_MANAGER_COLUMNS_SCHEMA,
  TEST_MANAGER_FILTERS_KEY,
  TEST_MANAGER_FILTER_INITIAL_VALUES,
  selectedTestManagerFiltersMeta,
  testManagerFormatter,
} from './constants/formatters';
import useCreateTestEntity from './hooks/useCreateTest';
import useDuplicateTest from './hooks/useDuplicateTest';
import { useGetBulkLinkages } from './hooks/useGetArchiveLinkages';
import { useGetFilteredTestData } from './hooks/useGetFilteredTestData';
import useImportAndReplaceTestCase from './hooks/useImportAndReplaceTestCase';
import useImportNewTestCase from './hooks/useImportNewTestCase';

import { useModalToggle } from '../../shared/REDISIGNED/modals/CenterModalFixed/hooks/useModalToggle';
import { usePerformTestAction } from './hooks/usePerformTestAction';
import TestArchiveModal from './modals/TestArchiveModal';
import TestDeleteModal from './modals/TestDeleteModal';
import TestExecuteModal from './modals/TestExecuteModal';
import TestImportAndReplaceModal from './modals/TestImportAndReplaceModal/TestImportAndReplaceModal';
import { CreateTestModal } from './modals/TestManagerCreateModal/TestManagerCreateModal';
import { TEST_CASE_IMPORT_TOAST_MSGS } from './utils/constants';
import { getPayloadPropKeyByTestType } from './utils/helpers';
import { importTestCaseFileSchema } from './utils/validationSchemas';

const TestManager = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const navigate = useNavigate();

  const { tabValue, onTabChange, navTabLabels } = useNavTabsSearchParams(0, TEST_MANAGER_TABS_MODEL, true);

  const inputImportFileRef = useRef(null);

  const [isViewFiltersOpen, setIsViewFiltersOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectionRefreshCount, setSelectionRefreshCount] = useState(0);
  const [genericBulkRequestIds, setGenericBulkRequest] = useState({});
  const [openModal, setOpenModal] = useState();
  const [actionRows, setActionRows] = useState();
  const [shouldCreateMore, setShouldCreateMore] = useState(null);
  const [richTextEditorKey, setRichTextEditorKey] = useState(null);
  const [showImportTestModal, setShowImportTestModal] = useState(null);

  const { open: isCreateTestCaseModalOpen, setOpen: setIsCreateTestCaseModalOpen } = useModalToggle();
  const { open: isCreateTestSuiteModalOpen, setOpen: setIsCreateTestSuiteModalOpen } = useModalToggle();
  const { open: isCreateTestGroupModalOpen, setOpen: setIsCreateTestGroupModalOpen } = useModalToggle();

  const { sourceFilterValue, setFilterFieldValue, submitFilterValue, initialFilterValues } = useFilter({
    formikProps: {
      initialValues: TEST_MANAGER_FILTER_INITIAL_VALUES,
    },
    onSubmit: ({ filterValue, selectedFilters }) => {
      setColumnFilters(filterValue);
      setSelectedFiltersBar(selectedFilters);
      handleUrlFiltersMeta(filterValue, selectedFilters);
    },
    formatter: testManagerFormatter,
    selectedFiltersMeta: selectedTestManagerFiltersMeta,
  });

  const { updateSearchParams, handleUrlFiltersMeta } = useUpdateTableFilterSearchParams({
    enableURLSearchParams: true,
  });

  const {
    data,
    pagination,
    setPagination,
    sorting,
    setSorting,
    searchText,
    setSearchText,
    setColumnFilters,
    selectedFiltersBar,
    setSelectedFiltersBar,
    isFetching,
    refetch,
  } = useTableSortAndFilter({
    queryFn: getTestData,
    queryKey: GET_ALL_TEST_QUERY_KEY,
    initialFilters: initialFilterValues,
    initialSorting: [
      {
        desc: true,
        id: 'updatedAt',
      },
    ],
    updateSearchParams,
    enableURLSearchParams: true,
  });

  const isImportNewTestCaseModalOpen = showImportTestModal?.type === IMPORT_TEST_CASE_MODAL_TYPES.IMPORT_AS_NEW;

  const isImportAndReplaceTestCaseModalOpen =
    showImportTestModal?.type === IMPORT_TEST_CASE_MODAL_TYPES.IMPORT_AND_REPLACE_EXISTING;

  const { filteredTestData: allTestCasesOptions, isFilteredTestDataLoading: allTestCasesOptionsLoading } =
    useGetFilteredTestData({
      params: {
        types: TEST_ENTITY_TYPE.CASE,
        pageSize: 10000,
      },
      select: (res) => res.content,
      gcTime: Infinity,
      staleTime: Infinity,
      enabled: isImportAndReplaceTestCaseModalOpen || isImportNewTestCaseModalOpen || isCreateTestCaseModalOpen,
    });

  const { importAndReplaceTestCase, isImportAndReplaceTestCaseLoading } = useImportAndReplaceTestCase({
    onSuccess: (data, variables) => {
      toast.success(`${variables.fileDisplayName} has been imported, and has replaced ${variables.displayName}`);
      queryClient.invalidateQueries({ queryKey: [GET_ALL_TEST_QUERY_KEY] });
    },
    onError: () => toast.error('Something went wrong!'),
  });

  const { importNewTestCase, isImportNewTestCaseLoading } = useImportNewTestCase({
    onSuccess: (importedCaseId, variables) => {
      toast.success(`${variables.displayName} has been imported`);
      navigate(`${routes.TEST_EDITOR}/${importedCaseId}`);
    },
    onError: () => toast.error('Something went wrong!'),
  });

  

  const getErrorTextFromResponse = (error, fallbackText = 'Something went wrong') =>
    error?.response?.data?.message || fallbackText;

  const isAllFavourite = sourceFilterValue.isFavourite;
  const isAllArchived = sourceFilterValue.isArchived;

  const { createTestEntity: createTestCase } = useCreateTestEntity({
    mutationFn: (values) => createNewTestCase(values),
    onSuccess: (successData) => {
      toast.success('Created test case');

      if (!shouldCreateMore) {
        navigate(`${routes.TEST_EDITOR}/${successData?.testCaseId}`);
      } else {
        queryClient.invalidateQueries({ queryKey: [GET_ALL_TEST_QUERY_KEY] });
      }
    },
    onError: (error) => {
      toast.error(getErrorTextFromResponse(error, 'Failed to create test case'));
    },
  });

  const { duplicateTestEntity } = useDuplicateTest({
    mutationFn: (values) => {
      return duplicateTestCase(values);
    },
    onSuccess: () => {
      toast.success('Duplicated test case');
      queryClient.invalidateQueries({ queryKey: [GET_ALL_TEST_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error(getErrorTextFromResponse(error, 'Failed to duplicate test case'));
    },
  });

  const { createTestEntity: createTestSuite } = useCreateTestEntity({
    mutationFn: (values) => createNewTestSuite(values),
    onSuccess: () => {
      toast.success('Created test suite');
      queryClient.invalidateQueries({ queryKey: [GET_ALL_TEST_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error(getErrorTextFromResponse(error, 'Failed to create test suite'));
    },
  });

  const { createTestEntity: createTestGroup } = useCreateTestEntity({
    mutationFn: (values) => createNewTestGroup(values),
    onSuccess: () => {
      toast.success('Created test group');
      queryClient.invalidateQueries({ queryKey: [GET_ALL_TEST_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error(getErrorTextFromResponse(error, 'Failed to create test group'));
    },
  });

  const { performDelete, performArchive, performFavourite, performUnarchive, performUnfavourite, performExecute } =
    usePerformTestAction({
      onSuccess: () => setSelectionRefreshCount((count) => count + 1),
      invalidateQueries: [GET_ALL_TEST_QUERY_KEY],
    });

  const { bulkDataLinkages } = useGetBulkLinkages(genericBulkRequestIds);

  const [duplicateTestData, setDuplicateTestData] = useState(null);

  const handleCreateSubmitFn = async (createFunction, values, shouldStayOpen, resetForm, setIsModalOpen) => {
    setShouldCreateMore(shouldStayOpen);
    if (duplicateTestData) {
      setDuplicateTestData(null);
    }
    try {
      await createFunction(values);

      resetForm();
      setRichTextEditorKey((prevKey) => prevKey + 1);

      if (!shouldStayOpen) {
        setIsModalOpen(false);
      }
    } catch {}
  };

  const onNameClick = (row) => {
    const { type, id } = row;
    let baseUrl;

    if (type === TEST_ENTITY_TYPE.CASE) {
      baseUrl = routes.TEST_CASE_DETAILS;
    } else if (type === TEST_ENTITY_TYPE.SUITE) {
      baseUrl = routes.TEST_SUITE_DETAILS;
    } else {
      baseUrl = routes.TEST_GROUP_DETAILS;
    }

    const newUrl = [...baseUrl.split('/').slice(0, -1), id].join('/');

    navigate(newUrl);
  };

  const getActionPayloadFromRows = (rows) =>
    rows?.reduce(
      (acc, row) => {
        const { type, id } = row;
        const propKey = getPayloadPropKeyByTestType(type);

        return { ...acc, [propKey]: [...acc[propKey], id] };
      },
      {
        testCaseId: [],
        testSuiteId: [],
        testGroupId: [],
      }
    );

  const performAction = (rows, callback, queryParams) => {
    const payload = getActionPayloadFromRows(rows);

    callback(payload, queryParams);
  };

  const handleImportNewTestClick = () => inputImportFileRef?.current?.click();

  const handleImportAndReplaceTestClick = () =>
    setShowImportTestModal({
      type: IMPORT_TEST_CASE_MODAL_TYPES.IMPORT_AND_REPLACE_EXISTING,
    });

  const handleImportAndReplaceTestCase = (payload) => {
    setShowImportTestModal(null);

    importAndReplaceTestCase(payload);
  };

  const handleImportNewTestCase = ({ fileContent, testSuiteId, testGroupId, framework }) => {
    setShowImportTestModal(null);

    const jsonString = JSON.stringify(fileContent);
    const blob = new Blob([jsonString], { type: MANAGERS_IMPORT_JSON_FORMAT.FILE_TYPE });

    const formDataPayload = new FormData();

    formDataPayload.append('file', blob);

    !!testSuiteId?.length && formDataPayload.append('testSuiteId', testSuiteId);

    !!testGroupId?.length && formDataPayload.append('testGroupId', testGroupId);

    importNewTestCase({
      payload: formDataPayload,
      params: new URLSearchParams({
        processType: framework,
      }),
      displayName: fileContent?.attributes?.displayName,
    });
  };

  const handleImportAsNewFileUpload = async (event) => {
    const file = event.target.files?.[0];
    const isJson = isFileInJsonFormat(file?.name);

    if (inputImportFileRef?.current) inputImportFileRef.current.value = '';

    if (!isJson) {
      toast.error(TEST_CASE_IMPORT_TOAST_MSGS.JSON_ALLOWED);
      return;
    }

    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        const isFileSchemaValid = await validateYupSchemaAsync(importTestCaseFileSchema, jsonData);

        if (!isFileSchemaValid) {
          toast.error(TEST_CASE_IMPORT_TOAST_MSGS.INVALID_FILE);
          return;
        }

        setShowImportTestModal({
          type: IMPORT_TEST_CASE_MODAL_TYPES.IMPORT_AS_NEW,
          data: jsonData,
        });
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    };

    reader.readAsText(file);
  };

  const onTestDelete = (rows) => performAction(rows, performDelete);
  const onTestFavourite = (rows) => performAction(rows, performFavourite);
  const onTestUnfavourite = (rows) => performAction(rows, performUnfavourite);
  const onTestArchive = (rows) => performAction(rows, performArchive);
  const onTestUnarchive = (rows) => performAction(rows, performUnarchive);
  const onTestExecute = (rows, queryParams) => performAction(rows, performExecute, queryParams);

  const onRowFavourite = (row) => onTestFavourite([row]);
  const onRowUnfavourite = (row) => onTestUnfavourite([row]);
  const onRowArchive = (row) => {
    setGenericBulkRequest(getActionPayloadFromRows([row]));
    setActionRows([row]);
    setOpenModal(TEST_MANAGER_MODAL_TYPE.ARCHIVE);
  };
  const onRowUnarchive = (row) => onTestUnarchive([row]);
  const onRowDelete = (row) => {
    setActionRows([row]);
    setOpenModal(TEST_MANAGER_MODAL_TYPE.DELETE);
  };
  const onRowExecute = (row) => {
    setActionRows([row]);
    setOpenModal(TEST_MANAGER_MODAL_TYPE.EXECUTE);
  };

  const onSearch = debounce((value) => setSearchText(value), 300);

  const handleClearAllFilters = () => {
    setFilterFieldValue(TEST_MANAGER_FILTERS_KEY.SIDE_FILTER, TEST_MANAGER_FILTER_INITIAL_VALUES.sideFilter);
    submitFilterValue();
  };

  const handleClearFilterField = (key) => {
    setFilterFieldValue(TEST_MANAGER_FILTERS_KEY.SIDE_FILTER, {
      ...sourceFilterValue[TEST_MANAGER_FILTERS_KEY.SIDE_FILTER],
      [key]: TEST_MANAGER_FILTER_INITIAL_VALUES[key],
    });
    submitFilterValue();
  };

  const tableBulkActions = [
    {
      text: isAllArchived ? 'Unarchive' : 'Archive',
      icon: <Inventory2OutlinedIcon />,
      callback: () => {
        if (isAllArchived) {
          onTestUnarchive(selectedRows);
        } else {
          setGenericBulkRequest(getActionPayloadFromRows(selectedRows));
          setActionRows(selectedRows);
          setOpenModal(TEST_MANAGER_MODAL_TYPE.ARCHIVE);
        }
      },
    },
    {
      text: isAllFavourite ? 'Unfavourite' : 'Favourite',
      icon: <StarBorderRoundedIcon />,
      callback: () => (isAllFavourite ? onTestUnfavourite(selectedRows) : onTestFavourite(selectedRows)),
    },
    {
      text: isAllArchived ? (
        <StyledTooltip
          title="Cannot Execute an Archived Record"
          arrow
          placement="top"
          p="8px 13px"
          size="14px"
          lh="1.5"
          radius="10px"
          maxWidth="380px"
        >
          <StyledFlex opacity={0.5}>Execute</StyledFlex>
        </StyledTooltip>
      ) : (
        'Execute'
      ),
      icon: isAllArchived ? <PlayCircleOutlineIcon opacity={0.5} /> : <PlayCircleOutlineIcon />,
      callback: () => {
        if (!isAllArchived) {
          setActionRows(selectedRows);
          setOpenModal(TEST_MANAGER_MODAL_TYPE.EXECUTE);
        }
      },
    },
    {
      text: 'Delete',
      icon: <BulkDeleteIcon />,
      callback: () => {
        setActionRows(selectedRows);
        setOpenModal(TEST_MANAGER_MODAL_TYPE.DELETE);
      },
    },
  ];

  const QuickTypeFilter = () => (
    <StyledFlex width="320px">
      <CustomSelect
        name="types"
        value={sourceFilterValue?.types || []}
        onChange={(value) => {
          setFilterFieldValue('types', value);
          submitFilterValue();
        }}
        placeholder="Select Type"
        components={{
          Option: CustomCheckboxOption,
          DropdownIndicator: CustomIndicatorArrow,
        }}
        options={TEST_TYPE_OPTIONS}
        isSearchable={false}
        isClearable={false}
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        openMenuOnClick
        isMulti
        mb={0}
        maxHeight={32}
      />
    </StyledFlex>
  );

  const onRowSelectionChange = (rows) => {
    const selectedRows = data?.content?.filter((row) => rows.includes(row.id)) || [];

    setSelectedRows(selectedRows);
  };

  const onOpenInEditor = (row) => {
    window.open(`${window.location.origin}${routes.TEST_EDITOR}/${row.id}`, '_blank');
  };

  const handleTabChange = (event, newValue) => {
    onTabChange(event, newValue);

    const selectedTab = TEST_MANAGER_TABS_MODEL[newValue].value;

    const isArchivedTab = selectedTab === 'archived';
    const isFavouriteTab = selectedTab === 'favourites';

    setFilterFieldValue('isArchived', isArchivedTab || undefined);
    setFilterFieldValue('isFavourite', isFavouriteTab || undefined);

    submitFilterValue();
  };

  const handleDuplicate = (duplicateTest) => {
    if (duplicateTest.type === TEST_ENTITY_TYPE.CASE) {
      setIsCreateTestCaseModalOpen(true);
    }

    setDuplicateTestData(duplicateTest);
  };

  const sharedCreateImportTestCaseModalProps = {
    testTypeText: TEST_MANAGER_LABELS.CASE,
    create: 'Create and Open In Editor',
    assignToTest: 'Assign To Test Groups / Test Suites',
    selectPlaceHolder: 'Search for Test Groups / Test Suites to add this Test Case to...',
    isTestCaseModal: true,
    testType: TEST_ENTITY_TYPE.CASE,
    richTextEditorKey: richTextEditorKey,
    isLoading: allTestCasesOptionsLoading,
  };

  const isImportButtonLoading =
    isImportAndReplaceTestCaseModalOpen ||
    isImportNewTestCaseModalOpen ||
    isImportAndReplaceTestCaseLoading ||
    isImportNewTestCaseLoading;

  return (
    <PageLayout top={<NavTabs labels={navTabLabels} value={tabValue} onChange={handleTabChange} />}>
      <ContentLayout fullHeight noPadding>
        <TableV2
          data={data}
          columns={TEST_MANAGER_COLUMNS_SCHEMA}
          searchPlaceholder="Search Record Names or IDs..."
          onSearch={(e) => onSearch(e.target.value)}
          initialSearchText={searchText}
          onShowFilters={() => setIsViewFiltersOpen(true)}
          quickFilters={<QuickTypeFilter />}
          selectBarActions={tableBulkActions}
          onSelectionChange={onRowSelectionChange}
          selectionRefreshTrigger={selectionRefreshCount}
          pagination={pagination}
          setPagination={setPagination}
          sorting={sorting}
          setSorting={setSorting}
          selectedFilters={selectedFiltersBar}
          onClearAllFilters={handleClearAllFilters}
          onClearFilter={handleClearFilterField}
          entityName="Records"
          emptyTableDescription="There are currently no records. Create your first record by clicking on the “Create” button in the top right"
          enablePageSizeChange
          headerActions={
            <TestManagerHeaderCreateTestsActions
              setIsCreateTestCaseModalOpen={setIsCreateTestCaseModalOpen}
              setIsCreateTestSuiteModalOpen={setIsCreateTestSuiteModalOpen}
              setIsCreateTestGroupModalOpen={setIsCreateTestGroupModalOpen}
              onImportNewTestClick={handleImportNewTestClick}
              onImportAndReplaceTestClick={handleImportAndReplaceTestClick}
              isImportButtonLoading={isImportButtonLoading}
            />
          }
          meta={{
            user,
            theme,
            onNameClick,
            onRowDelete,
            onRowFavourite,
            onRowUnfavourite,
            onRowArchive,
            onRowUnarchive,
            onRowExecute,
            onOpenInEditor,
            onDuplicate: handleDuplicate,
          }}
          isLoading={isFetching}
          pinSelectColumn
          pinColumns={['displayName']}
          pinRowHoverActionColumns={['actions']}
          onTableRefresh={refetch}
        />
      </ContentLayout>

      {isCreateTestCaseModalOpen && (
        <CreateTestModal
          openTestModal={isCreateTestCaseModalOpen}
          onSubmitCreateNewTest={(values, shouldStayOpen, resetForm) => {
            handleCreateSubmitFn(
              duplicateTestData ? duplicateTestEntity : createTestCase,
              values,
              shouldStayOpen,
              resetForm,
              setIsCreateTestCaseModalOpen
            );
          }}
          onCloseTestModal={() => {
            setIsCreateTestCaseModalOpen(false);
            setDuplicateTestData(null);
          }}
          createAndStartAnother="Create and Start Another Test Case"
          {...sharedCreateImportTestCaseModalProps}
          duplicateTestData={duplicateTestData}
          title={duplicateTestData ? `Duplicate ${TEST_MANAGER_LABELS.CASE}` : `Create ${TEST_MANAGER_LABELS.CASE}`}
          allTestCasesOptions={allTestCasesOptions}
        />
      )}
      {isCreateTestSuiteModalOpen && (
        <CreateTestModal
          openTestModal={isCreateTestSuiteModalOpen}
          onSubmitCreateNewTest={(values, shouldStayOpen, resetForm) => {
            handleCreateSubmitFn(createTestSuite, values, shouldStayOpen, resetForm, setIsCreateTestSuiteModalOpen);
          }}
          onCloseTestModal={() => setIsCreateTestSuiteModalOpen(false)}
          testTypeText={TEST_MANAGER_LABELS.SUITE}
          createAndStartAnother="Create and Start Another Test Suite"
          create="Create"
          assignToTest="Assign To Test Groups / Test Suites"
          selectPlaceHolder="Search for Test Groups / Test Suites to add this Test Case to..."
          isTestSuiteModal
          richTextEditorKey={richTextEditorKey}
          testType={TEST_ENTITY_TYPE.SUITE}
          title={`Create ${TEST_MANAGER_LABELS.SUITE}`}
        />
      )}
      {isCreateTestGroupModalOpen && (
        <CreateTestModal
          openTestModal={isCreateTestGroupModalOpen}
          onSubmitCreateNewTest={(values, shouldStayOpen, resetForm) => {
            handleCreateSubmitFn(createTestGroup, values, shouldStayOpen, resetForm, setIsCreateTestGroupModalOpen);
          }}
          onCloseTestModal={() => setIsCreateTestGroupModalOpen(false)}
          testTypeText={TEST_MANAGER_LABELS.GROUP}
          createAndStartAnother="Create and Start Another Test Group"
          create="Create"
          assignToTest="Assign To Test Cases / Test Suites"
          selectPlaceHolder="Search for Test Cases / Test Suites to add this Test Group to..."
          richTextEditorKey={richTextEditorKey}
          testType={TEST_ENTITY_TYPE.GROUP}
          title={`Create ${TEST_MANAGER_LABELS.GROUP}`}
        />
      )}
      <TestManagerFilters
        isOpen={isViewFiltersOpen}
        initialValues={sourceFilterValue.sideFilter}
        onApplyFilters={(filter) => {
          setIsViewFiltersOpen(false);
          setFilterFieldValue(TEST_MANAGER_FILTERS_KEY.SIDE_FILTER, filter);
          submitFilterValue();
        }}
        onClose={() => setIsViewFiltersOpen(false)}
      />
      <TestExecuteModal
        open={openModal === TEST_MANAGER_MODAL_TYPE.EXECUTE}
        onClose={() => setOpenModal(null)}
        onExecute={(envName) => {
          setOpenModal(null);
          onTestExecute(actionRows, { envName });
        }}
        rows={actionRows}
      />
      <TestDeleteModal
        open={openModal === TEST_MANAGER_MODAL_TYPE.DELETE}
        onClose={() => setOpenModal(null)}
        onDelete={() => {
          setOpenModal(null);
          onTestDelete(actionRows);
        }}
        rows={actionRows}
      />
      <TestArchiveModal
        isArchiveModalOpen={openModal === TEST_MANAGER_MODAL_TYPE.ARCHIVE}
        onCloseArchiveModal={() => setOpenModal(null)}
        linkedValues={bulkDataLinkages}
        archiveTestBtnClick={() => {
          onTestArchive(actionRows);
          setOpenModal(null);
        }}
        genericBulkRequestIds={genericBulkRequestIds}
        rows={actionRows}
      />

      {isImportAndReplaceTestCaseModalOpen && (
        <TestImportAndReplaceModal
          onClose={() => setShowImportTestModal(null)}
          allTestCasesOptions={allTestCasesOptions}
          onSubmit={handleImportAndReplaceTestCase}
          // isLoading={isImportAndReplaceProcessLoading || allTestCasesOptionsLoading}
          isLoading={allTestCasesOptionsLoading}
        />
      )}

      {isImportNewTestCaseModalOpen && (
        <CreateTestModal
          openTestModal
          onSubmitCreateNewTest={(payload) => {
            const { fileContent, testSuiteId, testGroupId, framework } = payload;

            handleImportNewTestCase({ fileContent, testSuiteId, testGroupId, framework });
          }}
          onCloseTestModal={() => {
            setShowImportTestModal(null);
          }}
          {...sharedCreateImportTestCaseModalProps}
          title={`Import ${TEST_MANAGER_LABELS.CASE}`}
          importModeData={showImportTestModal.data}
          allTestCasesOptions={allTestCasesOptions}
        />
      )}

      <StyledDummyInput
        type="file"
        hidden
        ref={inputImportFileRef}
        onChange={handleImportAsNewFileUpload}
        accept={`.${MANAGERS_IMPORT_JSON_FORMAT.EXTENSION}`}
      />
    </PageLayout>
  );
};
export default memo(TestManager);
