import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  getPermissionGroup,
  getPermissionSummary,
  patchPermissionGroup,
} from '../../../../../Services/axios/permissions';
import {
  getUserGroupPermissionsById,
  getUserPermissionsById,
  patchUserGroupsById,
  patchUserPermissions,
} from '../../../../../Services/axios/permissionsUsers';
import { useGetCurrentUser } from '../../../../../hooks/useGetCurrentUser';
import { useTableSortAndFilter } from '../../../../../hooks/useTableSortAndFilter';
import { capitalizeFirstLetterOfRegion } from '../../../../../utils/helperFunctions';
import { StyledButton, StyledLoadingButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomTableIcons from '../../../../shared/REDISIGNED/icons/CustomTableIcons';
import ContentLayout from '../../../../shared/REDISIGNED/layouts/ContentLayout/ContentLayout';
import PageLayout from '../../../../shared/REDISIGNED/layouts/PageLayout/PageLayout';
import ConfirmationModal from '../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import PageableTable from '../../../../shared/REDISIGNED/table/PageableTable';
import TableHeader from '../../../../shared/REDISIGNED/table/components/TableHeader/TableHeader';
import SearchBar from '../../../../shared/SearchBar/SearchBar';
import ViewFiltersButton from '../../../../shared/ViewFiltersButton/ViewFiltersButton';
import { DEFAULT_PAGINATION } from '../../../../shared/constants/core';
import { StyledCard, StyledFlex } from '../../../../shared/styles/styled';
import { useEntityCreateDelete } from '../../hooks/useGroupsCreateDelete';
import { MANAGE_PERMISSIONS_COLUMNS } from '../../utils/columnsFormatters/usersColumnsFormatter';
import { filterListArr } from '../../utils/formatters';
import { calendarFilter, createPageGroupHeadings } from '../../utils/helpers';
import EmptyTable from '../EmptyTable/EmptyTable';
import PrimarySelect from '../dropdowns/PrimarySelect/PrimarySelect';
import PermissionsFilters from '../filters/PermissionsFilters/PermissionsFilters';
import SideModalFilterContent from '../modals/sideModals/SideModalFilterContent/SideModalFilterContent';

import { useGetUserById } from '../../../../../hooks/useUserById';
import AddPermissionGroups from './AddPermissionGroups/AddPermissionGroups';
import CustomAccessLevel from './CustomAccessLevel/CustomAccessLevel';
import { ACCESS_LEVEL, ACCESS_LEVEL_SCHEME, EDIT_PERMISSIONS_TYPE } from './PermissionSettingsScheme';

export const ACCESS_FILTER_OPTIONS = [
  {
    value: ACCESS_LEVEL_SCHEME.WRITE.value,
    label: ACCESS_LEVEL_SCHEME.WRITE.label,
  },
  {
    value: ACCESS_LEVEL_SCHEME.READ.value,
    label: `${ACCESS_LEVEL_SCHEME.READ.label} Access`,
  },
  {
    value: ACCESS_LEVEL_SCHEME.CUSTOM.value,
    label: ACCESS_LEVEL_SCHEME.CUSTOM.label,
  },
];

const idSelector = (groupType, id, idPermissions) => {
  switch (groupType) {
    case 'user':
      return {
        [`${groupType}Ids`]: [id],
        userGroupIds: idPermissions?.userGroupIds || [],
        permissionGroupIds: idPermissions?.permissionGroupIds || [],
      };
    case 'userGroup':
      return {
        [`${groupType}Ids`]: [id],
        permissionGroupIds: idPermissions?.permissionGroupIds || [],
      };
    case 'permissionGroup':
      return {
        [`${groupType}Ids`]: [id],
      };
    default:
      return {};
  }
};

const managePermissionsInitialTableState = (groupType, id, idPermissions) => ({
  createdAfter: '',
  createdBefore: '',
  category: '',
  permissionTypes: 'PAGE_PERMISSION',
  ...idSelector(groupType, id, idPermissions),
});

export const requestSelector = (groupType, param) => {
  switch (groupType) {
    case 'user':
      return getUserPermissionsById(param);
    case 'userGroup':
      return getUserGroupPermissionsById(param);
    case 'permissionGroup':
      return getPermissionGroup(param);
    default:
      return null;
  }
};

const patchRequestSelector = (groupType, id, filters) => {
  switch (groupType) {
    case 'userGroup':
      return patchUserGroupsById(id, filters);
    case 'permissionGroup':
      return patchPermissionGroup(id, filters);
    case 'user':
      return patchUserPermissions(id, filters);
    default:
      return null;
  }
};

const ManagePermissionsTab = ({ groupType }) => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { currentUser } = useGetCurrentUser();

  const timezone = currentUser?.timezone;

  const [isViewFiltersOpen, setIsViewFiltersOpen] = useState(false);
  const [permissionFilters, setPermissionFilters] = useState({ table: [], api: {} });
  // TableHeader
  const [isPermissionFiltersOpen, setIsPermissionFiltersOpen] = useState(false);

  // dropdown value states
  const [addedPagePermissions, setAddedPagePermissions] = useState([]);
  const [permissionAccessLevel, setPermissionAccessLevel] = useState('WRITE');
  const [areAllPermissionsSelected, setAreAllPermissionsSelected] = useState(false);

  const [isManagePermGroupsOpen, setIsManagePermGroupsOpen] = useState(false);

  const [isDeletePermissionOpen, setIsDeletePermissionOpen] = useState(false);
  const [permissionToDelete, setPermissionToDelete] = useState({});

  // custom access level
  const [isCustomAccessOpen, setIsCustomAccessOpen] = useState(false);
  const [permissionSettings, setPermissionSettings] = useState([]);

  const tableRef = useRef(null);

  const { userInfo } = useGetUserById(id, {
    queryKey: ['getUser', id],
    enabled: !!id && groupType === 'user',
    placeholderData: {
      firstName: '',
      lastName: '',
      pfp: '',
    },
  });

  const accessLevelInitialState = {
    inclusiveSearch: 'false',
    pageSize: '500',
    searchText: '',
    inverseAssignmentSearch: true,
    permissionTypes: 'PAGE_PERMISSION',
    [`${groupType}Ids`]: [id],
    timezone,
  };

  const {
    data: idPermissions,
    isSuccess: isIdPermissionsSuccess,
    isFetching: isIdPermissionsFetching,
    refetch: refetchIdPermissions,
  } = useQuery({
    queryKey: ['getPermissionsById', groupType, id],
    queryFn: () => requestSelector(groupType, id),
    enabled: !!id,
    select: (data) => ({ ...data, initialFilters: managePermissionsInitialTableState(groupType, id, data) }),
  });

  const idSelectorPermissions = idPermissions?.initialFilters;

  const {
    setColumnFilters,
    setSearchText,
    pagination,
    setPagination,
    sorting,
    setSorting,
    data: tableData,
    isFetching,
    refetch,
  } = useTableSortAndFilter({
    queryKey: 'getPermissionSummary',
    queryFn: getPermissionSummary,
    initialSorting: [
      {
        id: 'createdDate',
        desc: false,
      },
    ],
    initialFilters: idPermissions?.initialFilters,
    pageSize: DEFAULT_PAGINATION.PAGE_SIZE,
    pageIndex: DEFAULT_PAGINATION.PAGE_NUMBER,
    options: {
      enabled: !!id && !!idPermissions && isIdPermissionsSuccess,
      select: (data) => {
        if (idPermissions?.isEditable) return data;
        const isUserAdminEditable = groupType === 'user' && userInfo?.role !== 'admin';

        return {
          ...data,
          content: data?.content?.map((perm) => {
            return {
              ...perm,
              isEditable: !idPermissions?.isEditable
                ? isUserAdminEditable || idPermissions?.isEditable
                : idPermissions?.permissionIds?.includes(perm.id),
            };
          }),
        };
      },
    },
  });

  useEffect(() => {
    if (isIdPermissionsSuccess) {
      setColumnFilters((prev) => ({ ...prev, ...idSelectorPermissions }));
    }
  }, [idSelectorPermissions, isIdPermissionsSuccess]);

  const handleFilterChange = (value, action) => {
    if (!action) setPermissionFilters((prev) => calendarFilter(prev, value, action));

    if (action) {
      setPermissionFilters((prev) => ({
        ...prev,
        table: {
          ...prev.table,
          [action.name]: value.map((val) => val[action.name]),
        },
        api: {
          ...prev.api,
          [action.name]: value.map((val) => val[action.name]),
          [`${groupType}Ids`]: [id],
        },
      }));
    }
  };

  const handleClearFilters = () => {
    const defaultUserFilters = managePermissionsInitialTableState(groupType, id, idPermissions);

    setPermissionFilters({
      table: {},
      api: defaultUserFilters,
    });

    setColumnFilters(defaultUserFilters);
    setPagination({ ...pagination, pageIndex: 0 });

    setIsPermissionFiltersOpen(false);
  };
  const handleConfirmFilters = () => {
    setColumnFilters(permissionFilters.api);
    setPagination({ ...pagination, pageIndex: 0 });

    setIsPermissionFiltersOpen(true);
  };

  const allPagePermissionsUrl = new URLSearchParams(accessLevelInitialState).toString();

  const { data: allPagePermissions, isFetching: isFetchingAllPermissions } = useQuery({
    queryKey: ['getAllPagePermissions', allPagePermissionsUrl],
    queryFn: () => getPermissionSummary(allPagePermissionsUrl),
    enabled: !!tableData,
    select: (data) => {
      const permissionsWithPagePermissions = data?.content?.reduce((acc, curr) => {
        const hasApiPermissions = curr?.apiPermissions?.some(
          (apiPerm) => apiPerm.permission.permissionType === 'API_PERMISSION'
        );

        if (!curr?.apiPermissions.length || !hasApiPermissions) return acc;

        return [...acc, curr];
      }, []);

      return createPageGroupHeadings(permissionsWithPagePermissions, tableData?.content);
    },
  });

  const onResetDropdowns = () => {
    setPermissionAccessLevel('WRITE');
    setAreAllPermissionsSelected(false);
    setAddedPagePermissions([]);

    if (isCustomAccessOpen) setIsCustomAccessOpen(false);
  };

  const { editEntity, createEntity, deleteEntity, isEditLoading, isDeleteLoading, isCreateLoading } =
    useEntityCreateDelete({
      createFn: async (pagePermissionsToAdd) => {
        const permissionIds = pagePermissionsToAdd.map(({ currentSelected }) => currentSelected.permissionId);
        const uniquePermissionIds = [...new Set([...idPermissions.permissionIds, ...permissionIds])];

        await patchRequestSelector(groupType, id, { permissionIds: uniquePermissionIds });
      },
      editFn: async (id, { currentApiPermissionId, newPermissionId }) => {
        const isDirectlyAssigned = idPermissions.permissionIds.includes(currentApiPermissionId);
        const updatedPermissions = [];

        if (isDirectlyAssigned) {
          const replacedPermission = idPermissions.permissionIds.map((permissionId) =>
            permissionId === currentApiPermissionId ? newPermissionId : permissionId
          );

          updatedPermissions.push(...replacedPermission);
        }

        if (!isDirectlyAssigned) updatedPermissions.push(...idPermissions.permissionIds, newPermissionId);

        await patchRequestSelector(groupType, id, { permissionIds: updatedPermissions });
        refetchIdPermissions();
      },
      deleteFn: async () => {
        const newPermissionIds = idPermissions.permissionIds.reduce(
          (acc, curr) => (curr !== permissionToDelete?.id ? [...acc, curr] : acc),
          []
        );

        await patchRequestSelector(groupType, id, { permissionIds: newPermissionIds });
      },
      onCreateSuccess: () => {
        onResetDropdowns();
        queryClient.invalidateQueries({ queryKey: ['getPermissionsById'] });
      },
      onEditSuccess: () => {
        onResetDropdowns();
        queryClient.invalidateQueries({ queryKey: ['getPermissionsById'] });
      },
      successCreateMessage: () => `Permissions added successfully to ${groupType}`,
      successEditMessage: () => 'Permission Access Level successfully changed',
      successDeleteMessage: () => `Successfully removed ${permissionToDelete.permission.permissionName} permission`,
      onDeleteSuccess: () => {
        setIsDeletePermissionOpen(false);
        setPermissionToDelete({});
        queryClient.invalidateQueries({ queryKey: ['getPermissionsById'] });
      },
      invalidateQueryKey: 'getPermissionSummary',
    });

  const onSetReadWrite = (accessLevel, permPageValue) => {
    setAddedPagePermissions((prev) => {
      const pages = permPageValue || prev;

      return pages
        .filter((perm) => perm?.[accessLevel] || perm?.[ACCESS_LEVEL.WRITE])
        .map((perm) => {
          const readWritePermission = perm?.[accessLevel] || perm[ACCESS_LEVEL.WRITE];

          return {
            ...perm,
            currentSelected: {
              permissionAccessLevel: readWritePermission.permission.permissionAccessLevel,
              permissionId: readWritePermission.id,
              parentOrganizationPermissionId: perm.id,
              type: EDIT_PERMISSIONS_TYPE.ADD,
            },
          };
        });
    });
  };

  const handlePagePermissions = (value) => {
    onSetReadWrite(permissionAccessLevel, value);
  };

  // const handleAccessLevelChange = ({ value: accessLevel }) => {
  //   if (accessLevel !== ACCESS_LEVEL.CUSTOM) {
  //     onSetReadWrite(accessLevel);
  //   }

  //   setPermissionAccessLevel(accessLevel);
  // };

  const addNewPermissions = () => {
    if (permissionAccessLevel === ACCESS_LEVEL.CUSTOM) {
      setPermissionSettings(addedPagePermissions);
      setIsCustomAccessOpen(true);
    } else {
      createEntity(addedPagePermissions);
    }
  };

  const handleRemovePermission = (permission) => {
    setIsDeletePermissionOpen(true);
    setPermissionToDelete(permission);
  };

  const handleShowCustomAccess = (data) => {
    const currentPermissions = [
      {
        currentSelected: {
          permissionAccessLevel: data?.currentAccessLevel,
          permissionId: data?.currentId,
          parentOrganizationPermissionId: data?.pagePermission?.id,
          type: EDIT_PERMISSIONS_TYPE.EDIT,
        },
        customInfo: { ...data },
      },
    ];
    setPermissionSettings(currentPermissions);
    setIsCustomAccessOpen(true);
  };

  const headerComponents = [
    <StyledFlex direction="row" key="manage-permissions-header-component-1" gap="16px" mt="4px">
      <SearchBar
        name="user-manage-permissions-search"
        placeholder="Search Permissions..."
        onChange={(e) => setSearchText(e.target.value)}
      />
      <ViewFiltersButton onClick={() => setIsViewFiltersOpen(true)} />
    </StyledFlex>,
  ];
  // permissions/filter api endpoint
  const enhancedHeaderComponentsBeforeDivider = [
    <PrimarySelect
      key="manage-permissions-header-component-3"
      placeholder="Select Permissions..."
      name="select permissions"
      onChange={handlePagePermissions}
      value={addedPagePermissions}
      options={allPagePermissions}
      getOptionLabel={(option) => option.permission.permissionName}
      getOptionValue={(option) => option[permissionAccessLevel]?.id}
      isMulti
      hideSelectedOptions={false}
      withSeparator
      withMultiSelect
      onSelectAll={setAreAllPermissionsSelected}
      isAllSelected={areAllPermissionsSelected}
      isClearable={false}
      labelKey="permissionName"
      valueKey="permissionId"
    />,
    // <PrimarySelect
    //   key="manage-permissions-header-component-4"
    //   placeholder="Full Access Permissions"
    //   width={258}
    //   value={ACCESS_FILTER_OPTIONS.find((option) => option.value === permissionAccessLevel)}
    //   onChange={handleAccessLevelChange}
    //   options={ACCESS_FILTER_OPTIONS}
    //   isSearchable={false}
    // />,
    <StyledLoadingButton
      secondary
      variant="contained"
      key="manage-permissions-header-component-5"
      onClick={addNewPermissions}
      disabled={!addedPagePermissions.length}
      loading={isCreateLoading}
    >
      Add
    </StyledLoadingButton>,
  ];

  const enhancedHeaderComponentsAfterDivider = [
    <Fragment key="manage-permissions-secondary-btn-after-divider">
      {groupType !== 'permissionGroup' && (
        <StyledButton
          primary
          variant="outlined"
          onClick={() => setIsManagePermGroupsOpen(true)}
          startIcon={<CustomTableIcons icon="ADD_PERM_GROUP" width={24} />}
        >
          Add Permission Groups
        </StyledButton>
      )}
    </Fragment>,
  ];

  const getTableName = () =>
    groupType !== 'user' ? 'Permissions' : `${capitalizeFirstLetterOfRegion(groupType)} Permissions`;

  const isTableLoading = isFetchingAllPermissions || isFetching || (isIdPermissionsFetching && !isIdPermissionsSuccess);

  const renderTable = () => (
    <StyledCard>
      <TableHeader
        enhancedHeaderTitle="Add individual page permissions and their access level to the table, or select groups of permissions instead."
        filterList={filterListArr(permissionFilters.table)}
        onRemove={(newTableFilters) => setPermissionFilters((prev) => ({ ...prev, table: newTableFilters }))}
        onClearFilters={handleClearFilters}
        showFilters={isPermissionFiltersOpen}
        headerComponents={headerComponents}
        enhancedHeaderComponentsBeforeDivider={enhancedHeaderComponentsBeforeDivider}
        enhancedHeaderComponentsAfterDivider={enhancedHeaderComponentsAfterDivider}
      />

      <PageableTable
        data={tableData}
        columns={MANAGE_PERMISSIONS_COLUMNS}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        isLoading={isTableLoading}
        enableStickyHeader={false}
        tableRef={tableRef}
        tableName={getTableName()}
        meta={{
          timezone,
          onDelete: (item) => handleRemovePermission(item),
          onAccessLevel: (item) => editEntity({ id, body: { ...item } }),
          getUserId: () => (groupType === 'user' ? id : null),
          getUserGroupId: () => (groupType === 'userGroup' ? id : null),
          getPermissionGroupId: () => (groupType === 'permissionGroup' ? id : null),
          getPermissionIds: () => ({
            ...idSelector(groupType, id, idPermissions),
            permissionIds: idPermissions?.permissionIds || [],
          }),
          onShowAccessSettings: (accessType, data) => handleShowCustomAccess(accessType, data),
        }}
        muiTableBodyProps={EmptyTable}
      />
    </StyledCard>
  );

  return (
    <>
      <SideModalFilterContent
        isModalOpen={isViewFiltersOpen}
        onModalClose={() => setIsViewFiltersOpen(false)}
        onConfirm={handleConfirmFilters}
      >
        <PermissionsFilters
          permissionFilters={permissionFilters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      </SideModalFilterContent>

      <ConfirmationModal
        isOpen={isDeletePermissionOpen}
        onCloseModal={() => setIsDeletePermissionOpen(false)}
        onSuccessClick={() => {
          deleteEntity(permissionToDelete);
        }}
        successBtnText="Delete"
        alertType="DANGER"
        title="Are You Sure?"
        text={`You are about to delete ${JSON.stringify(permissionToDelete?.permission?.permissionName)}. The user will lose all related permissions and access.`}
        isLoading={isDeleteLoading}
      />

      <AddPermissionGroups
        id={id}
        open={isManagePermGroupsOpen}
        onClose={() => {
          refetchIdPermissions();
          refetch();
          setIsManagePermGroupsOpen(false);
        }}
        patchRequestSelector={patchRequestSelector}
        groupType={groupType !== 'permissionGroup' ? groupType : undefined}
      />

      <CustomAccessLevel
        initialPermissions={permissionSettings}
        customAccessOpen={isCustomAccessOpen}
        onCustomAccessClose={() => setIsCustomAccessOpen(false)}
        onAdd={createEntity}
        onUpdate={editEntity}
        groupType={groupType}
        id={id}
        onResetDropdowns={onResetDropdowns}
        isLoading={isEditLoading || isCreateLoading}
      />
      {/* toolbar and table */}
      {groupType === 'permissionGroup' ? (
        renderTable()
      ) : (
        <PageLayout>
          <ContentLayout>
            <StyledFlex mb="42px">{renderTable()}</StyledFlex>
          </ContentLayout>
        </PageLayout>
      )}
    </>
  );
};

export default ManagePermissionsTab;
