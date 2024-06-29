import { STEP_TYPES } from '../../../shared/constants/steps';
import { JOB_TRANSITION_TYPES, TIME_TYPES } from '../constants/steps';

export const defaultTransitions = [
  {
    id: JOB_TRANSITION_TYPES.SUCCESS,
    value: 'On Success (Default)',
  },
  {
    id: JOB_TRANSITION_TYPES.FALLOUT,
    value: 'On Fallout',
  }
];

export const getNewlyAddedProcess = ({ id, position }) => ({
  id,
  type: STEP_TYPES.DEFAULT,
  dragHandle: ``,
  data: {
    job: {
      id: null,
      jobName: `Process ${id}`,
      processId: '',
      delayValue: 0,
      delayType: TIME_TYPES.SECONDS,
      customStartTime: '',
      customEndTime: '',
      timeoutValue: 0,
      timeoutType: TIME_TYPES.SECONDS,
      params: [],
      status: null,
      jobGroupExecutionId: null,
    },
    meta: {
      hovered: false,
      touched: false
    },
    transitions: defaultTransitions,
    errors: { },
  },
  position,
})
