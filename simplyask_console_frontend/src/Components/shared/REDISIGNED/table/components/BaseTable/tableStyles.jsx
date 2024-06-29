export const tableStyles = {
  muiTablePaperProps: {
    sx: {
      boxShadow: 'none',
      backgroundColor: 'transparent',
      fontFamily: 'Montserrat',
      fontStyle: 'normal',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
  },
  muiTableContainerProps: {
    sx: {

    },
  },
  muiTableProps: {
    sx: {
      tableLayout: 'fixed',
    },
  },
  muiTableHeadRowProps: {
    sx: {
      boxShadow: 'none',
      backgroundColor: '#FFFFFF',
    },
  },
  muiTableHeadCellProps: ({ column }) => ({
    align: column.columnDef.align ?? 'left',
    sx: {
      paddingTop: '14px',
      paddingBottom: '18px',
      paddingLeft: '10px',

      borderBottom: '1px solid #2D3A47',

      backgroundColor: '#FFFFFF',

      fontSize: '16px',
      lineHeight: '27px',
      fontFamily: 'Montserrat',
      fontWeight: '600',
      fontStyle: 'normal',
      color: '#2D3A47',

      '& .MuiTableSortLabel-root': {
        display: 'none',
      },
    },
  }),
  muiTableBodyRowProps: {
    sx: {
      '&.MuiTableRow-hover:hover': {
        backgroundColor: '#FFFFFF',
      },
    },
  },
  muiTableBodyCellProps: ({ column }) => ({
    align: column.columnDef.align ?? 'left',
    sx: {
      padding: '10px',

      color: '#2D3A47',
      fontFamily: 'Montserrat',
      fontStyle: 'normal',
      cursor: 'default',

      borderBottom: '1px solid #D8D8D8',
    },
  }),
};
