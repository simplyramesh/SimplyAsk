import { Skeleton } from '@mui/material';
import { isEqual } from 'lodash';
import React from 'react';
import { StyledText } from '../../../../../shared/styles/styled';
import TicketTasksStat from '../../components/shared/TicketTasksStat/TicketTasksStat';

const RenderRelatedEntities = React.memo(
  ({ cell }) => {
    const { relatedEntities, isDeleting, isUpdating } = cell.getValue() || {};

    if (isDeleting || isUpdating) return <Skeleton />;

    return (
      <TicketTasksStat relatedEntities={relatedEntities}>
        {({ ticketTasksCompleted, ticketTasksCount }) => (
          <>
            <StyledText color="inherit" weight="inherit" textAlign="center">
              {ticketTasksCompleted} of {ticketTasksCount}
            </StyledText>
            <StyledText color="inherit" weight="inherit" textAlign="center">
              Complete
            </StyledText>
          </>
        )}
      </TicketTasksStat>
    );
  },
  (prevProps, nextProps) => isEqual(prevProps.cell.getValue(), nextProps.cell.getValue())
);

export default RenderRelatedEntities;
