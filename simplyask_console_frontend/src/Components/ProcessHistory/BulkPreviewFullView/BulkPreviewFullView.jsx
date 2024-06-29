import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSetRecoilState } from 'recoil';
import { Button, Card, Modal } from 'simplexiar_react_components';

import routes from '../../../config/routes';
import { useUser } from '../../../contexts/UserContext';
import useAxiosGet from '../../../hooks/useAxiosGet';
import { useTableSortAndFilter } from '../../../hooks/useTableSortAndFilter';
import useWindowSize from '../../../hooks/useWindowSize';
import { CATALOG_API } from '../../../Services/axios/AxiosInstance';
import { cancelScheduledProcess, getFileProcessExecutions } from '../../../Services/axios/processHistory';
import { modifiedCurrentPageDetails } from '../../../store';
import { DEFAULT_PAGINATION } from '../../shared/constants/core';
import ContentLayout from '../../shared/REDISIGNED/layouts/ContentLayout/ContentLayout';
import PageLayout from '../../shared/REDISIGNED/layouts/PageLayout/PageLayout';
import CustomSelect from '../../shared/REDISIGNED/selectMenus/CustomSelect';
import tableEmptyAdapter from '../../shared/REDISIGNED/table/components/TableEmpty/helpers/tableEmptyAdapter';
import TableHeader from '../../shared/REDISIGNED/table/components/TableHeader/TableHeader';
import PageableTable from '../../shared/REDISIGNED/table/PageableTable';
import SearchBar from '../../shared/SearchBar/SearchBar';
import Spinner from '../../shared/Spinner/Spinner';
import { StyledFlex, StyledText } from '../../shared/styles/styled';
import { PROCESS_STATUSES_OPTIONS } from '../constants/core';
import ProcessHistoryModalView from '../ProcessHistoryModalView/ProcessHistoryModalView';

import classes from './BulkPreviewFullView.module.css';
import ProcessDetails from './ProcessDetails/ProcessDetails';
import { FILE_EXECUTIONS_COLUMNS } from './requestHeadersSchema';

const chartApiKeys = {
  COMPLETED: 'completed',
  CREATION_TIME: 'createdAt',
  EXECUTION_TIME: 'executionTime',
  FAILED: 'failed',
  FAILED_COUNT: 'failed_count',
  FILE_ID: 'fileId',
  FILE_NAME: 'filename',
  INPROGRESS: 'inprogress',
  INPROGRESS_COUNT: 'inprogress_count',
  PROCESS_NAME: 'workflowName',
  SOURCE: 'source',
  SUCCESS_COUNT: 'sucess_count',
  TOTAL_COUNT: 'total_count',
  USER_ID: 'user_id',
  FAILURE_REASON: 'failure_reason',
  IS_SCHEDULED: 'scheduled',
  FILE_UPLOAD: 'FILE_UPLOAD',
  MANUAL_ENTRY: 'MANUAL_ENTRY',
  STATUS: 'bulk_status',
  CANCELED: 'CANCELED',
  URL: 'url',
  GROUP_NAME: 'executionName',
};

const BulkPreviewFullView = ({ location }) => {
  const { ticketId: fileID } = useParams();
  const setCurrentPageDetailsState = useSetRecoilState(modifiedCurrentPageDetails);

  const navigate = useNavigate();
  const size = useWindowSize();
  const { user } = useUser();

  const [showProcessSideModal, setShowProcessSideModal] = useState(false);
  const [processExecutionSideModalData, setProcessExecutionSideModalData] = useState();
  const [cancelProcessLoading, setCancelProcessLoading] = useState(false);
  const [selectProcessStatusFilter, setSelectProcessStatusFilter] = useState([]);
  const [showDeleteModal, setDeleteModal] = useState(false);
  const [chartSectionResp, setChartSectionResp] = useState();

  const {
    response: chartSectionApiOriginalResp,
    isLoading: isLoadingChartSection,
    error: errorChart,
  } = useAxiosGet(`/workflow/file/${fileID}?timezone=${user?.timezone}`, true, CATALOG_API);

  const {
    data,
    pagination,
    setPagination,
    sorting,
    setSorting,
    isFetching,
    setSearchText,
    setColumnFilters,
    isLoading,
  } = useTableSortAndFilter({
    queryKey: ['getFileProcessExecutions'],
    queryFn: (filtersQuery) => getFileProcessExecutions(fileID, filtersQuery),
    pageSize: DEFAULT_PAGINATION.PAGE_SIZE,
    pageIndex: DEFAULT_PAGINATION.PAGE_NUMBER,
  });

  useEffect(() => {
    const fileName = chartSectionApiOriginalResp?.[chartApiKeys.GROUP_NAME];

    if (fileName) {
      setCurrentPageDetailsState({
        pageUrlPath: routes.PROCESS_HISTORY_BULK_PREVIEW,
        pageName: fileName,
      });
    }
  }, [chartSectionApiOriginalResp]);

  const onStatusFilterChange = (event) => {
    if (!event) return;

    const filterValue = event.map((option) => option.value);

    setColumnFilters({ status: filterValue });
    setSelectProcessStatusFilter([...event]);
  };

  const processTableRowClick = (data) => {
    setProcessExecutionSideModalData(data);
    setShowProcessSideModal(true);
  };

  const triggerCancelScheduledProcess = async () => {
    setCancelProcessLoading(true);
    try {
      const res = await cancelScheduledProcess(fileID);
      if (res) {
        setCancelProcessLoading(false);
        toast.success('Scheduled process has been cancelled successfully');
        navigate(`${routes.PROCESS_HISTORY}`, {
          state: {
            openBulkExecutionTab: !!location.state.redirectedFromBulkExecutionTable,
          },
        });
      }
    } catch (error) {
      setCancelProcessLoading(false);
      toast.error('Something went wrong');
    }
  };

  const headerComponents = [
    <StyledFlex direction="row" width="100%" alignItems="start">
      <SearchBar placeholder="Search Executions..." onChange={(e) => setSearchText(e.target.value)} />
      <StyledFlex width={200} ml={2} position="relative" zIndex={5}>
        <CustomSelect
          options={PROCESS_STATUSES_OPTIONS}
          onChange={onStatusFilterChange}
          value={selectProcessStatusFilter}
          placeholder="Select Status"
          isMulti
          maxHeight={32}
          mb={0}
        />
      </StyledFlex>
    </StyledFlex>,
  ];

  if (cancelProcessLoading) return <Spinner global />;

  if (errorChart) return <p>Something went wrong...</p>;

  return (
    <PageLayout>
      <ContentLayout>
        {size?.width > 1280 ? (
          <Card className={classes.tableCard}>
            <div className={`${classes.grid}`}>
              <ProcessDetails
                fileID={fileID}
                setDeleteModal={setDeleteModal}
                chartSectionApiOriginalResp={chartSectionApiOriginalResp}
                isLoadingChartSection={isLoadingChartSection}
                errorChart={errorChart}
                chartApiKeys={chartApiKeys}
                chartSectionResp={chartSectionResp}
                setChartSectionResp={setChartSectionResp}
              />
              <StyledFlex>
                <StyledText size={19} weight={600} mb={20}>
                  Process Execution
                </StyledText>
                <StyledFlex width={560}>
                  <TableHeader headerComponents={headerComponents} />
                </StyledFlex>
                <PageableTable
                  data={data}
                  columns={FILE_EXECUTIONS_COLUMNS}
                  pagination={pagination}
                  setPagination={setPagination}
                  sorting={sorting}
                  setSorting={setSorting}
                  isFetching={isFetching}
                  isLoading={isLoading}
                  muiTableBodyProps={({ table }) =>
                    tableEmptyAdapter({
                      table,
                      title: 'There are no Process Executions',
                      message: 'Due to the file being rejected, the process executions were unable to be uploaded. ',
                    })
                  }
                  muiTableBodyRowProps={({ row }) => ({
                    onClick: () => processTableRowClick(row.original),
                  })}
                />
              </StyledFlex>
            </div>
          </Card>
        ) : (
          <div className={`${classes.grid}`}>
            <Card className={classes.tableCard}>
              <ProcessDetails
                fileID={fileID}
                setDeleteModal={setDeleteModal}
                chartSectionApiOriginalResp={chartSectionApiOriginalResp}
                isLoadingChartSection={isLoadingChartSection}
                errorChart={errorChart}
                chartApiKeys={chartApiKeys}
                chartSectionResp={chartSectionResp}
                setChartSectionResp={setChartSectionResp}
              />
            </Card>

            <Card className={classes.tableCard}>
              <StyledFlex>
                <StyledText size={19} weight={600} mb={20}>
                  Process Execution
                </StyledText>
                <StyledFlex width={560}>
                  <TableHeader headerComponents={headerComponents} />
                </StyledFlex>
                <PageableTable
                  data={data}
                  columns={FILE_EXECUTIONS_COLUMNS}
                  pagination={pagination}
                  setPagination={setPagination}
                  sorting={sorting}
                  setSorting={setSorting}
                  isFetching={isFetching}
                  isLoading={isLoading}
                  muiTableBodyProps={({ table }) =>
                    tableEmptyAdapter({
                      table,
                      title: 'There are no Process Executions',
                      message: 'Due to the file being rejected, the process executions were unable to be uploaded. ',
                    })
                  }
                  muiTableBodyRowProps={({ row }) => ({
                    onClick: () => processTableRowClick(row.original),
                  })}
                />
              </StyledFlex>
            </Card>
          </div>
        )}
      </ContentLayout>

      {showProcessSideModal && (
        <ProcessHistoryModalView
          processExecutionSideModalData={processExecutionSideModalData}
          disableExecutionGroupLink
          open={showProcessSideModal}
          closeModal={() => setShowProcessSideModal(false)}
        />
      )}

      <Modal show={showDeleteModal} modalClosed={() => setDeleteModal(false)} className={classes.modal}>
        <CloseIcon className={classes.closeIcon} onClick={() => setDeleteModal(false)} />
        <ErrorOutlineIcon className={classes.warningIcon} />

        <div className={classes.description_title}>Are You Sure?</div>
        <div className={classes.description}>
          <div>
            You are about to cancel a scheduled execution for{' '}
            <span className={classes.ModalValueBold}>
              {chartSectionApiOriginalResp?.[chartApiKeys.PROCESS_NAME] ?? '---'}
            </span>
          </div>
        </div>

        <div className={classes.modalButtons}>
          <Button onClick={() => setDeleteModal(false)}>Go Back</Button>
          <Button color="primary" onClick={triggerCancelScheduledProcess}>
            Confirm
          </Button>
        </div>
      </Modal>
    </PageLayout>
  );
};

export default BulkPreviewFullView;

BulkPreviewFullView.propTypes = {
  location: PropTypes.object,
};
