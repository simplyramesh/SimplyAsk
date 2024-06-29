import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, SearchBarWithValue, SidedrawerModal, Table } from 'simplexiar_react_components';
import crossIconTable from '../../../Assets/icons/crossIconTable.svg';
import routes from '../../../config/routes';
import { useGetCurrentUser } from '../../../hooks/useGetCurrentUser';
import useTableHeaderSchema from '../../../hooks/useTableHeaderSchema';
import useWindowSize from '../../../hooks/useWindowSize';
import { firstLetterToUpperCase, modifyDateTimeToDescriptive } from '../../../utils/helperFunctions';
import { processHistoryKeys } from '../../../utils/serviceRequests';
import useGetProcessExecutions from '../../WorkflowEditor/hooks/useGetProcessExecutions';
import { StyledButton } from '../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomSelect from '../../shared/REDISIGNED/selectMenus/CustomSelect';
import CustomIndicatorArrow from '../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import Spinner from '../../shared/Spinner/Spinner';
import { StyledFlex } from '../../shared/styles/styled';
import classes from '../ProcessHistory.module.css';
import BulkExecutionSideModalFilters from '../ProcessHistorySideModalFilters/BulkExecutionSideModalFilters';
import bulkViewTableHeaders from '../requestHeadersSchemaBulkView';
import { tableHeaderKeys, uniqueId } from '../requestHeadersSchemaProcessView';

const BULK_SORTBY_DATE_FILTER = [
  { value: true, label: 'Date - Newest First' },
  { value: false, label: 'Date - Oldest First' },
];

const BULK_FILTER_TEMPLATE_KEYS = {
  bulkExecutionStatus: 'bulkExecutionStatus',
  bulkExecutionWorkflows: 'bulkExecutionWorkflows',
  bulkUploadStatus: 'bulkUploadStatus',
  bulkSearchFilterAPI: 'bulkSearchFilterAPI',
  startDate: 'startDate',
  endDate: 'endDate',
};

const BULK_FILTER_TEMPLATE = {
  bulkExecutionStatus: '',
  bulkUploadStatus: '',
  bulkExecutionWorkflows: '',
  bulkSearchFilterAPI: '',
  newestFirst: true,
  startDate: '',
  endDate: '',
  pageNumber: 0,
};

export const TABLE_RESPONSIVENESS_WIDTHS = {
  large: 1320,
  medium: 1050,
  small: 850,
};

const BulkExecutionTable = ({ bulkSearchInputValue }) => {
  const navigate = useNavigate();

  const { currentUser } = useGetCurrentUser();
  const size = useWindowSize();

  // Bulk Execution Filters
  const [selectBulkUploadStatusFilter, setSelectBulkUploadStatusFilter] = useState([]);
  const [selectBulkExecutionStatusFilter, setSelectBulkExecutionStatusFilter] = useState([]);
  const [selectBulkWorkFlowNamesFilter, setSelectBulkWorkFlowNamesFilter] = useState([]);
  const [selectSortByNewestDateBulkTable, setSelectSortByNewestDateBulkTable] = useState(BULK_SORTBY_DATE_FILTER[0]);
  const [bulkFilterQuery, setBulkFilterQuery] = useState(BULK_FILTER_TEMPLATE);
  const [bulkFilterTriggerQuery, setBulkFilterTriggerQuery] = useState(BULK_FILTER_TEMPLATE);
  const [bulkViewBackupFilters, setBulkViewBackupFilters] = useState();

  const [bulkViewHeader, setBulkViewHeaders] = useState(bulkViewTableHeaders);

  const modifiedBulkHeaders = useTableHeaderSchema(bulkViewTableHeaders, tableHeaderKeys.START_AND_END_TIME);

  // BaseSidebar Display States
  const [showBulkFilterModal, setShowBulkFilterModal] = useState(false);

  const bulkTableFilterParams = {
    search: bulkFilterTriggerQuery.bulkSearchFilterAPI,
    workflowName: bulkFilterTriggerQuery.bulkExecutionWorkflows,
    status: bulkFilterTriggerQuery.bulkUploadStatus,
    newFirst: bulkFilterTriggerQuery.newestFirst,
    startDate: bulkFilterTriggerQuery.startDate,
    endDate: bulkFilterTriggerQuery.endDate,
    timezone: currentUser?.timezone,
    pageNumber: bulkFilterTriggerQuery.pageNumber,
    showOnlyBulkProcesses: true,
  };

  const { executions: bulkExecutionData, isFetching: isLoadingBulkTable } = useGetProcessExecutions({
    filterParams: bulkTableFilterParams,
    options: {},
  });

  useEffect(() => {
    if (bulkExecutionData?.content) {
      if (size.width > TABLE_RESPONSIVENESS_WIDTHS.large) {
        setBulkViewHeaders(bulkViewTableHeaders);
      } else if (size.width > TABLE_RESPONSIVENESS_WIDTHS.medium) {
        const newTableHeaders = bulkViewTableHeaders?.filter((item) => {
          if (item.name !== processHistoryKeys.Upload_Status) return item;
        });
        setBulkViewHeaders(newTableHeaders);
      } else if (size.width > TABLE_RESPONSIVENESS_WIDTHS.small) {
        const newTableHeaders = bulkViewTableHeaders?.filter((item) => {
          if (
            item.name !== processHistoryKeys.Upload_Status &&
            !item.name?.startsWith(processHistoryKeys.Start_AND_End_Time)
          ) {
            return item;
          }
        });

        setBulkViewHeaders(newTableHeaders);
      } else {
        const newTableHeaders = bulkViewTableHeaders?.filter((item) => {
          if (
            item.name !== processHistoryKeys.Upload_Status &&
            item.source !== processHistoryKeys.FileDetailsFile_name &&
            !item.name?.startsWith(processHistoryKeys.Start_AND_End_Time)
          ) {
            return item;
          }
        });

        setBulkViewHeaders(newTableHeaders);
      }
    }
  }, [size.width, isLoadingBulkTable, bulkExecutionData?.content?.bulkExecutionFileDetails]);

  const onBulkTablePageChange = (page) => {
    setBulkFilterTriggerQuery((prev) => ({
      ...prev,
      pageNumber: page - 1,
    }));
  };

  const bulkTableRowClick = (data) => {
    const bulkPreviewFullViewPath = routes.PROCESS_HISTORY_BULK_PREVIEW;
    const findColonIndex = bulkPreviewFullViewPath.lastIndexOf('/:');
    const filterColon = bulkPreviewFullViewPath.slice(0, findColonIndex);

    const fileId = data?.[processHistoryKeys.FILE_ID];
    const updatePath = `${filterColon}/${fileId}`;

    navigate(`${updatePath}`, { state: { redirectedFromBulkExecutionTable: true } });
  };

  const getSortByDateOptions = () =>
    BULK_SORTBY_DATE_FILTER.map((item) => ({
      label: item.label,
      value: item.value,
    }));

  const onDateSortFilterChange = (event) => {
    if (!event) return;

    setSelectSortByNewestDateBulkTable(event);
  };

  useEffect(() => {
    if (modifiedBulkHeaders) setBulkViewHeaders(modifiedBulkHeaders);
  }, [modifiedBulkHeaders]);

  useEffect(() => {
    const bulkExecutionStatus = '';
    let bulkExecutionWorkflows = '';
    let bulkUploadStatus = '';

    if (selectBulkUploadStatusFilter) {
      selectBulkUploadStatusFilter?.forEach((item, index) => {
        if (index === 0 && bulkUploadStatus.length === 0) {
          bulkUploadStatus = `${item.value}`;
          return;
        }
        bulkUploadStatus = `${bulkUploadStatus},${item.value}`;
      });
    }

    if (selectBulkExecutionStatusFilter) {
      selectBulkExecutionStatusFilter?.forEach((item, index) => {
        if (index === 0 && bulkUploadStatus.length === 0) {
          bulkUploadStatus = `${item.value}`;
          return;
        }
        bulkUploadStatus = `${bulkUploadStatus},${item.value}`;
      });
    }

    if (selectBulkWorkFlowNamesFilter) {
      selectBulkWorkFlowNamesFilter?.forEach((item, index) => {
        if (index === 0) {
          bulkExecutionWorkflows = `${item.value}`;
          return;
        }
        bulkExecutionWorkflows = `${bulkExecutionWorkflows},${item.value}`;
      });
    }

    setBulkFilterQuery((prev) => ({
      ...prev,
      bulkExecutionStatus,
      bulkUploadStatus,
      bulkExecutionWorkflows,
    }));
  }, [selectBulkUploadStatusFilter, selectBulkExecutionStatusFilter, selectBulkWorkFlowNamesFilter]);

  useEffect(() => {
    if (selectSortByNewestDateBulkTable) {
      setBulkFilterQuery((prev) => ({
        ...prev,
        newestFirst: selectSortByNewestDateBulkTable.value,
      }));
    }

    setBulkFilterTriggerQuery((prev) => ({
      ...prev,
      newestFirst: selectSortByNewestDateBulkTable.value,
    }));
  }, [selectSortByNewestDateBulkTable]);

  const cleanAllBulkFilters = () => {
    setSelectBulkExecutionStatusFilter([]);
    setSelectBulkUploadStatusFilter([]);
    setSelectBulkWorkFlowNamesFilter([]);
    setBulkFilterTriggerQuery(BULK_FILTER_TEMPLATE);
    setBulkFilterQuery(BULK_FILTER_TEMPLATE);
    setShowBulkFilterModal(false);
  };

  const bulkSearchBarHandler = (event) => {
    const inputValue = event.target.value;

    setBulkFilterTriggerQuery((prev) => ({
      ...prev,
      bulkSearchFilterAPI: inputValue,
    }));
  };

  const ClearAllBulkViewFilters = ({ displayOnlyCleanFilterBtn }) => {
    const resetFilters = () => {
      cleanAllBulkFilters();
      setBulkViewBackupFilters();
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

  const modifyAppliedFilterTimeStamps = (startTime, endTime) =>
    `${modifyDateTimeToDescriptive(startTime)}  to  ${modifyDateTimeToDescriptive(endTime)}`;

  const ComputeBulkViewAppliedFilters = ({ appliedFilters }) => {
    const bulkFilterDataSet = [];

    if (appliedFilters.bulkExecutionStatus?.length > 0) {
      bulkFilterDataSet.push({
        modifiedString: firstLetterToUpperCase(appliedFilters.bulkExecutionStatus),
        resetFilter: () => {
          setSelectBulkExecutionStatusFilter([]);
          setBulkFilterTriggerQuery((prev) => ({
            ...prev,
            [BULK_FILTER_TEMPLATE_KEYS.bulkExecutionStatus]: '',
          }));
          setBulkViewBackupFilters((prev) => ({
            ...prev,
            selectBulkExecutionStatusFilter: [],
          }));
        },
      });
    }

    if (appliedFilters.bulkExecutionWorkflows?.length > 0) {
      bulkFilterDataSet.push({
        modifiedString: firstLetterToUpperCase(appliedFilters.bulkExecutionWorkflows),
        resetFilter: () => {
          setSelectBulkWorkFlowNamesFilter([]);
          setBulkFilterTriggerQuery((prev) => ({
            ...prev,
            [BULK_FILTER_TEMPLATE_KEYS.bulkExecutionWorkflows]: '',
          }));
          setBulkViewBackupFilters((prev) => ({
            ...prev,
            selectBulkWorkFlowNamesFilter: [],
          }));
        },
      });
    }

    if (appliedFilters.bulkUploadStatus?.length > 0) {
      bulkFilterDataSet.push({
        modifiedString: firstLetterToUpperCase(appliedFilters.bulkUploadStatus),
        resetFilter: () => {
          setSelectBulkUploadStatusFilter([]);
          setBulkFilterTriggerQuery((prev) => ({
            ...prev,
            [BULK_FILTER_TEMPLATE_KEYS.bulkUploadStatus]: '',
          }));
          setBulkViewBackupFilters((prev) => ({
            ...prev,
            selectBulkUploadStatusFilter: [],
          }));
        },
      });
    }

    if (appliedFilters.bulkSearchFilterAPI?.length > 0) {
      bulkFilterDataSet.push({
        modifiedString: appliedFilters.bulkSearchFilterAPI,
        resetFilter: () => {
          setBulkFilterTriggerQuery((prev) => ({
            ...prev,
            [BULK_FILTER_TEMPLATE_KEYS.bulkSearchFilterAPI]: '',
          }));
          setBulkFilterQuery((prev) => ({
            ...prev,
            [BULK_FILTER_TEMPLATE_KEYS.bulkSearchFilterAPI]: '',
          }));
        },
      });
    }

    if (appliedFilters.startDate?.length > 0 || appliedFilters.endDate?.length > 0) {
      bulkFilterDataSet.push({
        modifiedString: modifyAppliedFilterTimeStamps(appliedFilters.startDate, appliedFilters.endDate),
        resetFilter: () => {
          setBulkFilterTriggerQuery((prev) => ({
            ...prev,
            [BULK_FILTER_TEMPLATE_KEYS.startDate]: '',
            [BULK_FILTER_TEMPLATE_KEYS.endDate]: '',
          }));
          setBulkFilterQuery((prev) => ({
            ...prev,
            [BULK_FILTER_TEMPLATE_KEYS.startDate]: '',
            [BULK_FILTER_TEMPLATE_KEYS.endDate]: '',
          }));
          setBulkViewBackupFilters((prev) => ({
            ...prev,
            calendarNewText1: '',
            calendarNewText2: '',
            selectedDateCriteria: null,
          }));
        },
      });
    }

    return bulkFilterDataSet?.length > 0 ? (
      <div className={`${classes.flex_row_component} ${classes.marginBottom20px}`}>
        <ClearAllBulkViewFilters displayOnlyCleanFilterBtn />
        <div className={`${classes.flex_row_component} ${classes.flex_wrap}`}>
          {bulkFilterDataSet?.map((item, index) => (
            <div className={classes.filterRowBg} key={index}>
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
    );
  };

  const BulkViewSearchFilters = () => (
    <div className={classes.flex_between_filters}>
      <div className={classes.filterParent}>
        <Button className={classes.viewAllFilters} onClick={() => setShowBulkFilterModal(true)}>
          View All Filters
        </Button>
      </div>

      <StyledFlex direction="row" alignItems="center" gap="10px">
        <p className={classes.sortBy}>Sort By</p>
        <CustomSelect
          options={getSortByDateOptions()}
          onChange={onDateSortFilterChange}
          value={[selectSortByNewestDateBulkTable]}
          placeholder="Date Order"
          closeMenuOnSelect
          isClearable={false}
          isSearchable={false}
          components={{
            DropdownIndicator: CustomIndicatorArrow,
          }}
          maxHeight={30}
          menuPadding={0}
          mb={0}
        />
      </StyledFlex>
    </div>
  );

  const BulkViewTable = () => {
    if (isLoadingBulkTable) {
      return (
        <div className={classes.flex_grow}>
          <Spinner inline />
        </div>
      );
    }

    return (
      <div>
        <ComputeBulkViewAppliedFilters appliedFilters={bulkFilterTriggerQuery} showBulkViewFilters />
        <Table
          className={classes.tableWidth}
          data={bulkExecutionData?.content}
          pagination={bulkExecutionData?.pagination}
          headers={bulkViewHeader}
          uniqueIdSrc={uniqueId}
          isScrollable
          scrollHeight={{ height: '70vh' }}
          onClick={bulkTableRowClick}
          isLoading={isLoadingBulkTable}
          onPageChange={onBulkTablePageChange}
        />
      </div>
    );
  };

  return (
    <>
      <Card className={`${classes.tableCard}`}>
        <>
          <div className={`${classes.flex_row_component} ${classes.paddingSides} ${classes.marginBottom20px}`}>
            <form action="">
              <SearchBarWithValue
                placeholder="Search Execution Details, Upload Names..."
                onChange={bulkSearchBarHandler}
                className={`${classes.searchBar} ${bulkSearchInputValue?.length > 0 ? classes.searchBarActive : ''}`}
                value={bulkSearchInputValue}
              />
            </form>
            <BulkViewSearchFilters />
          </div>
          <BulkViewTable />
        </>
      </Card>

      <SidedrawerModal
        show={showBulkFilterModal}
        closeModal={() => setShowBulkFilterModal(false)}
        width="643px"
        padding="0"
        closeBtnClassName={classes.sideModalCloseIcon}
        useCloseBtnClassName
      >
        <BulkExecutionSideModalFilters
          bulkSearchBarHandler={bulkSearchBarHandler}
          bulkSearchInputValue={bulkFilterQuery.bulkSearchFilterAPI}
          setSelectBulkUploadStatusFilter={setSelectBulkUploadStatusFilter}
          selectBulkUploadStatusFilter={selectBulkUploadStatusFilter}
          setSelectBulkExecutionStatusFilter={setSelectBulkExecutionStatusFilter}
          selectBulkExecutionStatusFilter={selectBulkExecutionStatusFilter}
          selectBulkWorkFlowNamesFilter={selectBulkWorkFlowNamesFilter}
          setSelectBulkWorkFlowNamesFilter={setSelectBulkWorkFlowNamesFilter}
          setBulkFilterTriggerQuery={setBulkFilterTriggerQuery}
          bulkFilterQuery={bulkFilterQuery}
          setBulkFilterQuery={setBulkFilterQuery}
          cleanAllBulkFilters={cleanAllBulkFilters}
          setShowBulkFilterModal={setShowBulkFilterModal}
          showBulkFilterModal={showBulkFilterModal}
          bulkViewBackupFilters={bulkViewBackupFilters}
          setBulkViewBackupFilters={setBulkViewBackupFilters}
          ClearAllBulkViewFilters={ClearAllBulkViewFilters}
        />
      </SidedrawerModal>
    </>
  );
};

export default BulkExecutionTable;
