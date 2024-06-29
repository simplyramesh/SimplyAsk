import { Skeleton } from '@mui/material';
import { isEqual } from 'lodash';
import React from 'react';
import {
  BASE_DATE_FORMAT,
  BASE_TIME_FORMAT,
  ISO_UTC_DATE_AND_TIME_FORMAT,
  formatLocalTime,
  getInFormattedUserTimezone,
} from '../../../../../utils/timeUtil';
import EditableCell from '../../../../shared/REDISIGNED/table-v2/TableCells/EditableCell/EditableCell';
import { StyledEmptyValue, StyledFlex, StyledText } from '../../../../shared/styles/styled';
import TicketTasksDueDate from '../../ServiceTickets/components/shared/TicketTasksDueDate/TicketTasksDueDate';

const RenderIssueDueDate = React.memo(
  ({ cell, table }) => {
    const { dueDate, isDeleting, isUpdating } = cell.getValue() || {};
    const dueDateIso = formatLocalTime(dueDate, ISO_UTC_DATE_AND_TIME_FORMAT);
    const timezone = table.options.meta.user?.timezone;

    if (isDeleting || isUpdating) return <Skeleton />;

    return (
      <EditableCell cell={cell} table={table}>
        {!dueDate ? (
          <StyledEmptyValue />
        ) : (
          <TicketTasksDueDate val={dueDate}>
            <StyledText size={15} weight={400} lh={22}>
              <StyledFlex>{getInFormattedUserTimezone(dueDateIso, timezone, BASE_DATE_FORMAT)}</StyledFlex>
              <StyledFlex>{getInFormattedUserTimezone(dueDateIso, timezone, BASE_TIME_FORMAT)}</StyledFlex>
            </StyledText>
          </TicketTasksDueDate>
        )}
      </EditableCell>
    );
  },
  (prevProps, nextProps) => isEqual(prevProps.cell.getValue(), nextProps.cell.getValue())
);

export default RenderIssueDueDate;
