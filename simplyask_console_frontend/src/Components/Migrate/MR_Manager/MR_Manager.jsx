import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Card, Modal, SidedrawerModal } from 'simplexiar_react_components';

import MR_Manager_download_icon from '../../../Assets/icons/MR_Manager_download_icon.svg?component';
import MR_Manager_play_icon from '../../../Assets/icons/MR_Manager_play_icon.svg?component';
import ProcessManagerBlackPolygon from '../../../Assets/icons/ProcessManagerBlackPolygon.svg';
import processManagerSettingsIcon from '../../../Assets/icons/processManagerSettingsIcon.svg?component';
import { useUser } from '../../../contexts/UserContext';
import useAxiosGet from '../../../hooks/useAxiosGet';
import { useFixedSideModalWidth } from '../../../hooks/useSideModalWidth';
import { MIGRATE_ENGINE_API } from '../../../Services/axios/AxiosInstance';
import {
  getAllMrManagerSettings,
  getAllSourcesOrTargetsOrFieldsSystems,
  getPreDesignMetadata,
  submitExecutionFile,
} from '../../../Services/axios/migrate';
import { getWorkflows } from '../../../Services/axios/processManager';
import AssociationSetTable from './CardsComponents/AssociationSet/AssociationSetTable';
import { ASSOCIATION_SET_TABLE_KEYS } from './CardsComponents/AssociationSet/requestHeadersSchema';
import DesignAndExecution from './CardsComponents/DesignAndExecution/DesignAndExecution';
import FieldsTable from './CardsComponents/FieldsTable/FieldsTable';
import classes from './MR_Manager.module.css';
import DownloadResults from './SideModals/DownloadResults/DownloadResults';
import ExecuteFiles from './SideModals/ExecuteFiles/ExecuteFiles';
import Settings from './SideModals/Settings/Settings';

export const convertFilterObjectsToStrings = (index, item, filterString = '') => {
  if ((index === 0 || !filterString) && item) {
    filterString = `${item.value}`;
  } else if (item) {
    filterString = `${filterString},${item.value}`;
  }
  return filterString;
};

export const SOURCES_TARGETS_FIELDS_FILTER_KEYS = {
  SOURCE: 'SOURCE',
  TARGET: 'TARGET',
  BOTH: 'BOTH',
};
export const ACCESS_UPLOAD_FILE_KEYS = {
  INDEX: 0,
  NAME: 'name',
};

export const TAB_VIEW = {
  DESIGN: 0,
  EXECUTION: 1,
};

export const EXECUTE_FILES_API_KEYS = {
  systemName: 'systemName',
};

export const DESIGN_API_KEYS = {
  canDeployDesignUpdate: 'canDeployDesignUpdate',
  numUnassociatedFields: 'numUnassociatedFields',
  numTotalUnassociatedFields: 'numTotalFields',
  numRelatedAssociationSets: 'numRelatedAssociationSets',
  numTotalRelatedAssociationSet: 'numTotalAssociationSet',
};

export const SAVE_BUTTON_KEYS = {
  TRIGGER_API: 'triggerApi',
  IS_BUTTON_DISABLED: 'isButtonEnabled',
};

export const SAVE_BUTTON_KEYS_SCHEMA = {
  [SAVE_BUTTON_KEYS.TRIGGER_API]: false,
  [SAVE_BUTTON_KEYS.IS_BUTTON_DISABLED]: true,
};

export const SETTINGS_SIDE_MODAL_KEYS = {
  NAME: 'name',
  DESCRIPTION: 'description',
  MAX_CONCURRENT_EXECUTIONS: 'extractMaxConcurrentExecutions',
  MAX_RECORD_PER_TRANSFORM_BATCH: 'extractMaxRecordsTransformBatch',
  MAX_CONCURRENT_TRANSFORM_BATCH: 'transformMaxConcurrentTransformBatches',
  MAX_CONCURRENT_TRANSFORM_BATCH_RECORDS: 'transformMaxConcurrentTransformBatchRecords',
  MAX_RECORD_PER_LOAD_BATCH: 'loadMaxRecordsLoadBatch',
  MAX_CONCURRENT_PER_LOAD_BATCHES: 'loadMaxConcurrentLoadBatches',
  LOAD_WAIT_TIMEOUT: 'loadWaitTimeoutSec',
  MAX_CONCURRENT_BATCHES: 'notifyMaxConcurrentLoadBatches',
  EXTRACT_PROCESS: 'extractProcessId',
  TRANSFORM_PROCESS: 'transformProcessId',
  LOAD_PROCESS: 'loadProcessId',
  NOTIFY_PROCESS: 'notifyProcessId',
};

export const RECORD_STATUS_EXECUTION_API_KEYS = {
  recordStats: 'recordStats',
  numProcessing: 'numProcessing',
  numFallout: 'numFallout',
  numExtractionWaiting: 'numExtractionWaiting',
  numExtractionProcessing: 'numExtractionProcessing',
  numTransformBatchWaiting: 'numTransformBatchWaiting',
  numTransformProcessing: 'numTransformProcessing',
  numLoadWaiting: 'numLoadWaiting',
  numLoadProcessing: 'numLoadProcessing',
  numReconciliationWaiting: 'numReconciliationWaiting',
  numReconciliationProcessing: 'numReconciliationProcessing',
  numCompleted: 'numComplete',
};

const SETTINGS_SIDE_MODAL_SCHEMA = {
  [SETTINGS_SIDE_MODAL_KEYS.NAME]: '',
  [SETTINGS_SIDE_MODAL_KEYS.DESCRIPTION]: '',
  [SETTINGS_SIDE_MODAL_KEYS.MAX_CONCURRENT_EXECUTIONS]: '',
  [SETTINGS_SIDE_MODAL_KEYS.MAX_RECORD_PER_TRANSFORM_BATCH]: '',
  [SETTINGS_SIDE_MODAL_KEYS.MAX_CONCURRENT_TRANSFORM_BATCH]: '',
  [SETTINGS_SIDE_MODAL_KEYS.MAX_CONCURRENT_TRANSFORM_BATCH_RECORDS]: '',
  [SETTINGS_SIDE_MODAL_KEYS.MAX_RECORD_PER_LOAD_BATCH]: '',
  [SETTINGS_SIDE_MODAL_KEYS.MAX_CONCURRENT_PER_LOAD_BATCHES]: '',
  [SETTINGS_SIDE_MODAL_KEYS.LOAD_WAIT_TIMEOUT]: '',
  [SETTINGS_SIDE_MODAL_KEYS.MAX_CONCURRENT_BATCHES]: '',
  [SETTINGS_SIDE_MODAL_KEYS.EXTRACT_PROCESS]: '',
  [SETTINGS_SIDE_MODAL_KEYS.TRANSFORM_PROCESS]: '',
  [SETTINGS_SIDE_MODAL_KEYS.LOAD_PROCESS]: '',
  [SETTINGS_SIDE_MODAL_KEYS.NOTIFY_PROCESS]: '',
};

const SUB_NAV_BAR_ICONS_TITLE = {
  Execute: 'Execute',
  DownloadResults: 'Download Results',
  Settings: 'Settings',
};

// const DATA_TYPES = { FILE: 'RTCS' };

const DESIGN_VIEW_ID = 'DESIGN_VIEW_ID';
const EXECUTION_VIEW_ID = 'EXECUTION_VIEW_ID';

const DisplayHoverComponentName = ({ name, className }) => {
  return (
    <>
      <div className={classes.display_hover_comp_root}>
        <div
          className={`${classes.display_hover_comp}
      ${classes.favorite_text_absolute}
      ${className}`}
        >
          {name}
        </div>
        <img className={`${classes.polygon_absolute}`} src={ProcessManagerBlackPolygon} alt="" />
      </div>
    </>
  );
};

const SubNavbar = ({
  openDownloadResultSideModal,
  openExecuteFilesSideModal,
  openSettingsSideModal,
  title = '',
  description = '',
}) => {
  return (
    <div className={`${classes.navbar_root}`}>
      <div className={classes.lineDiv} />
      <div className={classes.navbarSectionRoot}>
        <div className={classes.navbarTextRoot}>
          <div className={classes.navbarBoldText}>{title}</div>
          <div className={`${classes.navbarBoldText} ${classes.slash}`}>|</div>
          <div className={classes.navbarLightText}>{description}</div>
        </div>

        <div className={classes.configurationRoot}>
          <div
            className={`${classes.conf_icon_hover}
      ${classes.favorite_icon_hover}`}
            onClick={openDownloadResultSideModal}
          >
            <DisplayHoverComponentName
              name={SUB_NAV_BAR_ICONS_TITLE.DownloadResults}
              className={classes.adjustPosition}
            />
            <img src={MR_Manager_download_icon} alt="" className={classes.settings_icon} />
          </div>
          <div
            className={`${classes.conf_icon_hover}
      ${classes.archive_icon_hover}`}
            onClick={openExecuteFilesSideModal}
          >
            <DisplayHoverComponentName name={SUB_NAV_BAR_ICONS_TITLE.Execute} />

            <img src={MR_Manager_play_icon} alt="" className={classes.settings_icon} />
          </div>
          <div
            className={`${classes.conf_icon_hover}
      ${classes.settings_icon_hover}`}
            onClick={openSettingsSideModal}
          >
            <DisplayHoverComponentName name={SUB_NAV_BAR_ICONS_TITLE.Settings} />
            <img src={processManagerSettingsIcon} alt="" className={classes.settings_icon} />
          </div>
        </div>
      </div>
    </div>
  );
};
const MR_Manager = ({ scrollToTopRef }) => {
  const isTargetSystems = SOURCES_TARGETS_FIELDS_FILTER_KEYS.TARGET;
  const [searchDownloadReportFilterAPI, setSearchDownloadReportFilterAPI] = useState('');
  const { user } = useUser();

  // useQuery
  const {
    data: settingSideModalData,
    isFetching: settingSideModalDataFetching,
    refetch: settingSideModalDataRefetch,
  } = useQuery({
    queryKey: ['getAllMrManagerSettings'],
    queryFn: getAllMrManagerSettings,
  });

  const { data: getPreDesignMetadataForExecution, isFetching: getPreDesignMetadataForExecutionLoader } = useQuery({
    queryKey: ['getPreDesignMetadata'],
    queryFn: getPreDesignMetadata,
  });

  const { data: migrateWorkflows, isFetching: migrateWorkflowsLoading } = useQuery({
    queryKey: ['getWorkflows'],
    queryFn: () => getWorkflows({ processType: 'Migration', pageSize: 1000 }),
  });

  const {
    response: executionIdFilters,
    isLoading: loadingExecutionIdData,
    fetchData: fetchExecutionIds,
  } = useAxiosGet(
    `/executions/summaries?searchText=${searchDownloadReportFilterAPI}` +
      '&pageSize=1000' +
      `&timezone=${user?.timezone}`,
    true,
    MIGRATE_ENGINE_API
  );

  const { data: getAllTargetSystems, refetch: fetchAllTargetSystems } = useQuery({
    queryKey: ['getAllTargetSystems', isTargetSystems],
    queryFn: () => getAllSourcesOrTargetsOrFieldsSystems(isTargetSystems),
  });

  const [activeTab, setActiveTab] = useState(TAB_VIEW.DESIGN);
  const [refetchExecutionCardData, setRefetchExecutionCardData] = useState(() => {});

  const navigate = useNavigate();
  const location = useLocation();

  // Execute Files States
  const [uploadFileSource, setUploadFileSource] = useState([]);

  // Setting BaseSidebar data states
  const [settingsSideModalFormCollector, setSettingsSideModalFormCollector] = useState(SETTINGS_SIDE_MODAL_SCHEMA);

  // BaseSidebar
  const isMediumWidth = false;
  const isSmallWidth = true;

  const fixedSideModalWidth = useFixedSideModalWidth();
  const fixedSideModalMediumWidth = useFixedSideModalWidth(isMediumWidth, isSmallWidth);

  const [showDownloadResultsSideModal, setShowDownloadResultsSideModal] = useState(false);
  const [showExecuteFilesSideModal, setShowExecuteFilesSideModal] = useState(false);
  const [showSettingsSideModal, setShowSettingsSideModal] = useState(false);

  //  Modals
  const [showUnSubmittedFilesExecutionModal, setShowUnSubmittedFilesExecutionModal] = useState(false);

  // Filters
  const [selectSortByTargetSystem, setSelectSortByTargetSystem] = useState();

  useEffect(() => {
    if (!settingSideModalDataFetching && settingSideModalData) {
      const prepareDataSetter = {
        [SETTINGS_SIDE_MODAL_KEYS.NAME]: `${settingSideModalData?.[SETTINGS_SIDE_MODAL_KEYS.NAME]}` ?? '',
        [SETTINGS_SIDE_MODAL_KEYS.DESCRIPTION]: `${settingSideModalData?.[SETTINGS_SIDE_MODAL_KEYS.DESCRIPTION]}` ?? '',
        [SETTINGS_SIDE_MODAL_KEYS.MAX_CONCURRENT_EXECUTIONS]:
          `${settingSideModalData?.[SETTINGS_SIDE_MODAL_KEYS.MAX_CONCURRENT_EXECUTIONS]}` ?? '',
        [SETTINGS_SIDE_MODAL_KEYS.MAX_RECORD_PER_TRANSFORM_BATCH]:
          `${settingSideModalData?.[SETTINGS_SIDE_MODAL_KEYS.MAX_RECORD_PER_TRANSFORM_BATCH]}` ?? '',
        [SETTINGS_SIDE_MODAL_KEYS.MAX_CONCURRENT_TRANSFORM_BATCH]:
          `${settingSideModalData?.[SETTINGS_SIDE_MODAL_KEYS.MAX_CONCURRENT_TRANSFORM_BATCH]}` ?? '',
        [SETTINGS_SIDE_MODAL_KEYS.MAX_CONCURRENT_TRANSFORM_BATCH_RECORDS]:
          `${settingSideModalData?.[SETTINGS_SIDE_MODAL_KEYS.MAX_CONCURRENT_TRANSFORM_BATCH_RECORDS]}` ?? '',
        [SETTINGS_SIDE_MODAL_KEYS.MAX_RECORD_PER_LOAD_BATCH]:
          `${settingSideModalData?.[SETTINGS_SIDE_MODAL_KEYS.MAX_RECORD_PER_LOAD_BATCH]}` ?? '',
        [SETTINGS_SIDE_MODAL_KEYS.MAX_CONCURRENT_PER_LOAD_BATCHES]:
          `${settingSideModalData?.[SETTINGS_SIDE_MODAL_KEYS.MAX_CONCURRENT_PER_LOAD_BATCHES]}` ?? '',
        [SETTINGS_SIDE_MODAL_KEYS.LOAD_WAIT_TIMEOUT]:
          `${settingSideModalData?.[SETTINGS_SIDE_MODAL_KEYS.LOAD_WAIT_TIMEOUT]}` ?? '',
        [SETTINGS_SIDE_MODAL_KEYS.MAX_CONCURRENT_BATCHES]:
          `${settingSideModalData?.[SETTINGS_SIDE_MODAL_KEYS.MAX_CONCURRENT_BATCHES]}` ?? '',
        [SETTINGS_SIDE_MODAL_KEYS.EXTRACT_PROCESS]:
          settingSideModalData[SETTINGS_SIDE_MODAL_KEYS.EXTRACT_PROCESS] ?? '',
        [SETTINGS_SIDE_MODAL_KEYS.TRANSFORM_PROCESS]:
          settingSideModalData[SETTINGS_SIDE_MODAL_KEYS.TRANSFORM_PROCESS] ?? '',
        [SETTINGS_SIDE_MODAL_KEYS.LOAD_PROCESS]: settingSideModalData[SETTINGS_SIDE_MODAL_KEYS.LOAD_PROCESS] ?? '',
        [SETTINGS_SIDE_MODAL_KEYS.NOTIFY_PROCESS]: settingSideModalData[SETTINGS_SIDE_MODAL_KEYS.NOTIFY_PROCESS] ?? '',
      };

      if (prepareDataSetter) {
        setSettingsSideModalFormCollector(prepareDataSetter);
      }
    }
  }, [settingSideModalData, settingSideModalDataFetching]);

  useEffect(() => {
    const designCardElement = document.getElementById(DESIGN_VIEW_ID);
    const executionCardElement = document.getElementById(EXECUTION_VIEW_ID);

    if (activeTab === TAB_VIEW.DESIGN) {
      executionCardElement.classList.add(`${classes.unActiveView}`);
      designCardElement.classList.remove(`${classes.unActiveView}`);
    } else {
      designCardElement.classList.add(`${classes.unActiveView}`);
      executionCardElement.classList.remove(`${classes.unActiveView}`);
    }
  }, [activeTab]);

  useEffect(() => {
    if (location.search === '?executions') {
      setActiveTab(TAB_VIEW.EXECUTION);

      navigate({
        search: '',
      });
    }
  }, [location.search]);

  const saveExecutionFilesWithApi = async () => {
    setShowUnSubmittedFilesExecutionModal(false);

    try {
      const getAllUploadedFiles = [...uploadFileSource];

      getAllUploadedFiles?.forEach(async (item) => {
        const keys = Object.keys(item);

        const fileDataSource = new FormData();
        fileDataSource.append(keys[ACCESS_UPLOAD_FILE_KEYS.INDEX], item[keys[ACCESS_UPLOAD_FILE_KEYS.INDEX]]);

        const fileDataSourceApi = await submitExecutionFile(fileDataSource);

        if (fileDataSourceApi) {
          toast.success(
            `The file execution request for ${keys[ACCESS_UPLOAD_FILE_KEYS.INDEX]} is initiated successfully...`
          );

          refetchExecutionCardData();
          setUploadFileSource([]);
          setShowExecuteFilesSideModal(false);
        }
      });
    } catch (error) {
      toast.error('Something went wrong...');
    }
  };

  const closeSettingsSideModal = () => setShowSettingsSideModal(false);
  const openSettingsSideModal = () => setShowSettingsSideModal(true);

  const closeDownloadResultSideModal = () => setShowDownloadResultsSideModal(false);
  const openDownloadResultSideModal = () => setShowDownloadResultsSideModal(true);

  const openExecuteFilesSideModal = () => setShowExecuteFilesSideModal(true);

  const closeExecuteFilesSideModal = () => {
    if (uploadFileSource.length !== 0) {
      setShowUnSubmittedFilesExecutionModal(true);
    } else {
      setShowExecuteFilesSideModal(false);
    }
  };

  const closeModalAndSideModal = (modalSetter, sideModalSetter) => {
    modalSetter(false);
    sideModalSetter(false);
  };

  const triggerDesignView = () => {
    setActiveTab(TAB_VIEW.DESIGN);
  };

  const triggerExecutionView = () => {
    setActiveTab(TAB_VIEW.EXECUTION);
  };

  const getTargetSystemsOptions = () => {
    return (
      getAllTargetSystems?.map((item) => ({
        label: item[ASSOCIATION_SET_TABLE_KEYS.SYSTEM_NAME],
        value: item[ASSOCIATION_SET_TABLE_KEYS.SYSTEM_ID],
      })) ?? []
    );
  };

  return (
    <div className={classes.root}>
      <SubNavbar
        openDownloadResultSideModal={openDownloadResultSideModal}
        openExecuteFilesSideModal={openExecuteFilesSideModal}
        openSettingsSideModal={openSettingsSideModal}
        title={settingSideModalData?.[SETTINGS_SIDE_MODAL_KEYS.NAME]}
        description={settingSideModalData?.[SETTINGS_SIDE_MODAL_KEYS.DESCRIPTION]}
      />

      <div className={classes.cardRoots}>
        {/* <button onClick={() => navigate(`${routes.MR_MANAGER}/123`)}>
          Go to Mapping Editor

        </button> */}

        <div className={classes.cardsAnimationRoot}>
          <Card className={classes.cardsAnimationView} onClick={triggerDesignView} id={DESIGN_VIEW_ID}>
            <div className={classes.cardsAnimationText}>Design</div>
          </Card>
          <Card className={classes.cardsAnimationView} onClick={triggerExecutionView} id={EXECUTION_VIEW_ID}>
            <div className={classes.cardsAnimationText}>Execution</div>
          </Card>
        </div>

        <DesignAndExecution
          activeTab={activeTab}
          selectSortByTargetSystem={selectSortByTargetSystem}
          setSelectSortByTargetSystem={setSelectSortByTargetSystem}
          getTargetSystemsOptions={getTargetSystemsOptions}
          setRefetchExecutionCardData={setRefetchExecutionCardData}
          refetchExecutionCardData={refetchExecutionCardData}
          fetchExecutionIds={fetchExecutionIds}
          executionIdFilters={executionIdFilters}
          fetchAllTargetSystems={fetchAllTargetSystems}
          getAllTargetSystems={getAllTargetSystems}
        />

        <AssociationSetTable scrollToTopRef={scrollToTopRef} />

        <FieldsTable />
      </div>

      <SidedrawerModal
        show={showDownloadResultsSideModal}
        closeModal={closeDownloadResultSideModal}
        width={fixedSideModalWidth}
        padding="0"
        closeBtnClassName={classes.sideModalCloseIcon}
        useCloseBtnClassName
      >
        <DownloadResults
          executionIdData={executionIdFilters?.content ?? []}
          loading={loadingExecutionIdData}
          setSearchDownloadReportFilterAPI={setSearchDownloadReportFilterAPI}
          searchDownloadReportFilterAPI={searchDownloadReportFilterAPI}
        />
      </SidedrawerModal>

      <SidedrawerModal
        show={showExecuteFilesSideModal}
        closeModal={closeExecuteFilesSideModal}
        width={fixedSideModalMediumWidth}
        padding="0"
        closeBtnClassName={classes.sideModalCloseIcon}
        useCloseBtnClassName
      >
        <ExecuteFiles
          uploadFileSource={uploadFileSource}
          setUploadFileSource={setUploadFileSource}
          saveExecutionFilesWithApi={saveExecutionFilesWithApi}
          getPreDesignMetadataForExecution={getPreDesignMetadataForExecution}
          getPreDesignMetadataForExecutionLoader={getPreDesignMetadataForExecutionLoader}
        />
      </SidedrawerModal>

      <SidedrawerModal
        show={showSettingsSideModal}
        closeModal={closeSettingsSideModal}
        width="500px"
        padding="0"
        closeBtnClassName={classes.sideModalCloseIcon}
        useCloseBtnClassName
      >
        <Settings
          settingsSideModalFormCollector={settingsSideModalFormCollector}
          setSettingsSideModalFormCollector={setSettingsSideModalFormCollector}
          settingSideModalDataFetching={settingSideModalDataFetching}
          settingSideModalDataRefetch={settingSideModalDataRefetch}
          migrationWorkflows={migrateWorkflows}
          migrationWorkflowsLoading={migrateWorkflowsLoading}
        />
      </SidedrawerModal>

      <Modal
        show={showUnSubmittedFilesExecutionModal}
        modalClosed={() => setShowUnSubmittedFilesExecutionModal(false)}
        className={classes.modal}
      >
        <CloseIcon className={classes.closeIcon} onClick={() => setShowUnSubmittedFilesExecutionModal(false)} />
        <ErrorOutlineIcon className={classes.warningIcon} />

        <div className={classes.description_title}>You Have Unsubmitted Changes</div>
        <div className={classes.description}>
          <div>Do you want to submit the files you have uploaded?</div>
        </div>
        <div className={classes.modalButtons}>
          <button
            className={classes.modalCancelButton}
            onClick={() => closeModalAndSideModal(setShowUnSubmittedFilesExecutionModal, setShowExecuteFilesSideModal)}
          >
            Discard Changes
          </button>
          <button className={classes.modalSaveButton} onClick={saveExecutionFilesWithApi}>
            Save Changes
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default MR_Manager;

MR_Manager.propTypes = {
  scrollToTopRef: PropTypes.object,
};

DisplayHoverComponentName.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string,
};

SubNavbar.propTypes = {
  openDownloadResultSideModal: PropTypes.func,
  openExecuteFilesSideModal: PropTypes.func,
  openSettingsSideModal: PropTypes.func,
  title: PropTypes.string,
  description: PropTypes.string,
};
