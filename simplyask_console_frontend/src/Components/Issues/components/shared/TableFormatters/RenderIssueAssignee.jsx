import { Skeleton } from '@mui/material';
import { isEqual } from 'lodash';
import React from 'react';
import UsernameWithAvatar from '../../../../shared/REDISIGNED/components/UsernameWithAvatar/UsernameWithAvatar';
import EditableCell from '../../../../shared/REDISIGNED/table-v2/TableCells/EditableCell/EditableCell';

const RenderIssueAssignee = React.memo(
  ({ cell, table }) => {
    const { assignedTo, isDeleting, isUpdating } = cell.getValue() || {};

    if (isDeleting || isUpdating) return <Skeleton />;

    return (
      <EditableCell cell={cell} table={table}>
        <UsernameWithAvatar firstName={assignedTo} />
      </EditableCell>
    );
  },
  (prevProps, nextProps) => isEqual(prevProps.cell.getValue(), nextProps.cell.getValue())
);

export default RenderIssueAssignee;
