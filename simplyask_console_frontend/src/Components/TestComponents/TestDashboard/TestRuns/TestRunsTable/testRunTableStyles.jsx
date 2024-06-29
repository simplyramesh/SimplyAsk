import { TEST_RUN_COLUMN_KEYS } from '../utils/helpers';

export const displayTableStyles = {
  muiTablePaperProps: {
    sx: {
      boxShadow: 'none',
      backgroundColor: 'transparent',
      fontFamily: 'Montserrat',
      fontStyle: 'normal',
    },
  },
  muiTableProps: {
    sx: ({ borders }) => ({
      border: borders.table.default,
      borderCollapse: 'initial',
      borderSpacing: '0px',
    }),
  },
  muiTableHeadProps: {
    sx: {
      opacity: 1,
      // position: 'sticky',
      // top: '0px',
      // zIndex: 2,
      // '::-webkit-scrollbar': {
      //   width: '6px',
      // },
    },
  },
  muiTableHeadRowProps: ({ headerGroup }) => {
    return {
      sx: ({ borders }) => ({
        boxShadow: 'none',
        borderBottom: headerGroup.depth === 1 ? borders.table.separator : borders.table.default,
      }),
    };
  },
  muiTableBodyRowProps: {
    sx: ({ colors }) => ({
      '&.MuiTableRow-hover:hover': {
        backgroundColor: colors.white,
      },
    }),
  },
  muiTableBodyCellProps: ({ table, row, cell }) => {
    const { rows } = table.getRowModel();

    const isEnvironmentStatusCell = cell.column?.parent?.id === 'environmentStatus';
    const isEnvPassFail = cell.getValue() === 'PASS' || cell.getValue() === 'FAIL';

    const isCellValueNull = cell.getValue() == null || (isEnvironmentStatusCell && !isEnvPassFail);

    const subRowsLastRowIds = rows.reduce((acc, r) => (r.depth === 0
      ? [...acc, `${r.id}.${r.subRows.length - 1}`]
      : acc), []);

    const determineCellPadding = (cell) => {
      switch (cell.column.id) {
      case 'testCases':
        return '8px 20px';
      case TEST_RUN_COLUMN_KEYS.TEST_CASE_COMMENT:
        return '6px 18px';
      default:
        return '22px 0px';
      }
    };
    const determineCellHoverState = (cell, { borders, colors }) => {
      if (isCellValueNull) return {};

      switch (cell.column.id) {
      case 'testCases':
        return {
          backgroundColor: colors.white,
        };
      case TEST_RUN_COLUMN_KEYS.TEST_CASE_COMMENT:
        return {
          backgroundColor: colors.tableEditableCellBg,
        };
      default:
        return {
          backgroundColor: colors.white,
          cursor: 'pointer',
          zIndex: 2,
          '&:before': borders.table.cell.hover,
        };
      }
    };

    return {
      sx: ({ borders, colors }) => ({
        position: 'relative',
        display: row.depth !== 0 ? 'table-cell' : 'none',
        borderRight: cell.column.id !== TEST_RUN_COLUMN_KEYS.TEST_CASE_COMMENT ? borders.table.default : 'none',
        borderBottom: subRowsLastRowIds.includes(row.id) ? borders.table.separator : borders.table.default,
        padding: determineCellPadding(cell),
        backgroundColor: cell.column.id === TEST_RUN_COLUMN_KEYS.TEST_CASE_COMMENT ? colors.background : colors.white,

        '& .Mui-TableHeadCell-Content': {
          justifyContent: 'center',
        },

        '& div span svg': {
          display: 'none',
        },

        '&:hover': {
          ...determineCellHoverState(cell, { borders, colors }),
          '& div span svg': {
            display: isCellValueNull ? 'none' : 'block',
          },
        },

        '&:focus-within': {
          backgroundColor: colors.background,
          zIndex: 2,
          '&:before': borders.table.cell.hover,
          '&:hover': {
            backgroundColor: colors.background,
          },
        },
      }),
      colSpan: 0,
      rowSpan: row.getLeafRows().length + 1,
      onClick: () => {
        if (cell.column.id === TEST_RUN_COLUMN_KEYS.TEST_CASE_COMMENT) table.setEditingCell(cell);

        !isCellValueNull && isEnvironmentStatusCell && table.options.meta.onNavigate({ row, cell, table });
      },
    };
  },
  muiTableHeadCellColumnActionsButtonProps: { sx: { display: 'none' } },
  muiTopToolbarProps: { sx: { display: 'none' } },
  muiExpandAllButtonProps: { sx: { display: 'none' } },
  muiExpandButtonProps: { sx: { display: 'none' } },
  muiBottomToolbarProps: { sx: { display: 'none' } },
};
