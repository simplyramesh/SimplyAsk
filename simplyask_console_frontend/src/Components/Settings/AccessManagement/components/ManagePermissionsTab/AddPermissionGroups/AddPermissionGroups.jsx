import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import React, { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { getPermissionGroups } from '../../../../../../Services/axios/permissions';
import { StyledButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CenterModalFixed from '../../../../../shared/REDISIGNED/modals/CenterModalFixed/CenterModalFixed';
import ConfirmationModal from '../../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import TableHeader from '../../../../../shared/REDISIGNED/table/components/TableHeader/TableHeader';
import CustomTable from '../../../../../shared/REDISIGNED/table/CustomTable';
import SearchBar from '../../../../../shared/SearchBar/SearchBar';
import { StyledFlex } from '../../../../../shared/styles/styled';
import { PERMISSION_GROUP_COLUMNS } from '../../../utils/columnsFormatters/userGroupsColumnsFormatter';
import { filterListArr } from '../../../utils/formatters';
import { calendarFilter } from '../../../utils/helpers';
import CustomCalendarIndicator from '../../dropdowns/customComponents/calendarIndicator/CustomCalendarIndicator';
import CustomCalendarMenu from '../../dropdowns/customComponents/calendarMenu/CustomCalendarMenu';
import FilterDropdown from '../../dropdowns/FilterDropdown/FilterDropdown';
import PrimarySelect from '../../dropdowns/PrimarySelect/PrimarySelect';
import EmptyTable from '../../EmptyTable/EmptyTable';

const AddPermissionGroups = ({ id, open, onClose, groupType, patchRequestSelector }) => {
  const tableRef = useRef(null);
  const tableFns = useRef(null);

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const [addPermGroup, setAddPermGroup] = useState([]);

  const [permGroupsFilters, setPermGroupsFilters] = useState({ table: {}, api: tableFns?.current?.columnFilters });

  const [itemToDelete, setItemToDelete] = useState(null);

  const modalRef = useRef(null);
  const alertModalRef = useRef(null);

  const { data: permGroupList } = useQuery({
    queryKey: ['getPermissionGroups'],
    queryFn: () => getPermissionGroups(),
    enabled: open,
    select: (data) => data?.content,
  });

  const PERMISSION_GROUPS_FILTERS_INIT_STATE = {
    editedAfter: '',
    editedBefore: '',
    createdAfter: '',
    createdBefore: '',
    permissionCount: '',
    isAscending: true,
    inclusiveSearch: 'false',
    name: '',
    [`${groupType}Ids`]: id,
  };

  const { mutate: addPermissionGroup, isLoading: isCreateLoading } = useMutation({
    mutationFn: async ({ newPermissionGroups, data }) => {
      const permGroupIds = data.map(({ id: permId }) => permId);
      const newGroupIds = newPermissionGroups.map(({ id: groupId }) => groupId);

      const newIds = [...new Set([...permGroupIds, newGroupIds])];

      const createMutationResponse = await patchRequestSelector(groupType, id, { permissionGroupIds: newIds });

      return createMutationResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();

      setAddPermGroup([]);
      toast.success(`Permission group added successfully to ${groupType}`);
    },
    onError: () => {
      toast.error('Unable to add permission group');
    },
  });

  const { mutate: removePermissionGroup, isLoading: isDeleteLoading } = useMutation({
    mutationFn: async (data) => {
      const updatedPermissionGroups = data.reduce((acc, curr) => {
        if (curr?.id !== itemToDelete?.original?.id) return [...acc, curr?.id];

        return acc;
      }, []);

      const deleteMutationResponse = await patchRequestSelector(groupType, id, {
        permissionGroupIds: updatedPermissionGroups,
      });

      return deleteMutationResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();

      setItemToDelete(null);

      toast.success(`Permission group removed successfully from ${groupType}`);
    },
    onError: () => {
      toast.error('Unable to remove permission group');
    },
  });

  const handleOpenDeleteConfirm = (item) => setItemToDelete(item);

  const onRefChange = useCallback((ref) => {
    tableFns.current = ref;

    if (ref.data) setTableData(ref?.data?.content);
  }, []);

  const handleFilterChange = (value, action) => setPermGroupsFilters((prev) => calendarFilter(prev, value, action));

  const handleConfirmFilters = () =>
    tableFns.current?.setColumnFilters({ ...PERMISSION_GROUPS_FILTERS_INIT_STATE, ...permGroupsFilters.api });

  const handleClearFilters = () => {
    const defaultPermissionGroupsFilters = {
      ...PERMISSION_GROUPS_FILTERS_INIT_STATE,
    };

    setPermGroupsFilters({
      table: {},
      api: defaultPermissionGroupsFilters,
    });

    tableFns?.current?.setColumnFilters(defaultPermissionGroupsFilters);
  };

  const handlePermissionGroupClick = (permissionGroupId) => {
    navigate({
      pathname: `/Settings/AccessManagement/permissionGroups/${permissionGroupId}`,
      search: 'tab=managePermissions',
    });
  };

  const headerComponents = [
    <StyledFlex
      direction="row"
      key="add-permission-group-header-component-1"
      gap="16px"
      mt="4px"
      flex="1"
      height="30px"
    >
      <StyledFlex position="relative" flex="0 1 356px">
        <SearchBar placeholder="Search Permissions..." onChange={(e) => tableFns?.current?.onSearch(e.target.value)} />
      </StyledFlex>

      <StyledFlex flex="0 1 600px">
        <FilterDropdown
          name="date"
          placeholder="Last Modified or Created Date"
          components={{
            DropdownIndicator: CustomCalendarIndicator,
            Menu: CustomCalendarMenu,
          }}
          onFilterSelect={handleFilterChange}
          filterValue={permGroupsFilters?.date}
          closeMenuOnSelect={false}
          openMenuOnClick
          isSearchable={false}
          minMenuHeight={300}
          maxMenuHeight={300}
          menuPortalTarget={document.body}
          menuPlacement="auto"
          onMenuClose={handleConfirmFilters}
          mb={0}
          maxHeight={32}
        />
      </StyledFlex>
    </StyledFlex>,
  ];

  const enhancedHeaderComponentsBeforeDivider = [
    <PrimarySelect
      key="add-permission-group-header-component-3"
      placeholder="Add Permission Groups..."
      options={permGroupList}
      getOptionLabel={(option) => option.name}
      getOptionValue={(option) => option.id}
      value={addPermGroup}
      onChange={setAddPermGroup}
      withSeparator
      isMulti
      hideSelectedOptions={false}
      withMultiSelect
      closeMenuOnSelect={false}
      isClearable={false}
    />,
    <StyledButton
      secondary
      variant="contained"
      key="add-permission-group-component-5"
      onClick={() => addPermissionGroup({ newPermissionGroups: addPermGroup, data: tableData })}
      disabled={isCreateLoading || !addPermGroup?.length > 0 || isDeleteLoading}
    >
      Add
    </StyledButton>,
  ];

  return (
    <>
      {!!itemToDelete && ( // NOTE: necessary otherwise the browser crashes on close (Chrome, not Firefox)
        <ConfirmationModal
          isOpen={!!itemToDelete}
          onCloseModal={() => setItemToDelete(null)}
          onSuccessClick={() => removePermissionGroup(tableData)}
          successBtnText="Delete"
          alertType="DANGER"
          title="Are You Sure?"
          text={`You are about to remove the "${itemToDelete?.original?.name}" group. All associated users, user groups and permissions will be permanently lost.`}
          modalRef={alertModalRef}
        />
      )}
      <CenterModalFixed
        open={open}
        onClose={onClose}
        modalRef={modalRef}
        maxWidth="1150px"
        title="Add Permission Groups"
      >
        <StyledFlex p="25px">
          <TableHeader
            enhancedHeaderTitle={`Assign permission groups to this ${groupType === 'user' ? 'user' : 'user group'}`}
            filterList={filterListArr(permGroupsFilters.table)}
            onRemove={(z, y) => console.log(z, y)}
            onClearFilters={handleClearFilters}
            headerComponents={headerComponents}
            enhancedHeaderComponentsBeforeDivider={enhancedHeaderComponentsBeforeDivider}
          />
          <CustomTable
            initFilters={PERMISSION_GROUPS_FILTERS_INIT_STATE}
            queryFn={getPermissionGroups}
            queryKey="getPermissionGroups"
            enabled={open && !!id}
            getTableFns={onRefChange}
            columns={PERMISSION_GROUP_COLUMNS({ onDelete: handleOpenDeleteConfirm })}
            tableRef={tableRef}
            tableName="Permission Groups"
            manualSorting
            muiTableBodyProps={EmptyTable}
            meta={{
              onGroupClick: (permissionGroupId) => handlePermissionGroupClick(permissionGroupId),
            }}
          />
        </StyledFlex>
      </CenterModalFixed>
    </>
  );
};

export default AddPermissionGroups;

AddPermissionGroups.propTypes = {
  id: PropTypes.string,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  groupType: PropTypes.oneOf(['user', 'userGroup']),
  patchRequestSelector: PropTypes.func,
};
