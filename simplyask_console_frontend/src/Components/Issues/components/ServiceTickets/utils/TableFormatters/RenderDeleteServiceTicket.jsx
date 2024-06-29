import { Skeleton } from '@mui/material';
import { isEqual } from 'lodash';
import React from 'react';
import CustomTableIcons from '../../../../../shared/REDISIGNED/icons/CustomTableIcons';
import { renderRowHoverAction } from '../../../../utills/formatters';

const RenderDeleteServiceTicket = React.memo(
  ({ handleSingleDelete, cell }) => {
    const { isDeleting, isUpdating, id, name } = cell.getValue() || {};

    if (isDeleting || isUpdating) return <Skeleton />;

    return (
      <>
        {renderRowHoverAction({
          icon: <CustomTableIcons width={32} icon="REMOVE" />,
          onClick: () => handleSingleDelete({ id, name }),
          toolTipTitle: 'Delete',
        })}
      </>
    );
  },
  (prevProps, nextProps) => isEqual(prevProps.cell.getValue(), nextProps.cell.getValue())
);

export default RenderDeleteServiceTicket;
