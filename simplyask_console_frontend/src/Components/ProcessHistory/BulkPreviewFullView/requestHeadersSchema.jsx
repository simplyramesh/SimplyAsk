/* eslint-disable valid-typeof */
import { format } from 'date-fns';
import React from 'react';

import { getDayFromDateString, OBJECT_WILD_CARD_KEY } from '../../../utils/helperFunctions';
import HeaderCell from '../../shared/REDISIGNED/table/components/HeaderCell/HeaderCell';
import RowCell from '../../shared/REDISIGNED/table/components/RowCell/RowCell';
import { StyledStatus } from '../../shared/styles/styled';
import { PROCESS_STATUS_COLORS_MAP } from '../constants/core';
import classes from '../ProcessHistory.module.css';

export const FILE_EXECUTIONS_COLUMNS = [
  {
    header: 'Process ID',
    accessorFn: (row) => row.procInstanceId,
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell }) => <RowCell cell={cell} />,
    id: 'procInstanceId',
    enableGlobalFilter: false,
    minSize: 120,
    size: 350,
  },
  {
    header: 'Parameters',
    accessorFn: (row) => row.data,
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell }) => modifyExecutionParameters(cell.getValue()),
    id: 'executionData',
    enableGlobalFilter: false,
    size: 350,
  },
  {
    header: 'Status',
    accessorFn: (row) => row.status,
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell }) => (
      <StyledStatus color={PROCESS_STATUS_COLORS_MAP[cell.getValue()]?.color}>
        {PROCESS_STATUS_COLORS_MAP[cell.getValue()]?.label}
      </StyledStatus>
    ),
    id: 'status',
    enableGlobalFilter: false,
    size: 140,
  },
];

export const uniqueId = OBJECT_WILD_CARD_KEY;

export const modifyTimeStamp = (val) => {
  if (!val || val === '---') return 'N/A';

  const incidentDate = new Date(val);
  const time = format(incidentDate, "hh:mm aaaaa'm'");

  return (
    <div>
      <p className={classes.no_wrap}>{getDayFromDateString(val)}</p>
      <p>{time}</p>
    </div>
  );
};

export const modifyExecutionParameters = (val) => {
  if (!val) return <p>---</p>;

  try {
    const parsed = JSON.parse(val);

    if (typeof parsed === 'object' && !Array.isArray(parsed) && parsed !== null) {
      const splitParameters = Object.keys(parsed);

      if (splitParameters?.length === 1) {
        return <p className={classes.no_wrap}>{splitParameters[0]}</p>;
      }
      if (splitParameters?.length > 1) {
        const remainingItemsLength = splitParameters?.length - 1;
        return (
          <div className={classes.flex_col}>
            <p className={classes.no_wrap}>{splitParameters[0]},</p>
            <p className={classes.timeToBold}>+ {remainingItemsLength} More</p>
          </div>
        );
      }
    }
  } catch {
    return '---';
  }

  return <p>---</p>;
};
