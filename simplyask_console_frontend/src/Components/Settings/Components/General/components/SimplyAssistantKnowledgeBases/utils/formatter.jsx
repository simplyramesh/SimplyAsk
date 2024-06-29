import { BASE_DATE_FORMAT, BASE_TIME_FORMAT, getInFormattedUserTimezone } from '../../../../../../../utils/timeUtil';
import {
  TableRowIconWithTooltip,
  renderRowHoverAction,
  rowHoverActionColumnProps,
} from '../../../../../../Issues/utills/formatters';
import CustomTableIcons from '../../../../../../shared/REDISIGNED/icons/CustomTableIcons';
import Spinner from '../../../../../../shared/Spinner/Spinner';
import { StyledCellHoverText, StyledEmptyValue, StyledFlex, StyledText } from '../../../../../../shared/styles/styled';
import { StyledRelativeRowHoverActionCellIconWrapper } from '../StyledSimplyAssistantKnowledgeBases';
import { MODAL_TYPE } from './constants';

export const renderRowHoverActionRelative = ({ icon, onClick = () => {}, toolTipTitle }) => (
  <StyledRelativeRowHoverActionCellIconWrapper className="showOnRowHover" onClick={onClick}>
    <TableRowIconWithTooltip icon={icon} toolTipTitle={toolTipTitle} />
  </StyledRelativeRowHoverActionCellIconWrapper>
);

const renderKnowledgeBaseName = ({ cell, row, table }) => {
  return (
    <StyledCellHoverText>
      <StyledText
        color="inherit"
        cursor="pointer"
        onClick={() => {
          table.options.meta.onTableRowClick(row.original);
        }}
        maxLines={3}
      >
        {cell.getValue()}
      </StyledText>
    </StyledCellHoverText>
  );
};

const renderKnowledgeSourceName = ({ cell, row, table }) => {
  return (
    <StyledCellHoverText>
      <StyledText
        color="inherit"
        cursor="pointer"
        onClick={() => {
          table.options.meta.onTableRowClick(row.original);
        }}
        maxLines={3}
      >
        {cell.getValue()}
      </StyledText>
    </StyledCellHoverText>
  );
};

const renderTime = ({ cell, table }) => {
  const time = cell.getValue() + 'Z';
  const timezone = table.options.meta.user?.timezone;

  return (
    <StyledText size={15} weight={400} lh={22}>
      <StyledFlex>{getInFormattedUserTimezone(time, timezone, BASE_DATE_FORMAT)}</StyledFlex>
      <StyledFlex>{getInFormattedUserTimezone(time, timezone, BASE_TIME_FORMAT)}</StyledFlex>
    </StyledText>
  );
};

export const KNOWLEDGE_BASE_COLUMNS = [
  {
    header: 'Name',
    accessorFn: (row) => row.name,
    id: 'name',
    Cell: ({ cell, row, table }) =>
      renderKnowledgeBaseName({
        cell,
        row,
        table,
      }),
    size: 354,
    align: 'left',
    enableSorting: true,
    enableEditing: false,
    enableGlobalFilter: false,
  },
  {
    header: 'Description',
    accessorFn: (row) => row.description,
    id: 'knowledgeDescription',
    Cell: ({ cell }) => <StyledText maxLines={3}>{cell.getValue() || '---'}</StyledText>,
    size: 447,
    align: 'left',
    enableSorting: false,
    enableEditing: false,
    enableGlobalFilter: false,
  },
  {
    header: 'Status',
    accessorFn: (row) => row.status,
    id: 'knowledgeSourceStatus',
    Cell: ({ cell }) => <StyledText maxLines={3}>{cell.getValue() || '---'}</StyledText>,
    size: 150,
    align: 'left',
    enableSorting: false,
    enableEditing: false,
    enableGlobalFilter: false,
  },
  {
    header: 'Number of Sources',
    accessorFn: (row) => row?.knowledgeSources?.length,
    id: 'total_sources',
    Cell: ({ cell, row }) => {
      if (!row.original?.knowledgeSources?.length) return <Spinner inline small />;
      return <StyledText>{cell.getValue()}</StyledText>;
    },
    size: 147,
    align: 'left',
    enableSorting: true,
    enableEditing: false,
    enableGlobalFilter: false,
  },
  {
    header: 'Last Updated',
    accessorFn: (row) => row.updatedAt,
    id: 'updatedAt',
    Cell: ({ cell, table }) =>
      renderTime({
        cell,
        table,
      }),
    size: 166,
    align: 'left',
    enableSorting: true,
    enableEditing: false,
    enableGlobalFilter: false,
  },
  {
    header: 'Created On',
    accessorFn: (row) => row.createdAt,
    id: 'createdAt',
    Cell: ({ cell, table }) =>
      renderTime({
        cell,
        table,
      }),
    size: 149,
    align: 'left',
    enableSorting: true,
    enableEditing: false,
    enableGlobalFilter: false,
  },
  {
    header: '',
    accessorKey: 'deleteById',
    id: 'deleteById',
    Cell: ({ row, table }) => (
      <>
        {renderRowHoverActionRelative({
          icon: <CustomTableIcons width={32} icon="REMOVE" />,
          onClick: () => table.options.meta.handleSingleDelete(row.original),
          toolTipTitle: 'Delete',
        })}
      </>
    ),
    ...rowHoverActionColumnProps(),
    size: 70,
    align: 'right',
    enableEditing: false,
  },
  {
    header: '',
    accessorKey: 'regenerateById',
    id: 'regenerateById',
    Cell: ({ row, table }) => (
      <>
        {renderRowHoverActionRelative({
          icon: <CustomTableIcons width={22} icon="REGENERATE" />,
          onClick: () => table.options.meta.handleRegenerateKnowledgeBase(row.original.knowledgeBaseId),
          toolTipTitle: 'Regenerate',
        })}
      </>
    ),
    ...rowHoverActionColumnProps(),
    size: 70,
    align: 'right',
    enableEditing: false,
  },
];

export const KNOWLEDGE_SOURCE_COLUMNS = [
  {
    header: 'Name',
    accessorFn: (row) => row.name,
    id: 'knowledgeSourceName',
    Cell: ({ cell, row, table }) =>
      renderKnowledgeSourceName({
        cell,
        row,
        table,
      }),
    size: 354,
    align: 'left',
    enableSorting: true,
    enableEditing: false,
    enableGlobalFilter: false,
  },
  {
    header: 'Value',
    accessorFn: (row) => {
      const { source, type } = row;
      switch (type) {
        case MODAL_TYPE.TEXT:
          return typeof source === 'string' ? JSON.parse(source).plainText : source.plainText;
        case MODAL_TYPE.WEBSITE:
          return typeof source === 'string' ? JSON.parse(source).url : source.url;
        case MODAL_TYPE.API:
          return typeof source === 'string' ? JSON.parse(source).url : source.url;
        case MODAL_TYPE.FILE:
          return typeof source === 'string' ? JSON.parse(source).fileId[0].name : source.fileId[0].name;
        default:
          return null;
      }
    },
    id: 'knowledgeSourceValue',
    Cell: ({ cell }) => <StyledText maxLines={3}>{cell.getValue() || '---'}</StyledText>,
    size: 447,
    align: 'left',
    enableSorting: false,
    enableEditing: false,
    enableGlobalFilter: false,
  },
  {
    header: 'Status',
    accessorFn: (row) => row.status,
    id: 'knowledgeSourceStatus',
    Cell: ({ cell }) => <StyledText maxLines={3}>{cell.getValue() || <StyledEmptyValue />}</StyledText>,
    size: 150,
    align: 'left',
    enableSorting: false,
    enableEditing: false,
    enableGlobalFilter: false,
  },
  {
    header: 'Type',
    accessorFn: (row) => row.type,
    id: 'knowledgeSourceType',
    Cell: ({ cell }) => <StyledText>{cell.getValue()}</StyledText>,
    size: 147,
    align: 'left',
    enableSorting: true,
    enableEditing: false,
    enableGlobalFilter: false,
  },
  {
    header: 'Last Updated',
    accessorFn: (row) => row.updatedAt,
    id: 'updatedAt',
    Cell: ({ cell, table }) =>
      renderTime({
        cell,
        table,
      }),
    size: 166,
    align: 'left',
    enableSorting: true,
    enableEditing: false,
    enableGlobalFilter: false,
  },
  {
    header: '',
    accessorKey: 'deleteById',
    id: 'deleteById',
    Cell: ({ row, table }) => (
      <>
        {renderRowHoverAction({
          icon: <CustomTableIcons width={32} icon="REMOVE" />,
          onClick: () => table.options.meta.handleSingleDelete(row.original),
          toolTipTitle: 'Delete',
        })}
      </>
    ),
    ...rowHoverActionColumnProps(),
    size: 70,
    align: 'right',
    enableSorting: false,
    enableEditing: false,
    enableGlobalFilter: false,
  },
];
