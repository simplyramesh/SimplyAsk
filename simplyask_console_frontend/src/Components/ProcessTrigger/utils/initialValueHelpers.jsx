import { EXECUTES_WHEN } from './constants';

export const getStartsOnInitialVal = (editModeData) => {
  if (editModeData) return EXECUTES_WHEN.DATE;

  return EXECUTES_WHEN.NOW;
};

export const getEndsOnInitialVal = (editModeData, valueExecutionDetailsStep3) => {
  if (editModeData)
    return valueExecutionDetailsStep3?.executionTime?.neverEnds ? EXECUTES_WHEN.NEVER : EXECUTES_WHEN.DATE;

  return EXECUTES_WHEN.NEVER;
};

export const getStartDateInitialVal = (editModeData) => editModeData?.startsAt || null;

export const getStartDateFinalVal = (valueExecutionDetailsStep3) =>
  valueExecutionDetailsStep3?.executionTime?.startDate;

export const getEndDateFinalVal = (valueExecutionDetailsStep3) => valueExecutionDetailsStep3?.executionTime?.endDate;

export const getRepeaterVal = (valueExecutionDetailsStep3) =>
  valueExecutionDetailsStep3?.executionTime?.repeater?.value || 1;

export const SCHEDULED_PROCESSES_SIDE_FILTER_INITIAL_VALUES = {
  executionName: '',
  nextExecutionDate: '',
  lastExecutionDate: '',
  createdDate: '',
};
