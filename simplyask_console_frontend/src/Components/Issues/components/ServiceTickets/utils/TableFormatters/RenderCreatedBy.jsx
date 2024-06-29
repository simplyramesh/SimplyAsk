import { Skeleton } from '@mui/material';
import { isEqual } from 'lodash';
import React from 'react';
import TicketTasksCreatedBy from '../../components/shared/TicketTasksCreatedBy/TicketTasksCreatedBy';

const RenderCreatedBy = React.memo(
  ({ cell, row }) => {
    const { createdBy, isDeleting, isUpdating } = cell.getValue() || {};

    if (isDeleting || isUpdating) return <Skeleton />;

    return <TicketTasksCreatedBy value={createdBy} relatedEntities={row.original.relatedEntities} />;
  },
  (prevProps, nextProps) => isEqual(prevProps.cell.getValue(), nextProps.cell.getValue())
);

export default RenderCreatedBy;
