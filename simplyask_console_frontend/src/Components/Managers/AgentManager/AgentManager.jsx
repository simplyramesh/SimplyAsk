import CloseIcon from '@mui/icons-material/Close';
import { useQueryClient } from '@tanstack/react-query';
import FileDownload from 'js-file-download';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Modal, SidedrawerModal } from 'simplexiar_react_components';

import crossIconTable from '../../../Assets/icons/crossIconTable.svg';
import processManagerAllIcon from '../../../Assets/icons/processManagerAllIcon.svg';
import processManagerArchiveIconBold from '../../../Assets/icons/processManagerArchiveIconBold.svg';
import processManagerStarIconBold from '../../../Assets/icons/processManagerStarIconBold.svg';
import { MANAGER_API_KEYS } from '../../../config/managerKeys';
import routes from '../../../config/routes';
import useGetAllPhoneNumberIds from '../../../hooks/phoneNumberManagement/useGetAllPhoneNumberIds';
import useAxiosGet from '../../../hooks/useAxiosGet';
import { useFixedSideModalWidth } from '../../../hooks/useSideModalWidth';
import useTabs from '../../../hooks/useTabs';
import { deleteAgent, updateAgentDetails } from '../../../Services/axios/agentManager';
import { DEFAULT_API } from '../../../Services/axios/AxiosInstance';
import {
  extractStringsFromArrayOfObjects,
  modifyAppliedFilterTimeStampsWithoutTime,
} from '../../../utils/helperFunctions';
import { GET_ALL_AGENTS, useGetAllAgents } from '../../ConverseDashboard/hooks/useGetAllAgents';
import { StyledDummyInput } from '../../Settings/Components/PublicSubmissionForm/components/StyledPublicSubmissionForm';
import { CALENDAR_DATE_KEYS } from '../../shared/Calendars/PredefinedOptionsCalendar/CalendarComponent';
import { INITIATE_API_KEY, IS_UPDATING_ELEMENT, TAGS_KEY } from '../../shared/constants/core';
import ManagerCards from '../../shared/ManagerComponents/ManagerCards/ManagerCards';
import AddNewProcessModal from '../../shared/ManagerComponents/Modals/SharedModals/AddNewProcessModal/AddNewProcessModal';
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
import { NO_AGENTS_DATA_TEXTS } from '../../shared/NoDataFound/NoDataFound';
import { StyledButton } from '../../shared/REDISIGNED/controls/Button/StyledButton';
import ContentLayout from '../../shared/REDISIGNED/layouts/ContentLayout/ContentLayout';
import PageLayout from '../../shared/REDISIGNED/layouts/PageLayout/PageLayout';
import { MANAGERS_IMPORT_JSON_FORMAT, REFETCH_TIMEOUT_SECONDS } from '../shared/constants/common';
import { isFileInJsonFormat, validateYupSchemaAsync } from '../shared/utils/validation';

import { useGetCurrentUser } from '../../../hooks/useGetCurrentUser';
import classes from './AgentManager.module.css';
import AgentManagerDuplicateModal from './AgentManagerModals/AgentManagerDuplicateModal/AgentManagerDuplicateModal';
import AgentManagerImportReplaceModal from './AgentManagerModals/AgentManagerImportReplaceModal/AgentManagerImportReplaceModal';
import AgentManagerModalsAddPhoneNumber from './AgentManagerModals/AgentManagerModalPhoneNumber/AgentManagerModalsAddPhoneNumber';
import AgentManagerModalsAddWidget from './AgentManagerModals/AgentManagerModalsAddWidget';
import { AGENT_QUERY_KEYS, SHOW_AGENT_MANAGER_MODAL_TYPES } from './constants/core';
import useAgents from './hooks/useAgents';
import useCreateAgent from './hooks/useCreateAgent';
import useDuplicateAgent from './hooks/useDuplicateAgent';
import useExportAgent from './hooks/useExportAgent';
import useImportAgent from './hooks/useImportAgent';
import useImportAndReplaceAgent from './hooks/useImportAndReplaceAgent';
import AdditionalFilters from './SideModals/AdditionalFilters/AdditionalFilters';
import { AGENT_IMPORTED_FILE_INVALID_MSG, agentImportedFileSchema } from './utils/validations';

export const SORTBY_DATE_FILTER = [
  {
    value: 0,
    label: 'Edited Date - Newest First',
    sortingFilter: 'updatedAt',
    isAscending: false,
  },
  {
    value: 1,
    label: 'Edited Date - Oldest First',
    sortingFilter: 'updatedAt',
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
    label: 'Agent Name (A → Z)',
    sortingFilter: 'name',
    isAscending: true,
  },
  {
    value: 5,
    label: 'Agent Name (Z → A)',
    sortingFilter: 'name',
    isAscending: false,
  },
];

export const KEY_TO_ACCESS_FILTERS = 'label';

export const ALL_TABS = {
  ALL_CARDS: 1,
  FAVORITES: 2,
  ARCHIVED: 3,
};

export const ADD_NEW_AGENT_KEYS = {
  agentName: 'name',
  agentDescription: 'description',
  agentType: 'type',
  tags: TAGS_KEY,
  initiateApi: INITIATE_API_KEY,
};

export const ADD_NEW_AGENT_FORM_SCHEMA = {
  [ADD_NEW_AGENT_KEYS.agentName]: '',
  [ADD_NEW_AGENT_KEYS.agentDescription]: '',
  [ADD_NEW_AGENT_KEYS.tags]: [],
  [ADD_NEW_AGENT_KEYS.agentType]: '',
  [ADD_NEW_AGENT_KEYS.initiateApi]: false,
};

export const ADD_NEW_MODAL_TITLES = {
  headerTitle: 'New Agent',
  elementTitleName: 'Agent Name',
  descriptionTitleName: 'Agent Description',
  tagsTitleName: 'Tags',
  agentType: 'Agent Type',
};

const DELETE_ELEMENT_LABEL = {
  label: 'delete agent',
  activateValidationWordLength: 12,
};

const SUB_NAVBAR_TITLES = [
  {
    value: ALL_TABS.ALL_CARDS,
    title: 'All Agents',
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
  searchFilterAPI: 'searchFilterAPI',
  sortBy: 'sortBy',
  pageNumber: 'pageNumber',
};

const FILTER_TEMPLATE = {
  [FILTER_TEMPLATE_KEYS.tagsFilter]: '',
  [FILTER_TEMPLATE_KEYS.searchFilterAPI]: '',
  [FILTER_TEMPLATE_KEYS.sortBy]: {},
  [FILTER_TEMPLATE_KEYS.pageNumber]: 0,
  [CALENDAR_DATE_KEYS.EDITED_AFTER]: '',
  [CALENDAR_DATE_KEYS.EDITED_BEFORE]: '',
  [CALENDAR_DATE_KEYS.CREATED_AFTER]: '',
  [CALENDAR_DATE_KEYS.CREATED_BEFORE]: '',
};

const AgentManager = ({ scrollToTopRef }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [currentView, setCurrentView] = useState(ALL_TABS.ALL_CARDS);

  const [showAgentManagerModal, setShowAgentManagerModal] = useState(null);

  // Data states
  const [searchFilterAPI, setSearchFilterAPI] = useState('');
  const [viewBackupFilters, setViewBackupFilters] = useState();
  const [filterQuery, setFilterQuery] = useState(FILTER_TEMPLATE);
  const [filterTriggerQuery, setFilterTriggerQuery] = useState(FILTER_TEMPLATE);
  const [addNewAgentFormCollector, setAddNewAgentFormCollector] = useState(ADD_NEW_AGENT_FORM_SCHEMA);
  const [selectTagsFilter, setSelectTagsFilter] = useState([]);
  const [selectStatusFilter, setSelectStatusFilter] = useState([]);
  const [selectSortByDateOrName, setSelectSortByDateOrName] = useState(SORTBY_DATE_FILTER[0]);
  const closeIconClick = useRef(null);
  const queryClient = useQueryClient();
  const { tabValue, onTabChange } = useTabs(0);

  const { currentUser } = useGetCurrentUser();
  const { agents, isAgentsLoading } = useAgents(
    {
      pageSize: 24,
      sortOrder: selectSortByDateOrName.sortingFilter,
      isAscending: selectSortByDateOrName.isAscending,
      isArchived: currentView === ALL_TABS.ARCHIVED,
      isFavourite: currentView === ALL_TABS.FAVORITES,
      searchText: searchFilterAPI,
      tags: filterTriggerQuery[FILTER_TEMPLATE_KEYS.tagsFilter],
      updatedAfter: filterTriggerQuery[CALENDAR_DATE_KEYS.EDITED_AFTER],
      updatedBefore: filterTriggerQuery[CALENDAR_DATE_KEYS.EDITED_BEFORE],
      createdAfter: filterTriggerQuery[CALENDAR_DATE_KEYS.CREATED_AFTER],
      createdBefore: filterTriggerQuery[CALENDAR_DATE_KEYS.CREATED_BEFORE],
      pageNumber: filterTriggerQuery[FILTER_TEMPLATE_KEYS.pageNumber],
      timezone: currentUser?.timezone,
    },
    {
      select: (res) => ({
        ...res,
        pagination: {
          pageNumber: res?.pageable.pageNumber + 1,
          totalPages: res?.totalPages,
          totalElements: res?.totalElements,
          numberOfElements: res?.numberOfElements,
          startingPoint: res?.pageable.offset + (res?.numberOfElements ? 1 : 0),
          endingPoint: res?.pageable.offset + res?.numberOfElements,
        },
      }),
    }
  );

  const associatedPhoneNumberIds =
    agents?.content
      ?.map((agent) => agent.associatedPhoneNumbers)
      .flat()
      .join(',') || null;
  const { filteredPhoneNumberIds, isPhoneNumberIdsFetching } = useGetAllPhoneNumberIds(associatedPhoneNumberIds);

  const filteredAgentData = agents?.content?.map((agent) => {
    const updatedAssociatedPhoneNumbers = agent?.associatedPhoneNumbers?.filter((phoneNumberId) =>
      filteredPhoneNumberIds?.some((filteredPhoneNumber) => filteredPhoneNumber?.telephoneNumberId === phoneNumberId)
    );
    return {
      ...agent,
      associatedPhoneNumbers: updatedAssociatedPhoneNumbers,
    };
  });

  const { createNewAgent, isAgentCreating } = useCreateAgent({
    onSuccess: ({ data }) => {
      toast.success(`Agent "${data.name}" was created!`);

      navigate(`${routes.AGENT_MANAGER}/${data.agentId}`);
    },
    onError: (e) => {
      console.log(e);
      toast.error(e.response?.data?.message || 'Something went wrong!');
    },
  });

  const { duplicateAgent, isDuplicateAgentLoading } = useDuplicateAgent({
    onSuccess: () => {
      setShowAgentManagerModal(null);

      // TODO customize toast with link
      toast.success('Agent was successfully duplicated');
      delayedAgentApisInvalidation();
    },
    onError: () => toast.error('Something went wrong!'),
  });

  const { allAgents: allAgentsOptions, isAllAgentsLoading } = useGetAllAgents(
    new URLSearchParams({
      pageSize: 999,
    }),
    {
      select: (res) => res?.content || [],
    }
  );

  const { response: allTagsForFilters, fetchData: fetchAllTagsFilters } = useAxiosGet(
    '/AgentManager/tags',
    true,
    DEFAULT_API
  );

  const isMediumWidth = true;

  const fixedSideModalWidth = useFixedSideModalWidth(isMediumWidth);
  const fixedLargeSideModalWidth = useFixedSideModalWidth();

  // Modals and SideDrawers
  const [showMoveElementToArchive, setShowMoveElementToArchive] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showAddNewProcessModal, setShowAddNewProcessModal] = useState(false);
  const [showSettingsSideDrawer, setShowSettingsSideDrawer] = useState(false);
  const [showAllTagsSideDrawer, setShowAllTagsSideDrawer] = useState(false);
  const [showDeleteAccountModal, setShowDeleteElementModal] = useState(false);
  const [preventGoBackToPrimaryMenu, setPreventGoBackToPrimaryMenu] = useState(false);
  const [saveButtonConfigurations, setSaveButtonConfigurations] = useState(SAVE_BUTTON_CONFIGURATION_SCHEMA);
  const [isAddPhoneNumberModalOpen, setIsAddPhoneNumberModalOpen] = useState(false);
  const [isAddWidgetModalOpen, setIsAddWidgetModalOpen] = useState(false);

  const inputImportFileRef = useRef(null);

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

  const { exportAgent, isExportAgentLoading } = useExportAgent({
    onSuccess: (data, variables) => {
      const jsonString = JSON.stringify(data);
      const blob = new Blob([jsonString], { type: MANAGERS_IMPORT_JSON_FORMAT.FILE_TYPE });

      FileDownload(blob, `${variables.agentName}-agent-exported.json`);
      toast.info('Downloading file. This may take a while, please wait…');
    },
    onError: () => toast.error('Something went wrong!'),
  });

  const { importAgent, isImportAgentLoading } = useImportAgent({
    onSuccess: (data, variables) => {
      toast.success(`${variables.name} has been imported`);
      setShowAgentManagerModal(null);

      delayedAgentApisInvalidation();
    },
    onError: () => toast.error('Something went wrong!'),
  });

  const { importAndReplaceAgent, isImportAndReplaceAgentLoading } = useImportAndReplaceAgent({
    onSuccess: (data, variables) => {
      toast.success(`${variables.fileName} has been imported, and has replaced ${variables.name}`);
      setShowAgentManagerModal(null);

      delayedAgentApisInvalidation();
    },
    onError: () => toast.error('Something went wrong!'),
  });

  useEffect(() => {
    const autoSearchAgentName = searchParams.get('autoSearchAgent');

    if (autoSearchAgentName) {
      setSearchFilterAPI(autoSearchAgentName);
      searchParams.delete('autoSearchAgent');
      navigate(routes.AGENT_MANAGER);
    }
  }, [searchParams]);

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
    if (preventGoBackToPrimaryMenu) {
      setShowSettingsSideDrawer(true);
    }
  }, [preventGoBackToPrimaryMenu]);

  useEffect(() => {
    if (showAddNewProcessModal && !showSettingsSideDrawer) {
      setAddNewAgentFormCollector(ADD_NEW_AGENT_FORM_SCHEMA);
    }
  }, [showAddNewProcessModal, showSettingsSideDrawer]);

  useEffect(() => {
    if (addNewAgentFormCollector[ADD_NEW_AGENT_KEYS.initiateApi] === true) {
      initiateAddNewAgentApi(addNewAgentFormCollector);
    }
  }, [addNewAgentFormCollector[ADD_NEW_AGENT_KEYS.initiateApi]]);

  useEffect(() => {
    const processTagsFilter = extractStringsFromArrayOfObjects(selectTagsFilter, KEY_TO_ACCESS_FILTERS);

    setFilterQuery((prev) => ({
      ...prev,
      [FILTER_TEMPLATE_KEYS.tagsFilter]: processTagsFilter,
    }));
  }, [selectTagsFilter]);

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

  const invalidateGetAgentAPI = () => {
    queryClient.invalidateQueries({ queryKey: [AGENT_QUERY_KEYS.GET_AGENTS] });
  };

  const invalidateAllAgentApis = () => {
    queryClient.invalidateQueries({ queryKey: [AGENT_QUERY_KEYS.GET_AGENTS] });
    queryClient.invalidateQueries({ queryKey: [GET_ALL_AGENTS] });
    fetchAllTagsFilters(false);
  };

  const delayedAgentApisInvalidation = () =>
    setTimeout(() => {
      invalidateAllAgentApis();
    }, REFETCH_TIMEOUT_SECONDS);

  const onPageChange = (page) => {
    setFilterTriggerQuery((prev) => ({
      ...prev,
      [FILTER_TEMPLATE_KEYS.pageNumber]: page - 1,
    }));
  };

  const handleTagClickForManagerTags = (item) => {
    if (selectTagsFilter?.map((item) => item.label)?.includes(item.name)) {
      return;
    }

    const selectTagObject = { label: item, value: item };

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
        return NO_AGENTS_DATA_TEXTS.NO_DATA_ON_AGENTS_FILTER;
      case currentView === ALL_TABS.FAVORITES:
        return NO_AGENTS_DATA_TEXTS.NO_AGENTS_DATA_ON_FAVORITES;
      case currentView === ALL_TABS.ARCHIVED:
        return NO_AGENTS_DATA_TEXTS.NO_AGENTS_DATA_ON_ARCHIVES;
      default:
        return NO_AGENTS_DATA_TEXTS.NO_INITIAL_AGENTS_DATA;
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
      modifiedData = { ...clickedProcess, ...data };
    }

    try {
      const res = await updateAgentDetails(modifiedData);

      if (res) {
        if (changeOnlyFavoriteLoading) {
          if (modifiedData[MANAGER_API_KEYS.IS_FAVORITE]) {
            toast.success('The Agent has been added to Favorites successfully...');
          } else {
            toast.success('The Agent has been removed from Favorites successfully...');
          }
        } else if (isProcessingArchiveApi) {
          if (modifiedData[MANAGER_API_KEYS.IS_ARCHIVED]) {
            toast.success('The Agent has been archived successfully...');
          } else {
            toast.success('The Agent has been unarchived successfully...');
          }
        } else {
          toast.success('The Agent has been updated successfully...');
        }

        if (data[DEACTIVATE_TRIGGER_API]) {
          data[DEACTIVATE_TRIGGER_API]();
        }

        if (activeMenu !== CHANGE_PROCESS_MANAGER_MENUS.EDIT_PROCESS_DETAILS) {
          goBackToPrimaryMenu();
          setShowSettingsSideDrawer(false);
        }

        setShowMoveElementToArchive(false);
        fetchAllTagsFilters(false);
        invalidateGetAgentAPI();
      }
    } catch (error) {
      toast.error('Something went wrong !!');
    } finally {
      setAddNewAgentFormCollector((prev) => ({
        ...prev,
        [ADD_NEW_AGENT_KEYS.initiateApi]: false,
      }));
      setSaveButtonConfigurations(SAVE_BUTTON_CONFIGURATION_SCHEMA);

      setIsAddNewProcessApiLoading(false);
      setIsLoadingForModal(false);
    }
  };

  const runDeleteAgentApi = async (apiData) => {
    setIsLoadingForModal(true);

    try {
      const res = await deleteAgent(apiData.agentId);

      if (res) {
        toast.success('The Agent has been deleted successfully...');

        setShowSettingsSideDrawer(false);
        closeDeleteElementModal();
        fetchAllTagsFilters(false);
        goBackToPrimaryMenu();
        invalidateGetAgentAPI();
        delayedAgentApisInvalidation();
      }
    } catch (error) {
      toast.error('Something went wrong !!!');
    } finally {
      setIsLoadingForModal(false);
    }
  };

  const initiateAddNewAgentApi = async (formData) => {
    if (!formData) {
      toast.error('Something went wrong !!!');
      return;
    }

    const data = {
      name: formData[ADD_NEW_AGENT_KEYS.agentName],
      description: formData[ADD_NEW_AGENT_KEYS.agentDescription],
      edition: formData[ADD_NEW_AGENT_KEYS.agentType],
      tags: formData[ADD_NEW_AGENT_KEYS.tags],
    };

    if (formData[IS_UPDATING_ELEMENT]) {
      await runUpdateElementApi(data);
    } else {
      await createNewAgent(data);
    }
  };

  const closeDeleteElementModal = () => {
    setShowDeleteElementModal(false);
  };

  const onCloseSettingsAndCreateWidgetModals = () => {
    setShowSettingsSideDrawer(false);
    setIsAddWidgetModalOpen(false);
    setIsAddPhoneNumberModalOpen(false);
  };

  const cleanAllTestFilters = () => {
    setSelectTagsFilter([]);
    setSelectStatusFilter([]);
    setFilterTriggerQuery(FILTER_TEMPLATE);
    setFilterQuery(FILTER_TEMPLATE);
    setSearchFilterAPI('');
    setShowFilterModal(false);
  };

  const onImportNewProcessClick = () => inputImportFileRef?.current?.click();

  const onImportAndReplaceProcessClick = () =>
    setShowAgentManagerModal({
      type: SHOW_AGENT_MANAGER_MODAL_TYPES.IMPORT_AND_REPLACE_AGENT,
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
        const isFileSchemaValid = await validateYupSchemaAsync(agentImportedFileSchema, jsonData);

        if (!isFileSchemaValid) {
          toast.error(AGENT_IMPORTED_FILE_INVALID_MSG);
          setIsImportButtonLoading(false);
          return;
        }

        setShowAgentManagerModal({
          type: SHOW_AGENT_MANAGER_MODAL_TYPES.IMPORT_NEW_AGENT,
          data: jsonData?.settings
            ? {
                ...jsonData?.settings,
                fileContent: jsonData,
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

  const handleImportAgent = ({ fileContent }) => {
    const jsonString = JSON.stringify(fileContent);
    const blob = new Blob([jsonString], { type: MANAGERS_IMPORT_JSON_FORMAT.FILE_TYPE });

    const formDataPayload = new FormData();
    formDataPayload.append('file', blob);

    importAgent({
      payload: formDataPayload,
      name: fileContent?.settings?.name,
    });
  };

  const isImportNewAgentModalOpen = showAgentManagerModal?.type === SHOW_AGENT_MANAGER_MODAL_TYPES.IMPORT_NEW_AGENT;

  const isImportReplaceAgentModalOpen =
    showAgentManagerModal?.type === SHOW_AGENT_MANAGER_MODAL_TYPES.IMPORT_AND_REPLACE_AGENT;

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
                item[KEY_TO_ACCESS_FILTERS],
                prev[FILTER_TEMPLATE_KEYS.tagsFilter]
              ),
            }));

            setFilterQuery((prev) => ({
              ...prev,
              [FILTER_TEMPLATE_KEYS.tagsFilter]: removeSelectedString(
                item[KEY_TO_ACCESS_FILTERS],
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
          addNewElementButtonTitle="New Agent"
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
          pagination={agents?.pagination}
          isAgentManagerView
          isLoading={isAgentsLoading}
          onImportAsNewClick={onImportNewProcessClick}
          onImportAndReplaceClick={onImportAndReplaceProcessClick}
          isImportButtonLoading={isImportButtonLoading || isImportNewAgentModalOpen || isImportReplaceAgentModalOpen}
        />
      }
    >
      <ContentLayout>
        <ComputeViewAppliedFilters />

        <ManagerCards
          setClickedProcess={setClickedProcess}
          setShowSettingsSideDrawer={setShowSettingsSideDrawer}
          setShowAllTagsSideDrawer={setShowAllTagsSideDrawer}
          setShowMoveElementToArchive={setShowMoveElementToArchive}
          isAgentManagerView
          data={filteredAgentData}
          isLoading={isAgentsLoading || isLoadingForModal || isPhoneNumberIdsFetching}
          runUpdateElementApi={runUpdateElementApi}
          getDataForNoDataFoundComponent={getDataForNoDataFoundComponent}
          currentView={currentView}
          pagination={agents?.pagination}
          onPageChange={onPageChange}
          scrollToTopRef={scrollToTopRef}
          handleTagOnClickForTags={handleTagClickForManagerTags}
          setTriggerOpenTestCasesSideModal={setPreventGoBackToPrimaryMenu}
          triggerOpenTestCasesSideModal={preventGoBackToPrimaryMenu}
          setActiveMenu={setActiveMenu}
          tabValue={tabValue}
          onTabChange={onTabChange}
        />
      </ContentLayout>

      <SidedrawerModal
        show={showSettingsSideDrawer}
        closeModal={() => setShowSettingsSideDrawer(false)}
        width="720px"
        padding="0"
        closeBtnClassName={classes.sideModalCloseIcon}
        useCloseBtnClassName
        className={classes.hideOverflow}
      >
        <SettingsSideDrawer
          isAgentManagerView
          setShowMoveElementToArchive={setShowMoveElementToArchive}
          setShowDeleteElementModal={setShowDeleteElementModal}
          filterQuery={filterQuery}
          viewBackupFilters={viewBackupFilters}
          setFilterQuery={setFilterQuery}
          clickedProcess={clickedProcess}
          setAddNewElementFormCollector={setAddNewAgentFormCollector}
          addNewElementFormCollector={addNewAgentFormCollector}
          isUpdateElementLoading={isAddNewProcessApiLoading}
          runUpdateElementApi={runUpdateElementApi}
          setActiveMenu={setActiveMenu}
          activeMenu={activeMenu}
          goBackToPrimaryMenu={goBackToPrimaryMenu}
          showSettingsSideDrawer={showSettingsSideDrawer}
          setSaveButtonConfigurations={setSaveButtonConfigurations}
          saveButtonConfigurations={saveButtonConfigurations}
          setIsAddWidgetModalOpen={setIsAddWidgetModalOpen}
          setIsAddPhoneNumberModalOpen={setIsAddPhoneNumberModalOpen}
          setClickedProcess={setClickedProcess}
          setPreventGoBackToPrimaryMenu={setPreventGoBackToPrimaryMenu}
          preventGoBackToPrimaryMenu={preventGoBackToPrimaryMenu}
          tabValue={tabValue}
          onTabChange={onTabChange}
          setShowAgentManagerModal={setShowAgentManagerModal}
          exportAgent={exportAgent}
          isExportAgentLoading={isExportAgentLoading}
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

      <Modal
        show={showAddNewProcessModal}
        modalClosed={() => setShowAddNewProcessModal(false)}
        className={classes.modal}
      >
        <AddNewProcessModal
          isAgentManagerView
          ADD_NEW_MODAL_TITLES={ADD_NEW_MODAL_TITLES}
          setShowAddNewElementModal={setShowAddNewProcessModal}
          setAddNewElementFormCollector={setAddNewAgentFormCollector}
          dataCollector={addNewAgentFormCollector}
          isApiLoading={isAgentCreating}
        />
      </Modal>

      <Modal
        show={showMoveElementToArchive}
        modalClosed={() => setShowMoveElementToArchive(false)}
        className={classes.status_change_modal}
      >
        <MoveTicketStatusToArchiveModal
          setShowMoveElementToArchive={setShowMoveElementToArchive}
          isAgentManagerView
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
          runDeleteElementApi={runDeleteAgentApi}
          isLoading={isLoadingForModal}
          clickedProcess={clickedProcess}
          isDeleteElement
          isAgentManagerView
          closeDeleteElementModal={closeDeleteElementModal}
          validationText={DELETE_ELEMENT_LABEL.label}
          activateValidationWordLength={DELETE_ELEMENT_LABEL.activateValidationWordLength}
          closeIconClick={closeIconClick}
        />
      </Modal>

      <AgentManagerModalsAddWidget
        open={isAddWidgetModalOpen}
        onClose={() => setIsAddWidgetModalOpen(false)}
        onCloseSettingsAndCreateWidgetModals={onCloseSettingsAndCreateWidgetModals}
        clickedProcess={clickedProcess}
        setPreventGoBackToPrimaryMenu={setPreventGoBackToPrimaryMenu}
        setClickedProcess={setClickedProcess}
      />
      <AgentManagerModalsAddPhoneNumber
        open={isAddPhoneNumberModalOpen}
        onClose={() => setIsAddPhoneNumberModalOpen(false)}
        onCloseSettingsAndCreateWidgetModals={onCloseSettingsAndCreateWidgetModals}
        clickedProcess={clickedProcess}
        setPreventGoBackToPrimaryMenu={setPreventGoBackToPrimaryMenu}
        setClickedProcess={setClickedProcess}
      />

      {showAgentManagerModal?.type === SHOW_AGENT_MANAGER_MODAL_TYPES.DUPLICATE_AGENT && !!allAgentsOptions?.length && (
        <AgentManagerDuplicateModal
          data={showAgentManagerModal?.data}
          onClose={() => setShowAgentManagerModal(null)}
          duplicateAgent={duplicateAgent}
          isLoading={isDuplicateAgentLoading}
          allAgentsOptions={allAgentsOptions}
        />
      )}

      {isImportNewAgentModalOpen && (
        <AgentManagerDuplicateModal
          data={showAgentManagerModal?.data}
          onClose={() => setShowAgentManagerModal(null)}
          isLoading={isImportAgentLoading || isAllAgentsLoading}
          allAgentsOptions={allAgentsOptions}
          headerTitle="Import New Agent"
          submitBtnTitle="Confirm"
          handleImportAgent={handleImportAgent}
          isImportAgentModal
        />
      )}

      {isImportReplaceAgentModalOpen && (
        <AgentManagerImportReplaceModal
          onClose={() => setShowAgentManagerModal(null)}
          allAgentsOptions={allAgentsOptions}
          onSubmit={importAndReplaceAgent}
          isLoading={isImportAndReplaceAgentLoading || isAllAgentsLoading}
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

export default AgentManager;

AgentManager.propTypes = {
  scrollToTopRef: PropTypes.object,
};
