import { Skeleton } from '@mui/material';
import { isEqual } from 'lodash';
import React from 'react';
import {
  BASE_DATE_FORMAT,
  BASE_TIME_FORMAT,
  formatLocalTime,
  getInFormattedUserTimezone,
  ISO_UTC_DATE_AND_TIME_FORMAT,
} from '../../../../../utils/timeUtil';
import { StyledEmptyValue, StyledFlex, StyledText } from '../../../../shared/styles/styled';

const RenderIssueTime = React.memo(
  ({ cell, table, fieldName }) => {
    const field = cell.getValue()?.[fieldName];
    const { isDeleting, isUpdating } = cell.getValue();

    const timezone = table.options.meta.user?.timezone;

    if (isDeleting || isUpdating) return <Skeleton />;

    const utcTime = formatLocalTime(field, ISO_UTC_DATE_AND_TIME_FORMAT);

    return (
      <>
        {!utcTime ? (
          <StyledEmptyValue />
        ) : (
          <StyledText size={15} weight={400} lh={22}>
            <StyledFlex>{getInFormattedUserTimezone(utcTime, timezone, BASE_DATE_FORMAT)}</StyledFlex>
            <StyledFlex>{getInFormattedUserTimezone(utcTime, timezone, BASE_TIME_FORMAT)}</StyledFlex>
          </StyledText>
        )}
      </>
    );
  },
  (prevProps, nextProps) => isEqual(prevProps.cell.getValue(), nextProps.cell.getValue())
);

export default RenderIssueTime;
