import routes from '../../../../../config/routes';
import { SELECTED_ITEM_KEY } from '../../../../../hooks/useTableFilterSearchParams';
import { ISSUE_ENTITY_TYPE, ISSUE_SERVICE_TICKET_TASKS_STATUSES } from '../../../constants/core';
import { createLabeledSelection, selectDropdownOption } from '../../FalloutTickets/utils/helpers';

export const SERVICE_TICKET_FILTER_KEY = 'sideFilter';

export const selectedServiceTicketsFiltersMeta = {
  key: SERVICE_TICKET_FILTER_KEY,
  formatter: {
    priority: ({ v, k }) => ({
      label: 'Priority',
      value: v.map((item) => item.label) || '',
      k,
    }),
    issueTypeId: ({ v, k }) => createLabeledSelection({ v, k }, 'Issue Type'),
    assignedTo: ({ v, k }) => ({
      label: 'Assignee',
      value: v.map((item) => item.label) || '',
      k,
    }),
    dueDate: ({ v, k }) => ({
      label: 'Due Date',
      value: v?.label || '',
      k,
    }),
    createdDate: ({ v, k }) => ({
      label: 'Created Date',
      value: v?.label || '',
      k,
    }),
    status: ({ v, k }) => createLabeledSelection({ v, k }, 'Status'),
    createdBy: ({ v, k }) => ({
      label: 'Created By',
      value: v,
      k,
    }),
    relatedEntity: ({ v, k }) => ({
      label: 'Process',
      value: v.map((item) => item.label) || '',
      k,
    }),
  },
};

export const serviceTicketsFormatter = (values) => ({
  priority: selectDropdownOption(values[SERVICE_TICKET_FILTER_KEY]?.priority, 'value') || '',
  issueTypeStatusId: selectDropdownOption(values[SERVICE_TICKET_FILTER_KEY]?.status, 'value') || '',
  assignedTo: selectDropdownOption(values[SERVICE_TICKET_FILTER_KEY]?.assignedTo, 'value.id') || '',
  ...(values[SERVICE_TICKET_FILTER_KEY]?.createdDate?.filterValue &&
    values[SERVICE_TICKET_FILTER_KEY].createdDate?.filterValue),
  ...(values[SERVICE_TICKET_FILTER_KEY]?.dueDate?.filterValue &&
    values[SERVICE_TICKET_FILTER_KEY].dueDate?.filterValue),
  relatedEntity: selectDropdownOption(values[SERVICE_TICKET_FILTER_KEY]?.relatedEntity, 'value') || '',
  timezone: values.timezone || '',
  returnParameters: values.returnParameters,
  returnAdditionalField: values.returnAdditionalField,
  returnRelatedEntities: values.returnRelatedEntities,
  issueCategoryId: values.issueCategoryId,
  createdBy: values[SERVICE_TICKET_FILTER_KEY]?.createdBy,
});

export const linkedItemMapper = (item) => ({
  id: item.id,
  type: item.type,
  name: getLinkedItemName(item),
  description: getLinkedItemDescription(item),
  createdDate: getLinkedItemCreatedAt(item),
  status: getLinkedItemStatus(item),
  relatedEntity: item?.relatedEntity,
});

export const getLinkedItemName = ({ type, relatedEntity }) => {
  switch (type) {
    case ISSUE_ENTITY_TYPE.PROCESS:
      return relatedEntity.projectName;
    case ISSUE_ENTITY_TYPE.WORKFLOW:
      return relatedEntity.displayName;
    case ISSUE_ENTITY_TYPE.CONVERSATION:
      return relatedEntity.name;
    case ISSUE_ENTITY_TYPE.ISSUE:
      return relatedEntity.displayName;
    case ISSUE_ENTITY_TYPE.AGENT:
      return relatedEntity.name;
    case ISSUE_ENTITY_TYPE.USER:
      return `${relatedEntity.firstName} ${relatedEntity.lastName}`;
    default:
      return null;
  }
};

export const getLinkedItemDescription = ({ type, relatedEntity }) => {
  if (type === ISSUE_ENTITY_TYPE.USER) {
    return null;
  }
  if (type === ISSUE_ENTITY_TYPE.PROCESS) {
    return `#${relatedEntity.procInstanceId}`;
  }
  if (type === ISSUE_ENTITY_TYPE.WORKFLOW) {
    return `#${relatedEntity.workflowId}`;
  }
  if (type === ISSUE_ENTITY_TYPE.USER) {
    return '';
  }
  return `#${relatedEntity.id}`;
};

export const getLinkedItemCreatedAt = ({ relatedEntity }) => relatedEntity.timestamp || relatedEntity.createdAt || null;

export const getLinkedItemStatus = ({ relatedEntity }) => relatedEntity.status?.name || relatedEntity.status || null;

export const getRelatedEntityDtoId = (entity) => {
  const { relatedEntity, type } = entity;

  if (!relatedEntity) {
    return;
  }

  if (type === ISSUE_ENTITY_TYPE.WORKFLOW) {
    return relatedEntity.workflowId;
  }

  if (type === ISSUE_ENTITY_TYPE.PROCESS) {
    return relatedEntity.procInstanceId;
  }

  return relatedEntity.id;
};

export const mapRelatedEntitiesToDto = (entities) =>
  entities?.reduce((acc, entity) => {
    if (!entity.relatedEntity) return acc;

    return [
      ...acc,
      {
        id: entity.id,
        relation: entity.relation,
        type: entity.type,
        entityId: getRelatedEntityDtoId(entity),
      },
    ];
  }, []) || [];

export const getBytesSizeHelper = (bytes, decimals) => {
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(dm))}`;
};

export const getBytesSize = (bytes, decimals = 1) => {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${getBytesSizeHelper(bytes, decimals)} ${sizes[i]}`;
};

export const getLinkedItemUrlByLinkType = (itemType, itemId) => {
  switch (itemType) {
    case ISSUE_ENTITY_TYPE.ISSUE:
      return routes.TICKETS_FULLVIEW.replace(':ticketId', itemId);
    case ISSUE_ENTITY_TYPE.PROCESS:
      return `${routes.PROCESS_HISTORY}?${SELECTED_ITEM_KEY}=${itemId}`;
    case ISSUE_ENTITY_TYPE.WORKFLOW:
      return routes.PROCESS_MANAGER_INFO.replace(':processId', itemId);
    case ISSUE_ENTITY_TYPE.AGENT:
      return routes.AGENT_MANAGER_DIAGRAM.replace(':serviceTypeId', itemId);
    case ISSUE_ENTITY_TYPE.USER:
      return routes.SETTINGS_ACCESS_MANAGER_USER_DETAILS.replace(':id', itemId);
    default:
      return '';
  }
};

export const getLinkedItemIdByLinkType = (itemType, relatedEntity) => {
  switch (itemType) {
    case ISSUE_ENTITY_TYPE.AGENT:
    case ISSUE_ENTITY_TYPE.ISSUE:
    case ISSUE_ENTITY_TYPE.USER:
      return relatedEntity.id;
    case ISSUE_ENTITY_TYPE.PROCESS:
      return relatedEntity.procInstanceId;
    case ISSUE_ENTITY_TYPE.WORKFLOW:
      return relatedEntity.workflowId;
    default:
      return null;
  }
};

export const SERVICE_TICKET_TASK_STATUS_MAP = {
  [ISSUE_SERVICE_TICKET_TASKS_STATUSES.APPROVED]: {
    status: ISSUE_SERVICE_TICKET_TASKS_STATUSES.APPROVED,
    color: 'savingsGreen',
  },
  Approve: { status: ISSUE_SERVICE_TICKET_TASKS_STATUSES.APPROVED, color: 'savingsGreen' },
  Done: { status: 'Completed', color: 'savingsGreen' },
  [ISSUE_SERVICE_TICKET_TASKS_STATUSES.COMPLETE]: { status: 'Completed', color: 'savingsGreen' },
  Completed: { status: 'Completed', color: 'savingsGreen' },
  [ISSUE_SERVICE_TICKET_TASKS_STATUSES.PENDING_ACTION]: {
    status: ISSUE_SERVICE_TICKET_TASKS_STATUSES.PENDING_ACTION,
    color: 'mutedBlue',
  },
  [ISSUE_SERVICE_TICKET_TASKS_STATUSES.REJECTED]: {
    status: ISSUE_SERVICE_TICKET_TASKS_STATUSES.REJECTED,
    color: 'venetianRed',
  },
  Reject: { status: ISSUE_SERVICE_TICKET_TASKS_STATUSES.REJECTED, color: 'venetianRed' },
  [ISSUE_SERVICE_TICKET_TASKS_STATUSES.INCOMPLETE]: {
    status: ISSUE_SERVICE_TICKET_TASKS_STATUSES.PENDING_ACTION,
    color: 'mutedBlue',
  },
};