import { isValid } from 'date-fns';

import { BASE_DATE_TIME_FORMAT, getInFormattedUserTimezone } from '../../../../../utils/timeUtil';
import {
  StyledCellHoverText, StyledFlex, StyledStatus, StyledText,
} from '../../../../shared/styles/styled';
import { EXECUTIONS_STATUS_MAP, ORCHESTRATOR_GROUP_EXECUTIONS_STATUS_COLOR_MAP } from '../constants/initialValues';

const renderTimeWithBoldFieldName = (fieldName, time) => {
  if (!time) return null;

  return (
    <StyledText size={14} weight={600} lh={21}>
      {`${fieldName}: `}
      <StyledText display="inline" size={14} weight={400} lh={21}>{time}</StyledText>
    </StyledText>
  );
};

export const ORCHESTRATOR_GROUP_EXECUTIONS_COLUMNS = [
  {
    header: 'Execution',
    accessorFn: (row) => ({
      startTime: row.createdAt,
      endTime: row.status !== EXECUTIONS_STATUS_MAP.EXECUTING.toUpperCase()
        ? row.updatedAt
        : `To Be Determined (${row.status})`,
      executionId: row.groupExecutionId,
      startStep: row?.jobName || 'Start Execution',
    }),
    id: 'createdAt',
    Cell: ({ cell, table }) => {
      const {
        executionId, startStep, startTime, endTime,
      } = cell.getValue();
      const { timezone, theme } = table.options.meta;

      const endTimeText = isValid(new Date(endTime)) ? getInFormattedUserTimezone(endTime, timezone, BASE_DATE_TIME_FORMAT) : endTime;

      return (
        <StyledFlex gap="8px 0">
          <StyledCellHoverText>
            <StyledText size={16} weight={600} lh={24} color={theme.colors.linkColor} mb={14}>{`#${executionId}`}</StyledText>
          </StyledCellHoverText>
          {renderTimeWithBoldFieldName('Starting Step', startStep)}
          {renderTimeWithBoldFieldName('Start Time', getInFormattedUserTimezone(startTime, timezone, BASE_DATE_TIME_FORMAT))}
          {renderTimeWithBoldFieldName('End Time', endTimeText)}
        </StyledFlex>
      );
    },
    size: 597,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: true,
  },
  {
    header: 'Status',
    accessorFn: (row) => row.status,
    id: 'status',
    Cell: ({ cell }) => (
      <StyledStatus color={ORCHESTRATOR_GROUP_EXECUTIONS_STATUS_COLOR_MAP[cell.getValue()]}>
        {EXECUTIONS_STATUS_MAP[cell.getValue()] || ''}
      </StyledStatus>
    ),
    size: 138,
    align: 'right',
    enableGlobalFilter: false,
    enableSorting: false,
  },
];
