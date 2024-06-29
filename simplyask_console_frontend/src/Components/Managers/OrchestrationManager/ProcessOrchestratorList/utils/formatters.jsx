import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';

import { BASE_DATE_FORMAT, BASE_TIME_FORMAT, getInFormattedUserTimezone } from '../../../../../utils/timeUtil';
import { renderRowHoverAction, rowHoverActionColumnProps } from '../../../../Issues/utills/formatters';
import { getStringifiedEditorState } from '../../../../shared/REDISIGNED/controls/lexical/utils/helpers';
import CustomTableIcons from '../../../../shared/REDISIGNED/icons/CustomTableIcons';
import { StyledTooltip } from '../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import Spinner from '../../../../shared/Spinner/Spinner';
import {
  StyledEmptyValue, StyledFlex, StyledStatus, StyledText,
} from '../../../../shared/styles/styled';

const renderTime = ({
  cell,
  table,
}) => {
  const time = cell.getValue();
  const timezone = table.options.meta.user?.timezone;

  return (
    <StyledText
      size={15}
      weight={400}
      lh={22}
    >
      <StyledFlex>{getInFormattedUserTimezone(time, timezone, BASE_DATE_FORMAT)}</StyledFlex>
      <StyledFlex>{getInFormattedUserTimezone(time, timezone, BASE_TIME_FORMAT)}</StyledFlex>
    </StyledText>
  );
};

export const ORCHESTRATOR_GROUPS_COLUMNS = [
  {
    header: 'Orchestration Name',
    accessorFn: (row) => ({ name: row.name, id: row.id }),
    id: 'name',
    Cell: ({ cell, table }) => (
      <StyledFlex onClick={() => table.options.meta.handleNavigateToDetails(cell.getValue())} cursor="pointer">
        <StyledText size={15} weight={400} lh={21} maxLines={2} color="inherit">{cell.getValue().name}</StyledText>
        <StyledText size={13} weight={400} lh={18} color="inherit">
          #
          {cell.getValue().id}
        </StyledText>
      </StyledFlex>
    ),
    size: 400,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: false,
  },
  {
    header: 'Description',
    accessorFn: (row) => row.description,
    id: 'description',
    Cell: ({ cell }) => (
      <StyledText size={15} weight={400} lh={21} maxLines={3}>
        {getStringifiedEditorState(cell.getValue())}
      </StyledText>
    ),
    size: 210,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: false,
  },
  {
    header: 'Last Executed',
    accessorFn: (row) => row.lastExecutionDateTime,
    id: 'lastExecutionDateTime',
    Cell: renderTime,
    size: 225,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: true,
  },
  {
    header: 'Last Edited',
    accessorFn: (row) => row.updatedAt,
    id: 'updatedAt',
    Cell: renderTime,
    size: 225,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: true,
  },
  {
    header: 'Created On',
    accessorFn: (row) => row.createdAt,
    id: 'createdAt',
    Cell: renderTime,
    size: 150,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: true,
  },
  {
    header: 'Tags',
    accessorFn: (row) => ({
      tags: row.tags.reduce((acc, curr, index) => (index < 2 ? [...acc, curr] : acc), []),
      extraTags: row.tags.reduce((acc, curr, index) => (index >= 2 ? [...acc, curr] : acc), []),
      numOfExtraTags: row.tags.length > 2 ? row.tags.length - 2 : 0,
    }),
    id: 'tags',
    Cell: ({ cell, table }) => (cell.getValue().tags.length > 0
      ? (
        <StyledFlex direction="row" gap="0 12px" justifyContent="flex-start">
          {cell.getValue().tags.map((tag) => (
            <StyledStatus maxWidth="100px" key={tag} bgColor={table.options.meta.theme.colors.athensGray} height="36px" minWidth="0">
              <StyledText ellipsis size={13} weight={400} lh={18}>{tag}</StyledText>
            </StyledStatus>
          ))}
          {cell.getValue().numOfExtraTags > 0 && (
            <StyledTooltip
              title={(
                <StyledFlex direction="row" gap="12px" alignContent="center" alignItems="center" flexWrap="wrap">
                  {cell.getValue().extraTags.map((tag) => (
                    <StyledStatus overflow="hidden" key={tag} bgColor={table.options.meta.theme.colors.athensGray} height="36px">
                      <StyledText size={15} weight={400} lh={18}>{tag}</StyledText>
                    </StyledStatus>
                  ))}
                </StyledFlex>
              )}
              bgTooltip={table.options.meta.theme.colors.white}
              dropShadow={table.options.meta.theme.filters.dropShadows.whiteBgTooltip}
              maxWidth="484px"
              placement="top-start"
              arrow
            >
              <StyledStatus
                bgColor={table.options.meta.theme.colors.tealishBlue}
                hoverBgColor={table.options.meta.theme.colors.cyanBlue}
                height="36px"
                minWidth="0"
              >
                <StyledText size={15} weight={600} lh={30} color={table.options.meta.theme.colors.linkColor}>{`+${cell.getValue().numOfExtraTags}`}</StyledText>
              </StyledStatus>
            </StyledTooltip>
          )}
        </StyledFlex>
      )
      : <StyledEmptyValue />),
    size: 300,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: false,
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
    size: 30,
    align: 'right',
  },
  {
    header: '',
    accessorKey: 'manageTags',
    id: 'manageTags',
    Cell: ({ row, table }) => (
      <>
        {renderRowHoverAction({
          icon: <StyledFlex as="span" color={table.options.meta.theme.colors.primary}><SellOutlinedIcon fontSize="32px" color="inherit" /></StyledFlex>,
          onClick: () => table.options.meta.handleManageTags({ processId: row.original.id, tags: row.original.tags }),
          toolTipTitle: 'Manage Tags',
        })}
      </>
    ),
    ...rowHoverActionColumnProps(),
    size: 30,
    align: 'right',
  },
  {
    header: '',
    accessorKey: 'executeById',
    id: 'executeById',
    Cell: ({ row, table }) => (
      <>
        {renderRowHoverAction({
          icon: (
            <StyledFlex as="span" color={table.options.meta.theme.colors.primary}>
              {table.options.meta.isOrchestratorExecuting
                ? <Spinner extraSmall inline />
                : (
                  <StyledFlex as="span" color={table.options.meta.theme.colors.primary}>
                    <PlayCircleOutlinedIcon fontSize="32px" color="inherit" />
                  </StyledFlex>
                )}
            </StyledFlex>
          ),
          onClick: () => table.options.meta.handleSingleExecute(row.original.id),
          toolTipTitle: 'Execute',
        })}
      </>
    ),
    ...rowHoverActionColumnProps(),
    size: 30,
    align: 'right',
  },
];
