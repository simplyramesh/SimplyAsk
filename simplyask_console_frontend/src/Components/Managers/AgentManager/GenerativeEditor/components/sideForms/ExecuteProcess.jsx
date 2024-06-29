import React, { memo } from 'react';
import { useProcesses } from '../../../../../../hooks/process/useProcesses';
import Spinner from '../../../../../shared/Spinner/Spinner';
import ProcessSelect from '../../../AgentEditor/components/sideForms/ActionsSidebar/ProcessSelect/ProcessSelect';

const ExecuteProcess = ({ data, onChange, errors }) => {
  const { processes, isFetching: isProcessesLoading } = useProcesses({
    params: {
      pageSize: 999,
    },
    options: {
      gcTime: Infinity,
      staleTime: Infinity,
    },
  });

  const processOptions =
    processes?.content?.map(({ deploymentId, displayName }) => ({
      label: displayName,
      value: deploymentId,
    })) || [];

  if (isProcessesLoading) {
    return <Spinner inline small />;
  }

  return (
    <ProcessSelect
      processOptions={processOptions}
      value={data.processId || null}
      onChange={({ value }) => {
        onChange(value, ['data', 'processId']);
      }}
      invalid={errors}
    />
  );
};

export default memo(ExecuteProcess);
