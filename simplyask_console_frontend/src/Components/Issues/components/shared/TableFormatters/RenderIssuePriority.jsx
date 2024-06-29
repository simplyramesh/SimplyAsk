import { Skeleton } from '@mui/material';
import { isEqual } from 'lodash';
import React from 'react';
import EditableCell from '../../../../shared/REDISIGNED/table-v2/TableCells/EditableCell/EditableCell';
import { ISSUE_PRIORITIES, ISSUE_PRIORITY_DATA_MAP } from '../../../constants/core';
import { renderIssueTooltip } from '../../../utills/formatters';

const RenderIssuePriorityEdit = React.memo(
  ({ cell, table }) => {
    const { priority: value, isDeleting, isUpdating } = cell.getValue();
    const data = value ? ISSUE_PRIORITY_DATA_MAP[value] : ISSUE_PRIORITY_DATA_MAP[ISSUE_PRIORITIES.NONE];

    if (isDeleting || isUpdating) return <Skeleton />;

    return (
      <EditableCell cell={cell} table={table} textAlign="center">
        {renderIssueTooltip(<data.Icon />, ISSUE_PRIORITY_DATA_MAP[data.value].label)}
      </EditableCell>
    );
  },
  (prevProps, nextProps) => isEqual(prevProps.cell.getValue(), nextProps.cell.getValue())
);

export default RenderIssuePriorityEdit;
