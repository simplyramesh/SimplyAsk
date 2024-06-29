import { useTheme } from '@mui/material/styles';
import React from 'react';

import CustomTableIcons from '../../../../../../../../shared/REDISIGNED/icons/CustomTableIcons';
import HeaderCell from '../../../../../../../../shared/REDISIGNED/table/components/HeaderCell/HeaderCell';
import { StyledTooltip } from '../../../../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { StyledText } from '../../../../../../../../shared/styles/styled';
import ParametersValueCell from '../ParametersValueCell';

export const PARAMETERS_HISTORY_COLUMNS = [
  {
    header: 'Parameter',
    accessorFn: (row) => row.title,
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell }) => (
      <StyledText size={16} lh={22} weight={600}>
        {cell.getValue()}
      </StyledText>
    ),
    id: 'info',
    enableGlobalFilter: false,
    enableSorting: false,
    minSize: 120,
    maxSize: 160,
  },
  {
    header: 'Initial Value',
    accessorFn: (row) => row.initialValue,
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell }) => <ParametersValueCell cell={cell} maxLines="5" lh="21" />,
    id: 'initialValue',
    enableGlobalFilter: false,
    enableSorting: false,
    maxSize: 140,
    minSize: 170,
  },
  {
    header: 'Modified Value',
    accessorFn: (row) => row.currentValue,
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ cell }) => <ParametersValueCell cell={cell} maxLines="5" lh="21" />,
    id: 'modifiedValue',
    enableGlobalFilter: false,
    enableSorting: false,
    maxSize: 140,
    minSize: 170,
  },
  {
    header: '',
    id: 'actions',
    align: 'center',
    accessorFn: (row) => row.id,
    Header: (props) => <HeaderCell {...props} />,
    Cell: ({ row, table }) => {
      const { colors } = useTheme();

      return (
        <StyledTooltip
          title="Revert Value"
          arrow
          placement="top"
          size="12px"
          lh="18px"
          p="4px 10px"
        >
          <CustomTableIcons
            icon="UNDO"
            display="inline-flex"
            width={14}
            padding="8px"
            radius="50%"
            bgColor={colors.tertiary}
            bgColorHover={colors.tertiaryHover}
            onClick={() => table.options.meta.onRevert(row?.original)}
          />
        </StyledTooltip>
      );
    },
    enableGlobalFilter: false,
    enableSorting: false,
    maxSize: 44,
    minSize: 44,
  },
];
