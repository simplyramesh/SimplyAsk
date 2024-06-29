import { renderRowHoverAction, rowHoverActionColumnProps } from '../../../../Issues/utills/formatters';
import BaseTextInput from '../../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';
import CustomTableIcons from '../../../../shared/REDISIGNED/icons/CustomTableIcons';
import TrashBinIcon from '../../../../shared/REDISIGNED/icons/svgIcons/TrashBinIcon';
import CustomSelect from '../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import EditableCell from '../../../../shared/REDISIGNED/table-v2/TableCells/EditableCell/EditableCell';
import TextCell from '../../../../shared/REDISIGNED/table-v2/TableCells/TextCell/TextCell';
import { StyledFlex, StyledIconButton, StyledText } from '../../../../shared/styles/styled';
import FormErrorMessage from '../../../AccessManagement/components/FormErrorMessage/FormErrorMessage';

const environmentNameTableRowClick = {
  muiTableBodyCellProps: ({ row, table }) => ({
    onClick: () => table.options.meta.onTableRowClick?.(row.original),
    sx: {
      padding: '10px 35px',
      '&:hover': {
        cursor: 'pointer',
        textDecoration: 'underline',
      },
    },
  }),
};

export const ENVIRONMENTS_COLUMNS_MODEL = [
  {
    header: 'Environment Name',
    accessorKey: 'envName',
    id: 'envName',
    Cell: ({ row, cell, table }) => (
      <EditableCell cell={cell} table={table}>
        <StyledText color="inherit" maxLines={3} size={15}>
          {row.original.envName}
        </StyledText>
      </EditableCell>
    ),
    size: 380,
    minSize: 380,
    align: 'left',
    enableSorting: true,
    ...environmentNameTableRowClick,
  },
  {
    header: 'Description',
    accessorKey: 'description',
    id: 'description',
    Cell: (props) => <TextCell {...props} maxLines={3} />,
    size: 690,
    maxSize: 690,
    align: 'left',
    enableGlobalFilter: false,
    enableSorting: false,
    enableEditing: false,
  },
  {
    header: '',
    accessorKey: 'deleteById',
    id: 'deleteById',
    Cell: ({ row, table }) => (
      <>
        {renderRowHoverAction({
          icon: <CustomTableIcons width={32} icon="REMOVE" />,
          onClick: () => table.options.meta.deleteRow(row.original),
          toolTipTitle: 'Delete',
        })}
      </>
    ),
    ...rowHoverActionColumnProps(),
    size: 30,
    align: 'right',
  },
];

const renderNameCell = ({ cell, table, row }) => {
  const error = table.options.meta.validationErrors?.defaultParameters?.[row.index]?.name;
  const isTouched = table.options.meta.touchedFields?.defaultParameters?.[row.index]?.name;

  const showError = !!(error && isTouched);

  return (
    <StyledFlex position="relative" p="24px 0">
      <BaseTextInput
        value={cell.getValue()}
        onChange={(e) => table.options.meta.onParamChange(row, 'name', e.target.value)}
        invalid={showError}
      />
      {showError && (
        <StyledFlex position="absolute" bottom="0">
          <FormErrorMessage>{error}</FormErrorMessage>
        </StyledFlex>
      )}
    </StyledFlex>
  );
};

const renderTypeCell = ({ row, table, cell }) => {
  const options = table.options.meta.typesOptions;
  const value = options.find((option) => option.value === cell.getValue()) || null;

  return (
    <CustomSelect
      options={options}
      value={value}
      onChange={(e) => {
        table.options.meta.onParamChange(row, 'type', e.value);
      }}
      getOptionValue={({ value }) => value}
      form
      menuPortalTarget={document.body}
      menuPlacement="auto"
      closeMenuOnSelect
      isClearable={false}
      isSearchable={false}
    />
  );
};

const renderValueCell = ({ cell, table, row }) => {
  const error = table.options.meta.validationErrors?.defaultParameters?.[row.index]?.value;
  const isTouched = table.options.meta.touchedFields?.defaultParameters?.[row.index]?.value;

  const showError = !!(error && isTouched);

  return (
    <StyledFlex position="relative" p="24px 0">
      <BaseTextInput
        value={cell.getValue()}
        onChange={(e) => table.options.meta.onParamChange(row, 'value', e.target.value)}
        invalid={showError}
      />

      {showError && (
        <StyledFlex position="absolute" bottom="0">
          <FormErrorMessage>{error}</FormErrorMessage>
        </StyledFlex>
      )}
    </StyledFlex>
  );
};

const renderDeleteCell = ({ row, table }) => (
  <StyledIconButton
    size="34px"
    iconSize="22px"
    disabled={table.options.data.length <= 1}
    onClick={() => table.options.meta.onParamDelete(row)}
  >
    <TrashBinIcon />
  </StyledIconButton>
);

export const ENVIRONMENT_PARAMETERS_COLUMNS_MODEL = [
  {
    header: 'Parameter Name',
    accessorKey: 'name',
    id: 'name',
    Cell: renderNameCell,
    size: 360,
    enableSorting: false,
  },
  {
    header: 'Data Type',
    accessorKey: 'type',
    id: 'type',
    Cell: renderTypeCell,
    size: 280,
    enableSorting: false,
  },
  {
    header: 'Default Value',
    isOptional: true,
    accessorKey: 'value',
    id: 'value',
    Cell: renderValueCell,
    size: 420,
    enableSorting: false,
  },
  {
    header: '',
    accessorKey: 'actions',
    id: 'actions',
    Cell: renderDeleteCell,
    size: 52,
    enableSorting: false,
    align: 'right',
  },
];

export const ENVIRONMENT_SPECIFIC_PARAMETERS_COLUMNS_MODEL = [
  {
    header: 'Environment',
    accessorKey: 'envName',
    id: 'envName',
    Cell: (props) => <TextCell {...props} />,
    size: 360,
    enableSorting: false,
  },
  {
    header: 'Number of Overwritten Values',
    accessorFn: (row) => row.overwrittenValues?.length || 0,
    id: 'numberOfOverwrittenValues',
    Cell: (props) => <TextCell {...props} />,
    size: 280,
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
          onClick: () => table.options.meta.onEnvironmentDelete(row),
          toolTipTitle: 'Delete',
        })}
      </>
    ),
    ...rowHoverActionColumnProps(),
    size: 30,
    align: 'right',
  },
];
