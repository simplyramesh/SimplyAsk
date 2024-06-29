import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Card, Modal } from 'simplexiar_react_components';

import MR_Manager_Long_line from '../../../../../Assets/icons/MR_Manager_Long_line.svg';
import MR_Manager_manualUpdate from '../../../../../Assets/icons/MR_Manager_manualUpdate.svg';
import { useUser } from '../../../../../contexts/UserContext';
import useAxiosGet from '../../../../../hooks/useAxiosGet';
import { MIGRATE_ENGINE_API } from '../../../../../Services/axios/AxiosInstance';
import {
  deployDesignUpdates,
  getAllDesignExecutionStatsApi,
  getAllMigrationExecutionStats,
} from '../../../../../Services/axios/migrate';
import { calculatePercentage } from '../../../../../utils/helperFunctions';
import CountUpNumberAnimation from '../../../../shared/CountUpNumberAnimation/CountUpNumberAnimation';
import Spinner from '../../../../shared/Spinner/Spinner';
import Switch from '../../../../SwitchWithText/Switch';
import { DESIGN_API_KEYS, RECORD_STATUS_EXECUTION_API_KEYS, TAB_VIEW } from '../../MR_Manager';
import CurrentExecutionsTable from './CurrentExecutionsTable/CurrentExecutionsTable';
import classes from './DesignAndExecution.module.css';
import CustomIndicatorArrow from '../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomSelect from '../../../../shared/REDISIGNED/selectMenus/CustomSelect';

export const DEFAULT_TABLE_PAGE_SIZE = 3;
export const DEFAULT_TABLE_HEIGHT = '275px';
export const LENGTH_OF_EMPTY_ARRAY = 0;
export const EXTENDED_TABLE_PAGE_SIZE = 8;
export const EXTENDED_TABLE_HEIGHT = '500px';
export const EMPTY_DATA_TABLE_HEIGHT = '440px';

const USE_LESS_VALUE_FOR_SWITCH_SPACING = '123';

const ALL_RECORD_STATUS_VALUE = 0;
const PROCESSING_STATUS_VALUE = 1;
const FALLOUT_STATUS_VALUE = 2;
const IS_AUTO_UPDATE_EVERY_30_SECONDS_ENABLED = 'isAutoUpdateEvery30SecondsEnabled';
const THIRTY_SECONDS = 30000;

const INDIVIDUAL_RECORD_STATUS_OPTIONS = [
  {
    value: ALL_RECORD_STATUS_VALUE,
    label: 'All Record Status',
  },
  {
    value: PROCESSING_STATUS_VALUE,
    label: 'Processing',
  },
  {
    value: FALLOUT_STATUS_VALUE,
    label: 'Fallout',
  },
];

const IndividualRecordCard = ({ stats = 0, stageNumber = 1, stageTitle = '', gradientColor = '', className }) => {
  return (
    <div className={className}>
      <div className={`${classes.squareGradientSize} ${gradientColor}`}>
        <CountUpNumberAnimation number={stats} className={classes.squareGradientStats} />
        <div className="">Records</div>
      </div>

      <div className={classes.stagesTextRoot}>
        <div className={classes.stageText}>Stage {stageNumber}:</div>
        <div className={classes.stageTitle}>{stageTitle}</div>
      </div>
    </div>
  );
};

const RecordStatusCardComponent = ({ recordRootClass, headerTitle, headerColorClass, children }) => {
  return (
    <div className={recordRootClass}>
      <div className={headerColorClass}>{headerTitle}</div>
      {children}
    </div>
  );
};

const StatsCard = ({
  mainTitle = '',
  firstTitle = '',
  secondTitle = '',
  thirdTitle = '',
  fourthTitle = '',
  firstStatCard = 0,
  secondStatCard = 0,
  thirdStatCard = 0,
  fourthStatCard = 0,
  isFetching,
}) => {
  if (isFetching) {
    return (
      <div className={`${classes.colored_grid}`}>
        <Spinner inline medium />
      </div>
    );
  }

  return (
    <div className={`${classes.colored_grid}`}>
      <div className={`${classes.total_Stats}`}>
        <div className={classes.main_title}>{mainTitle}</div>
      </div>

      <div className={classes.stats_body}>
        <div className={`${classes.success_stats_root}`}>
          <div
            className={`${classes.stats_sub_title}
          ${classes.greyAbsoluteLine}`}
          >
            {firstTitle}
          </div>

          <CountUpNumberAnimation number={firstStatCard} className={classes.stats_sub_data} />
        </div>

        <div className={classes.success_stats_root}>
          <div
            className={`${classes.stats_sub_title}
          ${classes.greyAbsoluteLine}`}
          >
            {secondTitle}
          </div>

          <CountUpNumberAnimation number={secondStatCard} className={classes.stats_sub_data} />
        </div>

        <div className={classes.success_stats_root}>
          <div
            className={`${classes.stats_sub_title}
          ${classes.greyAbsoluteLine}`}
          >
            {thirdTitle}
          </div>

          <CountUpNumberAnimation number={thirdStatCard} className={classes.stats_sub_data} />
        </div>

        <div className={classes.success_stats_root}>
          <div className={`${classes.stats_sub_title}`}>{fourthTitle}</div>

          <CountUpNumberAnimation number={fourthStatCard} className={classes.stats_sub_data} />
        </div>
      </div>
    </div>
  );
};

const DesignComponent = ({
  selectSortByTargetSystem,
  setSelectSortByTargetSystem,
  getTargetSystemsOptions,
  areNewDesignUpdatesAvailable = true,
  getAllDesignExecutionStatisticsLoading,
  getAllDesignExecutionStats,
  refetchExecutionCardData = () => {},
}) => {
  const [unMappedFieldData, setUnMappedFieldData] = useState();
  const [relatedAssociationData, setRelatedAssociationData] = useState();
  const [deployingDesignUpdatesLoading, setDeployingDesignUpdatesLoading] = useState(false);

  useEffect(() => {
    const unMappedDone = getAllDesignExecutionStats?.[DESIGN_API_KEYS.numUnassociatedFields] ?? 0;
    const unMappedTotal = getAllDesignExecutionStats?.[DESIGN_API_KEYS.numTotalUnassociatedFields] ?? 0;

    const relatedAssociationDone = getAllDesignExecutionStats?.[DESIGN_API_KEYS.numRelatedAssociationSets] ?? 0;
    const relatedAssociationTotal = getAllDesignExecutionStats?.[DESIGN_API_KEYS.numTotalRelatedAssociationSet] ?? 0;

    setUnMappedFieldData({
      done: unMappedDone,
      total: unMappedTotal,
      percentage: calculatePercentage(unMappedDone, unMappedTotal),
    });

    setRelatedAssociationData({
      done: relatedAssociationDone,
      total: relatedAssociationTotal,
      percentage: calculatePercentage(relatedAssociationDone, relatedAssociationTotal),
    });
  }, [getAllDesignExecutionStats]);

  const onSelectTargetSystemFilterChange = (event) => {
    setSelectSortByTargetSystem(event);
  };

  const handleDeployDesignUpdateButton = async () => {
    setDeployingDesignUpdatesLoading(true);
    try {
      const res = await deployDesignUpdates();
      if (res) {
        toast.success('The design changes has been deployed successfully..');
        refetchExecutionCardData();
      }
    } catch (error) {
      toast.error('Something went wrong...');
    } finally {
      setDeployingDesignUpdatesLoading(false);
    }
  };

  return (
    <Card className={`${classes.tableCard}`}>
      {getAllDesignExecutionStatisticsLoading || deployingDesignUpdatesLoading ? (
        <div className={classes.loaderRoot}>
          <Spinner medium inline />
        </div>
      ) : (
        <>
          <div className={classes.filters_row}>
            <div className={classes.selectLabel}>Showing</div>
            <CustomSelect
              options={getTargetSystemsOptions()}
              onChange={onSelectTargetSystemFilterChange}
              value={[selectSortByTargetSystem]}
              placeholder="All Target Systems"
              isClearable
              components={{
                DropdownIndicator: CustomIndicatorArrow,
              }}
              controlTextHidden
              menuPortalTarget={document.body}
              closeMenuOnSelect
              withSeparator
              filter
              mb={0}
            />
          </div>

          <div className={classes.designGrid}>
            <div className={classes.designGridChild}>
              <div className={classes.designGridText}>Number of Unmapped Fields</div>
              <div className={classes.designGridStats}>
                {unMappedFieldData?.done ?? 0} / {unMappedFieldData?.total ?? 0} ({unMappedFieldData?.percentage ?? 0}
                %){' '}
              </div>
            </div>

            <div className={classes.designGridChild}>
              <div className={classes.designGridText}>Number of of Related Association Sets</div>
              <div className={classes.designGridStats}>
                {relatedAssociationData?.done ?? 0} / {relatedAssociationData?.total ?? 0} (
                {relatedAssociationData?.percentage ?? 0}
                %){' '}
              </div>
            </div>
          </div>

          {areNewDesignUpdatesAvailable && (
            <div className={classes.newUpdatedAvailableRoot}>
              <div className={classes.newUpdatedAvailableLeftRoot}>
                <div className={classes.updateAvailableText}>There are new design updates ready for deployment.</div>
                {/* <div className={classes.updateAvailableLinkText}>
              View / Revert Changes
            </div> */}
              </div>

              <div className={classes.newUpdatedAvailableRightRoot}>
                <button className={classes.deployDesignButton} onClick={handleDeployDesignUpdateButton}>
                  Deploy Design Update
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
};

const ExecutionComponent = ({
  setSelectIndividualRecordStatus,
  selectIndividualRecordStatus,
  selectIndividualRecordExecution,
  setSelectIndividualRecordExecution,
  setShowCancelExecutionModal,
  setClickedTableRowData,
  getAllMigrationExecutionStatistics,
  getAllMigrationExecutionStatisticsLoading,
  refetchExecutionCardData,
  executionIdFilters,
  setSearchFilterAPI,
  setPageNumber,
  searchFilterAPI,
  requests,
  error,
  isLoading,
  setPageSize,
}) => {
  const [isAutoUpdateEvery30SecondsEnabled, setIsAutoUpdateEvery30SecondsEnabled] = useState(false);

  useEffect(() => {
    const getAutoUpdateButtonValue = localStorage.getItem(IS_AUTO_UPDATE_EVERY_30_SECONDS_ENABLED);
    if (getAutoUpdateButtonValue === 'true') {
      setIsAutoUpdateEvery30SecondsEnabled(true);
    } else {
      setIsAutoUpdateEvery30SecondsEnabled(false);
    }
  }, []);

  useEffect(() => {
    let interval;
    if (isAutoUpdateEvery30SecondsEnabled && refetchExecutionCardData) {
      interval = setInterval(() => {
        refetchExecutionCardData();
      }, THIRTY_SECONDS);
    }
    return () => clearInterval(interval);
  }, [isAutoUpdateEvery30SecondsEnabled, refetchExecutionCardData]);

  useEffect(() => {
    const getAutoUpdateButtonValue = localStorage.getItem(IS_AUTO_UPDATE_EVERY_30_SECONDS_ENABLED);
    if (getAutoUpdateButtonValue === 'true') {
      setIsAutoUpdateEvery30SecondsEnabled(true);
    } else {
      setIsAutoUpdateEvery30SecondsEnabled(false);
    }
  }, []);

  const handleAutoUpdateButtonToggle = () => {
    localStorage.setItem(IS_AUTO_UPDATE_EVERY_30_SECONDS_ENABLED, !isAutoUpdateEvery30SecondsEnabled);

    setIsAutoUpdateEvery30SecondsEnabled(!isAutoUpdateEvery30SecondsEnabled);
  };

  const onIndividualRecordStatusFilterChange = (event) => {
    setSelectIndividualRecordStatus(event);
  };

  const getIndividualRecordStatusOptions = () => {
    return INDIVIDUAL_RECORD_STATUS_OPTIONS.map((item) => ({
      label: item.label,
      value: item.value,
    }));
  };

  const onIndividualRecordExecutionFilterChange = (event) => {
    setSelectIndividualRecordExecution(event);
  };

  const getIndividualRecordExecutionOptions = () => {
    return executionIdFilters?.content?.map((item) => ({ label: item?.id, value: item?.id })) ?? [];
  };

  const getIndividualCardStats = (key) => {
    if (!getAllMigrationExecutionStatistics) return 0;

    if (selectIndividualRecordStatus.value === ALL_RECORD_STATUS_VALUE) {
      const firstValue =
        getAllMigrationExecutionStatistics?.[RECORD_STATUS_EXECUTION_API_KEYS.recordStats]?.[
          RECORD_STATUS_EXECUTION_API_KEYS.numProcessing
        ]?.[key] ?? 0;

      const secondValue =
        getAllMigrationExecutionStatistics?.[RECORD_STATUS_EXECUTION_API_KEYS.recordStats]?.[
          RECORD_STATUS_EXECUTION_API_KEYS.numFallout
        ]?.[key] ?? 0;

      return firstValue + secondValue;
    }
    if (selectIndividualRecordStatus.value === PROCESSING_STATUS_VALUE) {
      const firstValue =
        getAllMigrationExecutionStatistics?.[RECORD_STATUS_EXECUTION_API_KEYS.recordStats]?.[
          RECORD_STATUS_EXECUTION_API_KEYS.numProcessing
        ]?.[key] ?? 0;

      return firstValue;
    }
    if (selectIndividualRecordStatus.value === FALLOUT_STATUS_VALUE) {
      const firstValue =
        getAllMigrationExecutionStatistics?.[RECORD_STATUS_EXECUTION_API_KEYS.recordStats]?.[
          RECORD_STATUS_EXECUTION_API_KEYS.numFallout
        ]?.[key] ?? 0;

      return firstValue;
    }
  };

  return (
    <Card className={`${classes.tableCard} ${classes.modifyLeftBorderRadius}`}>
      <div className={classes.switchColumnRoot}>
        <div className={classes.switchRoot}>
          <Switch
            checked={isAutoUpdateEvery30SecondsEnabled}
            onChange={handleAutoUpdateButtonToggle}
            className={classes.switch}
            thumbClassName={classes.thumb}
            activeLabel={USE_LESS_VALUE_FOR_SWITCH_SPACING}
            inactiveLabel={USE_LESS_VALUE_FOR_SWITCH_SPACING}
          />

          <div className={classes.switchText}>Auto-Update Statistics Every 30 Seconds</div>
        </div>

        <button className={classes.manuallyUpdateButton} onClick={refetchExecutionCardData}>
          <img src={MR_Manager_manualUpdate} alt="" />
          Manually Update Statistics
        </button>
      </div>

      <div className={classes.separationLine} />
      <div className="">
        <div className={classes.boldTitleFirst}>Individual Record Status</div>

        <div className={classes.filterRoot}>
          <div className={classes.flex_row_date}>
            <p className={classes.sortByStatus}>Status</p>
            <CustomSelect
              options={getIndividualRecordStatusOptions()}
              onChange={onIndividualRecordStatusFilterChange}
              value={[selectIndividualRecordStatus]}
              placeholder="All Record Status"
              components={{
                DropdownIndicator: CustomIndicatorArrow,
              }}
              menuPortalTarget={document.body}
              closeMenuOnSelect
              withSeparator
              filter
              mb={0}
              maxHeight={30}
              menuPadding={0}
            />
          </div>

          <div className={classes.flex_row_date}>
            <p className={classes.sortBy}>Execution</p>
            <CustomSelect
              options={getIndividualRecordExecutionOptions()}
              onChange={onIndividualRecordExecutionFilterChange}
              value={[selectIndividualRecordExecution]}
              placeholder="All Executions"
              isClearable
              components={{
                DropdownIndicator: CustomIndicatorArrow,
              }}
              menuPortalTarget={document.body}
              closeMenuOnSelect
              withSeparator
              filter
              mb={0}
              maxHeight={30}
              menuPadding={0}
            />
          </div>
        </div>

        {getAllMigrationExecutionStatisticsLoading ? (
          <div className={classes.recordStatusRootParent}>
            <Spinner inline />
          </div>
        ) : (
          <div className={classes.recordStatusRootParent}>
            <Scrollbars>
              <div className={classes.executionDiagramBg}>
                <div className={classes.recordStatusRoot}>
                  <img src={MR_Manager_Long_line} alt="" className={classes.arrowAbsoluteLongLineImg} />
                  <RecordStatusCardComponent
                    recordRootClass={classes.recordExtractionRoot}
                    headerColorClass={classes.headerExtractionColorClass}
                    headerTitle="Extraction"
                  >
                    <div
                      className={`${classes.individualRecordCardRoot}
                `}
                    >
                      <IndividualRecordCard
                        stats={getIndividualCardStats(RECORD_STATUS_EXECUTION_API_KEYS.numExtractionProcessing)}
                        stageNumber={1}
                        stageTitle="Executing"
                        gradientColor={classes.extractionSquareGradient}
                        className={classes.squareStatsRightRoot}
                      />
                    </div>
                  </RecordStatusCardComponent>

                  <RecordStatusCardComponent
                    recordRootClass={classes.recordTransformationRoot}
                    headerColorClass={classes.headerTransformationColorClass}
                    headerTitle="Transformation"
                  >
                    <div
                      className={`${classes.individualRecordCardRoot}
                `}
                    >
                      <IndividualRecordCard
                        stats={getIndividualCardStats(RECORD_STATUS_EXECUTION_API_KEYS.numTransformBatchWaiting)}
                        stageNumber={2}
                        stageTitle="Waiting"
                        gradientColor={classes.transformationSquareGradient}
                        className={classes.squareStatsLeftSecondRoot}
                      />

                      <IndividualRecordCard
                        stats={getIndividualCardStats(RECORD_STATUS_EXECUTION_API_KEYS.numTransformProcessing)}
                        stageNumber={3}
                        stageTitle="Executing"
                        gradientColor={classes.transformationSquareGradient}
                        className={classes.squareStatsRightSecondRoot}
                      />
                    </div>
                  </RecordStatusCardComponent>

                  <RecordStatusCardComponent
                    recordRootClass={classes.recordLoadingRoot}
                    headerColorClass={classes.headerLoadingColorClass}
                    headerTitle="Loading"
                  >
                    <div
                      className={`${classes.individualRecordCardRoot}
                `}
                    >
                      <IndividualRecordCard
                        stats={getIndividualCardStats(RECORD_STATUS_EXECUTION_API_KEYS.numLoadWaiting)}
                        stageNumber={4}
                        stageTitle="Waiting"
                        gradientColor={classes.loadingSquareGradient}
                        className={classes.squareStatsLeftThirdRoot}
                      />

                      <IndividualRecordCard
                        stats={getIndividualCardStats(RECORD_STATUS_EXECUTION_API_KEYS.numLoadProcessing)}
                        stageNumber={5}
                        stageTitle="Executing"
                        gradientColor={classes.loadingSquareGradient}
                        className={classes.squareStatsRightThirdRoot}
                      />
                    </div>
                  </RecordStatusCardComponent>

                  <RecordStatusCardComponent
                    recordRootClass={classes.recordPostLoadingRoot}
                    headerColorClass={classes.headerPostLoadingColorClass}
                    headerTitle="Post-Loading"
                  >
                    <div className={`${classes.individualRecordCardRoot}`}>
                      <IndividualRecordCard
                        stats={getIndividualCardStats(RECORD_STATUS_EXECUTION_API_KEYS.numReconciliationWaiting)}
                        stageNumber={6}
                        stageTitle="Waiting"
                        gradientColor={classes.postLoadingSquareGradient}
                        className={classes.squareStatsLeftFourthRoot}
                      />

                      <IndividualRecordCard
                        stats={getIndividualCardStats(RECORD_STATUS_EXECUTION_API_KEYS.numReconciliationProcessing)}
                        stageNumber={7}
                        stageTitle="Executing"
                        gradientColor={classes.postLoadingSquareGradient}
                        className={classes.squareStatsRightFourthRoot}
                      />
                    </div>
                  </RecordStatusCardComponent>

                  <RecordStatusCardComponent
                    recordRootClass={classes.recordResultRoot}
                    headerColorClass={classes.headerResultColorClass}
                    headerTitle="Result"
                  >
                    <div className={classes.individualRecordCardRoot}>
                      <IndividualRecordCard
                        stats={
                          getAllMigrationExecutionStatistics?.[RECORD_STATUS_EXECUTION_API_KEYS.recordStats]?.[
                            RECORD_STATUS_EXECUTION_API_KEYS.numCompleted
                          ]
                        }
                        stageNumber={8}
                        stageTitle="Complete"
                        gradientColor={classes.resultSquareGradient}
                        className={classes.squareStatsResultRoot}
                      />
                    </div>
                  </RecordStatusCardComponent>
                </div>
              </div>
            </Scrollbars>
          </div>
        )}
      </div>

      <div className="">
        <div className={classes.boldTitle}>Batch Insights</div>

        <div className={classes.cards_grid}>
          <StatsCard
            mainTitle="Transform Batch Status"
            firstTitle="Batch Preparation"
            secondTitle="Waiting"
            thirdTitle="Transforming & Mapping"
            fourthTitle="Complete"
            firstStatCard={getAllMigrationExecutionStatistics?.batchTransformStats?.numBatchPrep}
            secondStatCard={getAllMigrationExecutionStatistics?.batchTransformStats?.numWaiting}
            thirdStatCard={getAllMigrationExecutionStatistics?.batchTransformStats?.numMapping}
            fourthStatCard={getAllMigrationExecutionStatistics?.batchTransformStats?.numDone}
            isFetching={getAllMigrationExecutionStatisticsLoading}
          />

          <StatsCard
            mainTitle="Load Batch Status"
            firstTitle="Waiting"
            secondTitle="Migrating"
            thirdTitle="Loading"
            fourthTitle="Complete"
            firstStatCard={getAllMigrationExecutionStatistics?.batchLoadStats?.numWaiting}
            secondStatCard={getAllMigrationExecutionStatistics?.batchLoadStats?.numMigrating}
            thirdStatCard={getAllMigrationExecutionStatistics?.batchLoadStats?.numLoading}
            fourthStatCard={getAllMigrationExecutionStatistics?.batchLoadStats?.numComplete}
            isFetching={getAllMigrationExecutionStatisticsLoading}
          />
        </div>
      </div>

      <div className={classes.separationLineLight} />

      <div className={classes.boldTitle}>Execution Insights</div>

      <StatsCard
        mainTitle="Execution Status"
        firstTitle="Waiting"
        secondTitle="Migrating"
        thirdTitle="Post-Migrating"
        fourthTitle="Complete"
        firstStatCard={getAllMigrationExecutionStatistics?.executionStats?.numWaiting}
        secondStatCard={getAllMigrationExecutionStatistics?.executionStats?.numMigrating}
        thirdStatCard={getAllMigrationExecutionStatistics?.executionStats?.numPostMigration}
        fourthStatCard={getAllMigrationExecutionStatistics?.executionStats?.numDone}
        isFetching={getAllMigrationExecutionStatisticsLoading}
      />

      <div className={classes.separationLineLight} />

      <CurrentExecutionsTable
        setShowCancelExecutionModal={setShowCancelExecutionModal}
        setClickedTableRowData={setClickedTableRowData}
        setSearchFilterAPI={setSearchFilterAPI}
        setPageNumber={setPageNumber}
        searchFilterAPI={searchFilterAPI}
        requests={requests}
        error={error}
        isLoading={isLoading}
        setPageSize={setPageSize}
      />
    </Card>
  );
};

const DesignAndExecution = ({
  activeTab,
  selectSortByTargetSystem,
  setSelectSortByTargetSystem,
  getTargetSystemsOptions,
  setRefetchExecutionCardData,
  refetchExecutionCardData,
  fetchExecutionIds,
  executionIdFilters,
  fetchAllTargetSystems,
}) => {
  const [searchFilterAPI, setSearchFilterAPI] = useState('');
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_TABLE_PAGE_SIZE);
  const { user } = useUser();

  const [selectIndividualRecordStatus, setSelectIndividualRecordStatus] = useState(INDIVIDUAL_RECORD_STATUS_OPTIONS[0]);
  const [selectIndividualRecordExecution, setSelectIndividualRecordExecution] = useState();
  const [refetchTableDataFunction, setRefetchTableDataFunction] = useState(() => {});

  // useQuery
  const {
    data: getAllMigrationExecutionStatistics,
    isFetching: getAllMigrationExecutionStatisticsLoading,
    refetch: refetchStatistics,
  } = useQuery({
    queryKey: ['getAllMigrationExecutionStats', selectSortByTargetSystem?.value],
    queryFn: () => getAllMigrationExecutionStats(selectSortByTargetSystem?.value),
  });

  const {
    data: getAllDesignExecutionStats,
    isFetching: getAllDesignExecutionStatisticsLoading,
    refetch: refetchDesignStatistics,
  } = useQuery({
    queryKey: ['getAllDesignExecutionStats', selectSortByTargetSystem?.value],
    queryFn: () => getAllDesignExecutionStatsApi(selectSortByTargetSystem?.value),
  });

  // Use Axios for Summary table
  const {
    response: requests,
    isLoading,
    error,
    fetchData,
  } = useAxiosGet(
    `/executions/summaries?searchText=${searchFilterAPI}` +
      `&pageNumber=${pageNumber}` +
      `&pageSize=${pageSize}` +
      `&timezone=${user?.timezone}`,
    true,
    MIGRATE_ENGINE_API
  );

  useEffect(() => {
    if (fetchData) {
      setRefetchTableDataFunction(() => fetchData);
    }
  }, [fetchData]);

  // eslint-disable-next-line no-unused-vars
  const [, setClickedTableRowData] = useState();
  const [showCancelExecutionModal, setShowCancelExecutionModal] = useState(false);

  useEffect(() => {
    if (
      refetchTableDataFunction &&
      fetchExecutionIds &&
      refetchStatistics &&
      fetchAllTargetSystems &&
      refetchDesignStatistics
    ) {
      const recallStatsApis = () => {
        refetchTableDataFunction(true);
        fetchExecutionIds();
        refetchStatistics();
        refetchDesignStatistics();
        fetchAllTargetSystems();
      };

      setRefetchExecutionCardData(() => recallStatsApis);
    }
  }, [refetchTableDataFunction, fetchExecutionIds, refetchStatistics, refetchDesignStatistics, fetchAllTargetSystems]);

  return (
    <div className={classes.root}>
      {activeTab === TAB_VIEW.DESIGN ? (
        <DesignComponent
          selectSortByTargetSystem={selectSortByTargetSystem}
          setSelectSortByTargetSystem={setSelectSortByTargetSystem}
          getTargetSystemsOptions={getTargetSystemsOptions}
          getAllDesignExecutionStatisticsLoading={getAllDesignExecutionStatisticsLoading}
          getAllDesignExecutionStats={getAllDesignExecutionStats}
          refetchExecutionCardData={refetchExecutionCardData}
        />
      ) : (
        <ExecutionComponent
          setSelectIndividualRecordStatus={setSelectIndividualRecordStatus}
          setSelectIndividualRecordExecution={setSelectIndividualRecordExecution}
          selectIndividualRecordStatus={selectIndividualRecordStatus}
          selectIndividualRecordExecution={selectIndividualRecordExecution}
          setShowCancelExecutionModal={setShowCancelExecutionModal}
          setClickedTableRowData={setClickedTableRowData}
          getAllMigrationExecutionStatistics={getAllMigrationExecutionStatistics}
          getAllMigrationExecutionStatisticsLoading={getAllMigrationExecutionStatisticsLoading}
          executionIdFilters={executionIdFilters}
          refetchExecutionCardData={refetchExecutionCardData}
          setSearchFilterAPI={setSearchFilterAPI}
          setPageNumber={setPageNumber}
          searchFilterAPI={searchFilterAPI}
          requests={requests}
          error={error}
          isLoading={isLoading}
          setPageSize={setPageSize}
        />
      )}

      <Modal
        show={showCancelExecutionModal}
        modalClosed={() => setShowCancelExecutionModal(false)}
        className={classes.modal}
      >
        <CloseIcon className={classes.closeIcon} onClick={() => setShowCancelExecutionModal(false)} />
        <ErrorOutlineIcon className={classes.warningIcon} />

        <div className={classes.description_title}>Are You Sure?</div>
        <div className={classes.description}>
          <div>
            You are about to permanently cancel{' '}
            <span className={classes.ModalValueBold}>
              {'DUMMY NAME' ?? '---'}. This will remove it from the list and it cannot be restored
            </span>
          </div>
        </div>
        <div className={classes.modalButtons}>
          <button className={classes.modalCancelButton} onClick={() => setShowCancelExecutionModal(false)}>
            Go Back
          </button>
          <button className={classes.modalDeleteButton}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
};

export default DesignAndExecution;

DesignAndExecution.propTypes = {
  activeTab: PropTypes.number,
  selectSortByTargetSystem: PropTypes.object,
  setSelectSortByTargetSystem: PropTypes.func,
  getTargetSystemsOptions: PropTypes.func,
  setRefetchExecutionCardData: PropTypes.func,
  refetchExecutionCardData: PropTypes.func,
  fetchExecutionIds: PropTypes.func,
  fetchAllTargetSystems: PropTypes.func,
  executionIdFilters: PropTypes.oneOfType(PropTypes.array, PropTypes.object),
};

DesignComponent.propTypes = {
  selectSortByTargetSystem: PropTypes.object,
  setSelectSortByTargetSystem: PropTypes.func,
  getTargetSystemsOptions: PropTypes.func,
  areNewDesignUpdatesAvailable: PropTypes.bool,
  getAllDesignExecutionStatisticsLoading: PropTypes.bool,
};

StatsCard.propTypes = {
  mainTitle: PropTypes.string,
  firstStatCard: PropTypes.number,
  secondStatCard: PropTypes.number,
  thirdStatCard: PropTypes.number,
  fourthStatCard: PropTypes.number,
  isFetching: PropTypes.bool,
  firstTitle: PropTypes.string,
  secondTitle: PropTypes.string,
  thirdTitle: PropTypes.string,
  fourthTitle: PropTypes.string,
};

RecordStatusCardComponent.propTypes = {
  recordRootClass: PropTypes.string,
  headerTitle: PropTypes.string,
  headerColorClass: PropTypes.string,
  children: PropTypes.element,
};

IndividualRecordCard.propTypes = {
  stats: PropTypes.number,
  stageNumber: PropTypes.number,
  stageTitle: PropTypes.string,
  gradientColor: PropTypes.string,
  className: PropTypes.string,
};

ExecutionComponent.propTypes = {
  setSelectIndividualRecordStatus: PropTypes.func,
  selectIndividualRecordStatus: PropTypes.object,
  selectIndividualRecordExecution: PropTypes.object,
  setSelectIndividualRecordExecution: PropTypes.func,
  setShowCancelExecutionModal: PropTypes.func,
  refetchExecutionCardData: PropTypes.func,
  setClickedTableRowData: PropTypes.func,
  getAllMigrationExecutionStatistics: PropTypes.object,
  getAllMigrationExecutionStatisticsLoading: PropTypes.bool,
  executionIdFilters: PropTypes.oneOfType(PropTypes.array, PropTypes.object),
};
