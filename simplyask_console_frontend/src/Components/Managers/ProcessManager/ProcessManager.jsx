import CloseIcon from '@mui/icons-material/Close';
import { useQueryClient } from '@tanstack/react-query';
import FileDownload from 'js-file-download';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { generatePath, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Modal, SidedrawerModal } from 'simplexiar_react_components';

import crossIconTable from '../../../Assets/icons/crossIconTable.svg';
import processManagerAllIcon from '../../../Assets/icons/processManagerAllIcon.svg';
import processManagerArchiveIconBold from '../../../Assets/icons/processManagerArchiveIconBold.svg';
import processManagerStarIconBold from '../../../Assets/icons/processManagerStarIconBold.svg';
import { MANAGER_API_KEYS } from '../../../config/managerKeys';
import routes from '../../../config/routes';
import { useUser } from '../../../contexts/UserContext';
import { GET_PROCESS_DEFINITIONS } from '../../../hooks/process/useProcessDefinitions';
import { GET_WORKFLOWS, useProcesses } from '../../../hooks/process/useProcesses';
import useAxiosGet from '../../../hooks/useAxiosGet';
import useManagerCardsPageSize from '../../../hooks/useManagerCardsPageSize';
import { useFixedSideModalWidth } from '../../../hooks/useSideModalWidth';
import { CATALOG_API } from '../../../Services/axios/AxiosInstance';
import { createNewProcessApi, deleteProcess, updateExistingProcessApi } from '../../../Services/axios/processManager';
import {
  extractStringsFromArrayOfObjects,
  modifyAppliedFilterTimeStampsWithoutTime,
} from '../../../utils/helperFunctions';
import { StyledDummyInput } from '../../Settings/Components/PublicSubmissionForm/components/StyledPublicSubmissionForm';
import { CALENDAR_DATE_KEYS } from '../../shared/Calendars/PredefinedOptionsCalendar/CalendarComponent';
import { INITIATE_API_KEY, TAGS_KEY } from '../../shared/constants/core';
import ManagerCards from '../../shared/ManagerComponents/ManagerCards/ManagerCards';
import ChangeTicketStatusModal from '../../shared/ManagerComponents/Modals/ProcessManagerModals/ChangeTicketStatusModal/ChangeTicketStatusModal';
import DeleteDisableElementModal from '../../shared/ManagerComponents/Modals/SharedModals/DeleteDisableElementModal/DeleteDisableElementModal';
import MoveTicketStatusToArchiveModal from '../../shared/ManagerComponents/Modals/SharedModals/MoveTicketStatusToArchiveModal/MoveTicketStatusToArchiveModal';
import AllTagsSideModal from '../../shared/ManagerComponents/SideModals/AllTagsSideModal/AllTagsSideModal';
import SettingsSideDrawer, {
  CHANGE_PROCESS_MANAGER_MENUS,
  CHANGE_TEST_MANAGER_MENUS,
  DEACTIVATE_TRIGGER_API,
  SAVE_BUTTON_CONFIGURATION_SCHEMA,
} from '../../shared/ManagerComponents/SideModals/SettingsSideDrawer/SettingsSideDrawer';
import SubNavBar from '../../shared/ManagerComponents/SubNavBar/SubNavBar';
import { NO_PROCESSES_DATA_TEXTS } from '../../shared/NoDataFound/NoDataFound';
import { StyledButton } from '../../shared/REDISIGNED/controls/Button/StyledButton';
import ContentLayout from '../../shared/REDISIGNED/layouts/ContentLayout/ContentLayout';
import PageLayout from '../../shared/REDISIGNED/layouts/PageLayout/PageLayout';
import { MANAGERS_IMPORT_JSON_FORMAT, REFETCH_TIMEOUT_SECONDS } from '../shared/constants/common';
import { isFileInJsonFormat, validateYupSchemaAsync } from '../shared/utils/validation';

import { SHOW_PROCESS_MANAGER_MODAL_TYPES } from './constants/common';
import useDuplicateProcess from './hooks/useDuplicateProcess';
import useExportProcess from './hooks/useExportProcess';
import useImportAndReplaceProcess from './hooks/useImportAndReplaceProcess';
import useImportProcess from './hooks/useImportProcess';
import classes from './ProcessManager.module.css';
import ProcessManagerDuplicateModal from './ProcessManagerModals/ProcessManagerDuplicateModal/ProcessManagerDuplicateModal';
import ProcessManagerImportReplaceModal from './ProcessManagerModals/ProcessManagerImportReplaceModal/ProcessManagerImportReplaceModal';
import AdditionalFilters from './SideModals/AdditionalFilters/AdditionalFilters';
import { processImportedFileSchema, PROCESS_IMPORTED_FILE_INVALID_MSG } from './utils/validations';
import ProcessManagerAddModal from './ProcessManagerModals/ProcessManagerAddModal/ProcessManagerAddModal';

export const BLACKOUT_STATUS_INDEX = 4;

export const SORTBY_DATE_FILTER = [
  {
    value: 0,
    label: 'Edited Date - Newest First',
    sortingFilter: 'lastEditedAt',
    isAscending: false,
  },
  {
    value: 1,
    label: 'Edited Date - Oldest First',
    sortingFilter: 'lastEditedAt',
    isAscending: true,
  },
  {
    value: 2,
    label: 'Created Date  - Newest First',
    sortingFilter: 'createdAt',
    isAscending: false,
  },
  {
    value: 3,
    label: 'Created Date - Oldest First',
    sortingFilter: 'createdAt',
    isAscending: true,
  },
  {
    value: 4,
    label: 'Process Name (A → Z)',
    sortingFilter: 'displayName',
    isAscending: true,
  },
  {
    value: 5,
    label: 'Process Name (Z → A)',
    sortingFilter: 'displayName',
    isAscending: false,
  },
];

export const KEY_TO_ACCESS_FILTERS = 'value';

export const ALL_TABS = {
  ALL_CARDS: 1,
  FAVORITES: 2,
  ARCHIVED: 3,
};

export const PROCESS_STATUSES_COLORS = [
  { value: 'ACTIVE', label: 'Active', description: 'Execute processes normally' },
  { value: 'REJECT', label: 'Reject', description: 'Prevent new executions' },
  { value: 'BUFFER', label: 'Buffer', description: 'Hold new executions until next Active status' },
  { value: 'FALLOUT', label: 'Fallout', description: 'Prevent new executions and create fallout tickets' },
  { value: 'BLACKOUT', label: 'Blackout', description: '' },
];

export const PROCESS_TYPES_COLORS = [
  {
    value: 'Standard',
    label: 'Standard',
    description: 'Define automated business processes to streamline organization operations',
  },
  {
    value: 'Migration',
    label: 'Migration',
    description: 'Define automated migration processes to be used as stages within Migrate projects',
  },
];

export const ADD_NEW_PROCESS_KEYS = {
  processName: 'processName',
  processDescription: 'processDescription',
  tags: TAGS_KEY,
  initiateApi: INITIATE_API_KEY,
  processTypeId: 'processTypeId',
};

export const ADD_NEW_PROCESS_FORM_SCHEMA = {
  [ADD_NEW_PROCESS_KEYS.processName]: '',
  [ADD_NEW_PROCESS_KEYS.processDescription]: '',
  [ADD_NEW_PROCESS_KEYS.tags]: [],
  [ADD_NEW_PROCESS_KEYS.processTypeId]: '',
  [ADD_NEW_PROCESS_KEYS.initiateApi]: false,
};

export const ADD_NEW_MODAL_TITLES = {
  headerTitle: 'New Process',
  elementTitleName: 'Name',
  descriptionTitleName: 'Description',
  tagsTitleName: 'Tags',
  processType: 'Process Type',
};

export const getStatusText = (status) => PROCESS_STATUSES_COLORS.find((item) => item.value === status)?.label ?? '---';

export const getStatusDescriptionText = (status) =>
  PROCESS_STATUSES_COLORS.find((item) => item.value === status)?.description ?? '---';

const CHANGE_PROCESS_STATUS_SCHEMA = { showModal: false, value: {} };

const DELETE_ELEMENT_LABEL = {
  label: 'delete process',
  activateValidationWordLength: 16,
};

const SUB_NAVBAR_TITLES = [
  {
    value: ALL_TABS.ALL_CARDS,
    title: 'All Processes',
    imgSource: processManagerAllIcon,
  },
  {
    value: ALL_TABS.FAVORITES,
    title: 'Favourites',
    imgSource: processManagerStarIconBold,
  },
  {
    value: ALL_TABS.ARCHIVED,
    title: 'Archived',
    imgSource: processManagerArchiveIconBold,
  },
];

export const FILTER_TEMPLATE_KEYS = {
  tagsFilter: 'tagsFilter',
  statusFilter: 'status',
  typeFilter: 'processType',
  searchFilterAPI: 'searchFilterAPI',
  sortBy: 'sortBy',
  pageNumber: 'pageNumber',
};

const FILTER_TEMPLATE = {
  [FILTER_TEMPLATE_KEYS.tagsFilter]: '',
  [FILTER_TEMPLATE_KEYS.searchFilterAPI]: '',
  [FILTER_TEMPLATE_KEYS.statusFilter]: '',
  [FILTER_TEMPLATE_KEYS.typeFilter]: '',
  [FILTER_TEMPLATE_KEYS.sortBy]: {},
  [FILTER_TEMPLATE_KEYS.pageNumber]: 0,
  [CALENDAR_DATE_KEYS.EDITED_AFTER]: '',
  [CALENDAR_DATE_KEYS.EDITED_BEFORE]: '',
  [CALENDAR_DATE_KEYS.CREATED_AFTER]: '',
  [CALENDAR_DATE_KEYS.CREATED_BEFORE]: '',
};

const ProcessManager = ({ scrollToTopRef }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [currentView, setCurrentView] = useState(ALL_TABS.ALL_CARDS);
  const pageSize = useManagerCardsPageSize();
  const { user } = useUser();
  const location = useLocation();

  // Data states
  const [searchFilterAPI, setSearchFilterAPI] = useState('');
  const [viewBackupFilters, setViewBackupFilters] = useState();
  const [filterQuery, setFilterQuery] = useState(FILTER_TEMPLATE);
  const [filterTriggerQuery, setFilterTriggerQuery] = useState(FILTER_TEMPLATE);
  const [addNewProcessFormCollector, setAddNewProcessFormCollector] = useState(ADD_NEW_PROCESS_FORM_SCHEMA);
  const [selectTagsFilter, setSelectTagsFilter] = useState([]);
  const [selectStatusFilter, setSelectStatusFilter] = useState([]);
  const [selectTypeFilter, setSelectTypeFilter] = useState([]);
  const [selectSortByDateOrName, setSelectSortByDateOrName] = useState(SORTBY_DATE_FILTER[0]);
  const closeIconClick = useRef(null);
  const inputImportFileRef = useRef(null);

  const {
    refetch,
    processes: requests,
    isFetching,
    error,
  } = useProcesses({
    params: {
      isFavourite: currentView === ALL_TABS.FAVORITES,
      isArchived: currentView === ALL_TABS.ARCHIVED,
      searchText: searchFilterAPI,
      tags: filterTriggerQuery[FILTER_TEMPLATE_KEYS.tagsFilter],
      status: filterTriggerQuery[FILTER_TEMPLATE_KEYS.statusFilter],
      processType: filterTriggerQuery[FILTER_TEMPLATE_KEYS.typeFilter],
      sortOrder: selectSortByDateOrName.sortingFilter,
      isAscending: selectSortByDateOrName.isAscending,
      editedAfter: filterTriggerQuery[CALENDAR_DATE_KEYS.EDITED_AFTER],
      editedBefore: filterTriggerQuery[CALENDAR_DATE_KEYS.EDITED_BEFORE],
      createdAfter: filterTriggerQuery[CALENDAR_DATE_KEYS.CREATED_AFTER],
      createdBefore: filterTriggerQuery[CALENDAR_DATE_KEYS.CREATED_BEFORE],
      pageNumber: filterTriggerQuery[FILTER_TEMPLATE_KEYS.pageNumber],
      pageSize,
      timezone: user?.timezone,
    },
    options: {
      select: (res) => ({
        ...res,
        pagination: {
          pageNumber: res.pageable.pageNumber + 1,
          totalPages: res.totalPages,
          totalElements: res.totalElements,
          numberOfElements: res.numberOfElements,
          startingPoint: res.pageable.offset + (res.numberOfElements ? 1 : 0),
          endingPoint: res.pageable.offset + res.numberOfElements,
        },
      }),
    },
  });

  const { response: allTagsForFilters, fetchData: fetchAllTagsFilters } = useAxiosGet(
    '/workflow/config/tags',
    true,
    CATALOG_API
  );

  const isMediumWidth = true;

  const fixedSideModalWidth = useFixedSideModalWidth(isMediumWidth);
  const fixedLargeSideModalWidth = useFixedSideModalWidth();

  // Modals and SideDrawers
  const [showUnsavedChangesModalOpen, setShowUnsavedChangesModalOpen] = useState(null);
  const [showMoveElementToArchive, setShowMoveElementToArchive] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showAddNewProcessModal, setShowAddNewProcessModal] = useState(false);
  const [showSettingsSideDrawer, setShowSettingsSideDrawer] = useState(false);
  const [showAllTagsSideDrawer, setShowAllTagsSideDrawer] = useState(false);
  const [showDeleteAccountModal, setShowDeleteElementModal] = useState(false);
  const [triggerOpenTestCasesSideModal, setTriggerOpenTestCasesSideModal] = useState(false);
  const [showIsProcessStatusChanged, setShowIsProcessStatusChanged] = useState(CHANGE_PROCESS_STATUS_SCHEMA);
  const [saveButtonConfigurations, setSaveButtonConfigurations] = useState(SAVE_BUTTON_CONFIGURATION_SCHEMA);

  const [showProcessManagerModal, setShowProcessManagerModal] = useState(null);

  const [activeMenu, setActiveMenu] = useState({
    ...CHANGE_TEST_MANAGER_MENUS.PRIMARY_MENU,
    component: null,
  });

  const [clickedProcess, setClickedProcess] = useState();
  const appliedFiltersRef = useRef();

  // Loading states
  const [isAddNewProcessApiLoading, setIsAddNewProcessApiLoading] = useState(false);
  const [isLoadingForModal, setIsLoadingForModal] = useState(false);
  const [isImportButtonLoading, setIsImportButtonLoading] = useState(false);

  useEffect(() => {
    // Sync clickedProcess in sidemodal with updated data
    if (showSettingsSideDrawer && requests?.content && clickedProcess) {
      const findClickedProcess = requests?.content?.find((process) => process.workflowId === clickedProcess.workflowId);

      findClickedProcess && setClickedProcess(findClickedProcess);
    }
  }, [requests?.content]);

  useEffect(() => {
    const name = location.state?.name;
    if (name) {
      setSearchFilterAPI(name);
    }
  }, [location]);

  useEffect(() => {
    setFilterTriggerQuery((prev) => ({
      ...prev,
      [FILTER_TEMPLATE_KEYS.pageNumber]: 0,
    }));
  }, [
    currentView,
    searchFilterAPI,
    filterTriggerQuery[CALENDAR_DATE_KEYS.CREATED_BEFORE],
    filterTriggerQuery[CALENDAR_DATE_KEYS.CREATED_AFTER],
    filterTriggerQuery[CALENDAR_DATE_KEYS.EDITED_BEFORE],
    filterTriggerQuery[CALENDAR_DATE_KEYS.EDITED_AFTER],
    filterTriggerQuery[FILTER_TEMPLATE_KEYS.tagsFilter],
  ]);

  useEffect(() => {
    if (triggerOpenTestCasesSideModal) {
      setShowSettingsSideDrawer(true);
    }
  }, [triggerOpenTestCasesSideModal]);

  useEffect(() => {
    if (showAddNewProcessModal && !showSettingsSideDrawer) {
      setAddNewProcessFormCollector(ADD_NEW_PROCESS_FORM_SCHEMA);
    }
  }, [showAddNewProcessModal, showSettingsSideDrawer]);

  useEffect(() => {
    if (addNewProcessFormCollector[ADD_NEW_PROCESS_KEYS.initiateApi]) {
      initiateAddNewProcessApi(addNewProcessFormCollector);
    }
  }, [addNewProcessFormCollector[ADD_NEW_PROCESS_KEYS.initiateApi]]);

  useEffect(() => {
    const processTagsFilter = extractStringsFromArrayOfObjects(selectTagsFilter, KEY_TO_ACCESS_FILTERS);

    setFilterQuery((prev) => ({
      ...prev,
      [FILTER_TEMPLATE_KEYS.tagsFilter]: processTagsFilter,
    }));
  }, [selectTagsFilter]);

  useEffect(() => {
    const statusFilter = extractStringsFromArrayOfObjects(selectStatusFilter, KEY_TO_ACCESS_FILTERS);

    setFilterQuery((prev) => ({
      ...prev,
      [FILTER_TEMPLATE_KEYS.statusFilter]: statusFilter,
    }));
  }, [selectStatusFilter]);

  useEffect(() => {
    const typeFilter = extractStringsFromArrayOfObjects(selectTypeFilter, KEY_TO_ACCESS_FILTERS);

    setFilterQuery((prev) => ({
      ...prev,
      [FILTER_TEMPLATE_KEYS.typeFilter]: typeFilter,
    }));
  }, [selectTypeFilter]);

  useEffect(() => {
    if (searchFilterAPI?.length > 0) {
      setFilterTriggerQuery((prev) => ({
        ...prev,
        [FILTER_TEMPLATE_KEYS.searchFilterAPI]: searchFilterAPI,
      }));
    }
  }, [searchFilterAPI]);

  useEffect(() => {
    if (selectSortByDateOrName) {
      setFilterQuery((prev) => ({
        ...prev,
        [FILTER_TEMPLATE_KEYS.sortBy]: selectSortByDateOrName,
      }));
    }

    setFilterTriggerQuery((prev) => ({
      ...prev,
      [FILTER_TEMPLATE_KEYS.sortBy]: selectSortByDateOrName,
    }));
  }, [selectSortByDateOrName]);

  const goBackToPrimaryMenu = () => {
    setActiveMenu((prev) => ({
      ...prev,
      ...CHANGE_TEST_MANAGER_MENUS.PRIMARY_MENU,
    }));
  };

  const onPageChange = (page) => {
    setFilterTriggerQuery((prev) => ({
      ...prev,
      [FILTER_TEMPLATE_KEYS.pageNumber]: page - 1,
    }));
  };

  const handleTagClickForManagerTags = (item) => {
    if (selectTagsFilter?.map((item) => item.value)?.includes(item.tagId)) {
      return;
    }

    const selectTagObject = { label: item.name, value: item.tagId };

    const newTagsFilter = [...selectTagsFilter, selectTagObject];

    setViewBackupFilters((prev) => ({
      ...prev,
      selectTagsFilter: newTagsFilter,
    }));

    setSelectTagsFilter((prev) => [...prev, selectTagObject]);

    setFilterTriggerQuery((prev) => ({
      ...prev,
      [FILTER_TEMPLATE_KEYS.tagsFilter]: extractStringsFromArrayOfObjects(newTagsFilter, KEY_TO_ACCESS_FILTERS),
    }));

    setShowAllTagsSideDrawer(false);
  };

  const isFilterApplied = () => {
    if (viewBackupFilters?.selectTagsFilter?.length > 0 || searchFilterAPI?.length > 0) {
      return true;
    }

    return false;
  };

  const getDataForNoDataFoundComponent = () => {
    switch (true) {
      case isFilterApplied():
        return NO_PROCESSES_DATA_TEXTS.NO_DATA_ON_PROCESSES_FILTER;
      case currentView === ALL_TABS.FAVORITES:
        return NO_PROCESSES_DATA_TEXTS.NO_PROCESSES_DATA_ON_FAVORITES;
      case currentView === ALL_TABS.ARCHIVED:
        return NO_PROCESSES_DATA_TEXTS.NO_PROCESSES_DATA_ON_ARCHIVES;
      default:
        return NO_PROCESSES_DATA_TEXTS.NO_INITIAL_PROCESSES_DATA;
    }
  };

  const runCreateNewProcessApi = async (data) => {
    setIsAddNewProcessApiLoading(true);

    try {
      const res = await createNewProcessApi(data);
      if (res) {
        toast.success('The Process has been created successfully...');
        navigate(generatePath(routes.PROCESS_MANAGER_INFO, { processId: res.workflowId }));
      }
    } catch (error) {
      const errorText = error.response?.data?.message;

      toast.error(errorText || 'Something went wrong...');
    } finally {
      setAddNewProcessFormCollector((prev) => ({
        ...prev,
        [ADD_NEW_PROCESS_KEYS.initiateApi]: false,
      }));

      setIsAddNewProcessApiLoading(false);
    }
  };

  const runUpdateElementApi = async (data, changeOnlyFavoriteLoading = false, isProcessingArchiveApi = false) => {
    let modifiedData = {};

    if (changeOnlyFavoriteLoading || isProcessingArchiveApi) {
      setIsLoadingForModal(true);
      modifiedData = {
        ...data,
      };
    } else {
      setIsAddNewProcessApiLoading(true);
      modifiedData = {
        ...clickedProcess,
        ...data,
        processType: { id: data.processTypeId ?? clickedProcess.processType },
      };
    }

    try {
      const res = await updateExistingProcessApi(modifiedData, modifiedData[MANAGER_API_KEYS.WORKFLOW_ID]);

      if (res) {
        if (changeOnlyFavoriteLoading) {
          if (modifiedData[MANAGER_API_KEYS.IS_FAVORITE]) {
            toast.success('The Process has been added to Favorites successfully...');
          } else {
            toast.success('The Process has been removed from Favorites successfully...');
          }
        } else if (isProcessingArchiveApi) {
          if (modifiedData[MANAGER_API_KEYS.IS_ARCHIVED]) {
            toast.success('The Process has been archived successfully...');
          } else {
            toast.success('The Process has been unarchived successfully...');
          }
        } else {
          toast.success('The Process has been updated successfully...');
        }

        if (data[DEACTIVATE_TRIGGER_API]) {
          data[DEACTIVATE_TRIGGER_API]();
        }

        if (activeMenu !== CHANGE_PROCESS_MANAGER_MENUS.EDIT_PROCESS_DETAILS) {
          goBackToPrimaryMenu();
          setShowSettingsSideDrawer(false);
        }

        setShowMoveElementToArchive(false);
        refetch(true);
        fetchAllTagsFilters(false);
      }
    } catch (error) {
      const errorText = error.response?.data?.message;

      toast.error(errorText || 'Something went wrong...');
    } finally {
      setAddNewProcessFormCollector((prev) => ({
        ...prev,
        [ADD_NEW_PROCESS_KEYS.initiateApi]: false,
      }));
      setSaveButtonConfigurations(SAVE_BUTTON_CONFIGURATION_SCHEMA);

      setIsAddNewProcessApiLoading(false);
      setIsLoadingForModal(false);
    }
  };

  const runDeleteProcessApi = async (apiData) => {
    setIsLoadingForModal(true);

    try {
      const res = await deleteProcess(apiData[MANAGER_API_KEYS.WORKFLOW_ID]);

      if (res) {
        toast.success('The Process has been deleted successfully...');

        setShowSettingsSideDrawer(false);
        closeDeleteElementModal();
        refetch(true);
        fetchAllTagsFilters(false);
        goBackToPrimaryMenu();
        delayedProcessApisInvalidation();
      }
    } catch (error) {
      toast.error('Something went wrong...');
    } finally {
      setIsLoadingForModal(false);
    }
  };

  const initiateAddNewProcessApi = async (formData) => {
    const data = {
      displayName: formData.displayName || formData.processName,
      description: formData.description || formData.processDescription,
      tags: formData.tags,
      processTypeId: formData.processTypeId,
      users: formData.users || clickedProcess.users,
      userGroups: formData.userGroups || clickedProcess.userGroups,
    };

    if (formData.isUpdating) {
      await runUpdateElementApi(data);
    } else {
      await runCreateNewProcessApi(data);
    }
  };

  const { duplicateProcess, isDuplicateProcessLoading } = useDuplicateProcess({
    onSuccess: () => {
      setShowProcessManagerModal(null);

      // TODO customize toast with link
      toast.success('Process was successfully duplicated');

      delayedProcessApisInvalidation();
    },
    onError: () => toast.error('Something went wrong!'),
  });

  const { exportProcess, isExportProcessLoading } = useExportProcess({
    onSuccess: (data, variables) => {
      const jsonString = JSON.stringify({ ...data, processType: variables.processType });
      const blob = new Blob([jsonString], { type: MANAGERS_IMPORT_JSON_FORMAT.FILE_TYPE });

      FileDownload(blob, `${variables.processName}-process-exported.json`);
      toast.info('Downloading file. This may take a while, please wait…');
    },
    onError: () => toast.error('Something went wrong!'),
  });

  const { importProcess, isImportProcessLoading } = useImportProcess({
    onSuccess: (data, variables) => {
      toast.success(`${variables.processName} has been imported`);
      setShowProcessManagerModal(null);

      delayedProcessApisInvalidation();
    },
    onError: () => toast.error('Something went wrong!'),
  });

  const { importAndReplaceProcess, isImportAndReplaceProcessLoading } = useImportAndReplaceProcess({
    onSuccess: (data, variables) => {
      toast.success(`${variables.fileName} has been imported, and has replaced ${variables.processName}`);
      setShowProcessManagerModal(null);

      delayedProcessApisInvalidation();
    },
    onError: () => toast.error('Something went wrong!'),
  });

  const handleImportProcess = ({ fileContent, processTypeId, users, userGroups }) => {
    const jsonString = JSON.stringify(fileContent);
    const blob = new Blob([jsonString], { type: MANAGERS_IMPORT_JSON_FORMAT.FILE_TYPE });

    const formDataPayload = new FormData();
    formDataPayload.append('file', blob);
    formDataPayload.append('users', users);
    formDataPayload.append('userGroups', userGroups);

    importProcess({
      payload: formDataPayload,
      params: new URLSearchParams({
        processTypeId,
      }),
      processName: fileContent?.attributes?.displayName,
    });
  };

  const { processes: allProcessesOptions } = useProcesses({
    params: {
      pageSize: 10000,
    },
    options: {
      select: (res) =>
        res?.content?.map((process) => ({ label: process.displayName, value: process.displayName })) || [],
    },
  });

  const invalidateAllProcessApis = () => {
    queryClient.invalidateQueries({ queryKey: [GET_WORKFLOWS] });
    queryClient.invalidateQueries({ queryKey: [GET_PROCESS_DEFINITIONS] });

    refetch(true);
    fetchAllTagsFilters(false);
  };

  const delayedProcessApisInvalidation = () =>
    setTimeout(() => {
      invalidateAllProcessApis();
    }, REFETCH_TIMEOUT_SECONDS);

  const closeDeleteElementModal = () => {
    setShowDeleteElementModal(false);
  };

  const cleanAllTestFilters = () => {
    setSelectTagsFilter([]);
    setSelectStatusFilter([]);
    setSelectTypeFilter([]);
    setFilterTriggerQuery(FILTER_TEMPLATE);
    setFilterQuery(FILTER_TEMPLATE);
    setSearchFilterAPI('');
    setShowFilterModal(false);
  };

  const onImportNewProcessClick = () => inputImportFileRef?.current?.click();

  const onImportAndReplaceProcessClick = () =>
    setShowProcessManagerModal({
      type: SHOW_PROCESS_MANAGER_MODAL_TYPES.IMPORT_AND_REPLACE_PROCESS,
    });

  const handleImportFileUpload = async (event) => {
    setIsImportButtonLoading(true);
    const file = event.target.files?.[0];
    const isJson = isFileInJsonFormat(file?.name);

    if (inputImportFileRef?.current) inputImportFileRef.current.value = '';

    if (!isJson) {
      toast.error('Only "json" files are accepted');
      setIsImportButtonLoading(false);
      return;
    }

    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        const isFileSchemaValid = await validateYupSchemaAsync(processImportedFileSchema, jsonData);

        if (!isFileSchemaValid) {
          toast.error(PROCESS_IMPORTED_FILE_INVALID_MSG);
          setIsImportButtonLoading(false);
          return;
        }

        const { processType, ...fileContent } = jsonData;

        setShowProcessManagerModal({
          type: SHOW_PROCESS_MANAGER_MODAL_TYPES.IMPORT_NEW_PROCESS,
          data: jsonData?.attributes
            ? {
                ...jsonData.attributes,
                fileContent,
                processType,
              }
            : {},
        });
      } catch (error) {
        console.error('Error parsing JSON:', error);
      } finally {
        setIsImportButtonLoading(false);
      }
    };

    reader.readAsText(file);
  };

  const handleCloseSettingsSideModal = () => {
    if (showUnsavedChangesModalOpen?.dirty) {
      setShowUnsavedChangesModalOpen((prev) => ({
        ...prev,
        isOpen: true,
      }));

      return;
    }

    setShowSettingsSideDrawer(false);
  };

  const isImportNewProcessModalOpen =
    showProcessManagerModal?.type === SHOW_PROCESS_MANAGER_MODAL_TYPES.IMPORT_NEW_PROCESS;

  const isImportReplaceProcessModalOpen =
    showProcessManagerModal?.type === SHOW_PROCESS_MANAGER_MODAL_TYPES.IMPORT_AND_REPLACE_PROCESS;

  const ClearAllTestViewFilters = ({ displayOnlyCleanFilterBtn }) => {
    const resetFilters = () => {
      cleanAllTestFilters();
      setViewBackupFilters();
    };

    if (displayOnlyCleanFilterBtn) {
      return (
        <div className={`${classes.whiteSpaceNoWrap} ${classes.centerVertically}`}>
          <StyledButton variant="text" onClick={resetFilters}>
            Clear All Filters
          </StyledButton>
        </div>
      );
    }

    return (
      <div className={`${classes.flex_between} ${classes.paddingAllSides}`}>
        <div className={classes.filterBy}>Filter By</div>
        <StyledButton variant="text" onClick={resetFilters}>
          Clear All Filters
        </StyledButton>
      </div>
    );
  };

  ClearAllTestViewFilters.propTypes = {
    displayOnlyCleanFilterBtn: PropTypes.bool,
  };

  const removeSelectedString = (stringToBeRemoved = '', mainString = '') => {
    const stringArray = mainString.split(',');
    const getRemoveWordIndex = stringArray.indexOf(stringToBeRemoved);
    let finalString = '';

    if (stringArray.length === 1) {
      finalString = mainString.replace(stringToBeRemoved, '');
      return finalString;
    }

    if (getRemoveWordIndex === 0) {
      finalString = mainString.replace(`${stringToBeRemoved},`, '');
    } else {
      finalString = mainString.replace(`,${stringToBeRemoved}`, '');
    }

    return finalString;
  };

  const ComputeViewAppliedFilters = useCallback(() => {
    const testFilterDataSet = [];

    if (searchFilterAPI?.length > 0) {
      testFilterDataSet.push({
        boldTitle: 'Search: ',
        modifiedString: searchFilterAPI,
        resetFilter: () => {
          setSearchFilterAPI('');
          setFilterTriggerQuery((prev) => ({
            ...prev,
            [FILTER_TEMPLATE_KEYS.searchFilterAPI]: '',
          }));
          setFilterQuery((prev) => ({
            ...prev,
            [FILTER_TEMPLATE_KEYS.searchFilterAPI]: '',
          }));
        },
      });
    }

    if (viewBackupFilters?.selectTagsFilter?.length > 0) {
      viewBackupFilters.selectTagsFilter.forEach((item) => {
        testFilterDataSet.push({
          boldTitle: 'Tags: ',
          modifiedString: item.label,
          resetFilter: () => {
            setSelectTagsFilter(viewBackupFilters.selectTagsFilter.filter((removeItem) => removeItem !== item));

            setFilterTriggerQuery((prev) => ({
              ...prev,
              [FILTER_TEMPLATE_KEYS.tagsFilter]: removeSelectedString(
                item.value,
                prev[FILTER_TEMPLATE_KEYS.tagsFilter]
              ),
            }));

            setFilterQuery((prev) => ({
              ...prev,
              [FILTER_TEMPLATE_KEYS.tagsFilter]: removeSelectedString(
                item.value,
                prev[FILTER_TEMPLATE_KEYS.tagsFilter]
              ),
            }));

            setViewBackupFilters((prev) => ({
              ...prev,
              selectTagsFilter: viewBackupFilters.selectTagsFilter.filter((removeItem) => removeItem !== item),
            }));
          },
        });
      });
    }

    if (viewBackupFilters?.selectStatusFilter?.length > 0) {
      viewBackupFilters.selectStatusFilter.forEach((item) => {
        testFilterDataSet.push({
          boldTitle: 'Status: ',
          modifiedString: item.label,
          resetFilter: () => {
            setSelectStatusFilter(viewBackupFilters.selectStatusFilter.filter((removeItem) => removeItem !== item));

            setFilterTriggerQuery((prev) => ({
              ...prev,
              [FILTER_TEMPLATE_KEYS.statusFilter]: removeSelectedString(
                item.value,
                prev[FILTER_TEMPLATE_KEYS.statusFilter]
              ),
            }));

            setFilterQuery((prev) => ({
              ...prev,
              [FILTER_TEMPLATE_KEYS.statusFilter]: removeSelectedString(
                item.value,
                prev[FILTER_TEMPLATE_KEYS.statusFilter]
              ),
            }));

            setViewBackupFilters((prev) => ({
              ...prev,
              selectStatusFilter: viewBackupFilters.selectStatusFilter.filter((removeItem) => removeItem !== item),
            }));
          },
        });
      });
    }

    if (viewBackupFilters?.selectTypeFilter?.length > 0) {
      viewBackupFilters.selectTypeFilter.forEach((item) => {
        const removeType = viewBackupFilters.selectTypeFilter.filter((removeItem) => removeItem !== item);
        testFilterDataSet.push({
          boldTitle: 'Type: ',
          modifiedString: item.label,
          resetFilter: () => {
            setSelectTypeFilter(removeType);

            setFilterTriggerQuery((prev) => ({
              ...prev,
              [FILTER_TEMPLATE_KEYS.typeFilter]: removeSelectedString(
                item.value,
                prev[FILTER_TEMPLATE_KEYS.typeFilter]
              ),
            }));

            setFilterQuery((prev) => ({
              ...prev,
              [FILTER_TEMPLATE_KEYS.typeFilter]: removeSelectedString(
                item.value,
                prev[FILTER_TEMPLATE_KEYS.typeFilter]
              ),
            }));

            setViewBackupFilters((prev) => ({
              ...prev,
              selectTypeFilter: removeType,
            }));
          },
        });
      });
    }

    if (
      viewBackupFilters?.[CALENDAR_DATE_KEYS.EDITED_AFTER]?.length > 0 &&
      viewBackupFilters?.[CALENDAR_DATE_KEYS.EDITED_BEFORE]?.length > 0
    ) {
      testFilterDataSet.push({
        boldTitle: 'Last Edited Date: ',

        modifiedString: modifyAppliedFilterTimeStampsWithoutTime(
          viewBackupFilters?.[CALENDAR_DATE_KEYS.EDITED_AFTER],
          viewBackupFilters?.[CALENDAR_DATE_KEYS.EDITED_BEFORE]
        ),
        resetFilter: () => {
          setFilterTriggerQuery((prev) => ({
            ...prev,
            [CALENDAR_DATE_KEYS.EDITED_AFTER]: '',
            [CALENDAR_DATE_KEYS.EDITED_BEFORE]: '',
          }));
          setFilterQuery((prev) => ({
            ...prev,
            [CALENDAR_DATE_KEYS.EDITED_AFTER]: '',
            [CALENDAR_DATE_KEYS.EDITED_BEFORE]: '',
          }));
          setViewBackupFilters((prev) => ({
            ...prev,
            [CALENDAR_DATE_KEYS.EDITED_AFTER]: '',
            [CALENDAR_DATE_KEYS.EDITED_BEFORE]: '',
          }));
        },
      });
    }

    if (
      viewBackupFilters?.[CALENDAR_DATE_KEYS.CREATED_AFTER]?.length > 0 &&
      viewBackupFilters?.[CALENDAR_DATE_KEYS.CREATED_BEFORE]?.length > 0
    ) {
      testFilterDataSet.push({
        boldTitle: 'Created Date: ',

        modifiedString: modifyAppliedFilterTimeStampsWithoutTime(
          viewBackupFilters?.[CALENDAR_DATE_KEYS.CREATED_AFTER],
          viewBackupFilters?.[CALENDAR_DATE_KEYS.CREATED_BEFORE]
        ),
        resetFilter: () => {
          setFilterTriggerQuery((prev) => ({
            ...prev,
            [CALENDAR_DATE_KEYS.CREATED_AFTER]: '',
            [CALENDAR_DATE_KEYS.CREATED_BEFORE]: '',
          }));
          setFilterQuery((prev) => ({
            ...prev,
            [CALENDAR_DATE_KEYS.CREATED_AFTER]: '',
            [CALENDAR_DATE_KEYS.CREATED_BEFORE]: '',
          }));
          setViewBackupFilters((prev) => ({
            ...prev,
            [CALENDAR_DATE_KEYS.CREATED_AFTER]: '',
            [CALENDAR_DATE_KEYS.CREATED_BEFORE]: '',
          }));
        },
      });
    }

    return (
      <>
        {testFilterDataSet?.length > 0 ? (
          <div className={`${classes.flex_row_component} ${classes.paddingTop12px}`} ref={appliedFiltersRef}>
            <ClearAllTestViewFilters displayOnlyCleanFilterBtn />
            <div className={`${classes.flex_row_component} ${classes.flex_wrap}`}>
              {testFilterDataSet?.map((item, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <div className={classes.filterRowBg} key={index}>
                  <div className={classes.boldTitle}>{item.boldTitle}</div>
                  <div className={classes.modifiedString}>{item.modifiedString}</div>
                  <div className={classes.crossIcon} onClick={item.resetFilter}>
                    <img src={crossIconTable} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div />
        )}
      </>
    );
  }, [viewBackupFilters, searchFilterAPI]);

  return (
    <PageLayout
      top={
        <SubNavBar
          searchFilterAPI={searchFilterAPI}
          addNewElementButtonTitle="New Process"
          setSearchFilterAPI={setSearchFilterAPI}
          setShowFilterModal={setShowFilterModal}
          setSelectSortByDateOrName={setSelectSortByDateOrName}
          selectSortByDateOrName={selectSortByDateOrName}
          setShowAddNewElementModal={setShowAddNewProcessModal}
          setCurrentView={setCurrentView}
          currentView={currentView}
          isFilterApplied={isFilterApplied}
          SORTBY_DATE_FILTER={SORTBY_DATE_FILTER}
          SUB_NAVBAR_TITLES={SUB_NAVBAR_TITLES}
          pagination={requests?.pagination}
          isProcessManagerView
          isLoading={isFetching}
          onImportAsNewClick={onImportNewProcessClick}
          onImportAndReplaceClick={onImportAndReplaceProcessClick}
          isImportButtonLoading={
            isImportButtonLoading || isImportNewProcessModalOpen || isImportReplaceProcessModalOpen
          }
        />
      }
    >
      <ContentLayout fullHeight>
        <div
          className={`${classes.scrollbarRoot}
       ${currentView === ALL_TABS.FAVORITES && classes.favoritesSectionRoot}`}
        >
          <ComputeViewAppliedFilters />

          <ManagerCards
            setClickedProcess={setClickedProcess}
            setShowSettingsSideDrawer={setShowSettingsSideDrawer}
            setShowAllTagsSideDrawer={setShowAllTagsSideDrawer}
            setShowMoveElementToArchive={setShowMoveElementToArchive}
            isProcessManagerView
            data={requests?.content}
            error={error}
            isLoading={isFetching || isLoadingForModal}
            runUpdateElementApi={runUpdateElementApi}
            getDataForNoDataFoundComponent={getDataForNoDataFoundComponent}
            currentView={currentView}
            pagination={requests?.pagination}
            onPageChange={onPageChange}
            scrollToTopRef={scrollToTopRef}
            handleTagOnClickForTags={handleTagClickForManagerTags}
            setTriggerOpenTestCasesSideModal={setTriggerOpenTestCasesSideModal}
            triggerOpenTestCasesSideModal={triggerOpenTestCasesSideModal}
            setShowIsProcessStatusChanged={setShowIsProcessStatusChanged}
          />
        </div>
      </ContentLayout>

      <SidedrawerModal
        show={showSettingsSideDrawer}
        closeModal={handleCloseSettingsSideModal}
        width="600px"
        padding="0"
        closeBtnClassName={classes.sideModalCloseIcon}
        useCloseBtnClassName
        className={classes.hideOverflow}
      >
        <SettingsSideDrawer
          isProcessManagerView
          setShowMoveElementToArchive={setShowMoveElementToArchive}
          setShowDeleteElementModal={setShowDeleteElementModal}
          filterQuery={filterQuery}
          viewBackupFilters={viewBackupFilters}
          setFilterQuery={setFilterQuery}
          clickedProcess={clickedProcess}
          setAddNewElementFormCollector={setAddNewProcessFormCollector}
          addNewElementFormCollector={addNewProcessFormCollector}
          isUpdateElementLoading={isAddNewProcessApiLoading}
          runUpdateElementApi={runUpdateElementApi}
          setActiveMenu={setActiveMenu}
          activeMenu={activeMenu}
          goBackToPrimaryMenu={goBackToPrimaryMenu}
          showSettingsSideDrawer={showSettingsSideDrawer}
          setShowSettingsSideDrawer={setShowSettingsSideDrawer}
          setShowIsProcessStatusChanged={setShowIsProcessStatusChanged}
          setSaveButtonConfigurations={setSaveButtonConfigurations}
          saveButtonConfigurations={saveButtonConfigurations}
          exportProcess={exportProcess}
          isExportProcessLoading={isExportProcessLoading}
          setShowProcessManagerModal={setShowProcessManagerModal}
          setShowUnsavedChangesModalOpen={setShowUnsavedChangesModalOpen}
          showUnsavedChangesModalOpen={showUnsavedChangesModalOpen}
        />
      </SidedrawerModal>

      <SidedrawerModal
        show={showFilterModal}
        closeModal={() => setShowFilterModal(false)}
        width={fixedLargeSideModalWidth}
        padding="0"
        closeBtnClassName={classes.sideModalCloseIcon}
        useCloseBtnClassName
      >
        <AdditionalFilters
          isTestManagerFilterModal
          showFilterModal={showFilterModal}
          setShowFilterModal={setShowFilterModal}
          ClearAllTestViewFilters={ClearAllTestViewFilters}
          selectTagsFilter={selectTagsFilter}
          setSelectTagsFilter={setSelectTagsFilter}
          setSelectStatusFilter={setSelectStatusFilter}
          selectStatusFilter={selectStatusFilter}
          setSelectTypeFilter={setSelectTypeFilter}
          selectTypeFilter={selectTypeFilter}
          setViewBackupFilters={setViewBackupFilters}
          viewBackupFilters={viewBackupFilters}
          setFilterTriggerQuery={setFilterTriggerQuery}
          filterTriggerQuery={filterTriggerQuery}
          filterQuery={filterQuery}
          currentView={currentView}
          allTagsForFilters={allTagsForFilters}
          setFilterQuery={setFilterQuery}
        />
      </SidedrawerModal>
      <SidedrawerModal
        show={showAllTagsSideDrawer}
        closeModal={() => setShowAllTagsSideDrawer(false)}
        width={fixedSideModalWidth}
        padding="0"
        closeBtnClassName={classes.sideModalCloseIcon}
        useCloseBtnClassName
      >
        <AllTagsSideModal
          name={clickedProcess?.[MANAGER_API_KEYS.DISPLAY_NAME]}
          allTags={clickedProcess?.[MANAGER_API_KEYS.TAGS]}
          onTagClickFn={handleTagClickForManagerTags}
        />
      </SidedrawerModal>

      {showAddNewProcessModal && (
        <ProcessManagerAddModal
          isLoading={isAddNewProcessApiLoading}
          onClose={() => setShowAddNewProcessModal(false)}
          onCreate={(values) =>
            setAddNewProcessFormCollector({
              ...values,
              [INITIATE_API_KEY]: true,
            })
          }
        />
      )}

      <Modal
        show={showMoveElementToArchive}
        modalClosed={() => setShowMoveElementToArchive(false)}
        className={classes.status_change_modal}
      >
        <MoveTicketStatusToArchiveModal
          setShowMoveElementToArchive={setShowMoveElementToArchive}
          isProcessManagerView
          runUpdateElementApi={runUpdateElementApi}
          clickedProcess={clickedProcess}
          isLoading={isLoadingForModal}
        />
      </Modal>
      <Modal
        show={showDeleteAccountModal}
        modalClosed={closeDeleteElementModal}
        className={classes.modalDisableDeleteAccount}
      >
        <div className={classes.closeIcon_paymentModal} onClick={() => closeIconClick.current()}>
          <CloseIcon className={classes.closeIcon} />
        </div>
        <DeleteDisableElementModal
          runDeleteElementApi={runDeleteProcessApi}
          isLoading={isLoadingForModal}
          clickedProcess={clickedProcess}
          isDeleteElement
          isProcessManagerView
          closeDeleteElementModal={closeDeleteElementModal}
          validationText={DELETE_ELEMENT_LABEL.label}
          activateValidationWordLength={DELETE_ELEMENT_LABEL.activateValidationWordLength}
          closeIconClick={closeIconClick}
        />
      </Modal>
      <Modal
        show={showIsProcessStatusChanged.showModal}
        modalClosed={() => setShowIsProcessStatusChanged(CHANGE_PROCESS_STATUS_SCHEMA)}
        className={classes.status_change_modal}
      >
        <ChangeTicketStatusModal
          setShowIsProcessStatusChanged={setShowIsProcessStatusChanged}
          clickedProcess={clickedProcess}
          showIsProcessStatusChanged={showIsProcessStatusChanged}
          CHANGE_PROCESS_STATUS_SCHEMA={CHANGE_PROCESS_STATUS_SCHEMA}
          updateExistingProcessApi={updateExistingProcessApi}
          fetchData={refetch}
          setShowSettingsSideDrawer={setShowSettingsSideDrawer}
        />
      </Modal>
      {showProcessManagerModal?.type === SHOW_PROCESS_MANAGER_MODAL_TYPES.DUPLICATE_PROCESS &&
        !!allProcessesOptions?.length && (
          <ProcessManagerDuplicateModal
            data={showProcessManagerModal?.data}
            onClose={() => setShowProcessManagerModal(null)}
            duplicateProcess={duplicateProcess}
            isLoading={isDuplicateProcessLoading}
            allProcessesOptions={allProcessesOptions}
          />
        )}
      {isImportNewProcessModalOpen && (
        <ProcessManagerDuplicateModal
          data={showProcessManagerModal?.data}
          onClose={() => setShowProcessManagerModal(null)}
          isLoading={isImportProcessLoading || isFetching}
          allProcessesOptions={allProcessesOptions}
          headerTitle="Import New Process"
          submitBtnTitle="Confirm"
          handleImportProcess={handleImportProcess}
          isImportProcessModal
        />
      )}
      {isImportReplaceProcessModalOpen && (
        <ProcessManagerImportReplaceModal
          onClose={() => setShowProcessManagerModal(null)}
          allProcessesOptions={allProcessesOptions}
          onSubmit={importAndReplaceProcess}
          isLoading={isImportAndReplaceProcessLoading || isFetching}
        />
      )}
      <StyledDummyInput
        type="file"
        hidden
        ref={inputImportFileRef}
        onChange={handleImportFileUpload}
        accept={`.${MANAGERS_IMPORT_JSON_FORMAT.EXTENSION}`}
      />
    </PageLayout>
  );
};

export default ProcessManager;

ProcessManager.propTypes = {
  scrollToTopRef: PropTypes.object,
};
