import { useTheme } from '@mui/material/styles';
import { useEffect, useMemo, useState } from 'react';
import Select, { components } from 'react-select';

import CustomScrollbar from '../../../../../shared/REDISIGNED/layouts/CustomScrollbar/CustomScrollbar';
import BaseTable from '../../../../../shared/REDISIGNED/table/components/BaseTable/BaseTable';

const CustomTableMenuComponent = ({
  children,
  options,
  selectProps,
  selectOption,
  hasValue,
  maxMenuHeight,
  ...props
}) => {
  const { colors } = useTheme();

  const [rowSelection, setRowSelection] = useState({ [selectProps?.value]: true });

  const columns = useMemo(() => selectProps?.columns ?? [], []);

  const rowIdKey = selectProps?.valueKey;

  useEffect(() => {
    if (!hasValue) {
      const rowId = options.find((option) => option[rowIdKey])?.[rowIdKey];

      setRowSelection({ [rowId]: true });
    }

    if (hasValue) setRowSelection({ [selectProps?.value?.[rowIdKey]]: true });
  }, [hasValue, selectProps?.value]);

  const handleSelectRow = (row) => {
    selectOption({
      ...row.original,
      removeIds: options.reduce((acc, option) => (option[rowIdKey] !== row.id
        ? [...acc, option[rowIdKey]]
        : acc), []),
    });
    setRowSelection({ [row.id]: true });
    row.getToggleSelectedHandler();
  };

  return (
    <components.Menu {...props}>
      <CustomScrollbar
        autoHeight
        autoHeightMax={maxMenuHeight}
        thumbWidth="4px"
        thumbColor={colors.timberwolfGray}
        radius="10px"
      >
        <BaseTable
          columns={columns}
          data={options}
          enableMultiRowSelection={false} // shows radio buttons instead of checkboxes
          enableRowSelection
          enableStickyHeader
          enableBottomToolbar={false}
          getRowId={(row) => row[rowIdKey]}
          onRowSelectionChange={(row) => setRowSelection(row)}
          state={{ rowSelection }}
          displayColumnDefOptions={{
            'mrt-row-select': {
              header: '',
              size: 20,
              muiTableHeadCellProps: {
                sx: ({ borders }) => ({
                  textAlign: 'left',
                  borderBottom: borders.table.separator,
                }),
              },
            },
          }}
          muiTableBodyRowProps={({ row }) => ({
            onClick: () => handleSelectRow(row),
            sx: {
              cursor: 'pointer',
              backgroundColor: 'transparent',
              '&.MuiTableRow-hover:hover': {
                backgroundColor: 'transparent',
                cursor: 'pointer',
              },
              '&.Mui-selected': {
                backgroundColor: 'transparent',
              },
              '&.Mui-selected:hover': {
                backgroundColor: 'transparent',
              },

            },
          })}
          muiSelectCheckboxProps={({ row }) => ({
            sx: ({ colors }) => ({
              color: colors.primary,
              '& .MuiTouchRipple-root': {
                display: 'none',
              },
              '&.MuiRadio-root:hover': {
                backgroundColor: 'transparent',
              },
              '&.Mui-checked': {
                color: colors.secondary,
              },
              '& .MuiSvgIcon-root': {
                width: '20px',
                height: '20px',
              },
            }),
            onClick: () => handleSelectRow(row),
          })}
          muiTableBodyCellProps={{
            sx: {
              cursor: 'pointer',
              padding: '12px',
            },
          }}
          muiTableHeadCellProps={{
            sx: ({ borders }) => ({
              borderBottom: borders.table.separator,
              paddingTop: '10px',
              paddingBottom: '10px',
              padding: '10px',
              textAlign: 'left',
            }),
          }}
        />
      </CustomScrollbar>
    </components.Menu>
  );
};

export default CustomTableMenuComponent;

CustomTableMenuComponent.propTypes = Select.propTypes;
