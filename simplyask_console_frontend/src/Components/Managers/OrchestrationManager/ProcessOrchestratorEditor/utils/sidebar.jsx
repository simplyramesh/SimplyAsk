export const SIDEBAR_TYPES = {
  PROCESS_EDIT: 'PROCESS_EDIT',
  PROCESS_EXECUTION_DETAILS: 'PROCESS_EXECUTION_DETAILS',
};

export const getSidebar = ({
  type,
  payload
}) => ({
  [SIDEBAR_TYPES.PROCESS_EDIT]: {
    type: SIDEBAR_TYPES.PROCESS_EDIT,
    payload,
  },
  [SIDEBAR_TYPES.PROCESS_EXECUTION_DETAILS]: {
    type: SIDEBAR_TYPES.PROCESS_EXECUTION_DETAILS,
    payload,
  },
})[type];
