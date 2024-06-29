import { useMemo } from 'react';

import ProcessTriggerProcess from '../../ProcessTrigger/ProcessTriggerProcess/ProcessTriggerProcess';

const ScheduledProcessEditorModal = ({ openProcessEditorFullModal, onClose }) => {
  const getEditModeData = useMemo(() => ({
    ...openProcessEditorFullModal?.data,
    ...(openProcessEditorFullModal?.data?.startsAt && { startsAt: new Date(openProcessEditorFullModal?.data?.startsAt) }),
    ...(openProcessEditorFullModal?.data?.endsAt && { endsAt: new Date(openProcessEditorFullModal?.data?.endsAt) }),
    ...(openProcessEditorFullModal?.data?.executedAt && { executedAt: new Date(openProcessEditorFullModal?.data?.executedAt) }),
    ...(openProcessEditorFullModal?.data?.executionTime && {
      executionTime: new Date(openProcessEditorFullModal?.data?.executionTime),
    }),
    ...(openProcessEditorFullModal?.data?.nextExecutionAt
      && { nextExecutionAt: new Date(openProcessEditorFullModal?.data?.nextExecutionAt) }),
  }), [openProcessEditorFullModal]);

  return (
    <ProcessTriggerProcess
      editModeData={getEditModeData}
      onCloseEditorModal={onClose}
    />

  );
};

export default ScheduledProcessEditorModal;
