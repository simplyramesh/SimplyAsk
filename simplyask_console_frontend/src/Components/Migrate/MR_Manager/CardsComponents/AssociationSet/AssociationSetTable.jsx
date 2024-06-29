/* eslint-disable no-unused-vars */
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Modal, SidedrawerModal } from 'simplexiar_react_components';

import crossIconTable from '../../../../../Assets/icons/crossIconTable.svg';
import { useFixedSideModalWidth } from '../../../../../hooks/useSideModalWidth';
import {
  deleteAssociationTableRowById,
  getAllSourcesOrTargetsOrFieldsNames,
  getAllSourcesOrTargetsOrFieldsObjects,
  getAllSourcesOrTargetsOrFieldsSystems,
} from '../../../../../Services/axios/migrate';
import { modifyAppliedFilterTimeStampsWithoutTime } from '../../../../../utils/helperFunctions';
import { CALENDAR_DATE_KEYS } from '../../../../shared/Calendars/PredefinedOptionsCalendar/CalendarComponent';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import Spinner from '../../../../shared/Spinner/Spinner';
import { convertFilterObjectsToStrings, SOURCES_TARGETS_FIELDS_FILTER_KEYS } from '../../MR_Manager';
import classes from './AssociationSetTable.module.css';
import originalTableHeaders, { ASSOCIATION_SET_TABLE_KEYS, uniqueId } from './requestHeadersSchema';
import SideModalFilters from './SideModalFilters/SideModalFilters';
import Table from './TableViews/Table.js';

export const FILTER_TEMPLATE_KEYS = {
  sourceSystemFilter: 'sourceSystemFilter',
  sourceObjectFilter: 'sourceObjectFilter',
  sourceFieldFilter: 'sourceFieldFilter',
  targetSystemFilter: 'targetSystemFilter',
  targetObjectFilter: 'targetObjectFilter',
  targetFieldFilter: 'targetFieldFilter',
  sourcesFilterArray: 'sourcesFilterArray',
  searchFilterAPI: 'searchFilterAPI',
  isAscending: 'isAscending',
  pageNumber: 'pageNumber',
};

const FILTER_TEMPLATE = {
  [FILTER_TEMPLATE_KEYS.searchFilterAPI]: '',
  [FILTER_TEMPLATE_KEYS.pageNumber]: 0,
  [CALENDAR_DATE_KEYS.EDITED_AFTER]: '',
  [CALENDAR_DATE_KEYS.EDITED_BEFORE]: '',
  [CALENDAR_DATE_KEYS.CREATED_AFTER]: '',
  [CALENDAR_DATE_KEYS.CREATED_BEFORE]: '',
};

const FILTER_TRIGGER_TEMPLATE = {
  [FILTER_TEMPLATE_KEYS.sourceSystemFilter]: '',
  [FILTER_TEMPLATE_KEYS.sourceObjectFilter]: '',
  [FILTER_TEMPLATE_KEYS.sourceFieldFilter]: '',
  [FILTER_TEMPLATE_KEYS.targetSystemFilter]: '',
  [FILTER_TEMPLATE_KEYS.targetObjectFilter]: '',
  [FILTER_TEMPLATE_KEYS.targetFieldFilter]: '',
  [FILTER_TEMPLATE_KEYS.pageNumber]: 0,
  [FILTER_TEMPLATE_KEYS.searchFilterAPI]: '',
  [CALENDAR_DATE_KEYS.EDITED_AFTER]: '',
  [CALENDAR_DATE_KEYS.EDITED_BEFORE]: '',
  [CALENDAR_DATE_KEYS.CREATED_AFTER]: '',
  [CALENDAR_DATE_KEYS.CREATED_BEFORE]: '',
};

export const TABLE_RESPONSIVENESS_WIDTHS = {
  large: 1320,
  medium: 1050,
  small: 850,
};

export const modifyArrowedFiltersString = (item, key1, key2, key3, showLabel = true) => {
  if (!item) return '---';
  let finalString = '';

  if (showLabel) {
    if (item && item[key1] && item[key2] && item[key3]) {
      finalString = `${item[key1].label} → ${item[key2].label} → ${item[key3].label}`;
    } else if (item && item[key1] && item[key2]) {
      finalString = `${item[key1].label} → ${item[key2].label}`;
    } else if (item && item[key1] && item[key3]) {
      finalString = `${item[key1].label} → ${item[key3].label}`;
    } else if (item && item[key1]) {
      finalString = `${item[key1].label}`;
    }
  } else if (item && item[key1] && item[key2] && item[key3]) {
    finalString = `${item[key1]} → ${item[key2]} → ${item[key3]}`;
  } else if (item && item[key1] && item[key2]) {
    finalString = `${item[key1]} → ${item[key2]}`;
  } else if (item && item[key1] && item[key3]) {
    finalString = `${item[key1]} → ${item[key3]}`;
  } else if (item && item[key1]) {
    finalString = `${item[key1]}`;
  }
  return finalString;
};

export const ComputeViewAppliedFilters = ({
  appliedFilters,
  ClearAllProcessViewFilters,
  viewBackupFilters,
  setSourcesFilterArray,
  sourcesFilterArray,
  setFilterTriggerQuery,
  setFilterQuery,
  setViewBackupFilters,
  appliedFiltersRef,
  cleanAllProcessFilters,
  targetsFilterArray,
  setTargetsFilterArray,
  showSourcesFilterInsideSideModal = false,
  showTargetFilterInsideSideModal = false,
  showFiltersInsideSideModal = showSourcesFilterInsideSideModal || showTargetFilterInsideSideModal,
}) => {
  const LAST_EDITED_DATE = 'Last Edited Date: ';
  const CREATED_DATE = 'Created Date: ';

  const filtersLocalDataSet = [];
  const filtersLocalDataSetForSideModal = [];

  if (showTargetFilterInsideSideModal && targetsFilterArray?.length > 0) {
    targetsFilterArray.forEach((item) => {
      const filterData = {
        boldTitle: 'Targets: ',
        modifiedString: modifyArrowedFiltersString(
          item,
          FILTER_TEMPLATE_KEYS.targetSystemFilter,
          FILTER_TEMPLATE_KEYS.targetObjectFilter,
          FILTER_TEMPLATE_KEYS.targetFieldFilter
        ),
        resetFilter: () => {
          const handleBackupArray = targetsFilterArray;

          setTargetsFilterArray([...handleBackupArray]?.filter((removeItem) => removeItem !== item));
        },
      };

      filtersLocalDataSetForSideModal.push(filterData);
    });
  } else if (
    targetsFilterArray?.length > 0 &&
    viewBackupFilters?.targetsFilterArray?.length > 0 &&
    !showTargetFilterInsideSideModal
  ) {
    viewBackupFilters?.targetsFilterArray.forEach((item) => {
      const filterData = {
        boldTitle: 'Targets: ',
        modifiedString: modifyArrowedFiltersString(
          item,
          FILTER_TEMPLATE_KEYS.targetSystemFilter,
          FILTER_TEMPLATE_KEYS.targetObjectFilter,
          FILTER_TEMPLATE_KEYS.targetFieldFilter
        ),
        resetFilter: () => {
          const handleBackupArray = viewBackupFilters?.targetsFilterArray;

          setTargetsFilterArray([...handleBackupArray]?.filter((removeItem) => removeItem !== item));

          setViewBackupFilters((prev) => ({
            ...prev,
            targetsFilterArray: [...handleBackupArray]?.filter((removeItem) => removeItem !== item),
          }));
        },
      };

      filtersLocalDataSet.push(filterData);
    });
  }

  if (showSourcesFilterInsideSideModal && sourcesFilterArray?.length > 0) {
    sourcesFilterArray.forEach((item) => {
      const filterData = {
        boldTitle: 'Sources: ',
        modifiedString: modifyArrowedFiltersString(
          item,
          FILTER_TEMPLATE_KEYS.sourceSystemFilter,
          FILTER_TEMPLATE_KEYS.sourceObjectFilter,
          FILTER_TEMPLATE_KEYS.sourceFieldFilter
        ),
        resetFilter: () => {
          const handleBackupArray = sourcesFilterArray;

          setSourcesFilterArray([...handleBackupArray]?.filter((removeItem) => removeItem !== item));
        },
      };

      filtersLocalDataSetForSideModal.push(filterData);
    });
  } else if (
    sourcesFilterArray?.length > 0 &&
    viewBackupFilters?.sourcesFilterArray?.length > 0 &&
    !showSourcesFilterInsideSideModal
  ) {
    viewBackupFilters?.sourcesFilterArray.forEach((item) => {
      const filterData = {
        boldTitle: 'Sources: ',
        modifiedString: modifyArrowedFiltersString(
          item,
          FILTER_TEMPLATE_KEYS.sourceSystemFilter,
          FILTER_TEMPLATE_KEYS.sourceObjectFilter,
          FILTER_TEMPLATE_KEYS.sourceFieldFilter
        ),
        resetFilter: () => {
          const handleBackupArray = viewBackupFilters?.sourcesFilterArray;

          setSourcesFilterArray([...handleBackupArray]?.filter((removeItem) => removeItem !== item));

          setViewBackupFilters((prev) => ({
            ...prev,
            sourcesFilterArray: [...handleBackupArray]?.filter((removeItem) => removeItem !== item),
          }));
        },
      };

      filtersLocalDataSet.push(filterData);
    });
  }

  if (appliedFilters?.searchFilterAPI?.length > 0 && !showFiltersInsideSideModal) {
    filtersLocalDataSet.push({
      boldTitle: 'Search: ',
      modifiedString: appliedFilters.searchFilterAPI,
      resetFilter: () => {
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

  if (
    viewBackupFilters?.[CALENDAR_DATE_KEYS.EDITED_AFTER]?.length > 0 &&
    viewBackupFilters?.[CALENDAR_DATE_KEYS.EDITED_BEFORE]?.length > 0
  ) {
    filtersLocalDataSet.push({
      boldTitle: LAST_EDITED_DATE,

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
    filtersLocalDataSet.push({
      boldTitle: CREATED_DATE,

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

  if (filtersLocalDataSetForSideModal && showFiltersInsideSideModal) {
    return (
      <div className={`${classes.flex_row_component_filters} ${classes.flex_wrap_only} ${classes.margin_top_12px}`}>
        {filtersLocalDataSetForSideModal?.map((item, index) => (
          <div className={classes.filterRowBg} key={index}>
            <div className={classes.boldTitle}>{item.boldTitle}</div>
            <div className="">{item.modifiedString}</div>
            <div className={classes.crossIcon} onClick={item.resetFilter}>
              <img src={crossIconTable} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {filtersLocalDataSet?.length > 0 ? (
        <div
          className={`${classes.flex_row_component_filters} ${classes.marginBottom20px} ${classes.flex_wrap_only}`}
          ref={appliedFiltersRef}
        >
          <ClearAllProcessViewFilters
            displayOnlyCleanFilterBtn
            cleanAllProcessFilters={cleanAllProcessFilters}
            setViewBackupFilters={setViewBackupFilters}
          />
          <div
            className={`${classes.flex_row_component_filters} ${classes.flex_wrap_only} ${classes.margin_left_15px}`}
          >
            {filtersLocalDataSet?.map((item, index) => (
              <div className={classes.filterRowBg} key={index}>
                <div className={classes.boldTitle}>{item.boldTitle}</div>
                <div className="">{item.modifiedString}</div>
                <div className={classes.crossIcon} onClick={item.resetFilter}>
                  <img src={crossIconTable} alt="" />
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
};

const ClearAllProcessViewFilters = ({ displayOnlyCleanFilterBtn, cleanAllProcessFilters, setViewBackupFilters }) => {
  const resetFilters = () => {
    cleanAllProcessFilters();
    setViewBackupFilters();
  };

  if (displayOnlyCleanFilterBtn) {
    return (
      <div className={`${classes.paddingSides} ${classes.centerVertically}`}>
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

const AssociationSetTable = ({ scrollToTopRef }) => {
  const isSourceSystems = SOURCES_TARGETS_FIELDS_FILTER_KEYS.SOURCE;
  const isTargetSystems = SOURCES_TARGETS_FIELDS_FILTER_KEYS.TARGET;

  const fixedSideModalWidth = useFixedSideModalWidth();

  // Sources Filter
  const [selectSourceSystemFilter, setSelectSourceSystemFilter] = useState();
  const [selectSourceObjectFilter, setSelectSourceObjectFilter] = useState();
  const [selectSourceFieldFilter, setSelectSourceFieldFilter] = useState();
  const [sourcesFilterArray, setSourcesFilterArray] = useState([]);

  // Target Filters
  const [selectTargetSystemFilter, setSelectTargetSystemFilter] = useState();
  const [selectTargetObjectFilter, setSelectTargetObjectFilter] = useState();
  const [selectTargetFieldFilter, setSelectTargetFieldFilter] = useState();
  const [targetsFilterArray, setTargetsFilterArray] = useState([]);

  const [filterQuery, setFilterQuery] = useState(FILTER_TEMPLATE);
  const [filterTriggerQuery, setFilterTriggerQuery] = useState(FILTER_TRIGGER_TEMPLATE);
  const [viewBackupFilters, setViewBackupFilters] = useState();

  const [clickedTableRowData, setClickedTableRowData] = useState();

  const [executionData, setExecutionData] = useState();

  const [viewTableHeaders, setViewTableHeaders] = useState(() => originalTableHeaders);
  const appliedFiltersRef = useRef();

  // useQuery
  const { data: getAllSourcesSystems, refetch: fetchAllSourcesSystems } = useQuery({
    queryKey: ['getAllSourcesSystems', isSourceSystems],
    queryFn: () => getAllSourcesOrTargetsOrFieldsSystems(isSourceSystems),
  });

  const { data: getAllTargetSystems, refetch: fetchAllTargetSystems } = useQuery({
    queryKey: ['getAllTargetSystems', isTargetSystems],
    queryFn: () => getAllSourcesOrTargetsOrFieldsSystems(isTargetSystems),
  });

  const { data: getAllSourcesObjects, refetch: fetchAllSourcesObjects } = useQuery({
    queryKey: ['getAllSourcesObjects', selectSourceSystemFilter?.value, isSourceSystems],
    queryFn: () => getAllSourcesOrTargetsOrFieldsObjects(selectSourceSystemFilter?.value, isSourceSystems),
  });

  const { data: getAllTargetObjects, refetch: fetchAllTargetObjects } = useQuery({
    queryKey: ['getAllTargetObjects', selectTargetSystemFilter?.value, isTargetSystems],
    queryFn: () => getAllSourcesOrTargetsOrFieldsObjects(selectTargetSystemFilter?.value, isTargetSystems),
  });

  const { data: getAllSourcesNames, refetch: fetchAllSourcesNames } = useQuery({
    queryKey: ['getAllSourcesNames', selectSourceObjectFilter?.value, isSourceSystems],
    queryFn: () => getAllSourcesOrTargetsOrFieldsNames(selectSourceObjectFilter?.value, isSourceSystems),
  });

  const { data: getAllTargetNames, refetch: fetchTargetNames } = useQuery({
    queryKey: ['getAllTargetNames', selectTargetObjectFilter?.value, isTargetSystems],
    queryFn: () => getAllSourcesOrTargetsOrFieldsNames(selectTargetObjectFilter?.value, isTargetSystems),
  });

  // BaseSidebar and Modal
  const [showFiltersSideModal, setShowFiltersSideModal] = useState(false);
  const [showDeleteAssociationSetModal, setShowDeleteAssociationSetModal] = useState(false);
  const [loadingDeleteAssociationSetModal, setLoadingDeleteAssociationSetModal] = useState(false);

  useEffect(() => {
    setFilterTriggerQuery((prev) => ({
      ...prev,
      [FILTER_TEMPLATE_KEYS.pageNumber]: 0,
    }));
  }, [
    filterTriggerQuery[FILTER_TEMPLATE_KEYS.searchFilterAPI],
    filterTriggerQuery[CALENDAR_DATE_KEYS.START_DATE],
    filterTriggerQuery[CALENDAR_DATE_KEYS.END_DATE],
    viewBackupFilters?.[FILTER_TEMPLATE_KEYS.sourceSystemFilter],
    viewBackupFilters?.[FILTER_TEMPLATE_KEYS.sourceObjectFilter],
    viewBackupFilters?.[FILTER_TEMPLATE_KEYS.sourceFieldFilter],
    viewBackupFilters?.[FILTER_TEMPLATE_KEYS.targetSystemFilter],
    viewBackupFilters?.[FILTER_TEMPLATE_KEYS.targetObjectFilter],
    viewBackupFilters?.[FILTER_TEMPLATE_KEYS.targetFieldFilter],
    filterTriggerQuery[FILTER_TEMPLATE_KEYS.isAscending],
  ]);

  useEffect(() => {
    let appendSourcesSystemIds = '';
    let appendSourcesObjectIds = '';
    let appendSourcesNameIds = '';

    const filterArray = viewBackupFilters?.sourcesFilterArray;

    if (filterArray?.length > 0) {
      filterArray.forEach((item, index) => {
        appendSourcesSystemIds = convertFilterObjectsToStrings(
          index,
          item[FILTER_TEMPLATE_KEYS.sourceSystemFilter],
          appendSourcesSystemIds
        );

        appendSourcesObjectIds = convertFilterObjectsToStrings(
          index,
          item[FILTER_TEMPLATE_KEYS.sourceObjectFilter],
          appendSourcesObjectIds
        );

        appendSourcesNameIds = convertFilterObjectsToStrings(
          index,
          item[FILTER_TEMPLATE_KEYS.sourceFieldFilter],
          appendSourcesNameIds
        );
      });
    }

    setFilterTriggerQuery((prev) => ({
      ...prev,
      [FILTER_TEMPLATE_KEYS.sourceSystemFilter]: appendSourcesSystemIds,
      [FILTER_TEMPLATE_KEYS.sourceObjectFilter]: appendSourcesObjectIds,
      [FILTER_TEMPLATE_KEYS.sourceFieldFilter]: appendSourcesNameIds,
    }));
  }, [viewBackupFilters?.sourcesFilterArray]);

  useEffect(() => {
    let appendTargetSystemIds = '';
    let appendTargetObjectIds = '';
    let appendTargetNameIds = '';

    const filterArray = viewBackupFilters?.targetsFilterArray;

    if (filterArray?.length > 0) {
      filterArray.forEach((item, index) => {
        appendTargetSystemIds = convertFilterObjectsToStrings(
          index,
          item[FILTER_TEMPLATE_KEYS.targetSystemFilter],
          appendTargetSystemIds
        );

        appendTargetObjectIds = convertFilterObjectsToStrings(
          index,
          item[FILTER_TEMPLATE_KEYS.targetObjectFilter],
          appendTargetObjectIds
        );

        appendTargetNameIds = convertFilterObjectsToStrings(
          index,
          item[FILTER_TEMPLATE_KEYS.targetFieldFilter],
          appendTargetNameIds
        );
      });
    }

    setFilterTriggerQuery((prev) => ({
      ...prev,
      [FILTER_TEMPLATE_KEYS.targetSystemFilter]: appendTargetSystemIds,
      [FILTER_TEMPLATE_KEYS.targetObjectFilter]: appendTargetObjectIds,
      [FILTER_TEMPLATE_KEYS.targetFieldFilter]: appendTargetNameIds,
    }));
  }, [viewBackupFilters?.targetsFilterArray]);

  const getSourceSystemFilterOptions = () => {
    return getAllSourcesSystems
      ?.map((item) => {
        const object = {
          label: item[ASSOCIATION_SET_TABLE_KEYS.SYSTEM_NAME],
          value: item[ASSOCIATION_SET_TABLE_KEYS.SYSTEM_ID],
        };

        return object;
      })
      ?.filter((item) => {
        let doesFilterAlreadyContainsOption = false;

        sourcesFilterArray.forEach((arrayItem) => {
          if (JSON.stringify(arrayItem[FILTER_TEMPLATE_KEYS.sourceSystemFilter]) === JSON.stringify(item)) {
            doesFilterAlreadyContainsOption = true;
          }
        });

        if (!doesFilterAlreadyContainsOption) return item;
      });
  };

  const getTargetSystemFilterOptions = () => {
    return getAllTargetSystems
      ?.map((item) => ({
        label: item[ASSOCIATION_SET_TABLE_KEYS.SYSTEM_NAME],
        value: item[ASSOCIATION_SET_TABLE_KEYS.SYSTEM_ID],
      }))
      ?.filter((item) => {
        let doesFilterAlreadyContainsOption = false;

        targetsFilterArray.forEach((arrayItem) => {
          if (JSON.stringify(arrayItem[FILTER_TEMPLATE_KEYS.targetSystemFilter]) === JSON.stringify(item)) {
            doesFilterAlreadyContainsOption = true;
          }
        });

        if (!doesFilterAlreadyContainsOption) return item;
      });
  };

  const getSourceObjectFilterOptions = () => {
    return getAllSourcesObjects?.map((item) => ({
      label: item[ASSOCIATION_SET_TABLE_KEYS.OBJECT_NAME],
      value: item[ASSOCIATION_SET_TABLE_KEYS.OBJECT_ID],
    }));
  };

  const getTargetObjectFilterOptions = () => {
    return getAllTargetObjects?.map((item) => ({
      label: item[ASSOCIATION_SET_TABLE_KEYS.OBJECT_NAME],
      value: item[ASSOCIATION_SET_TABLE_KEYS.OBJECT_ID],
    }));
  };

  const getSourceNamesFilterOptions = () => {
    return getAllSourcesNames?.map((item) => ({
      label: item[ASSOCIATION_SET_TABLE_KEYS.FIELD_NAME],
      value: item[ASSOCIATION_SET_TABLE_KEYS.FIELD_ID],
    }));
  };

  const getTargetNamesFilterOptions = () => {
    return getAllTargetNames?.map((item) => ({
      label: item[ASSOCIATION_SET_TABLE_KEYS.FIELD_NAME],
      value: item[ASSOCIATION_SET_TABLE_KEYS.FIELD_ID],
    }));
  };

  const setDeleteTableRowData = (event, data) => {
    event.stopPropagation();
    setClickedTableRowData(data);
    setShowDeleteAssociationSetModal(true);
  };

  const deleteAssociationSetById = async () => {
    setLoadingDeleteAssociationSetModal(true);
    try {
      const id = clickedTableRowData?.[ASSOCIATION_SET_TABLE_KEYS.SET_ID];
      const res = await deleteAssociationTableRowById(id);
      if (res) {
        toast.success(`The Association set with id - ${id} has been deleted successfully`);
        setShowDeleteAssociationSetModal(false);
        fetchAllSourcesSystems();
        fetchAllSourcesObjects();
        fetchAllSourcesNames();
        fetchAllTargetSystems();
        fetchAllTargetObjects();
        fetchTargetNames();
      }
    } catch (error) {
      toast.error('Something went wrong...');
    } finally {
      setLoadingDeleteAssociationSetModal(false);
    }
  };

  const cleanSelectSourcesFilter = () => {
    setSelectSourceSystemFilter(null);
    setSelectSourceObjectFilter(null);
    setSelectSourceFieldFilter(null);
  };

  const cleanSelectTargetFilter = () => {
    setSelectTargetSystemFilter(null);
    setSelectTargetObjectFilter(null);
    setSelectTargetFieldFilter(null);
  };

  const cleanAllProcessFilters = () => {
    cleanSelectSourcesFilter();
    cleanSelectTargetFilter();
    setViewBackupFilters();
    setSourcesFilterArray([]);
    setTargetsFilterArray([]);
    setFilterTriggerQuery(FILTER_TEMPLATE);
    setFilterQuery(FILTER_TEMPLATE);
    setShowFiltersSideModal(false);
  };

  const processSearchBarHandler = (event) => {
    const inputValue = event.target.value;

    setFilterTriggerQuery((prev) => ({
      ...prev,
      searchFilterAPI: inputValue,
    }));
  };

  const DisplayAppliedFilters = ({ appliedFilters, showProcessViewFilters }) => {
    if (!appliedFilters) return <></>;

    if (showProcessViewFilters) {
      return (
        <ComputeViewAppliedFilters
          appliedFilters={appliedFilters}
          ClearAllProcessViewFilters={ClearAllProcessViewFilters}
          sourcesFilterArray={sourcesFilterArray}
          targetsFilterArray={targetsFilterArray}
          viewBackupFilters={viewBackupFilters}
          setSourcesFilterArray={setSourcesFilterArray}
          setTargetsFilterArray={setTargetsFilterArray}
          setFilterTriggerQuery={setFilterTriggerQuery}
          setFilterQuery={setFilterQuery}
          setViewBackupFilters={setViewBackupFilters}
          appliedFiltersRef={appliedFiltersRef}
          cleanAllProcessFilters={cleanAllProcessFilters}
        />
      );
    }

    return <></>;
  };

  DisplayAppliedFilters.propTypes = {
    appliedFilters: PropTypes.object,
    showProcessViewFilters: PropTypes.bool,
  };

  return (
    <div className={classes.root}>
      <Table
        processSearchBarHandler={processSearchBarHandler}
        processSearchInputValue={filterTriggerQuery?.[FILTER_TEMPLATE_KEYS.searchFilterAPI]}
        setShowFiltersSideModal={setShowFiltersSideModal}
        executionData={executionData}
        viewTableHeaders={viewTableHeaders}
        setViewTableHeaders={setViewTableHeaders}
        uniqueId={uniqueId}
        setClickedTableRowData={setClickedTableRowData}
        setFilterTriggerQuery={setFilterTriggerQuery}
        filterTriggerQuery={filterTriggerQuery}
        setExecutionData={setExecutionData}
        DisplayAppliedFilters={DisplayAppliedFilters}
        viewBackupFilters={viewBackupFilters}
        scrollToTopRef={scrollToTopRef}
        setDeleteTableRowData={setDeleteTableRowData}
        showDeleteAssociationSetModal={showDeleteAssociationSetModal}
      />

      <SidedrawerModal
        show={showFiltersSideModal}
        closeModal={() => setShowFiltersSideModal(false)}
        width={fixedSideModalWidth}
        padding="0"
        closeBtnClassName={classes.sideModalCloseIcon}
        useCloseBtnClassName
      >
        <SideModalFilters
          processSearchBarHandler={processSearchBarHandler}
          processSearchInputValue={filterQuery.searchFilterAPI}
          setSelectSourceSystemFilter={setSelectSourceSystemFilter}
          cleanSelectSourcesFilter={cleanSelectSourcesFilter}
          setSelectSourceFieldFilter={setSelectSourceFieldFilter}
          setSourcesFilterArray={setSourcesFilterArray}
          selectSourceSystemFilter={selectSourceSystemFilter}
          selectSourceObjectFilter={selectSourceObjectFilter}
          setSelectSourceObjectFilter={setSelectSourceObjectFilter}
          selectSourceFieldFilter={selectSourceFieldFilter}
          sourcesFilterArray={sourcesFilterArray}
          setFilterQuery={setFilterQuery}
          setFilterTriggerQuery={setFilterTriggerQuery}
          filterQuery={filterQuery}
          cleanAllProcessFilters={cleanAllProcessFilters}
          setShowFiltersSideModal={setShowFiltersSideModal}
          showFiltersSideModal={showFiltersSideModal}
          viewBackupFilters={viewBackupFilters}
          setViewBackupFilters={setViewBackupFilters}
          ClearAllProcessViewFilters={ClearAllProcessViewFilters}
          getSourceObjectFilterOptions={getSourceObjectFilterOptions}
          getTargetObjectFilterOptions={getTargetObjectFilterOptions}
          selectTargetSystemFilter={selectTargetSystemFilter}
          selectTargetObjectFilter={selectTargetObjectFilter}
          selectTargetFieldFilter={selectTargetFieldFilter}
          targetsFilterArray={targetsFilterArray}
          setSelectTargetSystemFilter={setSelectTargetSystemFilter}
          setSelectTargetObjectFilter={setSelectTargetObjectFilter}
          setSelectTargetFieldFilter={setSelectTargetFieldFilter}
          setTargetsFilterArray={setTargetsFilterArray}
          cleanSelectTargetFilter={cleanSelectTargetFilter}
          getSourceSystemFilterOptions={getSourceSystemFilterOptions}
          getTargetSystemFilterOptions={getTargetSystemFilterOptions}
          getSourceNamesFilterOptions={getSourceNamesFilterOptions}
          getTargetNamesFilterOptions={getTargetNamesFilterOptions}
        />
      </SidedrawerModal>

      {loadingDeleteAssociationSetModal && <Spinner globalFadeBgParent />}

      <Modal
        show={showDeleteAssociationSetModal}
        modalClosed={() => setShowDeleteAssociationSetModal(false)}
        className={classes.modal}
      >
        <CloseIcon className={classes.closeIcon} onClick={() => setShowDeleteAssociationSetModal(false)} />
        <ErrorOutlineIcon className={classes.warningIcon} />
        <div className={classes.description_title}>Are You Sure?</div>
        <div className={classes.description}>
          <div>
            You are about to permanently delete Association Set:{' '}
            <span className={classes.ModalValueBold}>
              {clickedTableRowData?.[ASSOCIATION_SET_TABLE_KEYS.SET_ID] ?? '---'}. This will remove it from the list and
              it cannot be restored
            </span>
          </div>
        </div>
        <div className={classes.modalButtons}>
          <button className={classes.modalCancelButton} onClick={() => setShowDeleteAssociationSetModal(false)}>
            Cancel
          </button>
          <button className={classes.modalDeleteButton} onClick={deleteAssociationSetById}>
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AssociationSetTable;

AssociationSetTable.propTypes = {
  scrollToTopRef: PropTypes.object,
};

ComputeViewAppliedFilters.propTypes = {
  appliedFilters: PropTypes.object,
  ClearAllProcessViewFilters: PropTypes.func,
  viewBackupFilters: PropTypes.object,
  setSourcesFilterArray: PropTypes.func,
  setFilterTriggerQuery: PropTypes.func,
  setFilterQuery: PropTypes.func,
  setViewBackupFilters: PropTypes.func,
  appliedFiltersRef: PropTypes.object,
  cleanAllProcessFilters: PropTypes.func,
  sourcesFilterArray: PropTypes.array,
  showFiltersInsideSideModal: PropTypes.bool,
  showSourcesFilterInsideSideModal: PropTypes.bool,
  showTargetFilterInsideSideModal: PropTypes.bool,
  targetsFilterArray: PropTypes.array,
  setTargetsFilterArray: PropTypes.func,
};

ClearAllProcessViewFilters.propTypes = {
  displayOnlyCleanFilterBtn: PropTypes.bool,
  cleanAllProcessFilters: PropTypes.func,
  setViewBackupFilters: PropTypes.func,
};
