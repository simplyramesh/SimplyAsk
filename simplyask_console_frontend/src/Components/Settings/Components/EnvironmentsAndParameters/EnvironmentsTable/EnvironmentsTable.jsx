import { AddRounded } from '@mui/icons-material';
import React, { useState } from 'react';

import { useDeleteEnvironment } from '../../../../../hooks/environments/useDeleteEnvironment';
import { GET_TEST_ENVIRONMENTS_QUERY_KEY } from '../../../../../hooks/environments/useGetEnvironments';
import { useTableSortAndFilter } from '../../../../../hooks/useTableSortAndFilter';
import { getEnvironments } from '../../../../../Services/axios/environment';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import TableV2 from '../../../../shared/REDISIGNED/table-v2/Table-v2';
import { StyledFlex } from '../../../../shared/styles/styled';
import { ENVIRONMENTS_PAGE_SIZE } from '../constants/constants';
import { ENVIRONMENTS_COLUMNS_MODEL } from '../constants/formatters';
import CreateAndEditEnvironmentsModal from '../modals/CreateAndEditEnvironmentsModal';
import EnvironmentDeleteModal from '../modals/EnvironmentDeleteModal';

const EnvironmentsTable = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteEnv, setDeleteEnv] = useState(null);
  const [openEnvironmentModal, setOpenEnvironmentModal] = useState(null);
  const [clickedTableRow, setClickedTableRow] = useState(null);

  const createEnvironmentButton = () => (
    <StyledFlex direction="row" gap="0 15px">
      <StyledButton
        variant="contained"
        tertiary
        startIcon={<AddRounded />}
        onClick={() => setOpenEnvironmentModal(true)}
      >
        Create Environment
      </StyledButton>
    </StyledFlex>
  );

  const { deleteEnvironment, isLoading: isDeleting } = useDeleteEnvironment();
  const { setSearchText, pagination, setPagination, sorting, setSorting, data, isFetching, refetch } =
    useTableSortAndFilter({
      queryFn: getEnvironments,
      queryKey: GET_TEST_ENVIRONMENTS_QUERY_KEY,
      pageSize: ENVIRONMENTS_PAGE_SIZE,
      initialSorting: [
        {
          id: 'updatedAt',
          desc: true,
        },
      ],
    });

  const onDeleteRow = (row) => {
    setIsDeleteModalOpen(true);
    setDeleteEnv(row);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteEnv(null);
  };

  return (
    <>
      <TableV2
        data={data}
        columns={ENVIRONMENTS_COLUMNS_MODEL}
        title="Environments"
        searchPlaceholder="Search Environment Names..."
        onSearch={(e) => setSearchText(e.target.value)}
        headerActions={createEnvironmentButton()}
        enableShowFiltersButton={false}
        enableRowSelection={false}
        isEmbedded
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        isLoading={isFetching || isDeleting}
        meta={{
          deleteRow: (row) => onDeleteRow(row),
          onTableRowClick: (row) => {
            setClickedTableRow(row);
            setOpenEnvironmentModal(true);
          },
        }}
        pinRowHoverActionColumns={['deleteById']}
        onTableRefresh={refetch}
      />

      <CreateAndEditEnvironmentsModal
        openEnvironmentModal={openEnvironmentModal}
        setOpenEnvironmentModal={setOpenEnvironmentModal}
        setClickedTableRow={setClickedTableRow}
        clickedTableRow={clickedTableRow}
      />

      <EnvironmentDeleteModal
        open={isDeleteModalOpen}
        name={deleteEnv?.envName}
        onClose={() => closeDeleteModal()}
        onDelete={() => {
          deleteEnvironment(deleteEnv?.id);
          closeDeleteModal();
        }}
      />
    </>
  );
};

export default EnvironmentsTable;
