import { useTheme } from '@mui/material/styles';
import { useFormik } from 'formik';
import { useState } from 'react';

import ConfirmationModal from '../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import Spinner from '../../../../shared/Spinner/Spinner';
import { StyledFlex } from '../../../../shared/styles/styled';
import { useGetAllOrchestratorGroups } from '../../../hooks/useGetAllOrchestratorGroups';
import { FREQUENCY_OPTIONS, executionDetailsFormSchema } from '../../../utils/constants';
import { getStartDateInitialVal } from '../../../utils/initialValueHelpers';

import ProcessTriggerOrchestrationStep1 from './ProcessTriggerOrchestrationSteps/ProcessTriggerOrchestrationStep1';
import ProcessTriggerOrchestrationStep2 from './ProcessTriggerOrchestrationSteps/ProcessTriggerOrchestrationStep2';

const ProcessTriggerOrchestration = ({ editModeData, onViewScheduledProcesses }) => {
  const { colors } = useTheme();

  const { orchestratorData, isOrchestratorDataLoading } = useGetAllOrchestratorGroups(
    new URLSearchParams({
      pageSize: 999,
    }),
    {
      select: (res) => res?.content?.map((job) => ({ label: job.name, value: job.id })),
    }
  );

  const [executionDetails, setExecutionDetails] = useState();

  const [showSuccessSubmissionModal, setShowSuccessSubmissionModal] = useState(false);

  const { values, setFieldValue, submitForm } = useFormik({
    initialValues: {
      orchestrationName: null,
    },
    onSubmit: () => {
      // TODO
    },
  });

  const getExecutionTimeInitialValues = () => {
    if (editModeData) {
      try {
        const parseObj = editModeData.executionTimeDetails;
        return {
          ...parseObj,
          executionTime: {
            ...parseObj.executionTime,
            endDate: editModeData.endsAt,
            startDate: getStartDateInitialVal(editModeData),
            startsNow: false,
          },
        };
      } catch (error) {
        console.log(error);
      }
    }

    return {
      executionFrequency: FREQUENCY_OPTIONS[0],
      executionTime: null,
    };
  };

  const {
    values: valueExecutionDetailsStep3,
    setFieldValue: setFieldValueExecutionDetailsStep3,
    errors: errorsExecutionDetailsStep3,
    isValid: isValidExecutionDetailsStep3,
    touched: isTouchedExecutionDetailsStep3,
  } = useFormik({
    enableReinitialize: true,
    initialValues: getExecutionTimeInitialValues(),
    validationSchema: executionDetailsFormSchema,
  });

  // TODO: Modify this code for editing later

  // useEffect(() => {
  //   if (editModeData) {
  //     setFieldValue('process', { label: editModeData?.workflowName, value: editModeData?.workflowName });

  //     if (editModeData?.source === EXECUTION_INPUT_DATA_TYPE.MANUAL_ENTRY) {
  //       const appendIdsToData = getInitialManualEntryValues;
  //       setContent(appendIdsToData);
  //     } else if (editModeData?.source === EXECUTION_INPUT_DATA_TYPE.FILE_UPLOAD) {
  //       const formateFileData = getInitialFileUploadEntryValues;
  //       setUploadedFileResponse(formateFileData);

  //       setButtonClickedOn({ formEntryState: false, fileUploadState: true });
  //       setUploadFileStatus({ success: true, fail: false });
  //     }
  //   }
  // }, [editModeData]);

  const isExecutionDetailsStepDisabled = !values.orchestrationName;
  const isExecutionDetailsFilled = executionDetails?.executionTime;

  const isLoading = isOrchestratorDataLoading;

  if (isLoading && !editModeData) return <Spinner parent />;

  return (
    <StyledFlex>
      <ProcessTriggerOrchestrationStep1
        values={values}
        setFieldValue={setFieldValue}
        step1SelectOptions={orchestratorData}
        editModeData={editModeData}
      />

      <ProcessTriggerOrchestrationStep2
        {...(editModeData && { editModeData })}
        isExecutionDetailsStepDisabled={isExecutionDetailsStepDisabled}
        valueExecutionDetailsStep3={valueExecutionDetailsStep3}
        setFieldValueExecutionDetailsStep3={setFieldValueExecutionDetailsStep3}
        errorsExecutionDetailsStep3={errorsExecutionDetailsStep3}
        isValidExecutionDetailsStep3={isValidExecutionDetailsStep3}
        isTouchedExecutionDetailsStep3={isTouchedExecutionDetailsStep3}
        submitForm={submitForm}
        isOrchestratorMode
        isExecutionDetailsFilled={isExecutionDetailsFilled}
        setExecutionDetails={setExecutionDetails}
        executionDetails={executionDetails}
      />

      <ConfirmationModal
        isOpen={!editModeData && showSuccessSubmissionModal}
        modalIcon="SUCCESS"
        onCancelClick={() => onViewScheduledProcesses?.()}
        onCloseModal={() => setShowSuccessSubmissionModal(false)}
        onSuccessClick={() => setShowSuccessSubmissionModal(false)}
        cancelBtnText="View Execution"
        successBtnText="Close"
        alertType="INFO"
        title="Execution Submitted Successfully"
        text="Close this pop up to return to the Process Trigger page or view your executed Process in Process History"
        modalIconColor={colors.statusResolved}
      />
    </StyledFlex>
  );
};

export default ProcessTriggerOrchestration;
