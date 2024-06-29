import HeaderCell from '../../shared/REDISIGNED/table/components/HeaderCell/HeaderCell';
import RowCell from '../../shared/REDISIGNED/table/components/RowCell/RowCell';
import {
  StyledStage, StyledStatus, StyledText,
} from '../../shared/styles/styled';
import TableCellTimeRange from '../MrHistory/TableCellTimeRange/TableCellTimeRange';
import { MR_HISTORY_RECORD_LIST_API_KEYS, MR_HISTORY_RECORD_STAGES, STATUS_MAP } from './mappers';

export const MR_HISTORY_COLUMNS = [
  {
    header: 'Execution ID',
    accessorFn: (row) => row.id,
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell }) => <RowCell cell={cell} align={{ textAlign: 'left' }} />,
    id: 'id',
    enableGlobalFilter: false,
    size: 210,
  },
  {
    header: 'Number of records',
    accessorFn: (row) => row.numRecords,
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell }) => <RowCell cell={cell} align={{ textAlign: 'center' }} />,
    id: 'recordMetadata',
    align: 'center',
    enableGlobalFilter: false,
    size: 158,
  },
  {
    header: 'Start & End Time (PST)',
    accessorFn: (row) => <TableCellTimeRange startTime={row.startedAt} endTime={row.finishedAt} />,
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell }) => <RowCell as="div" cell={cell} align={{ textAlign: 'center' }} />,
    id: 'createdAt',
    size: 180,
    align: 'center',
    enableGlobalFilter: false,
  },
  {
    header: 'Status',
    accessorFn: (row) => (
      <StyledStatus color={STATUS_MAP[row.executionStatus]?.color}>
        {STATUS_MAP[row.executionStatus]?.label}
      </StyledStatus>
    ),
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell }) => <RowCell as="div" cell={cell} align={{ textAlign: 'center' }} />,
    id: 'executionStatus',
    align: 'center',
    enableGlobalFilter: false,
    size: 128,
  },
];

export const MR_HISTORY_RECORD_LIST_COLUMNS = [
  {
    header: 'External Record ID',
    accessorFn: (row) => row[MR_HISTORY_RECORD_LIST_API_KEYS.RECORD_ID],
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell }) => <RowCell cell={cell} align={{ textAlign: 'left', cursor: 'pointer' }} />,
    id: 'id',
    enableGlobalFilter: false,
    size: 210,
  },
  {
    header: 'Transform Batch ID',
    accessorFn: (row) => row[MR_HISTORY_RECORD_LIST_API_KEYS.TRANSFORM_BATCH_ID],
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell }) => <RowCell cell={cell} align={{ textAlign: 'center', cursor: 'pointer' }} />,
    id: 'transformBatchId',
    align: 'center',
    enableGlobalFilter: false,
    size: 158,
  },
  {
    header: 'Load Batch ID',
    accessorFn: (row) => row[MR_HISTORY_RECORD_LIST_API_KEYS.LOAD_BATCH_ID],
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell }) => <RowCell cell={cell} align={{ textAlign: 'center', cursor: 'pointer' }} />,
    id: 'loadBatchId',
    align: 'center',
    enableGlobalFilter: false,
    size: 158,
  },
  {
    header: 'Start & End Time (PST)',
    accessorFn: (row) => (
      <TableCellTimeRange
        startTime={row[MR_HISTORY_RECORD_LIST_API_KEYS.STARTED_AT]}
        endTime={row[MR_HISTORY_RECORD_LIST_API_KEYS.FINISHED_AT]}
      />
    ),
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell }) => <RowCell as="div" cell={cell} align={{ textAlign: 'center', cursor: 'pointer' }} />,
    id: 'createdBefore',
    size: 188,
    align: 'center',
    enableGlobalFilter: false,
  },
  {
    header: 'Stage',
    accessorFn: (row) => {
      const stage = row[MR_HISTORY_RECORD_LIST_API_KEYS.RECORD_STAGE];
      const recordStatus = row[MR_HISTORY_RECORD_LIST_API_KEYS.RECORD_STATUS];

      return (
        <StyledStage color={MR_HISTORY_RECORD_STAGES[stage]?.color} cursor="default">
          {MR_HISTORY_RECORD_STAGES[stage]?.label}
          <StyledText>{recordStatus && `${recordStatus.toLowerCase()}`}</StyledText>
        </StyledStage>
      );
    },
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell }) => <RowCell as="div" cell={cell} align={{ textAlign: 'center', cursor: 'pointer' }} />,
    id: 'recordStage',
    align: 'center',
    enableGlobalFilter: false,
    size: 160,
  },
];
