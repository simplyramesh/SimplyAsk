import { useTheme } from '@emotion/react';
import { KeyboardArrowLeftRounded, KeyboardArrowRightRounded } from '@mui/icons-material';
import IosShareRoundedIcon from '@mui/icons-material/IosShareRounded';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { toast } from 'react-toastify';

import { useUser } from '../../../contexts/UserContext';
import { getProcessExecutionsForVisualizer } from '../../../Services/axios/processDataVisualizer';
import { BASE_DATE_TIME_FORMAT, getInFormattedUserTimezone } from '../../../utils/timeUtil';
import useIssueGetDownloadSingleAttachment from '../../Issues/hooks/useIssueGetDownloadSingleAttachment';
import { PROCESS_STATUSES } from '../../ProcessHistory/constants/core';
import { useGetAllProcessTriggers } from '../../ProcessTrigger/hooks/useGetAllProcessTriggers';
import NoDataFound from '../../shared/NoDataFound/NoDataFound';
import { StyledButton } from '../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomTableIcons from '../../shared/REDISIGNED/icons/CustomTableIcons';
import TrashBinIcon from '../../shared/REDISIGNED/icons/svgIcons/TrashBinIcon';
import ConfirmationModal from '../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import CustomIndicatorArrow from '../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomSelect from '../../shared/REDISIGNED/selectMenus/CustomSelect';
import Spinner from '../../shared/Spinner/Spinner';
import { StyledExpandButton, StyledFlex, StyledPanelSlider } from '../../shared/styles/styled';
import { useDeleteProcessDataVisualizer } from '../hooks/useDeleteProcessDataVisualizer';
import { useGetProcessesVisualizerTable } from '../hooks/useGetProcessesVisualizerTable';
import { QUERY_KEYS } from '../utils/constants';

import ProcessDataDefineExecutionsSideModal from './ProcessDataDefineExecutionsSideModal/ProcessDataDefineExecutionsSideModal';
import ProcessDataRightSidePanel from './ProcessDataRightSidePanel/ProcessDataRightSidePanel';
import ProcessDataVisualizerTable from './ProcessDataVisualizerTable/ProcessDataVisualizerTable';
import { StyledResizeHandle } from './StyledProcessDataVisualizer';

const ProcessDataVisualizer = () => {
  const { user } = useUser();
  const { colors, boxShadows } = useTheme();
  const queryClient = useQueryClient();

  const refetchExecutingStatusCountRef = useRef(0);

  const [selectFileProcess, setSelectFileProcess] = useState({});
  const [showDeleteExecutionModal, setShowDeleteExecutionModal] = useState(false);
  const [showDefineExecutionsSideModal, setShowDefineExecutionsSideModal] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  const isSelectedProcessExecuting = selectFileProcess?.processExecutionStatus === PROCESS_STATUSES.EXECUTING;

  const { processTriggers: allProcessesOptions, isProcessTriggersFetching: isProcessesLoading } = useGetAllProcessTriggers({
    select: (res) => res?.map((item) => ({
      value: item.workflowId,
      label: item.name,
      deploymentId: item.deploymentId,
    })),
  });

  const replaceNullValues = (arr) => arr?.map((item) => item.replaceAll('null', '')) || [];

  const getDisplayName = (processVisualizerItem) => allProcessesOptions?.find((process) => process.value === processVisualizerItem?.processId)?.label;

  const getVisualizationName = (processVisualizerItem) => `${getDisplayName(processVisualizerItem)} - ${getInFormattedUserTimezone(processVisualizerItem.createdAt, user.timezone, BASE_DATE_TIME_FORMAT)}`;

  const getIsMaxRefetchLimitReached = () => refetchExecutingStatusCountRef.current > 4;

  const { data: processVisualizerDataOptions, isLoading: isProcessVisualizerDataLoading } = useQuery({
    queryKey: [QUERY_KEYS.GET_PROCESS_EXECUTIONS_FOR_VISUALIZER],
    queryFn: () => {
      refetchExecutingStatusCountRef.current += 1;
      return getProcessExecutionsForVisualizer({ sortBy: 'createdAt' });
    },
    select: (res) => res?.map((item) => ({
      ...item,
      name: getVisualizationName(item),
    })) || [],
    enabled: !!allProcessesOptions?.length,
    refetchInterval: () => (!getIsMaxRefetchLimitReached() && isSelectedProcessExecuting ? 8000 : false),
  });

  const { deleteProcessDataVisualizer, isDeleteProcessVisualizationLoading } = useDeleteProcessDataVisualizer({
    onSuccess: () => {
      toast.success('Visualization has been deleted successfully');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_PROCESS_EXECUTIONS_FOR_VISUALIZER] });
      setShowDeleteExecutionModal(false);
    },
    onError: () => {
      toast.error('Something went wrong...');
    },
  });

  const { processVisualizerTableData, isProcessVisualizerTableDataFetching } = useGetProcessesVisualizerTable(
    selectFileProcess?.id,
    {
      select: (res) => {
        if (!Array.isArray(res?.headers) || !Array.isArray(res?.data)) return null;

        const headers = replaceNullValues(res?.headers);
        const bodyData = res?.data?.map((item) => replaceNullValues(item));

        return { headers, bodyData };
      },
      enabled: !isSelectedProcessExecuting && !!selectFileProcess?.id,
    },
  );

  const { downloadSingleAttachment, isDownloadSingleAttachmentLoading } = useIssueGetDownloadSingleAttachment({
    onSuccess: () => {
      toast.info('Downloading file started...');
    },
    onError: () => {
      toast.error('Something went wrong...');
    },
  });

  const onExportFile = () => {
    downloadSingleAttachment({
      name: `${selectFileProcess?.name}.xlsx`,
      fileId: selectFileProcess?.extractId,
    });
  };

  useEffect(() => {
    if (processVisualizerDataOptions) {
      const latestExecution = processVisualizerDataOptions?.[0];

      setSelectFileProcess(latestExecution);

      refetchExecutingStatusCountRef.current = 0;
    }
  }, [processVisualizerDataOptions]);

  const onDropdownChange = (val) => {
    setSelectFileProcess(val);
    refetchExecutingStatusCountRef.current = 0;
  };

  const onCloseDeleteModal = () => {
    if (isDeleteProcessVisualizationLoading) return;

    setShowDeleteExecutionModal(false);
  };

  const isLoadingFullView = isProcessVisualizerDataLoading || isProcessesLoading;

  const isTableLoading = (!isProcessVisualizerDataLoading && isProcessVisualizerTableDataFetching)
    || isDownloadSingleAttachmentLoading
    || (isSelectedProcessExecuting && !getIsMaxRefetchLimitReached());

  const isExportBtnDisabled = !selectFileProcess?.extractId
    || isSelectedProcessExecuting
    || !processVisualizerTableData
    || isLoadingFullView
    || isTableLoading;

  const isDeleteBtnDisabled = !selectFileProcess || isLoadingFullView;

  const renderHeader = () => (
    <StyledFlex direction="row" padding="36px" justifyContent="space-between" backgroundColor={colors.white}>
      <StyledFlex direction="row" gap="15px" width="580px" alignItems="center">
        <CustomSelect
          name="selectFileProcess"
          options={processVisualizerDataOptions}
          value={selectFileProcess}
          onChange={onDropdownChange}
          placeholder="Select Process Execution"
          components={{
            DropdownIndicator: CustomIndicatorArrow,
          }}
          minMenuHeigh={150}
          mb={0}
          singleValueFontSize={15}
          maxMenuHeight={450}
          hideSelectedOptions={false}
          isClearable={false}
          isSearchable
          closeMenuOnSelect
          openMenuOnClick
          getOptionLabel={(opt) => opt.name}
          getValueLabel={(opt) => opt.id}
          menuPortalTarget={document.body}
        />
        <StyledButton
          variant="contained"
          secondary
          startIcon={<CustomTableIcons icon="ADD" width={24} color="white" />}
          minWidth="190px"
          onClick={() => setShowDefineExecutionsSideModal(true)}
        >
          Generate New
        </StyledButton>
      </StyledFlex>

      <StyledFlex direction="row" gap="15px">
        <StyledButton
          startIcon={<IosShareRoundedIcon />}
          tertiary
          variant="contained"
          disabled={isExportBtnDisabled}
          onClick={onExportFile}
        >
          Export
        </StyledButton>

        <StyledButton
          startIcon={<TrashBinIcon />}
          tertiary
          variant="contained"
          disabled={isDeleteBtnDisabled}
          onClick={() => setShowDeleteExecutionModal(true)}
        >
          Delete
        </StyledButton>
      </StyledFlex>
    </StyledFlex>
  );

  const renderNoDataFound = () => {
    let title = '';
    let body = '';

    if (processVisualizerDataOptions?.length === 0) {
      title = 'No visualizations found';
      body = 'The data could not be displayed as there are no visualizations';
    } else {
      title = 'Cannot Display Data';
      body = 'The generated visualization could not be displayed due to either no Process Parameter named “Data” or the Parameter not formatted as a “CSV” or “Excel” file';
    }

    return <NoDataFound title={title} body={body} customStyle={{ minHeight: '400px' }} />;
  };

  return (
    <StyledFlex position="relative" height="100vh">
      {isLoadingFullView ? (
        <Spinner inline />
      ) : (
        <PanelGroup autoSaveId="process-visualizer-table-details-view" direction="horizontal">
          <Panel defaultSize={65}>
            <StyledFlex height="100%">
              {renderHeader()}

              {!isTableLoading && !processVisualizerTableData && !isLoadingFullView ? (
                renderNoDataFound()
              ) : (
                <ProcessDataVisualizerTable
                  processVisualizerTableData={processVisualizerTableData}
                  isLoading={isTableLoading}
                />
              )}

              <ProcessDataDefineExecutionsSideModal
                showDefineExecutionsSideModal={showDefineExecutionsSideModal}
                setShowDefineExecutionsSideModal={setShowDefineExecutionsSideModal}
                allProcessesOptions={allProcessesOptions}
                isProcessesLoading={isProcessesLoading}
              />

              <ConfirmationModal
                isOpen={showDeleteExecutionModal}
                onCloseModal={onCloseDeleteModal}
                onSuccessClick={() => deleteProcessDataVisualizer(selectFileProcess?.id)}
                isLoading={isDeleteProcessVisualizationLoading}
                successBtnText="Delete"
                alertType="DANGER"
                title="Are You Sure?"
                text={`You are about to delete <strong>${selectFileProcess?.name}</strong>. This will remove the visualization data and it cannot be restored`}
              />
            </StyledFlex>
          </Panel>

          {processVisualizerDataOptions?.length !== 0 && (
            <>
              <StyledResizeHandle data-html2canvas-ignore="true" boxShadow={boxShadows.panelExpandButton}>
                <StyledExpandButton top="75%" right="0" onClick={() => setIsPanelOpen((prev) => !prev)}>
                  {isPanelOpen ? <KeyboardArrowRightRounded /> : <KeyboardArrowLeftRounded />}
                </StyledExpandButton>
              </StyledResizeHandle>

              <StyledPanelSlider defaultSize={35} minSize={35} maxSize={35} isOpen={isPanelOpen}>
                <Scrollbars id="process-visualizer-view-panel">
                  <ProcessDataRightSidePanel data={selectFileProcess} getDisplayName={getDisplayName} />
                </Scrollbars>
              </StyledPanelSlider>
            </>
          )}
        </PanelGroup>
      )}
    </StyledFlex>
  );
};

export default ProcessDataVisualizer;
