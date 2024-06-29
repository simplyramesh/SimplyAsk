/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { SearchBarWithValue, Table } from 'simplexiar_react_components';

import Spinner from '../../../../../shared/Spinner/Spinner';
import {
  DEFAULT_TABLE_HEIGHT,
  DEFAULT_TABLE_PAGE_SIZE,
  EMPTY_DATA_TABLE_HEIGHT,
  EXTENDED_TABLE_HEIGHT,
  EXTENDED_TABLE_PAGE_SIZE,
  LENGTH_OF_EMPTY_ARRAY,
} from '../DesignAndExecution';
import classes from './CurrentExecutionsTable.module.css';
import originalTableHeaders, { uniqueId } from './requestHeadersSchema';

const ExecutionViewTable = ({
  isLoading = false,
  error,
  onPageChange,
  requests,
  viewTableHeaders,
  playIconClickFunction,
  pauseIconClickFunction,
  cancelIconClickFunction,
  tableHeight,
  setPageSize,
  setTableHeight,
}) => {
  const content = requests?.content ?? [];
  const isTableSizeGreaterThanThreeElements = requests?.pagination?.totalElements > DEFAULT_TABLE_PAGE_SIZE;

  const tableRowClickFunction = () => {};

  const handleShowMoreButton = () => {
    setPageSize(EXTENDED_TABLE_PAGE_SIZE);
    setTableHeight(EXTENDED_TABLE_HEIGHT);
  };

  const getPaginationData = () => {
    if (tableHeight !== DEFAULT_TABLE_HEIGHT || !isTableSizeGreaterThanThreeElements) {
      return requests?.pagination;
    }
  };

  if (isLoading) {
    return (
      <div className={classes.minHeightLoader}>
        <Spinner inline medium />
      </div>
    );
  }

  if (error) {
    return <div className={classes.error_div}>{error}</div>;
  }

  return (
    <div>
      <Table
        className={classes.tableWidth}
        tableParentClassName={`${classes.tableRoot} ${
          !isTableSizeGreaterThanThreeElements && classes.paddingForUnScrollableTable
        }`}
        tableStyle={classes.paginationRoot}
        data={content}
        pagination={getPaginationData()}
        headers={viewTableHeaders(playIconClickFunction, pauseIconClickFunction, cancelIconClickFunction)}
        uniqueIdSrc={uniqueId}
        isScrollable={isTableSizeGreaterThanThreeElements}
        scrollHeight={{ height: content?.length === LENGTH_OF_EMPTY_ARRAY ? EMPTY_DATA_TABLE_HEIGHT : tableHeight }}
        onClick={tableRowClickFunction}
        isLoading={isLoading}
        onPageChange={onPageChange}
        noDataFoundParentHeight={EMPTY_DATA_TABLE_HEIGHT}
        paginationTextEnd="Executions"
        noDataFoundTitle="No Executions Found"
      />

      {tableHeight === DEFAULT_TABLE_HEIGHT &&
        content?.length !== LENGTH_OF_EMPTY_ARRAY &&
        isTableSizeGreaterThanThreeElements && (
          <div className={classes.showMoreButtonRoot}>
            <button className={classes.showMoreButton} onClick={handleShowMoreButton}>
              Show More
            </button>
          </div>
        )}
    </div>
  );
};

const CurrentExecutionsTable = ({
  setShowCancelExecutionModal,
  setClickedTableRowData,
  setSearchFilterAPI,
  setPageNumber,
  searchFilterAPI,
  requests,
  error,
  isLoading,
  setPageSize,
}) => {
  const viewTableHeaders = originalTableHeaders;

  const [tableHeight, setTableHeight] = useState(DEFAULT_TABLE_HEIGHT);

  const playIconClickFunction = (event, data) => {
    event.stopPropagation();
    setClickedTableRowData(data);
  };

  const pauseIconClickFunction = (event, data) => {
    event.stopPropagation();
    setClickedTableRowData(data);
  };

  const cancelIconClickFunction = (event, data) => {
    event.stopPropagation();
    setClickedTableRowData(data);
    setShowCancelExecutionModal(true);
  };

  const searchBarHandler = (event) => {
    setSearchFilterAPI(event.target.value);
  };

  const onPageChange = (page) => {
    setPageNumber(() => page - 1);
  };

  return (
    <div className={classes.root}>
      <div className={classes.boldTitle}>Current Executions</div>
      <div className={classes.searchBarRoot}>
        <SearchBarWithValue
          placeholder="Search Execution IDs..."
          value={searchFilterAPI}
          onChange={searchBarHandler}
          className={`${classes.searchBar} ${searchFilterAPI.length > 0 ? classes.searchBarActive : ''}`}
        />
      </div>

      <ExecutionViewTable
        requests={requests}
        error={error}
        isLoading={isLoading}
        onPageChange={onPageChange}
        viewTableHeaders={viewTableHeaders}
        playIconClickFunction={playIconClickFunction}
        pauseIconClickFunction={pauseIconClickFunction}
        cancelIconClickFunction={cancelIconClickFunction}
        tableHeight={tableHeight}
        setPageSize={setPageSize}
        setTableHeight={setTableHeight}
      />
    </div>
  );
};

export default CurrentExecutionsTable;

CurrentExecutionsTable.propTypes = {
  setShowCancelExecutionModal: PropTypes.func,
  setClickedTableRowData: PropTypes.func,
  setSearchFilterAPI: PropTypes.func,
  setPageNumber: PropTypes.func,
  searchFilterAPI: PropTypes.string,
  requests: PropTypes.object,
  error: PropTypes.string,
  isLoading: PropTypes.bool,
  setPageSize: PropTypes.func,
};

ExecutionViewTable.propTypes = {
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  onPageChange: PropTypes.func,
  requests: PropTypes.oneOfType(PropTypes.array, PropTypes.object),
  viewTableHeaders: PropTypes.func,
  playIconClickFunction: PropTypes.func,
  pauseIconClickFunction: PropTypes.func,
  cancelIconClickFunction: PropTypes.func,
  tableHeight: PropTypes.string,
  setPageSize: PropTypes.func,
  setTableHeight: PropTypes.func,
};
