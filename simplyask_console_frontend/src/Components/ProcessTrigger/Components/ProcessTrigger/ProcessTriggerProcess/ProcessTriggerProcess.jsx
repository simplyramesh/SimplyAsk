import { useTheme } from '@mui/material/styles';
import { useQueryClient } from '@tanstack/react-query';
import { format, startOfDay } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { useFormik } from 'formik';
import moment from 'moment';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { delayedBlockerSyncNavigation } from '../../../../shared/REDISIGNED/BlockNavigate/utils/helpers';
import { toast } from 'react-toastify';
import { triggerProcessExecutionByFileId } from '../../../../../Services/axios/bpmnAxios';
import routes from '../../../../../config/routes';
import useBulkExecutionMutation from '../../../../../hooks/process/useBulkExecutionMutation';
import usePreviewFileData from '../../../../../hooks/process/usePreviewFileData';
import { useGetExecutionHeaders } from '../../../../../hooks/process/useProcessDefinitionExecutionHeaders';
import useUpdateBulkExecutionMutation from '../../../../../hooks/process/useUpdateBulkExecutionMutation';
import { useGetCurrentUser } from '../../../../../hooks/useGetCurrentUser';
import { ISO_UTC_DATE_AND_TIME_FORMAT } from '../../../../../utils/timeUtil';
import { PROCESS_EXECUTION_QUERY_KEYS } from '../../../../Issues/constants/core';
import { PROCESS_HISTORY_TAB_VALUES } from '../../../../ProcessHistory/constants/core';
import { generateUUID } from '../../../../Settings/AccessManagement/utils/helpers';
import FullScreenModal from '../../../../WorkflowEditor/components/FullScreenModal/FullScreenModal';
import BlockNavigate from '../../../../shared/REDISIGNED/BlockNavigate/BlockNavigate';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomTableIcons from '../../../../shared/REDISIGNED/icons/CustomTableIcons';
import ContentLayout from '../../../../shared/REDISIGNED/layouts/ContentLayout/ContentLayout';
import ConfirmationModal from '../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import { StyledTooltip } from '../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import Spinner from '../../../../shared/Spinner/Spinner';
import { StyledFlex, StyledText } from '../../../../shared/styles/styled';
import { useDeleteFileById } from '../../../hooks/useDeleteFileById';
import { useGetAllProcessTriggers } from '../../../hooks/useGetAllProcessTriggers';
import {
  CRITERIA_FIELDS,
  DATA_TYPES,
  EDIT_PROCESS_MODAL_TYPES,
  EXECUTION_FREQUENCY,
  EXECUTION_INPUT_DATA_TYPE,
  FREQUENCY_OPTIONS,
  MOMENT_DATE_FORMAT,
  PROCESS_TRIGGER_DATA_VALUE_SEPARATOR,
  PROCESS_TRIGGER_MODAL_TYPES,
  executionDetailsFormSchema,
} from '../../../utils/constants';
import {
  createDynamicValidationSchema,
  formatFilePreviewData,
  getCronExpressionValues,
} from '../../../utils/formatters';
import { getStartDateInitialVal } from '../../../utils/initialValueHelpers';
import ScheduledProcessEditorSummary from '../../ScheduledProcesses/ScheduledProcessEditorModal/ScheduledProcessEditorSummary/ScheduledProcessEditorSummary';

import ProcessTriggerExecuteSideModals from './ProcessTriggerExecute/ProcessTriggerExecuteSideModals';
import ProcessTriggerExecuteStep1 from './ProcessTriggerExecute/ProcessTriggerExecuteStep1';
import ProcessTriggerExecuteStep2 from './ProcessTriggerExecute/ProcessTriggerExecuteStep2';
import ProcessTriggerExecuteStep3 from './ProcessTriggerExecute/ProcessTriggerExecuteStep3';
import { StyledProcessEditorHead, StyledQuestionsMarkHover } from './StyledProcessTriggerExecuteProcess';

const ProcessTriggerProcess = ({ editModeData, onCloseEditorModal, onViewScheduledProcesses, setIsDirtySynced }) => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { colors, boxShadows } = useTheme();
  const { currentUser } = useGetCurrentUser();

  const { processTriggers: step1SelectOptions, isProcessTriggersFetching: isProcessDefinitionDataLoading } =
    useGetAllProcessTriggers({
      select: (res) =>
        res?.map((item) => ({
          value: item.workflowId,
          label: item.name,
          deploymentId: item.deploymentId,
        })),
    });

  const [showSuccessSubmissionModal, setShowSuccessSubmissionModal] = useState({ isOpen: false });

  const [searchableColumns, setSearchableColumns] = useState();
  const [buttonClickedOn, setButtonClickedOn] = useState({ formEntryState: true, fileUploadState: false });
  const [content, setContent] = useState([]);
  const [defineExecutionDetailsSideBarOpen, setDefineExecutionDetailsSideBarOpen] = useState(null);
  const [expectedColumnFieldsSideBarOpen, setExpectedColumnFieldsSideBarOpen] = useState(null);
  const [deleteExecutionDetailRowModal, setDeleteExecutionDetailRowModal] = useState(null);
  const [clickedDeleteTableRow, setClickedDeleteTableRow] = useState(null);
  const [clickedUpdateTableRowId, setClickedUpdateTableRowId] = useState(null);

  const [showMaskedTableRows, setShowMaskedTableRows] = useState({});

  const [uploadFileState, setUploadFileState] = useState([]);
  const [uploadFileStatus, setUploadFileStatus] = useState({ success: false, fail: false });
  const [uploadedFileResponse, setUploadedFileResponse] = useState(null);
  const [executionDetails, setExecutionDetails] = useState();
  const [parsedFileUploadDataResponse, setParsedFileUploadDataResponse] = useState(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalElements: 0,
    pageCount: 0,
    offset: 0,
  });
  const tableRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState({ open: false });

  const {
    values,
    setFieldValue,
    submitForm,
    dirty: isDirtyFormDataStep1,
  } = useFormik({
    initialValues: {
      process: null,
    },
    onSubmit: () => getExecutionDetailsPayload(),
  });

  const { deleteFileById } = useDeleteFileById({
    onError: () => {
      toast.error('Something went wrong...');
    },
  });

  const getDefaultExecutionName = () =>
    editModeData ? editModeData?.executionName : `${values.process?.label} - ${moment().format('MMMM DD, YYYY')}`;

  const getExecutionTimeInitialValues = () => {
    if (editModeData) {
      try {
        const parseObj = editModeData.executionTimeDetails || {};

        return {
          ...parseObj,
          executionName: editModeData.executionName,
          executionTime: {
            ...parseObj?.executionTime,
            endDate: editModeData.endsAt,
            startsNow: false,
            startDate:
              parseObj?.executionFrequency?.value === EXECUTION_FREQUENCY.ONCE
                ? editModeData.executionTime
                : getStartDateInitialVal(editModeData),
          },
        };
      } catch (error) {
        console.log(error);
      }
    }

    return {
      executionName: getDefaultExecutionName(),
      executionFrequency: FREQUENCY_OPTIONS[0],
      executionTime: null,
    };
  };

  const getInitialManualEntryValues = useMemo(() => {
    if (editModeData?.source === EXECUTION_INPUT_DATA_TYPE.FILE_UPLOAD) return [];

    return editModeData?.parsedData
      ? Object.values(editModeData?.parsedData)?.map((row) => ({ ...row, uniqueIdFormEntryTable: generateUUID() }))
      : [];
  }, [editModeData]);

  const getInitialFileUploadEntryValues = useMemo(() => {
    if (editModeData?.source === EXECUTION_INPUT_DATA_TYPE.MANUAL_ENTRY) return [];

    return editModeData?.previewData ? editModeData?.previewData.map((item) => formatFilePreviewData(item)) : [];
  }, [editModeData]);

  const { setFieldValue: setFieldValueFormDataStep2, dirty: isDirtyFormDataStep2 } = useFormik({
    enableReinitialize: true,
    initialValues: {
      manualEntry: editModeData ? getInitialManualEntryValues : [],
      fileUploadEntry: editModeData ? getInitialFileUploadEntryValues : [],
    },
  });

  const {
    values: valueExecutionDetailsStep3,
    setFieldValue: setFieldValueExecutionDetailsStep3,
    errors: errorsExecutionDetailsStep3,
    isValid: isValidExecutionDetailsStep3,
    touched: isTouchedExecutionDetailsStep3,
    dirty: isDirtyExecutionDetailsStep3,
  } = useFormik({
    enableReinitialize: true,
    initialValues: { ...getExecutionTimeInitialValues(), environment: values?.process?.environment },
    validationSchema: executionDetailsFormSchema,
  });

  useEffect(() => {
    if (editModeData) return;

    setIsDirtySynced?.({
      isDirty: isDirtyFormDataStep1 || isDirtyFormDataStep2 || isDirtyExecutionDetailsStep3,
      isOpen: false,
    });
  }, [isDirtyFormDataStep2, isDirtyExecutionDetailsStep3, isDirtyFormDataStep1, editModeData]);

  const { dataHeaderColumns, isDataHeaderFetching } = useGetExecutionHeaders({
    pathVariable: values?.process?.deploymentId,
    options: {
      enabled: values?.process?.deploymentId?.length > 0,
      select: (res) => res.data,
    },
  });

  useEffect(() => {
    if (dataHeaderColumns?.length > 0) {
      setSearchableColumns(dataHeaderColumns);
    }
  }, [dataHeaderColumns]);

  const sideBarInitialValues = (isMandatory = false) => {
    if (isMandatory) {
      const initialValues = {};
      dataHeaderColumns?.forEach((item) => {
        if (item.fieldCriteria === CRITERIA_FIELDS.MANDATORY) {
          initialValues[item.fieldName] = '';
        }
      });
      return initialValues;
    }

    const initialValues = {};
    dataHeaderColumns?.forEach((item) => {
      initialValues[item.fieldName] = '';
    });
    return initialValues;
  };

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      totalElements: content?.length,
      pageCount: tableRef?.current?.getPageCount(),
    }));
  }, [content, tableRef]);

  const {
    values: defineExecutionSideBarValues,
    errors,
    setFieldValue: defineExecutionSideBarSetFieldValues,
    submitForm: defineExecutionSubmitSideBarForm,
    resetForm: defineExecutionResetForm,
    touched,
    setFieldTouched: defineExecutionSideBarSetFieldTouched,
    handleBlur,
  } = useFormik({
    initialTouched: false,
    initialValues: sideBarInitialValues(),
    validationSchema: createDynamicValidationSchema(sideBarInitialValues, dataHeaderColumns),
    onSubmit: () => {
      if (!defineExecutionSideBarValues.uniqueIdFormEntryTable) {
        const uniqueId = generateUUID();
        const updatedTableData = [...content, { ...defineExecutionSideBarValues, uniqueIdFormEntryTable: uniqueId }];
        setContent(updatedTableData);
        defineExecutionResetForm();
      } else {
        if (defineExecutionSideBarValues.uniqueIdFormEntryTable === clickedUpdateTableRowId) {
          // Check for files input data and delete existing file if they're removed or replaced

          const selectedRow = content.find((item) => item.uniqueIdFormEntryTable === clickedUpdateTableRowId) || {};

          const filterRemovedFilesRows = Object.values(selectedRow)?.filter(
            (row) => row.type === DATA_TYPES.FILE && defineExecutionSideBarValues?.[row.fieldName]?.id !== row.id
          );

          filterRemovedFilesRows?.forEach((row) => {
            deleteFileById(row.id);
          });

          const updatedContent = content.map((item) => {
            if (item.uniqueIdFormEntryTable === clickedUpdateTableRowId) {
              return { ...item, ...defineExecutionSideBarValues };
            }
            return item;
          });
          setContent(updatedContent);
        }
        defineExecutionResetForm();
        setClickedUpdateTableRowId(null);
      }
    },
  });

  const toggleSidebar = (sidebar = 'filters', value = false) => {
    const stateSelector = {
      details: setDefineExecutionDetailsSideBarOpen,
      expectedColumnFields: setExpectedColumnFieldsSideBarOpen,
    };

    stateSelector[sidebar](value);
  };

  const handleUpdateIconClick = (row) => {
    Object.entries(row).forEach(([key, value]) => {
      defineExecutionSideBarSetFieldValues(key, value);
    });
    setDefineExecutionDetailsSideBarOpen(true);
  };

  const tableMeta = {
    theme: { colors, boxShadows },
    onDeleteIcon: (row, event) => {
      setClickedDeleteTableRow(row);
      setDeleteExecutionDetailRowModal(true);
      event.stopPropagation();
    },
    onUpdateIcon: (row, event) => {
      setClickedUpdateTableRowId(row.uniqueIdFormEntryTable);
      handleUpdateIconClick(row);
      event.stopPropagation();
    },
    onToggleProtectedEye: (row, event) => {
      const rowId = row.uniqueIdFormEntryTable;

      setShowMaskedTableRows((prev) => ({
        ...prev,
        [rowId]: !prev[rowId],
      }));

      event.stopPropagation();
    },
    showMaskedTableRows: showMaskedTableRows,
  };

  const handleRowDeletion = () => {
    let removedRow = {};

    const updatedContent = content.filter((item) => {
      const result = Object.entries(clickedDeleteTableRow.original).some(([key, value]) => item[key] !== value);

      if (!result) {
        removedRow = item;
      }

      return result;
    });

    const filterRemovedRowFiles = Object.values(removedRow)?.filter((row) => row.type === DATA_TYPES.FILE);

    filterRemovedRowFiles?.forEach((row) => {
      deleteFileById(row.id);
    });

    setContent(updatedContent);
    setDeleteExecutionDetailRowModal(null);
    setClickedDeleteTableRow();
  };

  const searchBarHandler = (event) => {
    const query = event.target.value.toLowerCase();

    const updatedFilteredColumns =
      query.length > 0
        ? dataHeaderColumns.filter((field) => field.fieldName.toLowerCase().includes(query))
        : dataHeaderColumns;

    setSearchableColumns(updatedFilteredColumns);
  };

  useEffect(() => {
    if (uploadFileState?.length > 0) {
      const fileDataPayload = handleFileUpload();
      uploadFileForPreview(fileDataPayload);
    }
  }, [uploadFileState]);

  const handleFileInputChange = (e) => {
    const files = e.target?.files;
    if (!files || files?.length < 1) {
      return;
    }
    setUploadFileState([...files]);
  };

  const handleDragAndDrop = (file) => {
    setUploadFileState([...file]);
  };

  const handleFileUpload = () => {
    const executionTime = format(new Date(), MOMENT_DATE_FORMAT);

    const fileUploadPayload = {
      executionTime,
      userId: currentUser?.id,
      processName: values?.process?.deploymentId,
      timezone: currentUser?.timezone,
    };
    const fileData = new FormData();

    fileData.append(
      DATA_TYPES.PROCESS_EXECUTION_INPUT,
      new Blob([JSON.stringify(fileUploadPayload)], {
        type: 'application/json',
      })
    );

    fileData.append(DATA_TYPES.FILE, uploadFileState[0]);

    return fileData;
  };

  const createFormEntryRequest = () => {
    if (!Array.isArray(content) || content.length === 0) {
      return { header: '', fields: '' };
    }

    const headers = Object.keys(content[0])
      .filter((key) => key !== 'uniqueIdFormEntryTable')
      .join(PROCESS_TRIGGER_DATA_VALUE_SEPARATOR);

    const modifiedFileContent = content.map((item) => {
      const modifiedFileItem = Object.entries(item).reduce(
        (acc, [key, val]) => {
          if (val.type === DATA_TYPES.FILE) {
            acc[key] = val.id;
          }
          return acc;
        },
        { ...item }
      );

      return modifiedFileItem || item;
    });

    const fields = modifiedFileContent
      .map((item) =>
        Object.entries(item)
          .filter(([key]) => key !== 'uniqueIdFormEntryTable')
          .map(([, value]) => value)
          .join(PROCESS_TRIGGER_DATA_VALUE_SEPARATOR)
      )
      .join('\n');

    return { header: headers, fields };
  };

  const getUserTimezoneUTCTimestamp = (date, timezone) =>
    format(utcToZonedTime(date, timezone), ISO_UTC_DATE_AND_TIME_FORMAT);

  const getExecutionDetailsPayload = () => {
    if (!isExecutionDetailsFilled()) {
      return;
    }

    const { executionTime, executionName } = executionDetails;
    const { startsNow, repeater, startDate, neverEnds, endDate } = executionTime;
    const executionDate = getUserTimezoneUTCTimestamp(startsNow ? Date.now() : startDate, currentUser.timezone);

    const cronExpression = getCronExpressionValues(executionDate, repeater).join(' ');

    let request;
    const { environment, ...executionTimeDetails } = valueExecutionDetailsStep3;

    const createOrEditPayload = editModeData
      ? {
          executionFileId: editModeData.id,
        }
      : {
          processName: values?.process?.deploymentId,
        };
    const fileUploadData = {
      backupFileId: parsedFileUploadDataResponse?.backupFileId,
      contentType: parsedFileUploadDataResponse?.contentType,
      originalFilename: parsedFileUploadDataResponse?.originalFilename,
      previewData: parsedFileUploadDataResponse?.previewData,
      structuredData: parsedFileUploadDataResponse?.structuredData,
    };

    const submitFn = editModeData ? submitUpdateExecution : submitExecution;

    if (!repeater) {
      if (buttonClickedOn.formEntryState || buttonClickedOn.fileUploadState || dataHeaderColumns.length <= 0) {
        request = {
          executionTime: executionDate,
          ...(isMultipleExecutions() && { executionName }),
          userId: currentUser?.id,
          timezone: currentUser?.timezone,
          header: '',
          fields: '',
          executionTimeDetails,
          environment: environment?.envName,
          ...createOrEditPayload,
        };

        if (buttonClickedOn.formEntryState && dataHeaderColumns.length > 0) {
          const { header, fields } = createFormEntryRequest();
          request = { ...request, header, fields };
        } else if (buttonClickedOn.fileUploadState && dataHeaderColumns.length > 0) {
          request = {
            ...request,
            ...fileUploadData,
          };
        }
      }
    } else {
      request = {
        cronExpression,
        ...(isMultipleExecutions() && { executionName }),
        userId: currentUser?.id,
        timezone: currentUser?.timezone,
        header: '',
        fields: '',
        executionTimeDetails,
        ...(!neverEnds && { endsAt: endDate }),
        ...(!startsNow && { startsAt: startOfDay(startDate) }),
        ...createOrEditPayload,
        environment: environment?.envName,
      };

      if (buttonClickedOn.formEntryState && dataHeaderColumns.length > 0) {
        const { header, fields } = createFormEntryRequest();
        request = { ...request, header, fields };
      } else if (buttonClickedOn.fileUploadState && dataHeaderColumns.length > 0) {
        request = {
          ...request,
          ...fileUploadData,
        };
      }
    }

    submitFn(request);
  };

  const isMultipleExecutions = () =>
    (buttonClickedOn.formEntryState && content?.length > 1) ||
    (buttonClickedOn.fileUploadState && uploadedFileResponse?.length > 2);

  const isExecutionDetailsFilled = () =>
    executionDetails?.executionTime && (!isMultipleExecutions() || executionDetails?.executionName);

  const resetComponent = () => {
    setFieldValue('process', null);
    setUploadFileState([]);
    setUploadFileStatus({ success: false, fail: false });
    setButtonClickedOn({ formEntryState: true, fileUploadState: false });
    setParsedFileUploadDataResponse(null);
    setShowSuccessSubmissionModal({ isOpen: false });
    setUploadedFileResponse([]);
    setContent([]);
  };

  const { mutate: submitExecution, isLoading: isSubmitExecutionLoading } = useBulkExecutionMutation({
    onSuccess: (response) => {
      triggerProcessExecutionByFileId(response.data.id, response.data.filename || response.data.deploymentId);
      setShowSuccessSubmissionModal({ isOpen: true, data: valueExecutionDetailsStep3 });
      toast.success('Process execution request has been initiated');
    },
    onError: () => {
      setUploadFileStatus({ success: false, fail: true });
      toast.error('Something went wrong during execution...');
    },
  });

  const { mutate: submitUpdateExecution, isLoading: isSubmitUpdateExecutionLoading } = useUpdateBulkExecutionMutation({
    onSuccess: () => {
      toast.success('Your changes have been saved successfully');
      onCloseEditorModal();

      queryClient.invalidateQueries({
        queryKey: [PROCESS_EXECUTION_QUERY_KEYS.GET_PROCESS_EXECUTIONS_FILES_QUERY_KEY],
      });
    },
    onError: () => {
      setUploadFileStatus({ success: false, fail: true });
      toast.error('Something went wrong...');
    },
  });

  const { uploadFileForPreview, isUploadedFileForPreviewLoading } = usePreviewFileData({
    onSuccess: (response) => {
      setParsedFileUploadDataResponse(response.data);
      setUploadFileStatus({ success: true, fail: false });
      if (response?.data?.previewData?.length > 0) {
        const filteredResponse = response.data.previewData.map((item) => formatFilePreviewData(item));
        setUploadedFileResponse(filteredResponse);
      }
    },
    onError: () => {
      setUploadFileStatus({ success: false, fail: true });
      toast.error('Something went wrong during file preview...');
    },
  });

  useEffect(() => {
    if (editModeData) {
      setFieldValue('process', {
        value: editModeData.workflowId,
        label: editModeData.displayName,
        deploymentId: editModeData.deploymentId,
      });

      if (editModeData?.source === EXECUTION_INPUT_DATA_TYPE.MANUAL_ENTRY) {
        const appendIdsToData = getInitialManualEntryValues;
        setContent(appendIdsToData);
      } else if (editModeData?.source === EXECUTION_INPUT_DATA_TYPE.FILE_UPLOAD) {
        const formateFileData = getInitialFileUploadEntryValues;
        setUploadedFileResponse(formateFileData);

        setButtonClickedOn({ formEntryState: false, fileUploadState: true });
        setUploadFileStatus({ success: true, fail: false });
      }
    }
  }, [editModeData, step1SelectOptions]);

  useEffect(() => {
    if (content) {
      setFieldValueFormDataStep2('manualEntry', content);
    }
  }, [content]);

  useEffect(() => {
    if (uploadedFileResponse) {
      setFieldValueFormDataStep2('fileUploadEntry', uploadedFileResponse);
    }
  }, [uploadedFileResponse]);

  const isExecutionDetailsStepDisabled = () => {
    if (dataHeaderColumns?.length <= 0 && values?.process?.value?.length > 0) {
      return false;
    }

    const isMandatoryFieldsPresent = dataHeaderColumns?.some(
      (item) => item.fieldCriteria === CRITERIA_FIELDS.MANDATORY
    );
    const isFormEntryEmpty = buttonClickedOn.formEntryState && content?.length === 0;

    if (buttonClickedOn.fileUploadState && !uploadFileStatus?.success) return true;

    return dataHeaderColumns ? isFormEntryEmpty && isMandatoryFieldsPresent : isFormEntryEmpty;
  };

  const getOpacityStep2 = () => {
    if (editModeData) return 1;

    return !values?.process?.label?.length ? 0.5 : 1;
  };

  const isStep2Dirty = dataHeaderColumns?.length > 0 && isDirtyFormDataStep2;

  const isEditFormDirty = editModeData && (isStep2Dirty || isDirtyExecutionDetailsStep3);
  const isDefaultTriggerFormDirty = !editModeData && (isStep2Dirty || isDirtyExecutionDetailsStep3);

  const onCloseFullScreenModalClick = () => {
    if (isEditFormDirty) {
      setIsModalOpen({ open: true, type: EDIT_PROCESS_MODAL_TYPES.UNSAVED_CHANGES });
      return;
    }
    onCloseEditorModal();
  };

  const onDiscardUnSavedChanges = () => {
    setIsModalOpen({ open: false });
    onCloseEditorModal();
  };

  const getEditProcessSubmissionModalStepNum = () => {
    if (isDirtyExecutionDetailsStep3 && isStep2Dirty) return 'Step 2 and Step 3';

    return isDirtyExecutionDetailsStep3 ? 'Step 3' : 'Step 2';
  };

  const onSubmissionConfirmationClick = () => {
    resetComponent();

    delayedBlockerSyncNavigation(() => {
      if (showSuccessSubmissionModal?.data?.executionTime?.startsNow) {
        const isBulkExecution = content?.length > 1 || uploadedFileResponse?.length > 2;

        navigate({
          pathname: routes.PROCESS_HISTORY,
          search: `tab=${
            isBulkExecution
              ? PROCESS_HISTORY_TAB_VALUES.BULK_EXECUTION_HISTORY
              : PROCESS_HISTORY_TAB_VALUES.PROCESS_HISTORY
          }`,
        });
      } else {
        onViewScheduledProcesses?.();
      }
    });
  };

  const renderEditProcessHeader = () => (
    <StyledProcessEditorHead>
      <StyledFlex width="100%" direction="row" alignItems="center" justifyContent="space-between">
        <StyledFlex direction="row" alignItems="center" gap="20px">
          <CustomTableIcons icon="CLOSE" width={20} onClick={onCloseFullScreenModalClick} />

          <StyledText weight={600} size={19} lh={24}>
            Edit Scheduled Execution
          </StyledText>
        </StyledFlex>
        <StyledFlex direction="row" gap="20px">
          <StyledTooltip
            title={
              (isExecutionDetailsStepDisabled() || !isExecutionDetailsFilled()) &&
              'Complete all 3 steps first to submit execution'
            }
            arrow
            placement="top"
            p="10px 15px"
            maxWidth="355px"
          >
            <StyledFlex>
              <StyledButton
                primary
                variant={isExecutionDetailsStepDisabled() ? 'outlined' : 'contained'}
                onClick={() => setIsModalOpen({ open: true, type: EDIT_PROCESS_MODAL_TYPES.SUBMIT_UPDATES })}
                weight={600}
                disabled={isExecutionDetailsStepDisabled() || !isEditFormDirty || !isExecutionDetailsFilled()}
                endIcon={
                  isExecutionDetailsStepDisabled() && (
                    <StyledFlex mt="-2px">
                      <StyledQuestionsMarkHover />
                    </StyledFlex>
                  )
                }
              >
                Save Changes
              </StyledButton>
            </StyledFlex>
          </StyledTooltip>
        </StyledFlex>
      </StyledFlex>
    </StyledProcessEditorHead>
  );

  const renderProcessTriggerSteps = () => (
    <>
      <ProcessTriggerExecuteStep1
        values={values}
        setFieldValue={setFieldValue}
        setUploadFileState={setUploadFileState}
        setUploadFileStatus={setUploadFileStatus}
        setContent={setContent}
        step1SelectOptions={step1SelectOptions}
        isDefaultTriggerFormDirty={isDefaultTriggerFormDirty}
        setIsModalOpen={setIsModalOpen}
        setButtonClickedOn={setButtonClickedOn}
        setUploadedFileResponse={setUploadedFileResponse}
        {...(editModeData && { editModeData })}
      />

      <ProcessTriggerExecuteStep2
        values={values}
        setUploadFileState={setUploadFileState}
        setUploadFileStatus={setUploadFileStatus}
        getOpacityStep2={getOpacityStep2}
        dataHeaderColumns={dataHeaderColumns}
        buttonClickedOn={buttonClickedOn}
        setButtonClickedOn={setButtonClickedOn}
        content={content}
        pagination={pagination}
        setPagination={setPagination}
        tableMeta={tableMeta}
        isProcessDefinitionDataLoading={isProcessDefinitionDataLoading}
        isDataHeaderFetching={isDataHeaderFetching}
        tableRef={tableRef}
        setDefineExecutionDetailsSideBarOpen={setDefineExecutionDetailsSideBarOpen}
        setExpectedColumnFieldsSideBarOpen={setExpectedColumnFieldsSideBarOpen}
        isFilePreviewLoading={isUploadedFileForPreviewLoading}
        uploadFileStatus={uploadFileStatus}
        handleDragAndDrop={handleDragAndDrop}
        uploadFileState={uploadFileState}
        handleFileUpload={handleFileUpload}
        handleFileInputChange={handleFileInputChange}
        uploadedFileResponse={uploadedFileResponse}
        parsedFileUploadDataResponse={parsedFileUploadDataResponse}
        setUploadedFileResponse={setUploadedFileResponse}
        {...(editModeData && { editModeData })}
      />

      <ProcessTriggerExecuteStep3
        selectedProcess={values?.process?.deploymentId}
        isExecutionDetailsStepDisabled={isExecutionDetailsStepDisabled}
        isMultipleExecutions={isMultipleExecutions}
        setExecutionDetails={setExecutionDetails}
        getDefaultExecutionName={getDefaultExecutionName}
        valueExecutionDetailsStep3={valueExecutionDetailsStep3}
        setFieldValueExecutionDetailsStep3={setFieldValueExecutionDetailsStep3}
        errorsExecutionDetailsStep3={errorsExecutionDetailsStep3}
        isValidExecutionDetailsStep3={isValidExecutionDetailsStep3}
        isTouchedExecutionDetailsStep3={isTouchedExecutionDetailsStep3}
        isExecutionDetailsFilled={isExecutionDetailsFilled}
        submitForm={submitForm}
        {...(editModeData && { editModeData })}
      />

      <ProcessTriggerExecuteSideModals
        values={values}
        dataHeaderColumns={dataHeaderColumns}
        isDataHeaderFetching={isDataHeaderFetching}
        setDefineExecutionDetailsSideBarOpen={setDefineExecutionDetailsSideBarOpen}
        defineExecutionDetailsSideBarOpen={defineExecutionDetailsSideBarOpen}
        defineExecutionResetForm={defineExecutionResetForm}
        setClickedUpdateTableRowId={setClickedUpdateTableRowId}
        toggleSidebar={toggleSidebar}
        errors={errors}
        handleBlur={handleBlur}
        touched={touched}
        clickedUpdateTableRowId={clickedUpdateTableRowId}
        defineExecutionSubmitSideBarForm={defineExecutionSubmitSideBarForm}
        searchBarHandler={searchBarHandler}
        searchableColumns={searchableColumns}
        defineExecutionSideBarValues={defineExecutionSideBarValues}
        defineExecutionSideBarSetFieldValues={(field, value, validate, touched) => {
          if (touched) defineExecutionSideBarSetFieldTouched(field, touched);
          defineExecutionSideBarSetFieldValues(field, value);
        }}
        expectedColumnFieldsSideBarOpen={expectedColumnFieldsSideBarOpen}
        deleteExecutionDetailRowModal={deleteExecutionDetailRowModal}
        setDeleteExecutionDetailRowModal={setDeleteExecutionDetailRowModal}
        setClickedDeleteTableRow={setClickedDeleteTableRow}
        handleRowDeletion={handleRowDeletion}
        clickedDeleteTableRow={clickedDeleteTableRow}
        {...(editModeData && { editModeData })}
      />

      <ConfirmationModal
        isOpen={!editModeData && showSuccessSubmissionModal?.isOpen}
        modalIcon="SUCCESS"
        onCancelClick={onSubmissionConfirmationClick}
        onCloseModal={resetComponent}
        onSuccessClick={resetComponent}
        cancelBtnText="View Execution"
        successBtnText="Close"
        alertType="INFO"
        title="Execution Submitted Successfully"
        text="Close this pop up to return to the Process Trigger page or view your executed Process in Process History"
        modalIconColor={colors.statusResolved}
      />

      {!editModeData && (
        <ConfirmationModal
          isOpen={isModalOpen?.type === PROCESS_TRIGGER_MODAL_TYPES.STEP_1_CHANGES && isModalOpen?.open}
          onCloseModal={() => setIsModalOpen({ open: false })}
          cancelBtnText="Go Back"
          onSuccessClick={() => isModalOpen?.onSuccessCallback?.()}
          successBtnText="Confirm"
          alertType="WARNING"
          title="Are You Sure?"
        >
          <StyledText weight={400} size={15} lh={21} textAlign="center">
            You are about to change your process. Any information you inserted during{' '}
            {getEditProcessSubmissionModalStepNum()} will be{' '}
            <StyledText display="inline" weight={700}>
              permanently
            </StyledText>{' '}
            deleted.
          </StyledText>
        </ConfirmationModal>
      )}
    </>
  );

  const isLoading = isProcessDefinitionDataLoading || isSubmitExecutionLoading;

  if (isLoading && !editModeData) return <Spinner parent />;

  return editModeData ? (
    <FullScreenModal open onClose={onCloseFullScreenModalClick}>
      {isLoading && <Spinner globalFadeBgParent />}
      {renderEditProcessHeader()}
      <ContentLayout
        side={<ScheduledProcessEditorSummary selectedProcess={editModeData} />}
        sideWidth={440}
        containerDirection="row-reverse"
        noPadding
        grayBgThumbVertical
      >
        <StyledFlex p="35px">
          {renderProcessTriggerSteps()}

          <ConfirmationModal
            isOpen={isModalOpen?.type === EDIT_PROCESS_MODAL_TYPES.UNSAVED_CHANGES && isModalOpen?.open}
            onCloseModal={onDiscardUnSavedChanges}
            cancelBtnText="Leave Page"
            onSuccessClick={() => setIsModalOpen({ open: false })}
            successBtnText="Stay on Page"
            alertType="WARNING"
            title="Are You Sure?"
            text="You are about to exit out of this page. By leaving this page, any changes you made will be lost"
          />

          <ConfirmationModal
            isOpen={isModalOpen?.type === EDIT_PROCESS_MODAL_TYPES.SUBMIT_UPDATES && isModalOpen?.open}
            onCloseModal={() => setIsModalOpen({ open: false })}
            cancelBtnText="Go Back"
            onSuccessClick={submitForm}
            successBtnText="Confirm"
            alertType="WARNING"
            title="Are You Sure?"
            isLoading={isSubmitUpdateExecutionLoading}
          >
            <StyledText weight={400} size={15} lh={21} textAlign="center">
              You are about to change your process. Any information you inserted during{' '}
              {getEditProcessSubmissionModalStepNum()}{' '}
              <StyledText display="inline" weight={700}>
                permanently
              </StyledText>{' '}
              deleted.
            </StyledText>
          </ConfirmationModal>

          {/* // BlockNavigate is used only handle beforeunload event (like tab closing), not any redirection.
      // Since this edit scheduled process itself is a modal, there's no way to click any redirection link
       */}
          <BlockNavigate isBlocked={isEditFormDirty}></BlockNavigate>
        </StyledFlex>
      </ContentLayout>
    </FullScreenModal>
  ) : (
    renderProcessTriggerSteps()
  );
};

export default ProcessTriggerProcess;
