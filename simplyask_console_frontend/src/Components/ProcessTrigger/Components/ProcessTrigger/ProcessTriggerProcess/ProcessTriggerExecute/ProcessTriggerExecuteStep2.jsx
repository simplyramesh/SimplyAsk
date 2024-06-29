import { useTheme } from '@emotion/react';
import Collapse from '@mui/material/Collapse';
import { toast } from 'react-toastify';

import Spinner from '../../../../../shared/Spinner/Spinner';
import { StyledDivider, StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import { useDeleteFileById } from '../../../../hooks/useDeleteFileById';
import { columnFieldsProcessTriggerFromEntryDataTable } from '../../../../utils/constants';

import DefaultFileUploadView from './Step2ProcessExecution/FileUpload/DefaultFileUploadView';
import FailFileUploadView from './Step2ProcessExecution/FileUpload/FailFileUploadView';
import SuccessFileUploadView from './Step2ProcessExecution/FileUpload/SuccessFileUploadView';
import DefineExecutionFormEntryTable from './Step2ProcessExecution/FormEntry/DefineExecutionFormEntryTable';
import ToggleButtons from './Step2ProcessExecution/ToggleButtons/ToggleButtons';

const ProcessTriggerExecuteStep2 = ({
  values,
  setUploadFileState,
  setUploadFileStatus,
  getOpacityStep2,
  dataHeaderColumns,
  buttonClickedOn,
  setButtonClickedOn,
  content,
  pagination,
  setPagination,
  tableMeta,
  isProcessDefinitionDataLoading,
  isDataHeaderFetching,
  tableRef,
  setDefineExecutionDetailsSideBarOpen,
  setExpectedColumnFieldsSideBarOpen,
  isFilePreviewLoading,
  uploadFileStatus,
  handleDragAndDrop,
  uploadFileState,
  handleFileUpload,
  uploadFilePreview,
  handleFileInputChange,
  uploadedFileResponse,
  setUploadedFileResponse,
  editModeData,
  parsedFileUploadDataResponse,
}) => {
  const { colors } = useTheme();

  const { deleteFileById } = useDeleteFileById({
    onSuccess: () => {
      setUploadFileState([]);
      setUploadFileStatus({ success: false, fail: false });
      setUploadedFileResponse([]);
    },
    onError: () => {
      toast.error('Something went wrong...');
    },
  });

  const MANUAL_INPUT_PARAMETER_TYPE = 'FILE';

  const processTriggerVisible = (dataHeaderColumns) => !editModeData
    && !dataHeaderColumns?.map((workflow) => workflow.fieldValidationType).includes(MANUAL_INPUT_PARAMETER_TYPE);

  const handleFileRemovalClick = () => {
    deleteFileById(parsedFileUploadDataResponse?.fileId);
  };

  return (
    <>
      <StyledFlex opacity={getOpacityStep2()}>
        <StyledText weight={600} size={19} mb={14}>
          Step 2 - Define Process Input Data
        </StyledText>
        {!editModeData && !values?.process?.label?.length && (
          <StyledText weight={400} size={16}>
            Complete the previous step first
          </StyledText>
        )}

        <Collapse in={!!editModeData || !!values?.process?.label?.length} timeout="auto" unmountOnExit>
          {dataHeaderColumns?.length > 0 ? (
            <>
              {processTriggerVisible(dataHeaderColumns) && (
                <ToggleButtons buttonClickedOn={buttonClickedOn} setButtonClickedOn={setButtonClickedOn} />
              )}
              {buttonClickedOn.formEntryState ? (
                <DefineExecutionFormEntryTable
                  data={{
                    content,
                    pageable: { pageSize: pagination.pageSize, offset: pagination.offset },
                    totalElements: pagination.totalElements,
                    totalPages: pagination.pageCount,
                  }}
                  columns={columnFieldsProcessTriggerFromEntryDataTable(dataHeaderColumns, colors)}
                  pagination={pagination}
                  setPagination={setPagination}
                  tableMeta={tableMeta}
                  isLoading={isProcessDefinitionDataLoading || isDataHeaderFetching}
                  tableRef={tableRef}
                  colors={colors}
                  setDefineExecutionDetailsSideBarOpen={setDefineExecutionDetailsSideBarOpen}
                />
              ) : (
                <StyledFlex p="-2px 10px">
                  <StyledText
                    color={colors.blueLink}
                    cursor="pointer"
                    weight={600}
                    size={16}
                    mb={12}
                    onClick={() => setExpectedColumnFieldsSideBarOpen(true)}
                  >
                    Expected Column Fields
                  </StyledText>
                  {(() => {
                    if (isFilePreviewLoading) {
                      return (
                        <StyledFlex
                          textAlign="center"
                          justifyContent="center"
                          alignItems="center"
                          width="100%"
                          height="336px"
                          border={`3px dotted ${colors.dragAndDropGreyBorder}`}
                          borderRadius="15px"
                        >
                          <Spinner inline />
                        </StyledFlex>
                      );
                    }
                    if (uploadFileStatus.fail) {
                      return (
                        <FailFileUploadView
                          handleDragAndDrop={handleDragAndDrop}
                          colors={colors}
                          uploadFileState={uploadFileState}
                          retryUploadOnClick={() => {
                            const fileDataPayload = handleFileUpload();
                            uploadFilePreview(fileDataPayload);
                          }}
                          handleFileInputChange={handleFileInputChange}
                        />
                      );
                    }

                    if (uploadFileStatus.success) {
                      return (
                        <SuccessFileUploadView
                          colors={colors}
                          uploadFileState={uploadFileState}
                          onFileRemovalClick={handleFileRemovalClick}
                          uploadedFileResponse={uploadedFileResponse}
                          editModeData={editModeData}
                        />
                      );
                    }
                    return (
                      <DefaultFileUploadView
                        handleDragAndDrop={handleDragAndDrop}
                        handleFileInputChange={handleFileInputChange}
                        colors={colors}
                      />
                    );
                  })()}
                </StyledFlex>
              )}
            </>
          ) : (
            <StyledFlex
              textAlign="center"
              justifyContent="center"
              alignItems="center"
              width="100%"
              height="192px"
              borderRadius="15px"
              backgroundColor={colors.bgColorOptionTwo}
            >
              <StyledText weight={600} mb={12}>
                No Input Parameters to Define
              </StyledText>
              <StyledText>Your selected Process contains no</StyledText>
              <StyledText>input parameters. You can continue to the next step</StyledText>
            </StyledFlex>
          )}
        </Collapse>
      </StyledFlex>

      <StyledFlex mb={4} mt={4}>
        <StyledDivider borderWidth={2} color={colors.geyser} flexItem />
      </StyledFlex>
    </>
  );
};

export default ProcessTriggerExecuteStep2;
