import { AddRounded } from '@mui/icons-material';
import React from 'react';

import { StyledButton } from '../../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomTableIcons from '../../../../../../../shared/REDISIGNED/icons/CustomTableIcons';
import { ComponentsConfiguration } from '../../../../../../../shared/REDISIGNED/table-v2/BaseTable/BaseTable';
import TableV2 from '../../../../../../../shared/REDISIGNED/table-v2/Table-v2';
import { StyledFlex, StyledText } from '../../../../../../../shared/styles/styled';

const DefineExecutionFormEntryTable = ({
  data,
  columns,
  pagination,
  setPagination,
  tableMeta,
  isLoading,
  tableRef,
  setDefineExecutionDetailsSideBarOpen,
  colors,
}) => {
  const renderHeaderActions = () => (
    <StyledFlex direction="row" gap="0 15px">
      <StyledButton
        variant="contained"
        secondary
        startIcon={<AddRounded color={colors.white} />}
        onClick={() => { setDefineExecutionDetailsSideBarOpen(true); }}
      >
        Define Execution

      </StyledButton>
    </StyledFlex>
  );

  const renderEmptyDefineProcessTable = () => (
    <StyledFlex gap="18px" flex="1" alignItems="center" justifyContent="center" mt="10vh" mb="10vh">
      <CustomTableIcons icon="EMPTY" width={88} />
      <StyledFlex width="290px" alignItems="center" justifyContent="center">
        <StyledText as="h3" size={18} lh={22} weight={600} mb={12} textAlign="center">
          No Executions Defined
        </StyledText>
        <StyledText
          as="p"
          size={16}
          weight={400}
          lh={21}
          textAlign="center"
        >
          There are currently no executions. Click the "Define Execution" button to specify the input data for one or more Process Executions.
        </StyledText>
      </StyledFlex>
    </StyledFlex>
  );

  return (
    <TableV2
      data={data}
      columns={columns}
      entityName="Executions"
      pagination={pagination}
      setPagination={setPagination}
      headerActions={renderHeaderActions()}
      enableSearch={false}
      enableShowFiltersButton={false}
      enableRowSelection={false}
      meta={tableMeta}
      isLoading={isLoading}
      pinRowHoverActionColumns={['update', 'delete']}
      isEmbedded
      tableRef={tableRef}
      tableProps={{
        manualPagination: false,
        enablePagination: true,
        enableRowNumbers: true,
        renderEmptyRowsFallback: () => renderEmptyDefineProcessTable(),
        muiTableContainerProps: {
          sx: () => ({
            maxHeight: '1500px',
          }),
        },
        displayColumnDefOptions: {
          'mrt-row-numbers': {
            Header: () => <StyledText size={15} weight={600}>List No.</StyledText>,
            size: 115,
            ...ComponentsConfiguration,
          },
        },
      }}
    />
  );
};

export default DefineExecutionFormEntryTable;
