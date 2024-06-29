/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SidedrawerModal } from 'simplexiar_react_components';

import crossIconTable from '../../../../../Assets/icons/crossIconTable.svg';
import { useFixedSideModalWidth } from '../../../../../hooks/useSideModalWidth';
import {
  getAllSourcesOrTargetsOrFieldsNames,
  getAllSourcesOrTargetsOrFieldsObjects,
  getAllSourcesOrTargetsOrFieldsSystems,
} from '../../../../../Services/axios/migrate';
import { getAllTestSuitesNames } from '../../../../../Services/axios/test';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import { convertFilterObjectsToStrings, SOURCES_TARGETS_FIELDS_FILTER_KEYS } from '../../MR_Manager';
import { ASSOCIATION_SET_TABLE_KEYS } from '../AssociationSet/requestHeadersSchema';
import classes from './FieldsTable.module.css';
import originalTableHeaders, { uniqueId } from './requestHeadersSchema';
import SideModalFilters from './SideModals/SideModalFilters';
import TableClickModalView from './SideModals/TableClickModalView';
import Table from './TableViews/Table';

const SORT_BY_SET_FILTER = [
  {
    value: 'ALL',
    label: 'All Fields',
  },
  {
    value: 'MAPPED',
    label: 'Fields With Association Sets',
  },
  {
    value: 'UNMAPPED',
    label: 'Fields Without Association Sets',
  },
];

export const FILTER_TEMPLATE_KEYS = {
  fieldSystemFilter: 'fieldSystemFilter',
  fieldObjectFilter: 'fieldObjectFilter',
  fieldNameFilter: 'fieldNameFilter',
  fieldsFilterArray: 'fieldsFilterArray',
  searchFilterAPI: 'searchFilterAPI',
  selectShowingSetValue: 'selectShowingSetValue',
  pageNumber: 'pageNumber',
};

const FILTER_TEMPLATE = {
  [FILTER_TEMPLATE_KEYS.fieldSystemFilter]: '',
  [FILTER_TEMPLATE_KEYS.fieldObjectFilter]: '',
  [FILTER_TEMPLATE_KEYS.fieldNameFilter]: '',
  [FILTER_TEMPLATE_KEYS.searchFilterAPI]: '',
  [FILTER_TEMPLATE_KEYS.selectShowingSetValue]: SORT_BY_SET_FILTER[0].value,
  [FILTER_TEMPLATE_KEYS.pageNumber]: 0,
};

export const TABLE_RESPONSIVENESS_WIDTHS = {
  large: 1320,
  medium: 1050,
  small: 850,
};

const modifyArrowedFiltersString = (item, key1, key2, key3) => {
  let finalString = '';

  if (item && item[key1] && item[key2] && item[key3]) {
    finalString = `${item[key1].label} → ${item[key2].label} → ${item[key3].label}`;
  } else if (item && item[key1] && item[key2]) {
    finalString = `${item[key1].label} → ${item[key2].label}`;
  } else if (item && item[key1] && item[key3]) {
    finalString = `${item[key1].label} → ${item[key3].label}`;
  } else if (item && item[key1]) {
    finalString = `${item[key1].label}`;
  }

  return finalString;
};

export const ComputeViewAppliedFilters = ({
  appliedFilters,
  ClearAllProcessViewFilters,
  viewBackupFilters,
  setFieldsFilterArray,
  fieldsFilterArray,
  setFilterTriggerQuery,
  setFilterQuery,
  setViewBackupFilters,
  appliedFiltersRef,
  cleanAllProcessFilters,
  showSourcesFilterInsideSideModal = false,
  showFiltersInsideSideModal = showSourcesFilterInsideSideModal,
}) => {
  const filtersLocalDataSet = [];
  const filtersLocalDataSetForSideModal = [];

  if (showSourcesFilterInsideSideModal && fieldsFilterArray?.length > 0) {
    fieldsFilterArray.forEach((item) => {
      const filterData = {
        boldTitle: 'Fields: ',
        modifiedString: modifyArrowedFiltersString(
          item,
          FILTER_TEMPLATE_KEYS.fieldSystemFilter,
          FILTER_TEMPLATE_KEYS.fieldObjectFilter,
          FILTER_TEMPLATE_KEYS.fieldNameFilter
        ),
        resetFilter: () => {
          const handleBackupArray = fieldsFilterArray;

          setFieldsFilterArray([...handleBackupArray]?.filter((removeItem) => removeItem !== item));
        },
      };

      filtersLocalDataSetForSideModal.push(filterData);
    });
  } else if (
    fieldsFilterArray?.length > 0 &&
    viewBackupFilters?.fieldsFilterArray?.length > 0 &&
    !showSourcesFilterInsideSideModal
  ) {
    viewBackupFilters?.fieldsFilterArray.forEach((item) => {
      const filterData = {
        boldTitle: 'Fields: ',
        modifiedString: modifyArrowedFiltersString(
          item,
          FILTER_TEMPLATE_KEYS.fieldSystemFilter,
          FILTER_TEMPLATE_KEYS.fieldObjectFilter,
          FILTER_TEMPLATE_KEYS.fieldNameFilter
        ),
        resetFilter: () => {
          const handleBackupArray = viewBackupFilters?.fieldsFilterArray;

          setFieldsFilterArray([...handleBackupArray]?.filter((removeItem) => removeItem !== item));

          setViewBackupFilters((prev) => ({
            ...prev,
            fieldsFilterArray: [...handleBackupArray]?.filter((removeItem) => removeItem !== item),
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

  if (filtersLocalDataSetForSideModal && showFiltersInsideSideModal) {
    return (
      <div className={`${classes.flex_row_component_filters} ${classes.flex_wrap_only} ${classes.margin_top_12px}`}>
        {filtersLocalDataSetForSideModal?.map((item, index) => (
          <div className={classes.filterRowBg} key={index}>
            <div className={classes.boldTitle}>{item.boldTitle}</div>
            <div className="">{item.modifiedString}</div>
            <div className={classes.crossIcon} onClick={item.resetFilter}>
              <img src={crossIconTable} alt="" />
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

const FieldsTable = ({ scrollToTopRef }) => {
  const isFieldSystems = SOURCES_TARGETS_FIELDS_FILTER_KEYS.BOTH;

  // Sources Filter
  const [selectFieldSystemFilter, setSelectFieldSystemFilter] = useState();
  const [selectFieldObjectFilter, setSelectFieldObjectFilter] = useState();
  const [selectFieldNameFilter, setSelectFieldNameFilter] = useState();
  const [fieldsFilterArray, setFieldsFilterArray] = useState([]);

  const { data: getAllFieldsSystems } = useQuery({
    queryKey: ['getAllFieldsSystems', isFieldSystems],
    queryFn: () => getAllSourcesOrTargetsOrFieldsSystems(isFieldSystems),
  });

  const { data: getAllFieldsObjects } = useQuery({
    queryKey: ['getAllFieldsObjects', selectFieldSystemFilter?.value, isFieldSystems],
    queryFn: () => getAllSourcesOrTargetsOrFieldsObjects(selectFieldSystemFilter?.value, isFieldSystems),
  });

  const { data: getAllFieldsNames } = useQuery({
    queryKey: ['getAllFieldsNames', selectFieldObjectFilter?.value, isFieldSystems],
    queryFn: () => getAllSourcesOrTargetsOrFieldsNames(selectFieldObjectFilter?.value, isFieldSystems),
  });

  const fixedSideModalWidth = useFixedSideModalWidth();

  const [selectSortBySetType, setSelectSortBySetType] = useState(SORT_BY_SET_FILTER[0]);
  const [filterQuery, setFilterQuery] = useState(FILTER_TEMPLATE);
  const [filterTriggerQuery, setFilterTriggerQuery] = useState(FILTER_TEMPLATE);
  const [viewBackupFilters, setViewBackupFilters] = useState();

  const [clickedTableRowData, setClickedTableRowData] = useState();

  const [showProcessSideModal, setShowProcessSideModal] = useState(false);

  const [executionData, setExecutionData] = useState();

  const [viewTableHeaders, setViewTableHeaders] = useState(() => originalTableHeaders);

  const appliedFiltersRef = useRef();

  // BaseSidebar and Modal
  const [showFiltersSideModal, setShowFiltersSideModal] = useState(false);

  useEffect(() => {
    let appendFieldsSystemIds = '';
    let appendFieldsObjectIds = '';
    let appendFieldsNameIds = '';

    const filterArray = viewBackupFilters?.fieldsFilterArray;

    if (filterArray?.length > 0) {
      filterArray.forEach((item, index) => {
        appendFieldsSystemIds = convertFilterObjectsToStrings(
          index,
          item[FILTER_TEMPLATE_KEYS.fieldSystemFilter],
          appendFieldsSystemIds
        );

        appendFieldsObjectIds = convertFilterObjectsToStrings(
          index,
          item[FILTER_TEMPLATE_KEYS.fieldObjectFilter],
          appendFieldsObjectIds
        );

        appendFieldsNameIds = convertFilterObjectsToStrings(
          index,
          item[FILTER_TEMPLATE_KEYS.fieldNameFilter],
          appendFieldsNameIds
        );
      });
    }

    setFilterTriggerQuery((prev) => ({
      ...prev,
      [FILTER_TEMPLATE_KEYS.fieldSystemFilter]: appendFieldsSystemIds,
      [FILTER_TEMPLATE_KEYS.fieldObjectFilter]: appendFieldsObjectIds,
      [FILTER_TEMPLATE_KEYS.fieldNameFilter]: appendFieldsNameIds,
    }));
  }, [viewBackupFilters?.fieldsFilterArray]);

  useEffect(() => {
    setFilterTriggerQuery((prev) => ({
      ...prev,
      [FILTER_TEMPLATE_KEYS.pageNumber]: 0,
    }));
  }, [
    filterTriggerQuery[FILTER_TEMPLATE_KEYS.searchFilterAPI],
    viewBackupFilters?.[FILTER_TEMPLATE_KEYS.fieldSystemFilter],
    viewBackupFilters?.[FILTER_TEMPLATE_KEYS.fieldObjectFilter],
    viewBackupFilters?.[FILTER_TEMPLATE_KEYS.fieldNameFilter],
    filterTriggerQuery[FILTER_TEMPLATE_KEYS.selectShowingSetValue],
  ]);

  useEffect(() => {
    if (selectSortBySetType) {
      setFilterQuery((prev) => ({
        ...prev,
        isAscending: selectSortBySetType.value,
      }));
    }

    setFilterTriggerQuery((prev) => ({
      ...prev,
      isAscending: selectSortBySetType.value,
    }));
  }, [selectSortBySetType]);

  const getFieldsSystemFilterOptions = () => {
    return getAllFieldsSystems
      ?.map((item) => {
        const object = {
          label: item[ASSOCIATION_SET_TABLE_KEYS.SYSTEM_NAME],
          value: item[ASSOCIATION_SET_TABLE_KEYS.SYSTEM_ID],
        };

        return object;
      })
      ?.filter((item) => {
        let doesFilterAlreadyContainsOption = false;

        fieldsFilterArray.forEach((arrayItem) => {
          if (JSON.stringify(arrayItem[FILTER_TEMPLATE_KEYS.fieldSystemFilter]) === JSON.stringify(item)) {
            doesFilterAlreadyContainsOption = true;
          }
        });

        if (!doesFilterAlreadyContainsOption) return item;
      });
  };

  const getFieldsObjectsFilterOptions = () => {
    return getAllFieldsObjects?.map((item) => ({
      label: item[ASSOCIATION_SET_TABLE_KEYS.OBJECT_NAME],
      value: item[ASSOCIATION_SET_TABLE_KEYS.OBJECT_ID],
    }));
  };

  const getFieldNameFilterOptions = () => {
    return getAllFieldsNames?.map((item) => ({
      label: item[ASSOCIATION_SET_TABLE_KEYS.FIELD_NAME],
      value: item[ASSOCIATION_SET_TABLE_KEYS.FIELD_ID],
    }));
  };

  const cleanSelectSourcesFilter = () => {
    setSelectFieldSystemFilter(null);
    setSelectFieldObjectFilter(null);
    setSelectFieldNameFilter(null);
  };

  const cleanAllProcessFilters = () => {
    cleanSelectSourcesFilter();
    setViewBackupFilters();
    setFieldsFilterArray([]);
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
          fieldsFilterArray={fieldsFilterArray}
          viewBackupFilters={viewBackupFilters}
          setFieldsFilterArray={setFieldsFilterArray}
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
        setShowProcessSideModal={setShowProcessSideModal}
        setClickedTableRowData={setClickedTableRowData}
        setFilterTriggerQuery={setFilterTriggerQuery}
        SORT_BY_SET_FILTER={SORT_BY_SET_FILTER}
        selectSortBySetType={selectSortBySetType}
        setSelectSortBySetType={setSelectSortBySetType}
        filterTriggerQuery={filterTriggerQuery}
        setExecutionData={setExecutionData}
        DisplayAppliedFilters={DisplayAppliedFilters}
        viewBackupFilters={viewBackupFilters}
        scrollToTopRef={scrollToTopRef}
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
          setSelectFieldSystemFilter={setSelectFieldSystemFilter}
          cleanSelectSourcesFilter={cleanSelectSourcesFilter}
          setSelectFieldNameFilter={setSelectFieldNameFilter}
          setFieldsFilterArray={setFieldsFilterArray}
          selectFieldSystemFilter={selectFieldSystemFilter}
          selectFieldObjectFilter={selectFieldObjectFilter}
          setSelectFieldObjectFilter={setSelectFieldObjectFilter}
          selectFieldNameFilter={selectFieldNameFilter}
          fieldsFilterArray={fieldsFilterArray}
          setFilterQuery={setFilterQuery}
          setFilterTriggerQuery={setFilterTriggerQuery}
          filterQuery={filterQuery}
          cleanAllProcessFilters={cleanAllProcessFilters}
          setShowFiltersSideModal={setShowFiltersSideModal}
          showFiltersSideModal={showFiltersSideModal}
          viewBackupFilters={viewBackupFilters}
          setViewBackupFilters={setViewBackupFilters}
          ClearAllProcessViewFilters={ClearAllProcessViewFilters}
          getFieldNameFilterOptions={getFieldNameFilterOptions}
          getFieldsObjectsFilterOptions={getFieldsObjectsFilterOptions}
          getFieldsSystemFilterOptions={getFieldsSystemFilterOptions}
        />
      </SidedrawerModal>

      <SidedrawerModal
        show={showProcessSideModal}
        closeModal={() => setShowProcessSideModal(false)}
        width={fixedSideModalWidth}
        padding="0"
        hasCloseButton={false}
        className={classes.hideOverflow}
      >
        <TableClickModalView
          closeModal={() => setShowProcessSideModal(false)}
          clickedTableRowData={clickedTableRowData}
        />
      </SidedrawerModal>
    </div>
  );
};

export default FieldsTable;

FieldsTable.propTypes = {
  scrollToTopRef: PropTypes.object,
};

ComputeViewAppliedFilters.propTypes = {
  appliedFilters: PropTypes.object,
  ClearAllProcessViewFilters: PropTypes.func,
  viewBackupFilters: PropTypes.object,
  setFieldsFilterArray: PropTypes.func,
  setFilterTriggerQuery: PropTypes.func,
  setFilterQuery: PropTypes.func,
  setViewBackupFilters: PropTypes.func,
  appliedFiltersRef: PropTypes.object,
  cleanAllProcessFilters: PropTypes.func,
  fieldsFilterArray: PropTypes.array,
  showFiltersInsideSideModal: PropTypes.bool,
  showSourcesFilterInsideSideModal: PropTypes.bool,
};

ClearAllProcessViewFilters.propTypes = {
  displayOnlyCleanFilterBtn: PropTypes.bool,
  cleanAllProcessFilters: PropTypes.func,
  setViewBackupFilters: PropTypes.func,
};
