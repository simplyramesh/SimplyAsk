import { memo } from 'react';

import { EXECUTION_FREQUENCY } from '../../../utils/constants';

import ProcessExecutionDetailsDaily from './ProcessExecutionDetailsDaily/ProcessExecutionDetailsDaily';
import ProcessExecutionDetailsMonthly from './ProcessExecutionDetailsMonthly/ProcessExecutionDetailsMonthly';
import ProcessExecutionDetailsOnce from './ProcessExecutionDetailsOnce/ProcessExecutionDetailsOnce';
import ProcessExecutionDetailsWeekly from './ProcessExecutionDetailsWeekly/ProcessExecutionDetailsWeekly';
import ProcessExecutionDetailsYearly from './ProcessExecutionDetailsYearly/ProcessExecutionDetailsYearly';

const ProcessExecutionDetailsForm = ({
  executionFrequency,
  onChange,
  valueExecutionDetailsStep3,
  editModeData,
}) => {
  const getProcessExecutionFormComponent = () => {
    switch (executionFrequency) {
    case EXECUTION_FREQUENCY.ONCE:
      return ProcessExecutionDetailsOnce;
    case EXECUTION_FREQUENCY.DAILY:
      return ProcessExecutionDetailsDaily;
    case EXECUTION_FREQUENCY.WEEKLY:
      return ProcessExecutionDetailsWeekly;
    case EXECUTION_FREQUENCY.MONTHLY:
      return ProcessExecutionDetailsMonthly;
    case EXECUTION_FREQUENCY.YEARLY:
      return ProcessExecutionDetailsYearly;
    default:
      return null;
    }
  };

  const ProcessExecutionDetailsFormComponent = getProcessExecutionFormComponent();

  if (!executionFrequency) return <></>;

  return (
    <ProcessExecutionDetailsFormComponent
      onChange={(e) => onChange(e)}
      valueExecutionDetailsStep3={valueExecutionDetailsStep3}
      editModeData={editModeData}
    />
  );
};

export default memo(ProcessExecutionDetailsForm);
