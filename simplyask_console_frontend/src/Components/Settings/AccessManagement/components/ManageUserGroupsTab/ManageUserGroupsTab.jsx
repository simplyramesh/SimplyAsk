import { useQuery, useQueryClient } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { getPermissionGroup, patchPermissionGroup } from '../../../../../Services/axios/permissions';
import { getAllUserGroups, getUserGroups } from '../../../../../Services/axios/permissionsUserGroups';
import { patchUserPermissions } from '../../../../../Services/axios/permissionsUsers';
import { getAllPermissionRoles } from '../../../../../Services/axios/requestManagerAxios';
import routes from '../../../../../config/routes';
import { useUser } from '../../../../../contexts/UserContext';
import { useTableSortAndFilter } from '../../../../../hooks/useTableSortAndFilter';
import { useGetUserById } from '../../../../../hooks/useUserById';
import { StyledLoadingButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import ConfirmationModal from '../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import PageableTable from '../../../../shared/REDISIGNED/table/PageableTable';
import TableHeader from '../../../../shared/REDISIGNED/table/components/TableHeader/TableHeader';
import { IS_LOCKED_VALUES } from '../../../../shared/REDISIGNED/table/constants/tableConstants';
import SearchBar from '../../../../shared/SearchBar/SearchBar';
import ViewFiltersButton from '../../../../shared/ViewFiltersButton/ViewFiltersButton';
import { DEFAULT_PAGINATION } from '../../../../shared/constants/core';
import { StyledCard, StyledFlex } from '../../../../shared/styles/styled';
import { MANAGE_USER_GROUPS_COLUMNS } from '../../utils/columnsFormatters/usersColumnsFormatter';
import { filterListArr } from '../../utils/formatters';
import { calendarFilter } from '../../utils/helpers';
import EmptyTable from '../EmptyTable/EmptyTable';
import PrimarySelect from '../dropdowns/PrimarySelect/PrimarySelect';
import UserGroupsFilters from '../filters/UserGroupsFilters/UserGroupsFilters';
import SideModalFilterContent from '../modals/sideModals/SideModalFilterContent/SideModalFilterContent';

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

  if (name === 'isLocked') {
    const isBoth = value.length === 2;
    const isEmpty = value.length === 0;
    const emptyOrBoth = isEmpty ? IS_LOCKED_VALUES.EMPTY : IS_LOCKED_VALUES.BOTH;
    const locked = value.length === 1 && value[0].value ? IS_LOCKED_VALUES.LOCKED : IS_LOCKED_VALUES.UNLOCKED;

    return {
      ...previous,
      table: {
        ...previous.table,
        status: value.map((status) => status.label),
      },
      api: {
        ...previous.api,
        isLocked: isBoth || isEmpty ? emptyOrBoth : locked,
      },
    };
  }

  return { ...previous };
};

const MANAGE_USER_GROUPS_FILTER_INIT_STATE = {
  editedAfter: '',
  editedBefore: '',
  createdAfter: '',
  createdBefore: '',
  roles: [],
  name: '',
  userCount: '',
};

const initialFilterSelector = (currentView, id, permissionGroup) => {
  const userGroupIds = permissionGroup?.userGroupIds?.length > 0 ? permissionGroup?.userGroupIds : null;

  const filterOption = currentView === 'permissionGroup' ? { userGroupIds } : { [`${currentView}Ids`]: [id] };

  return {
    ...MANAGE_USER_GROUPS_FILTER_INIT_STATE,
    ...filterOption,
  };
};

const patchRequestSelector = (currentView, id, filters) => {
  switch (currentView) {
    case 'permissionGroup':
      return patchPermissionGroup(id, filters);
    case 'user':
      return patchUserPermissions(id, filters);
    default:
      return null;
  }
};

const ManageUserGroupsTab = ({ currentView }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const { user: authUser } = useUser();

  const [showUserGroupFilters, setShowUserGroupFilters] = useState(false);
  const [isViewFiltersOpen, setIsViewFiltersOpen] = useState(false);
  const [manageUserGroupFilters, setManageUserGroupFilters] = useState({ table: {}, api: {} });

  const [selectedUserGroups, setSelectedUserGroups] = useState([]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const tableRef = useRef(null);
  const tableFns = useRef(null);

  const getId = () => id || authUser?.id || null;

  const { data: allUserGroups } = useQuery({
    queryKey: ['getAllUserGroups'],
    queryFn: getAllUserGroups,
    enabled: !!getId(),
  });

  const { data: permissionGroup, isSuccess: isPermissionGroupSuccess } = useQuery({
    queryKey: ['getPermissionGroup', getId()],
    queryFn: () => getPermissionGroup(getId()),
    enabled: !!getId(),
  });

  const { userInfo } = useGetUserById(id, {
    queryKey: ['getUser', id],
    enabled: !!id && currentView === 'user',
    placeholderData: {
      firstName: '',
      lastName: '',
      pfp: '',
    },
  });

  const { data: roles } = useQuery({
    queryKey: ['getAllPermissionRoles'],
    queryFn: getAllPermissionRoles,
    enabled: isViewFiltersOpen,
  });

  const { setColumnFilters, setSearchText, pagination, setPagination, sorting, setSorting, data, isFetching, refetch } =
    useTableSortAndFilter({
      queryKey: 'getManageUserGroups',
      queryFn: getUserGroups,
      initialSorting: [
        {
          id: 'modifiedDate',
          desc: true,
        },
      ],
      initialFilters: initialFilterSelector(currentView, getId(), permissionGroup),
      pageSize: DEFAULT_PAGINATION.PAGE_SIZE,
      pageIndex: DEFAULT_PAGINATION.PAGE_NUMBER,
      options: {
        // enabled: !!permissionGroup,
        select: (data) => {
          const hasIsEditable = permissionGroup
            ? Object.keys(permissionGroup)?.includes('isEditable')
            : userInfo?.role === 'admin';
          const isEditable = hasIsEditable ? permissionGroup?.isEditable : true;

          return { ...data, content: data?.content?.map((userGroup) => ({ ...userGroup, isEditable })) };
        },
      },
    });

  const handleFilterChange = (value, action) => {
    setManageUserGroupFilters((prev) => onUserGroupsFiltersState(prev, value, action));
  };

  const handleClearFilters = () => {
    setManageUserGroupFilters({
      table: {},
      api: initialFilterSelector(currentView, getId(), permissionGroup),
    });

    setColumnFilters({ ...initialFilterSelector(currentView, getId(), permissionGroup) });
    setPagination({ ...pagination, pageIndex: 0 });

    setShowUserGroupFilters(false);
  };

  const handleConfirmFilters = () => {
    setColumnFilters({
      ...initialFilterSelector(currentView, getId(), permissionGroup),
      ...manageUserGroupFilters.api,
    });
    setPagination({ ...pagination, pageIndex: 0 });

    setShowUserGroupFilters(true);
  };

  const userGroupDropdownOptions = allUserGroups?.filter(
    (userGroup) => !data?.content?.find((manageUserGroup) => manageUserGroup.id === userGroup.id)
  );

  useEffect(() => {
    if (isPermissionGroupSuccess && permissionGroup) {
      setColumnFilters(initialFilterSelector(currentView, getId(), permissionGroup));
    }
  }, [permissionGroup, isPermissionGroupSuccess]);

  const handleNavigateUserGroup = useCallback((id) => {
    navigate({
      pathname: `${routes.SETTINGS_USER_GROUPS}/${id}`,
      search: 'tab=general',
    });
  }, []);

  const handleAddUserGroups = async () => {
    const newUserGroupIds = selectedUserGroups.map((userGroup) => userGroup.id);
    const oldUserGroupIds = data?.content?.map((userGroup) => userGroup.id);
    const userGroupIds = [...new Set([...newUserGroupIds, ...oldUserGroupIds])];

    if (!newUserGroupIds.length) return;

    try {
      setIsCreateLoading(true);

      const response = await patchRequestSelector(currentView, getId(), { userGroupIds: [...userGroupIds] });

      setColumnFilters(initialFilterSelector(currentView, getId(), response));

      setSelectedUserGroups([]);

      toast.success('User groups added successfully');
    } catch (error) {
      toast.error('Error adding user groups');
    } finally {
      queryClient.invalidateQueries({ queryKey: ['getManageUserGroups'] });
      queryClient.invalidateQueries({ queryKey: ['getAllUserGroups'] });
      setIsCreateLoading(false);
    }
  };

  const handleOpenDelete = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleteLoading(true);

      const filteredUserGroupIds = data?.content?.reduce(
        (acc, userGroup) => (userGroup.id !== itemToDelete.id ? [...acc, userGroup.id] : acc),
        []
      );

      const response = await patchRequestSelector(currentView, getId(), { userGroupIds: [...filteredUserGroupIds] });

      setColumnFilters(initialFilterSelector(currentView, getId(), response));

      setItemToDelete(null);
      setIsDeleteModalOpen(false);

      toast.success(`${itemToDelete?.name} removed successfully from ${currentView}`);
    } catch (error) {
      toast.error(`Error removing ${itemToDelete?.name} from ${currentView}`);
    } finally {
      queryClient.invalidateQueries({ queryKey: ['getManageUserGroups'] });
      queryClient.invalidateQueries({ queryKey: ['getAllUserGroups'] });
      setIsDeleteLoading(false);
    }
  };

  const headerComponents = [
    <StyledFlex direction="row" key="manage-user-groups-header-component-1" gap="16px" mt="4px">
      <SearchBar placeholder="Search User Groups..." onChange={(e) => setSearchText(e.target.value)} />
      <ViewFiltersButton onClick={() => setIsViewFiltersOpen(true)} />
    </StyledFlex>,
  ];

  const enhancedHeaderComponentsBeforeDivider = [
    <PrimarySelect
      key="manage-user-groups-header-component-3"
      placeholder="Add User Groups..."
      onChange={(value) => setSelectedUserGroups(value)}
      value={selectedUserGroups}
      options={userGroupDropdownOptions}
      getOptionLabel={(option) => option.name}
      getOptionValue={(option) => option.id}
      withSeparator
      isMulti
      closeMenuOnSelect={false}
    />,
    <StyledLoadingButton
      primary
      variant="contained"
      key="manage-user-groups-header-component-5"
      onClick={handleAddUserGroups}
      loading={isCreateLoading}
    >
      Add
    </StyledLoadingButton>,
  ];

  return (
    <>
      {/* modals */}
      {isViewFiltersOpen && (
        <SideModalFilterContent
          isModalOpen={isViewFiltersOpen}
          onModalClose={() => setIsViewFiltersOpen(false)}
          onConfirm={handleConfirmFilters}
        >
          <UserGroupsFilters
            userGroupsFilters={manageUserGroupFilters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            roles={roles}
          />
        </SideModalFilterContent>
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onCloseModal={() => setIsDeleteModalOpen(false)}
        cancelBtnText="Go Back"
        onCancelClick={() => setIsDeleteModalOpen(false)}
        onSuccessClick={handleConfirmDelete}
        successBtnText="Delete"
        alertType="DANGER"
        title="Are You Sure?"
        text={`You are about to delete ${itemToDelete?.name}. The user will lose all related permissions and access.`}
        isLoading={isDeleteLoading}
      />

      {/* toolbar and table */}
      <StyledCard>
        <TableHeader
          enhancedHeaderTitle="Assigned users to, or remove them from, this user groups"
          filterList={filterListArr(manageUserGroupFilters.table)}
          secondarySelectPlaceholder
          onRemove={(z, y) => console.log(z, y)}
          onClearFilters={handleClearFilters}
          showFilters={showUserGroupFilters}
          enhancedHeader
          headerComponents={headerComponents}
          enhancedHeaderComponentsBeforeDivider={enhancedHeaderComponentsBeforeDivider}
        />
        <PageableTable
          data={data}
          pagination={pagination}
          setPagination={setPagination}
          sorting={sorting}
          setSorting={setSorting}
          isFetching={isFetching}
          isLoading={isFetching}
          enableStickyHeader={false}
          initFilters={initialFilterSelector(currentView, getId(), permissionGroup)}
          queryFn={getUserGroups}
          queryKey="getUserGroups"
          queryEnabled={
            !!getId() && (currentView === 'permissionGroup' ? permissionGroup?.userGroupIds?.length > 0 : true)
          }
          getTableFns={(fns) => {
            tableFns.current = fns;
          }}
          columns={MANAGE_USER_GROUPS_COLUMNS}
          tableRef={tableRef}
          tableName="Manage-User-Groups"
          meta={{
            getGroupId: (row) => row.original.id,
            onUserGroupClick: (id) => handleNavigateUserGroup(id),
            onDelete: handleOpenDelete,
          }}
          muiTableBodyProps={EmptyTable}
        />
      </StyledCard>
    </>
  );
};

export default ManageUserGroupsTab;

ManageUserGroupsTab.propTypes = {
  currentView: PropTypes.oneOf(['permissionGroup', 'user']).isRequired,
};
