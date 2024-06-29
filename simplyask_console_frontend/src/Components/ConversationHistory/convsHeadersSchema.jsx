import { StyledFlex, StyledText } from '../shared/styles/styled';
import { BASE_DATE_FORMAT, BASE_TIME_FORMAT, getInFormattedUserTimezone } from '../../utils/timeUtil';
import styled from '@emotion/styled';
import { tr } from 'date-fns/locale';

export const uniqueId = 'sessionId';

const CONVERSATION_STATUS_LABELS = {
  ACTIVE_SUPPORT_IN_PROGRESS: 'Support in Progress',
  ACTIVE_PENDING_SUPPORT: 'Pending Support',
  CLOSED_BY_USER: 'Closed by User',
  CLOSED_BY_AGENT: 'Closed by Agent',
};

const renderName = ({ cell, row, table }) => {
  const { name, id } = cell.getValue();

  const StyledLinkWrapper = styled('span')`
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  `;

  return (
    <StyledLinkWrapper onClick={() => table.options.meta.onNameClick(row.original.sessionId)}>
      <StyledText color="inherit" size={15}>
        {name || 'Unknown User'}
      </StyledText>
      <StyledText color="inherit" size={12}>
        #{id}
      </StyledText>
    </StyledLinkWrapper>
  );
};

const renderTime = ({ cell, table }) => {
  const time = cell.getValue();
  const timezone = table.options.meta.user?.timezone;

  return (
    <StyledText size={15} weight={400} lh={22}>
      <StyledFlex>{getInFormattedUserTimezone(time, timezone, BASE_DATE_FORMAT)}</StyledFlex>
      <StyledFlex>{getInFormattedUserTimezone(time, timezone, BASE_TIME_FORMAT)}</StyledFlex>
    </StyledText>
  );
};

export const CONVERSATION_HISTORY_COLUMNS = [
  {
    header: 'Name',
    accessorFn: (row) => ({
      name: row.name,
      id: row.sessionId,
    }),
    id: 'ticketName',
    Cell: (props) => renderName(props),
    size: 400,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: false,
    enableEditing: false,
  },
  {
    header: 'Email',
    accessorFn: (row) => row.email,
    id: 'email',
    Cell: ({ cell }) => <StyledText>{cell.getValue() || '-'}</StyledText>,
    size: 225,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: false,
    enableEditing: false,
  },
  {
    header: 'Status',
    accessorFn: (row) => row.supportStatus,
    id: 'supportStatus',
    Cell: ({ cell }) => <StyledText size={14}>{CONVERSATION_STATUS_LABELS[cell.getValue()]}</StyledText>,
    size: 300,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: false,
    enableEditing: false,
  },
  {
    header: 'Closed At',
    accessorFn: (row) => row.firstClosed,
    id: 'firstClosed',
    Cell: ({ cell, table }) =>
      renderTime({
        cell,
        table,
      }),
    size: 225,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: true,
    enableEditing: false,
  },
];
