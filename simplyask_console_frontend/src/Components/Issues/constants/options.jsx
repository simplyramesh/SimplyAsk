import HighPriority from '../../../Assets/icons/issues/priorities/high.svg?component';
import HighestPriority from '../../../Assets/icons/issues/priorities/highest.svg?component';
import LowPriority from '../../../Assets/icons/issues/priorities/low.svg?component';
import LowestPriority from '../../../Assets/icons/issues/priorities/lowest.svg?component';
import MediumPriority from '../../../Assets/icons/issues/priorities/medium.svg?component';
import NonePriority from '../../../Assets/icons/issues/priorities/none.svg?component';
import { StyledFlex } from '../../shared/styles/styled';

import {
  ISSUE_ENTITY_RELATIONS,
  ISSUE_PRIORITIES,
  ISSUE_PRIORITY_DATA_MAP,
  ISSUE_RELATIONS_LABELS,
  SERVICE_TICKET_BOA_STATUSES,
} from './core';

export const labelWithIcon = (label, Icon) => (
  <StyledFlex direction="row" alignItems="center" gap="0 12px">
    <Icon />
    {label}
  </StyledFlex>
);

export const PRIORITY_OPTIONS = [
  {
    label: 'Highest',
    Icon: HighestPriority,
    labelWithIcon: labelWithIcon('Highest', ISSUE_PRIORITY_DATA_MAP[ISSUE_PRIORITIES.HIGHEST].Icon),
    value: ISSUE_PRIORITY_DATA_MAP[ISSUE_PRIORITIES.HIGHEST].value,
  },
  {
    label: 'High',
    Icon: HighPriority,
    labelWithIcon: labelWithIcon('High', ISSUE_PRIORITY_DATA_MAP[ISSUE_PRIORITIES.HIGH].Icon),
    value: ISSUE_PRIORITY_DATA_MAP[ISSUE_PRIORITIES.HIGH].value,
  },
  {
    label: 'Medium',
    Icon: MediumPriority,
    labelWithIcon: labelWithIcon('Medium', ISSUE_PRIORITY_DATA_MAP[ISSUE_PRIORITIES.MEDIUM].Icon),
    value: ISSUE_PRIORITY_DATA_MAP[ISSUE_PRIORITIES.MEDIUM].value,
  },
  {
    label: 'Low',
    Icon: LowPriority,
    labelWithIcon: labelWithIcon('Low', ISSUE_PRIORITY_DATA_MAP[ISSUE_PRIORITIES.LOW].Icon),
    value: ISSUE_PRIORITY_DATA_MAP[ISSUE_PRIORITIES.LOW].value,
  },
  {
    label: 'Lowest',
    Icon: LowestPriority,
    labelWithIcon: labelWithIcon('Lowest', ISSUE_PRIORITY_DATA_MAP[ISSUE_PRIORITIES.LOWEST].Icon),
    value: ISSUE_PRIORITY_DATA_MAP[ISSUE_PRIORITIES.LOWEST].value,
  },
  {
    label: 'None',
    Icon: NonePriority,
    labelWithIcon: labelWithIcon('None', ISSUE_PRIORITY_DATA_MAP[ISSUE_PRIORITIES.NONE].Icon),
    value: ISSUE_PRIORITY_DATA_MAP[ISSUE_PRIORITIES.NONE].value,
  },
];

export const SERVICE_TICKET_BOA_STATUS_OPTIONS = [
  { value: SERVICE_TICKET_BOA_STATUSES.SUCCESS, label: 'Success', color: 'green' },
  { value: SERVICE_TICKET_BOA_STATUSES.FAILED, label: 'Failed', color: 'red' },
];

export const ISSUE_ENTITY_RELATIONS_OPTIONS = Object.values(ISSUE_ENTITY_RELATIONS).map((relation) => ({
  value: relation,
  label: ISSUE_RELATIONS_LABELS[relation],
}));

export const sharedDropdownProps = {
  minMenuHeight: 150,
  maxMenuHeight: 450,
  closeMenuOnSelect: false,
  hideSelectedOptions: false,
  isClearable: false,
  openMenuOnClick: true,
};
