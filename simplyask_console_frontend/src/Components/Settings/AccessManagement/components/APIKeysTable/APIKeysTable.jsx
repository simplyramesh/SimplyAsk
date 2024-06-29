import { useTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { useTableSortAndFilter } from '../../../../../hooks/useTableSortAndFilter';
import {
  deleteAPIKey,
  editAPIKeyName,
  generateAPIKey,
  listAPIKeys,
  setDefaultAPIKey,
} from '../../../../../Services/axios/apiKeys';
import tableEmptyAdapter from '../../../../shared/REDISIGNED/table/components/TableEmpty/helpers/tableEmptyAdapter';
import PageableTableHeader from '../../../../shared/REDISIGNED/table/components/TableHeader/PageableTableHeader';
import PageableTable, { DEFAULT_PAGINATION } from '../../../../shared/REDISIGNED/table/PageableTable';
import SearchBar from '../../../../shared/SearchBar/SearchBar';
import { StyledCard, StyledFlex, StyledText } from '../../../../shared/styles/styled';
import DefaultAPIKeyModal from '../modals/formModals/APIKeys/DefaultAPIKey/DefaultAPIKeyModal';
import DeleteDefaultKeyConfirmModal from '../modals/formModals/APIKeys/DeleteDefaultKeyConfirm/DeleteDefaultKeyConfirmModal';
import DeleteKeyConfirmModal from '../modals/formModals/APIKeys/DeleteKeyConfirm/DeleteKeyConfirm';
import EditAPIKeyModal from '../modals/formModals/APIKeys/EditAPIKey/EditAPIKeyModal';
import GenerateAPIKeyModal from '../modals/formModals/APIKeys/GenerateAPIKey/GenerateAPIKeyModal';
import APIKeyDetailsModal from '../modals/sideModals/APIKeyDetailsModal';
import { getAPIKeysColumns } from './utils/APIKeysTableColumnsFormatter';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomTableIcons from '../../../../shared/REDISIGNED/icons/CustomTableIcons';

const APIKeysTable = () => {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openDefaultKeyModal, setOpenDefaultKeyModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteDefaultKey, setIsDeleteDefaultKey] = useState(false);
  const [isActionPerforming, setIsActionPerforming] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [viewAPIKey, setViewAPIKey] = useState(null);
  const [keyToUpdate, setKeyToUpdate] = useState(null);
  const { colors } = useTheme();

  const {
    pagination,
    setPagination,
    sorting,
    setSearchText,
    setSorting,
    data,
    isLoading,
    isFetching,
    refetch: refetchAPIKeys,
  } = useTableSortAndFilter({
    queryFn: listAPIKeys,
    queryKey: ['listAPIKeys'],
    pageSize: DEFAULT_PAGINATION.PAGE_SIZE,
    pageIndex: DEFAULT_PAGINATION.PAGE_NUMBER,
  });

  useEffect(() => {
    const loadingIndicators = [isLoading, isFetching, isActionPerforming];

    setIsTableLoading(loadingIndicators.some(Boolean));
  }, [isLoading, isFetching, isActionPerforming]);

  const { data: defaultKeys, refetch: refetchDefaultKey } = useQuery({
    queryKey: ['getDefaultAPIKey'],
    queryFn: () => listAPIKeys('isDefault=true'),
  });

  const { mutateAsync: generateKey } = useMutation({
    mutationFn: (name) => generateAPIKey(name),
    onSuccess: () => onMutationSuccess(),
    onError: () => onMutationError(),
  });

  const { mutateAsync: deleteKey } = useMutation({
    mutationFn: (id) => deleteAPIKey(id),
    onSuccess: () => onMutationSuccess(),
    onError: () => onMutationError(),
  });

  const { mutateAsync: setDefaultKey } = useMutation({
    mutationFn: (id) => setDefaultAPIKey(id),
    onSuccess: () => onMutationSuccess(),
    onError: () => onMutationError(),
  });

  const { mutateAsync: editKeyName } = useMutation({
    mutationFn: ({ id, name }) => editAPIKeyName(id, name),
    onSuccess: () => onMutationSuccess(),
    onError: () => onMutationError(),
  });

  const onMutationSuccess = async () => {
    Promise.all([refetchAPIKeys(), refetchDefaultKey()]).finally(() => setIsActionPerforming(false));
  };

  const onMutationError = () => {
    toast.error('Something went wrong');
    setIsActionPerforming(false);
  };

  const onCreateSubmit = async (formValues) => {
    try {
      setIsActionPerforming(true);
      await generateKey(formValues.name);
    } finally {
      setOpenCreateModal(false);
    }
  };

  const onActionDelete = ({ original: key }) => {
    setKeyToUpdate(key);

    if (key.default) {
      setIsDeleteDefaultKey(true);
    } else {
      setIsDeleteModalOpen(true);
    }
  };

  const onActionEdit = (key) => {
    setKeyToUpdate(key.original);
    setOpenEditModal(true);
  };

  const onDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setKeyToUpdate(null);
  };

  const onDefaultDeleteModalClose = () => {
    setIsDeleteDefaultKey(false);
    setKeyToUpdate(null);
  };

  const onDeleteModalSubmit = async () => {
    try {
      setIsActionPerforming(true);
      await deleteKey(keyToUpdate.id);
    } finally {
      onDeleteModalClose();
    }
  };

  const onDeleteDefaultModalSubmit = async ({ isLast, id, name }) => {
    try {
      setIsActionPerforming(true);

      if (isLast) {
        await deleteKey(keyToUpdate.id);
        await generateKey(name);
      } else {
        await setDefaultKey(id);
        await deleteKey(keyToUpdate.id);
      }
    } finally {
      onDefaultDeleteModalClose();
    }
  };

  const onSetDefaultSubmit = async (formValues) => {
    try {
      setIsActionPerforming(true);
      await setDefaultKey(formValues.id);
    } finally {
      setIsDeleteDefaultKey(false);
      setOpenDefaultKeyModal(false);
    }
  };

  const onEditKeyNameSubmit = async ({ name }) => {
    try {
      setIsActionPerforming(true);
      await editKeyName({ id: keyToUpdate.id, name });
    } finally {
      setOpenEditModal(false);
      setKeyToUpdate(null);
    }
  };

  return (
    <>
      <StyledFlex p="20px 10px">
        <StyledCard bgColor={colors.cardGridItemBg}>
          <StyledFlex mb={3} direction="row" justifyContent="space-between" alignItems="flex-start">
            <StyledFlex>
              <StyledText size={19} lh={23} weight={600}>
                Default API Key
              </StyledText>
              <StyledText size={16} lh={20} mt={8}>
                The Default Key appears in documentation views featuring sample execution requests
              </StyledText>
            </StyledFlex>
            <StyledButton variant="contained" secondary onClick={() => setOpenDefaultKeyModal(true)}>
              Select Default Key
            </StyledButton>
          </StyledFlex>
          <PageableTable
            data={{ content: defaultKeys?.content || [] }}
            columns={getAPIKeysColumns({
              enableSorting: false,
              showDefaultLabel: false,
              onDelete: onActionDelete,
              onEdit: onActionEdit,
            })}
            isLoading={isTableLoading}
            disableTableFooter
            muiTableBodyCellProps={({ cell, row }) => ({
              onClick: () => {
                if (cell.column.id === 'name' || cell.column.id === 'createdDate') {
                  setViewAPIKey(row.original);
                }
              },
              sx: {
                backgroundColor: 'rgba(0,0,0,0)',
                border: '0',
              },
            })}
            muiTableBodyRowProps={() => {
              return {
                hover: false,
                sx: {
                  backgroundColor: 'rgba(0,0,0,0)',
                  '&.MuiTableRow-root:hover .MuiTableCell-root': {
                    cursor: 'pointer',
                  },
                },
              };
            }}
            muiTableHeadCellProps={() => ({
              sx: {
                backgroundColor: 'rgba(0,0,0,0)',
                borderColor: colors.primary,
                '&:last-child > div': {
                  justifyContent: 'flex-end',
                },
              },
            })}
            muiTableHeadRowProps={() => ({
              sx: {
                backgroundColor: 'rgba(0,0,0,0)',
                boxShadow: 'none',
              },
            })}
          />
        </StyledCard>
        <StyledFlex mt={7}>
          <PageableTableHeader>
            <StyledFlex width={300}>
              <SearchBar placeholder="Search API Keys..." onChange={(e) => setSearchText(e.target.value)} />
            </StyledFlex>
            <StyledButton
              variant="contained"
              secondary
              startIcon={<CustomTableIcons icon="ADD" width={24} color="white" />}
              onClick={() => setOpenCreateModal(true)}
            >
              Create API Key
            </StyledButton>
          </PageableTableHeader>
          <PageableTable
            tableName="API Keys"
            pagination={pagination}
            data={data}
            columns={getAPIKeysColumns({ onDelete: onActionDelete, onEdit: onActionEdit })}
            setPagination={setPagination}
            sorting={sorting}
            setSorting={setSorting}
            isLoading={isTableLoading}
            muiTableBodyCellProps={({ cell, row }) => ({
              onClick: () => {
                if (cell.column.id === 'name' || cell.column.id === 'createdDate') {
                  setViewAPIKey(row.original);
                }
              },
            })}
            muiTableBodyRowProps={() => {
              return {
                hover: false,
                sx: {
                  '&.MuiTableRow-root:hover .MuiTableCell-root': {
                    cursor: 'pointer',
                  },
                },
              };
            }}
            muiTableBodyProps={({ table }) =>
              tableEmptyAdapter({
                table,
                title: 'No API Keys Found',
                message: 'There are currently no API Keys. Click on the “Create API Key” to get started',
              })
            }
          />
        </StyledFlex>

        <APIKeyDetailsModal viewAPIKey={viewAPIKey} onClose={() => setViewAPIKey(null)} />

        {openCreateModal && (
          <GenerateAPIKeyModal
            open={openCreateModal}
            onSubmit={onCreateSubmit}
            onClose={() => setOpenCreateModal(false)}
          />
        )}

        {keyToUpdate && (
          <EditAPIKeyModal
            open={openEditModal}
            onSubmit={onEditKeyNameSubmit}
            value={keyToUpdate?.name}
            onClose={() => {
              setOpenEditModal(false);
              setKeyToUpdate(null);
            }}
          />
        )}

        {openDefaultKeyModal && (
          <DefaultAPIKeyModal
            open={openDefaultKeyModal}
            onClose={() => setOpenDefaultKeyModal(false)}
            onSubmit={onSetDefaultSubmit}
          />
        )}

        {isDeleteModalOpen && (
          <DeleteKeyConfirmModal
            open={isDeleteModalOpen}
            onClose={onDeleteModalClose}
            onSuccess={onDeleteModalSubmit}
          />
        )}

        {isDeleteDefaultKey && (
          <DeleteDefaultKeyConfirmModal
            open={isDeleteDefaultKey}
            onClose={onDefaultDeleteModalClose}
            onSuccess={onDeleteDefaultModalSubmit}
          />
        )}
      </StyledFlex>
    </>
  );
};

export default APIKeysTable;
