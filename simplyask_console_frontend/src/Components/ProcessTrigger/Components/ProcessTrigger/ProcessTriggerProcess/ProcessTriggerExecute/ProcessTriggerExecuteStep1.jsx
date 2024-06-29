import { useTheme } from '@emotion/react';

import { StyledDivider, StyledFlex } from '../../../../../shared/styles/styled';

import Step1ProcessExecution from './Step1ProcessExecution/Step1ProcessExecution';

const ProcessTriggerExecuteStep1 = ({
  values,
  setFieldValue,
  setUploadFileState,
  setUploadFileStatus,
  setContent,
  step1SelectOptions,
  editModeData,
  isDefaultTriggerFormDirty,
  setIsModalOpen,
  setButtonClickedOn,
  setUploadedFileResponse,
}) => {
  const { colors } = useTheme();

  return (
    <>
      <Step1ProcessExecution
        values={values}
        setFieldValue={setFieldValue}
        setUploadFileState={setUploadFileState}
        setUploadFileStatus={setUploadFileStatus}
        setContent={setContent}
        step1SelectOptions={step1SelectOptions}
        editModeData={editModeData}
        isDefaultTriggerFormDirty={isDefaultTriggerFormDirty}
        setIsModalOpen={setIsModalOpen}
        setButtonClickedOn={setButtonClickedOn}
        setUploadedFileResponse={setUploadedFileResponse}
      />
      <StyledFlex mb={4}>
        <StyledDivider borderWidth={2} color={colors.geyser} flexItem />
      </StyledFlex>
    </>
  );
};

export default ProcessTriggerExecuteStep1;
