import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import { Card, SearchBarWithValue, Table } from 'simplexiar_react_components';

import useAxiosGet from '../../../../../../hooks/useAxiosGet';
import useWindowSize from '../../../../../../hooks/useWindowSize';
import { MIGRATE_ENGINE_API } from '../../../../../../Services/axios/AxiosInstance';
import Spinner from '../../../../../shared/Spinner/Spinner';
import { FILTER_TEMPLATE_KEYS, TABLE_RESPONSIVENESS_WIDTHS } from '../FieldsTable';
import classes from '../FieldsTable.module.css';
import originalTableHeaders, { tableHeaderKeys } from '../requestHeadersSchema';
import CustomIndicatorArrow from '../../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomSelect from '../../../../../shared/REDISIGNED/selectMenus/CustomSelect';

const ViewSearchAndCreateButton = ({
  setShowFiltersSideModal,
  getSortBySetOptions,
  onDateSortFilterChange,
  selectSortBySetType,
}) => {
  return (
    <div className={classes.flex_between_filters}>
      <div className={classes.filterParent}>
        <button className={classes.viewAllFilters} onClick={() => setShowFiltersSideModal(true)}>
          View All Filters
        </button>
      </div>

      <div className={classes.flex_row_date}>
        <p className={classes.sortBy}>Showing</p>
        <CustomSelect
          options={getSortBySetOptions()}
          onChange={onDateSortFilterChange}
          value={[selectSortBySetType]}
          placeholder=""
          components={{
            DropdownIndicator: CustomIndicatorArrow,
          }}
          menuPortalTarget={document.body}
          closeMenuOnSelect
          withSeparator
          filter
          maxHeight={30}
          menuPadding={0}
          mb={0}
        />
      </div>
    </div>
  );
};

const TestHistoryTable = ({
  processSearchBarHandler,
  processSearchInputValue,
  setShowFiltersSideModal,
  executionData,
  viewTableHeaders,
  uniqueId,
  setShowProcessSideModal,
  setClickedTableRowData,
  setFilterTriggerQuery,
  SORT_BY_SET_FILTER,
  selectSortBySetType,
  setSelectSortBySetType,
  filterTriggerQuery,
  setExecutionData,
  DisplayAppliedFilters,
  setViewTableHeaders,
  scrollToTopRef,
}) => {
  const size = useWindowSize();

  const {
    response: requests,
    isLoading,
    error,
  } = useAxiosGet(
    `/fieldstatus/filter?searchText=${processSearchInputValue}&status=${selectSortBySetType?.value}&fieldSystemIds=${
      filterTriggerQuery?.[FILTER_TEMPLATE_KEYS.fieldSystemFilter]
    }&fieldObjectIds=${filterTriggerQuery?.[FILTER_TEMPLATE_KEYS.fieldObjectFilter]}&fieldIds=${
      filterTriggerQuery?.[FILTER_TEMPLATE_KEYS.fieldNameFilter]
    }&pageNumber=${filterTriggerQuery?.[FILTER_TEMPLATE_KEYS.pageNumber]}`,
    true,
    MIGRATE_ENGINE_API
  );

  useEffect(() => {
    let timer;

    if (scrollToTopRef?.current?.view) {
      setTimeout(() => {
        timer = scrollToTopRef?.current?.view?.scroll({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
      }, [500]);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [isLoading]);

  useEffect(() => {
    if (requests.content) {
      if (size.width > TABLE_RESPONSIVENESS_WIDTHS.medium) {
        setViewTableHeaders(() => originalTableHeaders);
      } else if (size.width > TABLE_RESPONSIVENESS_WIDTHS.small) {
        const newTableHeaders = () =>
          originalTableHeaders()?.filter((item) => {
            if (item.name !== tableHeaderKeys.FIELD_OBJECT) return item;
          });

        setViewTableHeaders(() => newTableHeaders);
      } else {
        const newTableHeaders = () =>
          originalTableHeaders()?.filter((item) => {
            if (item.name !== tableHeaderKeys.FIELD_OBJECT && item.name !== tableHeaderKeys.FIELD_SYSTEM) {
              return item;
            }
          });

        setViewTableHeaders(() => newTableHeaders);
      }
    }
  }, [size.width, isLoading]);

  useEffect(() => {
    if (requests.content && !isLoading) {
      setExecutionData(requests.content);
    }
  }, [requests, isLoading]);

  const onPageChange = (page) => {
    setFilterTriggerQuery((prev) => ({
      ...prev,
      pageNumber: page - 1,
    }));
  };

  const tableRowClickFunction = (data) => {
    setClickedTableRowData(data);
    setShowProcessSideModal(true);
  };

  const getSortBySetOptions = () => {
    return SORT_BY_SET_FILTER.map((item) => ({
      label: item.label,
      value: item.value,
    }));
  };

  const onDateSortFilterChange = (event) => {
    if (!event) return;

    setSelectSortBySetType(event);
  };

  const ProcessViewTable = useCallback(() => {
    if (isLoading) {
      return <Spinner inline />;
    }

    if (error) {
      return <div className={classes.error_div}>{error}</div>;
    }

    return (
      <div>
        <Table
          className={classes.tableWidth}
          data={executionData}
          pagination={requests?.pagination}
          headers={viewTableHeaders()}
          uniqueIdSrc={uniqueId}
          isScrollable
          scrollHeight={{ height: '70vh' }}
          onClick={tableRowClickFunction}
          isLoading={isLoading}
          onPageChange={onPageChange}
          paginationTextEnd="Fields"
          tableParentClassName={classes.tableRoot}
          noDataFoundTitle="No Fields Found"
          noDataFoundCaption="You currently have no fields associated to this project."
        />
      </div>
    );
  }, [executionData, isLoading, error, viewTableHeaders]);

  return (
    <Card className={`${classes.tableCard}`}>
      <>
        <div className={classes.tableTitle}>Fields</div>
        <div className={classes.cardContentRightPadding}>
          <div className={`${classes.flex_row_component} ${classes.paddingSides} ${classes.marginBottom20px}`}>
            <form action="src/Components/Migrate/MrManager/CardsComponents/FieldsTable/TableViews">
              <SearchBarWithValue
                placeholder="Search Field Names..."
                onChange={processSearchBarHandler}
                className={`${classes.searchBar} ${processSearchInputValue.length > 0 ? classes.searchBarActive : ''}`}
                value={processSearchInputValue}
              />
            </form>
            <ViewSearchAndCreateButton
              setShowFiltersSideModal={setShowFiltersSideModal}
              getSortBySetOptions={getSortBySetOptions}
              onDateSortFilterChange={onDateSortFilterChange}
              selectSortBySetType={selectSortBySetType}
            />
          </div>
          <DisplayAppliedFilters appliedFilters={filterTriggerQuery} showProcessViewFilters />
        </div>

        <ProcessViewTable />
      </>
    </Card>
  );
};

export default TestHistoryTable;

TestHistoryTable.propTypes = {
  DisplayAppliedFilters: PropTypes.func,
  SORT_BY_SET_FILTER: PropTypes.array,
  executionData: PropTypes.array,
  filterTriggerQuery: PropTypes.object,
  processSearchBarHandler: PropTypes.func,
  processSearchInputValue: PropTypes.string,
  viewTableHeaders: PropTypes.func,
  selectSortBySetType: PropTypes.object,
  setExecutionData: PropTypes.func,
  setFilterTriggerQuery: PropTypes.func,
  setViewTableHeaders: PropTypes.func,
  setSelectSortBySetType: PropTypes.func,
  setShowFiltersSideModal: PropTypes.func,
  setShowProcessSideModal: PropTypes.func,
  uniqueId: PropTypes.string,
  setClickedTableRowData: PropTypes.func,
  scrollToTopRef: PropTypes.object,
};

ViewSearchAndCreateButton.propTypes = {
  setShowFiltersSideModal: PropTypes.func,
  getSortBySetOptions: PropTypes.func,
  onDateSortFilterChange: PropTypes.func,
  selectSortBySetType: PropTypes.object,
};
