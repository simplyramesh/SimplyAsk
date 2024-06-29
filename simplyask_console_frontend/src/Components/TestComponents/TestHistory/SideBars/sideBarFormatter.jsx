import { renderCellText } from '../../../Issues/utills/formatters';
import { TEST_CASE_EXECUTION_STATUS } from '../../../Managers/TestManager/constants/constants';
import { STATUSES_COLORS, STATUSES_COLORS_OPTIONS } from '../../../Settings/Components/FrontOffice/constants/iconConstants';
import { StyledStatus, StyledText } from '../../../shared/styles/styled';

const tableRowClick = {
  muiTableBodyCellProps: ({ row, table }) => ({
    onClick: () => table.options.meta.onTableRowClick?.(row.original),
    sx: {
      '&:hover': {
        cursor: 'pointer',
      },
    },
  }),
};

export const renderCorrectExecutionNames = (executionStatus) => {
  switch (executionStatus) {
  case TEST_CASE_EXECUTION_STATUS.EXECUTING:
    return { name: 'Executing', color: STATUSES_COLORS.YELLOW };
  case TEST_CASE_EXECUTION_STATUS.DONE:
    return { name: 'Passed', color: STATUSES_COLORS.GREEN };
  case TEST_CASE_EXECUTION_STATUS.FAILED:
    return { name: 'Failed', color: STATUSES_COLORS.RED };
  case TEST_CASE_EXECUTION_STATUS.FINALIZING:
    return { name: 'Finalizing', color: STATUSES_COLORS.BLUE };
  case TEST_CASE_EXECUTION_STATUS.STOPPED:
    return { name: 'Canceled', color: STATUSES_COLORS.GRAY };
  default:
    return { name: 'Preparing', color: STATUSES_COLORS.BLUE };
  }
};
export const TEST_CASE_SIDEBAR_COLUMNS = [
  {
    header: 'Name',
    accessorFn: (row) => row.displayName,
    id: 'displayName',
    Cell: ({ cell }) => renderCellText({ text: cell.getValue() }),
    size: 260,
    align: 'left',
    ...tableRowClick,
    enableSorting: true,
  },
  {
    header: 'Status',
    accessorFn: (row) => row.testCaseExecutionStatus,
    id: 'testExecutionStatus',
    Cell: ({ cell }) => {
      const { name, color } = renderCorrectExecutionNames(cell.getValue());
      const colorOption = STATUSES_COLORS_OPTIONS[color];

      return (
        <StyledStatus height="34px" minWidth="auto" textColor={colorOption.primary} bgColor={colorOption.secondary}>
          {name}
        </StyledStatus>
      );
    },
    size: 260,
    enableSorting: false,
    align: 'left',
    ...tableRowClick,
  }];

export const TEST_SUITE_SIDEBAR_COLUMNS = [
  {
    header: 'Name',
    accessorFn: (row) => row.displayName,
    id: 'displayName',
    Cell: ({ cell }) => renderCellText({ text: cell.getValue() }),
    size: 220,
    align: 'left',
    ...tableRowClick,
    enableSorting: true,
  },
  {
    header: 'Count',
    accessorFn: (row) => row.testCaseCount,
    id: 'testCaseCount',
    Cell: ({ cell }) => renderCellText({ text: cell.getValue() }),
    size: 160,
    align: 'left',
    ...tableRowClick,
    enableSorting: true,
  },
  {
    header: 'Status',
    accessorFn: (row) => row.status,
    id: 'testExecutionStatus',
    Cell: ({ cell, row }) => {
      const { name, color } = renderCorrectExecutionNames(cell.getValue());
      const colorOption = STATUSES_COLORS_OPTIONS[color];
      return (
        <>
          <StyledStatus height="34px" minWidth="auto" textColor={colorOption.primary} bgColor={colorOption.secondary}>
            {name}
          </StyledStatus>
          {row.original.status === 'DONE' && row.original.testCaseCount > 0 ? (
            <StyledText weight={600}>
              {Math.floor(row.original.testCaseCount / row.original.testCasePass) * 100}
              {' '}
              %
            </StyledText>
          ) : null}
        </>
      );
    },
    size: 160,
    enableSorting: false,
    align: 'left',
    ...tableRowClick,
  }];
