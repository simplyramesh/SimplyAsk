import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, SearchBarWithValue, Table } from 'simplexiar_react_components';

import routes from '../../../../../../config/routes';
import { useUser } from '../../../../../../contexts/UserContext';
import useAxiosGet from '../../../../../../hooks/useAxiosGet';
import useWindowSize from '../../../../../../hooks/useWindowSize';
import { MIGRATE_ENGINE_API } from '../../../../../../Services/axios/AxiosInstance';
import { CALENDAR_DATE_KEYS } from '../../../../../shared/Calendars/PredefinedOptionsCalendar/CalendarComponent';
import Spinner from '../../../../../shared/Spinner/Spinner';
import { CREATE_KEY } from '../../../MappingEditor/MappingEditor';
import { FILTER_TEMPLATE_KEYS, TABLE_RESPONSIVENESS_WIDTHS } from '../AssociationSetTable';
import classes from '../AssociationSetTable.module.css';
import originalTableHeaders, { ASSOCIATION_SET_TABLE_KEYS, tableHeaderKeys } from '../requestHeadersSchema';

const ViewSearchAndCreateButton = ({ setShowFiltersSideModal, navigateToCreateNewSet }) => {
  return (
    <div className={classes.flex_between_filters}>
      <div className={classes.filterParent}>
        <button className={classes.viewAllFilters} onClick={() => setShowFiltersSideModal(true)}>
          View All Filters
        </button>
      </div>

      <div className={classes.flex_row_date}>
        <button className={classes.addSetButton} onClick={navigateToCreateNewSet}>
          <span className={classes.plusCharacter}>+</span>
          Create Set
        </button>
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
  setFilterTriggerQuery,
  filterTriggerQuery,
  setExecutionData,
  DisplayAppliedFilters,
  setViewTableHeaders,
  scrollToTopRef,
  setDeleteTableRowData,
  showDeleteAssociationSetModal,
}) => {
  const { user } = useUser();
  const size = useWindowSize();
  const navigate = useNavigate();

  const {
    response: requests,
    isLoading,
    error,
    fetchData,
  } = useAxiosGet(
    `/design?sourceSystemIds=${filterTriggerQuery?.[FILTER_TEMPLATE_KEYS.sourceSystemFilter]}&sourceObjectIds=${
      filterTriggerQuery?.[FILTER_TEMPLATE_KEYS.sourceObjectFilter]
    }&sourceFieldIds=${filterTriggerQuery?.[FILTER_TEMPLATE_KEYS.sourceFieldFilter]}&targetSystemIds=${
      filterTriggerQuery?.[FILTER_TEMPLATE_KEYS.targetSystemFilter]
    }&targetObjectIds=${filterTriggerQuery?.[FILTER_TEMPLATE_KEYS.targetObjectFilter]}&targetFieldIds=${
      filterTriggerQuery?.[FILTER_TEMPLATE_KEYS.targetFieldFilter]
    }&searchText=${processSearchInputValue}&editedAfter=${
      filterTriggerQuery[CALENDAR_DATE_KEYS.EDITED_AFTER]
    }&editedBefore=${filterTriggerQuery[CALENDAR_DATE_KEYS.EDITED_BEFORE]}&createdAfter=${
      filterTriggerQuery[CALENDAR_DATE_KEYS.CREATED_AFTER]
    }&createdBefore=${filterTriggerQuery[CALENDAR_DATE_KEYS.CREATED_BEFORE]}&pageNumber=${
      filterTriggerQuery?.[FILTER_TEMPLATE_KEYS.pageNumber]
    }&timezone=${user?.timezone}`,
    true,
    MIGRATE_ENGINE_API
  );

  useEffect(() => {
    if (!showDeleteAssociationSetModal) {
      fetchData(false);
    }
  }, [showDeleteAssociationSetModal]);

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
      if (size.width > TABLE_RESPONSIVENESS_WIDTHS.large) {
        setViewTableHeaders(() => originalTableHeaders);
      } else if (size.width > TABLE_RESPONSIVENESS_WIDTHS.medium) {
        const newTableHeaders = (iconClickFunction) =>
          originalTableHeaders(iconClickFunction)?.filter((item) => {
            if (item.name !== tableHeaderKeys.DATE_CREATED) return item;
          });
        setViewTableHeaders(() => newTableHeaders);
      } else if (size.width > TABLE_RESPONSIVENESS_WIDTHS.small) {
        const newTableHeaders = (iconClickFunction) =>
          originalTableHeaders(iconClickFunction)?.filter((item) => {
            if (item.name !== tableHeaderKeys.DATE_CREATED && item.name !== tableHeaderKeys.TARGETS) {
              return item;
            }
          });

        setViewTableHeaders(() => newTableHeaders);
      } else {
        const newTableHeaders = (iconClickFunction) =>
          originalTableHeaders(iconClickFunction)?.filter((item) => {
            if (
              item.name !== tableHeaderKeys.DATE_CREATED &&
              item.name !== tableHeaderKeys.TARGETS &&
              item.name !== tableHeaderKeys.SOURCES
            ) {
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
    navigate(`${routes.MR_MANAGER}/${data[ASSOCIATION_SET_TABLE_KEYS.SET_ID]}`, {
      state: {
        runs: { ...data },
      },
    });
  };

  const navigateToCreateNewSet = () => {
    navigate(`${routes.MR_MANAGER}/${CREATE_KEY}`);
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
          headers={viewTableHeaders(setDeleteTableRowData)}
          uniqueIdSrc={uniqueId}
          isScrollable
          scrollHeight={{ height: '70vh' }}
          onClick={tableRowClickFunction}
          isLoading={isLoading}
          onPageChange={onPageChange}
          paginationTextEnd="Association Sets"
          tableParentClassName={classes.tableRoot}
          noDataFoundTitle="No Association Sets Found"
          noDataFoundCaption="You currently have no association sets. Get started by creating a new set using the button in the top right"
        />
      </div>
    );
  }, [executionData, isLoading, error, viewTableHeaders]);

  return (
    <Card className={`${classes.tableCard}`}>
      <>
        <div className={classes.tableTitle}>Association Set</div>
        <div className={classes.cardContentRightPadding}>
          <div className={`${classes.flex_row_component} ${classes.paddingSides} ${classes.marginBottom20px}`}>
            <form action="src/Components/Migrate/MrManager/CardsComponents/AssociationSet/TableViews">
              <SearchBarWithValue
                placeholder="Search Association Sets IDs..."
                onChange={processSearchBarHandler}
                className={`${classes.searchBar} ${processSearchInputValue.length > 0 ? classes.searchBarActive : ''}`}
                value={processSearchInputValue}
              />
            </form>
            <ViewSearchAndCreateButton
              setShowFiltersSideModal={setShowFiltersSideModal}
              navigateToCreateNewSet={navigateToCreateNewSet}
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
  setDeleteTableRowData: PropTypes.func,
  executionData: PropTypes.array,
  filterTriggerQuery: PropTypes.object,
  processSearchBarHandler: PropTypes.func,
  processSearchInputValue: PropTypes.string,
  viewTableHeaders: PropTypes.func,

  setExecutionData: PropTypes.func,
  setFilterTriggerQuery: PropTypes.func,
  setViewTableHeaders: PropTypes.func,
  setShowFiltersSideModal: PropTypes.func,
  uniqueId: PropTypes.string,
  scrollToTopRef: PropTypes.object,
  showDeleteAssociationSetModal: PropTypes.bool,
};

ViewSearchAndCreateButton.propTypes = {
  setShowFiltersSideModal: PropTypes.func,
  navigateToCreateNewSet: PropTypes.func,
};
