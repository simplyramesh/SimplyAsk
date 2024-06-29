import Box from '@mui/material/Box';
import React, { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import routes from '../../../../../config/routes';
import { useGetCurrentUser } from '../../../../../hooks/useGetCurrentUser';
import { useTableSortAndFilter } from '../../../../../hooks/useTableSortAndFilter';
import {
  createPermissionGroup,
  deletePermissionGroup,
  getPermissionGroups,
} from '../../../../../Services/axios/permissions';
import { patchEditUser } from '../../../../../Services/axios/permissionsUsers';
import { DEFAULT_PAGINATION } from '../../../../shared/constants/core';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomTableIcons from '../../../../shared/REDISIGNED/icons/CustomTableIcons';
import ConfirmationModal from '../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import TableHeader from '../../../../shared/REDISIGNED/table/components/TableHeader/TableHeader';
import PageableTable from '../../../../shared/REDISIGNED/table/PageableTable';
import SearchBar from '../../../../shared/SearchBar/SearchBar';
import { StyledCard } from '../../../../shared/styles/styled';
import ViewFiltersButton from '../../../../shared/ViewFiltersButton/ViewFiltersButton';
import EmptyTable from '../../components/EmptyTable/EmptyTable';
import PermissionGroupsFilters from '../../components/filters/PermissionGroupsFilters/PermissionGroupsFilters';
import PermissionGroupsForm from '../../components/forms/PermissionGroupsForm';
import SideModalFilterContent from '../../components/modals/sideModals/SideModalFilterContent/SideModalFilterContent';
import { useEntityCreateDelete } from '../../hooks/useGroupsCreateDelete';
import { PERMISSION_GROUP_COLUMNS } from '../../utils/columnsFormatters/userGroupsColumnsFormatter';
import { filterListArr } from '../../utils/formatters';
import { calendarFilter } from '../../utils/helpers';

const onUserGroupsFiltersState = (previous, value, action) => {
  const name = action ? action.name : value.name;

  if (!action) {
    return calendarFilter(previous, value, action);
  }

  if (name === 'roles') {
    return {
      ...previous,
      table: {
        ...previous.table,
        role: value.map((role) => role.role),
      },
      api: {
        ...previous.api,
        roles: value.map((role) => role.id),
      },
    };
  }

  return { ...previous };
};

const PermissionGroupsView = () => {
  const navigate = useNavigate();

  const {
    currentUser,
  } = useGetCurrentUser();

  const USER_GROUPS_FILTERS_INIT_STATE = {
    // API filters
    editedAfter: '',
    editedBefore: '',
    createdAfter: '',
    createdBefore: '',
    timezone: currentUser?.timezone,
    role: [], // List<string> UUID's of UserGroups
    isLocked: '', // LOCKED, UNLOCKED, BOTH
  };

  const [isViewFiltersOpen, setIsViewFiltersOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [userGroupsFilters, setUserGroupsFilters] = useState({ table: {}, api: {} });
  const [userGroupsFiltersValues, setUserGroupsFiltersValues] = useState({ date: null });
  const [showFilters, setShowFilters] = useState(false);

  const [isAddPermissionGroupOpen, setIsAddPermissionGroupOpen] = useState(false);

  const tableRef = useRef(null);

  const {
    createEntity, deleteEntity, isDeleteLoading, isCreateLoading, isEditLoading,
  } = useEntityCreateDelete({
    createFn: createPermissionGroup,
    deleteFn: deletePermissionGroup,
    invalidateQueryKey: 'getPermissionGroups',
    successCreateMessage: ({ variables }) => `Permission group "${variables.name}" was successfully created!`,
    successDeleteMessage: ({ variables }) => `Permission group "${variables.name}" was successfully removed!`,
    onCreateSuccess: () => setIsAddPermissionGroupOpen(false),
    onDeleteSuccess: () => setIsAddPermissionGroupOpen(false),
  });

  const handleCreatePermGroup = async (formik) => {
    await createEntity(formik.values);

    formik.resetForm();
  };

  const handleOpenDeleteConfirm = (item) => {
    setItemToDelete(item);
  };

  const handleConfirmDelete = async () => {
    await deleteEntity(itemToDelete.original);
    setItemToDelete(null);
  };

  const {
    setColumnFilters, setSearchText, pagination, setPagination, sorting, setSorting, data, isFetching, refetch,
  } = useTableSortAndFilter({
    queryKey: 'getPermissionGroups',
    queryFn: getPermissionGroups,
    initialSorting: [
      {
        id: '',
        desc: false,
      },
    ],
    initialFilters: USER_GROUPS_FILTERS_INIT_STATE,
    pageSize: DEFAULT_PAGINATION.PAGE_SIZE,
    pageIndex: DEFAULT_PAGINATION.PAGE_NUMBER,
  });

  // TODO: refactor to remove repeated code
  const handleFilterChange = (value, action) => {
    setUserGroupsFiltersValues((prev) => ({ ...prev, date: value }));
    setUserGroupsFilters((prev) => onUserGroupsFiltersState(prev, value, action));
  };

  const handleClearFilters = () => {
    setUserGroupsFiltersValues({ date: null });
    setUserGroupsFilters({
      table: {},
      api: USER_GROUPS_FILTERS_INIT_STATE,
    });

    setColumnFilters(USER_GROUPS_FILTERS_INIT_STATE);
    setPagination({ ...pagination, pageIndex: 0 });
    setShowFilters(false);
  };

  const handleConfirmFilters = () => {
    setColumnFilters({ ...userGroupsFilters.api, timezone: currentUser?.timezone });
    setPagination({ ...pagination, pageIndex: 0 });
    setShowFilters(true);
  };
  // TODO: add toast confirmation of success or failure
  const onChangeUserStatus = useCallback(async (id, payload) => {
    try {
      return await patchEditUser(id, payload);
    } catch (error) {
      throw new Error(error);
    } finally {
      refetch();
    }
  }, []);

  const onGroupClick = useCallback((id) => {
    navigate({
      pathname: `${routes.SETTINGS_ACCESS_MANAGER_PERMISSION_GROUPS}/${id}`,
      search: 'tab=general',
    });
  }, []);

  const headerComponents = [
    <Box display="flex" gap="16px" key="permission-group-header-1">
      <SearchBar placeholder="Search Permission Groups..." onChange={(e) => setSearchText(e.target.value)} />
      <ViewFiltersButton onClick={() => setIsViewFiltersOpen(true)} />
    </Box>,
    <Box display="flex" key="permission-group-header-2">
      <StyledButton
        variant="contained"
        secondary
        startIcon={<CustomTableIcons icon="ADD" width={24} color="white" />}
        onClick={() => setIsAddPermissionGroupOpen(true)}
      >
        Create Permission Group
      </StyledButton>
    </Box>,
  ];

  return (
    <>
      {/* modals */}
      <SideModalFilterContent
        isModalOpen={isViewFiltersOpen}
        onModalClose={() => setIsViewFiltersOpen(false)}
        onConfirm={handleConfirmFilters}
      >
        <PermissionGroupsFilters
          userGroupsFilters={userGroupsFiltersValues}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      </SideModalFilterContent>
      <PermissionGroupsForm
        open={isAddPermissionGroupOpen}
        onClose={() => setIsAddPermissionGroupOpen(false)}
        onSubmit={handleCreatePermGroup}
        isLoading={isCreateLoading || isEditLoading}
      />

      <ConfirmationModal
        isOpen={!!itemToDelete}
        onCloseModal={() => setItemToDelete(null)}
        onSuccessClick={handleConfirmDelete}
        successBtnText="Delete"
        alertType="DANGER"
        title="Are You Sure?"
        text={`You are about to remove the "${itemToDelete?.original.name}" group. All associated users, user groups and permissions will be permanently lost.`}
        isLoading={isDeleteLoading}
      />

      {/* toolbar and table */}
      <StyledCard>
        <TableHeader
          enhancedHeaderTitle="Assigned users to, or remove them from, this user groups"
          filterList={filterListArr(userGroupsFilters.table)}
          setSearchText={(e) => setSearchText(e.target.value)}
          secondarySelectPlaceholder
          onRemove={(z, y) => console.log(z, y)}
          onClearFilters={handleClearFilters}
          showFilters={showFilters}
          enhancedHeader
          headerComponents={headerComponents}
        />
        <PageableTable
          data={data}
          pagination={pagination}
          setPagination={setPagination}
          sorting={sorting}
          setSorting={setSorting}
          isFetching={isFetching}
          isLoading={isFetching}
          columns={PERMISSION_GROUP_COLUMNS({ onDelete: handleOpenDeleteConfirm })}
          tableRef={tableRef}
          tableName="Permission Groups"
          meta={{
            onChangeUserStatus,
            onGroupClick: (id) => onGroupClick(id),
          }}
          muiTableBodyProps={EmptyTable}
        />
      </StyledCard>
    </>
  );
};

export default PermissionGroupsView;
