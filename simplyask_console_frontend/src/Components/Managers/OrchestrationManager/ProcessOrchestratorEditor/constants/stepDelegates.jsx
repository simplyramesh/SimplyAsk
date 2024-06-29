import ProcessIcon from '../../../../../Assets/icons/agent/steps/process.svg?component';

export const STEP_ITEM_TYPES = {
  PROCESS: 'PROCESS',
};

const STEP_ITEM_ICONS = {
  [STEP_ITEM_TYPES.PROCESS]: ProcessIcon,
};

export const stepDelegates = [
  {
    type: STEP_ITEM_TYPES.PROCESS,
    name: 'Process',
    Icon: STEP_ITEM_ICONS[STEP_ITEM_TYPES.PROCESS],
    multi: true,
    addable: true,
    visibleInSidebar: true,
  },
];
