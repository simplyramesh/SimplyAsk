import { useState } from 'react';

import { renderRowHoverAction, rowHoverActionColumnProps } from '../../../../Issues/utills/formatters';
import CustomTableIcons from '../../../../shared/REDISIGNED/icons/CustomTableIcons';
import DateTimeCell from '../../../../shared/REDISIGNED/table-v2/TableCells/DateTimeCell/DateTimeCell';
import TextCell from '../../../../shared/REDISIGNED/table-v2/TableCells/TextCell/TextCell';
import { StyledCellHoverText, StyledFlex, StyledText } from '../../../../shared/styles/styled';

import { PARAMETERS_SET_SIDE_FILTER_KEY } from './constants';

export const parametersSetFormatter = (values) => {
  const sideFilter = values[PARAMETERS_SET_SIDE_FILTER_KEY];

  return {
    workflowsInUse: sideFilter?.workflowsInUse || '',
    associatedEnvs: sideFilter?.associatedEnvs || '',
    updatedAfter: sideFilter?.lastUpdated?.filterValue?.startDateAfter || '',
    updatedBefore: sideFilter?.lastUpdated?.filterValue?.startDateBefore || '',
    timezone: values.timezone || '',
  };
};

export const selectedParametersSetFiltersMeta = {
  key: PARAMETERS_SET_SIDE_FILTER_KEY,
  formatter: {
    lastUpdated: ({ v, k }) => ({
      label: 'Last Updated',
      value: v?.label || '',
      k,
    }),
  },
};

const WorkflowCell = ({ row, arrayName }) => {
  const [showAllWorkflows, setShowAllWorkflows] = useState(false);
  const handleToggleWorkflows = () => setShowAllWorkflows(!showAllWorkflows);

  const renderWorkflows = () => {
    const param = row.original[arrayName];

    const workflowsToDisplay = param.length <= 2 || showAllWorkflows ? param : param.slice(0, 2);

    const values = workflowsToDisplay.map((workflow) => <StyledText key={workflow}>{workflow}</StyledText>);

    return (
      <>
        {values}
        {param.length > 2 && (
          <StyledText color="blue" size={12} onClick={handleToggleWorkflows} cursor="pointer">
            {showAllWorkflows ? 'Show Less' : `+ ${param.length - 2} more`}
          </StyledText>
        )}
      </>
    );
  };

  return <StyledFlex>{renderWorkflows()}</StyledFlex>;
};

const renderParametersSetName = ({ row, table, cell }) => (
  <StyledCellHoverText pointer>
    <StyledText
      color="inherit"
      maxLines={3}
      onClick={() => {
        table.options.meta.onNameClick(row);
      }}
    >
      {cell.getValue()}
    </StyledText>
  </StyledCellHoverText>
);

export const PARAMETER_SET_COLUMNS_SCHEMA = [
  {
    header: 'Parameter Name',
    accessorFn: (row) => row.name,
    id: 'name',
    Cell: renderParametersSetName,
    size: 268,
    enableSorting: true,
  },
  {
    header: 'Description',
    accessorFn: (row) => row.description,
    id: 'description',
    Cell: (props) => <TextCell maxLines={3} {...props} />,
    size: 147,
    enableSorting: false,
  },
  {
    header: 'Number of Parameters',
    accessorFn: (row) => row.defaultParameters,
    id: 'defaultParameters',
    Cell: ({ cell }) => <StyledText>{cell.getValue().length}</StyledText>,
    size: 236,
    enableSorting: true,
  },
  {
    header: 'Used By',
    accessorFn: (row) => row.associatedWorkflows,
    id: 'associatedWorkflows',
    Cell: ({ row }) => <WorkflowCell row={row} arrayName="associatedWorkflows" />,
    size: 236,
    enableSorting: false,
  },
  {
    header: 'Associated Environments',
    accessorFn: (row) => row.associatedEnvironments,
    id: 'associatedEnvironments',
    Cell: ({ row }) => <WorkflowCell row={row} arrayName="associatedEnvironments" />,

    size: 236,
    enableSorting: true,
  },
  {
    header: 'Last Updated',
    accessorFn: (row) => row.lastUpdatedAt,
    id: 'lastUpdatedAt',
    Cell: ({ cell, table }) => <DateTimeCell cell={cell} table={table} />,
    size: 175,
    enableSorting: true,
  },
  {
    header: '',
    id: 'delete',
    Cell: ({ table, row }) =>
      renderRowHoverAction({
        icon: <CustomTableIcons icon="BIN" width={25} />,
        onClick: (event) => table.options.meta?.onDeleteIcon(row.original),
        toolTipTitle: 'Delete',
      }),
    ...rowHoverActionColumnProps(),
  },
];
