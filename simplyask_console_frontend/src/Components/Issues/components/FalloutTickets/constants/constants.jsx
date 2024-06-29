export const STATUS_CONSTANTS = {
  UNASSIGNED: 'UNASSIGNED',
  ASSIGNED: 'ASSIGNED',
  RESOLVED: 'Resolved',
  UNRESOLVED: 'Unresolved',
  FORCE_RESOLVED: 'Force Resolved',
  CREATED: 'CREATED',
  STATUS_CHANGED: 'STATUS_CHANGED',
};

export const falloutStatusColors = (statusColors) => ({
  [STATUS_CONSTANTS.UNASSIGNED]: statusColors.blue,
  [STATUS_CONSTANTS.ASSIGNED]: statusColors.yellow,
  [STATUS_CONSTANTS.UNRESOLVED]: statusColors.red,
  [STATUS_CONSTANTS.RESOLVED]: statusColors.green,
  [STATUS_CONSTANTS.STATUS_CHANGED]: statusColors.green,
  [STATUS_CONSTANTS.FORCE_RESOLVED]: statusColors.blue,
});

export const FALLOUT_TICKETS_FULL_VIEW_TABS = {
  TICKET_DETAILS: 'OVERVIEW',
  ACTION: 'ACTION',
};

export const FALLOUT_TICKET_STATUS_TOOLTIPS = {
  [STATUS_CONSTANTS.UNRESOLVED]: 'Only Unresolved tickets can be reverted to Forced Resolved',
  [STATUS_CONSTANTS.FORCE_RESOLVED]: 'Only Forced Resolved tickets can be reverted to Unresolved',
  [STATUS_CONSTANTS.RESOLVED]:
    'This ticket was resolved through an action being performed. Tickets resolved through performing an action cannot be reverted to unresolved.',
};

export const FALLOUT_TICKET_FILTER_KEYS = {
  DUE_DATE: 'dueDate',
  ASSIGNED_TO: 'assignedTo',
  CREATED_DATE: 'createdDate',
  STATUS: 'status',
  PRIORITY: 'priority',
};

export const FALLOUT_TICKET_SIDE_FILTER_INITIAL_VALUES = {
  [FALLOUT_TICKET_FILTER_KEYS.DUE_DATE]: null,
  [FALLOUT_TICKET_FILTER_KEYS.ASSIGNED_TO]: null,
  [FALLOUT_TICKET_FILTER_KEYS.CREATED_DATE]: null,
  [FALLOUT_TICKET_FILTER_KEYS.STATUS]: [],
  // failedActivityId: [],
  [FALLOUT_TICKET_FILTER_KEYS.PRIORITY]: [],
};
